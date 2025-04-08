import { z } from 'zod';
import { ToolExecutionContext, createTool } from '@mastra/core';
import { GithubAPI } from '../../../lib/github'; // Adjust path as necessary

// Define the input schema for the tool
const GetPullRequestDetailsInputSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  pull_number: z.number().int().positive().describe('Pull request number'),
});

// Define the output schema for the tool
const GetPullRequestDetailsOutputSchema = z.object({
  headSha: z.string().describe('The SHA of the head commit of the pull request source branch'),
  // Optionally include other details like baseSha, title, body etc. if needed
  // baseSha: z.string().optional().describe('The SHA of the base commit'),
  // title: z.string().optional().describe('The title of the pull request'),
  error: z.string().optional().describe('Error message if fetching failed.'),
});

// Define inferred types for better type safety
type InputType = z.infer<typeof GetPullRequestDetailsInputSchema>;
type OutputType = z.infer<typeof GetPullRequestDetailsOutputSchema>;

/**
 * Tool: Fetches details for a specific pull request from a GitHub repository.
 * Primarily used to get the head commit SHA.
 * Uses the pre-configured GithubAPI (Octokit) instance.
 */
export const getPullRequestDetails = createTool({
  id: 'getPullRequestDetails',
  description:
    'Fetches details for a specific pull request, providing the head commit SHA.',
  inputSchema: GetPullRequestDetailsInputSchema as any,
  outputSchema: GetPullRequestDetailsOutputSchema as any,

  execute: async ({ context }: { context: InputType & ToolExecutionContext }): Promise<OutputType> => {
    const { owner, repo, pull_number } = context;

    console.log(`Fetching details for PR #${pull_number} in ${owner}/${repo} using GithubAPI...`);

    try {
      const response = await GithubAPI.rest.pulls.get({
        owner,
        repo,
        pull_number,
      });

      if (response.status !== 200 || !response.data.head?.sha) {
        const errorMessage = `Failed to get valid pull request details from GitHub API. Status: ${response.status}. Response missing head.sha.`;
        console.error(`getPullRequestDetails Error: ${errorMessage} for PR #${pull_number}`);
        return { headSha: '', error: errorMessage }; // Return empty sha on error
      }

      const headSha = response.data.head.sha;

      console.log(`Successfully fetched head SHA (${headSha}) for PR #${pull_number}`);
      return {
        headSha: headSha,
        error: undefined,
      };
    } catch (error: any) {
      if (error.status === 404) {
        console.warn(`getPullRequestDetails: Pull Request #${pull_number} not found in ${owner}/${repo}`);
        return { headSha: '', error: `Pull Request not found: #${pull_number}` };
      }
      console.error(
        `getPullRequestDetails Error: Unexpected error fetching PR #${pull_number} - ${error.message || error}`,
        error
      );
      return {
        headSha: '',
        error: `Unexpected GitHub API error fetching PR details: ${error.message || error}`,
      };
    }
  },
}); 