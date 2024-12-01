import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { NextResponse } from "next/server";

/** 测试命令
 curl -X POST http://localhost:3000/api/github/agentFnCall \
  -H "Content-Type: application/json" \
  -d '{"question": "北京今天天气怎么样？"}'
*/

// 1. 改进工具实现
const weatherTool = new DynamicStructuredTool({
  name: "search",
  description: "搜索天气信息，返回具体的天气数据",
  schema: z.object({
    query: z.string().describe("要查询的城市名称"),
  }),
  func: async ({ query }) => {
    // 返回结构化的天气信息
    return JSON.stringify({
      city: query.replace(/天气$/, ""),
      temperature: "25°C",
      condition: "晴",
      wind: "东北风 3级",
      humidity: "45%",
      update_time: new Date().toLocaleString()
    });
  },
});

// 2. 优化Agent配置
let agentExecutor: AgentExecutor | null = null;

async function getOrCreateAgent() {
  if (!agentExecutor) {
    const model = new ChatOpenAI({
      configuration: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE,
      },
      modelName: 'deepseek-ai/DeepSeek-V2.5',
      temperature: 0,  // 降低随机性
    });

    // 使用更简单的初始化方式
    agentExecutor = await initializeAgentExecutorWithOptions(
      [weatherTool],
      model,
      {
        agentType: "structured-chat-zero-shot-react-description",
        verbose: true,
        maxIterations: 3,
        // 添加自定义提示
        agentArgs: {
          prefix: `你是一个天气助手。当获得天气信息后，请直接使用Final Answer返回格式化的结果。
格式要求：
1. 城市：xxx
2. 温度：xxx
3. 天气：xxx
4. 风况：xxx
5. 湿度：xxx
6. 更新时间：xxx`,
        }
      }
    );
  }
  return agentExecutor;
}

// 3. 改进路由处理
export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "问题不能为空" },
        { status: 400 }
      );
    }

    console.log("收到天气查询:", question);

    const executor = await getOrCreateAgent();
    const result = await executor.invoke({
      input: question,
    });

    // 处理结果
    if (result.output === 'Agent stopped due to max iterations.') {
      console.error("Agent执行超时:", {
        question,
        steps: result.intermediateSteps
      });
      return NextResponse.json(
        { error: "无法处理该请求，请重试" },
        { status: 408 }
      );
    }

    return NextResponse.json({
      answer: result.output,
      raw: process.env.NODE_ENV === 'development' ? result : undefined
    });

  } catch (error) {
    console.error("API错误:", error);
    return NextResponse.json(
      { error: "处理请求时发生错误" },
      { status: 500 }
    );
  }
}