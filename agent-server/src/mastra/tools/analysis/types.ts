/**
 * 代码分析工具的类型定义
 */

import { CodeSearchResult } from '../codeSearch/types';

export interface CodeAnalysisParams {
  code: string;
  context: {
    files?: string[];
    directories?: string[];
    searchResults?: CodeSearchResult;
    metadata?: any;
  };
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  location: {
    file?: string;
    line?: number;
    column?: number;
  };
  severity: number; // 1-10
  category: string;
  suggestion?: string;
}

export interface CodeSuggestion {
  type: 'improvement' | 'refactor' | 'best_practice' | 'pattern';
  message: string;
  code?: string;
  location?: {
    file?: string;
    line?: number;
    column?: number;
  };
  priority: number; // 1-10
  reasoning: string;
}

export interface CodeMetrics {
  complexity: number;
  maintainability: number;
  testability: number;
  security: number;
  performance: number;
}

export interface CodeUnderstanding {
  purpose: string;
  components: string[];
  patterns: string[];
  dependencies: string[];
  dataFlow: string[];
}

export interface CodeAnalysisResult {
  understanding: CodeUnderstanding;
  issues: CodeIssue[];
  suggestions: CodeSuggestion[];
  metrics: CodeMetrics;
} 