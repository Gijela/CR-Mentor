import { Agent } from "@mastra/core/agent";

import { deepSeekModel } from '../../model-provider/deepseek';
import { repoAnalysisInstructions } from "./instructions";
// import { githubAgentMemory } from "./memory";
import { codebaseTools } from "./tools";

export const githubCodebaseAgent = new Agent({
  name: "github-codebase-agent",
  model: deepSeekModel,
  instructions: repoAnalysisInstructions,
  // memory: githubAgentMemory,
  tools: codebaseTools,
});
