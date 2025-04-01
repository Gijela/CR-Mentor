/**
 * 反馈工具
 * 收集代码审查的反馈并用于优化审查体验
 */

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { storageTool } from '../storage';
import { FeedbackParams, FeedbackResult } from './types';

// --- Zod Schemas ---

// 输入 Schema
const FeedbackInputSchema = z.object({
  action: z.enum(['submit', 'get', 'getStats']).describe('反馈操作类型'),
  developerId: z.string().describe('开发者ID'),
  reviewId: z.string().optional().describe('审查ID'),
  rating: z.number().min(1).max(5).optional().describe('评分（1-5）'),
  comments: z.string().optional().describe('评论和建议'),
  helpful: z.boolean().optional().describe('是否有帮助')
});

// 输出 Schema
const FeedbackDataSchema = z.object({
  reviewId: z.string(),
  developerId: z.string(),
  rating: z.number().optional(),
  comments: z.string().optional(),
  helpful: z.boolean().optional(),
  timestamp: z.string(),
  _meta: z.object({
    id: z.string(),
    createdAt: z.string(),
  }).optional()
});

const FeedbackStatsSchema = z.object({
  total: z.number(),
  avgRating: z.number(),
  helpful: z.number(),
});

const FeedbackOutputSchema = z.object({
  success: z.boolean(),
  action: z.string(),
  feedbackId: z.string().optional(),
  feedbacks: z.array(FeedbackDataSchema).optional(),
  stats: FeedbackStatsSchema.optional(),
  // recentFeedbacks 似乎未在 handler 中返回，暂时注释掉或移除
  // recentFeedbacks: z.array(FeedbackDataSchema).optional(),
  message: z.string().optional(),
});

/**
 * 反馈工具
 * 收集代码审查的反馈并用于优化审查体验
 */
export const feedbackTool = createTool({
  id: 'feedback',
  description: '收集代码审查的反馈并用于优化审查体验',
  inputSchema: FeedbackInputSchema,
  outputSchema: FeedbackOutputSchema,
  execute: async ({ context: inputContext }): Promise<FeedbackResult> => {
    const { action, reviewId, developerId, rating, comments, helpful } = inputContext;
    try {
      switch (action) {
        case 'submit':
          return await submitFeedback(reviewId, developerId, rating, comments, helpful);

        case 'get':
          if (!reviewId) {
            return {
              success: false,
              action,
              message: '获取反馈需要提供reviewId'
            };
          }
          return await getFeedback(reviewId);

        case 'getStats':
          return await getFeedbackStats(developerId);

        default:
          return {
            success: false,
            action,
            message: `不支持的操作: ${action}`
          };
      }
    } catch (error: any) {
      console.error('反馈工具错误:', error);
      return {
        success: false,
        action,
        message: `反馈操作失败: ${error.message}`
      };
    }
  }
});

/**
 * 提交反馈
 */
async function submitFeedback(
  reviewId: string | undefined,
  developerId: string,
  rating?: number,
  comments?: string,
  helpful?: boolean
): Promise<FeedbackResult> {
  if (!reviewId) {
    return {
      success: false,
      action: 'submit',
      message: '提交反馈需要提供reviewId'
    };
  }

  // 验证评分
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return {
      success: false,
      action: 'submit',
      message: '评分必须在1-5之间'
    };
  }

  // 构建反馈数据
  const feedbackData = {
    reviewId,
    developerId,
    rating,
    comments,
    helpful,
    timestamp: new Date().toISOString()
  };

  // 存储反馈
  const saveResult = await (storageTool as { execute: Function }).execute({
    context: {
      action: 'save',
      type: 'feedback',
      data: feedbackData
    }
  });

  if (saveResult.success) {
    // 更新关联的审查记录
    try {
      const reviewResult = await (storageTool as { execute: Function }).execute({
        context: {
          action: 'load',
          type: 'review',
          id: reviewId
        }
      });

      if (reviewResult.success && reviewResult.data) {
        const reviewData = reviewResult.data as any;

        // 将反馈ID添加到审查记录
        reviewData.feedbackIds = reviewData.feedbackIds || [];
        reviewData.feedbackIds.push(saveResult.id as string);

        // 更新审查记录
        await (storageTool as { execute: Function }).execute({
          context: {
            action: 'save',
            type: 'review',
            id: reviewId,
            data: reviewData
          }
        });
      }
    } catch (err) {
      console.warn('更新审查记录的反馈ID失败，但反馈已保存', err);
    }

    // 更新开发者记录
    try {
      const developerResult = await (storageTool as { execute: Function }).execute({
        context: {
          action: 'load',
          type: 'developer',
          id: developerId
        }
      });

      if (developerResult.success && developerResult.data) {
        const developerData = developerResult.data as any;

        // 更新开发者的反馈统计
        developerData.feedbackStats = developerData.feedbackStats || {
          total: 0,
          avgRating: 0,
          helpful: 0
        };

        developerData.feedbackStats.total++;

        if (rating !== undefined) {
          // 更新平均评分
          const totalRating = (developerData.feedbackStats.avgRating || 0) * (developerData.feedbackStats.total - 1) + rating;
          developerData.feedbackStats.avgRating = totalRating / developerData.feedbackStats.total;
        }

        if (helpful === true) {
          developerData.feedbackStats.helpful = (developerData.feedbackStats.helpful || 0) + 1;
        }

        // 保存更新后的开发者数据
        await (storageTool as { execute: Function }).execute({
          context: {
            action: 'save',
            type: 'developer',
            id: developerId,
            data: developerData
          }
        });
      }
    } catch (err) {
      console.warn('更新开发者反馈统计失败，但反馈已保存', err);
    }

    return {
      success: true,
      action: 'submit',
      feedbackId: saveResult.id as string,
      message: '反馈已提交'
    };
  } else {
    return {
      success: false,
      action: 'submit',
      message: `反馈提交失败: ${saveResult.message}`
    };
  }
}

/**
 * 获取反馈
 */
async function getFeedback(reviewId: string): Promise<FeedbackResult> {
  // 获取所有反馈
  const feedbackResult = await (storageTool as { execute: Function }).execute({
    context: {
      action: 'load',
      type: 'feedback'
    }
  });

  if (feedbackResult.success && feedbackResult.data) {
    // 筛选指定审查的反馈
    const feedbacks = Array.isArray(feedbackResult.data)
      ? feedbackResult.data.filter(f => f.reviewId === reviewId)
      : [];

    return {
      success: true,
      action: 'get',
      feedbacks,
      message: feedbacks.length > 0 ? '成功获取反馈' : '没有找到相关反馈'
    };
  } else {
    return {
      success: false,
      action: 'get',
      message: '获取反馈失败'
    };
  }
}

/**
 * 获取反馈统计
 */
async function getFeedbackStats(developerId: string): Promise<FeedbackResult> {
  // 获取开发者信息
  const developerResult = await (storageTool as { execute: Function }).execute({
    context: {
      action: 'load',
      type: 'developer',
      id: developerId
    }
  });

  if (developerResult.success && developerResult.data) {
    const developerData = developerResult.data as any;

    // 获取反馈统计
    const stats = developerData.feedbackStats || {
      total: 0,
      avgRating: 0,
      helpful: 0
    };

    // 获取所有反馈
    const feedbackResult = await (storageTool as { execute: Function }).execute({
      context: {
        action: 'load',
        type: 'feedback'
      }
    });

    // 获取此开发者的详细反馈
    let recentFeedbacks = [];

    if (feedbackResult.success && feedbackResult.data) {
      // 过滤并获取最近的5条反馈
      recentFeedbacks = Array.isArray(feedbackResult.data)
        ? feedbackResult.data
          .filter(f => f.developerId === developerId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)
        : [];
    }

    return {
      success: true,
      action: 'getStats',
      stats,
      recentFeedbacks,
      message: '成功获取反馈统计'
    };
  } else {
    return {
      success: false,
      action: 'getStats',
      message: '获取反馈统计失败：找不到开发者信息'
    };
  }
} 