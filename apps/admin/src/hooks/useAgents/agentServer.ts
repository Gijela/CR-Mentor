import type { DiffInfo } from "@/lib/github"

import type { SummaryPr, UseAgentsOptions } from "."

/**
 * 调用 agent server 的 codeReviewAgent 生成代码审查结果
 * @param userPrompt 用户输入的 prompt
 * @returns 代码审查结果
 */
export const callCodeReviewAgent = async (userPrompt: string, options: UseAgentsOptions, diffsData: DiffInfo | undefined) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_HOST}/repo/analyzeCodeModule`, {
      method: "POST",
      body: JSON.stringify({ moduleContext: userPrompt }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const { data, success } = await response.json()
    if (!success) {
      throw new Error("code review 失败")
    }
    const { suggestions = [], ...rest } = data

    if (!suggestions || suggestions.length === 0) {
      return { success: true, data: rest }
    }

    try {
      await Promise.all(suggestions.map((commentItem: { file_path: string, comment: string }) => commentFile(
        options.githubName,
        options.reviewCommentsUrl,
        options.lastCommitSha,
        commentItem.file_path,
        (diffsData?.files || []).find((item) => item.filename === commentItem.file_path)?.patch || "",
        commentItem.comment,
      )))
    } catch (error) {
      console.error("code review 失败", error)
    }
    return { success: true, data: rest }
  } catch (error) {
    console.error("code review 失败", error)
    return { success: false, error }
  }
}

/**
 * 对单个文件进行评论
 * @param githubName github 用户名
 * @param reviewCommentsUrl 评论 url
 * @param lastCommitSha 最后一个 commit 的 sha
 * @param file_path 文件路径
 * @param patch 文件 patch
 * @param comment 评论
 */
export const commentFile = async (githubName: string, reviewCommentsUrl: string, lastCommitSha: string, file_path: string, patch: string, comment: string) => {
  console.info("comment params =>", {
    githubName,
    reviewCommentsUrl,
    lastCommitSha,
    file_path,
    patch,
    comment,
  })
  try {
    // 获取 token
    const tokenResponse = await fetch(`${import.meta.env.VITE_SERVER_HOST}/github/createToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ githubName }),
    })
    const token = (await tokenResponse.json())?.token || ""

    const commentResponse = await fetch(
      reviewCommentsUrl,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: comment,
          commit_id: lastCommitSha,
          path: file_path,
          position: patch ? patch.split("\n").length - 1 : 1,
        }),
      },
    )
    console.info("comment response =>", commentResponse)

    if (!commentResponse.ok) {
      const errorData = await commentResponse.json()
      return { success: false, error: errorData }
    }

    const result = await commentResponse.json()

    return { success: true, data: result }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * 调用大模型总结 PR 的变更
 * @param summaryParams 总结参数
 * @param summaryParams.walkThrough 概览
 * @param summaryParams.changes 变更
 * @param summaryParams.sequenceDiagram 时序图
 */
export const summaryPr = async (summaryParams: SummaryPr) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_HOST}/repo/summaryPr`, {
      method: "POST",
      body: JSON.stringify({ summaryParams }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const { data, success } = await response.json()
    if (!success) {
      throw new Error("summaryPr error")
    }
    return { success: true, data }
  } catch (error) {
    console.error("summaryPr 失败", error)
    return { success: false, error }
  }
}

/**
 * 给 github 创建整个 PR 总结
 * @param githubName github 用户名
 * @param commentUrl 评论 url
 * @param summary 总结
 */
export const createPrSummary = async (githubName: string, commentUrl: string, summary: string) => {
  try {
    // 获取 token
    const tokenResponse = await fetch(`${import.meta.env.VITE_SERVER_HOST}/github/createToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ githubName }),
    })
    const token = (await tokenResponse.json())?.token || ""

    // 发布评论
    const response = await fetch(
      commentUrl,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: summary }),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to create PR comment")
    }

    const result = await response.json()

    return { success: true, data: result }
  } catch (error) {
    console.error("🚀 ~ summary: ~ error:", error)
    return { success: false, error }
  }
}
