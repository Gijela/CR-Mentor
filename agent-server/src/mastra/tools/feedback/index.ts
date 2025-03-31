/**
 * 反馈工具
 * 收集代码审查的反馈并用于优化审查体验
 */

import { Tool } from '@mastra/core/tool';
import { storageTool } from '../storage';
import { FeedbackParams, FeedbackResult } from './types';

/**
 * 反馈工具
 * 收集代码审查的反馈并用于优化审查体验
 */
export const feedbackTool = new Tool({
  name: 'feedback',
  description: '收集代码审查的反馈并用于优化审查体验',
  parameters: {
    type: 'object',
    properties: {
      reviewId: {
        type: 'string',
        description: '审查ID'
      },
      developerId: {
        type: 'string',
        description: '开发者ID'
      },
      rating: {
        type: 'number',
        description: '评分（1-5）'
      },
      comments: {
        type: 'string',
        description: '评论和建议'
      },
      helpful: {
        type: 'boolean',
        description: '是否有帮助'
      },
      action: {
        type: 'string',
        description: '反馈操作类型',
        enum: ['submit', 'get', 'getStats']
      }
    },
    required: ['action', 'developerId']
  },
  handler: async ({ action, reviewId, developerId, rating, comments, helpful }: FeedbackParams): Promise<FeedbackResult> => {
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
  const saveResult = await storageTool.handler({
    action: 'save',
    type: 'feedback',
    data: feedbackData
  });

  if (saveResult.success) {
    // 更新关联的审查记录
    try {
      const reviewResult = await storageTool.handler({
        action: 'load',
        type: 'review',
        id: reviewId
      });

      if (reviewResult.success && reviewResult.data) {
        const reviewData = reviewResult.data;

        // 将反馈ID添加到审查记录
        reviewData.feedbackIds = reviewData.feedbackIds || [];
        reviewData.feedbackIds.push(saveResult.id);

        // 更新审查记录
        await storageTool.handler({
          action: 'save',
          type: 'review',
          id: reviewId,
          data: reviewData
        });
      }
    } catch (err) {
      console.warn('更新审查记录的反馈ID失败，但反馈已保存', err);
    }

    // 更新开发者记录
    try {
      const developerResult = await storageTool.handler({
        action: 'load',
        type: 'developer',
        id: developerId
      });

      if (developerResult.success && developerResult.data) {
        const developerData = developerResult.data;

        // 更新开发者的反馈统计
        developerData.feedbackStats = developerData.feedbackStats || {
          total: 0,
          avgRating: 0,
          helpful: 0
        };

        developerData.feedbackStats.total++;

        if (rating !== undefined) {
          // 更新平均评分
          const totalRating = developerData.feedbackStats.avgRating * (developerData.feedbackStats.total - 1) + rating;
          developerData.feedbackStats.avgRating = totalRating / developerData.feedbackStats.total;
        }

        if (helpful === true) {
          developerData.feedbackStats.helpful++;
        }

        // 保存更新后的开发者数据
        await storageTool.handler({
          action: 'save',
          type: 'developer',
          id: developerId,
          data: developerData
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
  const feedbackResult = await storageTool.handler({
    action: 'load',
    type: 'feedback'
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
  const developerResult = await storageTool.handler({
    action: 'load',
    type: 'developer',
    id: developerId
  });

  if (developerResult.success && developerResult.data) {
    const developerData = developerResult.data;

    // 获取反馈统计
    const stats = developerData.feedbackStats || {
      total: 0,
      avgRating: 0,
      helpful: 0
    };

    // 获取所有反馈
    const feedbackResult = await storageTool.handler({
      action: 'load',
      type: 'feedback'
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