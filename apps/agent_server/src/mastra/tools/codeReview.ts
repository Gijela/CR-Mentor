import { createTool } from "@mastra/core"
import { z } from "zod"

// 发布 PR 总结
export const createPrSummaryTool = createTool({
  id: "create_pr_summary",
  description: "使用这个工具来在 PR 上发布总结",
  inputSchema: z.object({
    githubName: z.string().describe("github 用户名"),
    commentUrl: z.string().describe("使用 comments_url 来发布总结"),
    summary: z.string().describe("要发布的总结内容"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.any().optional(),
  }),
  execute: async ({ context }) => {
    try {
      const { githubName, commentUrl, summary } = context
      // 获取 token
      const tokenResponse = await fetch(`${process.env.KOA_SERVER_HOST}/github/createToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubName }),
      })
      const token = (await tokenResponse.json())?.token || ""

      // 发布评论
      const response = await fetch(
        commentUrl,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: summary }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to create PR comment")
      }

      const result = await response.json()

      return { success: true, data: result }
    } catch (error) {
      console.error("🚀 ~ summary: ~ error:", error)
      return { success: false, error }
    }
  },
})

// 对单个文件发布评论
export const createReviewCommentTool = createTool({
  id: "create_review_comment",
  description: "使用这个工具来发布单个文件的行级评论",
  inputSchema: z.object({
    githubName: z.string().describe("github 用户名"),
    reviewCommentsUrl: z.string().describe("使用 review_comments_url 来发布评论"),
    comment: z.string().describe("要发布的评论内容"),
    lastCommitSha: z.string().describe("最后一个 commit 的 sha"),
    file_path: z.string().describe("要评论的文件路径"),
    patch: z.string().describe("文件的 patch 内容"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.any().optional(),
  }),
  execute: async ({ context }) => {
    const { githubName, reviewCommentsUrl, lastCommitSha, file_path, comment, patch } = context

    try {
      // 获取 token
      const tokenResponse = await fetch(`${process.env.KOA_SERVER_HOST}/github/createToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubName }),
      })
      const token = (await tokenResponse.json())?.token || ""

      const commentResponse = await fetch(
        reviewCommentsUrl,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: comment,
            commit_id: lastCommitSha,
            path: file_path,
            position: patch ? patch.split("\n").length - 1 : 1,
          }),
        },
      )

      if (!commentResponse.ok) {
        const errorData = await commentResponse.json()
        return { success: false, error: errorData }
      }

      const result = await commentResponse.json()

      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  },

})
