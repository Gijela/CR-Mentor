import { Tool } from "@mastra/core/tools";
import { z } from "zod";
import { GithubAPI } from "../../../lib/github"; // Import GithubAPI
import { deepSeekModel } from '../../../model-provider/deepseek'; // Import the LLM model

// Input schema: Now requires PR identifier and practices config
const inputSchema = z.object({
    owner: z.string().describe("The owner of the repository."),
    repo: z.string().describe("The name of the repository."),
    pull_number: z.number().int().positive().describe("The number of the pull request."),
    projectPracticesConfig: z.object({
        source: z.string().describe("Location or description of project-specific practices/rules/patterns."),
        format: z.enum(["regex_list", "text_descriptions", "custom_checks_path"]).optional().describe("Format of the practice definitions.")
    }).optional().describe("Configuration for project-specific practices and known pitfalls to check for.")
});

// Output schema: List of practice violations or triggered pitfalls
const outputSchema = z.object({
    issues: z.array(z.object({
        filePath: z.string().describe("File path where the issue occurred."),
        lines: z.string().optional().describe("Line range of the relevant code (e.g., '100-105')."),
        practiceId: z.string().optional().describe("Identifier of the specific practice/rule violated."),
        description: z.string().describe("Description of the violated practice or triggered pitfall."),
        severity: z.enum(["Suggestion", "Warning", "Error"]).optional().describe("Severity or category of the issue.")
    })).describe("List of identified deviations from project practices or potential pitfalls."),
    message: z.string().optional()
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message during project practices check."),
}));

// Define a schema for the structured output expected FROM THE LLM
const llmPracticesOutputSchema = z.object({
    issues: z.array(z.object({
        filePath: z.string(),
        lines: z.string().optional(),
        practiceId: z.string().optional(),
        description: z.string(),
        severity: z.enum(["Suggestion", "Warning", "Error"]).optional()
    }))
});

export const checkProjectPractices = new Tool({
    id: "checkProjectPractices",
    description: "Scans code changes for violations of specific project practices/rules. Fetches the PR diff internally, uses the provided practice definitions, and calls an LLM for analysis.", // UPDATED description
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
        const { owner, repo, pull_number, projectPracticesConfig } = context;

        if (!projectPracticesConfig) {
            console.log("Skipping project practices check: No configuration provided.");
            return {
                 issues: [],
                 message: "Project practices check skipped: No configuration provided."
            };
        }

        console.log(`Executing checkProjectPractices for ${owner}/${repo}#${pull_number}`);

        try {
            // 1. Fetch the raw diff internally
            console.log("Fetching raw diff for project practices check...");
            const diffResponse = await GithubAPI.rest.pulls.get({
                owner, repo, pull_number, mediaType: { format: 'diff' },
            });
            const rawDiff = diffResponse.data as unknown as string;
            console.log(`Fetched diff (length: ${rawDiff.length}) for project practices check.`);

            // 2. Load/Prepare Project Practices
            // TODO: Implement logic to load/parse projectPracticesConfig.source based on format
            const practicesText = projectPracticesConfig.source; // Assuming source is text for now
            console.log("Using provided project practices definitions.");

            // 3. Prepare prompt for LLM analysis
            const systemPrompt = `You are an AI assistant helping review code. Analyze the provided code diff to check if it violates any of the specified project-specific practices, rules, or known pitfalls. Respond ONLY with a JSON object matching this schema: ${JSON.stringify(llmPracticesOutputSchema.shape)}. Respond with an empty issues array if none are found. Do not include any other text or markdown formatting.`;

            const userPrompt = `Project Practices/Rules/Pitfalls:\n---\n${practicesText}\n---\n\nCode Diff:\n---\n${rawDiff}\n---\n\nPlease analyze the code diff against the project practices and provide the JSON output listing only the issues found.`;

            // 4. Call the LLM for analysis (using 'as any' for type issues)
            console.log("Calling LLM for project practices analysis...");
            const llmResponse = await deepSeekModel.doGenerate({
                prompt: [
                    { role: 'system', content: [{ type: 'text' as const, text: systemPrompt }] },
                    { role: 'user', content: [{ type: 'text' as const, text: userPrompt }] }
                ],
                mode: { type: 'object-json', schema: llmPracticesOutputSchema }
            } as any);

            console.log("LLM project practices analysis received. Response structure:", llmResponse);

            // 5. Parse and return the LLM response
            if (llmResponse.text) {
                try {
                    const responseObject = JSON.parse(llmResponse.text);
                    const parsedResult = llmPracticesOutputSchema.safeParse(responseObject);
                    if (parsedResult.success) {
                       console.log("Project practices check result (from text):");
                       console.dir(parsedResult.data, { depth: null });
                       return parsedResult.data; // Return the validated findings
                    } else {
                       console.error("LLM practices response text is not valid JSON or doesn't match schema:", parsedResult.error);
                       console.error("Raw LLM text response:", llmResponse.text);
                       return {
                           ok: false as const,
                           message: `LLM returned an invalid practices response structure: ${parsedResult.error.message}`,
                       };
                    }
                } catch (e) {
                    console.error("Failed to parse LLM practices response text as JSON:", e);
                    console.error("Raw LLM text response:", llmResponse.text);
                    return {
                        ok: false as const,
                        message: "LLM practices response text could not be parsed as JSON.",
                    };
                }
            } else {
                console.error("LLM did not return text output for practices analysis.", llmResponse);
                return {
                    ok: false as const,
                    message: "LLM practices analysis failed to produce text output.",
                };
            }

        } catch (error: any) {
            console.error(`Error during checkProjectPractices for ${owner}/${repo}#${pull_number}:`, error);
            let message = "Failed during project practices check.";
             if (error?.status === 404) { message = `Could not fetch diff for PR #${pull_number}.`; }
             else if (error?.response?.data) { message = `LLM API error during practices check: ${JSON.stringify(error.response.data)}`; }
             else if (error instanceof Error) { message = error.message; }
            return { ok: false as const, message: message };
        }
    },
}); 