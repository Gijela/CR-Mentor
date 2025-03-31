import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent, codeReviewAgent } from './agents';

export const mastra = new Mastra({
  agents: {
    weatherAgent,
    codeReviewAgent
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
