import type Koa from "koa"

import type { KnowledgeBaseConfig, KnowledgeBaseMetadata } from "./types"
import { createClients } from "./utils"

/**
 * 创建新的知识库
 * @param ctx
 * @returns
 */
export const createKnowledgeBase = async (ctx: Koa.Context): Promise<void> => {
  const { name, dimension = 1536 } = ctx.request.body as { name: string, dimension: number }
  const { pgVector } = createClients(ctx.state.config)
  try {
    await pgVector.createIndex({
      indexName: name,
      dimension,
    })
    console.log(`知识库 "${name}" 创建成功`)
    ctx.body = { success: true, data: "创建知识库成功" }
  } catch (error: any) {
    if (!error.message.includes("already exists")) {
      ctx.body = { success: false, data: `创建知识库失败: ${error.message}` }
    }
  }
}

/**
 * 删除知识库
 * @param ctx
 * @returns
 */
export const deleteKnowledgeBase = async (ctx: Koa.Context): Promise<void> => {
  const { name } = ctx.request.body as { name: string }
  const { pgVector } = createClients(ctx.state.config)
  try {
    await pgVector.deleteIndex(name)
    console.log(`知识库 "${name}" 删除成功`)
    ctx.body = { success: true, data: "删除知识库成功" }
  } catch (error: any) {
    ctx.body = { success: false, data: `删除知识库失败: ${error.message}` }
  }
}

// 获取知识库元数据
const getKnowledgeBaseMetadata = async (
  config: KnowledgeBaseConfig,
  name: string,
): Promise<KnowledgeBaseMetadata> => {
  const { pgVector } = createClients(config)
  try {
    const results = await pgVector.query({
      indexName: name,
      queryVector: Array.from({ length: 1536 }).fill(0),
      filter: { type: "kb_metadata" },
      topK: 1,
    })
    return results[0]?.metadata || {}
  } catch {
    return {}
  }
}

// 设置知识库元数据
const setKnowledgeBaseMetadata = async (
  config: KnowledgeBaseConfig,
  name: string,
  metadata: KnowledgeBaseMetadata,
): Promise<void> => {
  const { pgVector } = createClients(config)
  await pgVector.upsert({
    indexName: name,
    vectors: [Array.from({ length: 1536 }).fill(0)],
    metadata: [{
      ...metadata,
      type: "kb_metadata",
    }],
    ids: ["kb_metadata"],
  })
}

/**
 * 获取所有知识库列表
 * @param ctx
 * @returns
 */
export const listKnowledgeBases = async (ctx: Koa.Context): Promise<void> => {
  const { pgVector } = createClients(ctx.state.config)
  try {
    const indexes = await pgVector.listIndexes()
    // const knowledgeBases: KnowledgeBaseInfo[] = []

    // for (const name of indexes) {
    //   const results = await pgVector.query({
    //     indexName: name,
    //     queryVector: Array.from({ length: 1536 }).fill(0),
    //     topK: 1,
    //   })

    //   const metadata = await getKnowledgeBaseMetadata(ctx.state.config, name)

    //   knowledgeBases.push({
    //     id: results[0]?.id || Math.random().toString(),
    //     name,
    //     description: metadata.description,
    //     documentCount: results.length,
    //     createdAt: metadata.createdAt || new Date().toISOString(),
    //     lastUpdated: metadata.lastUpdated || new Date().toISOString(),
    //     tags: metadata.tags,
    //   })
    // }

    ctx.body = { success: true, data: indexes }
  } catch (error: any) {
    ctx.body = { success: false, data: `获取知识库列表失败: ${error.message}` }
  }
}

/**
 * 更新知识库信息
 * @param ctx
 * @returns
 */
export const updateKnowledgeBase = async (ctx: Koa.Context): Promise<void> => {
  const { name, updates } = ctx.request.body as { name: string, updates: Partial<KnowledgeBaseMetadata> }

  try {
    const metadata = await getKnowledgeBaseMetadata(ctx.state.config, name)
    await setKnowledgeBaseMetadata(ctx.state.config, name, {
      ...metadata,
      ...updates,
      lastUpdated: new Date().toISOString(),
    })
    console.log(`知识库 "${name}" 信息已更新`)
    ctx.body = { success: true, data: "更新知识库信息成功" }
  } catch (error: any) {
    ctx.body = { success: false, data: `更新知识库信息失败: ${error.message}` }
  }
}

/**
 * 获取单个知识库信息
 * @param ctx
 * @returns
 */
export const getKnowledgeBase = async (ctx: Koa.Context): Promise<void> => {
  const { name } = ctx.request.body as { name: string }
  const { pgVector } = createClients(ctx.state.config)
  try {
    const results = await pgVector.query({
      indexName: name,
      queryVector: Array.from({ length: 1536 }).fill(0),
      topK: 1,
    })

    const metadata = await getKnowledgeBaseMetadata(ctx.state.config, name)

    ctx.body = {
      success: true,
      data: {
        name,
        description: metadata.description,
        documentCount: results.length,
        createdAt: metadata.createdAt || new Date().toISOString(),
        lastUpdated: metadata.lastUpdated || new Date().toISOString(),
        tags: metadata.tags,
      },
    }
  } catch (error: any) {
    ctx.body = { success: false, data: `获取知识库信息失败: ${error.message}` }
  }
}
