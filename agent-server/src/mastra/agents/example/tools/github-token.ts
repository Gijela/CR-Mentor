import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const getGithubTokenTool = createTool({
  id: 'get-github-token',
  description: 'Get a GitHub token for the specified GitHub username',
  inputSchema: z.object({
    githubName: z.string().describe('GitHub username'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    token: z.string().optional(),
    msg: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const response = await fetch('https://api.cr-mentor.com/github/createToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubName: context.githubName,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        msg: `Error fetching token: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
});
