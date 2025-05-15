import { Agent } from "@mastra/core/agent";

import { instructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { globalTools } from "../../global-tools";

export const commitsAnalyzeAgent = new Agent({
  name: "commitsAnalyzeAgent",
  instructions,
  model: deepSeekModel,
  tools: globalTools,
});