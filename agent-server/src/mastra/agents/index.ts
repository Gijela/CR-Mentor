// 示例 agent
import { weatherAgent, githubTokenAgent } from './example';

// 与GitHub仓库聊天 github codebase
import { githubCodebaseAgent } from './github-codebase';

// GitHub Code Review Agent
import { codeReviewAgent } from './github-code-review';

// GitHub Diff Review Agent
import { githubDiffReviewAgent } from './github-diff-review';

// GitHub PR Context Builder Agent
import { PRContextBuilderAgent } from './github-pr-context-builder';

// 注册到 mastra 的 agents
export const agents = {
  weatherAgent,
  githubTokenAgent,
  githubCodebaseAgent,
  codeReviewAgent,
  githubDiffReviewAgent,
  PRContextBuilderAgent,
};
