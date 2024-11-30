import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { BaseRetrieverInterface } from "@langchain/core/retrievers";

export const runtime = "edge";

/**
 * 将 Vercel 消息格式转换为 LangChain 消息格式
 * @param message Vercel消息对象
 * @returns LangChain消息对象
 */
const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

/**
 * 将 LangChain 消息格式转换为 Vercel 消息格式
 * @param message LangChain消息对象
 * @returns Vercel消息对象
 */
const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

// 定义机器人的系统提示模板
const AGENT_SYSTEM_TEMPLATE = `你是一个专业的助手。当用户提问时，请按照以下步骤操作：
1. 仔细分析用户问题
2. 使用search_latest_knowledge工具检索相关信息
3. 在回答开始时，先用【检索内容】开头的部分展示检索到的原始内容
4. 然后基于检索到的信息和你的知识提供准确的回答
5. 如果检索结果相关性不高，告知用户并基于你的基础知识回答
6. 如果无法回答，请使用search_latest_knowledge工具重新检索相关信息
在回答时保持专业性，确保信息的准确性。`;


// 初始化 ChatOpenAI 实例
const chatModel = new ChatOpenAI({
  configuration: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE,
  },
  modelName: 'deepseek-ai/DeepSeek-V2.5', // 使用 DeepSeek 模型
  temperature: 0.2, // 设置较低的温度使输出更确定
}) as any;

// 初始化向量嵌入模型
const embeddings = new OpenAIEmbeddings({
  configuration: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE,
  },
  modelName: 'Pro/BAAI/bge-m3', // 使用中文嵌入模型
});

// 创建 Supabase 客户端
const client = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

// 初始化向量存储
const vectorstore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "kb_chunks",
  queryName: "match_kb_chunks",
});

/**
 * POST 请求处理函数
 * 处理聊天请求并返回 AI 响应
 */
export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const { kb_id, messages: messagesData, show_intermediate_steps } = await req.json();

    // 过滤并转换消息格式
    // 只保留用户和助手的消息，过滤掉系统消息
    const messages = (messagesData ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);
    const returnIntermediateSteps = show_intermediate_steps;

    // 创建检索器
    const retriever = vectorstore.asRetriever({
      k: 3, // 检索最相关的3个文档
      searchKwargs: {
        fetchK: 20, // 初始检索文档数
      },
      filter: {
        kb_id: parseInt(kb_id)
      }
    }) as BaseRetrieverInterface;

    // 创建检索工具
    const tool = createRetrieverTool(retriever, {
      name: "search_latest_knowledge",
      description: "使用这个工具来检索知识库中的相关信息。输入应该是对用户问题的关键信息提取。对于每个问题，都应该优先使用这个工具来检索相关内容。",
      returnDirect: false,
      verbose: true,
    });


    // 创建 ReAct 代理
    const agent = await createReactAgent({
      llm: chatModel,
      tools: [tool],
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    // 根据设置决定返回方式
    if (!returnIntermediateSteps) {
      // 调用 agent 并处理流式响应
      const eventStream = await agent.streamEvents(
        { messages },
        { version: "v2" }
      );

      // 设置响应头
      const headers = {
        'Content-Type': 'text/event-stream',
        'Content-Encoding': 'none'
      };

      // 创建编码器
      const encoder = new TextEncoder();

      // 返回流式响应
      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const { event, data } of eventStream) {
                if (event === "on_chat_model_stream") {
                  if (data.chunk.content) {
                    // 构建标准的 SSE 消息格式
                    const chunk = {
                      id: crypto.randomUUID(),
                      object: "chat.completion.chunk",
                      created: Date.now(),
                      model: "deepseek-ai/DeepSeek-V2.5",
                      choices: [
                        {
                          delta: { content: data.chunk.content },
                          index: 0,
                          finish_reason: null
                        }
                      ]
                    };

                    // 使用 SSE 格式编码消息
                    const sseMessage = `data: ${JSON.stringify(chunk)}\n\n`;
                    controller.enqueue(encoder.encode(sseMessage));
                  }
                }
              }
              // 发送结束消息
              const finalChunk = {
                id: crypto.randomUUID(),
                object: "chat.completion.chunk",
                created: Date.now(),
                model: "deepseek-ai/DeepSeek-V2.5",
                choices: [{ delta: {}, index: 0, finish_reason: "stop" }]
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`));
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            } catch (e) {
              console.error("Stream error:", e);
              controller.error(e);
            }
          }
        }),
        { headers }
      );
    } else {
      // 返回完整响应（包含中间步骤）
      const result = await agent.invoke({ messages });
      return NextResponse.json(
        {
          messages: result.messages.map(convertLangChainMessageToVercelMessage),
        },
        { status: 200 },
      );
    }
  } catch (e: any) {
    // 错误处理
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
