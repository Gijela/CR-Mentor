import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
  state: z
    .enum(["open", "closed", "all"])
    .default("all")
    .describe("The state of the pull request"),
  page: z
    .number()
    .int()
    .default(1)
    .describe("The page number of the results to fetch."),
  perPage: z
    .number()
    .int()
    .max(100)
    .default(30)
    .describe("The number of results per page (max 100)."),
});

const outputSchema = z.union([
  z.array(
    z.object({
      body: z.string().nullable().describe("The body content of the pr"),
      number: z.number().int().describe("The pull request number"),
      state: z
        .enum(["open", "closed"])
        .describe("The state of the pull request"),
      title: z.string().describe("The title of the pull request"),
      url: z.string().url().describe("The url to the pull request"),
      user: z
        .object({
          avatarUrl: z
            .string()
            .url()
            .nullable()
            .describe("The url of the user"),
          url: z.string().url().nullable().describe("The url to the user"),
          username: z.string().nullable().describe("The github user name"),
        })
        .describe("The user details"),
    }),
  ),
  z.object({
    ok: z.literal(false),
    message: z.string().describe("Error message"),
  }),
]);

export const getRepositoryPullRequests = new Tool({
  id: "getRepositoryPullRequests",
  description: "Get pull requests for a repository",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { owner, page, perPage: per_page, repo, state } = context;

    try {
      const response = await GithubAPI.rest.pulls.list({
        owner,
        repo,
        state,
        page,
        per_page,
      });

      const pullRequests = response.data.map((r) => ({
        body: r.body ?? null,
        number: r.number,
        state: r.state as "open" | "closed",
        title: r.title,
        url: r.html_url,
        user: {
          url: r.user?.html_url ?? null,
          avatarUrl: r.user?.avatar_url ?? null,
          username: r.user?.login ?? null,
        },
      }));

      return pullRequests;
    } catch (error) {
      console.error("Error fetching pull requests:", error);
      return {
        ok: false as const,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch pull requests",
      };
    }
  },
});
