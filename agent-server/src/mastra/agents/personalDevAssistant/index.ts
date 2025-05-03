import { Agent } from "@mastra/core/agent";

import { memory } from "./memory";
import { agentInstructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";

export const personalDevAssistantAgent = new Agent({
  name: "personalDevAssistant",
  instructions: agentInstructions,
  memory,
  model: deepSeekModel,
});