import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { PULL_REQUEST_ROLE } from "../prompts/pull_request";
import dotenv from "dotenv";
import { CreatePRSummaryTool, CreateReviewCommentTool } from "../tools/pr";
import { MessageContent } from "langchain/schema";
dotenv.config();

const tools = [
  new CreatePRSummaryTool(),
  // new CreateReviewCommentTool(process.env.GITHUB_TOKEN as string)
];

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

  const executor = await initializeAgentExecutorWithOptions(
    tools,
    llm,
    {
      agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
      handleParsingErrors: true,
      returnIntermediateSteps: true
    }
  );

  const promptTemplate = PULL_REQUEST_ROLE(repo_name, pull_number, title, description);

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
