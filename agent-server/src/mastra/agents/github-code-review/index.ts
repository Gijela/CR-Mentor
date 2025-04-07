import { Agent } from "@mastra/core/agent";

import { deepSeekModel } from '../../model-provider/deepseek';
import { codeReviewInstructions } from "./instructions";
import { codebaseTools } from "../github-codebase/tools";
import { codeReviewTools } from "./tools";

export const codeReviewAgent = new Agent({
  name: "github-code-review-agent", // Descriptive name
  model: deepSeekModel, // Use an appropriate LLM
  instructions: codeReviewInstructions,
  tools: {
    ...codebaseTools,
    ...codeReviewTools,
  },
});
