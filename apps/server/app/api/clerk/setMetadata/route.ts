import { NextResponse } from "next/server";
import { clerkClient } from '@clerk/nextjs/server'

const GITHUB_CLIENT_ID = 'Iv23lirfuP3isbwXrgfi'
const GITHUB_CLIENT_SECRET = 'd9c2e7f0df355504e42531d5211444ca22c998ff'

export async function POST(req: Request) {
  const { userId, code } = await req.json();

  try {
    // 1. 获取 access_token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      signal: AbortSignal.timeout(2 * 60 * 1000), //  2 分钟超时时间
      body: new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      }).toString()
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      throw new Error(`get token failed: ${error.message || tokenResponse.statusText}`);
    }

    const data = await tokenResponse.json();

    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
    }

    const { access_token } = data;

    // 2. 验证 token, 获取 github 用户名
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('verify token failed');
    }

    const { login: githubName } = await userResponse.json();
    console.log("🚀 ~ POST ~ githubName:", githubName)

    // 3. 保存 githubName 到 clerk 中
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { githubName },
    })

    return NextResponse.json({ success: true, msg: 'Save successfully ~' }, { status: 200 });
  } catch (error) {
    console.error('详细错误:', error);
    return NextResponse.json({
      success: false,
      msg: error instanceof Error ? error.message : 'Save failed'
    }, { status: 500 });
  }

}