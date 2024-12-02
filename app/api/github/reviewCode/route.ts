import { NextResponse } from 'next/server'
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PullRequestPayload } from '@/interface/github/pullRequest';
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// Code Review 角色提示
const CODE_REVIEWER_PROMPT = `
# Character Description
You are an experienced Code Reviewer, specializing in identifying critical functional issues, logical errors, vulnerabilities, and major performance problems in Pull Requests (PRs).

# Skills Description
1. Pull Request Summarization
2. Critical Code Review
3. Security Analysis

Focus only on:
- Logical errors
- Security vulnerabilities 
- Major performance issues
- Critical functional problems

Avoid commenting on:
- Style issues
- Minor refactors
- Non-functional changes
`

const model = new ChatOpenAI({
  configuration: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE,
  },
  modelName: 'deepseek-ai/DeepSeek-V2.5',
  temperature: 0.2,
  verbose: true,
});

// 创建发布 PR 总结工具
const createPrSummaryTool = (token: string, commentUrl: string) => {
  return new DynamicStructuredTool({
    name: "create_pr_summary",
    description: "使用这个工具来在 PR 上发布总结",
    schema: z.object({
      summary: z.string().describe("要发布的总结内容"),
    }),
    func: async ({ summary }) => {
      const response = await fetch(
        commentUrl,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: summary })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create PR comment');
      }

      return "评论发布成功";
    }
  });
};

// 改进代码评审工具
const createCodeReviewTool = (prContent: string) => {
  return new DynamicStructuredTool({
    name: "code_review",
    description: "使用这个工具来执行代码评审",
    schema: z.object({
      content: z.string().describe("要评审的PR内容"),
    }),
    func: async () => {
      const response = await model.call([
        new SystemMessage(CODE_REVIEWER_PROMPT),
        new HumanMessage(prContent)
      ]);
      return response.content;
    }
  });
};

// 更新 Agent 系统提示
const AGENT_SYSTEM_TEMPLATE = `你是一个专业的代码评审助手。你的任务是：
1. 使用 code_review 工具来分析提交的代码
2. 基于分析结果，使用 create_pr_summary 工具发布评审意见
3. 重点关注代码中的逻辑错误、安全漏洞和性能问题`;

// 优化 Agent 配置
let agentExecutor: AgentExecutor | null = null;

async function getOrCreateAgent(tools: any[]) {
  if (!agentExecutor) {
    const model = new ChatOpenAI({
      configuration: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE,
      },
      modelName: 'deepseek-ai/DeepSeek-V2.5',
      temperature: 0.2,
      verbose: true,
    });

    agentExecutor = await initializeAgentExecutorWithOptions(
      tools,
      model,
      {
        agentType: "structured-chat-zero-shot-react-description",
        verbose: true,
        maxIterations: 3,
        agentArgs: {
          prefix: AGENT_SYSTEM_TEMPLATE
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
    const { _links, title, body, user } = pull_request;

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

    // 使用新的 Agent 初始化方式
    const executor = await getOrCreateAgent([reviewTool, summaryTool]);
    const result = await executor.invoke({
      input: `请对这个 PR 进行代码评审并发布评论`
    });

    // 处理结果
    if (result.output === 'Agent stopped due to max iterations.') {
      console.error("Agent执行超时:", {
        steps: result.intermediateSteps
      });
      return NextResponse.json(
        { error: "代码评审执行超时，请重试" },
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
