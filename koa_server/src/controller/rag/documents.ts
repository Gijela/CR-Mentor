// import fs from "node:fs/promises"
// import path from "node:path"
import { MDocument } from "@mastra/rag"
import { embedMany } from "ai"
import type Koa from "koa"

import type { Document, DocumentMetadata } from "./types"
import { createClients } from "./utils"

/**
 * 向知识库添加文档
 * @param ctx
 * @returns
 */
export const addDocuments = async (ctx: Koa.Context): Promise<void> => {
  const { knowledgeBaseName, documents } = ctx.request.body as { knowledgeBaseName: string, documents: Document[] }
  const { pgVector, openaiProvider } = createClients(ctx.state.config)

  try {
    for (const doc of documents) {
      const { content, ...rest } = doc
      const mDoc = MDocument.fromText(doc.content)
      const chunks = await mDoc.chunk()

      const { embeddings } = await embedMany({
        values: chunks.map((chunk) => chunk.text),
        model: openaiProvider.embedding(process.env.OPENAI_EMBEDDING_MODEL!),
      })

      const validEmbeddings = embeddings.filter((v): v is number[] => Array.isArray(v))

      const result = await pgVector.upsert({
        indexName: knowledgeBaseName,
        vectors: validEmbeddings,
        metadata: chunks.map((chunk) => ({
          text: chunk.text,
          ...rest,
          createdAt: new Date().toISOString(),
        })),
      })
      console.log(`成功添加 ${documents.length} 个文档到知识库 "${knowledgeBaseName}"`)
      ctx.body = { success: true, message: "添加文档成功", data: { docIds: result } }
    }
  } catch (error: any) {
    ctx.body = { success: false, data: `添加文档失败: ${error.message}` }
  }
}

/**
 * 从知识库检索文档
 * @param ctx
 * @returns
 */
export const searchDocuments = async (ctx: Koa.Context): Promise<void> => {
  const { knowledgeBaseName, query = "", options = { topK: 3 } } = ctx.request.body as {
    knowledgeBaseName: string
    query: string
    options: {
      topK?: number
      filter?: Record<string, any>
    }
  }
  const { pgVector, openaiProvider } = createClients(ctx.state.config)
  try {
    const queryDoc = MDocument.fromText(query)
    const queryChunks = await queryDoc.chunk()

    const { embeddings: queryEmbeddings } = await embedMany({
      values: queryChunks.map((chunk) => chunk.text),
      model: openaiProvider.embedding(process.env.OPENAI_EMBEDDING_MODEL!),
    })

    const results = await pgVector.query({
      indexName: knowledgeBaseName,
      queryVector: queryEmbeddings[0],
      topK: options.topK || 3,
      filter: options?.filter,
    })

    ctx.body = { success: true, data: results }
  } catch (error: any) {
    ctx.body = { success: false, data: [], message: `检索失败: ${error.message}` }
  }
}

/**
 * 获取文档列表
 * @param ctx
 * @returns
 */
export const listDocuments = async (ctx: Koa.Context): Promise<void> => {
  const { knowledgeBaseName, options } = ctx.request.body as {
    knowledgeBaseName: string
    options: {
      page: number
      pageSize: number
      filter?: Record<string, any>
    }
  }
  console.log("listDocuments options ==>", options)

  const { pgVector } = createClients(ctx.state.config)
  try {
    const results = await pgVector.query({
      indexName: knowledgeBaseName,
      queryVector: Array.from({ length: 1536 }).fill(0),
      // filter: options.filter,
      // start: (options.page - 1) * options.pageSize,
      // topK: options.pageSize,
      start: 0,
      topK: 99999999999, // 获取所有文档, 先不处理分页
    })

    ctx.body = {
      success: true,
      data: {
        documents: results.map((result: any) => ({
          id: result.id,
          ...result.metadata,
        })),
        total: results.length,
      },
    }
  } catch (error: any) {
    ctx.body = { success: false, data: `获取文档列表失败: ${error.message}` }
  }
}

/**
 * 删除文档
 * @param ctx
 * @returns
 */
export const deleteDocument = async (ctx: Koa.Context): Promise<void> => {
  const { knowledgeBaseName, documentId } = ctx.request.body as { knowledgeBaseName: string, documentId: string }
  const { pgVector } = createClients(ctx.state.config)

  try {
    const result = await pgVector.deleteIndexById(knowledgeBaseName, documentId)

    console.log(`文档 "${documentId}" 已从知识库 "${knowledgeBaseName}" 中删除`)
    ctx.body = { success: true, message: "删除文档成功", data: result }
  } catch (error: any) {
    ctx.body = { success: false, data: `删除文档失败: ${error.message}` }
  }
}

/**
 * 更新文档
 * @param ctx
 */
export const updateDocument = async (ctx: Koa.Context): Promise<void> => {
  const { knowledgeBaseName, documentId, updates } = ctx.request.body as {
    knowledgeBaseName: string
    documentId: string
    updates: {
      content?: string
      metadata?: Partial<DocumentMetadata>
    }
  }
  const { pgVector, openaiProvider } = createClients(ctx.state.config)
  try {
    if (updates.content) {
      const mDoc = MDocument.fromText(updates.content)
      const chunks = await mDoc.chunk()
      const { embeddings } = await embedMany({
        values: chunks.map((chunk) => chunk.text),
        model: openaiProvider.embedding(process.env.OPENAI_EMBEDDING_MODEL!),
      })
      const validEmbeddings = embeddings.filter((v): v is number[] => Array.isArray(v))

      await pgVector.deleteIndexById(knowledgeBaseName, documentId)

      await pgVector.upsert({
        indexName: knowledgeBaseName,
        vectors: validEmbeddings,
        metadata: chunks.map((chunk) => ({
          text: chunk.text,
          ...updates.metadata,
          lastUpdated: new Date().toISOString(),
        })),
        ids: Array.from({ length: validEmbeddings.length }).fill(documentId).map((id, index) => `${id}_${index}`),
      })
    } else if (updates.metadata) {
      await pgVector.updateIndexById(knowledgeBaseName, documentId, {
        metadata: {
          ...updates.metadata,
          lastUpdated: new Date().toISOString(),
        },
      })
    }
    console.log(`文档 "${documentId}" 已更新`)
    ctx.body = { success: true, message: "更新文档成功" }
  } catch (error: any) {
    ctx.body = { success: false, data: `更新文档失败: ${error.message}` }
  }
}

// 上传文件
// export async function uploadFile(
//   config: KnowledgeBaseConfig,
//   knowledgeBaseName: string,
//   filePath: string,
//   metadata?: DocumentMetadata,
// ): Promise<void> {
//   try {
//     const fileContent = await fs.readFile(filePath, "utf-8")
//     const fileExt = path.extname(filePath).toLowerCase()

//     let doc: MDocument
//     switch (fileExt) {
//       case ".txt": {
//         doc = MDocument.fromText(fileContent)
//         break
//       }
//       case ".md": {
//         doc = MDocument.fromMarkdown(fileContent)
//         break
//       }
//       case ".json": {
//         const jsonContent = JSON.parse(fileContent)
//         doc = MDocument.fromJSON(jsonContent)
//         break
//       }
//       default: {
//         throw new Error(`不支持的文件类型: ${fileExt}`)
//       }
//     }

//     // 使用doc对象获取处理后的文本内容
//     const processedContent = doc.getText().join("\n")

//     await addDocuments(config, knowledgeBaseName, [{
//       content: processedContent,
//       metadata: {
//         ...metadata,
//         fileName: path.basename(filePath),
//         fileType: fileExt,
//         uploadedAt: new Date().toISOString(),
//       },
//     }])
//   } catch (error: any) {
//     throw new Error(`文件上传失败: ${error.message}`)
//   }
// }
