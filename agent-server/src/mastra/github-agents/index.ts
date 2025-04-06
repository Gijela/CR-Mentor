import { Agent } from "@mastra/core/agent";

import { deepSeekModel } from '../model-provider/deepseek';

import {
  repoAnalysisInstructions,
  codeReviewInstructions
} from "./instructions";
// import { githubAgentMemory } from "./memory";

import {
  getFileContent,
  getFilePaths,
  getRepositoryIssues,
  getRepositoryCommits,
  getRepositoryPullRequests,
  getRepositoryStars
} from "./tools";

// 仓库代码管家
export const githubAgent = new Agent({
  name: "github-agent",
  model: deepSeekModel,
  instructions: repoAnalysisInstructions,
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

// 代码审查专家
export const codeReviewAgent = new Agent({
  name: "code-review-agent",
  model: deepSeekModel,
  instructions: codeReviewInstructions,
  tools: {
  },
});
