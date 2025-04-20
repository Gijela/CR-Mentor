import { Agent } from "@mastra/core/agent";

import { deepSeekModel } from '../../model-provider/deepseek';
import { reviewGroupInstructions } from "./instructions";
// import { githubAgentMemory } from "./memory";
import { getFileContent } from "./tools/get-file-content";
import { getRepoFilesPath } from "./tools/get-repo-files-path";

export const reviewGroupAgent = new Agent({
  name: "github-review-group-agent",
  model: deepSeekModel,
  instructions: reviewGroupInstructions,
  // memory: githubAgentMemory,
  tools: {
    getFileContent,
    getRepoFilesPath,
  },
});
