import { Octokit } from "octokit";

export const GithubAPI = new Octokit({
  auth: process.env.GITHUB_TOKEN!,
});