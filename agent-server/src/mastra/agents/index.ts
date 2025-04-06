// 示例 agent
import { weatherAgent, githubTokenAgent } from './example';

// 与GitHub仓库聊天 github codebase
import { githubCodebaseAgent } from './github-codebase';

// 注册到 mastra 的 agents
export const agents = {
  weatherAgent,
  githubTokenAgent,
  githubCodebaseAgent,
};
