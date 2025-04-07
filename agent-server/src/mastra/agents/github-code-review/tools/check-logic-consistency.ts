import { Tool } from "@mastra/core/tools";
import { z } from "zod";
import { GithubAPI } from "../../../lib/github"; // Import GithubAPI
import { deepSeekModel } from '../../../model-provider/deepseek'; // Correct the import path (3 levels up)

// Input Schema: Now requires basic PR info needed to fetch diff and description
const inputSchema = z.object({
  owner: z.string().describe("The owner of the repository."),
  repo: z.string().describe("The name of the repository."),
  pull_number: z.number().int().positive().describe("The number of the pull request."),
  prDescription: z.string().nullable().describe("The description body of the Pull Request."),
});

// Output schema: Consistency assessment (remains largely the same)
const outputSchema = z.object({
    isConsistent: z.boolean().describe("Whether the code changes align with the PR description/goals."),
    explanation: z.string().describe("A brief explanation of the consistency check result, highlighting any discrepancies or confirmations."),
    discrepancies: z.array(z.object({
        filePath: z.string().optional().describe("File path where the discrepancy is observed."),
        lines: z.string().optional().describe("Line range relevant to the discrepancy (e.g., '50-65')."),
        description: z.string().describe("Description of the specific inconsistency found."),
    })).optional().describe("A list of specific points where the code logic deviates from the stated goals.")
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message during consistency check."),
}));

// Define a schema for the structured output expected FROM THE LLM inside the text response
const llmOutputSchema = z.object({
    isConsistent: z.boolean(),
    explanation: z.string(),
    discrepancies: z.array(z.object({
        filePath: z.string().optional(),
        lines: z.string().optional(),
        description: z.string(),
    })).optional()
});


export const checkLogicConsistency = new Tool({
    id: "checkLogicConsistency",
    description: "Analyzes if the code changes in a Pull Request logically align with its description and stated goals. Fetches the PR diff internally and uses an LLM for the analysis.",
    inputSchema,
    outputSchema, // This tool's final output schema
    execute: async ({ context }) => {
        const { owner, repo, pull_number, prDescription } = context;
        const descriptionText = prDescription ?? "(No description provided)"; // Handle null description

        console.log(`Executing checkLogicConsistency for ${owner}/${repo}#${pull_number}`);

        try {
            // 1. Fetch the raw diff internally
            console.log("Fetching raw diff...");
            const diffResponse = await GithubAPI.rest.pulls.get({
                owner,
                repo,
                pull_number,
                mediaType: {
                    format: 'diff',
                },
            });
            const rawDiff = diffResponse.data as unknown as string;
            console.log(`Fetched diff (length: ${rawDiff.length})`);

            // Optional: Check diff length here if needed

            // 2. Define prompts and schema for LLM analysis
            // Schema Definition is moved outside execute as it's constant

            const systemPrompt = `You are an AI assistant helping review code. Analyze the provided Pull Request description and code diff to check for logical consistency. Determine if the code changes accurately reflect the stated goals or description. Respond ONLY with a JSON object matching this schema: ${JSON.stringify(llmOutputSchema.shape)}. Do not include any other text or markdown formatting.`;

            const userPrompt = `Pull Request Description:\n---\n${descriptionText}\n---\n\nCode Diff:\n---\n${rawDiff}\n---\n\nPlease analyze the consistency and provide the JSON output.`;

            // 3. Call the LLM for analysis using doGenerate
            console.log("Calling LLM for consistency analysis...");
            const llmResponse = await deepSeekModel.doGenerate({
                prompt: [
                    { role: 'system', content: [{ type: 'text' as const, text: systemPrompt }] },
                    { role: 'user', content: [{ type: 'text' as const, text: userPrompt }] }
                ],
                mode: { type: 'object-json', schema: llmOutputSchema } // Use mode for structured output
            } as any);

            console.log("LLM analysis received. Response structure:", llmResponse);

            // 4. Parse and return the LLM response from the text field
            if (llmResponse.text) {
                try {
                    const responseObject = JSON.parse(llmResponse.text);
                    const parsedResult = llmOutputSchema.safeParse(responseObject);
                    if (parsedResult.success) {
                       console.log("Consistency check result (from text):");
                       console.dir(parsedResult.data, { depth: null });
                       return parsedResult.data; // Return the validated data
                    } else {
                       console.error("LLM response text is not valid JSON or doesn't match schema:", parsedResult.error);
                       console.error("Raw LLM text response:", llmResponse.text);
                       return {
                           ok: false as const,
                           message: `LLM returned an invalid response structure: ${parsedResult.error.message}`,
                       };
                    }
                } catch (e) {
                    console.error("Failed to parse LLM response text as JSON:", e);
                    console.error("Raw LLM text response:", llmResponse.text);
                    return {
                        ok: false as const,
                        message: "LLM response text could not be parsed as JSON.",
                    };
                }
            } else {
                console.error("LLM did not return text output.", llmResponse);
                return {
                    ok: false as const,
                    message: "LLM analysis failed to produce text output.",
                };
            }

        } catch (error: any) {
            console.error(`Error during checkLogicConsistency for ${owner}/${repo}#${pull_number}:`, error);
            let message = "Failed during consistency check.";
            if (error?.status === 404) { // Error fetching diff
                message = `Could not fetch diff for PR #${pull_number}. It might not exist or permissions are missing.`;
            } else if (error?.response?.data) { // Error from LLM API call
                 // Attempt to get a more specific error message if available
                 const errorDetails = JSON.stringify(error.response.data);
                 message = `LLM API error during consistency check: ${errorDetails}`;
             } else if (error instanceof Error) {
                 message = error.message;
             }
            return {
                ok: false as const,
                message: message,
            };
        }
    },
}); 