import { verifyToken } from "@clerk/backend"
import type Koa from "koa"

import { clerk } from "@/controller/clerk"

/**
 * Clerk认证中间件
 */
export const clerkAuth = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const authHeader = ctx.request.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
      ctx.status = 401
      ctx.body = { success: false, message: "未提供认证令牌" }
      return
    }

    const token = authHeader.split(" ")[1]

    // 使用verifyToken函数验证token
    const claims = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })

    if (!claims?.sub) {
      ctx.status = 401
      ctx.body = { success: false, message: "无效的认证令牌" }
      return
    }

    // 获取用户信息并存储在ctx.state中
    const user = await clerk.users.getUser(claims.sub)
    ctx.state.user = user

    await next()
  } catch (error) {
    console.error("🚀 ~ clerkAuth ~ error:", error)
    ctx.status = 401
    ctx.body = { success: false, message: "认证失败", error }
  }
}
