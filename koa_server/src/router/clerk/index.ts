import Router from "@koa/router"

import { getCurrentUser, getUsers, saveGithubName, setUserMetadata } from "@/controller/clerk"
import { clerkAuth } from "@/middleware/clerk"

const router = new Router({ prefix: "/clerk" })

// 获取当前用户信息
router.get("/me", clerkAuth, getCurrentUser)

// 获取用户列表
router.get("/users", clerkAuth, getUsers)

// 设置用户 public metadata
router.post("/setMetadata", clerkAuth, setUserMetadata)

// 保存 githubName
router.post("/saveGithubName", clerkAuth, saveGithubName)

export default router
