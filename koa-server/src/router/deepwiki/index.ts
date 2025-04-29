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
  const { githubName, compareUrl, baseLabel, headLabel, prTitle, prDesc, modelMaxToken = 25000, repo_name } = ctx.request.body as Omit<GetResultBody, 'query_id'>

  let currentQueryId = generateUUID()
  const queryIdsUsed: string[] = [currentQueryId]
  const chatResults: string[] = []
  const MAX_RETRIES_PER_PATCH = 1; // 每个 patch 最多重试1次 (总共尝试 1 + 1 = 2次)
  const retryCounts: { [key: number]: number } = {}; // 记录每个 patch 的重试次数

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

    // 2. 遍历 patches，依次发送消息并获取结果 (允许重试)
    for (let i = 0; i < data.patches.length; i++) { // 注意: 循环条件不变
      const patch = data.patches[i];
      const currentAttempt = (retryCounts[i] || 0) + 1; // 当前是第几次尝试 (包括首次)
      console.log(`======  🚀 ~ 处理 Patch ${i + 1}/${data.patches.length} (Attempt ${currentAttempt}) patchLength: ${patch.length} ======`)

      try {
        // 2.1 发送当前 patch
        const sendResultData = await sendMessage(repo_name, patch, currentQueryId) // 使用 currentQueryId
        if (!sendResultData) {
          console.error(`🚀 ~ 发送 Patch ${i + 1} (Attempt ${currentAttempt}) 失败: sendMessage returned falsy`)
          throw new Error("Send message returned falsy"); // 抛出错误进入 catch 处理重试
        }
        console.log(`🚀 ~ 发送 Patch ${i + 1} (Attempt ${currentAttempt}) 成功`, sendResultData)

        // 2.2 轮询获取当前 patch 的结果
        const pollingResultData = await pollingResponse(currentQueryId) // 使用 currentQueryId
        console.log(`🚀 ~ 轮询 Patch ${i + 1} (Attempt ${currentAttempt}) 结束:`, pollingResultData ? '有数据' : '无数据')
        if (!pollingResultData) {
          // 如果轮询明确返回失败 (非异常)，也视为需要重试的错误
          console.error(`🚀 ~ 轮询 Patch ${i + 1} (Attempt ${currentAttempt}) 失败: pollingResponse returned falsy`)
          throw new Error("Polling response returned falsy"); // 抛出错误进入 catch 处理重试
        }

        // 存储当前 patch 的结果
        chatResults.push(pollingResultData.content || '')
        console.log("🚀 ~ 当前 chatResults 数量:", chatResults.length)
        // 成功处理，不需要重试，循环会自然进入下一轮 i++

      } catch (error) {
        // 捕获 pollingResponse 或上面抛出的错误
        console.warn(`🚀 ~ 处理 Patch ${i + 1} (Attempt ${currentAttempt}) 捕获异常:`, error)

        retryCounts[i] = (retryCounts[i] || 0) + 1; // 增加当前 patch 的重试计数

        if (retryCounts[i] <= MAX_RETRIES_PER_PATCH) {
          // 如果还没达到最大重试次数
          console.log("   ~ 当前已收集结果数量:", chatResults.length)
          console.log("   ~ 已使用的 Query IDs:", queryIdsUsed)

          // 生成新的 query_id 并添加到列表中
          currentQueryId = generateUUID()
          queryIdsUsed.push(currentQueryId)
          console.log(`   ~ 创建新的 Query ID: ${currentQueryId} 用于重试 Patch ${i + 1}`)

          // !!! 关键: 减少 i，以便下一次循环迭代再次处理相同的索引 i
          i--;
          console.log(`   ~ 将重试 Patch ${i + 2}`) // 因为 i-- 了，所以下一个循环的 i+1 还是当前这个 patch

        } else {
          // 达到最大重试次数
          console.error(`🚀 ~ Patch ${i + 1} 达到最大重试次数 (${MAX_RETRIES_PER_PATCH}). 跳过此 patch.`);
          // 不执行 i--，让 for 循环正常进入下一个 patch (i++)
          // 可以考虑在这里记录下哪个 patch 最终失败了
        }
      }
    }

    // 3. 所有 patches 处理完成 (可能部分跳过)，返回聚合结果和所有 query_id
    console.log("🚀 ~ 所有 Patches 处理完成")
    ctx.status = 200
    ctx.body = {
      success: true,
      data: {
        chatResults: chatResults, // 只包含成功获取结果的 patch
        queryIds: queryIdsUsed    // 包含所有尝试过的 queryId
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
