import Router from "@koa/router"
import { mastra } from "../../mastra"
const router = new Router({ prefix: "/agent" })

// 获取 agent 列表
router.get("/list", async (ctx) => {
  // 返回每个agent的name、instruction、tools、provider、modelId
  const agents = await mastra.getAgents()

  ctx.status = 200
  ctx.body = {
    success: true,
    data: agents,
  }
})

// 判断当前 agent 是否使用缓存
// router.post("/status", async (ctx) => {
//   const { agent_name } = ctx.request.body as { agent_name: string }
//   const agent = await mastra.getAgent(agent_name as any)
//   const memory = await agent.getMemory()
//   console.log("🚀 ~ router.post ~ cache:", memory)
//   ctx.status = 200
//   ctx.body = {
//     success: true,
//     data: memory,
//   }
// })

// 获取指定 agent 的所有线程(一个线程就是一个会话)
router.post("/thread/list", async (ctx) => {
  const { agent_name, resource_id } = ctx.request.body as { agent_name: string, resource_id: string }

  try {
    const agent = await mastra.getAgent(agent_name as any)
    const memory = await agent.getMemory()
    const threads = await memory.getThreadsByResourceId({ resourceId: resource_id })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: threads,
    }
  } catch (error) {
    console.log("🚀 ~ /thread/list ~ error:", error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: "获取线程列表失败",
    }
  }
})

// 获取指定 agent 的指定线程的会话记录
router.post("/thread/detail", async (ctx) => {
  const { agent_name, thread_id } = ctx.request.body as { agent_name: string, thread_id: string }
  try {
    const agent = await mastra.getAgent(agent_name as any)
    const memory = await agent.getMemory()
    const threadInfo = await memory.getMessages({ threadId: thread_id })

    ctx.status = 200
    ctx.body = {
      success: true,
      data: threadInfo,
    }
  } catch (error) {
    console.log("🚀 ~ /thread/detail ~ error:", error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: "获取线程详情失败",
    }
  }
})

export default router
