import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { memory } from "./memory";
import { agentInstructions } from "./instruction";

// 导入结构化数据工具
import { saveStructuredDataTool } from "./tools/saveStructuredDataTool";
import { queryStructuredDataTool } from "./tools/queryStructuredDataTool"; // 导入查询工具

export const personalDevAssistantAgent = new Agent({
  name: "personalDevAssistant",
  instructions: agentInstructions,
  memory,
  model: openai("gpt-4o-mini"),
  // 添加 tools 配置，注册两个工具
  tools: {
    saveStructuredData: saveStructuredDataTool,
    queryStructuredData: queryStructuredDataTool, // 注册查询工具
  }
});