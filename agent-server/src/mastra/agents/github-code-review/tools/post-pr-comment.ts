import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

// Input schema: Details needed to post a comment
const inputSchema = z.object({
    owner: z.string().describe("The owner of the repository."),
    repo: z.string().describe("The name of the repository."),
    pull_number: z.number().int().positive().describe("The number of the pull request to comment on."),
    body: z.string().min(1).describe("The text content of the comment."),
    // Optional fields for line-specific comments (review comments)
    commit_id: z.string().optional().describe("The SHA of the commit to comment on (required for review comments)."),
    path: z.string().optional().describe("The relative path of the file to comment on (required for review comments)."),
    line: z.number().int().positive().optional().describe("The line number in the file's diff to comment on (required for review comments)."),
    // Optional: side ('LEFT' or 'RIGHT') for review comments, defaults typically work
});

// Output schema: Status of the comment posting operation
const outputSchema = z.object({
    ok: z.literal(true),
    commentUrl: z.string().url().optional().describe("URL of the newly created comment."),
    message: z.string().optional().describe("Success message.")
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message detailing why the comment could not be posted."),
}));

export const postPrComment = new Tool({
    id: "postPrComment",
    description: "Posts a comment to a GitHub Pull Request. Can post a general comment or a comment on a specific line of code if path, line, and commit_id are provided.",
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
        const { owner, repo, pull_number, body, commit_id, path, line } = context;

        try {
            let response;
            // Check if it's a line-specific review comment or a general issue comment
            if (commit_id && path && line) {
                // Post a review comment on a specific line
                response = await GithubAPI.rest.pulls.createReviewComment({
                    owner,
                    repo,
                    pull_number,
                    body,
                    commit_id,
                    path,
                    line,
                    // side: // Optional: 'LEFT' or 'RIGHT'
                    // start_line, start_side: // For multi-line comments
                });
                 console.log(`Posted review comment to ${owner}/${repo}#${pull_number} on ${path}:${line}`);
            } else {
                // Post a general issue comment on the PR
                response = await GithubAPI.rest.issues.createComment({
                    owner,
                    repo,
                    issue_number: pull_number, // Use issue_number for general comments
                    body,
                });
                 console.log(`Posted general comment to ${owner}/${repo}#${pull_number}`);
            }

            return {
                ok: true as const,
                commentUrl: response.data.html_url,
                message: "Comment posted successfully."
            };

        } catch (error: any) {
            console.error(`Error posting comment to PR #${pull_number} in ${owner}/${repo}:`, error);
            let message = "Failed to post comment.";
             if (error.status === 404) {
                message = `Pull Request #${pull_number} or specified file/commit not found in ${owner}/${repo}.`;
            } else if (error.status === 403 || error.status === 401) {
                message = `Permission denied posting comment to PR #${pull_number}. Check GITHUB_TOKEN permissions (needs issues:write or pulls:write).`;
            } else if (error.status === 422 && commit_id && path && line) {
                 message = `Failed to post review comment. Ensure commit_id, path, and line are valid for this PR diff. Error: ${error.message}`;
            } else if (error instanceof Error) {
                message = error.message;
            }
            return {
                ok: false as const,
                message: message,
            };
        }
    },
}); 