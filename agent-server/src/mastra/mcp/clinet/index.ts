import { MCPClient } from "@mastra/mcp";

// const isDev = process.env.NODE_ENV !== 'production';

// const testEnvUseMentorMcp = {
//   command: "pnpx",
//   args: ["tsx", "src/mastra/mcp/server/index.ts"],
// };

export const mcpClient = new MCPClient({
  servers: {
    // Stdio 服务器示例 (例如，运行一个本地的 MCP server 脚本)
    // myLocalServer: {
    //   command: "npx", // 或者 "node", "python" 等
    //   args: ["tsx", "path/to/your/mcp-server-script.ts"], // 脚本路径和参数
    //   // env: { // 可选的环境变量
    //   //   API_KEY: "your-server-api-key",
    //   // },
    //   // logger: (logMessage) => { // 可选的日志处理器
    //   //   console.log(`[${logMessage.level}] ${logMessage.message}`);
    //   // },
    // },
    // HTTP 服务器示例 (Streamable HTTP 或 SSE)
    mentorMcp: {
      url: new URL("https://agent.cr-mentor.com/api/servers/myMcpServer/mcp"),
      // requestInit: {
      //   headers: {
      //     Authorization: "Bearer your-auth-token",
      //   },
      // },
    },
  },
  // timeout: 30000, // 可选的全局超时设置 (毫秒)
});