import Router from "@koa/router"

import { analyzeDiff, analyzeRepo } from "../../controller/repoAnalyze"

// 添加路由前缀，避免可能的路由冲突
const router = new Router({ prefix: "/repo" })

// 处理 diff 内容
router.post("/analyzeDiff", analyzeDiff)

// 分析仓库
router.post("/analyzeRepo", analyzeRepo)

// 测试路由
router.post("/test", async (ctx) => {
  ctx.body = { success: true, data: "Hi~" }
})

export default router
