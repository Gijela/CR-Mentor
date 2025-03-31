/**
 * 反馈工具类型定义
 */

import { CodeAnalysisResult } from '../analysis/types';
import { LearningResult } from '../learning/types';

// 反馈参数
export interface FeedbackParams {
  action: 'submit' | 'get' | 'getStats';
  reviewId?: string;
  developerId: string;
  rating?: number; // 1-5
  comments?: string;
  helpful?: boolean;
}

// 反馈结果
export interface FeedbackResult {
  success: boolean;
  action: string;
  feedbackId?: string;
  feedbacks?: FeedbackData[];
  stats?: FeedbackStats;
  recentFeedbacks?: FeedbackData[];
  message?: string;
}

// 反馈数据
export interface FeedbackData {
  reviewId: string;
  developerId: string;
  rating?: number;
  comments?: string;
  helpful?: boolean;
  timestamp: string;
  _meta?: {
    id: string;
    createdAt: string;
  };
}

// 反馈统计
export interface FeedbackStats {
  total: number;
  avgRating: number;
  helpful: number;
}

export interface DeveloperProfile {
  id: string;
  experience: number; // 1-10
  preferences: {
    style: 'direct' | 'detailed' | 'friendly';
    focus: string[];
    level: 'beginner' | 'intermediate' | 'advanced';
  };
  history?: {
    commonIssues: string[];
    strengths: string[];
    improvements: string[];
  };
}

export interface CodebaseInfo {
  language: string;
  framework?: string;
  conventions: string[];
  complexity: number; // 1-10
  size: 'small' | 'medium' | 'large';
}

export interface FeedbackItem {
  type: 'issue' | 'suggestion' | 'praise' | 'question';
  content: string;
  priority: number; // 1-10
  relatedCode?: string;
  examples?: string[];
  resources?: string[];
}

export interface BestPracticeItem {
  title: string;
  description: string;
  example: string;
  relevance: number; // 0-1
  category: string;
} 