import type { IssueItem, StrengthItem } from './components/DataTable';

// API响应类型定义
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 技能雷达图数据类型
export interface SkillRadarData {
  categories: string[];
  values: number[];
  maxValue: number;
}

// 技能趋势数据类型
export interface SkillTrendData {
  date: string;
  value: number;
  category?: string;
}

// 技能网络节点类型
export interface SkillNode {
  id: string;
  name: string;
  category: string;
  value: number;
}

// 技能网络链接类型
export interface SkillLink {
  source: string;
  target: string;
  strength: number;
}

// 技能网络数据类型
export interface SkillNetworkData {
  nodes: SkillNode[];
  links: SkillLink[];
}

// 知识片段类型
export interface KnowledgeSnippet {
  id: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  source?: string;
  created_at: string;
  updated_at?: string;
  vector_id?: string;
  similarity_score?: number;
}

// 知识库元数据类型
export interface KnowledgeMetadata {
  categories: string[];
  tags: string[];
}

// 知识主题分布数据类型
export interface TopicDistributionItem {
  topic: string;
  count: number;
  percentage: number;
}

/**
 * 通用API请求函数
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // 合并默认请求头
    const requestOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // 发送请求
    const response = await fetch(`${import.meta.env.VITE_SERVER_HOST}${endpoint}`, requestOptions);

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API错误(${response.status}): ${errorText}`);
    }

    // 解析响应数据
    const responseData: ApiResponse<T> = await response.json();

    // 检查业务层面的成功状态
    if (!responseData.success) {
      throw new Error(responseData.message || '请求失败');
    }

    return responseData;
  } catch (error) {
    console.error(`API请求失败: ${endpoint}`, error);

    // 尝试使用模拟数据
    try {
      // 这里我们直接引用模拟数据，而不是动态导入
      // 这样可以避免找不到模块的问题
      let mockData: T;

      if (endpoint.includes('/profile/issues')) {
        mockData = require('./mock/issues.json') as T;
      } else if (endpoint.includes('/profile/strengths')) {
        mockData = require('./mock/strengths.json') as T;
      } else if (endpoint.includes('/skill-radar')) {
        mockData = require('./mock/skill-radar.json') as T;
      } else if (endpoint.includes('/skill-trends')) {
        mockData = require('./mock/skill-trends.json') as T;
      } else if (endpoint.includes('/skill-network')) {
        mockData = require('./mock/skill-network.json') as T;
      } else if (endpoint.includes('/knowledge-base/metadata')) {
        // 为知识库元数据提供模拟数据
        mockData = {
          categories: ['React', 'TypeScript', '组件设计', '状态管理', '性能优化'],
          tags: ['hooks', '类型安全', '最佳实践', '性能优化', '架构', 'UI设计']
        } as T;
      } else if (endpoint.includes('/knowledge-base/search')) {
        // 为知识库搜索提供模拟数据
        mockData = [
          {
            id: "ks1",
            content: "在React组件中，状态管理最佳实践包括：1) 使用局部状态管理简单UI状态；2) 使用Context API管理中等复杂度的应用状态；3) 对于复杂应用考虑使用Redux或MobX；4) 使用React Query或SWR处理服务器状态。避免过度使用全局状态，这会导致性能问题和难以维护的代码。",
            summary: "React状态管理最佳实践",
            category: "React",
            tags: ["状态管理", "性能优化", "架构"],
            created_at: new Date().toISOString(),
            similarity_score: 0.92
          },
          {
            id: "ks2",
            content: "TypeScript中的泛型允许创建可重用的组件，支持多种数据类型。泛型的主要优势是在保持类型安全的同时提供灵活性。常见用例包括：1) 创建通用数据结构如数组、映射；2) 编写通用函数；3) 约束泛型参数；4) 在React组件中使用泛型提高组件的重用性。",
            summary: "TypeScript泛型使用指南",
            category: "TypeScript",
            tags: ["泛型", "类型安全", "高级类型"],
            created_at: new Date().toISOString(),
            similarity_score: 0.85
          },
          {
            id: "ks3",
            content: "构建高性能React组件的关键策略：1) 使用React.memo避免不必要的重新渲染；2) 使用useCallback和useMemo缓存函数和计算值；3) 实现虚拟滚动处理大型列表；4) 懒加载组件和代码分割；5) 使用Web Workers处理CPU密集型任务；6) 优化Context使用，避免过度触发重新渲染。",
            summary: "React性能优化技巧",
            category: "React",
            tags: ["性能优化", "渲染优化", "最佳实践"],
            created_at: new Date().toISOString(),
            similarity_score: 0.78
          }
        ] as T;
      } else if (endpoint.includes('/knowledge-base/snippets')) {
        // 为知识库片段列表提供模拟数据
        mockData = [
          {
            id: "ks1",
            content: "在React组件中，状态管理最佳实践包括：1) 使用局部状态管理简单UI状态；2) 使用Context API管理中等复杂度的应用状态；3) 对于复杂应用考虑使用Redux或MobX；4) 使用React Query或SWR处理服务器状态。避免过度使用全局状态，这会导致性能问题和难以维护的代码。",
            summary: "React状态管理最佳实践",
            category: "React",
            tags: ["状态管理", "性能优化", "架构"],
            created_at: new Date().toISOString()
          },
          {
            id: "ks2",
            content: "TypeScript中的泛型允许创建可重用的组件，支持多种数据类型。泛型的主要优势是在保持类型安全的同时提供灵活性。常见用例包括：1) 创建通用数据结构如数组、映射；2) 编写通用函数；3) 约束泛型参数；4) 在React组件中使用泛型提高组件的重用性。",
            summary: "TypeScript泛型使用指南",
            category: "TypeScript",
            tags: ["泛型", "类型安全", "高级类型"],
            created_at: new Date().toISOString()
          }
        ] as T;
      } else {
        throw new Error('没有对应的模拟数据');
      }

      console.info(`使用模拟数据: ${endpoint}`);
      return { success: true, data: mockData };
    } catch (mockError) {
      console.warn('获取模拟数据失败', mockError);
      throw error; // 抛出原始错误
    }
  }
}

/**
 * Dashboard API服务
 */
export const dashboardService = {
  /**
   * 获取KPI摘要数据
   */
  getKpiSummary: (developerId: string) =>
    apiRequest<any>('/developers/dashboard/kpi-summary', {
      method: 'POST',
      body: JSON.stringify({ developer_id: developerId })
    }),

  /**
   * 获取洞察趋势数据
   */
  getInsightTrends: (developerId: string, timeRange: string = '6m') =>
    apiRequest<any>('/developers/dashboard/insight-trends', {
      method: 'POST',
      body: JSON.stringify({
        developer_id: developerId,
        time_range: timeRange
      })
    }),

  /**
   * 获取开发者优势列表
   */
  getStrengths: (developerId: string) =>
    apiRequest<StrengthItem[]>('/developers/profile/strengths', {
      method: 'POST',
      body: JSON.stringify({ developer_id: developerId })
    }),

  /**
   * 获取开发者问题列表
   */
  getIssues: (developerId: string) =>
    apiRequest<IssueItem[]>('/developers/profile/issues', {
      method: 'POST',
      body: JSON.stringify({ developer_id: developerId })
    }),

  /**
   * 获取技能雷达图数据
   */
  getSkillRadar: (developerId: string) =>
    apiRequest<SkillRadarData>('/developers/dashboard/skill-radar', {
      method: 'POST',
      body: JSON.stringify({ developer_id: developerId })
    }),

  /**
   * 获取技能趋势数据
   */
  getSkillTrends: (
    developerId: string,
    skillCategory?: string,
    timeRange: string = '6m'
  ) =>
    apiRequest<SkillTrendData[]>('/developers/dashboard/skill-trends', {
      method: 'POST',
      body: JSON.stringify({
        developer_id: developerId,
        skill_category: skillCategory,
        time_range: timeRange
      })
    }),

  /**
   * 获取技能网络数据
   */
  getSkillNetwork: (
    developerId: string,
    minStrength: number = 0.5,
    maxNodes: number = 30
  ) =>
    apiRequest<SkillNetworkData>('/developers/dashboard/skill-network', {
      method: 'POST',
      body: JSON.stringify({
        developer_id: developerId,
        min_strength: minStrength,
        max_nodes: maxNodes
      })
    }),

  /**
   * 搜索知识库
   */
  searchKnowledge: (
    query: string,
    developerId: string,
    filters?: {
      categories?: string[];
      tags?: string[];
      date_range?: { start: string; end?: string };
      similarity_threshold?: number;
    },
    limit: number = 20
  ) =>
    apiRequest<KnowledgeSnippet[]>('/developers/knowledge-base/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        developer_id: developerId,
        filters,
        limit
      })
    }),

  /**
   * 获取知识库元数据
   */
  getKnowledgeMetadata: (developerId: string) =>
    apiRequest<KnowledgeMetadata>('/developers/knowledge-base/metadata', {
      method: 'POST',
      body: JSON.stringify({ developer_id: developerId })
    }),

  /**
   * 关联知识片段到开发者资料
   */
  associateKnowledge: (
    knowledgeId: string,
    developerId: string,
    type: 'strength' | 'issue'
  ) =>
    apiRequest<{ success: boolean; id?: string }>('/developers/knowledge-base/associate', {
      method: 'POST',
      body: JSON.stringify({
        knowledge_id: knowledgeId,
        developer_id: developerId,
        type
      })
    }),

  /**
   * 获取知识片段列表
   */
  getKnowledgeSnippets: (developerId: string, category?: string) =>
    apiRequest<KnowledgeSnippet[]>('/developers/knowledge-base/snippets', {
      method: 'POST',
      body: JSON.stringify({
        developer_id: developerId,
        category
      })
    }),

  /**
   * 获取知识库主题分布
   */
  getKnowledgeTopicDistribution: (developerId: string) =>
    apiRequest<TopicDistributionItem[]>('/developers/knowledge-base/snippets', {
      method: 'POST',
      body: JSON.stringify({ developer_id: developerId })
    }).then(response => {
      // 处理响应，计算主题分布
      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      // 统计主题分布
      const topicCounts: Record<string, number> = {};
      let totalCount = 0;

      // 计算每个主题的数量
      response.data.forEach(snippet => {
        const topic = snippet.topic || '未分类';
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        totalCount++;
      });

      // 转换为所需格式并计算百分比
      const topicDistribution: TopicDistributionItem[] = Object.keys(topicCounts).map(topic => ({
        topic,
        count: topicCounts[topic],
        percentage: (topicCounts[topic] / totalCount) * 100
      }));

      // 按数量排序
      return topicDistribution.sort((a, b) => b.count - a.count);
    })
}; 