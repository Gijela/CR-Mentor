import { MCPClient } from "@mastra/mcp";

const isDev = process.env.NODE_ENV !== 'production';

const testEnvMcp = {
  command: "pnpx", // need to install pnpm first, or you can use 'npx'
  args: ["tsx", "../../src/mastra/mcp/server/devStdio.ts"],
  env: { // 可选的环境变量
    MOCK_API_KEY: "test-api-key-1234567890",
  },
  logger: (logMessage: any) => { // 可选的日志处理器
    console.log(`[MCP ===>] [${logMessage.level}] ${logMessage.message}`);
  },
};

const prodEnvMcp = {
  url: new URL("https://agent.cr-mentor.com/api/servers/mentorMcp/mcp"),
  // requestInit: {
  //   headers: {
  //     Authorization: "Bearer your-auth-token",
  //   },
  // },
}

// 本地使用 Stdio 获取即时的 mcp 工具服务，生产环境使用 Streamable HTTP 或 SSE
export const mcpClient = new MCPClient({
  servers: {
    /**
     * [DEV]: Stdio; 
     * [PROD]: Streamable HTTP 或 SSE
     * */
    mentorMcp: isDev ? testEnvMcp : prodEnvMcp,
  },
});