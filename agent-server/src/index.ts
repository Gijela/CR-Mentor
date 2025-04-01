/**
 * CR-Mentor 代码审查助手
 * 主入口文件
 */

import { Mutex } from 'async-mutex'; // 添加显式命名导入以提示构建工具

// 导出mastra库
export { mastra } from './mastra';

// 导出代码审查Agent和工具
export { codeReviewAgent, tools } from './mastra/codeReviewAgent';

// 导出常用工具类型 - 显式导出以避免命名冲突
export type {
  CodeSearchParams,
  SearchOptions,
  CodeSearchResult,
  SearchResult,
  ContextAnalysisResult
} from './mastra/tools/codeSearch/types';
export type {
  CodeAnalysisParams,
  CodeAnalysisResult,
  CodeIssue,
  CodeSuggestion,
  CodeMetrics,
  CodeUnderstanding
} from './mastra/tools/analysis/types';
export type {
  LearningParams,
  LearningResult,
  PatternAnalysisResult,
  ImprovementSuggestion
} from './mastra/tools/learning/types';
export type {
  FeedbackParams,
  FeedbackResult,
  FeedbackData,
  FeedbackStats,
  DeveloperProfile as FeedbackDeveloperProfile, // 重命名
  CodebaseInfo,
  FeedbackItem,
  BestPracticeItem
} from './mastra/tools/feedback/types';
export type {
  DecisionParams,
  DecisionResult,
  DecisionData,
  ReviewDecision,
  ProjectInfo,
  ReviewHistory as DecisionReviewHistory, // 重命名
  ToolAction,
  ReviewStrategy,
  Decision
} from './mastra/tools/decision/types';
export type {
  StorageAction,
  StorageDataType,
  MetaData,
  StorageParams,
  StorageResult,
  ReviewHistory as StorageReviewHistory, // 重命名
  LearningRecord,
  DeveloperInfo as StorageDeveloperInfo, // 重命名
  KnowledgeEntry
} from './mastra/tools/storage/types';

/**
 * 创建代码审查会话
 * @param options 会话选项
 * @returns 会话对象
 */
export async function createCodeReviewSession(options: {
  developerId?: string;
  metadata?: Record<string, any>;
}) {
  const { mastra } = require('./mastra');
  const { codeReviewAgent } = require('./mastra/codeReviewAgent');

  return await mastra.createConversation({
    agent: codeReviewAgent,
    metadata: {
      title: '代码审查会话',
      developerId: options.developerId,
      ...options.metadata
    }
  });
}

/**
 * CR-Mentor 使用示例
 */
export const examples = {
  /**
   * 基本用法示例
   */
  basic: async () => {
    const { createCodeReviewSession } = require('./index');
    const session = await createCodeReviewSession({});

    const code = `
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
    `;

    const response = await session.sendMessage(`请审查这段代码：\n\`\`\`js\n${code}\n\`\`\``);
    console.log(response);
  },

  /**
   * 高级用法示例
   */
  advanced: async () => {
    const { createCodeReviewSession, tools } = require('./index');

    // 1. 创建开发者资料
    const developerId = 'dev_' + Date.now();
    await tools.learningTool.handler({
      action: 'updateDeveloperProfile',
      developerId,
      profile: {
        name: '张三',
        skillLevel: 'intermediate',
        languages: ['javascript', 'typescript'],
        strengths: ['UI开发', '组件设计'],
        areasToImprove: ['性能优化', '代码结构']
      }
    });

    // 2. 创建会话
    const session = await createCodeReviewSession({ developerId });

    // 3. 发送代码审查请求
    const code = `
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
    `;

    const response = await session.sendMessage(`请审查这段代码：\n\`\`\`js\n${code}\n\`\`\``);
    console.log(response);

    // 4. 获取开发者的改进建议
    const suggestions = await tools.learningTool.handler({
      action: 'suggestImprovements',
      developerId
    });

    console.log('个性化改进建议:', suggestions.suggestions);
  }
}; 