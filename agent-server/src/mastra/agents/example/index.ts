import { Agent } from '@mastra/core/agent';

import { deepSeekModel } from '../../model-provider/deepseek';
import { weatherTool, getGithubTokenTool } from './tools';
import { weatherInstructions, githubTokenInstructions } from './instructions';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  model: deepSeekModel,
  instructions: weatherInstructions,
  tools: { weatherTool },
});

export const githubTokenAgent = new Agent({
  name: 'GitHub Token Agent',
  model: deepSeekModel,
  instructions: githubTokenInstructions,
  tools: { getGithubTokenTool },
});
