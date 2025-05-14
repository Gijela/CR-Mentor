// import { GitIngest, searchKnowledgeGraph } from "git-analyze"
// import type Koa from "koa"
// import serialize from "serialize-javascript"

// import { analyzeCodeModulePrompt } from "@/app/prompt/repo/analyzeCodeModule"
// // import { mockFilterDiffEntity } from "../mock/filterDiffEntity"
// import { summaryCommitMsgPrompt } from "@/app/prompt/repo/commitSummary"
// import { diffAnalyzeSystemPrompt } from "@/app/prompt/repo/diffAnalyze"
// import { summaryPrPrompt } from "@/app/prompt/repo/summaryPr"
// import { getCommonRoot } from "@/utils/index"
// import logger from "@/utils/logger"

// import type { Diff } from "./interface"
// import { mockFilterDiffEntity } from "../mock/filterDiffEntity"
// import { mockSummaryCommitMsg } from "@/mock/summaryCommitMsg"
// import { mockAnalyzeRepo } from "@/mock/analyzeRepo"
// import { mockAnalyzeCodeModule } from "@/mock/analyzeCodeModule"
// import { mockSummaryPr } from "@/mock/summaryPr"

// /**
//  * 分析 diff 内容。
//  * 1. 过滤简单diff
//  * 2. 对复杂diff进行实体提取
//  * @param {Koa.Context} ctx
//  */
// export const analyzeDiff = async (ctx: Koa.Context) => {
//   const { diffTotal } = ctx.request.body as { diffTotal: string }

//   try {
//     // 调用大模型
//     const response = await fetch(`${process.env.SERVER_HOST}/openai/json`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         messages: [
//           { role: "system", content: diffAnalyzeSystemPrompt },
//           { role: "user", content: diffTotal },
//         ],
//       }),
//     })

//     const result = await response.json()
//     const miniCommonRoot = getCommonRoot(result?.entityList || [])

//     ctx.body = { success: true, data: { miniCommonRoot, ...result } }
//   } catch (error) {
//     logger.error("🚀 ~ analyzeDiff ~ error:", error)
//     ctx.status = 500
//     ctx.body = { success: false, error }
//   }
// }

// /**
//  * 分析仓库, 构建图谱, 按需检索实体相关上下文
//  * @param ctx
//  */
// export const analyzeRepo = async (ctx: Koa.Context) => {
//   try {
//     const { url, branch, targetPaths, maxFileSize = 1000000, entities = [], exclude = [], miniCommonRoot = "/src" } = ctx.request.body as {
//       url: string
//       branch: string
//       targetPaths: string[]
//       entities: string[]
//       maxFileSize: number
//       exclude: string[]
//       miniCommonRoot: string
//     }

//     const ingest = new GitIngest()

//     // 分析仓库, 构建图谱
//     const result = await ingest.analyzeFromUrl(url, {
//       branch,
//       targetPaths,
//       maxFileSize,
//       excludePatterns: exclude,
//       miniCommonRoot,
//     })

//     // 从图谱检索实体相关上下文
//     const searchEntityResults = searchKnowledgeGraph(result?.codeAnalysis?.knowledgeGraph || {}, {
//       entities,
//     })

//     ctx.status = 200
//     ctx.body = { success: true, data: { ...result, searchEntityResults } }
//     // await new Promise((resolve) => setTimeout(resolve, 2000))
//     // ctx.body = mockAnalyzeRepo
//   } catch (error) {
//     console.log('analyzeRepo error ==> ', error)
//     ctx.status = 500
//     ctx.body = {
//       success: false,
//       error,
//     }
//   }
// }

// /**
//  * 过滤简单变更，复杂变更提取实体
//  * @param {Koa.Context} ctx
//  * @returns {Promise<Object>}
//  */
// export const filterDiffEntity = async (ctx: Koa.Context) => {
//   const { diffs } = ctx.request.body as { diffs: Diff[] }

//   try {
//     const response = await fetch(`${process.env.SERVER_HOST}/openai/json`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         messages: [
//           { role: "system", content: diffAnalyzeSystemPrompt },
//           { role: "user", content: serialize(diffs) },
//         ],
//       }),
//     })

//     if (!response.ok) {
//       ctx.status = 500
//       logger.info("🚀 ~ response:", response)
//       ctx.body = { success: false, error: "Failed to filter diff entity" }
//       return
//     }

//     const result = await response.json()
//     ctx.status = 200
//     ctx.body = { success: true, data: result }

//     // ctx.body = { success: true, data: mockFilterDiffEntity.data }
//     // await new Promise((resolve) => setTimeout(resolve, 2000))
//     // ctx.body = mockFilterDiffEntity
//   } catch (error) {
//     console.log('filterDiffEntity ==> ', error)
//     ctx.status = 500
//     ctx.body = { success: false, error }
//   }
// }

// /**
//  * 总结 commits Msg 信息
//  * @param {Koa.Context} ctx
//  */
// export const summaryCommitMsg = async (ctx: Koa.Context) => {
//   const { commits } = ctx.request.body as { commits: string[] }

//   try {
//     const response = await fetch(`${process.env.SERVER_HOST}/openai/json`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         messages: [
//           { role: "system", content: summaryCommitMsgPrompt },
//           { role: "user", content: serialize(commits.map((item) => item.replace("\n", " "))) },
//         ],
//       }),
//     })

//     const result = await response.json()
//     ctx.status = 200
//     ctx.body = { success: true, data: result }
//     // ctx.body = mockSummaryCommitMsg
//   } catch (error) {
//     ctx.status = 500
//     ctx.body = { success: false, error }
//   }
// }

// /**
//  * 分模块分析代码
//  * @param {Koa.Context} ctx
//  */
// export const analyzeCodeModule = async (ctx: Koa.Context) => {
//   const { moduleContext } = ctx.request.body as { moduleContext: string }

//   try {
//     const response = await fetch(`${process.env.SERVER_HOST}/openai/json`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         messages: [
//           { role: "system", content: analyzeCodeModulePrompt },
//           { role: "user", content: moduleContext },
//         ],
//       }),
//     })

//     const result = await response.json()
//     ctx.status = 200
//     ctx.body = { success: true, data: result }
//     // ctx.body = mockAnalyzeCodeModule
//   } catch (error) {
//     ctx.status = 500
//     ctx.body = { success: false, error }
//   }
// }

// interface SummaryPr {
//   walkThrough: string
//   changes: string
//   sequenceDiagram: string
// }

// /**
//  * 总结 PR 的变更
//  * @param {Koa.Context} ctx
//  */
// export const summaryPr = async (ctx: Koa.Context) => {
//   const { summaryParams } = ctx.request.body as { summaryParams: SummaryPr }
//   // console.info("🚀 ~ summaryPr ~ summaryParams:", summaryParams)

//   try {
//     const response = await fetch(`${process.env.SERVER_HOST}/openai/json`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         messages: [
//           { role: "system", content: summaryPrPrompt },
//           { role: "user", content: `${summaryParams.walkThrough}\n\n${summaryParams.changes}\n\n${summaryParams.sequenceDiagram}` },
//         ],
//       }),
//     })

//     const result = await response.json()
//     console.info("🚀 ~ summaryPr ~ result:", result)
//     ctx.status = 200
//     ctx.body = { success: true, data: result }

//     // ctx.body = mockSummaryPr
//   } catch (error) {
//     ctx.status = 500
//     ctx.body = { success: false, error }
//   }
// }
