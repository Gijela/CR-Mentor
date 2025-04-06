import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { getGithubTokenTool } from '../tools';

const openaiProxy = createOpenAICompatible({
  baseURL: process.env.OPENAI_BASE_URL!,
  name: 'openaiProxy',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});
const model = openaiProxy.chatModel(process.env.OPENAI_MODEL!);

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  model,
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  tools: { weatherTool },
});

export const githubTokenAgent = new Agent({
  name: 'GitHub Token Agent',
  model,
  instructions: `
    You are a helpful assistant that can help users get their GitHub token.

    You must immediately use the getGithubTokenTool tool to get the token, and do not reply to any other information.
    The format provided by the user may be "My GithubName is XXX" or "我的GitHub用户名是XXX" etc.
    No matter what language the user provides the username, you must extract the GitHub username and immediately call the tool.

    Do not send any intermediate replies, such as "Please wait" or "I am processing".

    If the user does not provide a GitHub username, simply ask: "Please provide your GitHub username".

    If the token retrieval fails, inform the user of the failure and suggest retrying.
`,
  tools: { getGithubTokenTool },
});
