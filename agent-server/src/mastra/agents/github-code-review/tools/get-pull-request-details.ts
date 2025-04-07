import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

// Input schema: owner, repo, pull_number
const inputSchema = z.object({
  owner: z.string().describe("The owner of the repository (e.g., 'facebook')."),
  repo: z.string().describe("The name of the repository (e.g., 'react')."),
  pull_number: z.number().int().positive().describe("The number of the pull request."),
});

// Output schema: detailed PR information WITHOUT raw diff or file patches

// Define a simple structure for linked issues
interface LinkedIssue {
    number: number;
    title: string;
    url: string;
    state: string;
}

// Define the structure for the output
const outputSchema = z.object({
  metadata: z.object({
    title: z.string(),
    description: z.string().nullable(),
    author: z.string().nullable(),
    url: z.string().url(),
    state: z.enum(["open", "closed"]),
    number: z.number().int(),
    baseRef: z.string().describe("Base branch name"),
    headRef: z.string().describe("Head branch name"),
  }),
  associatedIssues: z.array(z.object({
      number: z.number().int(),
      title: z.string(),
      url: z.string().url(),
      state: z.string(),
  })).describe("Issues linked to the PR"),
  comments: z.array(z.object({
      id: z.number().int(),
      user: z.string().nullable(),
      body: z.string().nullable(),
      createdAt: z.string(),
      url: z.string().url(),
  })).describe("Comments on the PR"),
  files: z.array(z.object({
    filename: z.string(),
    status: z.enum(['added', 'modified', 'removed', 'renamed']),
    changes: z.number().int(),
    additions: z.number().int(),
    deletions: z.number().int(),
    // patch: z.string().optional().describe("Raw patch text provided by GitHub"), // REMOVED patch
  })).describe("Files changed in the PR (metadata only, no patch content)"),
  // rawDiff: z.string().describe("The full raw diff text for the PR."), // REMOVED rawDiff
}).or(z.object({ // Error case
    ok: z.literal(false),
    message: z.string().describe("Error message"),
}));


export const getPullRequestDetails = new Tool({
  id: "getPullRequestDetails",
  description: "Fetches comprehensive details for a specific Pull Request, including metadata, associated issues, comments, and a list of changed files (WITHOUT the full diff or file patches).", // UPDATED description
  inputSchema,
  outputSchema,
  execute: async ({ context }) => {
    const { owner, repo, pull_number } = context;

    try {
      // 1. Get PR Metadata
      const prResponse = await GithubAPI.rest.pulls.get({
        owner,
        repo,
        pull_number,
      });
      const prData = prResponse.data;

      // 2. Get PR Comments
      const commentsResponse = await GithubAPI.rest.issues.listComments({
        owner,
        repo,
        issue_number: pull_number,
        per_page: 100,
      });
      const comments = commentsResponse.data.map(c => ({
        id: c.id,
        user: c.user?.login ?? null,
        body: c.body ?? null,
        createdAt: c.created_at,
        url: c.html_url,
      }));

      // 3. Get PR Files (metadata only)
      const filesResponse = await GithubAPI.rest.pulls.listFiles({
        owner,
        repo,
        pull_number,
        per_page: 100,
      });
      const files = filesResponse.data.map(f => ({
          filename: f.filename,
          status: f.status as 'added' | 'modified' | 'removed' | 'renamed',
          changes: f.changes,
          additions: f.additions,
          deletions: f.deletions,
          // patch: f.patch, // REMOVED patch assignment
      }));

      // 4. REMOVED Raw Diff Fetching
      /* 
      const diffResponse = await GithubAPI.rest.pulls.get({
          owner,
          repo,
          pull_number,
          mediaType: {
              format: 'diff',
          },
      });
      const rawDiff = diffResponse.data as unknown as string;
      */

      // 5. REMOVED Diff Parsing Step

      // 6. Find Associated Issues (basic regex from description)
      const issueRegex = /#(\d+)/g;
      const linkedIssueNumbers = new Set<number>();
      if (prData.body) {
          let match;
          while ((match = issueRegex.exec(prData.body)) !== null) {
              linkedIssueNumbers.add(parseInt(match[1], 10));
          }
      }
      const associatedIssues: LinkedIssue[] = []; // Keep this simple for now

      // 7. Construct the final output object (without rawDiff)
      const result = {
        metadata: {
          title: prData.title,
          description: prData.body ?? null,
          author: prData.user?.login ?? null,
          url: prData.html_url,
          state: prData.state as "open" | "closed",
          number: prData.number,
          baseRef: prData.base.ref,
          headRef: prData.head.ref,
        },
        associatedIssues,
        comments,
        files: files, // Now contains only file metadata
        // rawDiff, // REMOVED rawDiff field
      };

      return result;

    } catch (error: any) {
      console.error(`Error fetching details for PR #${pull_number} in ${owner}/${repo}:`, error);
      let message = "Failed to fetch pull request details.";
      if (error.status === 404) {
          message = `Pull Request #${pull_number} not found in ${owner}/${repo}.`;
      } else if (error.status === 403 || error.status === 401) {
          message = `Permission denied fetching details for PR #${pull_number}. Check GITHUB_TOKEN permissions.`;
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