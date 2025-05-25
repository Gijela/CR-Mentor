import { Agent } from "@mastra/core/agent";

import { instructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { mcpClient } from "../../mcp/clinet";

const testTools = await mcpClient.getTools();

export const testAgent = new Agent({
  name: "Test Agent",
  instructions,
  model: deepSeekModel,
  tools: testTools
});
