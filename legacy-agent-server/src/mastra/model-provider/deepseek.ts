import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * deepseek provider
 */
export const deepSeekProvider = createOpenAICompatible({
  baseURL: 'https://api.deepseek.com/v1',
  name: 'deepseek',
  headers: {
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY!}`,
  },
});

/**
 * deepseek model
 */
export const deepSeekModel = deepSeekProvider.chatModel('deepseek-chat');
