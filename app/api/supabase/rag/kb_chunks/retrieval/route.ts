import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"; // OpenAI聊天和嵌入模型
import { PromptTemplate } from "@langchain/core/prompts"; // 提示模板
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"; // Supabase向量存储
import { Document } from "@langchain/core/documents"; // 文档类型
import { RunnableSequence } from "@langchain/core/runnables"; // 可运行序列
import {
  BytesOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers"; // 输出解析器

// 设置为Edge运行时
export const runtime = "edge";

// 合并文档内容的辅助函数
const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};

// 格式化聊天历史记录的辅助函数
const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

// 定义提示模板 - 用于将后续问题转化为独立问题
const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

// 定义回答模板 - 设置AI助手的人设和回答方式
const ANSWER_TEMPLATE = `You are an energetic talking puppy named Dana, and must answer all questions like a happy, talking dog would.
Use lots of puns!

Answer the question based only on the following context and chat history:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

/**
 * POST请求处理函数
 * 主要步骤:
 * 1. 接收并处理请求数据
 * 2. 初始化必要的AI模型和数据库连接
 * 3. 设置检索链
 * 4. 处理问题并生成回答
 * 5. 返回流式响应
 */
export async function POST(req: NextRequest) {
  try {
    // 1. 处理请求数据
    const { messages, kb_id } = await req.json();
    const previousMessages = messages.slice(0, -1); // 获取历史消息
    const currentMessageContent = messages[messages.length - 1].content; // 获取当前问题

    // 2. 初始化AI模型
    const model = new ChatOpenAI({
      configuration: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE,
      },
      modelName: 'deepseek-ai/DeepSeek-V2.5',
      temperature: 0.2,
    });

    // 初始化嵌入模型
    const embeddings = new OpenAIEmbeddings({
      configuration: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE,
      },
      modelName: 'Pro/BAAI/bge-m3',
    });

    // 初始化Supabase客户端和向量存储
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );
    const vectorstore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "kb_chunks",
      queryName: "match_kb_chunks",
      filter: {
        kb_id,
      },
    });

    // 3. 设置检索链
    // 3.1 创建独立问题生成链
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ] as any);

    // 3.2 设置文档检索回调
    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    // 3.3 创建检索器
    const retriever = vectorstore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    // 3.4 创建检索链
    const retrievalChain = retriever.pipe(combineDocumentsFn);

    // 3.5 创建回答链
    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ] as any),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ] as any);

    // 3.6 组合最终的会话检索问答链
    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    // 4. 执行问答链并获取流式响应
    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    // 5. 处理检索到的文档并返回响应
    const documents = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + "...",
            metadata: doc.metadata,
          };
        }),
      ),
    ).toString("base64");

    // 返回流式响应，包含消息索引和源文档信息
    return new StreamingTextResponse(stream, {
      headers: {
        "x-message-index": (previousMessages.length + 1).toString(),
        "x-sources": serializedSources,
      },
    });
  } catch (e: any) {
    // 错误处理
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
