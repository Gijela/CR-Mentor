import { createOpenAI } from "@ai-sdk/openai"
// @ts-ignore
import { PgVector } from "@mastra/pg"

import type { KnowledgeBaseConfig } from "./types"

// 创建数据库连接和 OpenAI 客户端
export const createClients = (config: KnowledgeBaseConfig) => {
  const pgVector = new PgVector(config.connectionString)
  const openaiProvider = createOpenAI({
    apiKey: config.openaiApiKey,
    baseURL: config.openaiBaseURL,
  })
  return { pgVector, openaiProvider }
}

// 重试配置
export const RETRY_OPTIONS = {
  maxRetries: 3,
  delay: 1000,
}

// 重试函数
// export async function withRetry<T>(
//   fn: () => Promise<T>,
//   options = RETRY_OPTIONS
// ): Promise<T> {
//   let lastError: Error
//   for (let i = 0; i < options.maxRetries; i++) {
//     try {
//       return await fn()
//     } catch (error: any) {
//       lastError = error
//       await new Promise(resolve => setTimeout(resolve, options.delay))
//     }
//   }
//   throw lastError!
// }
