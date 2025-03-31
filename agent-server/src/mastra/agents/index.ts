import { createOpenAI } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
import { OpenAIChatModelId } from '@ai-sdk/openai/internal';
import { codeReviewAgent } from './codeReviewAgent';

const openaiProvider = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('env ====> ', process.env.OPENAI_MODEL, process.env.OPENAI_BASE_URL, process.env.OPENAI_API_KEY);

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      When using the weatherTool:
      - Always provide the location parameter as a string
      - The tool will return temperature, feelsLike, humidity, windSpeed, windGust, conditions, and location
      - Handle any errors gracefully and provide clear error messages to the user

      Use the weatherTool to fetch current weather data.
`,
  model: openaiProvider(process.env.OPENAI_MODEL as OpenAIChatModelId),
  tools: { weatherTool },
});

// 导出代码审查Agent
export { codeReviewAgent };
