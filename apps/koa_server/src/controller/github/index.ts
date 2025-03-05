import jwt from "jsonwebtoken"
import type Koa from "koa"

import logger from "@/utils/logger"

export const createToken = async (ctx: Koa.Context) => {
  const { githubName } = ctx.request.body as { githubName: string }
  const appId = process.env.GITHUB_APP_ID
  const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${process.env.GITHUB_PRIVATE_KEY}\n-----END RSA PRIVATE KEY-----`

  const payload = {
    iat: Math.floor(Date.now() / 1000), // 签发时间
    exp: Math.floor(Date.now() / 1000) + 10 * 60, // 过期时间（10 分钟）
    iss: appId,
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
    ctx.body = { success: true, token, msg: "create token success" }
  } catch (error) {
    logger.error("🚀 ~ createToken ~ error:", error)
    ctx.status = 500
    ctx.body = { success: false, msg: "create token failed", error }
  }
}
