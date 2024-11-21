import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios, { AxiosHeaders } from "axios";
import { createToken } from "../utils/createToken";
import { createGithubHeaders } from "../codeReview";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const createPRSummary = tool(
  async (input) => {
    console.log("🚀 ~ input:", input)
    try {
      const { user_name = 'Gijela', repo_name, pull_number, summary } = input;

      const commentBody = `
        ## PR 总结

        ${summary.walkthrough}
        
        ## 变更详情

        ${summary.changes}
      `;

      const token = await createToken(user_name);
      console.log("🚀 ~ token:", token)

      await axios.post(
        `https://api.github.com/repos/${repo_name}/issues/${pull_number}/comments`,
        { body: commentBody },
        { headers: createGithubHeaders(token) as unknown as AxiosHeaders }
      );

      return "PR 总结已创建";
    } catch (error: any) {
      return `创建 PR 总结失败: ${error.message}`;
    }
  },
  {
    name: "create_pr_summary",
    description: "当需要在 GitHub PR 上创建总结评论时使用此工具。",
    schema: z.object({
      user_name: z.string().describe("GitHub 用户名"),
      repo_name: z.string().describe("仓库名称"),
      pull_number: z.string().describe("PR 编号"),
      summary: z.object({
        walkthrough: z.string().describe("PR 的整体介绍"),
        changes: z.string().describe("具体变更详情")
      })
    })
  }
);

const tools = [createPRSummary];

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `你是一个代码审查助手，负责分析 GitHub Pull Request 的变更并生成总结。
    
    当前 PR 信息：
    - 仓库：{repo_name}
    - PR 编号：{pull_number}
    - 标题：{title}
    - 描述：{description}
    - 用户名：{user_name}
    
    请分析提供的代码变更，并生成一个清晰的总结。`
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

export async function analyzeCodeChange(
  repo_name: string,
  pull_number: string,
  title: string,
  description: string,
  combinedDiff: string,
  user_name: string = 'Gijela'
) {
  console.log("🚀 ~ analyzeCodeChange ~ repo_name:", repo_name)

  try {
    const llm = new ChatOpenAI({
      configuration: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE,
      },
      modelName: "deepseek-ai/DeepSeek-V2.5",
      temperature: 0.7,
      maxTokens: -1,
    });

    // 首先使用 LLM 生成总结
    const summaryResponse = await llm.invoke(`
      分析以下 PR 变更并生成总结：
      
      标题: ${title}
      描述: ${description}
      代码变更:
      ${combinedDiff}
      
      请生成两部分内容：
      1. 整体介绍（walkthrough）
      2. 具体变更详情（changes）
      
      以 JSON 格式返回，包含 walkthrough 和 changes 两个字段。
    `);
    console.log("🚀 ~ summaryResponse:", summaryResponse)

    // 解析 LLM 返回的总结
    // 尝试从 LLM 返回的字符串中提取 JSON 对象
    let parsedResponse;
    try {
      // 移除可能的前缀和后缀空白字符
      const cleanedResponse = (summaryResponse.content as string).trim();

      // 如果响应以 ```json 开头，移除它
      const jsonContent = cleanedResponse.replace(/^```json\n/, '').replace(/\n```$/, '');

      parsedResponse = JSON.parse(jsonContent);
    } catch (error) {
      console.error('解析 LLM 响应失败:', error);
      throw new Error('无法解析 LLM 返回的 JSON 响应');
    }
    const summary = parsedResponse;
    console.log("🚀 ~ summary:", typeof summary, summary)

    // 直接调用 createPRSummary 工具
    // const result = await createPRSummary.call({
    //   user_name,
    //   repo_name,
    //   pull_number,
    //   summary: {
    //     walkthrough: summary.walkthrough,
    //     changes: summary.changes
    //   }
    // });
    // console.log("🚀 ~ result:", result)

    return summary;
  } catch (error) {
    console.error("分析代码变更失败:", error);
    return "分析代码变更失败";
  }
}
