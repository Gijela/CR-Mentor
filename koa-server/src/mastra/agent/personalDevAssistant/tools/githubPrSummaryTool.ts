import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  owner: z.string().describe("The owner of the repository (e.g., 'mastra-tech')."),
  repo: z.string().describe("The name of the repository (e.g., 'mastra')."),
  // PRs are issues, so we use issue_number which is the same as pull_number
  issue_number: z.number().int().positive().describe("The number of the pull request (same as issue number)."),
  body: z.string().describe("The text of the summary comment (Markdown format recommended)."),
});

const outputSchema = z.object({
  success: z.boolean().describe("Whether the summary comment was posted successfully."),
  comment_url: z.string().optional().describe("The URL of the posted comment, if successful."),
  error: z.string().optional().describe("An error message, if the operation failed."),
});

export const githubPrSummaryTool = new Tool({
  id: "github_pr_summary",
  description: "Posts a general summary comment on the pull request.",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { owner, repo, issue_number, body } = context;

    try {
      const response = await GithubAPI.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body,
      });

      if (response.status === 201) {
        return {
          success: true,
          comment_url: response.data.html_url,
        };
      } else {
        // Although createComment typically throws on non-201, handle defensively
        return {
          success: false,
          error: `Failed to post summary comment. Status: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("Error posting PR summary comment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred while posting PR summary comment.",
      };
    }
  },
}); 