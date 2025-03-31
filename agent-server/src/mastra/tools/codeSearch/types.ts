/**
 * 代码搜索工具的类型定义
 */

export interface CodeSearchParams {
  query: string;
  context: {
    files?: string[];
    directories: string[];
    history?: {
      commits?: any[];
      changes?: any[];
    };
  };
}

export interface SearchOptions {
  semanticSearch: boolean;
  keywordSearch: boolean;
  contextAnalysis: boolean;
  maxResults?: number;
  timeout?: number;
}

export interface SearchResult {
  file: string;
  line: number;
  content: string;
  score: number;
  type: 'semantic' | 'keyword';
}

export interface ContextAnalysisResult {
  relatedFiles: string[];
  dependencies: string[];
  patterns: string[];
}

export interface CodeSearchResult {
  semanticResults: SearchResult[];
  keywordResults: SearchResult[];
  contextAnalysis?: ContextAnalysisResult;
} 