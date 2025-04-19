import { GithubAPI } from "../../../lib/github"; // Adjust path as necessary
import { Tool } from "@mastra/core/tools"; // Assuming this is the correct import now
import { z } from "zod";

// Input schema: owner, repo, issue_number
const inputSchema = z.object({
  owner: z.string().describe("The owner of the repository (e.g., 'mastra-ai')."),
  repo: z.string().describe("The name of the repository (e.g., 'mastra')."),
  issue_number: z.number().int().positive().describe("The number of the issue."),
});

// Define the successful output structure
const successOutputSchema = z.object({
  ok: z.literal(true).default(true), // Indicate success
  number: z.number().int().positive(),
  title: z.string(),
  state: z.string(), // e.g., 'open', 'closed'
  url: z.string().url(),
  body: z.string().nullable().describe("The main content (body) of the issue."),
});

// Define the error output structure
const errorOutputSchema = z.object({
  ok: z.literal(false),
  message: z.string().describe("Error message describing why fetching failed."),
});

// Combine success and error cases for the final output schema
const outputSchema = z.union([successOutputSchema, errorOutputSchema]);

// Define the Tool instance directly
export const getIssueDetail = new Tool({
  id: "getIssueDetail", // Tool ID/Name
  description: "Fetches detailed information for a specific GitHub issue, including its body content.",
  inputSchema,
  outputSchema,
  execute: async ({ context }) => { // Use context object for input
    const { owner, repo, issue_number } = context;

    try {
      // --- GitHub API Call using GithubAPI ---
      const response = await GithubAPI.rest.issues.get({ // Use GithubAPI.rest
        owner,
        repo,
        issue_number,
        // headers: { // Headers can often be set globally in the Octokit instance
        //   'X-GitHub-Api-Version': '2022-11-28'
        // }
      });

      // Check if the request was successful (Octokit throws on non-2xx/3xx by default, but explicit check is safer)
      // Note: Octokit might throw for 4xx/5xx errors, so this explicit check might be redundant
      // if the catch block handles those cases. Keeping for clarity.
      if (response.status < 200 || response.status >= 300) {
        const errorDetails = response.data ? JSON.stringify(response.data) : 'No details';
        console.error(`GitHub API error fetching issue ${issue_number}: Status ${response.status}, Details: ${errorDetails}`);
        throw new Error(`GitHub API error: Status ${response.status}`);
      }

      const issueData = response.data;

      // Construct the successful result object
      const result = {
        ok: true as const, // Explicitly set ok to true
        number: issueData.number,
        title: issueData.title,
        state: issueData.state,
        url: issueData.html_url, // Use html_url for the web URL
        body: issueData.body ?? null, // Ensure body is null if empty or undefined
      };

      return result;

    } catch (error: any) {
      // Log the specific error encountered
      console.error(`Error in getIssueDetails tool for ${owner}/${repo}#${issue_number}:`, error);

      // Construct and return the error object
      let message = `Failed to fetch details for issue #${issue_number}.`;
      if (error.status === 404) {
        message = `Issue #${issue_number} not found in ${owner}/${repo}.`;
      } else if (error.status === 403 || error.status === 401) {
        message = `Permission denied fetching details for issue #${issue_number}. Check GITHUB_TOKEN permissions.`;
      } else if (error instanceof Error) {
        // Use the error message from the caught error if available
        message = error.message;
      }

      return {
        ok: false as const, // Explicitly set ok to false
        message: message,
      };
    }
  },
});
