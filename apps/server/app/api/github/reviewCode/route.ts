import { NextResponse } from 'next/server'
import { PullRequestPayload } from '@/interface/github/pullRequest';
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { AGENT_SYSTEM_TEMPLATE } from '@/lib/prompt/github/pull_request';
import { model } from '@/lib/model';
import { createBatchFileCommentsTool, createCodeReviewTool, createPrSummaryTool, createSpecialFileCommentTool } from '@/lib/agentTools/github/pull_request';

// 添加这行来强制动态路由
export const dynamic = 'force-dynamic';

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
        maxIterations: 3,
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
    console.log("====== 开始处理 PR 评审请求 ======")

    // smee 测试环境 payload 处理
    // const { payload } = await req.json();
    // console.log("🚀 ~ POST ~ payload:", payload?.action)
    // console.log("====== payload 信息======", payload)
    // const { action, pull_request }: PullRequestPayload = JSON.parse(payload);

    // 线上环境 payload 处理
    const payload = await req.json();
    console.log("🚀 ~ POST ~ payload:", typeof payload, payload?.action)
    const { action, pull_request }: PullRequestPayload = payload;

    // 常规逻辑
    const { _links, title, body, user, head, base } = pull_request;
    if (action !== 'opened') {
      return NextResponse.json({ success: false, message: `only support pr opened, ${action} is not opened` }, { status: 200 });
    }

    let githubName = user.login, kb_id = '', isCreatedByBot = false;
    if (githubName === 'cr-mentor[bot]') {
      // 从 CR-Mentor 控制台创建的PR, 需要从 body 中提取出 githubName 和 kb_id
      const creatorMatch = body.match(/Created by: \[@([^\]]+)\]/);
      const kbMatch = body.match(/Knowledge Base\[([^\]]+)\]/);
      githubName = creatorMatch ? creatorMatch[1] : githubName;
      kb_id = kbMatch ? kbMatch[1] : null;
      isCreatedByBot = true;
    }

    console.log("🚀 ~ POST ~ isCreatedByBot:", isCreatedByBot)

    // 1. 获取用户 token
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName }),
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

    // 向量查询
    const moduleAnalysis = await model.invoke([
      {
        role: "user",
        content: `根据这段${diff}代码，列出关于这段代码用到的工具库、模块包、编程语言。
          请注意：
          - 知识列表中的每一项都不要有类似或者重复的内容
          - 列出的内容要和代码密切相关
          - 最少列出 3 个, 最多不要超过 6 个
          - 知识列表中的每一项要具体
          - 列出列表，不要对工具库、模块做解释
        `
      }
    ]);
    console.log("🚀 ~ POST ~ moduleAnalysis:", moduleAnalysis)

    let relevantKnowledge = '';
    if (isCreatedByBot) {
      console.log("🚀 ~ 审查代码 ~ isCreatedByBot:", isCreatedByBot)
      const relevantKnowledgeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/supabase/rag/kb_chunks/retrievalChunk`,
        {
          method: "POST",
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: `提供关于以下工具库、模块包和编程语言的最佳实践：${moduleAnalysis}`
              }
            ],
            kb_id: Number(kb_id), // 自定义知识库id
            stream: false,
          }),
        }
      );
      const { message } = await relevantKnowledgeResponse.json();
      relevantKnowledge = message;
    }

    console.log("🚀 ~ 查询到的背景信息 ~ relevantKnowledge:", relevantKnowledge)

    // 将知识整合到 PR 内容中
    const prContent = `
    ### 技术背景知识
    ${relevantKnowledge}

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

    // 当前问题：Agent 重复执行同一个工具
    // 建议添加工具执行状态追踪
    const toolExecutionStatus = {
      code_review: false,
      create_pr_summary: false,
      batch_file_comments: false
    };

    // 修改工具执行逻辑
    const result = await executor.invoke({
      input: `请按顺序执行以下工具，每个工具仅执行一次：
        1. code_review - 分析代码
        2. create_pr_summary - 发布总结评论
        3. batch_file_comments - 发布行级评论
        
        当前工具执行状态:
        - code_review: ${toolExecutionStatus.code_review ? '已完成' : '未执行'}
        - create_pr_summary: ${toolExecutionStatus.create_pr_summary ? '已完成' : '未执行'}
        - batch_file_comments: ${toolExecutionStatus.batch_file_comments ? '已完成' : '未执行'}`
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

    console.log("🚀 ~ 正常结束代码评审:", result.output)

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
