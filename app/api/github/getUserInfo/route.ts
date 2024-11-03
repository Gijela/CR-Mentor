import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js';

const appId = process.env.GITHUB_APP_ID;
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
${process.env.GITHUB_PRIVATE_KEY}
-----END RSA PRIVATE KEY-----
`

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)


export async function POST(req: Request) {
  const { installation_id, userId, language } = await req.json();

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
      (item) => item.id === Number(installation_id)
    );

    console.log("access_tokens_url:", access_tokens_url);

    // 3. 获取 installation_id 对应用户的 token
    const response = await fetch(access_tokens_url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const { token } = await response.json();

    // 4. 将 github_id 保存到 clerk
    const { publicMetadata: rawData } = await clerkClient.users.getUser(userId);
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...rawData,
        github_id: account?.node_id,
        avatar_url: account?.avatar_url,
        language
      }
    });

    // 5. 将 github_id 和 clerk_id 的关系存储进 supabase 表
    const { data } = await supabase
      .from('githubId_clerkId')
      .insert([{ github_id: account?.node_id, clerk_id: userId }])
      .select()

    console.log('githubId_clerkId 关系存储成功~', account?.node_id, data);

    return NextResponse.json({ success: true, data: { token, account } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'get repos error' }, { status: 500 });
  }
}
