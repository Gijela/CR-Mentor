import { Agent } from "@mastra/core/agent";

import { instructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { githubFileCommentTool } from "./tools/githubFileCommentTool";
import { githubPrSummaryTool } from "./tools/githubPrSummaryTool";
import { mcpClient } from "../../mcp/clinet";

// 获取 mcp 工具
const mcpTools = await mcpClient.getTools();

export const prAnalyzeAgent = new Agent({
  name: "PR Analyze Agent",
  instructions,
  model: deepSeekModel,
  tools: {
    ...mcpTools,
    githubFileComment: githubFileCommentTool,
    githubPrSummary: githubPrSummaryTool,
  },
});