import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { model } from "@/lib/model";
import { CODE_REVIEWER_PROMPT } from "@/lib/prompt/github/pull_request";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

/* code_review tool */
export const createCodeReviewTool = (prContent: string) => {
  return new DynamicStructuredTool({
    name: "code_review",
    description: "使用这个工具来执行代码评审",
    schema: z.object({
      content: z.string().describe("要评审的PR内容"),
    }),
    func: async () => {
      const response = await model.call([
        new SystemMessage(CODE_REVIEWER_PROMPT),
        new HumanMessage(prContent)
      ]);
      return response.content;
    }
  });
};


/* create_pr_summary tool */
export const createPrSummaryTool = (token: string, commentUrl: string) => {
  return new DynamicStructuredTool({
    name: "create_pr_summary",
    description: "使用这个工具来在 PR 上发布总结",
    schema: z.object({
      summary: z.string().describe("要发布的总结内容"),
    }),
    func: async ({ summary }) => {
      const response = await fetch(
        commentUrl,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: summary })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create PR comment');
      }

      return "评论发布成功";
    }
  });
};

/* special_file_comment tool */
export const createSpecialFileCommentTool = (
  token: string,
  commentUrl: string,
  files: {
    filename: string;
    patch?: string;
  }[],
  commits: { sha: string; }[],
) => {
  return new DynamicStructuredTool({
    name: "special_file_comment",
    description: "使用这个工具来在 PR 上对文件进行行级评论",
    schema: z.object({
      file_path: z.string().describe("要评论的文件路径"),
      comment: z.string().describe("要发布的评论内容"),
    }),
    func: async ({ file_path, comment }) => {
      // 1. 找到对应的文件信息
      const fileInfo = files.find(file => file.filename === file_path);
      if (!fileInfo) {
        throw new Error(`File ${file_path} not found in the PR`);
      }

      // 2. 发送评论请求
      const commentResponse = await fetch(
        commentUrl,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            body: comment,
            commit_id: commits[commits.length - 1].sha, // 使用最后一个 commit 的 sha, 最新的 commit 代码肯定包含所有文件
            path: file_path,
            position: fileInfo.patch ? fileInfo.patch.split('\n').length - 1 : 1,
          })
        }
      );

      if (!commentResponse.ok) {
        const errorData = await commentResponse.json();
        throw new Error(`Failed to create file comment: ${JSON.stringify(errorData)}`);
      }

      return "评论发布成功";
    }
  });
};