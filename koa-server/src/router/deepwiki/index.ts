import Router from "@koa/router"

const router = new Router({ prefix: "/deepwiki" })

import { initializeSessionWithSystemPrompt, callDeepWiki } from "@/controller/deepwiki/utils"
import { generateUUID } from "@/lib/generateUUID";
import { buildPrSummaryPrompt } from "@/app/prompt/github/pr-summary";
import { handleSingleChat } from "@/controller/deepwiki/singleChatController";

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
import { FileObject } from "@/controller/github/types";
import { buildPatchSummaryPrompt, patchSystemPromptHelloWorld } from "@/app/prompt/github/patch-summary";
import { buildCommitsSummaryPrompt, commitsSystemPromptHelloWorld } from "@/app/prompt/github/commits-summary";
import { UserActivityAnalysisResult } from "@/service/github/analysisService";

router.post("/test", async (ctx) => {
  const testPrompt = `Please follow process A for the following pr report message \n\n ${JSON.stringify(mock)}`
  const result = await fetch(`${process.env.AGENT_HOST}/api/agents/prAnalyzeAgent/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: testPrompt }]
    })
  })
  const agentResult = await result.json()
  console.log("🚀 ~ agentResult:", agentResult)

  ctx.status = 200
  ctx.body = {
    success: true,
    data: agentResult
  }
})

// 每次会话都单开一个新会话(query_id)
router.post("/singleChat", handleSingleChat);

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

// 获取 pr patches 结果
router.post("/getPrResult", async (ctx) => {
  const { compareUrl, baseLabel, headLabel, prTitle, prDesc, modelMaxToken = 25000, repo_name, pull_number } = ctx.request.body as Omit<GetResultBody, 'query_id'>

  let currentQueryId = generateUUID()
  const queryIdsUsed: string[] = [currentQueryId]
  const chatResults: string[] = []
  const owner = repo_name.split('/')[0], repo = repo_name.split('/')[1] // repo_name 格式: owner/repo

  try {
    // 1. 获取 diffs & systemPrompt
    console.log("🚀 ~ 开始获取 diff 详情和 system prompt...");
    const response = await fetch(`${process.env.SERVER_HOST}/github/getDiffsDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prTitle, prDesc, githubName: owner, compareUrl, baseLabel, headLabel, modelMaxToken }),
    })
    const { success: diffSuccess, files, commits, github_node_id } = (await response.json()) as { success: boolean, files: FileObject[], commits: any[], github_node_id: string }
    if (!diffSuccess) {
      console.error("[diff]🚨 ~ 获取 diff 详情失败 (获取 diff 详情或格式化出错).");
      ctx.status = 500
      ctx.body = { success: false, message: "failed to get diff details or invalid format" }
      return
    }
    const commitMessages = commits.map(commit => commit.commit.message)
    const systemPrompt = patchSystemPromptHelloWorld + buildPatchSummaryPrompt(prTitle, prDesc, commitMessages)

    // 2. 调用 deepwiki 分析 diffs
    console.log("🚀 ~ 获取 diffs & system prompt 成功，共", files.length, "个 patches");
    const { success: callDeepWikiSuccess, message: callDeepWikiMessage, chatResults, deletedFiles } = await callDeepWiki(repo_name, files as FileObject[], systemPrompt)
    if (!callDeepWikiSuccess) {
      console.error("Invalid callDeepWiki response:", { callDeepWikiSuccess, callDeepWikiMessage });
      ctx.status = 500
      ctx.body = { success: false, message: "failed to callDeepWiki" }
      return
    }

    // 3. 生成 summary
    const summaryQueryId = generateUUID()
    const summaryPrompt = buildPrSummaryPrompt(deletedFiles, chatResults)
    const { success: finalSessionOk, content: summaryContent, error: summaryError } = await initializeSessionWithSystemPrompt(repo_name, summaryPrompt, summaryQueryId, "[summary] ");
    if (!finalSessionOk) {
      console.error("[summary]🚨 ~ 初始化会话失败 (发送或轮询初始 System Prompt 出错).");
      ctx.status = 500;
      ctx.body = { success: false, message: "Failed to initialize session with system prompt.", queryIds: queryIdsUsed, summaryQueryId, summaryError };
      return; // 中止处理
    }

    // 5. 调用开发者个性化助手
    const prPrompt = JSON.stringify({
      developer_id: github_node_id.toLowerCase(),
      owner,
      repo,
      pull_number,
      prReportText: summaryContent
    })
    const result = await fetch(`${process.env.AGENT_HOST}/api/agents/prAnalyzeAgent/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [{ role: "user", content: `Please follow process A for the following pr report message \n\n ${prPrompt}` }] })
    })
    const agentResult = await result.json()

    ctx.status = 200
    ctx.body = {
      success: true,
      message: 'call personal dev assistant success',
      data: {
        // chatResults: chatResults, // 只包含成功获取结果的 patch
        chatQueryIds: queryIdsUsed,    // 包含所有尝试过的 queryId
        summaryQueryId,
        summaryContent,
        agentResult
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

interface Repository {
  /** 仓库所有者 */
  owner: string;
  /** 仓库名称 */
  repoName: string;
  /** 仓库分支名称 */
  branchName: string;
}

interface TimeRange {
  /** 开始时间 2025-05-01T00:00:00Z */
  since: string;
  /** 结束时间 2025-05-02T00:00:00Z */
  until: string;
}

interface GetCommitResultPayload {
  /** 仓库列表 */
  repositories: Repository[];
  /** 时间范围 */
  timeRange: TimeRange;
  /** 目标用户名 */
  targetUsername: string;
}
// // mock
// const mockGetCommitResultPayload: GetCommitResultPayload = {
//   "repositories": [
//     {
//       "owner": "Gijela", // 示例所有者
//       "repoName": "CR-Mentor", // 示例仓库
//       "branchName": "main" // 示例分支
//     },
//     {
//       "owner": "Gijela", // 示例所有者
//       "repoName": "git-analyze", // 示例仓库
//       "branchName": "main" // 示例分支
//     }
//   ],
//   "timeRange": {
//     "since": "2025-04-10T00:00:00Z", // 开始时间
//     "until": "2025-04-15T00:00:00Z"  // 结束时间
//   },
//   "targetUsername": "Gijela" // 使用正确的大小写形式
// }

type CommitChatResult = {
  repo_name: string
  chatResults: string[]
}

// 获取 commit patches 结果
router.post("/getCommitResult", async (ctx) => {
  const { repositories, timeRange, targetUsername } = ctx.request.body as GetCommitResultPayload

  // 1. 获取所有仓库的 commit 文件对象
  const commitResponse = await fetch(`${process.env.SERVER_HOST}/github/analyzeUserActivity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 如果您需要 API 密钥或其他请求头，请在此处添加
    },
    body: JSON.stringify({ repositories, timeRange, targetUsername }),
  });
  const { githubNodeId, repositoryAnalyses } = (await commitResponse.json()) as UserActivityAnalysisResult

  // 2. 将 commit 文件对象格式化为 repo_name 分组。
  const totalPatchObject: any = {} // repo_name -> patches as FileObject[]
  const totalRepoCommitMsg: any = {} // repo_name -> commits message total
  repositoryAnalyses.forEach(repo => {
    const repo_name = repo.owner + '/' + repo.repoName // repo_name: Gijela/CR-Mentor
    totalPatchObject[repo_name] = []
    totalRepoCommitMsg[repo_name] = repo.commits.map(commit => commit.message).reverse()
    repo.commits.forEach(commit => {
      totalPatchObject[repo_name].unshift(...commit.files) // 升序时间 2025.5.3 -> 2025.5.6
    })
  })

  // 3. 并发调用 deepwiki 分析 commit 结果
  const totalRepoReportList = await Promise.all(
    Object.entries(totalPatchObject).map(async ([repo_name, rawPatches]: any) => {
      if (rawPatches.length === 0) return []
      // repo_name: Gijela/CR-Mentor
      // rawPatches: FileObject[]
      const systemPrompt = commitsSystemPromptHelloWorld + buildCommitsSummaryPrompt(totalRepoCommitMsg[repo_name])
      const { chatResults = [] } = await callDeepWiki(repo_name, rawPatches as FileObject[], systemPrompt)
      return { repo_name, chatResults } as CommitChatResult
    })
  )

  // 4. 并发调用 agent 分析 deepwiki 总结的报告
  const result = await Promise.all(totalRepoReportList.map(async (repoReport: any) => {
    const { repo_name = '', chatResults } = repoReport as CommitChatResult

    const userPrompt = JSON.stringify({
      developer_id: githubNodeId.toLowerCase(),
      owner: repo_name.split('/')[0],
      repo: repo_name.split('/')[1],
      commitsAnalysisReportText: (chatResults || []).join('\n\n'),
      timeRange
    })

    const result = await fetch(`${process.env.AGENT_HOST}/api/agents/commitsAnalyzeAgent/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [{ role: "user", content: userPrompt }] })
    })
    const agentResult = await result.json()
    return { userPrompt: JSON.parse(userPrompt), agentResult }
  }))

  ctx.status = 200
  ctx.body = result
})

export default router
