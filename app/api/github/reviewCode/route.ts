import { NextResponse } from 'next/server'
import { PullRequestPayload } from '@/interface/github/pullRequest';
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { AGENT_SYSTEM_TEMPLATE } from '@/lib/prompt/github/pull_request';
import { model } from '@/lib/model';
import { createBatchFileCommentsTool, createCodeReviewTool, createPrSummaryTool, createSpecialFileCommentTool } from '@/lib/agentTools/github/pull_request';

// 优化 Agent 配置
let agentExecutor: AgentExecutor | null = null;

async function getOrCreateAgent(tools: any[]) {
  if (!agentExecutor) {
    agentExecutor = await initializeAgentExecutorWithOptions(
      tools,
      model,
      {
        agentType: "structured-chat-zero-shot-react-description",
        verbose: true,
        maxIterations: 5,
        returnIntermediateSteps: true,
        handleParsingErrors: true,
        agentArgs: {
          prefix: AGENT_SYSTEM_TEMPLATE,
        }
      }
    );
  }
  return agentExecutor;
}

export async function POST(req: Request) {
  try {
    const { payload } = await req.json();
    const { action, pull_request }: PullRequestPayload = JSON.parse(payload);
    const { _links, title, body, user, head, base } = pull_request;

    if (action !== 'opened') {
      return NextResponse.json({ success: false, message: `only support pr opened, ${action} is not opened` }, { status: 200 });
    }

    // 1. 获取用户 token
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName: user.login }),
    });
    const { success, token, msg, error } = await tokenResponse.json();
    console.log("🚀 ~ POST ~ token:", token)
    if (!success) {
      return NextResponse.json({ success: false, message: msg, error }, { status: 500 });
    }

    // 2. 获取 PR 差异
    const diffResponse = await fetch(
      _links.self.href,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3.diff',
          'X-GitHub-Api-Version': '2022-11-28',
        }
      }
    );
    const diff = await diffResponse.text();
    console.log("🚀 ~ POST ~ diff:", diff.length)

    const response = await fetch(`${base.repo.compare_url.replace('{base}', base.label).replace('{head}', head.label)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": 'application/vnd.github.v3+json',
        "X-GitHub-Api-Version": '2022-11-28',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ success: false, message: `Failed to fetch compare data` }, { status: 500 });
    }
    const { files, commits } = await response.json();

    // 3. 准备 PR 内容
    const prContent = `
    ### PR Title
    ${title}

    ### PR Description
    ${body}

    ### File Changes
    ${diff}
    `;

    // 创建工具
    const reviewTool = createCodeReviewTool(prContent);
    const summaryTool = createPrSummaryTool(token, _links.comments.href);
    // const specialFileCommentTool = createSpecialFileCommentTool(token, _links.review_comments.href, files, commits);
    const batch_file_comments = createBatchFileCommentsTool(token, _links.review_comments.href, files, commits);

    // 使用新的 Agent 初始化方式
    const executor = await getOrCreateAgent([reviewTool, summaryTool, batch_file_comments]);
    console.log("开始执行代码评审...");

    const result = await executor.invoke({
      input: `请严格按照以下顺序执行且每个工具仅执行一次：
      1. 使用 code_review 工具分析代码并保存结果
      2. 使用 create_pr_summary 工具将保存的分析结果发布为总结评论
      3. 使用 batch_file_comments 工具将保存的建议发布为行级评论
      注意：每个工具只能执行一次，执行完一个工具后必须继续执行下一个工具。`
    });

    // 添加更详细的结果检查
    if (result.intermediateSteps?.length >= 5) {
      console.error("Agent执行达到最大迭代次数:", {
        steps: result.intermediateSteps
      });
      return NextResponse.json(
        { error: "代码评审执行超时，可能是由于任务过于复杂或指令不清晰导致" },
        { status: 408 }
      );
    }

    // 处理结果
    if (result.output === 'Agent stopped due to max iterations.') {
      console.error("Agent执行超时:", {
        steps: result.intermediateSteps
      });
      return NextResponse.json(
        { error: "代码评审执行超时, 请重试" },
        { status: 408 }
      );
    }

    return NextResponse.json({
      success: true,
      answer: result.output,
      raw: process.env.NODE_ENV === 'development' ? result : undefined
    });

  } catch (error) {
    console.error('Code review error:', error);
    return NextResponse.json(
      { error: 'Failed to process code review' },
      { status: 500 }
    );
  }
}
