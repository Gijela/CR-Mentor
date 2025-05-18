import { Tool } from "@mastra/core/tools";
import { z } from "zod";
import { GithubAPI } from "../../../lib/github"; // Import GithubAPI
import { deepSeekModel } from '../../../model-provider/deepseek'; // Import the LLM model

// Input schema: Now only needs PR identifier
const inputSchema = z.object({
    owner: z.string().describe("The owner of the repository."),
    repo: z.string().describe("The name of the repository."),
    pull_number: z.number().int().positive().describe("The number of the pull request."),
    // Potentially add baseRef if needed for comparison beyond diff
});

// Output schema: Impact assessment report
const outputSchema = z.object({
    impactSummary: z.string().describe("A high-level summary of the potential impact (e.g., 'Low', 'Medium: Affects core module X', 'High: Modifies public API')."),
    potentiallyAffected: z.array(z.object({
        filePath: z.string().describe("Path to a file or module potentially affected by the changes."),
        reason: z.string().optional().describe("Why this file/module might be affected (e.g., 'Calls modified function Y', 'Uses changed class Z')."),
        riskLevel: z.enum(["Low", "Medium", "High", "Unknown"]).optional().describe("Estimated risk level associated with the impact on this file/module.")
    })).describe("List of specific files or modules identified as potentially impacted."),
    notes: z.string().optional().describe("Additional notes or observations regarding the impact analysis.")
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message during change impact analysis."),
}));

// Define a schema for the structured output expected FROM THE LLM
const llmImpactOutputSchema = z.object({
    impactSummary: z.string(),
    potentiallyAffected: z.array(z.object({
        filePath: z.string(),
        reason: z.string().optional(),
        riskLevel: z.enum(["Low", "Medium", "High", "Unknown"]).optional()
    })),
    notes: z.string().optional()
});

export const analyzeChangeImpact = new Tool({
    id: "analyzeChangeImpact",
    description: "Estimates the potential ripple effects of code changes on other parts of the codebase. Fetches the PR diff internally and uses an LLM for the analysis.", // UPDATED description
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
        const { owner, repo, pull_number } = context;

        console.log(`Executing analyzeChangeImpact for ${owner}/${repo}#${pull_number}`);

        try {
            // 1. Fetch the raw diff internally
            console.log("Fetching raw diff for impact analysis...");
            const diffResponse = await GithubAPI.rest.pulls.get({
                owner,
                repo,
                pull_number,
                mediaType: {
                    format: 'diff',
                },
            });
            const rawDiff = diffResponse.data as unknown as string;
            console.log(`Fetched diff (length: ${rawDiff.length}) for impact analysis.`);

            // 2. Prepare prompt for LLM analysis
            const systemPrompt = `You are an AI assistant helping review code. Analyze the provided code diff to estimate the potential impact of these changes on other parts of the codebase. Identify potentially affected files/modules and summarize the overall impact. Respond ONLY with a JSON object matching this schema: ${JSON.stringify(llmImpactOutputSchema.shape)}. Do not include any other text or markdown formatting.`;

            const userPrompt = `Code Diff:\n---\n${rawDiff}\n---\n\nPlease analyze the potential change impact and provide the JSON output.`;

            // 3. Call the LLM for analysis (using the fix for doGenerate arguments and 'as any')
            console.log("Calling LLM for impact analysis...");
            const llmResponse = await deepSeekModel.doGenerate({
                prompt: [
                    { role: 'system', content: [{ type: 'text' as const, text: systemPrompt }] },
                    { role: 'user', content: [{ type: 'text' as const, text: userPrompt }] }
                ],
                mode: { type: 'object-json', schema: llmImpactOutputSchema }
            } as any); // Using 'as any' to bypass persistent type errors

            console.log("LLM impact analysis received. Response structure:", llmResponse);

            // 4. Parse and return the LLM response from the text field
            if (llmResponse.text) {
                try {
                    const responseObject = JSON.parse(llmResponse.text);
                    const parsedResult = llmImpactOutputSchema.safeParse(responseObject);
                    if (parsedResult.success) {
                       console.log("Impact analysis result (from text):");
                       console.dir(parsedResult.data, { depth: null });
                       return parsedResult.data; // Return the validated data
                    } else {
                       console.error("LLM impact response text is not valid JSON or doesn't match schema:", parsedResult.error);
                       console.error("Raw LLM text response:", llmResponse.text);
                       return {
                           ok: false as const,
                           message: `LLM returned an invalid impact response structure: ${parsedResult.error.message}`,
                       };
                    }
                } catch (e) {
                    console.error("Failed to parse LLM impact response text as JSON:", e);
                    console.error("Raw LLM text response:", llmResponse.text);
                    return {
                        ok: false as const,
                        message: "LLM impact response text could not be parsed as JSON.",
                    };
                }
            } else {
                console.error("LLM did not return text output for impact analysis.", llmResponse);
                return {
                    ok: false as const,
                    message: "LLM impact analysis failed to produce text output.",
                };
            }

        } catch (error: any) {
            console.error(`Error during analyzeChangeImpact for ${owner}/${repo}#${pull_number}:`, error);
            let message = "Failed during impact analysis.";
            if (error?.status === 404) { // Error fetching diff
                message = `Could not fetch diff for PR #${pull_number}. It might not exist or permissions are missing.`;
            } else if (error?.response?.data) { // Error from LLM API call
                 const errorDetails = JSON.stringify(error.response.data);
                 message = `LLM API error during impact analysis: ${errorDetails}`;
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