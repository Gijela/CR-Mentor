import { Agent } from "@mastra/core/agent";

import { deepSeekModel } from '../../model-provider/deepseek';
import { reviewGroupInstructions } from "./instructions";
// import { githubAgentMemory } from "./memory";
import { getFileContent } from "./tools/get-file-content";
import { getDiffsContent } from "./tools/get-diffs-content";
import { prSummary } from "./tools/pr-summary";
import { fileComment } from "./tools/file-comment";

export const reviewGroupAgent = new Agent({
  name: "github-review-group-agent",
  model: deepSeekModel,
  instructions: reviewGroupInstructions,
  // memory: githubAgentMemory,
  tools: {
    getFileContent,
    getDiffsContent,
    fileComment,
    // prSummary,
  },
});
