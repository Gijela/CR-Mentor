import { Repository } from "@/components/Repo/interface";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { githubName }: { githubName: string } = await req.json();

  try {
    // 1. 创建token
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName }),
    });
    const { success, token, msg }: { success: boolean, token: string, msg: string } = await tokenResponse.json();
    if (!success) {
      return NextResponse.json({ success: false, message: msg }, { status: 500 });
    }

    // 2. 获取所有仓库列表
    let allRepos: Repository[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const repoResponse = await fetch(
        `https://api.github.com/users/${githubName}/repos?page=${page}&per_page=100`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const repositories: Repository[] = await repoResponse.json();

      allRepos = allRepos.concat(repositories);

      if (repositories.length < 100) {
        hasNextPage = false;
      } else {
        page++;
      }
    }

    return NextResponse.json(
      { success: true, data: allRepos, msg: "get repositories success" },
      { status: 200 }
    );
  } catch (error) {
    console.error("get repositories failed:", error);
    return NextResponse.json(
      { success: false, data: [], msg: "get repositories failed" },
      { status: 500 }
    );
  }
}
