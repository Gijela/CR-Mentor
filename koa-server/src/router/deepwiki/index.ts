import Router from "@koa/router"

const router = new Router({ prefix: "/deepwiki" })

import { sendMessage, getResult } from "@/controller/deepwiki"

// 发送消息
router.post("/sendMessage", sendMessage)

// 获取结果
router.post("/getResult", getResult)

export default router
