/**
 * 代码审查Agent
 */

import { Agent } from '@mastra/core/agent';
import { codeSearchTool } from './tools/codeSearch';
import { analysisTool } from './tools/analysis';
import { learningTool } from './tools/learning';
import { feedbackTool } from './tools/feedback';
import { decisionTool } from './tools/decision';
import { storageTool } from './tools/storage';

/**
 * 代码审查Agent
 */
export const codeReviewAgent = new Agent({
  name: 'codeReviewAgent',
  instructions: `你是一个专业的代码审查助手，擅长对代码进行全面的审查和分析。
你可以：
1. 搜索并理解代码库上下文
2. 分析代码质量、结构和潜在问题
3. 提供具体、有建设性的改进建议
4. 根据开发者经验提供个性化反馈
5. 学习开发者的编码风格和偏好
6. 做出合理的审查决策

在分析代码时，请关注：
- 代码结构和设计模式
- 潜在的bug和安全漏洞
- 性能优化机会
- 可维护性和可读性问题
- 编码规范和最佳实践

请使用以下工具来帮助你完成代码审查：
- codeSearchTool：搜索代码库获取上下文
- analysisTool：分析代码质量和问题
- learningTool：学习开发者编码模式和偏好
- feedbackTool：提供个性化反馈
- decisionTool：综合信息做出审查决策
- storageTool：存储和检索审查历史数据

当被要求进行代码审查时，请遵循以下步骤：
1. 如果有代码库上下文，使用codeSearchTool查找相关代码
2. 使用analysisTool分析代码质量和问题
3. 如果了解开发者ID，使用learningTool获取开发者档案和编码模式
4. 使用decisionTool做出审查决策并保存审查记录
5. 提供详细的审查报告，包括：
   - 代码问题概述（按严重程度排序）
   - 具体改进建议（包括代码示例）
   - 可学习的最佳实践
   - 适合开发者水平的解释和资源链接

回复应当专业、有建设性、易于理解，并针对开发者的技能水平进行调整。`,
  model: 'gpt-4o',
  tools: [
    codeSearchTool,
    analysisTool,
    learningTool,
    feedbackTool,
    decisionTool,
    storageTool
  ]
});

// 导出所有工具
export const tools = {
  codeSearchTool,
  analysisTool,
  learningTool,
  feedbackTool,
  decisionTool,
  storageTool
}; 