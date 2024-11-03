import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, repos_url } = await req.json();

  try {
    const reposResponse = await fetch(repos_url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const repositories = await reposResponse.json();
    console.log("Repositories:", repositories);
    return NextResponse.json({ success: true, data: repositories }, { status: 200 });
  } catch (error) {
    console.error("获取仓库列表失败:", error);
    return NextResponse.json({ success: false, message: "获取仓库列表失败" }, { status: 500 });
  }
}
