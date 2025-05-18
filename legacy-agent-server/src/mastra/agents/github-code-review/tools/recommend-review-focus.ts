import { Tool } from "@mastra/core/tools";
import { z } from "zod";

// Input schema: Takes the initial PR details and potentially summarized findings
// from other analysis tools. The agent will need to aggregate these before calling.

// Define schemas for the outputs of other tools that this tool might synthesize
// These are simplified examples; they should match the actual outputs
const genericFindingSchema = z.object({
    filePath: z.string().optional(),
    lines: z.string().optional(),
    description: z.string(),
    severity: z.string().optional(), // e.g., Low, Medium, High, Warning
});

const prDetailsSubsetSchema = z.object({
    metadata: z.object({ number: z.number() }), // Basic info
    files: z.array(z.object({ filename: z.string(), additions: z.number(), deletions: z.number() })),
});

const inputSchema = z.object({
    prDetails: prDetailsSubsetSchema.describe("Basic PR information like file count and size."),
    logicConsistencyFindings: z.object({ discrepancies: z.array(genericFindingSchema).optional() }).optional().describe("Findings from logic consistency check."),
    knowledgeBaseFindings: z.object({ findings: z.array(genericFindingSchema).optional() }).optional().describe("Findings from knowledge base check."),
    changeImpactFindings: z.object({ potentiallyAffected: z.array(genericFindingSchema.extend({ riskLevel: z.string().optional() })).optional() }).optional().describe("Findings from change impact analysis."),
    testRelevanceFindings: z.object({ coverageGaps: z.array(genericFindingSchema).optional() }).optional().describe("Findings from test relevance check."),
    architectureFindings: z.object({ violations: z.array(genericFindingSchema).optional() }).optional().describe("Findings from architecture adherence check."),
    projectPracticeFindings: z.object({ issues: z.array(genericFindingSchema).optional() }).optional().describe("Findings from project practices check."),
    // Add other potential inputs like complexity scores if calculated separately
});

// Output schema: Review focus recommendations
const outputSchema = z.object({
    estimatedEffort: z.enum(["Low", "Medium", "High"]).describe("An estimated effort level for human review based on size and findings."),
    focusAreas: z.array(z.object({
        filePath: z.string().describe("The file recommended for focused review."),
        lines: z.string().optional().describe("Specific line range to focus on (if applicable)."),
        reason: z.string().describe("Why this area is recommended for focus (e.g., 'High complexity', 'Multiple issues found', 'Core module impact')."),
        priority: z.enum(["High", "Medium", "Low"]).describe("Priority level for focusing on this area.")
    })).describe("A prioritized list of files or code sections recommended for human review focus."),
    overallSummary: z.string().optional().describe("A brief textual summary of the key reasons for the recommendations.")
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message during focus recommendation generation."),
}));

export const recommendReviewFocus = new Tool({
    id: "recommendReviewFocus",
    description: "Synthesizes findings from various analysis tools (logic, impact, tests, architecture, practices) and PR size to recommend specific files/areas for human reviewers to focus on, along with an estimated review effort. The synthesis logic is primarily handled by the LLM based on agent instructions.",
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
        // Core logic involves:
        // 1. Aggregating and weighting findings from the input context (various tool outputs).
        // 2. Correlating findings with file paths and PR size.
        // 3. Applying heuristics or LLM reasoning to prioritize areas and estimate effort.
        // This synthesis is orchestrated by the agent/LLM.

        console.log("Executing recommendReviewFocus tool - passing aggregated data for synthesis.");

        // Simulate successful execution for now. Actual results depend on LLM synthesis.
        // A very basic heuristic could be implemented here, but complex weighting is better left to LLM.
        let effort: "Low" | "Medium" | "High" = "Low";
        const focus: any[] = [];
        let summary = "Basic analysis suggests low effort.";

        // Example basic heuristic (replace with LLM logic):
        const totalIssues = (
            (context.logicConsistencyFindings?.discrepancies?.length ?? 0) +
            (context.knowledgeBaseFindings?.findings?.length ?? 0) +
            (context.changeImpactFindings?.potentiallyAffected?.length ?? 0) +
            (context.testRelevanceFindings?.coverageGaps?.length ?? 0) +
            (context.architectureFindings?.violations?.length ?? 0) +
            (context.projectPracticeFindings?.issues?.length ?? 0)
        );
        const totalChanges = context.prDetails.files.reduce((sum, f) => sum + f.additions + f.deletions, 0);

        if (totalIssues > 5 || totalChanges > 500) effort = "High";
        else if (totalIssues > 2 || totalChanges > 100) effort = "Medium";

        if (effort === "High") summary = "High effort recommended due to multiple findings or large change size.";
        else if (effort === "Medium") summary = "Medium effort recommended due to some findings or moderate change size.";

        // Focus areas would require more complex logic to populate meaningfully

        return {
            estimatedEffort: effort,
            focusAreas: focus, // Placeholder
            overallSummary: summary,
        };

        // Error handling
        // try {
        //    // ... aggregation logic ...
        // } catch (error: any) {
        //     return {
        //         ok: false as const,
        //         message: error.message || "Error generating review focus recommendations.",
        //     };
        // }
    },
}); 