// 导入必要的依赖
import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"; // 文本分割工具
import { createClient } from "@supabase/supabase-js"; // Supabase数据库客户端
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"; // Supabase向量存储
import { OpenAIEmbeddings } from "@langchain/openai"; // OpenAI文本嵌入模型

// 设置为Edge运行时以获得更好的性能
export const runtime = "edge";

// 提示:使用前需要按照以下文档配置Supabase
// https://js.langchain.com/v0.2/docs/integrations/vectorstores/supabase

/**
 * 这是一个文档入库API路由
 * 主要功能:
 * 1. 接收文本内容
 * 2. 将文本分割成小块
 * 3. 将这些文本块转换为向量并存储到数据库中
 * 4. 便于后续进行相似度检索
 * 
 * 相关文档:
 * - 文本分割: https://js.langchain.com/v0.2/docs/how_to/recursive_text_splitter
 * - 向量存储: https://js.langchain.com/v0.2/docs/integrations/vectorstores/supabase
 */
export async function POST(req: NextRequest) {
  // 解析请求体获取文本内容
  const body = await req.json();
  const text = body.text;

  try {
    // 创建Supabase客户端连接
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );

    // 创建文本分割器
    // 将文本按markdown格式分割成256字符的块,块之间重叠20字符
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 256,
      chunkOverlap: 20,
    });

    // 将输入文本分割成文档块
    const splitDocuments = await splitter.createDocuments([text]);

    // 创建向量存储
    // 1. 将文档块转换为向量(使用OpenAI的嵌入模型)
    const embeddings = new OpenAIEmbeddings({
      configuration: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE,
      },
      modelName: "Pro/BAAI/bge-m3", // 使用中文嵌入模型
    });

    // 2. 将向量存储到Supabase数据库中
    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      embeddings,
      {
        client,
        tableName: "documents", // 存储表名
        queryName: "match_documents", // 查询函数名
      },
    );

    // 返回成功响应
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    // 错误处理
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
