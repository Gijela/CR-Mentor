import { createTool } from "@mastra/core"
import { z } from "zod"

/* create_pr_summary tool */
export const createPrSummaryTool = createTool({
  id: "create_pr_summary",
  description: "使用这个工具来在 PR 上发布总结",
  inputSchema: z.object({
    githubName: z.string().describe("github 用户名"),
    commentUrl: z.string().describe("评论的 url"),
    summary: z.string().describe("要发布的总结内容"),
  }),
  outputSchema: z.string(),
  execute: async ({ context }) => {
    console.info("🚀 ~ summary: ~ context:", context)
    // const { githubName, commentUrl, summary } = context
    // const tokenResponse = await fetch(`https://api.github.com/users/${githubName}/tokens`)
    // const token = (await tokenResponse.json()).token
    // const response = await fetch(
    //   commentUrl,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${context.token}`,
    //       'Accept': 'application/vnd.github.v3+json',
    //       'X-GitHub-Api-Version': '2022-11-28',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ body: context.summary })
    //   }
    // );

    // if (!response.ok) {
    //   throw new Error('Failed to create PR comment');
    // }

    return "评论发布成功"
  },
})

/* batch_file_comments tool */
export const createReviewCommentTool = createTool({
  id: "batch_file_comments",
  description: "使用这个工具来批量发布多个文件的行级评论",
  inputSchema: z.object({
    comments: z.array(z.object({
      file_path: z.string().describe("要评论的文件路径"),
      comment: z.string().describe("要发布的评论内容"),
    })).describe("评论数组"),
  }),
  outputSchema: z.string(),
  execute: async ({ context }) => {
    console.info("🚀 ~ batch: ~ context:", context)
    // const results = await Promise.all(
    //   context.comments.map(async ({ file_path, comment }) => {
    //     const fileInfo = context.files.find(file => file.filename === file_path);
    //     if (!fileInfo) {
    //       return `文件 ${file_path} 未在PR中找到`;
    //     }

    //     try {
    //       const commentResponse = await fetch(
    //         context.commentUrl,
    //         {
    //           method: 'POST',
    //           headers: {
    //             'Authorization': `Bearer ${context.token}`,
    //             'Accept': 'application/vnd.github.v3+json',
    //             'X-GitHub-Api-Version': '2022-11-28',
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({
    //             body: comment,
    //             commit_id: context.commits[context.commits.length - 1].sha,
    //             path: file_path,
    //             position: fileInfo.patch ? fileInfo.patch.split('\n').length - 1 : 1,
    //           })
    //         }
    //       );

    //       if (!commentResponse.ok) {
    //         const errorData = await commentResponse.json();
    //         return `评论失败 (${file_path}): ${JSON.stringify(errorData)}`;
    //       }

    //       return `文件 ${file_path} 评论发布成功`;
    //     } catch (error) {
    //       return `评论失败 (${file_path}): ${error.message}`;
    //     }
    //   })
    // );

    // return results.join('\n');
    return "评论发布成功"
  },
})
