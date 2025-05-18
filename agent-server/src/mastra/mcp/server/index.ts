import { MCPServer } from '@mastra/mcp';
import { globalTools } from '../../global-tools';

export const mentorMcpServer = new MCPServer({
  name: 'CR-Mentor MCP Server',
  version: '1.0.0',
  tools: globalTools,
});
