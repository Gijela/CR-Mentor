import { Branch } from "@/components/Repo/CreatePRModal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { githubName, repoName }: { githubName: string, repoName: string } = await req.json();

  try {
    // 1. 创建token
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName }),
    });
    const { success, token, msg, error }: { success: boolean, token: string, msg: string, error: any } = await tokenResponse.json();
    if (!success) {
      return NextResponse.json({ success: false, message: msg, error }, { status: 500 });
    }

    // 2. 获取仓库分支
    const response = await fetch(
      `https://api.github.com/repos/${githubName}/${repoName}/branches`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    );
    if (!response.ok) {
      throw new Error('get branches failed');
    }

    const branches: Branch[] = await response.json();

    return NextResponse.json({ success: true, data: branches, msg: 'get branches success' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'get branches failed', error }, { status: 500 });
  }
}
