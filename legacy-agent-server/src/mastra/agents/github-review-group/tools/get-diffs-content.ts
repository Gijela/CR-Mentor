import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

const outputSchema = z.object({
  diff_files_content: z.array(z.object({
    filename: z.string(),
    status: z.enum(['added', 'modified', 'removed', 'renamed']),
    changes: z.number().int(),
    additions: z.number().int(),
    deletions: z.number().int(),
    patch: z.string().optional().describe("Raw patch text provided by GitHub"),
  })).describe('The diff content of the changed files in the pull request.'),
})

export const getDiffsContent = new Tool({
  id: "getDiffsContent",
  description: "Fetches the diff content of the changed files in the pull request.",
  inputSchema: z.object({
    owner: z.string().describe("The owner of the repository (e.g., 'facebook')."),
    repo: z.string().describe("The name of the repository (e.g., 'react')."),
    pull_number: z.number().int().positive().describe("The number of the pull request."),
    changed_file_paths: z.array(z.string()).describe("The path of the file to get the diff content."),
  }),
  outputSchema,
  execute: async ({ context }) => {
    const { owner, repo, pull_number, changed_file_paths } = context;

    try {
      const filesResponse = await GithubAPI.rest.pulls.listFiles({ owner, repo, pull_number, per_page: 1000 });
      const files = filesResponse.data.map(f => ({
        filename: f.filename,
        status: f.status as 'added' | 'modified' | 'removed' | 'renamed',
        changes: f.changes,
        additions: f.additions,
        deletions: f.deletions,
        patch: f.patch,
      }));

      const filteredFiles = files.filter(f => changed_file_paths.includes(f.filename));

      return {
        diff_files_content: filteredFiles,
      };
    } catch (error) {
      console.error(error);
      return {
        diff_files_content: [],
      };
    }
  },
});

