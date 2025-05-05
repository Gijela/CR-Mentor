import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL!,
  apiKey: process.env.OPENAI_API_KEY!,
  name: 'openai',
});

export const openaiChatModel = openai(process.env.OPENAI_CHAT_MODEL!);

export const openaiEmbeddingModel = openai.embedding(process.env.OPENAI_EMBEDDING_MODEL!);