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

/**
 * 获取技能雷达图数据
 */
export async function getSkillRadarData(developerId: string): Promise<SkillRadarData> {
  try {
    // 查询开发者的技能强度数据，按技能类别聚合
    const query = `
      SELECT 
        category_or_area as category,
        AVG(confidence) as average_strength
      FROM 
        developer_profile_data
      WHERE 
        developer_id = $1
        AND insight_type = 'strength'
      GROUP BY 
        category_or_area
      ORDER BY 
        average_strength DESC
    `;

    const result = await db.query(query, [developerId]);

    // 提取类别和值
    const categories = result.rows.map(row => row.category);
    const values = result.rows.map(row => parseFloat(row.average_strength) * 100); // 转换为百分比
    const maxValue = Math.max(...values, 100); // 确保最大值至少是100

    return {
      categories,
      values,
      maxValue,
    };
  } catch (error) {
    console.error("获取技能雷达图数据错误:", error);

    // 如果数据库不可用，返回模拟数据
    return {
      categories: ["React", "TypeScript", "Node.js", "GraphQL", "Testing", "CSS/SCSS"],
      values: [85, 90, 75, 65, 70, 80],
      maxValue: 100,
    };
  }
}

/**
 * 获取技能趋势数据
 */
export async function getSkillTrendsData(
  developerId: string,
  skillCategory?: string,
  timeRange: string = "6m"
): Promise<SkillTrendData[]> {
  try {
    // 根据时间范围确定查询的日期范围
    let monthsAgo = 6;
    if (timeRange === "1m") monthsAgo = 1;
    else if (timeRange === "3m") monthsAgo = 3;
    else if (timeRange === "12m") monthsAgo = 12;
    else if (timeRange === "all") monthsAgo = 36; // 最大查询3年数据

    // 构建基础查询
    let query = `
      WITH date_series AS (
        SELECT generate_series(
          date_trunc('month', CURRENT_DATE - INTERVAL '${monthsAgo} months'),
          date_trunc('month', CURRENT_DATE),
          INTERVAL '1 month'
        ) AS month_date
      )
      SELECT 
        ds.month_date::date as date,
        COALESCE(AVG(dpd.confidence), 0) as average_confidence,
        dpd.category_or_area as category
      FROM 
        date_series ds
      LEFT JOIN 
        developer_profile_data dpd 
      ON 
        date_trunc('month', dpd.first_seen_at) = ds.month_date
        AND dpd.developer_id = $1
        AND dpd.insight_type = 'strength'
    `;

    const queryParams: any[] = [developerId];

    // 如果指定了技能类别，添加过滤条件
    if (skillCategory) {
      query += ` AND dpd.category_or_area = $2`;
      queryParams.push(skillCategory);
    }

    // 完成查询并按日期和类别分组
    query += `
      GROUP BY 
        ds.month_date, dpd.category_or_area
      ORDER BY 
        ds.month_date, dpd.category_or_area
    `;

    const result = await db.query(query, queryParams);

    // 处理结果
    return result.rows.map(row => ({
      date: row.date.toISOString().split('T')[0], // 格式化日期为YYYY-MM-DD
      value: parseFloat(row.average_confidence) * 100, // 转换为百分比
      category: row.category,
    }));
  } catch (error) {
    console.error("获取技能趋势数据错误:", error);

    // 返回模拟数据
    const mockData: SkillTrendData[] = [];
    const today = new Date();
    const categories = skillCategory ? [skillCategory] : ["React", "TypeScript", "Node.js"];

    // 获取时间范围
    let mockMonthsAgo = 6;
    if (timeRange === "1m") mockMonthsAgo = 1;
    else if (timeRange === "3m") mockMonthsAgo = 3;
    else if (timeRange === "12m") mockMonthsAgo = 12;
    else if (timeRange === "all") mockMonthsAgo = 36;

    // 生成过去几个月的模拟数据
    for (let i = 0; i < mockMonthsAgo; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const dateStr = date.toISOString().split('T')[0].substring(0, 7); // YYYY-MM

      categories.forEach(category => {
        // 为每个类别生成随机增长的技能值
        const baseValue = 60 + Math.random() * 20;
        const growthFactor = 1 + (i * 0.05); // 随时间略微增长

        mockData.push({
          date: dateStr,
          value: Math.min(baseValue * growthFactor, 100),
          category,
        });
      });
    }

    // 按日期排序
    return mockData.sort((a, b) => a.date.localeCompare(b.date));
  }
}

/**
 * 获取技能关联网络数据
 */
export async function getSkillNetworkData(
  developerId: string,
  minStrength: number = 0.5,
  maxNodes: number = 30
): Promise<SkillNetworkData> {
  try {
    // 获取开发者的主要技能节点
    const nodesQuery = `
      SELECT 
        id,
        category_or_area as category,
        description as name,
        confidence as value
      FROM 
        developer_profile_data
      WHERE 
        developer_id = $1
        AND insight_type = 'strength'
        AND confidence >= $2
      ORDER BY 
        confidence DESC
      LIMIT $3
    `;

    const nodesResult = await db.query(nodesQuery, [developerId, minStrength, maxNodes]);

    // 查询这些节点之间的关联关系
    // 这里使用一个简化的算法：如果两个技能出现在同一个项目/PR中，则它们有关联
    const linksQuery = `
      WITH skill_pairs AS (
        SELECT 
          a.id as source_id,
          b.id as target_id,
          COUNT(*) as occurrence_count
        FROM 
          developer_profile_data a
        JOIN 
          developer_profile_data b 
        ON 
          a.developer_id = b.developer_id
          AND a.id < b.id  -- 避免重复计算
          AND a.insight_type = 'strength'
          AND b.insight_type = 'strength'
          AND (
            (a.related_prs && b.related_prs) OR  -- 共享PR
            (a.category_or_area = b.category_or_area)  -- 同一类别
          )
        WHERE 
          a.developer_id = $1
          AND a.id = ANY($2)
          AND b.id = ANY($2)
        GROUP BY 
          a.id, b.id
      )
      SELECT 
        sp.source_id as source,
        sp.target_id as target,
        sp.occurrence_count / (
          SELECT MAX(occurrence_count) FROM skill_pairs
        ) as strength
      FROM 
        skill_pairs sp
      WHERE 
        sp.occurrence_count > 0
      ORDER BY 
        sp.occurrence_count DESC
    `;

    const nodeIds = nodesResult.rows.map(row => row.id);
    const linksResult = await db.query(linksQuery, [developerId, nodeIds]);

    // 构造返回数据
    const nodes: SkillNode[] = nodesResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      value: parseFloat(row.value),
    }));

    const links: SkillLink[] = linksResult.rows.map(row => ({
      source: row.source,
      target: row.target,
      strength: parseFloat(row.strength),
    }));

    return { nodes, links };
  } catch (error) {
    console.error("获取技能网络数据错误:", error);

    // 返回模拟数据
    return generateMockSkillNetworkData();
  }
}

/**
 * 生成模拟的技能网络数据
 */
function generateMockSkillNetworkData(): SkillNetworkData {
  // 创建节点
  const mockNodes: SkillNode[] = [
    { id: "n1", name: "React", category: "前端框架", value: 0.9 },
    { id: "n2", name: "TypeScript", category: "编程语言", value: 0.85 },
    { id: "n3", name: "Redux", category: "状态管理", value: 0.8 },
    { id: "n4", name: "GraphQL", category: "API", value: 0.7 },
    { id: "n5", name: "Node.js", category: "后端", value: 0.75 },
    { id: "n6", name: "Express", category: "后端框架", value: 0.7 },
    { id: "n7", name: "Jest", category: "测试", value: 0.65 },
    { id: "n8", name: "CSS/SCSS", category: "样式", value: 0.8 },
    { id: "n9", name: "MongoDB", category: "数据库", value: 0.6 },
    { id: "n10", name: "PostgreSQL", category: "数据库", value: 0.75 },
  ];

  // 创建链接
  const mockLinks: SkillLink[] = [
    { source: "n1", target: "n2", strength: 0.9 },
    { source: "n1", target: "n3", strength: 0.85 },
    { source: "n1", target: "n8", strength: 0.8 },
    { source: "n2", target: "n3", strength: 0.7 },
    { source: "n2", target: "n5", strength: 0.6 },
    { source: "n3", target: "n4", strength: 0.5 },
    { source: "n5", target: "n6", strength: 0.9 },
    { source: "n5", target: "n9", strength: 0.7 },
    { source: "n5", target: "n10", strength: 0.75 },
    { source: "n6", target: "n9", strength: 0.8 },
    { source: "n6", target: "n10", strength: 0.7 },
    { source: "n7", target: "n1", strength: 0.6 },
    { source: "n7", target: "n5", strength: 0.5 },
  ];

  return { nodes: mockNodes, links: mockLinks };
} 