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
  const { projectId } = ctx.request.body as { projectId: string }
  console.log("🚀 ~ fetchRepoBranches ~ projectId:", projectId)

  // 验证项目标识格式
  if (!projectId) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: "项目标识不能为空",
      error: "projectId is required"
    }
    return
  }

  // 验证项目标识格式（数字ID或group/project格式）
  if (!/^\d+$/.test(projectId) && !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(projectId)) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: "项目标识格式不正确",
      error: "projectId must be either a numeric ID or in the format 'group/project'",
      example: "123 or group/project"
    }
    return
  }

  try {
    // 2. 获取仓库分支
    const response = await fetch(
      `${process.env.GITLAB_HOST}/api/v4/projects/${projectId}/repository/branches`,
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

export interface CreateMRParams {
  title: string
  description: string
  source_branch: string
  target_branch: string
  kb_id?: string
  kb_title?: string
}

// 创建 MR
export const createMergeRequest = async (ctx: Koa.Context) => {
  const { projectId, data }: { projectId: string, data: CreateMRParams } = ctx.request.body as { projectId: string, data: CreateMRParams }

  try {
    // 创建 merge request
    const mergeRequestResponse = await fetch(
      `${process.env.GITLAB_HOST}/api/v4/projects/${projectId}/merge_requests`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GITLAB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          source_branch: data.source_branch,
          target_branch: data.target_branch,
          // 可选参数
          // remove_source_branch: true,
          squash: true,
        }),
      },
    )

    const mergeRequestResponseData = await mergeRequestResponse.json()

    if (!mergeRequestResponse.ok) {
      ctx.status = 200
      ctx.body = {
        success: false,
        data: mergeRequestResponseData,
        msg: mergeRequestResponseData?.message || "创建 MR 失败"
      }
      return
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      data: mergeRequestResponseData,
      msg: "创建 MR 成功"
    }
  } catch (error) {
    logger.error("🚀 ~ createMergeRequest ~ error:", error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: error instanceof Error ? error.message : "创建 MR 失败",
      error,
    }
  }
}

// 获取 diffs 详情
export const getDiffsDetails = async (ctx: Koa.Context) => {
  const { projectId, sourceBranch, targetBranch } = ctx.request.body as {
    projectId: string
    sourceBranch: string
    targetBranch: string
  }

  try {
    // 验证参数
    if (!projectId || !sourceBranch || !targetBranch) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: "缺少必要参数",
        error: "projectId, sourceBranch, and targetBranch are required"
      }
      return
    }

    // 获取差异详情
    const response = await fetch(
      `${process.env.GITLAB_HOST}/api/v4/projects/${projectId}/repository/compare?from=${targetBranch}&to=${sourceBranch}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.GITLAB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      ctx.status = response.status
      ctx.body = {
        success: false,
        message: "获取差异详情失败",
        error: errorData.message || response.statusText,
        status: response.status
      }
      return
    }

    const data = await response.json()

    // 转换数据格式以匹配前端期望的结构
    const transformedData = {
      files: data.diffs?.map((diff: any) => ({
        filename: diff.new_path,
        status: diff.new_file ? 'added' : diff.deleted_file ? 'removed' : 'modified',
        additions: diff.additions,
        deletions: diff.diff?.split('\n').filter((line: string) => line.startsWith('-')).length || 0,
        changes: diff.changes,
        patch: diff.diff
      })) || [],
      commits: data.commits?.map((commit: any) => ({
        sha: commit.id,
        commit: {
          message: commit.message,
          author: {
            name: commit.author_name,
            email: commit.author_email,
            date: commit.created_at
          }
        }
      })) || []
    }

    ctx.status = 200
    ctx.body = { success: true, data: transformedData }
  } catch (error) {
    logger.error("🚀 ~ getDiffsDetails ~ error:", error)
    ctx.status = 500
    ctx.body = {
      success: false,
      message: "获取差异详情失败",
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// 获取项目列表
export const getProjectList = async (ctx: Koa.Context) => {
  const query = ctx.request.body as {
    page?: number
    per_page?: number
    search?: string
  }
  const { page = 1, per_page = 20, search = "" } = query

  try {
    const projectsUrl = `${process.env.GITLAB_HOST}/api/v4/projects?membership=true&page=${page}&per_page=${per_page}&search=${search}`
    const projectsResponse = await fetch(projectsUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITLAB_TOKEN}`,
        Accept: "application/json",
      },
    })

    if (!projectsResponse.ok) {
      const errorData = await projectsResponse.json().catch(() => ({}))
      ctx.status = projectsResponse.status
      ctx.body = {
        success: false,
        message: "获取 GitLab 项目列表失败",
        error: errorData.message || projectsResponse.statusText,
        status: projectsResponse.status,
      }
      return
    }

    const data = await projectsResponse.json()

    const formattedData = data.map((project: any) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      visibility: project.visibility,
      star_count: project.star_count || 0,
      forks_count: project.forks_count || 0,
      last_activity_at: project.last_activity_at,
      web_url: project.web_url,
      namespace: project.namespace ? {
        name: project.namespace.name,
        path: project.namespace.path,
        kind: project.namespace.kind
      } : {
        name: "",
        path: "",
        kind: ""
      }
    }))

    ctx.status = 200
    ctx.body = {
      success: true,
      data: formattedData,
      total: formattedData.length,
      page: parseInt(page.toString()),
      per_page: parseInt(per_page.toString()),
      message: "获取 GitLab 项目列表成功",
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: "获取 GitLab 项目列表失败",
      error: error instanceof Error ? error.message : String(error),
    }
  }
} 