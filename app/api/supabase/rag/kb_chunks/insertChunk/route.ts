import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"; // 文本分割工具
import { OpenAIEmbeddings } from "@langchain/openai"; // OpenAI文本嵌入模型

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);
export async function POST(req: NextRequest) {
  const { kb_id, content, metadata } = await req.json();

  try {
    // 创建文本分割器实例，设置为处理markdown格式的文本
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 256,     // 每个文档块的最大字符数
      chunkOverlap: 20,   // 相邻文档块之间的重叠字符数
    });

    // 将输入文本分割成文档块，并添加metadata
    const splitDocuments = await splitter.createDocuments(
      [content],          // 要分割的文本内容
      [metadata]  // 文档的元数据
    );

    // 创建文本嵌入模型实例
    const embeddings = new OpenAIEmbeddings({
      configuration: {
        apiKey: process.env.OPENAI_API_KEY,    // OpenAI API密钥
        baseURL: process.env.OPENAI_API_BASE,  // API基础URL
      },
      // 使用的嵌入模型名称, 这个模型是 1024 维, 当前表也是 1024 维，如果模型不一样，需要修改 kb_chunks 表 embedding 字段维度
      modelName: "Pro/BAAI/bge-m3",
    });

    // 准备要插入的文档数据
    const documents = splitDocuments.map(doc => ({
      pageContent: doc.pageContent,  // 文档内容
      metadata: doc.metadata,        // 文档元数据
      kb_id: parseInt(kb_id)              // 知识库ID
    }));

    // 手动插入每个文档块到数据库
    for (const doc of documents) {
      await supabase
        .from('kb_chunks')           // 指定表名
        .insert({
          content: doc.pageContent,  // 文档内容
          metadata: doc.metadata,    // 元数据
          kb_id: doc.kb_id,         // 知识库ID
          embedding: await embeddings.embedQuery(doc.pageContent) // 生成文本向量
        });
    }

    // 返回成功响应
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    if (error.cause) {
      return NextResponse.json({ error: error.cause }, { status: 500 });
    }
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
