import Router from "@koa/router"

// import { analyzeCodeModule, analyzeDiff, analyzeRepo, filterDiffEntity, summaryCommitMsg, summaryPr } from "../../controller/repoAnalyze"

// // 添加路由前缀，避免可能的路由冲突
const router = new Router({ prefix: "/repo" })

// // 过滤小变更，复杂变更提取实体
// router.post("/filterDiffEntity", filterDiffEntity)

// // 总结 commits Msg 信息
// router.post("/summaryCommitMsg", summaryCommitMsg)

// // 处理 diff 内容
// router.post("/analyzeDiff", analyzeDiff)

// // 分析仓库
// router.post("/analyzeRepo", analyzeRepo)

// // 分模块分析代码
// router.post("/analyzeCodeModule", analyzeCodeModule)

// // 总结 PR 的变更
// router.post("/summaryPr", summaryPr)

// // 测试路由
// router.get("/test", async (ctx) => {
//   ctx.body = { success: true, data: "Hi~" }
// })

export default router
