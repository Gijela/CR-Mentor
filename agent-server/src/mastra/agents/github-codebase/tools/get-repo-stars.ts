import { GithubAPI } from "../codebase-agent/lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  owner: z
    .string()
    .describe("The owner of the repository. As facebook in facebook/react"),
  repo: z
    .string()
    .describe("The name of the repository. As react in facebook/react"),
  interval: z
    .enum(["daily", "weekly", "monthly"])
    .default("monthly")
    .describe("The interval for aggregating star counts"),
});

export type GetRepositoryStarsArgs = z.infer<typeof inputSchema>;

const outputSchema = z.union([
  z.array(
    z.object({
      date: z.string().describe("The date of the star count"),
      starCount: z.number().int().describe("The number of stars on that date"),
    }),
  ),
  z.object({
    ok: z.literal(false),
    message: z.string().describe("Error message"),
  }),
]);

export type GetRepositoryStarsResults = z.infer<typeof outputSchema>;

export const getRepositoryStars = new Tool({
  id: "getRepositoryStarsOverTime",
  description: "Get the number of stars for a repository over time.",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { owner, repo, interval } = context;

    try {
      const allStargazers = [];

      const iterator = GithubAPI.paginate.iterator(
        GithubAPI.rest.activity.listStargazersForRepo,
        {
          owner,
          repo,
          per_page: 100,
          headers: {
            accept: "application/vnd.github.v3.star+json",
          },
        },
      );

      for await (const { data } of iterator) {
        for (const star of data) {
          if (!star.starred_at) continue;
          allStargazers.push(new Date(star.starred_at));
        }
      }

      // Aggregate star counts by the specified interval
      const aggregatedStars: { [date: string]: number } = {};

      allStargazers.forEach((item) => {
        let dateKey: string;

        switch (interval) {
          case "daily":
            dateKey = item.toISOString().split("T")[0]; // YYYY-MM-DD
            break;
          case "weekly": {
            // Calculate the start of the week (Sunday)
            const dayOfWeek = item.getDay(); // 0 for Sunday, 1 for Monday, etc.
            const startDate = new Date(item);
            startDate.setDate(item.getDate() - dayOfWeek);
            dateKey = startDate.toISOString().split("T")[0]; // YYYY-MM-DD of Sunday
            break;
          }
          case "monthly":
            dateKey = `${item.getFullYear()}-${String(
              item.getMonth() + 1,
            ).padStart(2, "0")}`; // YYYY-MM
            break;
          default:
            dateKey = item.toISOString().split("T")[0];
        }

        aggregatedStars[dateKey] = (aggregatedStars[dateKey] || 0) + 1;
      });

      // Convert aggregated data to the output schema
      const result = Object.entries(aggregatedStars).map(
        ([date, starCount]) => ({
          date,
          starCount,
        }),
      );

      // Sort by date
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      return result;
    } catch (error) {
      console.error("Error fetching stargazers:", error);
      return {
        ok: false as const,
        message:
          error instanceof Error ? error.message : "Failed to fetch stargazers",
      };
    }
  },
});
