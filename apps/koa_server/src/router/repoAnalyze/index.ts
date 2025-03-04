import Router from "@koa/router"

import { analyzeRepo } from "../../controller/repoAnalyze"

// 添加路由前缀，避免可能的路由冲突
const router = new Router({ prefix: "/repo" })

// 分析仓库
router.post("/analyze", analyzeRepo)

// 测试路由
router.post("/test", async (ctx) => {
  ctx.body = { success: true, data: "Hi~" }
})

// 修改默认导出为 module.exports
export default router
