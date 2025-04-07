import { Tool } from "@mastra/core/tools";
import { z } from "zod";
// Assuming the output schema from github-diff-review agent is defined and exported
// We need to define it here or import it.
// Let's define a placeholder for now and refine it when github-diff-review is built.
import { DiffReviewOutputSchema } from '../../github-diff-review/index'; // Placeholder import
import { githubDiffReviewAgent } from '../../github-diff-review/index'; // Import the agent

export const performComprehensiveFileReview = new Tool({
  id: "performComprehensiveFileReview",
  description: "Delegates the detailed review of a single file's diff to the github-diff-review agent.",
  inputSchema: z.object({
    owner: z.string().describe("Repository owner"),
    repo: z.string().describe("Repository name"),
    pull_number: z.number().describe("Pull Request number"),
    filePath: z.string().describe("The path of the file to review the diff for"),
    prDescription: z.string().describe("The description of the Pull Request for context"),
    // Add any other context the diff-review agent might need
  }),
  // The output schema should match the output schema of the github-diff-review agent
  outputSchema: DiffReviewOutputSchema.describe("The structured review findings for the file from the diff-review agent."),

  execute: async ({ context }) => {
    const { owner, repo, pull_number, filePath, prDescription } = context;

    console.log("Delegating review for file: " + filePath + " in PR #" + pull_number);

    try {
      const agentInput = {
        owner,
        repo,
        pull_number,
        filePath,
        prDescription,
      };

      // Pass prompt, and specify output schema in options
      const generateResult = await githubDiffReviewAgent.generate(
        `Review diff for file: ${filePath}`,
        {
          // Pass context if needed by agent's internal logic/tools?
          // context: agentInput, 
          // Specify the desired output schema
          output: DiffReviewOutputSchema
        }
      );

      // Access the structured output from the .object property
      let reviewResult = generateResult.object;

      console.log("Received raw review result for " + filePath + ":", reviewResult);

      // Post-processing: Ensure the result conforms to the schema, especially the 'findings' array
      // This handles cases where the LLM might omit the findings array when it's empty
      if (reviewResult && typeof reviewResult === 'object' && !Array.isArray(reviewResult.findings)) {
        console.warn(`Result for ${filePath} missing 'findings' array, adding empty array.`);
        // Ensure filePath exists before adding findings if reviewResult might be incomplete
        if (!reviewResult.filePath) {
          reviewResult.filePath = filePath; // Add filePath if missing too
        }
        reviewResult.findings = [];
      } else if (!reviewResult) {
        // Handle cases where generateResult.object is null or undefined
        console.error(`generateResult.object was null/undefined for ${filePath}. Returning error structure.`);
        reviewResult = {
          filePath: filePath,
          findings: [],
          error: "Agent failed to return a valid structured object."
        };
      }

      console.log("Processed review result for " + filePath + ":", reviewResult);

      // Type should align now
      return reviewResult;

    } catch (error: any) {
      console.error("Error during delegated file review for " + filePath + " in PR #" + pull_number + ":", error);
      // Propagate the error or return a specific error structure/null
      // Returning null might mask the underlying issue, re-throwing might be better for debugging
      // For now, let's return an error structure
      return {
        filePath: filePath,
        findings: [],
        error: "Failed to review file: " + (error.message || 'Unknown error')
      } // No cast needed here if return type allows this shape on error
    }
  },
}); 