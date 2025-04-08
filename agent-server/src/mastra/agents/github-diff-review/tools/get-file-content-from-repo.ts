import { z } from 'zod';
import { Tool, ToolExecutionContext, createTool } from '@mastra/core';
import { Buffer } from 'buffer';
import { GithubAPI } from '../../../lib/github'; // Corrected import path

// Define the input schema for the tool
const GetFileContentInputSchema = z.object({
  owner: z.string().describe('Repository owner'),
  repo: z.string().describe('Repository name'),
  filePath: z.string().describe('Path to the file within the repository'),
  ref: z
    .string()
    .describe(
      "The name of the commit/branch/tag. Default: the repository's default branch."
    ),
});

// Define the output schema for the tool
const GetFileContentOutputSchema = z.object({
  content: z
    .string()
    .nullable()
    .describe('The full content of the file, or null if not found or error.'),
  error: z.string().optional().describe('Error message if fetching failed.'),
});

// Inferred types - No need for ExtendedToolExecutionContext anymore
type InputType = z.infer<typeof GetFileContentInputSchema>;
type OutputType = z.infer<typeof GetFileContentOutputSchema>;

/**
 * Tool: Fetches the full content of a specific file from a GitHub repository at a specific ref.
 * Uses the pre-configured GithubAPI (Octokit) instance for authentication and API calls.
 */
export const getFileContentFromRepo = createTool({
  id: 'getFileContentFromRepo',
  description:
    'Fetches the full content of a file from a GitHub repository at a specific ref using the configured Octokit instance.',
  inputSchema: GetFileContentInputSchema as any,
  outputSchema: GetFileContentOutputSchema as any,

  // execute function using GithubAPI instance
  execute: async ({ context }: { context: InputType & ToolExecutionContext }): Promise<OutputType> => {
    // No need to destructure githubToken anymore
    const { owner, repo, filePath, ref } = context;

    console.log(`Fetching file content for ${filePath} using GithubAPI...`);

    try {
      const response = await GithubAPI.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref,
      });

      // Check if the response data is for a file and has content
      // Octokit's response type checking might differ slightly, adjust as needed
      // Based on Octokit types, response.data should have a `content` property for files.
      // Need to assert the type or check its existence.
      if (response.status !== 200 || !('content' in response.data) || typeof response.data.content !== 'string') {
        // Handle cases where it's not a file (e.g., directory) or unexpected response
        const errorMessage = `Failed to get file content from GitHub API. Status: ${response.status}. Path might not be a file or response format unexpected.`;
        console.error(`getFileContentFromRepo Error: ${errorMessage} for ${filePath}`);
        return { content: null, error: errorMessage };
      }

      // Decode Base64 content
      const decodedContent = Buffer.from(response.data.content, 'base64').toString(
        'utf-8'
      );

      console.log(`Successfully fetched and decoded content for ${filePath}`);
      return {
        content: decodedContent,
        error: undefined,
      };
    } catch (error: any) {
      // Handle Octokit/API errors (e.g., 404 Not Found)
      if (error.status === 404) {
        console.warn(`getFileContentFromRepo: File not found - ${filePath} at ref ${ref}`);
        return { content: null, error: `File not found: ${filePath} at ref ${ref}` };
      }
      // Handle other errors
      console.error(
        `getFileContentFromRepo Error: Unexpected error fetching ${filePath} - ${error.message || error}`,
        error
      );
      return {
        content: null,
        error: `Unexpected GitHub API error: ${error.message || error}`,
      };
    }
  },
}); 