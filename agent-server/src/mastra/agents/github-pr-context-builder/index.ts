import { Agent } from "@mastra/core/agent";

import { deepSeekModel } from '../../model-provider/deepseek';
import { contextBuilderInstructions } from "./instructions";
import { contextBuilderTools } from "./tools";

export const PRContextBuilderAgent = new Agent({
  name: "github-pr-context-builder",
  model: deepSeekModel,
  instructions: contextBuilderInstructions,
  tools: contextBuilderTools,
});
