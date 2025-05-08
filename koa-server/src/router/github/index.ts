import Router from "@koa/router"

import {
  createPrWebhook,
  createPullRequest,
  createToken,
  fetchRepoBranches,
  getDiffsDetails,
  analyzeUserActivityController
} from "../../controller/github"

const router = new Router({ prefix: "/github" })

// 根据 githubName 创建 token
router.post("/createToken", createToken)

// 获取仓库分支
router.post("/fetchRepoBranches", fetchRepoBranches)

// 创建 PR cr-mentor 平台创建
router.post("/createPullRequest", createPullRequest)

// 创建 PR github 平台创建
router.post("/createPrWebhook", createPrWebhook)

// 获取 diffs 详情
router.post("/getDiffsDetails", getDiffsDetails)

// 分析用户活动，获取 commits 和 diffs
router.post("/analyzeUserActivity", analyzeUserActivityController)

export default router
