import { GithubAPI } from "../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

export const getFilePaths = new Tool({
  id: "getFilePaths",
  description: "Get all file paths from the GitHub repository",
  inputSchema: z.object({
    owner: z
      .string()
      .describe("The owner of the repository. As facebook in facebook/react"),
    repo: z
      .string()
      .describe("The name of the repository. As react in facebook/react"),
    tree_sha: z
      .string()
      .describe("SHA or branch to start listing commits from")
      .default("main"),
  }),
  outputSchema: z.array(z.string()),
  execute: async ({ context }) => {
    const { owner, repo, tree_sha } = context;

    const getTreeResponse = await GithubAPI.rest.git.getTree({
      owner,
      repo,
      recursive: "true",
      tree_sha,
    });

    return getTreeResponse.data.tree
      .map((file) => file.path)
      .filter(Boolean) as string[];
  },
});
