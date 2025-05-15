import { Agent } from "@mastra/core/agent";

import { instructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { globalTools } from "../../global-tools";
import { memory } from "./memory";

export const dbChatAgent = new Agent({
  name: "dbChatAgent",
  instructions,
  memory,
  model: deepSeekModel,
  tools: globalTools,
});
