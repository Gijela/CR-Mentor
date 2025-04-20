import { GithubAPI } from "../../../lib/github";
import { Tool } from "@mastra/core/tools";
import { z } from "zod";

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
    headSha: z.string().describe("Head commit SHA"),
    associatedIssues: z.array(z.object({
      number: z.number().int(),
      title: z.string(),
      url: z.string().url(),
      state: z.string(),
    })).describe("Issues linked to the PR"),
  }),
  files: z.array(z.object({
    filename: z.string(),
    status: z.enum(['added', 'modified', 'removed', 'renamed']),
    changes: z.number().int(),
    additions: z.number().int(),
    deletions: z.number().int(),
    // patch: z.string().optional().describe("Raw patch text provided by GitHub"), // REMOVED patch
  })).describe("Files changed in the PR (metadata only, no patch content)"),
  commits: z.array(z.object({
    message: z.string(),
    date: z.string().nullable(),
  })).describe("Commits messages with the PR"),
  // rawDiff: z.string().describe("The full raw diff text for the PR."), // REMOVED rawDiff
}).or(z.object({ // Error case
  ok: z.literal(false),
  message: z.string().describe("Error message"),
}));

export const getPrDetail = new Tool({
  id: "getPrDetail",
  description: "Fetches comprehensive details for a specific Pull Request, including metadata, associated issues, comments, a list of changed files (WITHOUT the full diff or file patches), and commit messages.", // UPDATED description
  inputSchema: z.object({
    owner: z.string().describe("The owner of the repository (e.g., 'facebook')."),
    repo: z.string().describe("The name of the repository (e.g., 'react')."),
    pull_number: z.number().int().positive().describe("The number of the pull request."),
  }),
  outputSchema,
  execute: async ({ context }) => {
    const { owner, repo, pull_number } = context;

    try {
      // 1. Concurrently fetch PR metadata, files, and commits
      const [prResponse, filesResponse, commitsResponse] = await Promise.all([
        GithubAPI.rest.pulls.get({ owner, repo, pull_number }),
        GithubAPI.rest.pulls.listFiles({ owner, repo, pull_number, per_page: 100 }),
        GithubAPI.rest.pulls.listCommits({ owner, repo, pull_number, per_page: 100 }),
      ]);

      // 2. metadata and associated issues
      const prData = prResponse.data;
      // if (prData) {
      const associatedIssues = await getAssociatedIssues(prData, owner, repo);
      const metadata = {
        title: prData.title,
        description: prData.body ?? null,
        author: prData.user?.login ?? null,
        url: prData.html_url,
        state: prData.state as "open" | "closed",
        number: prData.number,
        baseRef: prData.base.ref,
        headRef: prData.head.ref,
        headSha: prData.head.sha,
        associatedIssues,
      }

      // 3. changed files
      const files = filesResponse.data.map(f => ({
        filename: f.filename,
        status: f.status as 'added' | 'modified' | 'removed' | 'renamed',
        changes: f.changes,
        additions: f.additions,
        deletions: f.deletions,
      }));

      // 4. commits messages
      const commits = commitsResponse.data.map(c => ({
        message: c.commit.message,
        date: c.commit.author?.date ?? null,
      }));

      return {
        metadata,
        files,
        commits,
        // rawDiff, // REMOVED rawDiff field
      };
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
      // Handle potential errors from Promise.all if one of the core requests fails
      // This catch block will handle errors from the initial Promise.all
      return {
        ok: false as const,
        message: message,
      };
    }
  },
});


// Find and concurrently fetch associated issues
const getAssociatedIssues = async (prData: any, owner: string, repo: string) => {
  const issueRegex = /#(\d+)/g;
  const linkedIssueNumbers = new Set<number>();
  if (prData.body) {
    let match;
    while ((match = issueRegex.exec(prData.body)) !== null) {
      linkedIssueNumbers.add(parseInt(match[1], 10));
    }
  }

  const associatedIssues: { number: number, title: string, url: string, state: string }[] = [];
  if (linkedIssueNumbers.size > 0) {
    const issuePromises = Array.from(linkedIssueNumbers).map(issueNumber =>
      GithubAPI.rest.issues.get({ owner, repo, issue_number: issueNumber })
    );

    // Use Promise.allSettled to handle both fulfilled and rejected promises
    const issueResults = await Promise.allSettled(issuePromises);

    issueResults.forEach(result => {
      if (result.status === 'fulfilled') {
        const issueData = result.value.data; // Access result.value.data for fulfilled promises
        associatedIssues.push({
          number: issueData.number,
          title: issueData.title,
          url: issueData.html_url,
          state: issueData.state,
        });
      } else { // result.status === 'rejected'
        // Need to extract issueNumber from the rejection reason if possible,
        // but the original error object doesn't directly contain it.
        // We can log the error reason directly.
        const error = result.reason;
        // Log the error but continue processing other issues
        // Attempt to get more details from the error if it's an Octokit error
        const issueNumberStr = error?.request?.url?.match(/issues\/(\d+)/)?.[1] || 'unknown';
        console.warn(`Could not fetch details for linked issue #${issueNumberStr} in ${owner}/${repo}: ${error?.message || error}`);
        // Optionally add a placeholder or skip the issue
      }
    });
  }
  return associatedIssues;
}
