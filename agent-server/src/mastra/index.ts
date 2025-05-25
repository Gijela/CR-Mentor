import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { prAnalyzeAgent } from './agent/prAnalyze';
import { commitsAnalyzeAgent } from './agent/commitsAnalyze';
import { dbChatAgent } from './agent/dbChat';
import { mentorMcpServer } from './mcp/server';
import { testAgent } from './agent/test';

export const mastra = new Mastra({
  agents: {
    prAnalyzeAgent,
    commitsAnalyzeAgent,
    dbChatAgent,
    testAgent,
  },
  server: {
    host: process.env.NODE_ENV !== 'development' ? '0.0.0.0' : '127.0.0.1',
    port: 4111,
    cors: {
      origin: process.env.NODE_ENV !== 'development' ? ["https://cr-mentor.com"] : "*",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: false,
    },
  },
  mcpServers: {
    mentorMcp: mentorMcpServer,
  },
  logger: createLogger({
    name: 'CR-Mentor',
    level: process.env.NODE_ENV !== 'development' ? 'info' : 'debug',
  }),
});
