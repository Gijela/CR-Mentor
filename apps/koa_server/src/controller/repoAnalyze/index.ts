import { GitIngest, searchKnowledgeGraph } from "git-analyze"
import type Koa from "koa"

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
