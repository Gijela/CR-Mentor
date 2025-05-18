import { Agent } from "@mastra/core/agent";

import { instructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { mcpClient } from "../../mcp/clinet";

// 获取 mcp 工具
const mcpTools = await mcpClient.getTools();

export const commitsAnalyzeAgent = new Agent({
  name: "Commits Analyze Agent",
  instructions,
  model: deepSeekModel,
  tools: { ...mcpTools },
});