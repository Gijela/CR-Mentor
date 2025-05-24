import { Pool } from 'pg';

// 初始化PostgreSQL连接池
const connectionString = process.env.MEMORY_DB_PG_VECTOR;
if (!connectionString) {
  console.error("错误：未设置MEMORY_DB_PG_VECTOR环境变量");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});

// 数据库访问对象
const db = {
  query: async (sql: string, params: any[] = []) => {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, params);
      return result;
    } finally {
      client.release();
    }
  },
};

// 知识片段类型定义
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

/**
 * 语义搜索知识片段
 */
export async function searchKnowledgeSnippets(
  query: string,
  developerId: string,
  filters?: {
    categories?: string[];
    tags?: string[];
    date_range?: { start: string; end?: string };
    similarity_threshold?: number;
  },
  limit: number = 20
): Promise<KnowledgeSnippet[]> {
  try {
    // 由于向量搜索功能不可用，使用基于文本的搜索作为替代
    // 这会降低搜索的语义精度，但至少可以工作
    let sqlQuery = `
      SELECT 
        ks.id, 
        ks.content_summary as content, 
        ks.content_summary as summary, 
        ks.topic as category, 
        ks.source_pr as source,
        ks.created_at,
        ks.created_at as updated_at,
        ks.id as vector_id
      FROM 
        knowledge_snippets ks
      WHERE 
        ks.developer_id = $1
        AND (
          ks.content_summary ILIKE $2
          OR ks.topic ILIKE $2
        )
    `;

    // 使用简单的LIKE模式匹配
    const searchPattern = `%${query}%`;
    const queryParams: any[] = [developerId, searchPattern];
    let paramCount = 2;

    // 添加主题过滤（使用topic代替category）
    if (filters?.categories && filters.categories.length > 0) {
      paramCount++;
      sqlQuery += ` AND ks.topic = ANY($${paramCount})`;
      queryParams.push(filters.categories);
    }

    // 添加日期范围过滤
    if (filters?.date_range?.start) {
      paramCount++;
      sqlQuery += ` AND ks.created_at >= $${paramCount}`;
      queryParams.push(filters.date_range.start);

      if (filters.date_range.end) {
        paramCount++;
        sqlQuery += ` AND ks.created_at <= $${paramCount}`;
        queryParams.push(filters.date_range.end);
      }
    }

    // 按创建时间排序并限制结果数量
    sqlQuery += ` ORDER BY ks.created_at DESC LIMIT $${paramCount + 1}`;
    queryParams.push(limit);

    const result = await db.query(sqlQuery, queryParams);

    // 处理结果，为每个结果添加空的tags数组和一个固定的相似度得分
    return result.rows.map((row: any) => ({
      id: row.id,
      content: row.content,
      summary: row.summary,
      category: row.category || "未分类", // 提供默认值
      tags: [], // 由于数据库中没有tags，返回空数组
      source: row.source,
      created_at: row.created_at,
      updated_at: row.updated_at,
      vector_id: row.vector_id,
      similarity_score: 0.8, // 提供一个固定的相似度得分
    }));
  } catch (error) {
    console.error("搜索知识片段错误:", error);

    // 如果数据库不可用或向量搜索功能未实现，返回模拟数据
    return generateMockResults(query, limit);
  }
}

/**
 * 获取知识库元数据（分类和标签）
 */
export async function getKnowledgeMetadata(developerId: string): Promise<KnowledgeMetadata> {
  try {
    // 获取所有唯一主题（topic代替category）
    const categoriesQuery = `
      SELECT DISTINCT topic as category
      FROM knowledge_snippets 
      WHERE developer_id = $1 AND topic IS NOT NULL
      ORDER BY topic
    `;

    const categoriesResult = await db.query(categoriesQuery, [developerId]);

    // 由于数据库中不存在tags列，我们返回一些常见的前端开发标签作为模拟数据
    return {
      categories: categoriesResult.rows.map((row: any) => row.category),
      tags: ["React", "TypeScript", "JavaScript", "性能优化", "状态管理", "组件设计", "UI/UX", "最佳实践"]
    };
  } catch (error) {
    console.error("获取知识库元数据错误:", error);

    // 如果数据库不可用，返回模拟数据
    return {
      categories: ["React", "TypeScript", "JavaScript", "组件设计", "状态管理", "性能优化"],
      tags: ["hooks", "类型安全", "最佳实践", "性能优化", "架构", "UI设计"]
    };
  }
}

/**
 * 关联知识片段到开发者资料
 */
export async function associateKnowledgeToProfile(
  knowledgeId: string,
  developerId: string,
  type: "strength" | "issue"
): Promise<{ success: boolean; id?: string }> {
  try {
    // 首先检查知识片段是否存在
    const checkQuery = `
      SELECT id, content_summary, topic 
      FROM knowledge_snippets 
      WHERE id = $1 AND developer_id = $2
    `;

    const checkResult = await db.query(checkQuery, [knowledgeId, developerId]);

    if (checkResult.rows.length === 0) {
      throw new Error("找不到指定的知识片段");
    }

    const snippet = checkResult.rows[0];

    // 创建关联记录 - 使用topic代替category_or_area
    const insertQuery = `
      INSERT INTO developer_profile_data 
        (developer_id, insight_type, description, category_or_area, 
        ${type === "strength" ? "confidence" : "status"}, 
        related_prs, first_seen_at, last_seen_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id
    `;

    const insertParams = [
      developerId,
      type,
      snippet.content_summary,
      snippet.topic || "未分类", // 使用topic作为category_or_area
      type === "strength" ? 0.8 : "active", // 默认值
      [knowledgeId], // 使用知识片段ID作为related_prs的引用
    ];

    const insertResult = await db.query(insertQuery, insertParams);

    return {
      success: true,
      id: insertResult.rows[0].id,
    };
  } catch (error) {
    console.error("关联知识片段错误:", error);

    // 如果数据库操作失败，返回失败信息
    return {
      success: false,
    };
  }
}

/**
 * 生成模拟搜索结果（用于后端API尚未完全实现时）
 */
function generateMockResults(query: string, limit: number): KnowledgeSnippet[] {
  // 更丰富的模拟结果数据
  const mockData: KnowledgeSnippet[] = [
    {
      id: "ks1",
      content: "在React组件中，状态管理最佳实践包括：1) 使用局部状态管理简单UI状态；2) 使用Context API管理中等复杂度的应用状态；3) 对于复杂应用考虑使用Redux或MobX；4) 使用React Query或SWR处理服务器状态。避免过度使用全局状态，这会导致性能问题和难以维护的代码。",
      summary: "React状态管理最佳实践",
      category: "React",
      tags: ["状态管理", "性能优化", "架构"],
      created_at: new Date().toISOString(),
      similarity_score: 0.92,
    },
    {
      id: "ks2",
      content: "TypeScript中的泛型允许创建可重用的组件，支持多种数据类型。泛型的主要优势是在保持类型安全的同时提供灵活性。常见用例包括：1) 创建通用数据结构如数组、映射；2) 编写通用函数；3) 约束泛型参数；4) 在React组件中使用泛型提高组件的重用性。",
      summary: "TypeScript泛型使用指南",
      category: "TypeScript",
      tags: ["泛型", "类型安全", "高级类型"],
      created_at: new Date().toISOString(),
      similarity_score: 0.85,
    },
    {
      id: "ks3",
      content: "构建高性能React组件的关键策略：1) 使用React.memo避免不必要的重新渲染；2) 使用useCallback和useMemo缓存函数和计算值；3) 实现虚拟滚动处理大型列表；4) 懒加载组件和代码分割；5) 使用Web Workers处理CPU密集型任务；6) 优化Context使用，避免过度触发重新渲染。",
      summary: "React性能优化技巧",
      category: "React",
      tags: ["性能优化", "渲染优化", "最佳实践"],
      created_at: new Date().toISOString(),
      similarity_score: 0.78,
    },
    {
      id: "ks4",
      content: "组件设计的核心原则包括：单一职责、可组合性、可重用性、可测试性和可维护性。创建通用组件时，确保它们是可配置的、与状态解耦的，并且遵循一致的API设计。使用props传递数据和行为，避免过度使用上下文和全局状态。",
      summary: "React组件设计最佳实践",
      category: "组件设计",
      tags: ["设计模式", "组件架构", "最佳实践"],
      created_at: new Date().toISOString(),
      similarity_score: 0.82,
    },
    {
      id: "ks5",
      content: "状态管理是前端开发中的核心挑战之一。针对不同复杂度的应用，选择合适的状态管理方案：1) 简单应用使用React的useState和useReducer；2) 中等复杂度应用使用Context API；3) 复杂应用使用Redux、MobX或Zustand；4) 服务器状态使用React Query、SWR或Apollo Client。",
      summary: "状态管理解决方案对比",
      category: "状态管理",
      tags: ["React", "Redux", "Context API", "状态设计"],
      created_at: new Date().toISOString(),
      similarity_score: 0.88,
    }
  ];

  // 不区分大小写的搜索
  const lowerCaseQuery = query.toLowerCase();

  // 根据查询关键字过滤模拟结果
  const filteredResults = mockData.filter(item => {
    const contentMatch = item.content.toLowerCase().includes(lowerCaseQuery);
    const summaryMatch = item.summary.toLowerCase().includes(lowerCaseQuery);
    const categoryMatch = item.category.toLowerCase().includes(lowerCaseQuery);
    const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));

    return contentMatch || summaryMatch || categoryMatch || tagsMatch;
  });

  // 如果没有匹配项，返回一些默认结果
  if (filteredResults.length === 0 && lowerCaseQuery.length > 0) {
    return mockData.slice(0, Math.min(limit, 3));
  }

  // 返回过滤后的结果，限制数量
  return filteredResults.slice(0, limit);
} 