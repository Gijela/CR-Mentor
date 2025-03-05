import Router from "@koa/router"

import { createToken } from "../../controller/github"

const router = new Router({ prefix: "/github" })

// 流式输出
router.post("/createToken", createToken)

export default router
