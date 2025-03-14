import fs from "node:fs/promises"
import path from "node:path"

import { MDocument } from "@mastra/rag"
import { embedMany } from "ai"

import type { Document, DocumentMetadata, KnowledgeBaseConfig } from "./types"
import { createClients } from "./utils"

// 向知识库添加文档
export async function addDocuments(
  config: KnowledgeBaseConfig,
  knowledgeBaseName: string,
  documents: Document[],
): Promise<void> {
  const { pgVector, openaiProvider } = createClients(config)
  try {
    for (const doc of documents) {
      const mDoc = MDocument.fromText(doc.content)
      const chunks = await mDoc.chunk()

      const { embeddings } = await embedMany({
        values: chunks.map((chunk) => chunk.text),
        model: openaiProvider.embedding(process.env.OPENAI_EMBEDDING_MODEL!),
      })

      const validEmbeddings = embeddings.filter((v): v is number[] => Array.isArray(v))

      await pgVector.upsert({
        indexName: knowledgeBaseName,
        vectors: validEmbeddings,
        metadata: chunks.map((chunk) => ({
          text: chunk.text,
          ...doc.metadata,
          timestamp: new Date().toISOString(),
        })),
      })
    }
    console.log(`成功添加 ${documents.length} 个文档到知识库 "${knowledgeBaseName}"`)
  } catch (error: any) {
    throw new Error(`添加文档失败: ${error.message}`)
  }
}

// 从知识库检索文档
export async function searchDocuments(
  config: KnowledgeBaseConfig,
  knowledgeBaseName: string,
  query: string,
  options: {
    topK?: number
    filter?: Record<string, any>
  } = {},
): Promise<any[]> {
  const { pgVector, openaiProvider } = createClients(config)
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
      filter: options.filter,
    })

    return results
  } catch (error: any) {
    throw new Error(`检索失败: ${error.message}`)
  }
}

// 获取文档列表
export async function listDocuments(
  config: KnowledgeBaseConfig,
  knowledgeBaseName: string,
  options: {
    page: number
    pageSize: number
    filter?: Record<string, any>
  },
): Promise<{ documents: any[], total: number }> {
  const { pgVector } = createClients(config)
  try {
    const results = await pgVector.query({
      indexName: knowledgeBaseName,
      queryVector: Array.from({ length: 1536 }).fill(0),
      topK: options.pageSize,
      filter: options.filter,
      start: (options.page - 1) * options.pageSize,
    })

    return {
      documents: results.map((result: any) => ({
        id: result.id,
        ...result.metadata,
      })),
      total: results.length,
    }
  } catch (error: any) {
    throw new Error(`获取文档列表失败: ${error.message}`)
  }
}

// 删除文档
export async function deleteDocument(
  config: KnowledgeBaseConfig,
  knowledgeBaseName: string,
  documentId: string,
): Promise<void> {
  const { pgVector } = createClients(config)
  try {
    await pgVector.upsert({
      indexName: knowledgeBaseName,
      vectors: [],
      metadata: [],
      ids: [documentId],
    })
    console.log(`文档 "${documentId}" 已从知识库 "${knowledgeBaseName}" 中删除`)
  } catch (error: any) {
    throw new Error(`删除文档失败: ${error.message}`)
  }
}

// 更新文档
export async function updateDocument(
  config: KnowledgeBaseConfig,
  knowledgeBaseName: string,
  documentId: string,
  updates: {
    content?: string
    metadata?: Partial<DocumentMetadata>
  },
): Promise<void> {
  const { pgVector, openaiProvider } = createClients(config)
  try {
    if (updates.content) {
      const mDoc = MDocument.fromText(updates.content)
      const chunks = await mDoc.chunk()
      const { embeddings } = await embedMany({
        values: chunks.map((chunk) => chunk.text),
        model: openaiProvider.embedding(process.env.OPENAI_EMBEDDING_MODEL!),
      })
      const validEmbeddings = embeddings.filter((v): v is number[] => Array.isArray(v))
      await pgVector.upsert({
        indexName: knowledgeBaseName,
        vectors: validEmbeddings,
        metadata: chunks.map((chunk) => ({
          text: chunk.text,
          ...updates.metadata,
          lastUpdated: new Date().toISOString(),
        })),
        ids: [documentId],
      })
    } else if (updates.metadata) {
      const results = await pgVector.query({
        indexName: knowledgeBaseName,
        queryVector: Array.from({ length: 1536 }).fill(0),
        filter: { id: documentId },
        topK: 1,
      })
      if (results.length > 0) {
        await pgVector.upsert({
          indexName: knowledgeBaseName,
          vectors: [results[0].vector],
          metadata: [{
            ...results[0].metadata,
            ...updates.metadata,
            lastUpdated: new Date().toISOString(),
          }],
          ids: [documentId],
        })
      }
    }
    console.log(`文档 "${documentId}" 已更新`)
  } catch (error: any) {
    throw new Error(`更新文档失败: ${error.message}`)
  }
}

// 上传文件
export async function uploadFile(
  config: KnowledgeBaseConfig,
  knowledgeBaseName: string,
  filePath: string,
  metadata?: DocumentMetadata,
): Promise<void> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8")
    const fileExt = path.extname(filePath).toLowerCase()

    let doc: MDocument
    switch (fileExt) {
      case ".txt": {
        doc = MDocument.fromText(fileContent)
        break
      }
      case ".md": {
        doc = MDocument.fromMarkdown(fileContent)
        break
      }
      case ".json": {
        const jsonContent = JSON.parse(fileContent)
        doc = MDocument.fromJSON(jsonContent)
        break
      }
      default: {
        throw new Error(`不支持的文件类型: ${fileExt}`)
      }
    }

    // 使用doc对象获取处理后的文本内容
    const processedContent = doc.getText().join("\n")

    await addDocuments(config, knowledgeBaseName, [{
      content: processedContent,
      metadata: {
        ...metadata,
        fileName: path.basename(filePath),
        fileType: fileExt,
        uploadedAt: new Date().toISOString(),
      },
    }])
  } catch (error: any) {
    throw new Error(`文件上传失败: ${error.message}`)
  }
}
