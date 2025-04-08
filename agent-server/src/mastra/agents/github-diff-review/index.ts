import { Agent } from '@mastra/core'; // Assuming Agent type is available
import { z } from 'zod';
// Assuming a model provider setup exists, adjust import as needed
import { deepSeekModel } from '../../model-provider/deepseek';
import { diffReviewInstructions } from './instructions'; // Use updated instructions
import { diffReviewTools } from './tools'; // Use the updated tools export

// Define the structure for a single review finding
export const FindingSchema = z.object({
  line: z
    .number()
    .nullable()
    .describe(
      'Relevant line number in the diff (null for file-level or external dependency comments)'
    ),
  severity: z
    .enum(['critical', 'major', 'minor', 'info'])
    .describe('Severity of the finding'),
  category: z
    .enum([
      'logic',
      'style',
      'security',
      'test',
      'readability',
      'performance',
      'docs',
      'other',
    ])
    .describe('Category of the finding'),
  comment: z
    .string()
    .describe(
      'The constructive review comment detailing the issue, suggestion, or external dependency note.'
    ),
});

// Define the overall output schema for the diff review agent
// This schema should be referenced in the instructions and potentially
// by the calling code when using generate with specific output format options.
export const DiffReviewOutputSchema = z.object({
  filePath: z.string().describe('The path of the file reviewed'),
  findings: z
    .array(FindingSchema)
    .describe(
      'List of findings for the file diff. Empty if no issues found. Includes mandatory comments on external dependency interactions if applicable.'
    ),
  error: z
    .string()
    .optional()
    .describe('Error message if the review process failed for this file'),
});

/**
 * GitHub Diff Review Agent (Single File Focus)
 *
 * This agent reviews the diff/patch of a single file within the context of its full content.
 * It relies on externally provided inputs like file content and patch, typically fetched
 * via GitHub APIs in the calling environment (e.g., by a main review orchestrator agent).
 *
 * Expected inputs during agent execution (passed to generate or available in context):
 * - filePath: string
 * - prDescription: string
 * - diffPatch: string (obtained via getFilePatch tool)
 * - fullFileContent: string (obtained via getFileContentFromRepo tool)
 * - owner: string (needed for tools)
 * - repo: string (needed for tools)
 * - ref: string (PR head commit SHA, needed for getFileContentFromRepo)
 * - pull_number: number (needed for getFilePatch)
 * - githubToken: string (or equivalent auth mechanism for tools)
 */
export const githubDiffReviewAgent = new Agent({
  name: 'github-diff-review-agent-v2', // Consider versioning the name
  model: deepSeekModel, // Or your preferred model
  instructions: diffReviewInstructions, // Use updated instructions
  tools: diffReviewTools, // Use updated tools
  // Output format/schema is now primarily enforced by the instructions
  // and potentially specified during the .generate() call by the consumer.
  // Adjust steps/retries as needed
  // maxSteps: 10,
  // maxRetries: 2,
}); 