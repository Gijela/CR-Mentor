import { createOpenAI } from "@ai-sdk/openai"
// @ts-ignore
import { PgVector } from "@mastra/pg"
import { MDocument } from "@mastra/rag"
import { embedMany } from "ai"

// 使用明确的连接字符串
const pgVector = new PgVector("postgresql://root:u6ra90It4mQ8ynbseE5XGV371xNMPKl2@ovh1.clusters.zeabur.com:30104/zeabur")

const openaiProvider = createOpenAI({
  apiKey: "sk-BaC53hheKtE2yL7w2OLjq8BfwwMVFdwzp2cDsFLKlrqFBVyo",
  baseURL: "https://api.gptgod.online/v1",
})

async function main() {
  try {
    console.log("开始创建向量表...")
    // 只创建一次索引
    await pgVector.createIndex({
      indexName: "test_index",
      dimension: 1536,
    })
    console.log("向量表创建成功")
  } catch (error: unknown) {
    if (error instanceof Error && !error.message.includes("already exists")) {
      console.error("严重错误，无法继续:", error)
      return
    }
  }

  // 示例文档
  const documents = [
    {
      content: "这是第一个文档的内容",
      metadata: { category: "tech", author: "Zhang San" },
    },
    {
      content: "这是第二个文档的内容",
      metadata: { category: "finance", author: "Li Si" },
    },
    {
      content: "这是第三个文档的内容",
      metadata: { category: "tech", author: "Wang Wu" },
    },
  ]

  try {
    // 为每个文档创建 MDocument 实例并进行分块
    for (const doc of documents) {
      console.log(`处理文档: ${doc.content}`)

      const mDoc = MDocument.fromText(doc.content)
      const chunks = await mDoc.chunk()

      // 使用 embedMany 一次性获取所有分块的嵌入向量
      const { embeddings } = await embedMany({
        values: chunks.map((chunk) => chunk.text),
        model: openaiProvider.embedding("text-embedding-3-small"), // 改用 small 模型
      })

      // 上传向量和元数据
      await pgVector.upsert({
        indexName: "test_index",
        vectors: embeddings,
        metadata: chunks.map((chunk) => ({
          text: chunk.text,
          ...doc.metadata,
        })),
      })

      console.log(`成功添加文档: ${doc.content.slice(0, 20)}...`)
    }

    // 查询示例
    console.log("开始查询...")
    const queryDoc = MDocument.fromText("查询技术相关文档")
    const queryChunks = await queryDoc.chunk()

    const { embeddings: queryEmbeddings } = await embedMany({
      values: queryChunks.map((chunk) => chunk.text),
      model: openaiProvider.embedding("text-embedding-3-small"), // 查询时也使用相同的模型
    })

    const result = await pgVector.query({
      indexName: "test_index", // 使用相同的索引名
      queryVector: queryEmbeddings[0], // 使用第一个分块的向量进行查询
      topK: 3,
      filter: {
        category: "tech",
      },
    })

    console.log("查询结果:", result)
  } catch (error: unknown) {
    console.error("处理失败:", error)
    if (error instanceof Error) {
      console.error("错误详情:", error.stack)
    }
  }
}

main().catch(console.error)
