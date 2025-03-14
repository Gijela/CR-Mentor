import type { KnowledgeBaseConfig, KnowledgeBaseInfo, KnowledgeBaseMetadata } from "./types"
import { createClients } from "./utils"

// 创建新的知识库
export async function createKnowledgeBase(
  config: KnowledgeBaseConfig,
  name: string,
  dimension = 1536,
): Promise<void> {
  const { pgVector } = createClients(config)
  try {
    await pgVector.createIndex({
      indexName: name,
      dimension,
    })
    console.log(`知识库 "${name}" 创建成功`)
  } catch (error: any) {
    if (!error.message.includes("already exists")) {
      throw new Error(`创建知识库失败: ${error.message}`)
    }
  }
}

// 删除知识库
export async function deleteKnowledgeBase(
  config: KnowledgeBaseConfig,
  name: string,
): Promise<void> {
  const { pgVector } = createClients(config)
  try {
    await pgVector.deleteIndex(name)
    console.log(`知识库 "${name}" 删除成功`)
  } catch (error: any) {
    throw new Error(`删除知识库失败: ${error.message}`)
  }
}

// 获取知识库元数据
export async function getKnowledgeBaseMetadata(
  config: KnowledgeBaseConfig,
  name: string,
): Promise<KnowledgeBaseMetadata> {
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
export async function setKnowledgeBaseMetadata(
  config: KnowledgeBaseConfig,
  name: string,
  metadata: KnowledgeBaseMetadata,
): Promise<void> {
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

// 获取所有知识库列表
export async function listKnowledgeBases(
  config: KnowledgeBaseConfig,
): Promise<KnowledgeBaseInfo[]> {
  const { pgVector } = createClients(config)
  try {
    const indexes = await pgVector.listIndexes()
    const knowledgeBases: KnowledgeBaseInfo[] = []

    for (const name of indexes) {
      const results = await pgVector.query({
        indexName: name,
        queryVector: Array.from({ length: 1536 }).fill(0),
        topK: 1,
      })

      const metadata = await getKnowledgeBaseMetadata(config, name)

      knowledgeBases.push({
        name,
        description: metadata.description,
        documentCount: results.length,
        createdAt: metadata.createdAt || new Date().toISOString(),
        lastUpdated: metadata.lastUpdated || new Date().toISOString(),
        tags: metadata.tags,
      })
    }

    return knowledgeBases
  } catch (error: any) {
    throw new Error(`获取知识库列表失败: ${error.message}`)
  }
}

// 更新知识库信息
export async function updateKnowledgeBase(
  config: KnowledgeBaseConfig,
  name: string,
  updates: Partial<KnowledgeBaseMetadata>,
): Promise<void> {
  try {
    const metadata = await getKnowledgeBaseMetadata(config, name)
    await setKnowledgeBaseMetadata(config, name, {
      ...metadata,
      ...updates,
      lastUpdated: new Date().toISOString(),
    })
    console.log(`知识库 "${name}" 信息已更新`)
  } catch (error: any) {
    throw new Error(`更新知识库信息失败: ${error.message}`)
  }
}

// 获取单个知识库信息
export async function getKnowledgeBase(
  config: KnowledgeBaseConfig,
  name: string,
): Promise<KnowledgeBaseInfo> {
  const { pgVector } = createClients(config)
  try {
    const results = await pgVector.query({
      indexName: name,
      queryVector: Array.from({ length: 1536 }).fill(0),
      topK: 1,
    })

    const metadata = await getKnowledgeBaseMetadata(config, name)

    return {
      name,
      description: metadata.description,
      documentCount: results.length,
      createdAt: metadata.createdAt || new Date().toISOString(),
      lastUpdated: metadata.lastUpdated || new Date().toISOString(),
      tags: metadata.tags,
    }
  } catch (error: any) {
    throw new Error(`获取知识库信息失败: ${error.message}`)
  }
}
