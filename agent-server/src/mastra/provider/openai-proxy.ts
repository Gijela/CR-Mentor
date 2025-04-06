import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * openai proxy provider
 */
export const openaiProxyProvider = createOpenAICompatible({
  baseURL: process.env.OPENAI_BASE_URL!,
  name: 'openaiProxy',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
  },
});

/**
 * openai proxy model
 */
export const openaiProxyModel = openaiProxyProvider.chatModel(process.env.OPENAI_MODEL!);
