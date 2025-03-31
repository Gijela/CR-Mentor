/**
 * 学习工具类型定义
 */

// 学习工具参数
export interface LearningParams {
  action: 'analyzePatterns' | 'getDeveloperProfile' | 'suggestImprovements' | 'updateDeveloperProfile';
  developerId: string;
  code?: string;
  language?: string;
  profile?: Record<string, any>;
}

// 学习工具结果
export interface LearningResult {
  success: boolean;
  action: string;
  developerId: string;
  patternAnalysis?: PatternAnalysisResult;
  developerProfile?: Record<string, any>;
  suggestions?: ImprovementSuggestion[];
  message?: string;
}

// 模式分析结果
export interface PatternAnalysisResult {
  detectedPatterns: {
    pattern: string;
    occurrences: number;
    examples: string[];
  }[];
  language: string;
}

// 改进建议
export interface ImprovementSuggestion {
  area: string;
  confidence: 'low' | 'medium' | 'high';
  description: string;
  resources?: string[];
} 