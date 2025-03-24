import type Koa from "koa"
import { createClerkClient } from "@clerk/backend"

// 初始化Clerk客户端
export const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (ctx: Koa.Context) => {
  try {
    const { user } = ctx.state
    ctx.body = { success: true, data: user }
  } catch (error) {
    console.error("🚀 ~ getCurrentUser ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, message: "获取用户信息失败", error }
  }
}

/**
 * 获取用户列表
 */
export const getUsers = async (ctx: Koa.Context) => {
  try {
    const users = await clerk.users.getUserList()
    ctx.body = { success: true, data: users }
  } catch (error) {
    console.error("🚀 ~ getUsers ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, message: "获取用户列表失败", error }
  }
}

/**
 * 设置用户 public metadata
 */
export const setUserMetadata = async (ctx: Koa.Context) => {
  try {
    const payload = ctx.request.body as any
    const { id: userId, publicMetadata } = ctx.state.user as any

    const user = await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { ...publicMetadata, ...payload },
    })

    ctx.status = 200
    ctx.body = { success: true, msg: "设置成功", data: { id: user?.id, publicMetadata: user.publicMetadata } }
  } catch (error) {
    console.error("🚀 ~ setUserMetadata ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, msg: "设置失败", error }
  }
}

/**
 * 保存 githubName
 */
export const saveGithubName = async (ctx: Koa.Context) => {
  try {
    const { code } = ctx.request.body as { code: string }
    const { id: userId, publicMetadata } = ctx.state.user as any

    if (!code) {
      ctx.status = 400
      ctx.body = { success: false, msg: "code 不能为空" }
      return
    }

    // 1. 获取 token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(2 * 60 * 1000), //  2 分钟超时时间
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }),
    })
    const { access_token: token } = await tokenResponse.json()

    if (!token) {
      ctx.status = 500
      ctx.body = { success: false, msg: "获取 token 失败" }
      return
    }

    // 2. 获取 GitHub 用户信息
    const userResponse = await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
    const { login: githubName } = await userResponse.json()

    if (!githubName) {
      ctx.status = 500
      ctx.body = { success: false, msg: "获取 githubName 失败" }
      return
    }

    // 3. 保存 GitHub 用户信息
    const user = await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { ...publicMetadata, githubName },
    })

    ctx.status = 200
    ctx.body = { success: true, msg: "保存 GitHub 信息成功", data: { id: user?.id, publicMetadata: user.publicMetadata } }
  } catch (error) {
    console.log("🚀 ~ saveGithubName ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, msg: "保存 GitHub 信息失败", error }
  }
}
