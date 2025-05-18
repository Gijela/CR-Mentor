// agent-server/src/mastra/agents/personalDevAssistant/tools/queryStructuredDataTool.ts

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
// 使用 pg 库进行数据库操作
import pg from 'pg';

// 获取数据库连接字符串
const connectionString = process.env.REPO_DB!;
const pool = new pg.Pool({ connectionString });

// 1. 定义查询过滤条件 Schema (可选)
const QueryFiltersSchema = z.object({
  insight_type: z.enum(['issue', 'strength']).optional().describe("要查询的洞察类型 ('issue' 或 'strength')"),
  category_or_area: z.string().optional().describe("要查询的问题类别或优势领域"),
  status: z.enum(['active', 'resolved']).optional().describe("要查询的问题状态 ('active'/'resolved')，仅用于 issue 类型"),
  // 可以根据需要添加时间范围过滤等
  // timeRangeStart: z.string().datetime().optional(),
  // timeRangeEnd: z.string().datetime().optional(),
}).describe("查询过滤条件 (可选)");

// 2. 定义 Tool 的输入 Schema
const QueryToolInputSchema = z.object({
  developer_id: z.string().describe("要查询的开发者的唯一标识符"),
  filters: QueryFiltersSchema.optional().describe("用于筛选结果的可选过滤条件"),
});

// 3. 定义单条返回记录的 Schema (与数据库表结构对应)
const ProfileDataRecordSchema = z.object({
  id: z.number(),
  developer_id: z.string(),
  insight_type: z.enum(['issue', 'strength']),
  category_or_area: z.string(),
  description: z.string(),
  frequency: z.number(),
  first_seen_at: z.date(), // 返回 Date 对象
  last_seen_at: z.date(),  // 返回 Date 对象
  related_prs: z.array(z.string()).nullable(), // 可能为 null
  status: z.enum(['active', 'resolved']).nullable(), // 可能为 null
  confidence: z.number().nullable(), // 可能为 null
});

// 4. 定义 Tool 的输出 Schema
const QueryToolOutputSchema = z.object({
  success: z.boolean().describe("查询是否成功执行"),
  results: z.array(ProfileDataRecordSchema).optional().describe("查询到的结构化洞察记录列表"),
  message: z.string().optional().describe("操作结果信息或错误信息"),
});

// 5. 创建 Tool
export const queryStructuredDataTool = createTool({
  id: "queryStructuredData",
  description: "根据开发者 ID 查询其已记录的结构化问题模式和技术优势。可以提供可选的过滤条件。",
  inputSchema: QueryToolInputSchema,
  outputSchema: QueryToolOutputSchema,

  // 6. 实现核心执行逻辑
  execute: async ({ context }) => {
    const { developer_id, filters } = context;
    const client = await pool.connect();

    console.log(`[Tool:queryStructuredData] Querying data for developer: ${developer_id} with filters: ${JSON.stringify(filters)}`);

    try {
      // --- 核心逻辑：动态构建 SQL 查询 ---
      let queryText = `SELECT * FROM public.developer_profile_data WHERE developer_id = $1`;
      const queryParams: any[] = [developer_id];
      let paramIndex = 2; // $1 已经被 developer_id 使用

      if (filters) {
        if (filters.insight_type) {
          queryText += ` AND insight_type = $${paramIndex++}`;
          queryParams.push(filters.insight_type);
        }
        if (filters.category_or_area) {
          // 使用 ILIKE 进行不区分大小写的模糊匹配可能更实用？或者保持精确匹配
          queryText += ` AND category_or_area = $${paramIndex++}`;
          // queryText += ` AND category_or_area ILIKE $${paramIndex++}`; // 模糊匹配示例
          queryParams.push(filters.category_or_area);
          // queryParams.push(`%${filters.category_or_area}%`); // 模糊匹配参数
        }
        if (filters.status) {
          queryText += ` AND status = $${paramIndex++}`;
          queryParams.push(filters.status);
        }
        // 这里可以添加时间范围等其他过滤条件
      }

      // 添加排序，例如按最后出现时间降序
      queryText += ` ORDER BY last_seen_at DESC;`;

      console.log(`[Tool:queryStructuredData] Executing query: ${queryText} with params: ${JSON.stringify(queryParams)}`);

      const queryResult = await client.query(queryText, queryParams);

      // 将数据库行映射到定义的 Schema (可选，但推荐进行类型转换)
      // 注意：数据库返回的 related_prs 是数组，status/confidence 可能为 null，时间戳是 Date 对象
      const results = queryResult.rows.map(row => ({
        ...row,
        // 如果需要确保类型完全匹配 Zod schema，可以在这里做更严格的转换或验证
        related_prs: row.related_prs || null, // 处理 DB null
        status: row.status || null,
        confidence: row.confidence !== null ? parseFloat(row.confidence) : null, // 处理 DB null 并转数字
        first_seen_at: new Date(row.first_seen_at), // 转 Date 对象
        last_seen_at: new Date(row.last_seen_at)   // 转 Date 对象
      }));

      // 尝试验证输出是否符合 Schema (可选，增加健壮性)
      const validation = QueryToolOutputSchema.safeParse({ success: true, results });
      if (!validation.success) {
        console.error("[Tool:queryStructuredData] Output validation failed:", validation.error);
        // 可以选择返回错误或返回未经验证的数据
        return { success: false, message: "Query successful, but output validation failed." };
      }


      console.log(`[Tool:queryStructuredData] Found ${results.length} records for developer: ${developer_id}`);
      // 确保返回验证后的数据
      return validation.data;
      // 或者如果跳过验证，直接返回: return { success: true, results };

    } catch (error: any) {
      console.error(`[Tool:queryStructuredData] Error querying data for developer ${developer_id}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, message: `Database query error: ${errorMessage}` };
    } finally {
      client.release(); // 释放连接
    }
  },
}); 