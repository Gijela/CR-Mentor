import jwt from "jsonwebtoken"
import type Koa from "koa"

import logger from "@/utils/logger"
import { diffsDetails } from "@/mock/getDiffsDetails"

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
  const { repoName } = ctx.request.body as { repoName: string }
  console.log("🚀 ~ fetchRepoBranches ~ repoName:", repoName)

  // 验证项目标识格式
  if (!repoName) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: "项目标识不能为空",
      error: "repoName is required"
    }
    return
  }

  // 验证项目标识格式（数字ID或group/project格式）
  if (!/^\d+$/.test(repoName) && !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repoName)) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: "项目标识格式不正确",
      error: "repoName must be either a numeric ID or in the format 'group/project'",
      example: "123 or group/project"
    }
    return
  }

  try {
    // 2. 获取仓库分支
    const response = await fetch(
      `${process.env.GITLAB_HOST}/api/v4/projects/${repoName}/repository/branches`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITLAB_TOKEN}`,
          Accept: "application/json",
        },
      },
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      ctx.status = response.status
      ctx.body = { 
        success: false, 
        message: "获取分支失败", 
        error: errorData.message || response.statusText,
        status: response.status,
        details: "请确保：\n1. 项目标识正确\n2. 有权限访问该项目\n3. GitLab Token 有效"
      }
      return
    }

    const branches: Branch[] = await response.json()

    ctx.status = 200
    ctx.body = { success: true, data: branches, msg: "获取分支成功" }
  } catch (error) {
    logger.error("🚀 ~ fetchRepoBranches ~ error:", error)
    ctx.status = 500
    ctx.body = { 
      success: false, 
      message: "获取分支失败", 
      error: error instanceof Error ? error.message : String(error)
    }
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
// export const createPullRequest = async (ctx: Koa.Context) => {
//   const { githubName, repoName, data }: { githubName: string, repoName: string, data: CreatePRParams } = ctx.request.body as { githubName: string, repoName: string, data: CreatePRParams }

//   try {
//     // 1. 创建token
//     const tokenResponse = await fetch(`${process.env.SERVER_HOST}/github/createToken`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ githubName }),
//     })
//     const { success, token, msg, error }: { success: boolean, token: string, msg: string, error: any } = await tokenResponse.json()
//     if (!success) {
//       ctx.status = 500
//       ctx.body = { success: false, message: msg, error }
//       return
//     }

//     // 2. 创建 pull request
//     const pullRequestResponse = await fetch(
//       `https://api.github.com/repos/${githubName}/${repoName}/pulls`,
//       {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Accept": "application/vnd.github.v3+json",
//           "X-GitHub-Api-Version": "2022-11-28",
//           "Content-Type": "application/json",
//           "User-Agent": "CR-Mentor",
//         },
//         body: JSON.stringify({
//           ...data,
//           body: `${data.body}\n\nCreated by: [@${githubName}](https://github.com/${githubName})`,
//           // \nKnowledge Base[${ data.kb_id }]: [${ data.kb_title }](https://dashboard.cr-mentor.top/knowledgeBase/edit/?id=${data.kb_id}&name=${data.kb_title})
//         }),
//       },
//     )

//     const pullRequestResponseData = await pullRequestResponse.json()

//     if (!pullRequestResponse.ok) {
//       ctx.status = 200
//       ctx.body = { success: false, data: pullRequestResponseData, msg: pullRequestResponseData?.errors?.[0]?.message || "create PR failed" }
//       return
//     }

//     ctx.status = 200
//     ctx.body = { success: true, token, data: pullRequestResponseData, msg: "create pull request success" }
//   } catch (error) {
//     logger.error("🚀 ~ createPullRequest ~ error:", error)
//     ctx.status = 500
//     ctx.body = {
//       success: false,
//       message: error instanceof Error ? error.message : "create pull request failed",
//       error,
//     }
//   }
// }

// 获取 diffs 详情
// export const getDiffsDetails = async (ctx: Koa.Context) => {
//   const { githubName, compareUrl, baseLabel, headLabel } = ctx.request.body as any

//   try {
//     // 1. 创建token
//     const tokenResponse = await fetch(`${process.env.SERVER_HOST}/github/createToken`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ githubName }),
//     })
//     const { success, token, msg, error } = await tokenResponse.json()
//     if (!success) {
//       ctx.status = 500
//       ctx.body = { success: false, message: msg, error }
//       return
//     }

//     // 2. 获取全量 PR 差异
//     // const diffResponse = await fetch(
//     //   diffLink,
//     //   {
//     //     headers: {
//     //       'Authorization': `Bearer ${token}`,
//     //       'Accept': 'application/vnd.github.v3.diff',
//     //       'X-GitHub-Api-Version': '2022-11-28',
//     //     }
//     //   }
//     // );
//     // const diffTotal = await diffResponse.text();

//     const response = await fetch(`${compareUrl.replace("{base}", baseLabel).replace("{head}", headLabel)}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//         "Accept": "application/vnd.github.v3+json",
//         "X-GitHub-Api-Version": "2022-11-28",
//       },
//     })

//     if (!response.ok) {
//       ctx.status = 500
//       ctx.body = { success: false, message: `Failed to fetch compare data` }
//       return
//     }
//     const { files, commits } = await response.json()

//     ctx.status = 200
//     ctx.body = { success: true, data: { files, commits } }
//     // ctx.body = diffsDetails
//   } catch (error) {
//     logger.error("🚀 ~ getDiffsDetails ~ error:", error)
//     ctx.status = 500
//     ctx.body = { success: false, message: "get diffs details failed", error }
//   }
// }
