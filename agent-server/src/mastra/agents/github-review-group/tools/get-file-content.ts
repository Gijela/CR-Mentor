import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  path: z.string().describe("The file path to fetch content for"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
});

const outputSchema = z.union([
  z
    .object({
      ok: z.literal(true),
      content: z.string().describe("The decoded content of the file"),
    })
    .describe("The success object"),
  z
    .object({
      ok: z.literal(false),
      messsage: z
        .string()
        .describe("An optional error message of what went wrong"),
    })
    .describe("The error/failed object"),
]);

export const getFileContent = new Tool({
  id: "fetchFileContent",
  description:
    "Fetch file content from GitHub, decode it, and update the database",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { owner, path, repo } = context;

    try {
      const response = await GithubAPI.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      if (Array.isArray(response.data)) {
        return {
          ok: false as const,
          messsage: `Path ${path} points to a directory, not a file`,
        };
      }

      if (!("content" in response.data)) {
        return {
          ok: false as const,
          messsage: `No content available for file ${path}`,
        };
      }

      let content: string;
      try {
        content = Buffer.from(response.data.content, "base64").toString(
          "utf-8",
        );
      } catch (error) {
        return {
          ok: false as const,
          messsage: error instanceof Error ? error.message : "Unkown error",
        };
      }

      return {
        ok: true as const,
        content,
      };
    } catch (error) {
      console.error("Error fetching file content:", error);
      return {
        ok: false as const,
        messsage: error instanceof Error ? error.message : "Unkown error",
      };
    }
  },
});
