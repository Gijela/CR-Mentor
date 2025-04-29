import Router from "@koa/router"

const router = new Router({ prefix: "/deepwiki" })

import { sendMessage, pollingResponse, generateUUID } from "@/controller/deepwiki/utils"
import { HandleLargeDiffResult } from "@/lib/groupDiff/types"

// // 发送消息
// router.post("/sendMessage", async (ctx) => {
//   const { repo_name, user_prompt, query_id } = ctx.request.body as { repo_name: string, user_prompt: string, query_id: string }
//   try {
//     const { status, success, data } = await sendMessage(repo_name, user_prompt, query_id)
//     ctx.status = status
//     ctx.body = { success, data }
//   } catch (error) {
//     console.error("🚀 ~ sendMessage ~ error:", error)
//     ctx.status = 500
//     ctx.body = { success: false, message: "failed to send message", error }
//   }
// })

// // 轮询获取最终结果
// router.post("/pollingResponse", async (ctx) => {
//   const { query_id } = ctx.request.body as { query_id: string }
//   try {
//     const { status, success, data } = await pollingResponse(query_id)
//     ctx.status = status
//     ctx.body = { success, data }
//   } catch (error) {
//     console.error("🚀 ~ pollingResponse ~ error:", error)
//     ctx.status = 500
//     ctx.body = { success: false, message: "failed to polling response", error }
//   }
// })

type GetResultBody = {
  githubName: string
  compareUrl: string
  baseLabel: string
  headLabel: string
  repo_name: string
  // query_id: string // 这个参数现在不需要了，因为我们在内部生成
  modelMaxToken?: number
  prTitle?: string
  prDesc?: string
}

// 获取结果
router.post("/getResult", async (ctx) => {
  const { githubName, compareUrl, baseLabel, headLabel, prTitle, prDesc, modelMaxToken = 10000, repo_name } = ctx.request.body as Omit<GetResultBody, 'query_id'> // 移除了请求体中的 query_id

  let currentQueryId = generateUUID() // 初始化第一个 query_id
  const queryIdsUsed: string[] = [currentQueryId] // 存储所有用过的 query_id
  const chatResults: string[] = [] // 存储所有成功的聊天结果

  try {
    // 1. 获取 diffs & 合理分组 diffs
    const response = await fetch(`${process.env.SERVER_HOST}/github/getDiffsDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prTitle, prDesc, githubName, compareUrl, baseLabel, headLabel, modelMaxToken }),
    })
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to get diff details:", response.status, errorText);
      ctx.status = response.status;
      ctx.body = { success: false, message: `failed to get diff details: ${errorText}` };
      return;
    }

    const { success, data } = (await response.json()) as { success: boolean, data: HandleLargeDiffResult }
    if (!success || !data || !Array.isArray(data.patches)) {
      console.error("Invalid diff details response:", { success, data });
      ctx.status = 500
      ctx.body = { success: false, message: "failed to get diff details or invalid format" }
      return
    }
    console.log("🚀 ~ 获取完成pr信息 ~ data 成功，共", data.patches.length, "个 patches")

    // 2. 遍历 patches，依次发送消息并获取结果.
    for (let i = 0; i < data.patches.length; i++) {
      const patch = data.patches[i];
      console.log(`======  🚀 ~ 处理 Patch ${i + 1}/${data.patches.length}  ======`)

      try {
        // 2.1 发送当前 patch
        const sendResultData = await sendMessage(repo_name, patch, currentQueryId) // 使用 currentQueryId
        if (!sendResultData) {
          console.error(`🚀 ~ 发送 Patch ${i + 1} 失败:`, sendResultData)
          ctx.status = 500
          ctx.body = {
            success: false,
            message: `failed to send message for patch ${i + 1}: ${patch.slice(0, 100)}...`,
            error: sendResultData,
            queryIds: queryIdsUsed,
            chatResultsSoFar: chatResults
          }
          return
        }
        console.log(`🚀 ~ 发送 Patch ${i + 1} 成功`, sendResultData)

        // 2.2 轮询获取当前 patch 的结果
        const pollingResultData = await pollingResponse(currentQueryId) // 使用 currentQueryId
        console.log(`🚀 ~ 轮询 Patch ${i + 1} 结束:`, pollingResultData ? '有数据' : '无数据')
        if (!pollingResultData) {
          // 如果轮询明确返回失败 (非异常)，也视为严重错误，终止处理
          console.error(`🚀 ~ 轮询 Patch ${i + 1} 失败:`, pollingResultData)
          ctx.status = 500
          ctx.body = {
            success: false,
            message: `failed to polling response for patch ${i + 1}: ${patch.slice(0, 100)}...`,
            error: pollingResultData,
            queryIds: queryIdsUsed,
            chatResultsSoFar: chatResults
          }
          return
        }

        // 存储当前 patch 的结果
        chatResults.push(pollingResultData.content || '')
        console.log("🚀 ~ 当前 chatResults 数量:", chatResults.length)

      } catch (error) {
        // 捕获 pollingResponse 抛出的异常，按需创建新会话
        console.warn(`🚀 ~ 轮询 Patch ${i + 1} 捕获异常 (可能达到上下文限制):`, error)
        console.log("   ~ 当前已收集结果数量:", chatResults.length)
        console.log("   ~ 已使用的 Query IDs:", queryIdsUsed)

        // 生成新的 query_id 并添加到列表中
        currentQueryId = generateUUID()
        queryIdsUsed.push(currentQueryId)
        console.log(`   ~ 创建新的 Query ID: ${currentQueryId} 用于下一个 patch`)
        // 不需要 return，循环会继续处理下一个 patch (如果还有的话)
      }
    }

    // 3. 所有 patches 处理完成，返回聚合结果和所有 query_id
    console.log("🚀 ~ 所有 Patches 处理完成")
    ctx.status = 200
    ctx.body = {
      success: true,
      data: {
        chatResults: chatResults,
        queryIds: queryIdsUsed
      }
    }
  } catch (error: any) {
    console.error("🚀 ~ getResult 顶层错误:", error)
    ctx.status = 500
    // 在顶层错误中也返回已收集的信息
    ctx.body = {
      success: false,
      message: `failed to get result: ${error.message}`,
      error: error.message,
      queryIds: queryIdsUsed,
      resultsSoFar: chatResults
    }
  }
})

export default router
