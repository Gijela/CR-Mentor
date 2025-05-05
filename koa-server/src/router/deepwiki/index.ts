import Router from "@koa/router"

const router = new Router({ prefix: "/deepwiki" })

import { sendMessage, pollingResponse, generateUUID } from "@/controller/deepwiki/utils"
import { HandleLargeDiffResult } from "@/lib/groupDiff/types"
import { buildPrSummaryPrompt } from "@/app/prompt/github/pr-summary";

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

import { mock } from './mock'
import { callDevAssistantGenerate } from "@/mastra/callFunc/callPersonalDevAssistantAgent";

router.post("/test", async (ctx) => {
  const result = await callDevAssistantGenerate(`Please follow process A for the following pr report message \n\n ${JSON.stringify(mock)}`, 'MDQ6VXNlcjgyMDcxMjA5')
  ctx.body = result
})

// 辅助函数：发送 System Prompt 并等待响应
async function initializeSessionWithSystemPrompt(
  repo_name: string,
  systemPrompt: string,
  query_id: string,
  logPrefix: string = "" // 可选的日志前缀，用于区分调用场景
): Promise<{ success: boolean, message: string, content: string, error?: any }> {
  console.log(`${logPrefix}🚀 ~ 使用 Query ID (${query_id}) 发送 System Prompt...`);
  try {
    const sendResult = await sendMessage(repo_name, systemPrompt, query_id);
    if (!sendResult || !sendResult?.status) {
      console.error(`${logPrefix}🚨 ~ 发送 System Prompt (Query ID: ${query_id}) 失败: sendMessage returned falsy.`);
      return { success: false, message: 'failed to send message', content: '' }; // 发送失败
    }
    console.log(`${logPrefix}   ~ System Prompt (Query ID: ${query_id}) 发送成功, 开始轮询...`);

    const { isDone, content } = await pollingResponse(query_id);
    if (!isDone) {
      console.warn(`${logPrefix}⚠️ ~ 轮询 System Prompt (Query ID: ${query_id}) 失败: pollingResponse returned falsy.`);
      // 注意：即使轮询失败，对于重试场景，我们可能仍希望继续。
      // 但对于初始场景，这通常表示失败。调用者需要根据返回值决定如何处理。
      return { success: false, message: 'failed to polling response', content: '' }; // 轮询失败/无结果
    }
    console.log(`${logPrefix}   ~ System Prompt (Query ID: ${query_id}) 处理完成.`);
    return { success: true, message: 'success', content }; // 成功
  } catch (error: any) {
    console.error(`${logPrefix}🚨 ~ 处理 System Prompt (Query ID: ${query_id}) 时发生异常:`, error);
    return { success: false, message: 'failed to initialize session with system prompt', content: '', error }; // 发生异常
  }
}

type GetResultBody = {
  compareUrl: string
  baseLabel: string
  headLabel: string
  repo_name: string
  pull_number: number
  modelMaxToken?: number
  prTitle?: string
  prDesc?: string
}

// 获取结果
router.post("/getResult", async (ctx) => {
  const { compareUrl, baseLabel, headLabel, prTitle, prDesc, modelMaxToken = 25000, repo_name, pull_number } = ctx.request.body as Omit<GetResultBody, 'query_id'>

  let currentQueryId = generateUUID()
  const queryIdsUsed: string[] = [currentQueryId]
  const chatResults: string[] = []
  const MAX_RETRIES_PER_PATCH = 1; // 每个 patch 最多重试1次 (总共尝试 1 + 1 = 2次)
  const retryCounts: { [key: number]: number } = {}; // 记录每个 patch 的重试次数
  const owner = repo_name.split('/')[0], repo = repo_name.split('/')[1]

  try {
    // 1. 获取 diffs & systemPrompt
    console.log("🚀 ~ 开始获取 diff 详情和 system prompt...");
    const response = await fetch(`${process.env.SERVER_HOST}/github/getDiffsDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prTitle, prDesc, githubName: owner, compareUrl, baseLabel, headLabel, modelMaxToken }),
    })
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to get diff details:", response.status, errorText);
      ctx.status = response.status;
      ctx.body = { success: false, message: `failed to get diff details: ${errorText}` };
      return;
    }

    const { success, data, systemPrompt, github_node_id } = (await response.json()) as { success: boolean, data: HandleLargeDiffResult, systemPrompt: string, github_node_id: string }
    if (!success || !data || !Array.isArray(data.patches) || !systemPrompt) {
      console.error("Invalid diff details response:", { success, data, systemPrompt });
      ctx.status = 500
      ctx.body = { success: false, message: "failed to get diff details or invalid format" }
      return
    }
    console.log("🚀 ~ 获取 diffs & system prompt 成功，共", data.patches.length, "个 patches");

    // 1.5 使用初始 Query ID 初始化会话
    const { success: initialSessionOk } = await initializeSessionWithSystemPrompt(repo_name, systemPrompt, currentQueryId, "[初始会话] ");
    if (!initialSessionOk) {
      console.error("🚨 ~ 初始化会话失败 (发送或轮询初始 System Prompt 出错).");
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "Failed to initialize session with system prompt.",
        queryIds: queryIdsUsed
      };
      return; // 中止处理
    }

    // 2. 遍历 patches，依次发送消息并获取结果 (允许重试)
    console.log("🚀 ~ 开始处理 Patches...");
    const CALL_PATCH_REVIEW = 'Please follow the requirements to review the multiple file diff code provided below.'
    for (let i = 0; i < data.patches.length; i++) {
      const patch = CALL_PATCH_REVIEW + data.patches[i];
      const currentAttempt = (retryCounts[i] || 0) + 1;
      console.log(`======  🚀 ~ 处理 Patch ${i + 1}/${data.patches.length} (Attempt ${currentAttempt} using Query ID: ${currentQueryId}) patchLength: ${patch.length} ======`)

      try {
        // 2.1 发送当前 patch
        const sendResultData = await sendMessage(repo_name, patch, currentQueryId)
        if (!sendResultData) {
          console.error(`🚀 ~ 发送 Patch ${i + 1} (Attempt ${currentAttempt}, Query ID: ${currentQueryId}) 失败: sendMessage returned falsy`)
          throw new Error("Send message returned falsy");
        }
        console.log(`🚀 ~ 发送 Patch ${i + 1} (Attempt ${currentAttempt}) 成功`)

        // 2.2 轮询获取当前 patch 的结果
        const pollingResultData = await pollingResponse(currentQueryId)
        console.log(`🚀 ~ 轮询 Patch ${i + 1} (Attempt ${currentAttempt}) 结束:`, pollingResultData ? '有数据' : '无数据')
        if (!pollingResultData) {
          console.error(`🚀 ~ 轮询 Patch ${i + 1} (Attempt ${currentAttempt}, Query ID: ${currentQueryId}) 失败: pollingResponse returned falsy`)
          throw new Error("Polling response returned falsy");
        }

        // 存储当前 patch 的结果
        chatResults.push(pollingResultData.content || '')
        console.log("🚀 ~ 当前 chatResults 数量:", chatResults.length)
        // 成功处理，不需要重试，循环会自然进入下一轮 i++

      } catch (error) {
        // 捕获 pollingResponse 或上面抛出的错误
        console.warn(`🚀 ~ 处理 Patch ${i + 1} (Attempt ${currentAttempt}, Query ID: ${currentQueryId}) 捕获异常:`, error)

        retryCounts[i] = (retryCounts[i] || 0) + 1;

        if (retryCounts[i] <= MAX_RETRIES_PER_PATCH) {
          // 如果还没达到最大重试次数
          const previousQueryId = currentQueryId; // 保存旧 ID 用于日志
          currentQueryId = generateUUID()
          queryIdsUsed.push(currentQueryId)
          console.log(`   ~ 创建新的 Query ID: ${currentQueryId} 用于重试 Patch ${i + 1} (旧 ID: ${previousQueryId})`)

          // === 使用新 Query ID 初始化会话 (用于重试) ===
          const { success: retrySessionOk } = await initializeSessionWithSystemPrompt(repo_name, systemPrompt, currentQueryId, "[重试会话] ");
          if (!retrySessionOk) {
            // 即使 System Prompt 初始化失败，仍然尝试发送 patch
            console.warn(`   ~ [重试会话] 初始化失败，但仍将继续尝试发送 Patch ${i + 1} (Query ID: ${currentQueryId})`);
          } else {
            console.log(`   ~ [重试会话] 初始化成功 (Query ID: ${currentQueryId}).`);
          }
          // === 初始化结束 ===

          i--; // 减少 i，以便下次循环重试当前 patch
          console.log(`   ~ 将使用新的 Query ID (${currentQueryId}) 重试 Patch ${i + 2}`)

        } else {
          // 达到最大重试次数
          console.error(`❌ ~ Patch ${i + 1} 达到最大重试次数 (${MAX_RETRIES_PER_PATCH}). 跳过此 patch.`);
        }
      }
    }

    // 3. 所有 patches 处理完成 (可能部分跳过)，返回聚合结果和所有 query_id
    console.log("✅ ~ 所有 Patches 处理完成")

    // 4. 生成 summary
    const summaryQueryId = generateUUID()
    const summaryPrompt = buildPrSummaryPrompt(data.deletedFiles, chatResults)

    const { success: finalSessionOk, content: summaryContent, error: summaryError } = await initializeSessionWithSystemPrompt(repo_name, summaryPrompt, summaryQueryId, "[summary] ");
    if (!finalSessionOk) {
      console.error("🚨 ~ 初始化会话失败 (发送或轮询初始 System Prompt 出错).");
      ctx.status = 500;
      ctx.body = { success: false, message: "Failed to initialize session with system prompt.", queryIds: queryIdsUsed, summaryQueryId, summaryError };
      return; // 中止处理
    }

    // 5. 调用开发者个性化助手
    const prPrompt = JSON.stringify({
      owner,
      repo,
      pull_number,
      prReportText: summaryContent
    })
    await callDevAssistantGenerate(`Please follow process A for the following pr report message \n\n ${prPrompt}`, github_node_id)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: 'call personal dev assistant success',
      data: {
        // chatResults: chatResults, // 只包含成功获取结果的 patch
        chatQueryIds: queryIdsUsed,    // 包含所有尝试过的 queryId
        summaryQueryId,
        summaryContent,
      }
    }
  } catch (error: any) {
    // 捕获顶层错误（例如 fetch 失败或初始 system prompt 失败后抛出的错误）
    console.error("❌ ~ getResult 顶层错误:", error)
    // 检查是否已设置状态码，如果没有（说明是 fetch 之前的错误），则设为 500
    if (!ctx.status || ctx.status < 400) {
      ctx.status = 500;
    }
    // 确保即使在顶层错误中也返回一致的结构
    if (!ctx.body) {
      ctx.body = {
        success: false,
        message: `failed to get result: ${error.message}`,
        error: error.message,
        queryIds: queryIdsUsed, // 可能只包含初始 ID
        resultsSoFar: chatResults // 可能为空
      };
    }
  }
})

export default router
