import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  configuration: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE,
  },
  modelName: 'deepseek-ai/DeepSeek-V2.5',
  temperature: 0.2,
  verbose: true,
});
