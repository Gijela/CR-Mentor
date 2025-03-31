/**
 * 存储工具类型定义
 */

// 存储操作类型
export type StorageAction = 'save' | 'load' | 'delete' | 'list';

// 数据类型
export type StorageDataType = 'review' | 'learning' | 'developer' | 'knowledge';

// 元数据类型
export interface MetaData {
  id: string;
  type: StorageDataType;
  createdAt: string;
  updatedAt: string;
}

// 存储参数类型
export interface StorageParams {
  action: StorageAction;
  type: StorageDataType;
  id?: string;
  data?: Record<string, any>;
}

// 存储结果类型
export interface StorageResult {
  success: boolean;
  action: StorageAction;
  type: StorageDataType;
  id?: string;
  ids?: string[];
  data?: Record<string, any> | Record<string, any>[];
  message?: string;
}

// 审查历史类型
export interface ReviewHistory {
  codeSnippet: string;
  language: string;
  issues: {
    type: string;
    description: string;
    location?: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  suggestions: {
    description: string;
    code?: string;
    reason: string;
  }[];
  metrics: {
    complexity: number;
    maintainability: number;
    testability: number;
    security: number;
  };
  _meta?: MetaData;
}

// 学习记录类型
export interface LearningRecord {
  developerId: string;
  patterns: {
    pattern: string;
    occurrences: number;
    examples: string[];
  }[];
  improvements: {
    area: string;
    description: string;
    resources?: string[];
  }[];
  _meta?: MetaData;
}

// 开发者信息类型
export interface DeveloperInfo {
  id: string;
  name: string;
  email?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  languages: string[];
  strengths: string[];
  areasToImprove: string[];
  reviewHistory?: string[]; // 审查历史ID列表
  _meta?: MetaData;
}

// 知识库条目类型
export interface KnowledgeEntry {
  topic: string;
  language: string;
  description: string;
  examples: string[];
  bestPractices: string[];
  resources?: string[];
  relatedTopics?: string[];
  _meta?: MetaData;
} 