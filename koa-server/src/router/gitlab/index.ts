import Router from "@koa/router"

// import { createPullRequest, fetchRepoBranches, getDiffsDetails } from "../../controller/github"
import { createPullRequest, fetchRepoBranches, getDiffsDetails } from "../../controller/gitlab"

const router = new Router({ prefix: "/gitlab" })

// 获取仓库分支
router.post("/fetchRepoBranches", fetchRepoBranches)

// 创建 PR
// router.post("/createPullRequest", createPullRequest)

// 获取 diffs 详情
// router.post("/getDiffsDetails", getDiffsDetails)

// 测试路由
router.get("/test", async (ctx) => {
  ctx.body = { success: true, data: "Hi~ gitlab" }
})

export default router
