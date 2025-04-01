/**
 * 代码分析工具实现
 * 提供代码理解、问题识别和建议生成能力
 */

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import {
  CodeAnalysisParams,
  CodeAnalysisResult,
  CodeIssue,
  CodeSuggestion,
  CodeMetrics,
  CodeUnderstanding
} from './types';
import { SearchResult } from '../codeSearch/types';

// --- Zod Schemas ---

// 输入 Schema
const CodeAnalysisInputSchema = z.object({
  code: z.string().describe('要分析的代码内容'),
  context: z.object({
    files: z.array(z.string()).optional().describe('相关文件列表'),
    directories: z.array(z.string()).optional().describe('相关目录列表'),
    // 假设 CodeSearchResult 的 schema 定义在 codeSearch/types.ts 对应的 Zod 定义中
    // 这里暂时用 z.any()，理想情况下应导入并使用 CodeSearchOutputSchema
    searchResults: z.any().optional().describe('代码搜索结果'),
    metadata: z.any().optional().describe('其他元数据')
  }).optional().default({}).describe('分析上下文'),
});

// 输出 Schema
const CodeIssueSchema = z.object({
  type: z.enum(['error', 'warning', 'info']),
  message: z.string(),
  location: z.object({
    file: z.string().optional(),
    line: z.number().optional(),
    column: z.number().optional(),
  }).optional(),
  severity: z.number(), // 1-10
  category: z.string(),
  suggestion: z.string().optional(),
});

const CodeSuggestionSchema = z.object({
  type: z.enum(['improvement', 'refactor', 'best_practice', 'pattern']),
  message: z.string(),
  code: z.string().optional(),
  location: z.object({
    file: z.string().optional(),
    line: z.number().optional(),
    column: z.number().optional(),
  }).optional(),
  priority: z.number(), // 1-10
  reasoning: z.string(),
});

const CodeMetricsSchema = z.object({
  complexity: z.number(),
  maintainability: z.number(),
  testability: z.number(),
  security: z.number(),
  performance: z.number(),
});

const CodeUnderstandingSchema = z.object({
  purpose: z.string(),
  components: z.array(z.string()),
  patterns: z.array(z.string()),
  dependencies: z.array(z.string()),
  dataFlow: z.array(z.string()),
});

const CodeAnalysisOutputSchema = z.object({
  understanding: CodeUnderstandingSchema,
  issues: z.array(CodeIssueSchema),
  suggestions: z.array(CodeSuggestionSchema),
  metrics: CodeMetricsSchema,
});

/**
 * 代码分析工具
 * 分析代码并提供改进建议
 */
export const analysisTool = createTool({
  id: 'codeAnalysis',
  description: '分析代码并提供改进建议，包括代码理解、问题识别和建议生成',
  inputSchema: CodeAnalysisInputSchema,
  outputSchema: CodeAnalysisOutputSchema,
  execute: async ({ context: inputContext }) => {
    const { code, context = {} } = inputContext; // 从 inputContext 解构
    try {
      console.log('执行代码分析');

      // 提取代码语言
      const language = detectLanguage(code);

      // 代码理解
      const understanding = await analyzeCodeUnderstanding(code, language, context);

      // 问题识别
      const issues = await identifyIssues(code, language, context);

      // 建议生成
      const suggestions = await generateSuggestions(code, language, issues, context);

      // 指标计算
      const metrics = await calculateMetrics(code, language, issues, context);

      return {
        understanding,
        issues,
        suggestions,
        metrics
      };
    } catch (error: any) {
      console.error('代码分析出错:', error);
      throw new Error(`代码分析失败: ${error.message}`);
    }
  }
});

/**
 * 检测代码语言
 * 基于代码内容和上下文判断语言
 */
function detectLanguage(code: string): string {
  // JavaScript/TypeScript 特征
  if (code.includes('function') || code.includes('const') || code.includes('let') ||
    code.includes('var') || code.includes('import') || code.includes('export') ||
    code.includes('interface') || code.includes('class')) {

    // TypeScript 特有特征
    if (code.includes('interface') || code.includes(':') || code.includes('<T>') ||
      code.includes('type ') || code.includes('enum')) {
      return 'typescript';
    }

    return 'javascript';
  }

  // Python 特征
  if (code.includes('def ') || code.includes('import ') || code.includes('class ') ||
    code.includes('if __name__ == "__main__"') || code.includes('print(')) {
    return 'python';
  }

  // Java 特征
  if (code.includes('public class') || code.includes('private') || code.includes('protected') ||
    code.includes('extends') || code.includes('implements') || code.includes('void')) {
    return 'java';
  }

  // 默认返回 JavaScript
  return 'javascript';
}

/**
 * 分析代码理解
 * 理解代码的目的、结构和模式
 */
async function analyzeCodeUnderstanding(
  code: string,
  language: string,
  context: CodeAnalysisParams['context']
): Promise<CodeUnderstanding> {
  // 分析代码结构
  const codeLines = code.split('\n');
  const importLines = codeLines.filter(line =>
    line.trim().startsWith('import') ||
    line.trim().startsWith('require') ||
    line.trim().includes('from') && line.trim().includes('import')
  );

  // 提取函数和类
  const functionMatches = code.match(/function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)/g) || [];
  const classMatches = code.match(/class\s+([a-zA-Z0-9_]+)/g) || [];
  const arrowFunctions = code.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*(\([^)]*\)|[a-zA-Z0-9_]+)\s*=>/g) || [];

  // 提取组件和依赖
  const components = [...functionMatches, ...classMatches, ...arrowFunctions]
    .map(match => {
      const name = match.match(/[a-zA-Z0-9_]+/g);
      return name ? name[1] || name[0] : '';
    })
    .filter(Boolean);

  // 提取依赖关系
  const dependencies = importLines.map(line => {
    const match = line.match(/from\s+['"]([^'"]+)['"]/);
    if (match) return match[1];

    const requireMatch = line.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
    if (requireMatch) return requireMatch[1];

    const importMatch = line.match(/import\s+.*from\s+['"]([^'"]+)['"]/);
    if (importMatch) return importMatch[1];

    return '';
  }).filter(Boolean);

  // 分析数据流
  const dataFlow = [];

  // 如果有搜索结果，尝试利用它们增强分析
  if (context.searchResults) {
    const searchResults = context.searchResults as any;
    if (searchResults.contextAnalysis && searchResults.contextAnalysis.patterns) {
      const patterns = searchResults.contextAnalysis.patterns;

      // 将搜索结果的模式合并到我们的分析中
      if (patterns && patterns.length > 0) {
        // 处理具体逻辑...
      }
    }
  }

  // 根据代码模式分析目的
  let purpose = '';
  if (code.includes('fetch') || code.includes('axios') || code.includes('http')) {
    purpose = "这段代码处理网络请求和数据获取";
  } else if (functionMatches.some(fn => fn.includes('render') || fn.includes('component'))) {
    purpose = "这段代码实现了用户界面组件";
  } else if (code.includes('process') || code.includes('transform') || code.includes('convert')) {
    purpose = "这段代码负责数据处理和转换";
  } else if (code.includes('validate') || code.includes('check') || code.includes('verify')) {
    purpose = "这段代码进行数据验证和校验";
  } else {
    purpose = "这段代码实现了业务逻辑功能";
  }

  // 识别设计模式
  const patterns = [];
  if (code.includes('getInstance') || (code.includes('instance') && code.includes('private constructor'))) {
    patterns.push('Singleton Pattern');
  }
  if (code.includes('Factory') || code.includes('create') && functionMatches.some(fn => fn.includes('create'))) {
    patterns.push('Factory Pattern');
  }
  if (code.includes('subscribe') || code.includes('notify') || code.includes('observer')) {
    patterns.push('Observer Pattern');
  }
  if (code.includes('strategy') || (code.includes('context') && code.includes('setStrategy'))) {
    patterns.push('Strategy Pattern');
  }

  // 构建数据流
  if (importLines.length > 0) {
    dataFlow.push('导入依赖');
  }
  if (code.includes('input') || code.includes('data') && (code.includes('parameter') || code.includes('param'))) {
    dataFlow.push('接收输入');
  }
  if (code.includes('validate') || code.includes('check')) {
    dataFlow.push('验证数据');
  }
  if (code.includes('transform') || code.includes('convert') || code.includes('process')) {
    dataFlow.push('处理数据');
  }
  if (code.includes('return') || code.includes('resolve') || code.includes('result')) {
    dataFlow.push('返回结果');
  }

  return {
    purpose,
    components,
    patterns,
    dependencies,
    dataFlow
  };
}

/**
 * 识别代码问题
 * 发现潜在的错误、警告和改进机会
 */
async function identifyIssues(
  code: string,
  language: string,
  context: CodeAnalysisParams['context']
): Promise<CodeIssue[]> {
  const issues: CodeIssue[] = [];
  const codeLines = code.split('\n');

  // 检查错误处理
  if (!code.includes('try') &&
    (code.includes('fetch') || code.includes('async') || code.includes('Promise'))) {
    issues.push({
      type: 'warning',
      message: '未处理潜在的异常情况',
      location: {
        line: codeLines.findIndex(line =>
          line.includes('fetch') || line.includes('async') || line.includes('Promise')
        ) + 1
      },
      severity: 7,
      category: 'error-handling',
      suggestion: '添加 try-catch 块处理潜在异常'
    });
  }

  // 检查类型安全（针对JavaScript/TypeScript）
  if ((language === 'javascript' || language === 'typescript') &&
    code.includes('function') && !code.includes(': ') && !code.includes('=> ')) {

    const functionLines = codeLines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.includes('function') || line.includes('=>'));

    if (functionLines.length > 0) {
      issues.push({
        type: 'info',
        message: '函数参数缺少类型定义',
        location: { line: functionLines[0].index + 1 },
        severity: 4,
        category: 'type-safety',
        suggestion: '添加明确的类型定义增强代码可读性和可维护性'
      });
    }
  }

  // 检查变量命名
  const poorlyNamedVariables = codeLines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) =>
      (line.includes('var ') || line.includes('let ') || line.includes('const ')) &&
      /\b[a-z]{1,2}\b/.test(line) &&
      !line.includes('for') && !line.includes('=> {')
    );

  if (poorlyNamedVariables.length > 0) {
    issues.push({
      type: 'info',
      message: '使用了过短或不明确的变量名',
      location: { line: poorlyNamedVariables[0].index + 1 },
      severity: 3,
      category: 'naming-convention',
      suggestion: '使用更具描述性的变量名提高代码可读性'
    });
  }

  // 检查代码重复
  const duplicatedCodeBlocks = findDuplicatedCodeBlocks(codeLines);
  if (duplicatedCodeBlocks.length > 0) {
    issues.push({
      type: 'warning',
      message: '存在重复代码块，考虑提取为独立函数',
      location: { line: duplicatedCodeBlocks[0].startLine },
      severity: 5,
      category: 'code-duplication',
      suggestion: '将重复代码提取为可复用的函数'
    });
  }

  // 检查嵌套深度
  const deeplyNestedBlocks = findDeeplyNestedBlocks(code);
  if (deeplyNestedBlocks.length > 0) {
    issues.push({
      type: 'warning',
      message: '代码嵌套层级过深，增加复杂性',
      location: { line: deeplyNestedBlocks[0].line },
      severity: 6,
      category: 'complexity',
      suggestion: '考虑提取嵌套代码为单独函数，或使用提前返回减少嵌套'
    });
  }

  // 检查魔法数字
  const magicNumbers = findMagicNumbers(codeLines);
  if (magicNumbers.length > 0) {
    issues.push({
      type: 'info',
      message: '使用了魔法数字',
      location: { line: magicNumbers[0].line },
      severity: 3,
      category: 'best-practice',
      suggestion: '将魔法数字提取为命名常量'
    });
  }

  return issues;
}

/**
 * 查找代码中的重复块
 */
function findDuplicatedCodeBlocks(codeLines: string[]): Array<{ startLine: number, endLine: number }> {
  const duplicates: Array<{ startLine: number, endLine: number }> = [];
  const blockSize = 3; // 至少3行代码才视为值得提取的块

  for (let i = 0; i < codeLines.length - blockSize; i++) {
    for (let j = i + blockSize; j < codeLines.length - blockSize + 1; j++) {
      let isDuplicate = true;

      for (let k = 0; k < blockSize; k++) {
        if (codeLines[i + k].trim() !== codeLines[j + k].trim()) {
          isDuplicate = false;
          break;
        }
      }

      if (isDuplicate) {
        duplicates.push({ startLine: i + 1, endLine: i + blockSize });
        break; // 只记录一次
      }
    }
  }

  return duplicates;
}

/**
 * 查找深度嵌套的代码块
 */
function findDeeplyNestedBlocks(code: string): Array<{ line: number, depth: number }> {
  const results: Array<{ line: number, depth: number }> = [];
  const lines = code.split('\n');
  let currentDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 计算括号，增加或减少深度
    const openBrackets = (line.match(/{/g) || []).length;
    const closeBrackets = (line.match(/}/g) || []).length;

    currentDepth += openBrackets - closeBrackets;

    // 如果深度超过3，视为嵌套过深
    if (currentDepth > 3 && openBrackets > 0) {
      results.push({ line: i + 1, depth: currentDepth });
    }
  }

  return results;
}

/**
 * 查找代码中的魔法数字
 */
function findMagicNumbers(codeLines: string[]): Array<{ line: number, number: string }> {
  const results: Array<{ line: number, number: string }> = [];
  const exceptions = ['0', '1', '2', '-1']; // 常见的例外，不视为魔法数字

  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i];
    const matches = line.match(/\b\d+\b/g);

    if (matches) {
      for (const match of matches) {
        if (!exceptions.includes(match) && !line.includes('const') && !line.includes('=')) {
          results.push({ line: i + 1, number: match });
          break; // 每行只记录一次
        }
      }
    }
  }

  return results;
}

/**
 * 生成代码建议
 * 基于问题分析生成改进建议
 */
async function generateSuggestions(
  code: string,
  language: string,
  issues: CodeIssue[],
  context: CodeAnalysisParams['context']
): Promise<CodeSuggestion[]> {
  const suggestions: CodeSuggestion[] = [];

  // 根据问题类型生成相应建议
  for (const issue of issues) {
    if (issue.category === 'error-handling') {
      suggestions.push({
        type: 'improvement',
        message: '优化错误处理逻辑',
        code: generateErrorHandlingExample(code, language, issue),
        location: issue.location,
        priority: 8,
        reasoning: '当前代码没有错误处理机制，可能导致程序崩溃'
      });
    }

    if (issue.category === 'type-safety') {
      suggestions.push({
        type: 'best_practice',
        message: '使用类型注解提高代码可读性',
        code: generateTypeAnnotationExample(code, language, issue),
        location: issue.location,
        priority: 5,
        reasoning: '添加类型注解可以提高代码可读性和可维护性'
      });
    }

    if (issue.category === 'naming-convention') {
      suggestions.push({
        type: 'improvement',
        message: '使用更具描述性的变量名',
        code: '// 示例\nconst userData = fetchUserData();  // 而不是 const d = fetchData();',
        location: issue.location,
        priority: 4,
        reasoning: '有意义的变量名能够提高代码的自解释性和可维护性'
      });
    }

    if (issue.category === 'code-duplication') {
      suggestions.push({
        type: 'refactor',
        message: '提取重复代码为可复用函数',
        code: generateExtractFunctionExample(code, language, issue),
        location: issue.location,
        priority: 6,
        reasoning: '重复代码导致维护困难，提取为函数可以提高复用性和可维护性'
      });
    }

    if (issue.category === 'complexity') {
      suggestions.push({
        type: 'refactor',
        message: '简化嵌套逻辑',
        code: generateSimplifyLogicExample(code, language, issue),
        location: issue.location,
        priority: 7,
        reasoning: '过深的嵌套导致代码难以理解和维护，可以通过提前返回或提取函数简化'
      });
    }

    if (issue.category === 'best-practice') {
      suggestions.push({
        type: 'best_practice',
        message: '提取魔法数字为命名常量',
        code: generateConstantsExample(code, language, issue),
        location: issue.location,
        priority: 4,
        reasoning: '魔法数字缺乏上下文，使用命名常量能提高可读性和可维护性'
      });
    }
  }

  // 添加通用最佳实践建议
  if (language === 'javascript' || language === 'typescript') {
    suggestions.push({
      type: 'best_practice',
      message: '使用解构赋值简化代码',
      code: '// 示例\nconst { name, age } = user;  // 而不是 const name = user.name; const age = user.age;',
      priority: 3,
      reasoning: '解构赋值能够简化代码并提高可读性'
    });
  }

  return suggestions;
}

/**
 * 生成错误处理示例
 */
function generateErrorHandlingExample(code: string, language: string, issue: CodeIssue): string {
  if (language === 'javascript' || language === 'typescript') {
    return `try {
  // 原有代码
  const response = await fetch('/api/data');
  const data = await response.json();
} catch (error) {
  console.error('获取数据失败:', error);
  // 错误处理逻辑
}`;
  } else if (language === 'python') {
    return `try:
    # 原有代码
    response = requests.get('/api/data')
    data = response.json()
except Exception as e:
    print(f"获取数据失败: {e}")
    # 错误处理逻辑`;
  }

  return '// 添加适当的错误处理';
}

/**
 * 生成类型注解示例
 */
function generateTypeAnnotationExample(code: string, language: string, issue: CodeIssue): string {
  if (language === 'typescript') {
    return `// 示例
interface InputData {
  id: number;
  name: string;
}

interface OutputData {
  processed: boolean;
  data: InputData;
}

function processData(data: InputData): OutputData {
  // 处理逻辑
  return { processed: true, data };
}`;
  } else if (language === 'javascript') {
    return `// 示例 (JSDoc)
/**
 * @param {Object} data - 输入数据
 * @param {number} data.id - 数据ID
 * @param {string} data.name - 数据名称
 * @returns {Object} 处理后的数据
 */
function processData(data) {
  // 处理逻辑
  return { processed: true, data };
}`;
  }

  return '// 添加适当的类型注解';
}

/**
 * 生成提取函数示例
 */
function generateExtractFunctionExample(code: string, language: string, issue: CodeIssue): string {
  if (language === 'javascript' || language === 'typescript') {
    return `// 提取重复代码为函数
function processItem(item) {
  // 重复的处理逻辑
  const processed = transform(item);
  return processed;
}

function processData(data) {
  let result = [];
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.status === 'active') {
      const processed = processItem(item);
      result.push(processed);
    }
  }
  
  return result;
}`;
  }

  return '// 提取重复代码为独立函数';
}

/**
 * 生成简化逻辑示例
 */
function generateSimplifyLogicExample(code: string, language: string, issue: CodeIssue): string {
  if (language === 'javascript' || language === 'typescript') {
    return `// 简化前 - 嵌套逻辑
function processData(data) {
  if (data) {
    if (data.isValid) {
      if (data.items.length > 0) {
        // 处理逻辑
      }
    }
  }
}

// 简化后 - 提前返回
function processData(data) {
  if (!data) return;
  if (!data.isValid) return;
  if (data.items.length === 0) return;
  
  // 处理逻辑
}`;
  }

  return '// 使用提前返回或提取函数简化嵌套逻辑';
}

/**
 * 生成常量提取示例
 */
function generateConstantsExample(code: string, language: string, issue: CodeIssue): string {
  if (language === 'javascript' || language === 'typescript') {
    return `// 不好的做法
if (status === 1) {
  // 处理激活状态
} else if (status === 2) {
  // 处理暂停状态
} else if (status === 3) {
  // 处理结束状态
}

// 好的做法
const STATUS = {
  ACTIVE: 1,
  PAUSED: 2,
  COMPLETED: 3
};

if (status === STATUS.ACTIVE) {
  // 处理激活状态
} else if (status === STATUS.PAUSED) {
  // 处理暂停状态
} else if (status === STATUS.COMPLETED) {
  // 处理结束状态
}`;
  }

  return '// 将魔法数字提取为命名常量';
}

/**
 * 计算代码指标
 * 评估代码质量的各种指标
 */
async function calculateMetrics(
  code: string,
  language: string,
  issues: CodeIssue[],
  context: CodeAnalysisParams['context']
): Promise<CodeMetrics> {
  // 计算代码行数和空行数
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim() !== '').length;

  // 计算复杂度 (简化版的圈复杂度)
  let complexity = 1;
  complexity += (code.match(/if|else|for|while|switch|case|catch|&&|\|\|/g) || []).length;
  complexity = Math.min(10, complexity); // 限制最大值为10

  // 根据问题严重性计算可维护性
  const avgIssueSeverity = issues.length > 0
    ? issues.reduce((sum, issue) => sum + issue.severity, 0) / issues.length
    : 0;

  const maintainability = Math.max(1, 10 - (avgIssueSeverity / 2));

  // 计算可测试性 (基于函数大小和复杂度)
  const functionMatches = code.match(/function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*{/g) || [];
  const avgFunctionLines = functionMatches.length > 0
    ? nonEmptyLines / functionMatches.length
    : nonEmptyLines;

  const testability = Math.max(1, 10 - (avgFunctionLines / 15) - (complexity / 3));

  // 安全性 (基于错误处理和输入验证)
  const hasTryCatch = code.includes('try') && code.includes('catch');
  const hasInputValidation = code.includes('validate') || code.includes('check') ||
    (code.includes('if') && code.includes('typeof'));

  const security = hasTryCatch && hasInputValidation ? 8 : (hasTryCatch || hasInputValidation ? 6 : 4);

  // 性能 (简化评估)
  let performance = 7;
  if (code.includes('for') && !code.includes('forEach')) performance -= 1;
  if (code.includes('while')) performance -= 1;
  if (code.includes('recursion') || code.includes('recursive')) performance -= 1;

  return {
    complexity,
    maintainability,
    testability,
    security,
    performance
  };
} 