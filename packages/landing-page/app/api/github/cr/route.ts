import { NextResponse } from "next/server";

const difyBaseUrl = process.env.DIFY_BASE_URL
const difyApiKey = process.env.DIFY_APIKEY

export async function POST(req: Request) {
  const request = await req.json();
  console.log("enter app use", typeof request);
  const { action, pull_request, repository, sender } = request;

  // 非 pr, 直接返回
  if (!pull_request || !repository || !sender || action !== "opened") {
    console.log('不是 pr opened', action);
    return NextResponse.json({ message: `不是 pr opened, 暂不支持 action 为 ${action} 的事件` }, { status: 200 });
  }

  console.log("通过了 pr opened 判断条件");

  try {
    const inputDify = {
      github_id: sender.node_id,
      user_name: sender.login,
      repo_name: repository.name,
      repo_fullName: repository.full_name,
      pr_base: pull_request.base.label,
      pr_head: pull_request.head.label,
      pr_idx: String(pull_request.number),
    }
    console.log("🚀 ~ CR ~ inputDify:", inputDify)

    // 调用 dify 工作流
    fetch(`${difyBaseUrl}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: inputDify,
        response_mode: 'blocking',
        user: sender.login
      })
    })

    console.log('CR 工作流调用成功~~');

  } catch (error) {
    console.log("🚀 ~ CR 失败 ~ error:", error)
    return NextResponse.json({ message: 'CR 调用失败' }, { status: 403 });
  }
  return NextResponse.json({ message: 'CR 调用成功' }, { status: 200 });
};
