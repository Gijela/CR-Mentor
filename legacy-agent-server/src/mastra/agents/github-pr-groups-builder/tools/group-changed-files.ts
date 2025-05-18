import { z } from 'zod';
import { Tool } from '@mastra/core/tools';
import {
  groupChangedFilesBasedOnDeps,
  FileGroup, // Assuming FileGroup interface is exported from split-group
} from '../lib/group-changed-files'; // Adjust path as necessary

// --- Define Schemas based on the expected input/output of groupChangedFilesBasedOnDeps ---

// Schema for individual changed files needed by the grouping function
const ChangedFileSchema = z.object({
  filename: z.string(),
  status: z.enum(['added', 'modified', 'removed', 'renamed']),
  changes: z.number(),
  additions: z.number(),
  deletions: z.number(),
}).describe("Information about a single changed file.");

// Schema for the dependency graph structure needed by the grouping function
const DependencyGraphSchema = z.record(
  z.string().describe("File path"), // Key: file path
  z.object({                         // Value: dependency info
    dependencies: z.array(z.string()).describe("List of files this file depends on."),
    dependents: z.array(z.string()).describe("List of files that depend on this file.")
  })
).describe("Object representing the dependency graph. Keys are file paths, values contain their dependencies and dependents.");

// Input Schema for the Tool
const GroupChangedFilesInputSchema = z.object({
  changedFileList: z.array(ChangedFileSchema)
    .describe("List of changed files obtained from pull request details (e.g., output of getPrDetail tool's 'files' field)."),
  dependencyGraph: DependencyGraphSchema
    .describe("The project's dependency graph (e.g., output of getGithubActionArtifactContent tool)."),
});

// Schema for the output structure (FileGroup) - MODIFIED
const FileGroupSchema = z.object({
  type: z.string().describe("Category of the group (e.g., 'dependency_group', 'docs', 'config_or_dependencies', 'ignored', 'removed', 'workflow', 'isolated_change')."),
  reason: z.string().describe("Explanation for why these files are grouped together."),
  changedFiles: z.array(z.string()).describe("List of changed file paths (from the input list) belonging to this group that require review."),
  dependencies: z.array(z.string()).describe("List of file paths that the 'changedFiles' in this group depend on (context). Excludes files within 'changedFiles'."),
  dependents: z.array(z.string()).describe("List of file paths that depend on the 'changedFiles' in this group (context). Excludes files within 'changedFiles'."),
  changes: z.number().describe("Total number of lines changed in the 'changedFiles' in this group."),
  additions: z.number().describe("Total number of lines added in the 'changedFiles' in this group."),
  deletions: z.number().describe("Total number of lines deleted in the 'changedFiles' in this group."),
}).describe("Represents a group of files, distinguishing between changed files needing review and related context files (dependencies and dependents).");

// Output Schema for the Tool - MODIFIED DESCRIPTION
const GroupChangedFilesOutputSchema = z.array(FileGroupSchema)
  .describe("An array of file groups. Each group differentiates between changed files to be reviewed and related context files (split into dependencies and dependents).");


// --- Define the Tool ---

export const groupChangedFiles = new Tool({
  id: 'groupChangedFilesTool', // Unique identifier
  description:
    'Groups a list of changed files based on their interdependencies (using a provided dependency graph) and predefined categories. Each group differentiates changed files from related context files (dependencies and dependents). Useful for organizing files before detailed code review.', // MODIFIED DESCRIPTION
  inputSchema: GroupChangedFilesInputSchema,
  outputSchema: GroupChangedFilesOutputSchema, // Uses the modified schema
  execute: async ({ context }: { context: z.infer<typeof GroupChangedFilesInputSchema> }): Promise<z.infer<typeof GroupChangedFilesOutputSchema>> => {
    // Destructure the validated input from the context
    const { changedFileList, dependencyGraph } = context;

    try {
      console.log(`Grouping ${changedFileList.length} changed files...`);
      // --- IMPORTANT --- 
      // Assuming the underlying `groupChangedFilesBasedOnDeps` function in 
      // `../../../lib/group-changed-files/index.ts` now correctly returns objects 
      // matching the NEW FileGroupSchema (with dependencies and dependents).
      const fileGroups = groupChangedFilesBasedOnDeps(
        changedFileList,
        dependencyGraph
      );
      console.log(`Successfully grouped files into ${fileGroups.length} groups.`);
      // No longer need explicit cast if lib function's return type matches FileGroup interface which now aligns with schema
      return fileGroups;

    } catch (error: any) {
      console.error('Error during file grouping:', error);
      // Returning empty list on error
      return [];
    }
  },
}); 