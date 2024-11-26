import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const appId = process.env.GITHUB_APP_ID;
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
${process.env.GITHUB_PRIVATE_KEY}
-----END RSA PRIVATE KEY-----
`

export async function POST(req: Request) {
  const { githubName } = await req.json();

  const payload = {
    iat: Math.floor(Date.now() / 1000), // 签发时间
    exp: Math.floor(Date.now() / 1000) + 10 * 60, // 过期时间（10 分钟）
    iss: appId,
  };

  try {
    // 1. 通过私钥文件生成 JWT
    const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

    // 2. 获取 githubName 对应用户的 installationId
    const installationsResponse = await fetch(
      `https://api.github.com/users/${githubName}/installation`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    const { id: installationId } = await installationsResponse.json();

    // 3. 获取 githubName 对应用户的 token
    const access_tokens_url = `https://api.github.com/app/installations/${installationId}/access_tokens`
    const accessTokenResponse = await fetch(access_tokens_url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const { token }: { token: string } = await accessTokenResponse.json();

    return NextResponse.json({ success: true, token, msg: 'create token success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, msg: 'create token failed', error }, { status: 500 });
  }
}
