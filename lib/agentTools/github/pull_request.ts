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
