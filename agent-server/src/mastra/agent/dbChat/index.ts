import { Agent } from "@mastra/core/agent";

import { instructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { memory } from "./memory";
import { mcpTools } from "../../mcp/tools";

export const dbChatAgent = new Agent({
  name: "Chat Agent",
  instructions,
  memory,
  model: deepSeekModel,
  tools: { ...mcpTools },
});
