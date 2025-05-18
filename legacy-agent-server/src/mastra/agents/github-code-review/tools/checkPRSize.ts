import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

export const checkPRSize = new Tool({
  id: "checkPRSize",
  description: "Check the size of a GitHub Pull Request (number of files changed, additions, deletions).",
  inputSchema: z.object({
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    pull_number: z.number().describe("Pull Request number"),
  }),
  outputSchema: z.object({
    changedFiles: z.number().describe("Number of files changed in the PR"),
    additions: z.number().describe("Total number of added lines"),
    deletions: z.number().describe("Total number of deleted lines"),
    totalChanges: z.number().describe("Total number of changed lines (additions + deletions)"),
  }).nullable().describe("Returns null if the PR details cannot be fetched"),
  execute: async ({ context }) => {
    const { owner, repo, pull_number } = context;

    try {
      // Note: We fetch the standard PR details here, not the diff or patch
      const prResponse = await GithubAPI.rest.pulls.get({
        owner,
        repo,
        pull_number,
      });

      const prData = prResponse.data;

      if (!prData) {
        return null;
      }

      return {
        changedFiles: prData.changed_files ?? 0,
        additions: prData.additions ?? 0,
        deletions: prData.deletions ?? 0,
        totalChanges: (prData.additions ?? 0) + (prData.deletions ?? 0),
      };

    } catch (error: any) {
      console.error("Error fetching PR details for size check (PR #" + pull_number + "):", error);
      if (error.status === 404) {
        console.error("PR or repository not found.");
      }
      return null;
    }
  },
}); 