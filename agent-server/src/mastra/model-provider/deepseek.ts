import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * deepseek provider
 */
export const deepSeekProvider = createOpenAICompatible({
  baseURL: process.env.DEEPSEEK_BASE_URL!,
  name: 'deepseek',
  headers: {
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY!}`,
  },
});

/**
 * deepseek model
 */
export const deepSeekModel = deepSeekProvider.chatModel(process.env.DEEPSEEK_MODEL!);
