import { Agent } from "@mastra/core/agent";

import { instructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { globalTools } from "../../global-tools";
import { memory } from "./memory";
import { mcpClient } from "../../mcp/clinet";

const mcpTools = await mcpClient.getTools();

export const dbChatAgent = new Agent({
  name: "Chat Agent",
  instructions,
  memory,
  model: deepSeekModel,
  tools: { ...globalTools, ...mcpTools },
});
