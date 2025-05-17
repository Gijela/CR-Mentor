import jwt from "jsonwebtoken"
import type Koa from "koa"

import logger from "@/utils/logger"
import { formatAndGroupDiff } from "@/lib/groupDiff"
import { EDIT_TYPE } from "@/lib/groupDiff/types"
import { FileObject } from "./types"
import { buildPatchSummaryPrompt } from "@/app/prompt/github/patch-summary"
import { fetchAndAnalyzeCommits } from "@/service/github/analysisService"
import { clerk } from "../clerk"

// 根据 githubName 创建 token
export const createToken = async (ctx: Koa.Context) => {
  const { githubName } = ctx.request.body as { githubName: string }
  const appId = process.env.GITHUB_APP_ID
  const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${process.env.GITHUB_PRIVATE_KEY}\n-----END RSA PRIVATE KEY-----`

  const payload = {
    iat: Math.floor(Date.now() / 1000), // 签发时间
    exp: Math.floor(Date.now() / 1000) + 10 * 60, // 过期时间（10 分钟）
    iss: appId,
  }

  if (!githubName) {
    ctx.status = 400
    ctx.body = { success: false, msg: "githubName is required" }
    return
  }

  try {
    // 1. 通过私钥文件生成 JWT
    const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" })

    // 2. 获取 githubName 对应用户的 installationId
    const installationsResponse = await fetch(
      `https://api.github.com/users/${githubName}/installation`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )
    const { id: installationId, account } = await installationsResponse.json()

    // 3. 获取 githubName 对应用户的 token
    const access_tokens_url = `https://api.github.com/app/installations/${installationId}/access_tokens`
    const accessTokenResponse = await fetch(access_tokens_url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    const { token }: { token: string } = await accessTokenResponse.json()
    logger.info("🚀 ~ createToken ~ token:", token)
    ctx.status = 200
    ctx.body = { success: true, token: token || "", msg: "create token success", account }
  } catch (error) {
    logger.error("🚀 ~ createToken ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, msg: "create token failed", error }
  }
}

// 检查 github App 中是否存在该用户
export const checkUserExist = async (ctx: Koa.Context) => {
  const { githubName } = ctx.request.body as { githubName: string }
  const appId = process.env.GITHUB_APP_ID
  const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${process.env.GITHUB_PRIVATE_KEY}\n-----END RSA PRIVATE KEY-----`

  const payload = {
    iat: Math.floor(Date.now() / 1000), // 签发时间
    exp: Math.floor(Date.now() / 1000) + 10 * 60, // 过期时间（10 分钟）
    iss: appId,
  }

  if (!githubName) {
    ctx.status = 400
    ctx.body = { success: false, msg: "githubName is required" }
    return
  }

  try {
    // 1. 通过私钥文件生成 JWT
    const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" })

    // 2. 获取 githubName 对应用户的 installationId
    const installationsResponse = await fetch(
      `https://api.github.com/users/${githubName}/installation`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )
    const { id: installationId } = await installationsResponse.json()
    if (!installationId) {
      ctx.status = 200
      ctx.body = { success: true, data: { isExist: false }, message: "get user id failed, user not exist" }
      return
    }

    // 3. 将 installationId 保存到用户信息中
    const { id: userId, publicMetadata } = ctx.state.user as any
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { ...publicMetadata, installationId },
    })

    ctx.status = 200
    ctx.body = { success: true, data: { isExist: true }, message: "user exist" }
  } catch (error) {
    logger.error("🚀 ~ checkUserExist ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, data: { isExist: false }, message: "get user id failed, user not exist" }
  }
}

interface Branch {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}
// 获取仓库分支
export const fetchRepoBranches = async (ctx: Koa.Context) => {
  const { githubName, repoName }: { githubName: string, repoName: string } = ctx.request.body as { githubName: string, repoName: string }

  try {
    // 1. 创建token
    const tokenResponse = await fetch(`${process.env.SERVER_HOST}/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName }),
    })
    const { success, token, msg, error }: { success: boolean, token: string, msg: string, error: any } = await tokenResponse.json()
    if (!success) {
      ctx.status = 500
      ctx.body = { success: false, message: msg, error }
      return
    }

    // 2. 获取仓库分支
    const response = await fetch(
      `https://api.github.com/repos/${githubName}/${repoName}/branches`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )
    if (!response.ok) {
      ctx.status = 500
      ctx.body = { success: false, message: "get branches failed", error }
      return
    }

    const branches: Branch[] = await response.json()

    ctx.status = 200
    ctx.body = { success: true, data: branches, msg: "get branches success" }
  } catch (error) {
    logger.error("🚀 ~ fetchRepoBranches ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, message: "get branches failed", error }
  }
}

export interface CreatePRParams {
  title: string
  body: string
  head: string
  base: string
  kb_id?: string
  kb_title?: string
}
// 创建 PR
export const createPullRequest = async (ctx: Koa.Context) => {
  const { githubName, repoName, data }: { githubName: string, repoName: string, data: CreatePRParams } = ctx.request.body as { githubName: string, repoName: string, data: CreatePRParams }

  try {
    // 1. 创建token
    const tokenResponse = await fetch(`${process.env.SERVER_HOST}/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName }),
    })
    const { success, token, msg, error }: { success: boolean, token: string, msg: string, error: any } = await tokenResponse.json()
    if (!success) {
      ctx.status = 500
      ctx.body = { success: false, message: msg, error }
      return
    }

    // 2. 创建 pull request
    const pullRequestResponse = await fetch(
      `https://api.github.com/repos/${githubName}/${repoName}/pulls`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
          "User-Agent": "CR-Mentor",
        },
        body: JSON.stringify({
          ...data,
          body: `${data.body}\n\nCreated by: [@${githubName}](https://github.com/${githubName})`,
          // \nKnowledge Base[${ data.kb_id }]: [${ data.kb_title }](https://dashboard.cr-mentor.top/knowledgeBase/edit/?id=${data.kb_id}&name=${data.kb_title})
        }),
      },
    )

    const pullRequestResponseData = await pullRequestResponse.json()

    if (!pullRequestResponse.ok) {
      ctx.status = 200
      ctx.body = { success: false, data: pullRequestResponseData, msg: pullRequestResponseData?.errors?.[0]?.message || "create PR failed" }
      return
    }

    ctx.status = 200
    ctx.body = { success: true, token, data: pullRequestResponseData, msg: "create pull request success" }
  } catch (error) {
    logger.error("🚀 ~ createPullRequest ~ error:", error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: error instanceof Error ? error.message : "create pull request failed",
      error,
    }
  }
}

// 创建 PR webhook
export const createPrWebhook = async (ctx: Koa.Context) => {
  const { payload } = ctx.request.body as { payload: string }
  const { action, number, pull_request } = JSON.parse(payload || "{}") as any

  if (action !== "opened") {
    ctx.status = 200
    ctx.body = { success: true, msg: `unsupported action: ${action}` }
    return
  }

  try {
    const params = {
      compareUrl: pull_request.head.repo.compare_url,
      baseLabel: pull_request.base.label,
      headLabel: pull_request.head.label,
      repo_name: pull_request.head.repo.full_name,
      pull_number: number,
    }
    fetch(`${process.env.SERVER_HOST}/deepwiki/getResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    ctx.status = 200
    ctx.body = { success: true, msg: "success" }
  } catch (error) {
    logger.error("🚀 ~ createPrWebhook ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, message: "create pr webhook failed", error }
  }
}

// 获取 diffs 详情
export const getDiffsDetails = async (ctx: Koa.Context) => {
  const { prTitle, prDesc, githubName, compareUrl, baseLabel, headLabel, modelMaxToken = 25000 } = ctx.request.body as any

  try {
    // 1. 创建token
    const tokenResponse = await fetch(`${process.env.SERVER_HOST}/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName }),
    })
    const { success, token, msg, error, account } = await tokenResponse.json()
    if (!success) {
      ctx.status = 500
      ctx.body = { success: false, message: msg, error }
      return
    }

    // 3. 获取 diffs 详情
    const response = await fetch(`${compareUrl.replace("{base}", baseLabel).replace("{head}", headLabel)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (!response.ok) {
      ctx.status = 500
      ctx.body = { success: false, message: `Failed to fetch compare data` }
      return
    }
    const { files, commits }: { files: FileObject[], commits: any[] } = await response.json()
    // const commitMessages = commits.map(commit => commit.commit.message)
    // const CALL_DEEPWIKI_REPO = 'Based on the current repository information, please play the following role to help me review the code, before opening the diff code review, I need you to clarify your task, after you correctly clarify, I will provide you with the diff code.'
    // const systemPrompt = CALL_DEEPWIKI_REPO + buildPatchSummaryPrompt(prTitle, prDesc, commitMessages)

    // // 4. 智能分组 diff
    // const diffFiles = files.map(file => ({
    //   ...file,
    //   patch: file.status === EDIT_TYPE.DELETED ? null : file.patch,
    // })) as FileObject[];
    // const result = formatAndGroupDiff(modelMaxToken, diffFiles, systemPrompt);

    ctx.status = 200
    ctx.body = { success: true, files, commits, github_node_id: account?.node_id }
  } catch (error) {
    logger.error("🚀 ~ getDiffsDetails ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, message: "get diffs details failed", error }
  }
}


// Updated controller function for analyzing user activity
export const analyzeUserActivityController = async (ctx: Koa.Context) => {
  try {
    console.log("[Controller] Received request for analyzeUserActivity", ctx.request.body)
    const params = ctx.request.body as {
      repositories: { owner: string; repoName: string; branchName: string }[]
      timeRange: { since: string; until: string }
      targetUsername: string
    }

    console.log("[Controller] Received parameters for analyzeUserActivity:", params)

    // Basic validation
    if (!params.repositories || !Array.isArray(params.repositories) || params.repositories.length === 0) {
      ctx.status = 400
      ctx.body = { error: "'repositories' array is required and cannot be empty." }
      return
    }
    for (const repo of params.repositories) {
      if (!repo.owner || !repo.repoName || !repo.branchName) {
        ctx.status = 400
        ctx.body = { error: "Each repository object must have 'owner', 'repoName', and 'branchName'." }
        return
      }
    }
    if (!params.timeRange || !params.timeRange.since || !params.timeRange.until) {
      ctx.status = 400
      ctx.body = { error: "'timeRange' object with 'since' and 'until' properties is required." }
      return
    }
    if (!params.targetUsername) {
      ctx.status = 400
      ctx.body = { error: "'targetUsername' is required." }
      return
    }

    console.log("[Controller] Received parameters for analyzeUserActivity:", JSON.stringify(params, null, 2))

    // Call the analysisService to fetch and analyze commits
    const { githubNodeId, repositoryAnalyses } = await fetchAndAnalyzeCommits(params)

    console.log("[Controller] Service call completed. Result count:", repositoryAnalyses.length)

    ctx.status = 200
    ctx.body = { githubNodeId, repositoryAnalyses } // Return the actual analysis result from the service

  } catch (error: any) {
    console.error("[Controller] Error in analyzeUserActivityController:", error)
    // Consider if the service layer should handle specific errors and controller just handles generic ones
    if (error.status) { // If error has a status (e.g. from Octokit), use it
      ctx.status = error.status
      ctx.body = { error: error.message, details: error.errors || error.documentation_url }
    } else {
      ctx.status = 500
      ctx.body = { error: "Internal server error while analyzing user activity.", details: error.message }
    }
  }
} 