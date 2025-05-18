import { Tool } from "@mastra/core/tools";
import { z } from "zod";
import { GithubAPI } from "../../../lib/github"; // Import GithubAPI
import { deepSeekModel } from '../../../model-provider/deepseek'; // Import the LLM model
// TODO: Import necessary modules for interacting with your Knowledge Base
// import { searchKnowledgeBase } from '../../../lib/knowledge-base';

// Input schema: Now requires PR identifier and KB config
const inputSchema = z.object({
    owner: z.string().describe("The owner of the repository."),
    repo: z.string().describe("The name of the repository."),
    pull_number: z.number().int().positive().describe("The number of the pull request."),
    knowledgeBaseConfig: z.object({
        type: z.enum(["api", "local_path", "vector_db"]).describe("Type of knowledge base."),
        location: z.string().describe("URL, path, or connection string for the knowledge base."),
        // Optional: API keys, search parameters etc.
    }).optional().describe("Configuration for accessing the project's knowledge base (if available).")
});

// Output schema: List of relevant KB entries and consistency assessment (remains the same)
const outputSchema = z.object({
    findings: z.array(z.object({
        knowledgeBaseEntry: z.object({
            source: z.string().describe("Identifier or link to the KB entry (e.g., URL, document ID)."),
            title: z.string().optional().describe("Title of the KB entry."),
            snippet: z.string().optional().describe("Relevant snippet from the KB entry.")
        }),
        assessment: z.enum(["Consistent", "Potential Conflict", "Informational", "Unable to Assess"])
            .describe("Assessment of how the code change relates to the KB entry."),
        explanation: z.string().optional().describe("Explanation for the assessment."),
        relevantCode: z.object({
            filePath: z.string().describe("File path in the PR related to this finding."),
            lines: z.string().optional().describe("Line range related to this finding (e.g., '10-15')."),
        }).optional().describe("Specific code location related to the KB finding.")
    })).describe("List of relevant knowledge base entries found and their assessment against the code changes."),
    // Optionally add a message field if KB wasn't configured/searched
    message: z.string().optional()
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message during knowledge base integration."),
}));

// Define a schema for the structured output expected FROM THE LLM
const llmKbOutputSchema = z.object({
    findings: z.array(z.object({
        knowledgeBaseEntry: z.object({
            source: z.string(),
            title: z.string().optional(),
            snippet: z.string().optional()
        }),
        assessment: z.enum(["Consistent", "Potential Conflict", "Informational", "Unable to Assess"]),
        explanation: z.string().optional(),
        relevantCode: z.object({
            filePath: z.string(),
            lines: z.string().optional(),
        }).optional()
    }))
});

export const integrateKnowledgeBase = new Tool({
    id: "integrateKnowledgeBase",
    description: "Checks code changes against a project-specific knowledge base. Fetches the PR diff, retrieves relevant KB entries internally, and uses an LLM to compare them.", // UPDATED description
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
        const { owner, repo, pull_number, knowledgeBaseConfig } = context;

        if (!knowledgeBaseConfig) {
             console.log("Skipping integrateKnowledgeBase: No configuration provided.");
             return {
                 findings: [],
                 message: "Knowledge base integration skipped: No configuration provided."
             };
        }

        console.log(`Executing integrateKnowledgeBase for ${owner}/${repo}#${pull_number}`);

        try {
            // 1. Fetch the raw diff internally
            console.log("Fetching raw diff for KB integration...");
            const diffResponse = await GithubAPI.rest.pulls.get({
                owner, repo, pull_number, mediaType: { format: 'diff' },
            });
            const rawDiff = diffResponse.data as unknown as string;
            console.log(`Fetched diff (length: ${rawDiff.length}) for KB integration.`);

            // 2. Access Knowledge Base and Retrieve Relevant Entries
            //    (Requires implementation based on your KB type)
            console.log("Accessing knowledge base...");
            let relevantKbEntries: any[] = [];
            try {
                 // TODO: Implement KB search logic based on knowledgeBaseConfig and rawDiff
                 console.warn("Knowledge base search logic not implemented yet.");
            } catch (kbError: any) {
                 console.error("Error searching knowledge base:", kbError);
                 // Ensure error return matches the schema (ok: false)
                 return { ok: false as const, message: `Error accessing or searching knowledge base: ${kbError.message}` };
            }
            console.log(`Retrieved ${relevantKbEntries.length} potentially relevant KB entries.`);

            // If no relevant entries found, no need to call LLM
            // This is a normal execution path, not an error case defined in the schema union.
            if (relevantKbEntries.length === 0) {
                console.log("No relevant KB entries found.");
                return { findings: [], message: "No relevant knowledge base entries found for this diff." };
            }

            // 3. Prepare prompt for LLM analysis
            // TODO: Format relevantKbEntries appropriately for the prompt
            const kbContext = JSON.stringify(relevantKbEntries.map(e => ({ title: e.title, snippet: e.snippet, source: e.source })), null, 2); // Example formatting

            const systemPrompt = `You are an AI assistant helping review code. Analyze the provided code diff and relevant knowledge base entries. For each KB entry, assess if the code changes are consistent, potentially conflicting, or just informational regarding the KB content. Respond ONLY with a JSON object matching this schema: ${JSON.stringify(llmKbOutputSchema.shape)}. Do not include any other text or markdown formatting.`;

            const userPrompt = `Knowledge Base Entries:\n---\n${kbContext}\n---\n\nCode Diff:\n---\n${rawDiff}\n---\n\nPlease analyze the code diff against the knowledge base entries and provide the JSON output.`;

            // 4. Call the LLM for analysis (using 'as any' for type issues)
            console.log("Calling LLM for KB integration analysis...");
            const llmResponse = await deepSeekModel.doGenerate({
                prompt: [
                    { role: 'system', content: [{ type: 'text' as const, text: systemPrompt }] },
                    { role: 'user', content: [{ type: 'text' as const, text: userPrompt }] }
                ],
                mode: { type: 'object-json', schema: llmKbOutputSchema }
            } as any);

            console.log("LLM KB integration analysis received. Response structure:", llmResponse);

            // 5. Parse and return the LLM response
            if (llmResponse.text) {
                try {
                    const responseObject = JSON.parse(llmResponse.text);
                    const parsedResult = llmKbOutputSchema.safeParse(responseObject);
                    if (parsedResult.success) {
                       console.log("KB Integration result (from text):");
                       console.dir(parsedResult.data, { depth: null });
                       return parsedResult.data; // Return the validated findings
                    } else {
                       console.error("LLM KB response text is not valid JSON or doesn't match schema:", parsedResult.error);
                       console.error("Raw LLM text response:", llmResponse.text);
                       // Ensure error return matches the schema (ok: false)
                       return {
                           ok: false as const, 
                           message: `LLM returned an invalid KB integration response structure: ${parsedResult.error.message}`,
                       };
                    }
                } catch (e) {
                    console.error("Failed to parse LLM KB response text as JSON:", e);
                    console.error("Raw LLM text response:", llmResponse.text);
                    // Ensure error return matches the schema (ok: false)
                    return {
                        ok: false as const, 
                        message: "LLM KB response text could not be parsed as JSON.",
                    };
                }
            } else {
                console.error("LLM did not return text output for KB integration analysis.", llmResponse);
                // Ensure error return matches the schema (ok: false)
                return {
                    ok: false as const, 
                    message: "LLM KB integration analysis failed to produce text output.",
                };
            }

        } catch (error: any) {
            console.error(`Error during integrateKnowledgeBase for ${owner}/${repo}#${pull_number}:`, error);
            let message = "Failed during KB integration.";
             if (error?.status === 404) { message = `Could not fetch diff for PR #${pull_number}.`; }
             else if (error?.response?.data) { message = `LLM API error during KB integration: ${JSON.stringify(error.response.data)}`; }
             else if (error instanceof Error) { message = error.message; }
            // Ensure the final catch block also returns ok: false as const
            return { ok: false as const, message: message };
        }
    },
}); 