import { createTool } from "@mastra/core/tools";
import { z } from "zod";
// 导入数据库连接方式 - 使用 pg 库
import pg from 'pg';

// 获取数据库连接字符串 (与 memory.ts 保持一致)
const connectionString = process.env.MEMORY_DB_PG_VECTOR!;
// 创建连接池
const pool = new pg.Pool({ connectionString });

// 定义输入数据的结构 (Agent 需要提供)
const StructuredDataInputSchema = z.object({
  developer_id: z.string().describe("开发者的唯一标识符"),
  insight_type: z.enum(['issue', 'strength']).describe("洞察类型 ('issue' 或 'strength')"),
  category_or_area: z.string().describe("问题类别 或 优势领域"),
  description: z.string().describe("详细描述 (用于匹配现有记录，Agent 需尽量保持一致性)"),
  related_prs: z.array(z.string()).optional().describe("本次相关的 PR 标识符列表（可选）"),
  status: z.enum(['active', 'resolved']).optional().describe("问题状态 ('active'/'resolved')，仅用于 issue 类型"),
  confidence: z.number().min(0).max(1).optional().describe("置信度 (0-1)，可选，主要用于 strength 类型"),
}).describe("要保存的结构化洞察数据");

// 定义 Tool 的输入 Schema
const SaveToolInputSchema = z.object({
  dataToSave: StructuredDataInputSchema,
  currentPrId: z.string().optional().describe("当前操作关联的 PR ID，用于添加到 related_prs"),
});

// 定义 Tool 的输出 Schema
const SaveToolOutputSchema = z.object({
  success: z.boolean().describe("操作是否成功"),
  message: z.string().optional().describe("操作结果信息或错误信息"),
  recordId: z.number().optional().describe("被创建或更新的记录 ID"),
});

// 创建 Tool
export const saveStructuredDataTool = createTool({
  id: "saveStructuredData",
  description: "将分析得出的开发者问题模式或技术优势结构化地保存到数据库中。如果已存在相似记录 (基于开发者、类型、类别和描述匹配)，则更新其频率和最后出现时间。",
  inputSchema: SaveToolInputSchema,
  outputSchema: SaveToolOutputSchema,

  // 实现核心执行逻辑
  execute: async ({ context }) => {
    const { dataToSave, currentPrId } = context;
    const client = await pool.connect(); // 获取数据库连接

    console.log(`[Tool:saveStructuredData] Attempting to save insight for developer: ${dataToSave.developer_id}, type: ${dataToSave.insight_type}`);

    try {
      // --- 核心逻辑：查找现有记录 或 插入新记录 ---

      // A. 查找相似记录
      // 注意：当前使用 description 进行精确匹配，可能过于严格。
      // 更好的方式可能是让 Agent 在调用前先查询并判断，或者这里实现更复杂的匹配。
      const findQuery = `
        SELECT id, frequency, related_prs
        FROM public.developer_profile_data
        WHERE developer_id = $1 AND insight_type = $2 AND category_or_area = $3 AND description = $4
        LIMIT 1;
      `;
      const findResult = await client.query(findQuery, [
        dataToSave.developer_id,
        dataToSave.insight_type,
        dataToSave.category_or_area,
        dataToSave.description
      ]);

      let recordId: number | undefined = undefined;
      let message: string | undefined = undefined;

      if (findResult.rows.length > 0) {
        // B. 找到现有记录 -> 更新
        const existingRecord = findResult.rows[0];
        recordId = existingRecord.id;
        const newFrequency = existingRecord.frequency + 1;
        // 合并 PR 列表 (去重)
        const existingPRs = new Set(existingRecord.related_prs || []);
        if (currentPrId) existingPRs.add(currentPrId);
        if (dataToSave.related_prs) dataToSave.related_prs.forEach(pr => existingPRs.add(pr));
        const newRelatedPRs = Array.from(existingPRs);

        const updateQuery = `
          UPDATE public.developer_profile_data
          SET frequency = $1, last_seen_at = NOW(), related_prs = $2, status = $3, confidence = $4
          WHERE id = $5;
        `;
        await client.query(updateQuery, [
          newFrequency,
          newRelatedPRs,
          dataToSave.status ?? (dataToSave.insight_type === 'issue' ? 'active' : null),
          dataToSave.confidence,
          recordId
        ]);
        message = `Insight updated (ID: ${recordId}, Frequency: ${newFrequency})`;
        console.log(`[Tool:saveStructuredData] ${message}`);

      } else {
        // C. 未找到 -> 插入新记录
        const insertQuery = `
          INSERT INTO public.developer_profile_data (
            developer_id, insight_type, category_or_area, description,
            frequency, first_seen_at, last_seen_at, related_prs, status, confidence
          ) VALUES (
            $1, $2, $3, $4, $5, NOW(), NOW(), $6, $7, $8
          ) RETURNING id; -- 返回新插入记录的 ID
        `;
        const newRelatedPRs = currentPrId ? [currentPrId] : (dataToSave.related_prs || []);
        const insertResult = await client.query(insertQuery, [
          dataToSave.developer_id,
          dataToSave.insight_type,
          dataToSave.category_or_area,
          dataToSave.description,
          1, // frequency 初始为 1
          newRelatedPRs,
          dataToSave.status ?? (dataToSave.insight_type === 'issue' ? 'active' : null),
          dataToSave.confidence
        ]);
        recordId = insertResult.rows[0].id;
        message = `New insight saved (ID: ${recordId})`;
        console.log(`[Tool:saveStructuredData] ${message}`);
      }

      return { success: true, message, recordId };

    } catch (error: any) {
      console.error(`[Tool:saveStructuredData] Error saving data for developer ${dataToSave.developer_id}:`, error);
      // 在输出中包含更详细的错误类型或代码可能有助于调试
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, message: `Database error: ${errorMessage}` };
    } finally {
      client.release(); // 释放数据库连接回连接池
    }
  },
}); 