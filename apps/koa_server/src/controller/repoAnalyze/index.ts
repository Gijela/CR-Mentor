import { GitIngest, searchKnowledgeGraph } from "git-analyze"
import type Koa from "koa"

import { diffAnalyzeSystemPrompt } from "../../app/prompt/repo/diffAnalyze"

/**
 * 分析 diff 内容。
 * 1. 过滤简单diff
 * 2. 对复杂diff进行实体提取
 * @param {Koa.Context} ctx
 */
export const analyzeDiff = async (ctx: Koa.Context) => {
  const { diffTotal } = ctx.request.body as { diffTotal: string }

  try {
    // 调用大模型
    const response = await fetch(`${process.env.SERVER_HOST}/openai/json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: diffAnalyzeSystemPrompt,
          },
          {
            role: "user",
            content: diffTotal,
          },
        ],
      }),
    })

    const result = await response.json()

    // todo 最小根目录提取

    ctx.body = { success: true, data: { ...result } }
  } catch (error) {
    ctx.status = 500
    ctx.body = { success: false, error }
  }
}

/**
 * 分析仓库, 构建图谱, 按需检索实体相关上下文
 * @param ctx
 */
export const analyzeRepo = async (ctx: Koa.Context) => {
  try {
    const { url, branch, targetPaths, maxFileSize = 1000000, entities = [], exclude = [] } = ctx.request.body as {
      url: string
      branch: string
      targetPaths: string[]
      entities: string[]
      maxFileSize: number
      exclude: string[]
    }

    const ingest = new GitIngest()

    // 分析仓库, 构建图谱
    const result = await ingest.analyzeFromUrl(url, {
      branch,
      targetPaths,
      maxFileSize,
      excludePatterns: exclude,
    })

    // 从图谱检索实体相关上下文
    const searchEntityResults = searchKnowledgeGraph(result?.codeAnalysis?.knowledgeGraph || {}, {
      entities,
    })

    ctx.body = { success: true, data: { ...result, searchEntityResults } }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      error,
    }
  }
}
