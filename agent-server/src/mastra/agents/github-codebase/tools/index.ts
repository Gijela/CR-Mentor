// 获取文件内容
import { getFileContent } from "./get-file-content";

// 获取所有文件路径
import { getFilePaths } from "./get-file-paths";

// 获取指定文件的 Patch
import { getFilePatch } from "./get-file-patch";

// 获取仓库所有提交
import { getRepositoryCommits } from "./get-repo-commits";

// 获取仓库所有 Issues
import { getRepositoryIssues } from "./get-repo-issues";

// 获取仓库所有 Pull Requests
import { getRepositoryPullRequests } from "./get-repo-pull-requests";

// 获取仓库总体 Stars
import { getRepositoryStars } from "./get-repo-stars";

// 封装所有工具为单个对象统一导出
export const codebaseTools = {
  getFileContent,
  getFilePaths,
  getFilePatch,
  getRepositoryCommits,
  getRepositoryIssues,
  getRepositoryPullRequests,
  getRepositoryStars
};