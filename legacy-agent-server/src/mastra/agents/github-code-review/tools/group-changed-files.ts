import { z } from 'zod';
import { Tool } from '@mastra/core/tools';
import {
  groupChangedFilesBasedOnDeps,
  FileGroup, // Assuming FileGroup interface is exported from split-group
} from '../../github-pr-groups-builder/lib/group-changed-files'; // Adjust path as necessary

// --- Define Schemas based on the expected input/output of groupChangedFilesBasedOnDeps ---

// Schema for individual changed files needed by the grouping function
const ChangedFileSchema = z.object({
  filename: z.string(),
  status: z.enum(['added', 'modified', 'removed', 'renamed']),
  // Note: Other fields from getPullRequestDetail like changes, additions are ignored here
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
    .describe("List of changed files obtained from pull request details (e.g., output of getPullRequestDetail tool's 'files' field)."),
  dependencyGraph: DependencyGraphSchema
    .describe("The project's dependency graph (e.g., output of getGithubActionArtifactContent tool)."),
});

// Schema for the output structure (FileGroup)
const FileGroupSchema = z.object({
  type: z.string().describe("Category of the group (e.g., 'dependency_group', 'docs', 'config_or_dependencies', 'ignored', 'removed', 'workflow', 'isolated_change')."),
  reason: z.string().describe("Explanation for why these files are grouped together."),
  files: z.array(z.string()).describe("List of file paths belonging to this group."),
});

// Output Schema for the Tool
const GroupChangedFilesOutputSchema = z.array(FileGroupSchema)
  .describe("An array of file groups, where each group contains files related by dependency or category.");


// --- Define the Tool ---

export const groupChangedFilesTool = new Tool({
  id: 'groupChangedFilesTool', // Unique identifier
  description:
    'Groups a list of changed files based on their interdependencies (using a provided dependency graph) and predefined categories (like docs, config, removed, ignored). Useful for organizing files before detailed code review.',
  inputSchema: GroupChangedFilesInputSchema,
  outputSchema: GroupChangedFilesOutputSchema,
  execute: async ({ context }: { context: z.infer<typeof GroupChangedFilesInputSchema> }): Promise<z.infer<typeof GroupChangedFilesOutputSchema>> => {
    // Destructure the validated input from the context
    const { changedFileList, dependencyGraph } = context;

    try {
      console.log(`Grouping ${changedFileList.length} changed files...`);
      // Call the actual grouping function (imported from lib)
      // Ensure the input data structures match what the function expects.
      // Zod validation helps here, but TypeScript interfaces should align.
      const fileGroups: FileGroup[] = groupChangedFilesBasedOnDeps(
        changedFileList, // Assuming ChangedFileSchema aligns with the function's expected ChangedFile[]
        dependencyGraph  // Assuming DependencyGraphSchema aligns with the function's expected DependencyGraph
      );
      console.log(`Successfully grouped files into ${fileGroups.length} groups.`);
      return fileGroups;

    } catch (error: any) {
      console.error('Error during file grouping:', error);
      // Decide error handling strategy:
      // 1. Rethrow the error (might halt the agent if not caught upstream)
      // throw error;
      // 2. Return an empty list (allows agent to potentially continue, but loses grouping info)
      // return [];
      // 3. Return a specific error structure (if outputSchema allows via .or())
      // For now, returning empty list to avoid crashing, but logging the error.
      // Consider adding an error indicator to the output schema if needed.
      return [];
    }
  },
}); 