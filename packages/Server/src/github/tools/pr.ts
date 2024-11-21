import { z } from "zod";
import axios, { AxiosHeaders } from "axios";
import { tool } from "@langchain/core/tools";
import { createToken } from "../utils/createToken";
import { createGithubHeaders } from "../codeReview";

const createPRSummary = tool(
  async (input) => {
    console.log("🚀 ~ input =============:", input)
    try {
      const { user_name, repo_name, pull_number, summary } = input;

      const commentBody = `
        ## PR 总结

        ${summary.walkthrough}
        
        ## 变更详情

        ${summary.changes}
      `;

      const token = await createToken(user_name);

      await axios.post(
        `https://api.github.com/repos/${repo_name}/issues/${pull_number}/comments`,
        { body: commentBody },
        { headers: createGithubHeaders(token) as unknown as AxiosHeaders }
      );

      return "PR 总结已创建";
    } catch (error: any) {
      return `创建 PR 总结失败: ${error.message}`;
    }
  },
  {
    name: "create_pr_summary",
    description: "当需要在 GitHub PR 上创建总结评论时使用此工具。",
    schema: z.object({
      user_name: z.string().describe("GitHub 用户名"),
      repo_name: z.string().describe("仓库名称"),
      pull_number: z.string().describe("PR 编号"),
      summary: z.object({
        walkthrough: z.string().describe("PR 的整体介绍"),
        changes: z.string().describe("具体变更详情")
      })
    })
  }
);

const createReviewComment = tool(
  async (input) => {
    const { filename, content } = input;
    return JSON.stringify({ filename, content });
  },
  {
    name: "create_review_comment",
    description: "用于在特定文件上添加评论的工具",
    schema: z.object({
      filename: z.string().describe("要评论的文件名"),
      content: z.string().describe("评论内容")
    })
  }
);

export { createPRSummary, createReviewComment };