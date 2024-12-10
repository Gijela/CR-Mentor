import { NextResponse } from "next/server";

export interface CreatePRParams {
  title: string;
  body: string;
  head: string;
  base: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  const { githubName, repoName, data }: { githubName: string, repoName: string, data: CreatePRParams } = await req.json();

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

    // 2. 创建 pull request
    const pullRequestResponse = await fetch(
      `https://api.github.com/repos/${githubName}/${repoName}/pulls`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
          'User-Agent': 'CR-Mentor'
        },
        body: JSON.stringify(data)
      }
    );

    const pullRequestResponseData = await pullRequestResponse.json();
    // console.log("GitHub API Response:", {
    //   status: pullRequestResponse.status,
    //   statusText: pullRequestResponse.statusText,
    //   data: pullRequestResponseData
    // });

    if (!pullRequestResponse.ok) {
      return NextResponse.json({ success: false, data: pullRequestResponseData, msg: pullRequestResponseData?.errors?.[0]?.message || 'create PR failed' }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: pullRequestResponseData, msg: 'create pull request success' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'create pull request failed',
      error
    }, { status: 500 });
  }
}
