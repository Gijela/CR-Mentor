
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent, githubTokenAgent } from './agents';

export const mastra = new Mastra({
  agents: { weatherAgent, githubTokenAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
