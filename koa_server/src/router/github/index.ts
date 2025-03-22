import Router from "@koa/router"

import { createPullRequest, createToken, fetchRepoBranches, getDiffsDetails } from "../../controller/github"

const router = new Router({ prefix: "/github" })

// 根据 githubName 创建 token
router.post("/createToken", createToken)

// 获取仓库分支
router.post("/fetchRepoBranches", fetchRepoBranches)

// 创建 PR
router.post("/createPullRequest", createPullRequest)

// 获取 diffs 详情
router.post("/getDiffsDetails", getDiffsDetails)

export default router
