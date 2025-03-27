import Router from "@koa/router"

// import { createPullRequest, fetchRepoBranches, getDiffsDetails } from "../../controller/github"
import { createMergeRequest, fetchRepoBranches, getDiffsDetails, getProjectList } from "../../controller/gitlab"

const router = new Router({ prefix: "/gitlab" })

// 获取仓库分支
router.post("/fetchRepoBranches", fetchRepoBranches)

// 创建 MR
router.post("/createMergeRequest", createMergeRequest)

// 获取 diffs 详情
router.post("/getDiffsDetails", getDiffsDetails)

// 获取项目列表
router.post("/getProjectList", getProjectList)

// 测试路由
router.get("/test", async (ctx) => {
  ctx.body = { success: true, data: "Hi~ gitlab" }
})

export default router
