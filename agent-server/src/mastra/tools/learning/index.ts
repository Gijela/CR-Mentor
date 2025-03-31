/**
 * 学习工具
 * 用于分析开发者编码模式和提供个性化学习建议
 */

import { Tool } from '@mastra/core/tool';
import { storageTool } from '../storage';
import { LearningParams, LearningResult, PatternAnalysisResult, ImprovementSuggestion } from './types';
import { DeveloperInfo, LearningRecord } from '../storage/types';

/**
 * 学习工具
 * 分析开发者的编码模式并提供个性化学习建议
 */
export const learningTool = new Tool({
  name: 'learning',
  description: '分析开发者编码模式并提供个性化学习建议',
  parameters: {
    type: 'object',
    properties: {
      developerId: {
        type: 'string',
        description: '开发者ID'
      },
      code: {
        type: 'string',
        description: '要分析的代码'
      },
      language: {
        type: 'string',
        description: '编程语言'
      },
      action: {
        type: 'string',
        description: '学习工具要执行的操作',
        enum: ['analyzePatterns', 'getDeveloperProfile', 'suggestImprovements', 'updateDeveloperProfile']
      },
      profile: {
        type: 'object',
        description: '要更新的开发者资料'
      }
    },
    required: ['action', 'developerId']
  },
  handler: async ({ action, developerId, code, language, profile }: LearningParams): Promise<LearningResult> => {
    try {
      // 获取开发者信息
      let developerInfo: DeveloperInfo | null = null;
      const developerResult = await storageTool.handler({
        action: 'load',
        type: 'developer',
        id: developerId
      });

      if (developerResult.success && developerResult.data) {
        developerInfo = developerResult.data as DeveloperInfo;
      }

      // 如果找不到开发者且不是要创建资料，则返回错误
      if (!developerInfo && action !== 'updateDeveloperProfile') {
        return {
          success: false,
          action,
          developerId,
          message: `找不到开发者信息 (ID: ${developerId})`
        };
      }

      // 根据动作执行对应操作
      switch (action) {
        case 'analyzePatterns':
          if (!code || !language) {
            return {
              success: false,
              action,
              developerId,
              message: '分析模式需要提供代码和语言'
            };
          }
          return await analyzePatterns(developerId, code, language, developerInfo);

        case 'getDeveloperProfile':
          return {
            success: true,
            action,
            developerId,
            developerProfile: developerInfo || undefined,
            message: developerInfo ? '成功获取开发者资料' : '找不到开发者资料'
          };

        case 'suggestImprovements':
          if (!developerInfo) {
            return {
              success: false,
              action,
              developerId,
              message: '无法提供改进建议：找不到开发者资料'
            };
          }
          return await suggestImprovements(developerInfo);

        case 'updateDeveloperProfile':
          if (!profile) {
            return {
              success: false,
              action,
              developerId,
              message: '更新开发者资料需要提供profile参数'
            };
          }
          return await updateDeveloperProfile(developerId, profile, developerInfo);

        default:
          return {
            success: false,
            action,
            developerId,
            message: `不支持的操作: ${action}`
          };
      }
    } catch (error: any) {
      console.error('学习工具错误:', error);
      return {
        success: false,
        action,
        developerId,
        message: `学习工具操作失败: ${error.message}`
      };
    }
  }
});

/**
 * 分析代码模式
 */
async function analyzePatterns(
  developerId: string,
  code: string,
  language: string,
  developerInfo: DeveloperInfo | null
): Promise<LearningResult> {
  // 分析代码中的模式
  const patterns = await detectPatterns(code, language);

  // 保存学习记录
  const learningRecord: LearningRecord = {
    developerId,
    patterns: patterns.detectedPatterns,
    improvements: []
  };

  // 存储学习记录
  await storageTool.handler({
    action: 'save',
    type: 'learning',
    data: learningRecord
  });

  return {
    success: true,
    action: 'analyzePatterns',
    developerId,
    patternAnalysis: patterns,
    message: '代码模式分析完成'
  };
}

/**
 * 检测代码中的模式
 */
async function detectPatterns(code: string, language: string): Promise<PatternAnalysisResult> {
  // 模拟模式分析逻辑
  const lines = code.split('\n');
  const detectedPatterns = [];

  // 检测模式 - 实际实现中应根据语言进行更精确的分析

  // 1. 检查函数命名约定
  const functionRegex = language === 'javascript' || language === 'typescript'
    ? /function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\(\s*.*?\)\s*=>/g
    : language === 'python'
      ? /def\s+([a-zA-Z0-9_]+)/g
      : /[a-zA-Z0-9_]+/g;

  let match;
  const functionNames = [];
  const functionNameRegex = new RegExp(functionRegex);
  let codeStr = code.toString();

  while ((match = functionNameRegex.exec(codeStr)) !== null) {
    functionNames.push(match[1] || match[2]);
  }

  const camelCaseCount = functionNames.filter(name => /^[a-z][a-zA-Z0-9]*$/.test(name)).length;
  const snakeCaseCount = functionNames.filter(name => /^[a-z][a-z0-9_]*$/.test(name)).length;

  if (functionNames.length > 0) {
    if (camelCaseCount > snakeCaseCount) {
      detectedPatterns.push({
        pattern: '驼峰命名法',
        occurrences: camelCaseCount,
        examples: functionNames.filter(name => /^[a-z][a-zA-Z0-9]*$/.test(name)).slice(0, 3)
      });
    } else if (snakeCaseCount > camelCaseCount) {
      detectedPatterns.push({
        pattern: '蛇形命名法',
        occurrences: snakeCaseCount,
        examples: functionNames.filter(name => /^[a-z][a-z0-9_]*$/.test(name)).slice(0, 3)
      });
    }
  }

  // 2. 检查代码复杂度
  const complexityPattern = {
    pattern: '代码复杂度',
    occurrences: 0,
    examples: []
  };

  // 嵌套级别
  let maxNestingLevel = 0;
  let currentNestingLevel = 0;
  let complexExamples: string[] = [];

  for (const line of lines) {
    if (line.includes('{') || line.includes('if') || line.includes('for') || line.includes('while')) {
      currentNestingLevel++;
      if (currentNestingLevel > maxNestingLevel) {
        maxNestingLevel = currentNestingLevel;
        complexExamples.push(line.trim());
      }
    }

    if (line.includes('}')) {
      currentNestingLevel = Math.max(0, currentNestingLevel - 1);
    }
  }

  complexityPattern.occurrences = maxNestingLevel;
  complexityPattern.examples = complexExamples.slice(0, 3);

  if (maxNestingLevel > 2) {
    detectedPatterns.push(complexityPattern);
  }

  // 3. 检查注释密度
  const commentLines = lines.filter(line =>
    line.trim().startsWith('//') ||
    line.trim().startsWith('#') ||
    line.trim().startsWith('/*') ||
    line.trim().startsWith('*')
  ).length;

  const commentRatio = commentLines / lines.length;

  if (commentRatio < 0.1) {
    detectedPatterns.push({
      pattern: '注释稀少',
      occurrences: commentLines,
      examples: [`注释率: ${(commentRatio * 100).toFixed(1)}%`]
    });
  } else if (commentRatio > 0.3) {
    detectedPatterns.push({
      pattern: '注释丰富',
      occurrences: commentLines,
      examples: [`注释率: ${(commentRatio * 100).toFixed(1)}%`]
    });
  }

  return {
    detectedPatterns,
    language
  };
}

/**
 * 提供改进建议
 */
async function suggestImprovements(developerInfo: DeveloperInfo): Promise<LearningResult> {
  // 获取开发者的学习记录
  const learningResult = await storageTool.handler({
    action: 'load',
    type: 'learning'
  });

  let learningRecords: LearningRecord[] = [];

  if (learningResult.success && learningResult.data) {
    learningRecords = (learningResult.data as LearningRecord[])
      .filter(record => record.developerId === developerInfo.id);
  }

  // 根据开发者信息和学习记录生成改进建议
  const suggestions: ImprovementSuggestion[] = [];

  // 分析模式和行为
  if (learningRecords.length > 0) {
    // 生成建议逻辑
    // 1. 基于命名规范
    const patternCounts: Record<string, number> = {};

    learningRecords.forEach(record => {
      record.patterns.forEach(pattern => {
        patternCounts[pattern.pattern] = (patternCounts[pattern.pattern] || 0) + 1;
      });
    });

    // 发现最常见的模式
    const commonPatterns = Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([pattern]) => pattern);

    if (commonPatterns.includes('代码复杂度') && commonPatterns.indexOf('代码复杂度') < 3) {
      suggestions.push({
        area: '代码复杂度',
        confidence: 'high',
        description: '您的代码倾向于有较高的复杂度。考虑分解复杂函数，减少嵌套层级。',
        resources: [
          '《Clean Code》 by Robert C. Martin',
          'https://refactoring.guru/refactoring/techniques/simplifying-conditional-expressions'
        ]
      });
    }

    if (commonPatterns.includes('注释稀少')) {
      suggestions.push({
        area: '代码文档',
        confidence: 'medium',
        description: '增加适当的注释可以提高代码可读性和可维护性。',
        resources: [
          'https://jsdoc.app/',
          'https://www.python.org/dev/peps/pep-0257/'
        ]
      });
    }
  }

  // 根据开发者专长提供建议
  if (developerInfo.areasToImprove && developerInfo.areasToImprove.length > 0) {
    developerInfo.areasToImprove.forEach(area => {
      switch (area.toLowerCase()) {
        case 'testing':
          suggestions.push({
            area: '测试',
            confidence: 'high',
            description: '提高测试覆盖率可以减少bug并提高代码质量。',
            resources: [
              'https://jestjs.io/',
              'https://docs.pytest.org/'
            ]
          });
          break;
        case 'performance':
          suggestions.push({
            area: '性能优化',
            confidence: 'medium',
            description: '关注算法复杂度和内存使用可以提高应用性能。',
            resources: [
              'https://web.dev/performance-optimizing-content-efficiency/',
              'https://github.com/goldbergyoni/nodebestpractices#5-going-to-production-practices'
            ]
          });
          break;
      }
    });
  }

  // 如果没有足够的数据，提供一般性建议
  if (suggestions.length === 0) {
    suggestions.push({
      area: '通用编程实践',
      confidence: 'low',
      description: '持续学习编程最佳实践和设计模式将帮助提升整体代码质量。',
      resources: [
        '《设计模式》 by Gang of Four',
        'https://refactoring.guru/design-patterns'
      ]
    });
  }

  // 更新学习记录中的改进建议
  if (learningRecords.length > 0) {
    const latestRecord = learningRecords[learningRecords.length - 1];
    latestRecord.improvements = suggestions.map(s => ({
      area: s.area,
      description: s.description,
      resources: s.resources
    }));

    // 保存更新后的学习记录
    await storageTool.handler({
      action: 'save',
      type: 'learning',
      id: latestRecord._meta?.id,
      data: latestRecord
    });
  }

  return {
    success: true,
    action: 'suggestImprovements',
    developerId: developerInfo.id,
    suggestions,
    message: '已生成改进建议'
  };
}

/**
 * 更新开发者资料
 */
async function updateDeveloperProfile(
  developerId: string,
  profile: Record<string, any>,
  existingProfile: DeveloperInfo | null
): Promise<LearningResult> {
  let developerProfile: DeveloperInfo;

  if (existingProfile) {
    // 更新现有资料
    developerProfile = {
      ...existingProfile,
      ...profile,
      id: developerId
    };
  } else {
    // 创建新资料
    developerProfile = {
      id: developerId,
      name: profile.name || `开发者${developerId}`,
      languages: profile.languages || [],
      strengths: profile.strengths || [],
      areasToImprove: profile.areasToImprove || [],
      ...profile
    };
  }

  // 保存开发者资料
  const saveResult = await storageTool.handler({
    action: 'save',
    type: 'developer',
    id: developerId,
    data: developerProfile
  });

  if (saveResult.success) {
    return {
      success: true,
      action: 'updateDeveloperProfile',
      developerId,
      developerProfile,
      message: existingProfile ? '开发者资料已更新' : '开发者资料已创建'
    };
  } else {
    return {
      success: false,
      action: 'updateDeveloperProfile',
      developerId,
      message: `更新开发者资料失败: ${saveResult.message}`
    };
  }
} 