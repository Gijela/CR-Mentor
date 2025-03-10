import { createLogger } from "@mastra/core/logger"
import { Mastra } from "@mastra/core/mastra"

import { codeReviewAgent } from "./agents/codeReview"

export const mastra = new Mastra({
  agents: { codeReviewAgent },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
})
