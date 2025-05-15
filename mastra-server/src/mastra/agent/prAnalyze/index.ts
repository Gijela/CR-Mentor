import { Agent } from "@mastra/core/agent";

import { globalTools } from "../../global-tools";
import { instructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { githubFileCommentTool } from "./tools/githubFileCommentTool";
import { githubPrSummaryTool } from "./tools/githubPrSummaryTool";

export const prAnalyzeAgent = new Agent({
  name: "prAnalyzeAgent",
  instructions,
  model: deepSeekModel,
  tools: {
    ...globalTools,
    githubFileComment: githubFileCommentTool,
    githubPrSummary: githubPrSummaryTool,
  },
});