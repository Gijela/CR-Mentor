import { GithubAPI } from "../../../lib/github";
import { Tool, ToolExecutionContext } from "@mastra/core/tools";
import { z } from "zod";

// Input schema remains the same
const inputSchema = z.object({
  owner: z.string().describe("Repository owner (e.g., 'mastra-ai')"),
  repo: z.string().describe("Repository name (e.g., 'mastra')"),
  pull_number: z.number().describe("Pull Request number"),
  filePath: z.string().describe("The path of the file to get the patch for"),
});

// Output schema remains the same
const outputSchema = z.string().nullable();

type ToolOutput = z.infer<typeof outputSchema>;

export const getFilePatch = new Tool({
  id: "getFilePatch",
  // Reverted description back to reflecting the listFiles method
  description: "Get the patch (diff) for a specific file within a GitHub Pull Request by listing PR files.",
  inputSchema: inputSchema,
  outputSchema: outputSchema,
  execute: async ({ context }: ToolExecutionContext<typeof inputSchema>): Promise<ToolOutput> => {
    const { owner, repo, pull_number, filePath } = context;

    try {
      // Use pulls.listFiles API directly
      const response = await GithubAPI.rest.pulls.listFiles({
        owner,
        repo,
        pull_number,
        // Optional: Consider pagination if necessary for very large PRs
        // per_page: 100,
      });

      if (response.status !== 200) {
        console.error(`Error fetching file list for PR #${pull_number}: GitHub API returned status ${response.status}`);
        return null;
      }

      // Find the specific file in the list
      const targetFile = response.data.find(file => file.filename === filePath);
      console.log("🚀 ~ 22xxxxsad: ~ targetFile:", targetFile)

      if (!targetFile) {
        // File path not found in the list of changed files for this PR
        console.log(`File '${filePath}' not found in the changed files list for PR #${pull_number}.`);
        return null;
      }

      // Return the patch content for the file, or null if it doesn't exist
      return targetFile.patch ?? null;

    } catch (error: any) {
      // Updated error message to reflect the method used
      console.error(`Error fetching patch for ${filePath} in PR #${pull_number} using listFiles method:`, error);
      if (error.status === 404) {
        console.error("PR or repository not found.");
      } else if (error.response) {
         console.error("GitHub API Error details:", error.response.data);
      }
      return null; // Return null in case of any error
    }
  },
});
