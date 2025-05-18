
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { agents } from './agents';

export const mastra = new Mastra({
  agents,
  logger: createLogger({
    name: 'Mastra',
    level: 'debug',
  }),
});
