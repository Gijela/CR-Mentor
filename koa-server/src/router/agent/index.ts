// import Router from "@koa/router"
// import { mastra } from "../../mastra"
// const router = new Router({ prefix: "/agent" })

// // 获取 agent 列表
// router.get("/list", async (ctx) => {
//   // 返回每个agent的name、instruction、tools、provider、modelId
//   const agents = await mastra.getAgents()

//   ctx.status = 200
//   ctx.body = {
//     success: true,
//     data: agents,
//   }
// })

// // 判断当前 agent 是否开启缓存
// router.post("/memory", async (ctx) => {
//   const { resourceId } = ctx.request.body as { resourceId: string }
//   // const memory = await mastra.memory?.getThreadsByResourceId({
//   //   resourceId,
//   // })
//   const memory = await mastra.getMemory()

//   ctx.status = 200
//   ctx.body = {
//     success: true,
//     data: memory,
//   }
// })
// export default router
