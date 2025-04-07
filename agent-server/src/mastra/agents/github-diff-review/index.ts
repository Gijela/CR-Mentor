import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import { deepSeekModel } from '../../model-provider/deepseek'; // Assuming this is the desired model
import { diffReviewInstructions } from "./instructions";
import { codebaseTools } from '../github-codebase/tools'; // Import tools like getFilePatch, getFileContent

// Define the structure for a single review finding
export const FindingSchema = z.object({
  line: z.number().nullable().describe("Relevant line number in the diff (null for file-level comments)"),
  severity: z.enum(['critical', 'major', 'minor', 'info']).describe("Severity of the finding"),
  category: z.enum(['logic', 'style', 'security', 'test', 'readability', 'performance', 'docs', 'other']).describe("Category of the finding"),
  comment: z.string().describe("The constructive review comment detailing the issue and suggestion")
});

// Define the overall output schema for the diff review agent
export const DiffReviewOutputSchema = z.object({
  filePath: z.string().describe("The path of the file reviewed"),
  findings: z.array(FindingSchema).describe("List of findings for the file diff. Empty if no issues found."),
  // Optional: Add an error field in case agent execution fails internally
  error: z.string().optional().describe("Error message if the review process failed for this file")
});

// Instantiate the github-diff-review agent
export const githubDiffReviewAgent = new Agent({
  name: "github-diff-review-agent",
  model: deepSeekModel, // Or choose another appropriate model
  instructions: diffReviewInstructions,
  tools: {
    // Provide the necessary tools for diff analysis and context fetching
    getFilePatch: codebaseTools.getFilePatch,
    getFileContent: codebaseTools.getFileContent,
    // Add other codebaseTools if needed (e.g., getRepositoryCommits for history)
  },
  // Configure structured output using the defined Zod schema
  // Use experimental_output for potentially better adherence with complex schemas
  experimental_output: {
    format: "json",
    schema: DiffReviewOutputSchema,
  }
  // Alternatively, use the standard 'output' if preferred:
  // output: {
  //   format: "json",
  //   schema: DiffReviewOutputSchema,
  // }
}); 