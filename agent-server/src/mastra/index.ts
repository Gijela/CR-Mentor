
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent, githubTokenAgent } from './example-agent';
import { githubAgent } from './github-agent';

export const mastra = new Mastra({
  agents: { weatherAgent, githubTokenAgent, githubAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
