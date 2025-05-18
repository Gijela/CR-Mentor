import { z } from 'zod';
import { Tool } from '@mastra/core/tools';
import { GithubAPI } from '../../../lib/github';
import AdmZip from 'adm-zip';

interface SimplifiedGraph {
  [key: string]: {
    dependencies: string[];
    dependents: string[];
  };
}
const GetGithubActionArtifactContentInputSchema = z.object({
  owner: z.string().describe('Owner of the GitHub repository'),
  repo: z.string().describe('Name of the GitHub repository'),
  head_sha: z
    .string()
    .describe(
      'Commit SHA associated with the workflow run (e.g., PR head SHA)'
    ),
  artifact_name: z.string().describe("Exact name of the artifact to download, Default is 'dependency-graphs'"),
});

const GetGithubActionArtifactContentOutputSchema = z.record(z.string(), z.object({
  dependencies: z.array(z.string()).describe('List of files this file depends on.'),
  dependents: z.array(z.string()).describe('List of files that depend on this file.'),
}));

/**
 * Fetches the content of a specific file within a GitHub Action artifact.
 */
export const getGithubActionArtifactContent = new Tool({
  id: 'getGithubActionArtifactContent', // Use id instead of name
  description:
    'Downloads a named artifact from the latest successful GitHub Action workflow run for a specific commit SHA, parses it, and returns a *simplified* JSON string containing only internal module dependencies and dependents.',
  inputSchema: GetGithubActionArtifactContentInputSchema,
  outputSchema: GetGithubActionArtifactContentOutputSchema,
  // Correct execute signature and input access
  execute: async ({ context }: { context: z.infer<typeof GetGithubActionArtifactContentInputSchema> }): Promise<SimplifiedGraph> => {
    // Destructure input directly from context
    const { owner, repo, head_sha, artifact_name } = context;
    try {
      // 1. Find the latest successful workflow run for the head_sha
      console.log(`Searching workflow runs for ${owner}/${repo} at ${head_sha}`);
      const runsResponse = await GithubAPI.rest.actions.listWorkflowRunsForRepo({
        owner,
        repo,
        head_sha,
        status: 'success',
      });

      if (runsResponse.data.total_count === 0) {
        throw new Error(
          `No successful workflow runs found for SHA ${head_sha}`
        );
      }
      const latestRun = runsResponse.data.workflow_runs.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      const run_id = latestRun.id;
      console.log(`Found latest successful run ID: ${run_id}`);

      // 2. Find the artifact ID by name within that run
      console.log(`Searching for artifact named "${artifact_name}" in run ${run_id}`);
      const artifactsResponse =
        await GithubAPI.rest.actions.listWorkflowRunArtifacts({
          owner,
          repo,
          run_id,
        });
      const targetArtifact = artifactsResponse.data.artifacts.find(
        (artifact) => artifact.name === artifact_name
      );
      if (!targetArtifact) {
        throw new Error(
          `Artifact named "${artifact_name}" not found in run ${run_id}`
        );
      }
      const artifact_id = targetArtifact.id;
      console.log(`Found artifact ID: ${artifact_id}`);

      // 3. Download the artifact
      console.log(`Downloading artifact ID: ${artifact_id}`);
      const downloadResponse =
        await GithubAPI.rest.actions.downloadArtifact({
          owner,
          repo,
          artifact_id,
          archive_format: 'zip',
        });

      // Check status code (assuming 200 on success after potential redirects)
      if ((downloadResponse.status as number) !== 200 || !downloadResponse.data) {
        throw new Error(`Failed to download artifact. Status: ${downloadResponse.status}, Data received: ${!!downloadResponse.data}`);
      }

      const zipBuffer = Buffer.from(downloadResponse.data as ArrayBuffer);

      // 4. Unzip and read the first file's content
      console.log(`Unzipping artifact...`);
      const zip = new AdmZip(zipBuffer);
      const zipEntries = zip.getEntries();

      if (!zipEntries || zipEntries.length === 0) {
        throw new Error('Artifact zip archive is empty or could not be read.');
      }

      const firstEntry = zipEntries[0];
      console.log(`Reading content from file: ${firstEntry.entryName}`);
      const fileContent = firstEntry.getData().toString('utf8');

      // --- START: Parse and Simplify Dependency Graph ---
      console.log('Parsing and simplifying dependency graph...');
      const rawGraphData = JSON.parse(fileContent);
      const simplifiedGraph: SimplifiedGraph = {};

      // make graph simplified
      if (rawGraphData && Array.isArray(rawGraphData.modules)) {
        for (const module of rawGraphData.modules) {
          // Filter out external/core modules (basic check)
          if (module.coreModule === true || !module.source || !module.source.startsWith('src/')) {
            continue;
          }

          const source = module.source;

          // Process dependencies: keep only resolved paths to internal modules
          const internalDependencies = (module.dependencies || [])
            .filter((dep: any) =>
              dep.resolved &&
              dep.coreModule === false &&
              dep.resolved.startsWith('src/') // Ensure dependency is also internal
            )
            .map((dep: any) => dep.resolved);

          // Keep dependents (assuming they are internal paths)
          const dependents = module.dependents || [];

          simplifiedGraph[source] = {
            dependencies: internalDependencies,
            dependents: dependents,
          };
        }
      } else {
        console.warn('Could not find "modules" array in the artifact content.');
      }

      return simplifiedGraph;

    } catch (error: any) {
      console.error('Error in getGithubActionArtifactContent:', error);
      // Ensure error message is also returned as a JSON string for consistency
      const errorMessage = `Failed to get or process artifact content: ${error.message || 'Unknown error'}`;
      return { error: errorMessage } as any;
    }
  },
}); 