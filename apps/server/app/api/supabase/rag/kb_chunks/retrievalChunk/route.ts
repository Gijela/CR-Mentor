import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import {
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

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
    const { kb_id, messages: messagesData, stream = true } = await req.json();

    // 获取最后一条用户消息
    const lastMessage = messagesData[messagesData.length - 1].content;

    // 创建检索器
    const retriever = vectorstore.asRetriever({
      k: 10, // 检索10个最相关的文档
      filter: {
        kb_id: !!kb_id ? parseInt(kb_id) : undefined,
      }
    });

    // 直接检索相关文档
    const relevantDocs = await retriever.getRelevantDocuments(lastMessage);
    console.log("🚀 ~ POST ~ relevantDocs:", relevantDocs)

    // 构建系统提示
    const systemMessage = `请基于以下检索到的内容回答用户问题。如果检索内容与问题相关性不高，请直接说明。\n\n检索内容：\n${relevantDocs.map(doc => doc.pageContent).join('\n\n')}`;

    console.log("🚀 ~ POST ~ prompt ===>:", systemMessage)

    if (stream) {
      // 流式响应
      const response = await chatModel.stream([
        new SystemMessage(systemMessage),
        new HumanMessage(lastMessage)
      ]);

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
              for await (const chunk of response) {
                if (chunk.content) {
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
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseChunk)}\n\n`));
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
      // 非流式响应
      const response = await chatModel.invoke([
        new SystemMessage(systemMessage),
        new HumanMessage(lastMessage)
      ]);

      return NextResponse.json({
        id: crypto.randomUUID(),
        object: "chat.completion",
        created: Date.now(),
        stream: false,
        message: response.content,
      });
    }
  } catch (e: any) {
    console.error('RAG error:', e);
    return NextResponse.json(
      { error: e.message || '检索请求处理失败' },
      { status: e.status ?? 500 }
    );
  }
}
