import { Tool } from "@mastra/core/tools";
import { z } from "zod";
import { DiffReviewOutputSchema } from '../../github-diff-review/index';

type AgentResponseType = z.infer<typeof DiffReviewOutputSchema>;

export const performComprehensiveFileReview = new Tool({
  id: "performComprehensiveFileReview",
  description: "Delegates the detailed review of a single file's diff to the github-diff-review agent via HTTP.",
  inputSchema: z.object({
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    pull_number: z.number().describe("Pull Request number"),
    filePath: z.string().describe("The path of the file to review the diff for"),
    prDescription: z.string().describe("The description of the Pull Request for context"),
  }),
  outputSchema: DiffReviewOutputSchema.describe("The structured review findings for the file from the diff-review agent."),
  execute: async ({ context }) => {
    const USER_PROMPT = {
      messages: [
        {
          role: "user",
          content: JSON.stringify(context)
        }
      ]
    };

    let reviewResult: AgentResponseType | null = null;

    try {
      const response = await fetch('http://localhost:4111/api/agents/githubDiffReviewAgent/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(USER_PROMPT),
      });

      if (!response.ok) {
        // Handle HTTP errors (e.g., 4xx, 5xx)
        const errorBody = await response.text();
        // Return error structure immediately
        return {
          filePath: context.filePath,
          findings: [],
          error: `Agent API request failed with status ${response.status}: ${errorBody || response.statusText}`
        };
      }

      // Assuming the API returns the structured object directly in the body
      const { text } = await response.json() as { text: string };

      if (!text) {
        return {
          filePath: context.filePath,
          findings: [],
          error: "Agent API returned invalid or non-object response."
        };
      }

      try {
        reviewResult = JSON.parse(text?.replace("```json", "").replace("```", "")) as AgentResponseType;
        return reviewResult;
      } catch (error: any) {
        return {
          filePath: context.filePath,
          findings: [],
          error: `Failed to parse agent response: ${error.message}`
        };
      }
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log("🚀 ~ execute: ~ errorMessage:", errorMessage)
      return {
        filePath: context.filePath,
        findings: [],
        error: `Failed to review file via HTTP: ${errorMessage}`
      };
    }
  },
}); 