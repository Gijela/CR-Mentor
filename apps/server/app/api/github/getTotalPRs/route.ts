import { NextResponse } from "next/server";
import { PullRequestItem } from "@/components/PullRequest/interface";

export type TotalPRsResponse = {
  success: boolean;
  data: {
    total_count: number;
    incomplete_results: boolean;
    items: PullRequestItem[];
  };
  msg: string;
  error?: any;
};

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

    // 2. 获取所有 PRs
    const response = await fetch(
      `https://api.github.com/search/issues?q=is:pr+involves:${githubName}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const totalPRsData = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, data: totalPRsData, msg: totalPRsData?.errors?.[0]?.message || 'get total PRs failed' }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: totalPRsData, msg: 'get total PRs success' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'get all PRs failed', error }, { status: 500 });
  }
}
