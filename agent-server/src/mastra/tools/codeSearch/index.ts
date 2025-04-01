/**
 * 代码搜索工具实现
 * 集成 indexer-searcher 进行代码搜索
 */

import { createTool } from '@mastra/core/tools'; // Ensure createTool is imported if needed
import path from 'path';
import { z } from 'zod'; // Ensure z is imported if needed
import {
  CodeSearchParams,
  SearchOptions,
  CodeSearchResult,
  SearchResult,
  ContextAnalysisResult
} from './types';

// --- Zod Schemas ---
const CodeSearchInputSchema = z.object({
  query: z.string().describe('搜索查询'),
  context: z.object({
    files: z.array(z.string()).optional().describe('要搜索的文件列表'),
    directories: z.array(z.string()).optional().describe('要搜索的目录列表'),
    history: z.any().optional().describe('历史相关信息') // Kept as z.any() for now
  }).default({}),
  options: z.object({
    semanticSearch: z.boolean().optional().default(true).describe('是否进行语义搜索'),
    keywordSearch: z.boolean().optional().default(true).describe('是否进行关键词搜索'),
    contextAnalysis: z.boolean().optional().default(true).describe('是否进行上下文分析'),
    maxResults: z.number().optional().default(10).describe('最大结果数'),
    timeout: z.number().optional().default(30000).describe('超时时间(ms)')
  }).optional().default({})
});

const SearchResultSchema = z.object({
  file: z.string(),
  line: z.number(),
  content: z.string(),
  score: z.number().optional(),
  type: z.enum(['semantic', 'keyword'])
});

const ContextAnalysisResultSchema = z.object({
  relatedFiles: z.array(z.string()),
  dependencies: z.array(z.string()),
  patterns: z.array(z.string())
});

const CodeSearchOutputSchema = z.object({
  semanticResults: z.array(SearchResultSchema),
  keywordResults: z.array(SearchResultSchema),
  contextAnalysis: ContextAnalysisResultSchema.optional()
});

// 导入 indexer-searcher
// 注意：这里的相对路径可能需要根据你的项目结构调整
// 如果 indexer-searcher 是一个 npm 包，应该直接 import
// import { CodeSearch } from '../../../../../indexer-searcher/dist/index';
// import { SearchResult as IndexerSearchResult } from '../../../../../indexer-searcher/dist/core/types';

// 假设 indexer-searcher 导出类型，先用 any 代替
type CodeSearch = any;
type IndexerSearchResult = any;


// 创建单例 CodeSearch 实例
let codeSearchInstance: CodeSearch | null = null;

async function getCodeSearchInstance(): Promise<CodeSearch> {
  if (!codeSearchInstance) {
    // 临时模拟 CodeSearch 类，因为实际的类可能不存在或路径错误
    class MockCodeSearch {
        constructor(config: any) { console.log("MockCodeSearch initialized with config:", config); }
        async search(query: string, directories: string[]): Promise<IndexerSearchResult[]> {
            console.log(`Mock search: ${query} in ${directories}`);
            // 返回模拟数据
            return [{ file: { path: 'mock/file.ts' }, range: { startPoint: { row: 10 } }, content: 'mock content', blugeScore: 0.9, name: 'mockFn', type: 'function' }];
        }
        async liveSearch(query: string, contextQuery: string, files: string[]): Promise<IndexerSearchResult[]> {
             console.log(`Mock liveSearch: ${query} in ${files}`);
             return [{ file: { path: 'mock/live.ts' }, range: { startPoint: { row: 5 } }, content: 'mock live content', blugeScore: 0.8, name: 'mockLiveFn', type: 'function' }];
        }
         async createIndex(directory: string, options: any): Promise<void> {
            console.log(`Mock createIndex for ${directory} with options:`, options);
            // 模拟创建索引
            return Promise.resolve();
         }
    }
    // 使用模拟类
    codeSearchInstance = new MockCodeSearch({
        index: {
            root: path.join(process.cwd(), '.index'), // 使用 .index 目录存储索引
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
    console.warn("Using Mock CodeSearch implementation as indexer-searcher is not properly imported/configured.");
  }
  return codeSearchInstance;
}

/**
 * 代码搜索工具
 * 提供语义搜索、关键词搜索和上下文分析能力
 */
export const codeSearchTool = createTool({
  id: 'codeSearch', // Use id instead of name
  description: '使用 indexer-searcher 进行代码搜索和分析，提供语义搜索、关键词搜索和上下文分析能力',
  inputSchema: CodeSearchInputSchema, // 使用 Zod Schema
  outputSchema: CodeSearchOutputSchema, // 使用 Zod Schema
  execute: async ({ context: inputContext }) => { // 从参数解构 context，重命名为 inputContext
    const { query, context: searchContext, options } = inputContext; // 从 inputContext 解构
    try {
      console.log(`执行代码搜索: ${query}`);

      // 设置默认选项 (Zod 应该已经处理了默认值)
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
      const directories = searchContext.directories && searchContext.directories.length > 0
        ? searchContext.directories
        // 如果没有指定目录，默认使用当前工作目录
        : [process.cwd()];

      // 确保有索引 (如果需要，这里调用创建索引)
      // 注意：频繁创建索引可能效率低下，真实场景需要更好的策略
      await ensureIndex(codeSearch, directories[0]);


      // 执行语义搜索
      if (searchOptions.semanticSearch) {
        const semanticRawResults = await codeSearch.search(query, directories);
        result.semanticResults = convertSearchResults(semanticRawResults, 'semantic', searchOptions.maxResults);
      }

      // 执行关键词搜索 (仅当提供了文件列表时)
      if (searchOptions.keywordSearch && searchContext.files && searchContext.files.length > 0) {
        // 注意: liveSearch 的参数可能需要调整以匹配实际的 indexer-searcher API
        const keywordRawResults = await codeSearch.liveSearch(query, query, searchContext.files);
        result.keywordResults = convertSearchResults(keywordRawResults, 'keyword', searchOptions.maxResults);
      } else if (searchOptions.keywordSearch) {
          console.warn("Keyword search requested but no files provided in context.");
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
      // 返回一个符合 OutputSchema 的错误结构可能更好，但这里先抛出
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
    // 假设 createIndex 是异步的，并且接受目录和选项
    await codeSearch.createIndex(directory, {
      retryIfLastAttemptFailed: true, // 示例选项
      ignoreExisting: true           // 示例选项: 如果存在则忽略
    });
    console.log(`Index ensured for directory: ${directory}`);
  } catch (error) {
    // 根据实际情况处理错误，可能只是警告，允许搜索继续
    console.warn(`创建或检查索引时出错 (可能已存在)，尝试继续搜索: ${error}`);
  }
}


/**
 * 转换搜索结果
 * 将 indexer-searcher 的搜索结果转换为工具的搜索结果
 */
function convertSearchResults(
  results: IndexerSearchResult[],
  type: 'semantic' | 'keyword',
  maxResults: number = 10 // 添加最大结果数限制
): SearchResult[] {
    if (!Array.isArray(results)) {
        console.warn("convertSearchResults received non-array input:", results);
        return [];
    }
  return results.map(result => ({
    // 确保访问的属性存在且类型正确
    file: result?.file?.path || 'unknown/file',
    line: result?.range?.startPoint?.row !== undefined ? result.range.startPoint.row + 1 : 0, // 行号从1开始
    content: result?.content || `${result?.name || 'unknown'} (${result?.type || 'unknown'})`,
    score: result?.blugeScore, // 使用可选链和默认值
    type
  })).slice(0, maxResults); // 限制结果数量
}

/**
 * 分析上下文
 * 分析搜索结果，提取相关文件、依赖关系和设计模式
 */
async function analyzeContext(
  searchResults: SearchResult[]
): Promise<ContextAnalysisResult> {
  // 提取相关文件
  const relatedFiles = Array.from(new Set(searchResults.map(result => result.file).filter(Boolean))); // Filter out undefined/null

  // 简单分析提取依赖关系和设计模式
  const dependencies: string[] = [];
  const patterns: string[] = [];

  // 分析代码内容寻找依赖和模式
  for (const result of searchResults) {
    const content = result.content;
    if (!content) continue; // Skip if content is missing

    // 简单示例：提取 import 语句中的依赖
    if (content.includes('import ')) {
      // 更健壮的正则，处理各种导入情况
      const importMatches = content.matchAll(/import(?:["'\s]*(?:[\w*{}\s,]+)from\s*)?["'\s]([@\w\-/.]+)["'\s].*$/gm);
      for (const match of importMatches) {
          if (match[1]) {
              dependencies.push(match[1]);
          }
      }
    }
     // 简单示例：提取 require 语句中的依赖
     if (content.includes('require(')) {
       const requireMatches = content.matchAll(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
       for (const match of requireMatches) {
           if(match[1]){
               dependencies.push(match[1]);
           }
       }
     }


    // 简单示例：检测设计模式关键词
    const patternKeywords = [
      { pattern: 'Factory', keywords: ['createFactory', 'Factory', 'getInstance'] },
      { pattern: 'Singleton', keywords: ['getInstance', 'instance', 'private constructor'] },
      { pattern: 'Observer', keywords: ['addEventListener', 'observer', 'subscribe', 'notify'] },
      { pattern: 'Strategy', keywords: ['strategy', 'algorithm', 'behavior'] }
      // 可以添加更多模式检测
    ];

    for (const { pattern, keywords } of patternKeywords) {
      for (const keyword of keywords) {
        // 检查是否包含关键词，且模式尚未添加
        if (content.includes(keyword) && !patterns.includes(pattern)) {
          patterns.push(pattern);
          break; // 找到一个关键词就跳出内层循环
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