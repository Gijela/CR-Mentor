import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage } from "ai";

import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

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

// 初始化 ChatOpenAI 实例
const chatModel = new ChatOpenAI({
  configuration: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE,
  },
  modelName: 'deepseek-ai/DeepSeek-V2.5',
  temperature: 0.2,
  streaming: true
});

export async function POST(req: NextRequest) {
  try {
    const { messages: messagesData } = await req.json();

    // 过滤并转换消息格式
    const messages = (messagesData ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);

    // 创建流式响应
    const stream = await chatModel.stream(messages);

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
            for await (const chunk of stream) {
              if (chunk.content) {
                // 构建标准的 SSE 消息格式
                const sseChunk = {
                  id: crypto.randomUUID(),
                  object: "chat.completion.chunk",
                  created: Date.now(),
                  model: "deepseek-ai/DeepSeek-V2.5",
                  choices: [
                    {
                      delta: { content: chunk.content },
                      index: 0,
                      finish_reason: null
                    }
                  ]
                };

                // 使用 SSE 格式编码消息
                const sseMessage = `data: ${JSON.stringify(sseChunk)}\n\n`;
                controller.enqueue(encoder.encode(sseMessage));
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
  } catch (e: any) {
    console.error('Chat error:', e);
    return NextResponse.json(
      { error: e.message || 'Failed to process chat request' },
      { status: e.status ?? 500 }
    );
  }
}
