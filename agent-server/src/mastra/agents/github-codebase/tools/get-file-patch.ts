import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";
import { parse, Diff, Hunk, Line } from 'what-the-diff'; // Using a library for robust diff parsing

export const getFilePatch = new Tool({
  id: "getFilePatch",
  description: "Get the patch (diff) for a specific file within a GitHub Pull Request.",
  inputSchema: z.object({
    owner: z.string().describe("Repository owner (e.g., 'facebook')"),
    repo: z.string().describe("Repository name (e.g., 'react')"),
    pull_number: z.number().describe("Pull Request number"),
    filePath: z.string().describe("The path of the file to get the patch for"),
  }),
  // Returns the patch as a string, or null if the file was not changed or not found in the diff.
  outputSchema: z.string().nullable(),
  execute: async ({ context }) => {
    const { owner, repo, pull_number, filePath } = context;

    try {
      // Fetch the diff content for the entire PR
      // We use the 'diff' media type for this
      const diffResponse = await GithubAPI.rest.pulls.get({
        owner,
        repo,
        pull_number,
        mediaType: {
          format: "diff",
        },
      });

      // The diff content is in the data property (might need type assertion)
      const fullDiff = diffResponse.data as unknown as string;

      // Parse the full diff
      const diffs: Diff[] = parse(fullDiff);

      // Find the specific file's diff
      const fileDiff = diffs.find((d: Diff) => d.newPath === filePath || d.oldPath === filePath);

      if (!fileDiff) {
        // File not found in the diff (likely unchanged or binary)
        return null;
      }

      // Reconstruct the patch string for the specific file
      // Simpler reconstruction focusing on standard diff format elements
      let patchHeader = `diff --git a/${fileDiff.oldPath ?? '/dev/null'} b/${fileDiff.newPath ?? '/dev/null'}\n`;
      if (fileDiff.isNew) patchHeader += `new file mode ${fileDiff.newMode}\n`;
      if (fileDiff.isDeleted) patchHeader += `deleted file mode ${fileDiff.oldMode}\n`;
      if (fileDiff.isRename) patchHeader += `rename from ${fileDiff.oldPath}\nrename to ${fileDiff.newPath}\n`;
      if (fileDiff.index) patchHeader += `index ${fileDiff.index.join('..')}${fileDiff.newMode ? ' ' + fileDiff.newMode : ''}\n`;
      patchHeader += `--- a/${fileDiff.oldPath ?? '/dev/null'}\n`;
      patchHeader += `+++ b/${fileDiff.newPath ?? '/dev/null'}\n`;

      // Process hunks - assume hunk.header and line.content include necessary line structure
      const hunkContent = fileDiff.hunks.map((hunk: Hunk) => {
        // Add newline after header if not present? what-the-diff usually includes it.
        const header = hunk.header;
        const lines = hunk.lines.map((line: Line) => line.content).join('\n'); // Join lines with newline
        return header + '\n' + lines; // Combine header and lines
      }).join('\n'); // Join hunks with newline

      const finalPatch = patchHeader + hunkContent;

      return finalPatch.trim(); // Return the reconstructed patch string

    } catch (error: any) {
      // Keep the simplified console.error
      console.error("Error fetching patch for " + filePath + " in PR #" + pull_number + ":", error);
      if (error.status === 404) {
        console.error("PR or repository not found.");
      }
      return null;
    }
  },
});

// Note: This implementation requires the 'what-the-diff' library.
// Ensure it's added to the project's dependencies: npm install what-the-diff
// Alternatively, implement custom diff parsing if preferred. 