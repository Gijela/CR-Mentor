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
    .describe("The state of the issue"),
  labels: z
    .array(z.string())
    .optional()
    .describe("List of label names to filter issues by"),
  assignee: z
    .string()
    .optional()
    .describe("GitHub username of the assignee to filter issues by"),
  creator: z
    .string()
    .optional()
    .describe("GitHub username of the issue creator to filter by"),
  page: z
    .number()
    .int()
    .default(1)
    .describe("The page number of the results to fetch"),
  perPage: z
    .number()
    .int()
    .max(100)
    .default(30)
    .describe("The number of results per page (max 100)"),
});

const outputSchema = z.union([
  z.array(
    z.object({
      body: z.string().nullable().describe("The body content of the issue"),
      number: z.number().int().describe("The issue number"),
      state: z.enum(["open", "closed"]).describe("The state of the issue"),
      title: z.string().describe("The title of the issue"),
      url: z.string().url().describe("The url to the issue"),
      labels: z
        .array(
          z.object({
            name: z.string().describe("The name of the label"),
            color: z.string().describe("The color of the label"),
          }),
        )
        .describe("The labels attached to the issue"),
      assignees: z
        .array(
          z.object({
            avatarUrl: z
              .string()
              .url()
              .nullable()
              .describe("The url of the assignee's avatar"),
            url: z
              .string()
              .url()
              .nullable()
              .describe("The url to the assignee's profile"),
            username: z
              .string()
              .nullable()
              .describe("The github username of the assignee"),
          }),
        )
        .describe("The users assigned to the issue"),
      user: z
        .object({
          avatarUrl: z
            .string()
            .url()
            .nullable()
            .describe("The url of the user's avatar"),
          url: z
            .string()
            .url()
            .nullable()
            .describe("The url to the user's profile"),
          username: z.string().nullable().describe("The github username"),
        })
        .describe("The user details of the issue creator"),
      createdAt: z.string().describe("The creation date of the issue"),
      updatedAt: z.string().describe("The last update date of the issue"),
      closedAt: z
        .string()
        .nullable()
        .describe("The closing date of the issue if closed"),
    }),
  ),
  z.object({
    ok: z.literal(false),
    message: z.string().describe("Error message"),
  }),
]);

export const getRepositoryIssues = new Tool({
  id: "getRepositoryIssues",
  description: "Get issues (excluding pull requests) for a repository",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const {
      assignee,
      creator,
      labels,
      owner,
      page,
      perPage: per_page,
      repo,
      state,
    } = context;

    try {
      const response = await GithubAPI.rest.issues.listForRepo({
        owner,
        repo,
        state,
        labels: labels?.join(","),
        assignee,
        creator,
        page,
        per_page,
      });

      // Filter out pull requests and map the response to match our schema
      const issues = response.data
        .filter((issue) => !issue.pull_request)
        .map((issue) => ({
          body: issue.body ?? null,
          number: issue.number,
          state: issue.state as "open" | "closed",
          title: issue.title,
          url: issue.html_url,
          labels: issue.labels.map((label) => ({
            name: typeof label === "object" ? (label.name as string) || "" : "",
            color:
              typeof label === "object" ? (label.color as string) || "" : "",
          })),
          assignees:
            issue.assignees?.map((assignee) => ({
              url: assignee.html_url ?? null,
              avatarUrl: assignee.avatar_url ?? null,
              username: assignee.login ?? null,
            })) || [],
          user: {
            url: issue.user?.html_url ?? null,
            avatarUrl: issue.user?.avatar_url ?? null,
            username: issue.user?.login ?? null,
          },
          createdAt: issue.created_at,
          updatedAt: issue.updated_at,
          closedAt: issue.closed_at ?? null,
        }));
      return issues;
    } catch (error) {
      console.error("Error fetching issues:", error);
      return {
        ok: false as const,
        message:
          error instanceof Error ? error.message : "Failed to fetch issues",
      };
    }
  },
});
