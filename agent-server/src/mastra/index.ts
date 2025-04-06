
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent, githubTokenAgent } from './example-agents';
import { githubAgent, codeReviewAgent } from './github-agents';

export const mastra = new Mastra({
  agents: {
    weatherAgent,
    githubTokenAgent,
    githubAgent,
    codeReviewAgent,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
