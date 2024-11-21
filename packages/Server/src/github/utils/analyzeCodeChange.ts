import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMSingleActionAgent } from "langchain/agents";
import { LLMChain } from "langchain/chains";
import { AgentExecutor } from "langchain/agents";
import { PULL_REQUEST_ROLE } from "../prompts/pull_request";
import dotenv from "dotenv";
import { CreatePRSummaryTool, CreateReviewCommentTool } from "../tools/pr";
import { MessageContent } from "langchain/schema";
import { ChatPromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";
import { AgentAction, AgentFinish } from "langchain/schema";
dotenv.config();

const tools = [
  new CreatePRSummaryTool(),
  // new CreateReviewCommentTool(process.env.GITHUB_TOKEN as string)
];

// 添加自定义输出解析器
class CustomJsonOutputParser extends BaseOutputParser<AgentAction | AgentFinish> {
  lc_namespace = ["custom", "json"];
  
  getFormatInstructions(): string {
    return `
      输入格式必须是包含以下字段的对象：
      - user_name: GitHub 用户名
      - repo_name: 仓库名称
      - pull_number: PR 编号
      - summary: 包含 walkthrough 和 changes 的对象
    `;
  }

  async parse(text: string): Promise<AgentAction | AgentFinish> {
    console.log("🚀 ~ CustomJsonOutputParser ~ parse ~ text:", text);
    try {
      const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
      console.log("🚀 ~ CustomJsonOutputParser ~ parse ~ cleanedText:", typeof cleanedText, cleanedText)
      const parsed = JSON.parse(cleanedText);
      console.log("🚀 ~ CustomJsonOutputParser ~ parse ~ parsed:", typeof parsed, parsed)
      
      if (parsed.summary) {
        return {
          tool: "create_pr_summary",
          toolInput: parsed.summary,
          log: text
        } as AgentAction;
      }
      
      // if (parsed.comments) {
      //   return {
      //     tool: "create_review_comment",
      //     toolInput: parsed.comments,
      //     log: text
      //   } as AgentAction;
      // }

      throw new Error("输出格式不符合要求");
    } catch (e) {
      console.error("解析失败:", e);
      throw e;
    }
  }
}

/**
//  * 分析代码变更并生成审查评论。
 * @param {string} repo_name - 仓库名称
 * @param {string} pull_number - PR编号
 * @param {string} title - PR标题
 * @param {string} description - PR描述
 * @param {string} combinedDiff - GitHub的combinedDiff字符串，描述了代码的变更。
 * @returns {Promise<MessageContent>} - 返回生成的审查评论。
 */
export async function analyzeCodeChange(
  repo_name: string,
  pull_number: string,
  title: string,
  description: string,
  combinedDiff: string
): Promise<MessageContent> {
  const llm = new ChatOpenAI({
    configuration: {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_API_BASE,
    },
    modelName: "deepseek-ai/DeepSeek-V2.5",
    temperature: 0.7,
  });

  // 创建 LLM Chain
  const llmChain = new LLMChain({
    llm,
    prompt: ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        PULL_REQUEST_ROLE(repo_name, pull_number, title, description)
      )
    ])
  });

  // 使用自定义 Agent
  const agent = new LLMSingleActionAgent({
    llmChain,
    outputParser: new CustomJsonOutputParser(),
    stop: ["\nObservation:"]
  });

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true
  });

  const result = await executor.call({
    input: `
      ### PR Title
      ${title}
      ### PR Description 
      ${description}
      ### File Diff
      ${combinedDiff}
    `,
    chat_history: []
  });

  return result.output;
}
