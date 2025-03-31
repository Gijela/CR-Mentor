/**
 * 代码搜索工具实现
 * 集成 indexer-searcher 进行代码搜索
 */

import { Tool } from '@mastra/core/tool';
import path from 'path';
import {
  CodeSearchParams,
  SearchOptions,
  CodeSearchResult,
  SearchResult,
  ContextAnalysisResult
} from './types';

// 导入 indexer-searcher
import { CodeSearch } from 'indexer-searcher';
import { SearchResult as IndexerSearchResult } from 'indexer-searcher/dist/core/types';

// 创建单例 CodeSearch 实例
let codeSearchInstance: CodeSearch | null = null;

async function getCodeSearchInstance(): Promise<CodeSearch> {
  if (!codeSearchInstance) {
    codeSearchInstance = new CodeSearch({
      index: {
        root: path.join(process.cwd(), '.index'),
        maxCPUs: 4,
        timeout: 600000 // 10分钟
      },
      search: {
        defaultLimit: 20,
        timeout: 30000 // 30秒
      },
      symf: {
        path: process.env.SYMF_PATH || 'symf' // 优先使用环境变量中的路径
      }
    });
  }
  return codeSearchInstance;
}

/**
 * 代码搜索工具
 * 提供语义搜索、关键词搜索和上下文分析能力
 */
export const codeSearchTool = new Tool({
  name: 'codeSearch',
  description: '使用 indexer-searcher 进行代码搜索和分析，提供语义搜索、关键词搜索和上下文分析能力',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '搜索查询',
      },
      context: {
        type: 'object',
        description: '搜索上下文',
        properties: {
          files: {
            type: 'array',
            items: { type: 'string' },
            description: '要搜索的文件列表'
          },
          directories: {
            type: 'array',
            items: { type: 'string' },
            description: '要搜索的目录列表'
          },
          history: {
            type: 'object',
            description: '历史相关信息'
          }
        }
      },
      options: {
        type: 'object',
        description: '搜索选项',
        properties: {
          semanticSearch: {
            type: 'boolean',
            description: '是否进行语义搜索'
          },
          keywordSearch: {
            type: 'boolean',
            description: '是否进行关键词搜索'
          },
          contextAnalysis: {
            type: 'boolean',
            description: '是否进行上下文分析'
          },
          maxResults: {
            type: 'number',
            description: '最大结果数'
          },
          timeout: {
            type: 'number',
            description: '超时时间(ms)'
          }
        }
      }
    },
    required: ['query', 'context']
  },
  handler: async ({ query, context, options }: CodeSearchParams & { options?: SearchOptions }) => {
    try {
      console.log(`执行代码搜索: ${query}`);

      // 设置默认选项
      const searchOptions: SearchOptions = {
        semanticSearch: options?.semanticSearch ?? true,
        keywordSearch: options?.keywordSearch ?? true,
        contextAnalysis: options?.contextAnalysis ?? true,
        maxResults: options?.maxResults ?? 10,
        timeout: options?.timeout ?? 30000
      };

      // 初始化结果
      const result: CodeSearchResult = {
        semanticResults: [],
        keywordResults: []
      };

      // 获取 CodeSearch 实例
      const codeSearch = await getCodeSearchInstance();

      // 确保目录列表不为空
      const directories = context.directories && context.directories.length > 0
        ? context.directories
        : [process.cwd()];

      // 确保有索引
      await ensureIndex(codeSearch, directories[0]);

      // 执行语义搜索
      if (searchOptions.semanticSearch) {
        const semanticResults = await codeSearch.search(query, directories);
        result.semanticResults = convertSearchResults(semanticResults, 'semantic');
      }

      // 执行关键词搜索
      if (searchOptions.keywordSearch && context.files && context.files.length > 0) {
        const keywordResults = await codeSearch.liveSearch(query, query, context.files);
        result.keywordResults = convertSearchResults(keywordResults, 'keyword');
      }

      // 执行上下文分析
      if (searchOptions.contextAnalysis) {
        result.contextAnalysis = await analyzeContext(
          [...result.semanticResults, ...result.keywordResults]
        );
      }

      return result;
    } catch (error: any) {
      console.error('代码搜索出错:', error);
      throw new Error(`代码搜索失败: ${error.message}`);
    }
  }
});

/**
 * 确保索引存在
 * 如果索引不存在，则创建索引
 */
async function ensureIndex(codeSearch: CodeSearch, directory: string): Promise<void> {
  try {
    await codeSearch.createIndex(directory, {
      retryIfLastAttemptFailed: true,
      ignoreExisting: true
    });
  } catch (error) {
    console.warn(`创建索引时出错，尝试继续搜索: ${error}`);
  }
}

/**
 * 转换搜索结果
 * 将 indexer-searcher 的搜索结果转换为工具的搜索结果
 */
function convertSearchResults(
  results: IndexerSearchResult[],
  type: 'semantic' | 'keyword'
): SearchResult[] {
  return results.map(result => ({
    file: result.file.path,
    line: result.range.startPoint.row + 1, // 行号从1开始
    content: result.content || `${result.name} (${result.type})`,
    score: result.blugeScore,
    type
  })).slice(0, 20); // 限制结果数量
}

/**
 * 分析上下文
 * 分析搜索结果，提取相关文件、依赖关系和设计模式
 */
async function analyzeContext(
  searchResults: SearchResult[]
): Promise<ContextAnalysisResult> {
  // 提取相关文件
  const relatedFiles = Array.from(new Set(searchResults.map(result => result.file)));

  // 简单分析提取依赖关系和设计模式
  const dependencies: string[] = [];
  const patterns: string[] = [];

  // 分析代码内容寻找依赖和模式
  for (const result of searchResults) {
    const content = result.content;

    // 简单示例：提取 import 语句中的依赖
    if (content.includes('import ')) {
      const importMatches = content.match(/import\s+(\{[^}]+\}|\S+)\s+from\s+['"]([^'"]+)['"]/g);
      if (importMatches) {
        for (const match of importMatches) {
          const moduleMatch = match.match(/from\s+['"]([^'"]+)['"]/);
          if (moduleMatch && moduleMatch[1]) {
            dependencies.push(moduleMatch[1]);
          }
        }
      }
    }

    // 简单示例：检测设计模式关键词
    const patternKeywords = [
      { pattern: 'Factory', keywords: ['createFactory', 'Factory', 'getInstance'] },
      { pattern: 'Singleton', keywords: ['getInstance', 'instance', 'private constructor'] },
      { pattern: 'Observer', keywords: ['addEventListener', 'observer', 'subscribe', 'notify'] },
      { pattern: 'Strategy', keywords: ['strategy', 'algorithm', 'behavior'] }
    ];

    for (const { pattern, keywords } of patternKeywords) {
      for (const keyword of keywords) {
        if (content.includes(keyword) && !patterns.includes(pattern)) {
          patterns.push(pattern);
          break;
        }
      }
    }
  }

  return {
    relatedFiles: Array.from(new Set(relatedFiles)),
    dependencies: Array.from(new Set(dependencies)),
    patterns: Array.from(new Set(patterns))
  };
} 