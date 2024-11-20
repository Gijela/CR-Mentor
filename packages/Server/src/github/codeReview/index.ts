import Router from "koa-router";
import { get, post } from "../../../utils/request";
import { createToken } from "../utils/createToken";
import dotenv from "dotenv";
import { AxiosHeaders } from "axios";
import { analyzeCodeChange } from "../utils/analyzeCodeChange";
import { MessageContent } from "langchain/schema";

dotenv.config();

const router = new Router();

interface CompareResponse {
  files: {
    status: string;
    patch: string;
    filename: string;
    sha: string;
  }[];
  commits: { sha: string }[];
}

interface ReviewInput {
  user_name: string;
  repo_name: string;
  pr_base: string;
  pr_head: string;
  pr_idx: string;
  github_id: string;
  repo_fullName: string;
  title: string;
  description: string;
}

const inputDify: ReviewInput = {
  user_name: "Gijela",
  repo_name: "Auth-Github-App",
  pr_base: "Gijela:feat/cr",
  pr_head: "Gijela:main",
  pr_idx: "3",
  github_id: "MDQ6VXNlcjgyMDcxMjA5",
  repo_fullName: "Gijela/Auth-Github-App",

  // todo 想办法获取到 title 和 description
  title: "feat: 代码调整",
  description: "代码调整",
};

// 定义类型
interface GithubHeaders {
  Authorization: string;
  "X-GitHub-Api-Version": string;
  Accept: string;
}

// 工具函数：创建 GitHub API 请求头
const createGithubHeaders = (token: string): GithubHeaders => ({
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  Accept: "application/vnd.github+json",
});

// 添加获取文件sha的辅助函数
const getFileRef = (file: any): string => {
  return file.sha || "unknown";
};

router.post("/github/code-review", async (ctx) => {
  try {
    // 获取所有文件的代码变更
    const { files: changedFiles, commits } = await get<CompareResponse>(
      `https://api.github.com/repos/${inputDify.user_name}/${inputDify.repo_name}/compare/${inputDify.pr_base}...${inputDify.pr_head}`
    );

    // 合并所有文件的 diff 内容
    const combinedDiff = changedFiles
      .filter((file) => file.status !== "renamed")
      .map((file) => `${file.filename}(sha: ${file.sha}):\n${file.patch}`)
      .join("\n\n");

    try {
      // 对整体进行代码审查
      const reviewRes: MessageContent = await analyzeCodeChange(
        inputDify.repo_name,
        inputDify.pr_idx,
        inputDify.title,
        inputDify.description,
        combinedDiff
      );

      const token = await createToken(inputDify.user_name);
      const headers = createGithubHeaders(token) as unknown as AxiosHeaders;

      // 创建 PR 整体评论
      await post(
        `https://api.github.com/repos/${inputDify.repo_fullName}/issues/${inputDify.pr_idx}/comments`,
        { body: reviewRes },
        { headers }
      );

      // 创建具体文件评论
      // if (reviewRes.fileComments) {
      //   for (const comment of reviewRes.fileComments) {
      //     const comment_params = {
      //       body: comment.content,
      //       commit_id: commits[commits.length - 1].sha,
      //       path: comment.filename,
      //       position: comment.position,
      //     };
      //     await post(
      //       `https://api.github.com/repos/${inputDify.repo_fullName}/pulls/${inputDify.pr_idx}/comments`,
      //       comment_params,
      //       { headers }
      //     );
      //   }
      // }

      ctx.body = { success: true };
      ctx.status = 200;
    } catch (error) {
      console.error("代码审查过程出错:", error);
      throw error;
    }
  } catch (error) {
    console.error("API 调用过程出错:", error);
    ctx.body = {
      success: false,
      message: "代码审查调用失败",
      error,
    };
    ctx.status = 500;
  }
});

export default router;
