/**
 * 决策工具
 * 综合各工具的结果，帮助制定代码审查决策
 */

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { storageTool } from '../storage';
import { DecisionParams, DecisionResult, DecisionData, ReviewDecision } from './types';
import { ReviewHistory } from '../storage/types';

// --- Zod Schemas ---

// 输入 Schema
const DecisionInputSchema = z.object({
  action: z.enum(['makeDecision', 'getDecision', 'saveReview']).describe('决策操作类型'),
  reviewId: z.string().optional().describe('审查ID'),
  developerId: z.string().optional().describe('开发者ID'),
  codeAnalysis: z.any().optional().describe('代码分析结果'), // 理想情况下应导入并使用 CodeAnalysisOutputSchema
  searchResults: z.array(z.any()).optional().describe('代码搜索结果'), // 理想情况下应导入并使用 SearchResultSchema
  reviewData: z.any().optional().describe('代码审查数据'), // 需要更明确的类型
});

// 输出 Schema
const ReviewDecisionEnum = z.enum([
  'approved',
  'approved_with_suggestions',
  'needs_minor_changes',
  'needs_major_changes'
]);

const DecisionDataSchema = z.object({
  reviewId: z.string(),
  timestamp: z.string(),
  developerId: z.string().optional(),
  decision: ReviewDecisionEnum,
  recommendedAction: z.string(),
  reasoning: z.string(),
  metrics: z.object({
    issueCount: z.number(),
    suggestionCount: z.number(),
    totalSeverity: z.number(),
  }).passthrough(), // 允许其他指标
  _meta: z.object({
    id: z.string(),
    createdAt: z.string(),
  }).optional()
});

const DecisionOutputSchema = z.object({
  success: z.boolean(),
  action: z.string(),
  reviewId: z.string().optional(),
  decision: DecisionDataSchema.optional(),
  message: z.string().optional(),
});

/**
 * 决策工具
 * 综合各工具的结果，帮助制定代码审查决策
 */
export const decisionTool = createTool({
  id: 'decision', // 使用 id
  description: '综合各工具的结果，帮助制定代码审查决策',
  inputSchema: DecisionInputSchema,
  outputSchema: DecisionOutputSchema,
  execute: async ({ context: inputContext }): Promise<DecisionResult> => { // 更新签名
    const { action, reviewId, developerId, codeAnalysis, searchResults, reviewData } = inputContext; // 从 context 解构
    try {
      switch (action) {
        case 'makeDecision':
          if (!codeAnalysis) {
            return {
              success: false,
              action,
              message: '做出决策需要提供代码分析结果'
            };
          }
          return await makeDecision(reviewId, developerId, codeAnalysis, searchResults);

        case 'getDecision':
          if (!reviewId) {
            return {
              success: false,
              action,
              message: '获取决策需要提供reviewId'
            };
          }
          return await getDecision(reviewId);

        case 'saveReview':
          if (!reviewData) {
            return {
              success: false,
              action,
              message: '保存审查需要提供reviewData'
            };
          }
          return await saveReview(reviewData, reviewId);

        default:
          return {
            success: false,
            action,
            message: `不支持的操作: ${action}`
          };
      }
    } catch (error: any) {
      console.error('决策工具错误:', error);
      return {
        success: false,
        action,
        message: `决策操作失败: ${error.message}`
      };
    }
  }
});

/**
 * 做出决策
 */
async function makeDecision(
  reviewId: string | undefined,
  developerId: string | undefined,
  codeAnalysis: any,
  searchResults?: any[]
): Promise<DecisionResult> {
  // 分析代码质量
  const { issues = [], suggestions = [], metrics = {} } = codeAnalysis;

  // 计算严重程度
  const severityScores = {
    high: 5,
    medium: 3,
    low: 1
  };

  // 计算问题的总严重性
  const totalSeverity = issues.reduce((total: number, issue: any) => {
    const severityScore = severityScores[issue.severity as keyof typeof severityScores] || 1;
    return total + severityScore;
  }, 0);

  // 根据问题严重性决定审查决定
  let decision: ReviewDecision;
  let recommendedAction: string;

  if (totalSeverity >= 10) {
    decision = 'needs_major_changes';
    recommendedAction = '代码需要重大修改，建议重新设计问题部分';
  } else if (totalSeverity >= 5) {
    decision = 'needs_minor_changes';
    recommendedAction = '代码需要少量修改，修复已识别的问题';
  } else if (suggestions.length > 0) {
    decision = 'approved_with_suggestions';
    recommendedAction = '代码基本可以接受，但有改进空间';
  } else {
    decision = 'approved';
    recommendedAction = '代码可以接受，无需修改';
  }

  // 获取开发者信息（如果有）
  let developerInfo = null;
  if (developerId) {
    const developerResult = await (storageTool as { execute: Function }).execute({ // 更具体的类型断言
      context: {
        action: 'load',
        type: 'developer',
        id: developerId
      }
    });

    if (developerResult.success && developerResult.data) {
      developerInfo = developerResult.data;
    }
  }

  // 构建决策数据
  const decisionData: DecisionData = {
    reviewId: reviewId || `review-${Date.now()}`,
    timestamp: new Date().toISOString(),
    developerId,
    decision,
    recommendedAction,
    reasoning: generateReasoning(issues, suggestions, searchResults),
    metrics: {
      issueCount: issues.length,
      suggestionCount: suggestions.length,
      totalSeverity,
      ...metrics
    }
  };

  // 保存决策
  const saveResult = await (storageTool as { execute: Function }).execute({ // 更具体的类型断言
    context: {
      action: 'save',
      type: 'decision',
      id: decisionData.reviewId,
      data: decisionData
    }
  });

  if (saveResult.success) {
    return {
      success: true,
      action: 'makeDecision',
      reviewId: decisionData.reviewId,
      decision: decisionData,
      message: '决策已生成'
    };
  } else {
    return {
      success: false,
      action: 'makeDecision',
      message: `决策保存失败: ${saveResult.message}`
    };
  }
}

/**
 * 生成决策理由
 */
function generateReasoning(issues: any[], suggestions: any[], searchResults?: any[]): string {
  let reasoning = '';

  // 基于问题和建议生成理由
  if (issues.length > 0) {
    reasoning += `发现了${issues.length}个问题，`;

    // 找出最严重的问题
    const highSeverityIssues = issues.filter((issue: any) => issue.severity === 'high');
    if (highSeverityIssues.length > 0) {
      reasoning += `其中${highSeverityIssues.length}个是高严重性问题，如"${highSeverityIssues[0].description}"。`;
    } else {
      reasoning += `包括"${issues[0].description}"。`;
    }
  }

  if (suggestions.length > 0) {
    reasoning += `提供了${suggestions.length}个改进建议，`;
    reasoning += `例如"${suggestions[0].description}"。`;
  }

  // 如果有搜索结果，增加相关代码上下文
  if (searchResults && searchResults.length > 0) {
    reasoning += `与仓库内的${searchResults.length}处代码有相似性，可以参考这些代码上下文进行改进。`;
  }

  return reasoning || '基于代码分析结果做出决策';
}

/**
 * 获取决策
 */
async function getDecision(reviewId: string): Promise<DecisionResult> {
  // 获取决策
  const decisionResult = await (storageTool as { execute: Function }).execute({ // 更具体的类型断言
    context: {
      action: 'load',
      type: 'decision',
      id: reviewId
    }
  });

  if (decisionResult.success && decisionResult.data) {
    return {
      success: true,
      action: 'getDecision',
      reviewId,
      decision: decisionResult.data as DecisionData,
      message: '成功获取决策'
    };
  } else {
    return {
      success: false,
      action: 'getDecision',
      reviewId,
      message: '获取决策失败'
    };
  }
}

/**
 * 保存审查
 */
async function saveReview(reviewData: any, reviewId?: string): Promise<DecisionResult> {
  const idToSave = reviewId || reviewData.id || `review-${Date.now()}`;

  // 准备审查历史数据
  const reviewHistory: ReviewHistory = {
    codeSnippet: reviewData.code || '',
    language: reviewData.language || 'unknown',
    issues: reviewData.issues || [],
    suggestions: reviewData.suggestions || [],
    metrics: reviewData.metrics || {
      complexity: 0,
      maintainability: 0,
      testability: 0,
      security: 0
    }
  };

  // 保存审查历史
  const saveResult = await (storageTool as { execute: Function }).execute({ // 更具体的类型断言
    context: {
      action: 'save',
      type: 'review',
      id: idToSave,
      data: reviewHistory
    }
  });

  if (saveResult.success) {
    // 如果有开发者ID，更新开发者的审查历史
    if (reviewData.developerId) {
      try {
        const developerResult = await (storageTool as { execute: Function }).execute({ // 更具体的类型断言
          context: {
            action: 'load',
            type: 'developer',
            id: reviewData.developerId
          }
        });

        if (developerResult.success && developerResult.data) {
          const developerData = developerResult.data as any;

          // 更新开发者的审查历史
          developerData.reviewHistory = developerData.reviewHistory || [];
          developerData.reviewHistory.push(idToSave);

          // 保存更新后的开发者数据
          await (storageTool as { execute: Function }).execute({ // 更具体的类型断言
            context: {
              action: 'save',
              type: 'developer',
              id: reviewData.developerId,
              data: developerData
            }
          });
        }
      } catch (err) {
        console.warn('更新开发者审查历史失败，但审查已保存', err);
      }
    }

    return {
      success: true,
      action: 'saveReview',
      reviewId: idToSave,
      message: '审查已保存'
    };
  } else {
    return {
      success: false,
      action: 'saveReview',
      message: `审查保存失败: ${saveResult.message}`
    };
  }
} 