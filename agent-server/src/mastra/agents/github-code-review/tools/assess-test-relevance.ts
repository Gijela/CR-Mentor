import { Tool } from "@mastra/core/tools";
import { z } from "zod";
import { GithubAPI } from "../../../lib/github"; // Import GithubAPI
import { deepSeekModel } from '../../../model-provider/deepseek'; // Import the LLM model

// Input schema: Now only needs PR identifier
const inputSchema = z.object({
    owner: z.string().describe("The owner of the repository."),
    repo: z.string().describe("The name of the repository."),
    pull_number: z.number().int().positive().describe("The number of the pull request."),
});

// Output schema: Test relevance assessment
const outputSchema = z.object({
    assessmentSummary: z.string().describe("High-level assessment of test relevance and effectiveness (e.g., 'Good coverage', 'Potential gaps in boundary condition testing', 'No relevant tests found')."),
    coverageGaps: z.array(z.object({
        filePath: z.string().describe("Path to the source file with the potential test gap."),
        lines: z.string().optional().describe("Line range of the code logic potentially lacking test coverage."),
        description: z.string().describe("Description of the identified test coverage gap or weakness."),
    })).optional().describe("Specific areas or logic points suspected of having inadequate test coverage."),
    relevantTestCases: z.array(z.object({
        filePath: z.string().describe("Path to the relevant test file."),
        testCaseName: z.string().optional().describe("Name of the specific test function/case."),
        assessment: z.string().optional().describe("Brief assessment of this test case's relevance/effectiveness.")
    })).optional().describe("List of identified test cases related to the changes.")
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message during test relevance assessment."),
}));

// Define a schema for the structured output expected FROM THE LLM
const llmTestOutputSchema = z.object({
    assessmentSummary: z.string(),
    coverageGaps: z.array(z.object({
        filePath: z.string(),
        lines: z.string().optional(),
        description: z.string(),
    })).optional(),
    relevantTestCases: z.array(z.object({
        filePath: z.string(),
        testCaseName: z.string().optional(),
        assessment: z.string().optional()
    })).optional()
});

export const assessTestRelevance = new Tool({
    id: "assessTestRelevance",
    description: "Evaluates whether automated tests related to the code changes effectively cover the core logic and boundary conditions. Fetches the PR diff internally and uses an LLM for the analysis. Note: Currently analyzes based on diff only, does not fetch test file content.", // UPDATED description
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
        const { owner, repo, pull_number } = context;

        console.log(`Executing assessTestRelevance for ${owner}/${repo}#${pull_number}`);

        try {
            // 1. Fetch the raw diff internally
            console.log("Fetching raw diff for test relevance analysis...");
            const diffResponse = await GithubAPI.rest.pulls.get({
                owner,
                repo,
                pull_number,
                mediaType: {
                    format: 'diff',
                },
            });
            const rawDiff = diffResponse.data as unknown as string;
            console.log(`Fetched diff (length: ${rawDiff.length}) for test relevance analysis.`);

            // 2. Prepare prompt for LLM analysis
            const systemPrompt = `You are an AI assistant helping review code. Analyze the provided code diff to assess the relevance and potential effectiveness of automated tests covering these changes. Identify potential coverage gaps and relevant existing test cases based *only* on the provided diff. Respond ONLY with a JSON object matching this schema: ${JSON.stringify(llmTestOutputSchema.shape)}. Do not include any other text or markdown formatting.`;

            const userPrompt = `Code Diff:\n---\n${rawDiff}\n---\n\nPlease analyze the test relevance based *only* on this diff and provide the JSON output.`;

            // 3. Call the LLM for analysis (using 'as any' to bypass type errors)
            console.log("Calling LLM for test relevance analysis...");
            const llmResponse = await deepSeekModel.doGenerate({
                prompt: [
                    { role: 'system', content: [{ type: 'text' as const, text: systemPrompt }] },
                    { role: 'user', content: [{ type: 'text' as const, text: userPrompt }] }
                ],
                mode: { type: 'object-json', schema: llmTestOutputSchema }
            } as any);

            console.log("LLM test relevance analysis received. Response structure:", llmResponse);

            // 4. Parse and return the LLM response from the text field
            if (llmResponse.text) {
                try {
                    const responseObject = JSON.parse(llmResponse.text);
                    const parsedResult = llmTestOutputSchema.safeParse(responseObject);
                    if (parsedResult.success) {
                       console.log("Test relevance result (from text):");
                       console.dir(parsedResult.data, { depth: null });
                       return parsedResult.data; // Return the validated data
                    } else {
                       console.error("LLM test relevance response text is not valid JSON or doesn't match schema:", parsedResult.error);
                       console.error("Raw LLM text response:", llmResponse.text);
                       return {
                           ok: false as const,
                           message: `LLM returned an invalid test relevance response structure: ${parsedResult.error.message}`,
                       };
                    }
                } catch (e) {
                    console.error("Failed to parse LLM test relevance response text as JSON:", e);
                    console.error("Raw LLM text response:", llmResponse.text);
                    return {
                        ok: false as const,
                        message: "LLM test relevance response text could not be parsed as JSON.",
                    };
                }
            } else {
                console.error("LLM did not return text output for test relevance analysis.", llmResponse);
                return {
                    ok: false as const,
                    message: "LLM test relevance analysis failed to produce text output.",
                };
            }

        } catch (error: any) {
            console.error(`Error during assessTestRelevance for ${owner}/${repo}#${pull_number}:`, error);
            let message = "Failed during test relevance assessment.";
            if (error?.status === 404) { // Error fetching diff
                message = `Could not fetch diff for PR #${pull_number}. It might not exist or permissions are missing.`;
            } else if (error?.response?.data) { // Error from LLM API call
                 const errorDetails = JSON.stringify(error.response.data);
                 message = `LLM API error during test relevance assessment: ${errorDetails}`;
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