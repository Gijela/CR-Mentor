import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { mcpTools } from '../tools';

// 把导出的 mcpTools 配置到本地 mcp 服务中
const server = new Server(
  {
    name: 'CR-Mentor [dev] MCP Server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: Object.entries(mcpTools).map(([key, tool]) => ({
    name: key,
    description: tool.description,
    inputSchema: zodToJsonSchema(tool.inputSchema),
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async request => {
  try {
    const toolName = request.params.name;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tool = (mcpTools as any)[toolName];

    if (tool && typeof tool.execute === 'function' && tool.inputSchema) {
      const args = tool.inputSchema.parse(request.params.arguments);
      return await tool.execute(args);
    } else {
      return {
        content: [
          {
            type: 'text',
            text: `Unknown tool: ${request.params.name}`,
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        content: [
          {
            type: 'text',
            text: `Invalid arguments: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);

export { server };
