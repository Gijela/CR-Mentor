import { ChatOpenAI } from "langchain/chat_models/openai";
import { PULL_REQUEST_ROLE } from "../prompts/pull_request";
import { SystemMessage, HumanMessage, MessageContent } from "langchain/schema";
import dotenv from "dotenv";

dotenv.config();

const llm = new ChatOpenAI({
  configuration: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE,
  },
  modelName: "deepseek-ai/DeepSeek-V2.5",
  temperature: 0.7,
});

/**
 * 分析代码变更并生成审查评论。
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
  const promptTemplate = PULL_REQUEST_ROLE(repo_name, pull_number, title, description)

  try {
    const response = await llm.call([
      new SystemMessage(promptTemplate),
      new HumanMessage(`
        ### Pr Title
        ${title}
        ### Pr Description
        ${description}
        ### File Diff
        ${combinedDiff}
      `)
    ]);

    return response.content
  } catch (error) {
    console.error("代码审查分析失败:", error);
    return "代码审查过程中发生错误，请稍后重试。";
  }
}
