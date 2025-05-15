import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  owner: z.string().describe("The owner of the repository (e.g., 'mastra-tech')."),
  repo: z.string().describe("The name of the repository (e.g., 'mastra')."),
  pull_number: z.number().int().positive().describe("The number of the pull request."),
  path: z.string().describe("The relative path to the file being commented on."),
  line: z.number().int().positive().describe("The line number **in the pull request diff view** that the comment applies to. This is NOT the line number in the source file itself."),
  body: z.string().describe("The text of the review comment."),
});

const outputSchema = z.object({
  success: z.boolean().describe("Whether the comment was posted successfully."),
  comment_url: z.string().optional().describe("The URL of the posted comment, if successful."),
  error: z.string().optional().describe("An error message, if the operation failed."),
});

export const githubFileCommentTool = new Tool({
  id: "github_file_comment",
  description: "Posts a review comment on a specific line in a specific file of a pull request diff. Automatically uses the latest commit of the PR.",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { owner, repo, pull_number, path, line, body } = context;

    let commit_id: string | undefined; // Initialize as undefined

    try {
      // 1. Fetch the latest commit ID for the PR
      try {
        const commitsResponse = await GithubAPI.rest.pulls.listCommits({
          owner,
          repo,
          pull_number,
        });

        if (commitsResponse.status !== 200 || !commitsResponse.data || commitsResponse.data.length === 0) {
          console.error("Failed to fetch commits for PR or PR has no commits", { owner, repo, pull_number, status: commitsResponse.status });
          return {
            success: false,
            error: `Failed to fetch commits for PR #${pull_number} or the PR has no commits. Status: ${commitsResponse.status}`,
          };
        }

        commit_id = commitsResponse.data[commitsResponse.data.length - 1].sha;
        console.info(`Using latest commit ID: ${commit_id} for PR #${pull_number} review comment on path ${path}:${line}`);

      } catch (fetchError) {
        console.error("Error fetching commits for PR:", { owner, repo, pull_number, error: fetchError });
        return {
          success: false,
          error: `Error fetching commits for PR #${pull_number}: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
        };
      }

      // Ensure commit_id was successfully fetched before proceeding
      if (!commit_id) {
        // Error should have been caught and returned above, but double-check.
        console.error("Commit ID is undefined after fetch attempt, cannot proceed.", { owner, repo, pull_number });
        return {
          success: false,
          error: "Failed to determine the latest commit ID for the PR.",
        };
      }

      // 2. Post the review comment using the fetched commit_id
      const response = await GithubAPI.rest.pulls.createReviewComment({
        owner,
        repo,
        pull_number,
        commit_id, // Now guaranteed to be a string here
        path,
        line,
        body,
      });

      if (response.status === 201) {
        console.info(`Successfully posted review comment to PR #${pull_number} on path ${path}:${line} with commit_id ${commit_id}`);
        return {
          success: true,
          comment_url: response.data.html_url,
        };
      } else {
        console.warn("CreateReviewComment returned non-201 status", { status: response.status, owner, repo, pull_number, commit_id, path, line });
        return {
          success: false,
          error: `Failed to post comment. Status: ${response.status}`,
        };
      }
    } catch (error) {
      // Log the commit_id if it was defined, otherwise note it's undefined.
      const logCommitId = typeof commit_id === 'string' ? commit_id : 'undefined (fetch error likely or post-fetch error)';
      console.error("Error posting review comment:", { owner, repo, pull_number, commit_id: logCommitId, path, line, error });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred while posting review comment.",
      };
    }
  },
});
