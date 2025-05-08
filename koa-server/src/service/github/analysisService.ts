import { GithubAPI } from "../../mastra/lib/github"; // Assuming GithubAPI is correctly set up
import { Octokit } from '@octokit/rest'; // 直接导入Octokit

// 添加调试日志
console.log('导入的GithubAPI:', typeof GithubAPI, GithubAPI ? 'not null' : 'null or undefined');

// 创建备用的Octokit实例
const createOctokitInstance = () => {
  // 尝试使用全局配置的GitHub Token
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('警告: 环境变量GITHUB_TOKEN未设置，可能导致API调用失败或受到限制');
  }
  console.log('创建新的Octokit实例，Token存在:', !!token);
  return new Octokit({
    auth: token,
  });
};

// Define interfaces for data structures as per the development plan
interface FileChange {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed' | string;
  patch: string | null;
}

interface CommitDetail {
  sha: string;
  message: string;
  date: string;
  files: FileChange[];
}

interface RepositoryAnalysis {
  owner: string;
  repoName: string;
  branchName: string;
  commits: CommitDetail[];
}

interface AnalyzeUserActivityParams {
  repositories: { owner: string; repoName: string; branchName: string }[];
  timeRange: { since: string; until: string };
  targetUsername: string;
}

/**
 * Fetches and analyzes commit history for specified repositories within a time range for a target user.
 * For the MVP, this will fetch data and keep it in memory.
 */
export const fetchAndAnalyzeCommits = async (
  params: AnalyzeUserActivityParams
): Promise<RepositoryAnalysis[]> => {
  const { repositories, timeRange, targetUsername } = params;

  // 使用导入的GithubAPI或创建新的实例
  let octokitInstance;
  try {
    // 先尝试使用导入的GithubAPI
    if (GithubAPI && typeof GithubAPI === 'object' && GithubAPI.repos && typeof GithubAPI.repos.listCommits === 'function') {
      console.log('[Service] 使用全局配置的GithubAPI实例');
      octokitInstance = GithubAPI;
    } else {
      // 如果GithubAPI不可用或结构不对，使用新创建的实例
      console.log('[Service] 全局GithubAPI实例不可用，创建新实例');
      octokitInstance = createOctokitInstance();
    }
  } catch (error) {
    console.error('[Service] 初始化Octokit实例时出错:', error);
    octokitInstance = createOctokitInstance();
  }

  // 验证octokit实例
  if (!octokitInstance || !octokitInstance.repos || typeof octokitInstance.repos.listCommits !== 'function') {
    console.error('[Service] 严重错误: Octokit实例未能正确初始化或不包含预期方法');
    return []; // 提前返回空数组，避免后续错误
  }

  const allAnalysisResults: RepositoryAnalysis[] = [];

  console.log(`[Service] Starting fetchAndAnalyzeCommits for user: ${targetUsername}, timeRange: ${timeRange.since} to ${timeRange.until}`);

  for (const repoConfig of repositories) {
    const { owner, repoName, branchName } = repoConfig;
    console.log(`[Service] Processing repository: ${owner}/${repoName}, branch: ${branchName}`);
    const commitsDataForCurrentRepo: CommitDetail[] = [];
    let page = 1;
    const perPage = 100; // Number of commits to fetch per page
    let hasMoreCommits = true;

    while (hasMoreCommits) {
      try {
        console.log(`[Service] Fetching commits for ${owner}/${repoName}, page: ${page} (Author filter TEMPORARILY REMOVED for debugging)`);

        // 使用try-catch包装API调用
        try {
          const commitsResponse = await octokitInstance.repos.listCommits({
            owner: owner,
            repo: repoName,
            sha: branchName,
            // author: targetUsername, // Temporarily commented out for debugging
            since: timeRange.since,
            until: timeRange.until,
            per_page: perPage,
            page: page,
          });

          if (commitsResponse.data.length === 0) {
            hasMoreCommits = false;
            console.log(`[Service] No more commits found for ${owner}/${repoName} on page ${page} (Author filter was off).`);
            break;
          }

          console.log(`[Service] Found ${commitsResponse.data.length} commits on page ${page} for ${owner}/${repoName} (Author filter was off).`);

          for (const commit of commitsResponse.data) {
            // Log the author information from the commit to help diagnose
            console.log(`[Service] Commit SHA: ${commit.sha.substring(0, 7)}, Author Login: ${commit.author?.login}, Committer Login: ${commit.committer?.login}`);

            // Only process commits if they match the targetUsername after fetching (manual filter for now)
            // This helps to see all commits fetched and then identify if the targetUsername would have matched
            if (targetUsername &&
              (commit.author?.login === undefined ||
                commit.author.login.toLowerCase() !== targetUsername.toLowerCase())) {
              console.log(`[Service] Skipping commit by ${commit.author?.login}, target was ${targetUsername} (大小写不敏感比较)`);
              continue; // Skip if author doesn't match, mimics the original filter for this debugging step
            }

            console.log(`[Service] Fetching details for commit: ${commit.sha.substring(0, 7)} in ${owner}/${repoName}`);
            try {
              const commitDetailResponse = await octokitInstance.repos.getCommit({
                owner: owner,
                repo: repoName,
                ref: commit.sha,
              });

              const fileChanges: FileChange[] = commitDetailResponse.data.files?.map(file => ({
                filename: file.filename!,
                status: file.status! as FileChange['status'],
                patch: file.patch || null,
              })) || [];

              commitsDataForCurrentRepo.push({
                sha: commit.sha,
                message: commit.commit.message,
                date: commit.commit.author?.date || new Date().toISOString(), // Handle potential undefined date
                files: fileChanges,
              });
            } catch (commitDetailError: any) {
              console.error(`[Service] Error fetching details for commit ${commit.sha} in ${owner}/${repoName}:`, commitDetailError.message);
              // Decide if we should skip this commit or stop entirely
              // For now, we log and skip this commit
            }
          }
          page++;
        } catch (apiError: any) {
          console.error(`[Service] API调用错误 (listCommits): ${apiError.message}`);
          if (apiError.status) {
            console.error(`[Service] API状态码: ${apiError.status}`);
          }
          throw apiError; // 重新抛出以便外层catch捕获
        }
      } catch (listCommitsError: any) {
        console.error(`[Service] Error fetching commits for ${owner}/${repoName}, page ${page}:`, listCommitsError.message);
        // 输出更多错误详情用于调试
        if (listCommitsError.status) {
          console.error(`[Service] Error status: ${listCommitsError.status}`);
        }
        if (listCommitsError.response) {
          console.error(`[Service] Error response:`, listCommitsError.response.data);
        }
        // If listing commits fails for a page, we might want to stop for this repo
        hasMoreCommits = false;
      }
    }

    if (commitsDataForCurrentRepo.length > 0) {
      allAnalysisResults.push({
        owner: owner,
        repoName: repoName,
        branchName: branchName,
        commits: commitsDataForCurrentRepo,
      });
      console.log(`[Service] Added ${commitsDataForCurrentRepo.length} commits for ${owner}/${repoName} to results.`);
    }
  }

  console.log("[Service] Finished fetchAndAnalyzeCommits. Total repositories analyzed:", allAnalysisResults.length);
  return allAnalysisResults;
}; 