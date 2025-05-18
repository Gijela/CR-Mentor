import { Tool } from "@mastra/core/tools";
import { z } from "zod";
import { GithubAPI } from "../../../lib/github"; // Import GithubAPI
import { deepSeekModel } from '../../../model-provider/deepseek'; // Import the LLM model

// Input schema: Now requires PR identifier and architecture rules
const inputSchema = z.object({
    owner: z.string().describe("The owner of the repository."),
    repo: z.string().describe("The name of the repository."),
    pull_number: z.number().int().positive().describe("The number of the pull request."),
    architectureRules: z.object({
        definition: z.string().describe("Description or location of the project's architecture rules."),
        format: z.enum(["text", "yaml", "json", "custom"]).optional().describe("Format of the architecture rules definition.")
    }).optional().describe("Project architecture rules to check against.")
});

// Output schema: List of architecture violations
const outputSchema = z.object({
    violations: z.array(z.object({
        filePath: z.string().describe("File path where the violation occurred."),
        lines: z.string().optional().describe("Line range of the violating code (e.g., '25-30')."),
        ruleId: z.string().optional().describe("Identifier of the violated architecture rule."),
        description: z.string().describe("Description of the architecture violation."),
        severity: z.enum(["Low", "Medium", "High"]).optional().describe("Severity of the violation.")
    })).describe("List of identified architecture rule violations."),
    message: z.string().optional() // Add message for skipped check
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message during architecture adherence check."),
}));

// Define a schema for the structured output expected FROM THE LLM
const llmArchOutputSchema = z.object({
    violations: z.array(z.object({
        filePath: z.string(),
        lines: z.string().optional(),
        ruleId: z.string().optional(),
        description: z.string(),
        severity: z.enum(["Low", "Medium", "High"]).optional()
    }))
});

export const checkArchitectureAdherence = new Tool({
    id: "checkArchitectureAdherence",
    description: "Verifies if code changes adhere to project architecture rules. Fetches the PR diff internally, uses the provided rules, and calls an LLM for analysis.", // UPDATED description
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
        const { owner, repo, pull_number, architectureRules } = context;

        if (!architectureRules) {
            console.log("Skipping architecture check: No rules provided.");
            return {
                 violations: [],
                 message: "Architecture check skipped: No rules provided."
            };
        }

        console.log(`Executing checkArchitectureAdherence for ${owner}/${repo}#${pull_number}`);

        try {
            // 1. Fetch the raw diff internally
            console.log("Fetching raw diff for architecture check...");
            const diffResponse = await GithubAPI.rest.pulls.get({
                owner, repo, pull_number, mediaType: { format: 'diff' },
            });
            const rawDiff = diffResponse.data as unknown as string;
            console.log(`Fetched diff (length: ${rawDiff.length}) for architecture check.`);

            // 2. Load/Prepare Architecture Rules
            // TODO: Implement logic to load/parse architectureRules.definition based on format
            const rulesText = architectureRules.definition; // Assuming definition is the text for now
            console.log("Using provided architecture rules.");

            // 3. Prepare prompt for LLM analysis
            const systemPrompt = `You are an AI assistant helping review code. Analyze the provided code diff to check if it violates any of the specified architecture rules. Respond ONLY with a JSON object matching this schema: ${JSON.stringify(llmArchOutputSchema.shape)}. Respond with an empty violations array if none are found. Do not include any other text or markdown formatting.`;

            const userPrompt = `Architecture Rules:\n---\n${rulesText}\n---\n\nCode Diff:\n---\n${rawDiff}\n---\n\nPlease analyze the code diff against the architecture rules and provide the JSON output listing only the violations found.`;

            // 4. Call the LLM for analysis (using 'as any' for type issues)
            console.log("Calling LLM for architecture analysis...");
            const llmResponse = await deepSeekModel.doGenerate({
                prompt: [
                    { role: 'system', content: [{ type: 'text' as const, text: systemPrompt }] },
                    { role: 'user', content: [{ type: 'text' as const, text: userPrompt }] }
                ],
                mode: { type: 'object-json', schema: llmArchOutputSchema }
            } as any);

            console.log("LLM architecture analysis received. Response structure:", llmResponse);

            // 5. Parse and return the LLM response
            if (llmResponse.text) {
                try {
                    const responseObject = JSON.parse(llmResponse.text);
                    const parsedResult = llmArchOutputSchema.safeParse(responseObject);
                    if (parsedResult.success) {
                       console.log("Architecture check result (from text):");
                       console.dir(parsedResult.data, { depth: null });
                       return parsedResult.data; // Return the validated findings
                    } else {
                       console.error("LLM arch response text is not valid JSON or doesn't match schema:", parsedResult.error);
                       console.error("Raw LLM text response:", llmResponse.text);
                       return {
                           ok: false as const,
                           message: `LLM returned an invalid arch response structure: ${parsedResult.error.message}`,
                       };
                    }
                } catch (e) {
                    console.error("Failed to parse LLM arch response text as JSON:", e);
                    console.error("Raw LLM text response:", llmResponse.text);
                    return {
                        ok: false as const,
                        message: "LLM arch response text could not be parsed as JSON.",
                    };
                }
            } else {
                console.error("LLM did not return text output for arch analysis.", llmResponse);
                return {
                    ok: false as const,
                    message: "LLM arch analysis failed to produce text output.",
                };
            }

        } catch (error: any) {
            console.error(`Error during checkArchitectureAdherence for ${owner}/${repo}#${pull_number}:`, error);
            let message = "Failed during architecture check.";
             if (error?.status === 404) { message = `Could not fetch diff for PR #${pull_number}.`; }
             else if (error?.response?.data) { message = `LLM API error during arch check: ${JSON.stringify(error.response.data)}`; }
             else if (error instanceof Error) { message = error.message; }
            return { ok: false as const, message: message };
        }
    },
}); 