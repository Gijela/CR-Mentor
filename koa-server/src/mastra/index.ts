
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { personalDevAssistantAgent } from './agent/personalDevAssistant';

export const mastra = new Mastra({
  agents: {
    personalDevAssistantAgent,
  },
  logger: createLogger({
    name: 'CR-Mentor',
    level: 'debug',
  }),
});
