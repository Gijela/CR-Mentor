
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { prAnalyzeAgent } from './agent/prAnalyze';
import { commitsAnalyzeAgent } from './agent/commitsAnalyze';

export const mastra = new Mastra({
  agents: {
    prAnalyzeAgent,
    commitsAnalyzeAgent,
  },
  logger: createLogger({
    name: 'CR-Mentor',
    level: 'debug',
  }),
});
