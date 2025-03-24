import Router from "@koa/router"

import { jsonOutput, streamOutput } from "../../controller/openai"

const router = new Router({ prefix: "/openai" })

// 流式输出
router.post("/stream", streamOutput)

// json 输出
router.post("/json", jsonOutput)

export default router
