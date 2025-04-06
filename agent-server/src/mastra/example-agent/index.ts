import { Agent } from '@mastra/core/agent';

import { openaiProxyModel } from '../provider/openai-proxy';
import { weatherTool, getGithubTokenTool } from './tools';
import { weatherInstructions, githubTokenInstructions } from './instructions';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  model: openaiProxyModel,
  instructions: weatherInstructions,
  tools: { weatherTool },
});

export const githubTokenAgent = new Agent({
  name: 'GitHub Token Agent',
  model: openaiProxyModel,
  instructions: githubTokenInstructions,
  tools: { getGithubTokenTool },
});
