import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const appId = process.env.GITHUB_APP_ID;
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
${process.env.GITHUB_PRIVATE_KEY}
-----END RSA PRIVATE KEY-----
`

export async function POST(req: Request) {
  const { githubId } = await req.json();

  const payload = {
    iat: Math.floor(Date.now() / 1000), // 签发时间
    exp: Math.floor(Date.now() / 1000) + 10 * 60, // 过期时间（10 分钟）
    iss: appId,
  };

  try {
    // 1. 通过私钥文件生成 JWT
    const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });

    // 2. 获取所有已安装用户的信息
    const installationsResponse = await fetch("https://api.github.com/app/installations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: "application/vnd.github.v3+json",
      }
    });
    const installations = await installationsResponse.json();
    const { access_tokens_url, account } = installations.find(
      (item) => item.account.node_id === githubId
    );
    console.log("access_tokens_url:", access_tokens_url);

    // 3. 获取 githubId 对应用户的 token
    const response = await fetch(access_tokens_url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const { token } = await response.json();

    return NextResponse.json({ success: true, token, account }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: '生成 token 失败' }, { status: 500 });
  }
}
