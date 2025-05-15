import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { prAnalyzeAgent } from './agent/prAnalyze';
import { commitsAnalyzeAgent } from './agent/commitsAnalyze';
import { dbChatAgent } from './agent/dbChat';

export const mastra = new Mastra({
  agents: {
    prAnalyzeAgent,
    commitsAnalyzeAgent,
    dbChatAgent,
  },
  server: {
    host: '0.0.0.0',
    port: 4111,
  },
  logger: createLogger({
    name: 'CR-Mentor',
    level: 'info',
  }),
});
