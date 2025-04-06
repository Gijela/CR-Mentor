import { Agent } from "@mastra/core/agent";

import { openaiProxyModel } from '../provider/openai-proxy';
import { instructions } from "./instructions";
// import { githubAgentMemory } from "./memory";

import {
  getFileContent,
  getFilePaths,
  getRepositoryIssues,
  getRepositoryCommits,
  getRepositoryPullRequests,
  getRepositoryStars
} from "./tools";

export const githubAgent = new Agent({
  name: "github-agent",
  model: openaiProxyModel,
  instructions,
  // memory: githubAgentMemory,
  tools: {
    getFilePaths,
    getFileContent,
    getRepositoryIssues,
    getRepositoryCommits,
    getRepositoryPullRequests,
    getRepositoryStars,
  },
});
