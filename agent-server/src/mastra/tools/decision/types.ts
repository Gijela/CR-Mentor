/**
 * 决策工具类型定义
 */

// 决策参数
export interface DecisionParams {
  action: 'makeDecision' | 'getDecision' | 'saveReview';
  reviewId?: string;
  developerId?: string;
  codeAnalysis?: any;
  searchResults?: any[];
  reviewData?: any;
}

// 决策结果
export interface DecisionResult {
  success: boolean;
  action: string;
  reviewId?: string;
  decision?: DecisionData;
  message?: string;
}

// 决策数据
export interface DecisionData {
  reviewId: string;
  timestamp: string;
  developerId?: string;
  decision: ReviewDecision;
  recommendedAction: string;
  reasoning: string;
  metrics: {
    issueCount: number;
    suggestionCount: number;
    totalSeverity: number;
    [key: string]: any;
  };
  _meta?: {
    id: string;
    createdAt: string;
  };
}

// 审查决定
export type ReviewDecision =
  | 'approved'                // 通过
  | 'approved_with_suggestions' // 通过，但有建议
  | 'needs_minor_changes'     // 需要小改动
  | 'needs_major_changes';    // 需要大改动

import { CodeSearchResult } from '../codeSearch/types';
import { CodeAnalysisResult } from '../analysis/types';
import { LearningResult } from '../learning/types';

export interface ProjectInfo {
  type: string;
  language: string;
  framework?: string;
  complexity: number; // 1-10
  team?: {
    size: number;
    experience: number; // 1-10
  };
}

export interface ReviewHistory {
  totalReviews: number;
  acceptanceRate: number; // 0-1
  commonIssues: string[];
  averageSeverity: number; // 1-10
}

export interface ToolAction {
  tool: string;
  parameters: any;
  priority: number; // 1-10
  reasoning: string;
}

export interface ReviewStrategy {
  depth: 'surface' | 'moderate' | 'deep';
  focus: string[];
  pattern: string;
  adaptivity: number; // 0-1
}

export interface Decision {
  action: 'search' | 'analyze' | 'learn' | 'feedback' | 'report';
  tools: ToolAction[];
  strategy: ReviewStrategy;
  reasoning: string;
  confidence: number; // 0-1
} 