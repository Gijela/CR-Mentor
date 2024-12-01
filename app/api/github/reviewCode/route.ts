import { NextResponse } from 'next/server'
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PullRequestPayload } from '@/interface/github/pullRequest';
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { DynamicTool } from "@langchain/core/tools";

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

// 创建代码评审工具
const createCodeReviewTool = (prContent: string) => {
  console.log("🚀 ~ createCodeReviewTool ~ prContent:", prContent)
  return new DynamicTool({
    name: "code_review",
    description: "使用这个工具来执行代码评审。将分析代码中的逻辑错误、安全漏洞、性能问题等关键问题。",
    func: async () => {
      const response = await model.call([
        new SystemMessage(CODE_REVIEWER_PROMPT),
        new HumanMessage(prContent)
      ]);
      return response.content;
    }
  });
};

// 定义 Agent 系统提示
const AGENT_SYSTEM_TEMPLATE = `你是一个专业的代码评审助手。你的任务是：
1. 使用 code_review 工具来分析提交的代码
2. 基于分析结果提供专业的评审意见
3. 重点关注代码中的逻辑错误、安全漏洞和性能问题
4. 以清晰的格式输出评审结果`;

export async function POST(req: Request) {
  try {
    const { payload } = await req.json();
    const { action, pull_request, repository, sender }: PullRequestPayload = JSON.parse(payload);
    console.log("🚀 ~ POST ~ action:", action)

    if (action !== 'opened') {
      return NextResponse.json({ success: false, message: `only support pr opened, ${action} is not opened` }, { status: 200 });
    }

    // 1. 获取用户 token
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/github/createToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName: sender.login }),
    });
    const { success, token, msg, error } = await tokenResponse.json();
    console.log("🚀 ~ POST ~ token:", token)
    if (!success) {
      return NextResponse.json({ success: false, message: msg, error }, { status: 500 });
    }

    // 2. 获取 PR 差异
    const diffResponse = await fetch(
      `https://api.github.com/repos/${repository.owner.login}/${repository.name}/pulls/${pull_request.number}`,
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
    ${pull_request.title}
    
    ### PR Description
    ${pull_request.body}
    
    ### File Changes
    ${diff}
    `;

    // 创建代码评审工具
    const reviewTool = createCodeReviewTool(prContent);

    // 创建 ReAct Agent
    const agent = await createReactAgent({
      llm: model,
      tools: [reviewTool],
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    // 执行代码评审
    const result = await agent.invoke({
      messages: [new HumanMessage(`请对这个 PR 进行代码评审, 代码变更信息为：${diff}`)]
    });

    // 获取评审结果
    const reviewContent = result.messages[result.messages.length - 1].content;
    console.log("🚀 ~ POST ~ reviewContent:", reviewContent)

    // 创建 PR 评论
    await fetch(
      `https://api.github.com/repos/${repository.owner.login}/${repository.name}/issues/${pull_request.number}/comments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: reviewContent })
      }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Code review error:', error);
    return NextResponse.json(
      { error: 'Failed to process code review' },
      { status: 500 }
    );
  }
}
