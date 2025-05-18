import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import pg from 'pg';
import { openaiEmbeddingModel } from "../model-provider/openai"; // Import the shared embedder

// Reuse the connection string and pool configuration
const connectionString = process.env.MEMORY_DB_PG_VECTOR!;
const pool = new pg.Pool({ connectionString });

// 1. Define the input schema for the search tool
const SearchKnowledgeInputSchema = z.object({
  developer_id: z.string().describe("要搜索其知识库的开发者的唯一标识符"),
  queryText: z.string().min(3).describe("用户的自然语言搜索查询 (至少 3 个字符)"),
  topK: z.number().int().positive().optional().default(5).describe("要返回的最相关结果数量 (可选, 默认 5)"),
  topicFilter: z.string().optional().describe("用于精确匹配过滤知识点主题的字符串 (可选)"),
  // Maybe add a minimum similarity threshold later if needed
});

// 2. Define the schema for a single returned knowledge snippet
const KnowledgeSnippetResultSchema = z.object({
  id: z.number(),
  developer_id: z.string(),
  topic: z.string().nullable(), // Topic can be null
  content_summary: z.string(),
  source_pr: z.string().nullable(), // Optional field
  extracted_from_section: z.string().nullable(), // Optional field
  created_at: z.date(), // Return as Date object
  similarity_score: z.number().describe("查询与结果之间的相似度得分 (L2 距离, 越小越相似)"),
});

// 3. Define the tool's output schema
const SearchKnowledgeOutputSchema = z.object({
  success: z.boolean().describe("查询是否成功执行"),
  results: z.array(KnowledgeSnippetResultSchema).optional().describe("查询到的知识片段列表 (按相似度排序)"),
  message: z.string().optional().describe("操作结果信息或错误信息"),
});

// 4. Create the Tool
export const searchKnowledgeBaseTool = createTool({
  id: "searchKnowledgeBase",
  description: "根据自然语言查询在指定开发者的个人知识库中搜索相关的知识点或解决方案。",
  inputSchema: SearchKnowledgeInputSchema,
  outputSchema: SearchKnowledgeOutputSchema,

  // 5. Implement the core execution logic
  execute: async ({ context }) => {
    const { developer_id, queryText, topK, topicFilter } = context;
    let client: pg.PoolClient | null = null;

    console.log(`[Tool:searchKnowledgeBase] Searching knowledge for developer: ${developer_id}, query: "${queryText.substring(0, 50)}...", topK: ${topK}, topicFilter: ${topicFilter ?? 'N/A'}`);

    try {
      // A. Generate embedding for the query text
      console.log(`[Tool:searchKnowledgeBase] Generating embedding for query text...`);
      const embeddingResult = await openaiEmbeddingModel.doEmbed({ values: [queryText] });
      const queryEmbedding = embeddingResult.embeddings[0];
      console.log(`[Tool:searchKnowledgeBase] Query embedding generated (length: ${queryEmbedding.length})`);

      if (queryEmbedding.length !== 1536) {
        console.error(`[Tool:searchKnowledgeBase] Error: Query embedding dimension mismatch. Expected 1536, got ${queryEmbedding.length}`);
        return { success: false, message: `Embedding generation failed: Dimension mismatch (expected 1536, got ${queryEmbedding.length})` };
      }
      const queryEmbeddingString = `[${queryEmbedding.join(',')}]`;

      // B. Connect to the database
      client = await pool.connect();
      console.log(`[Tool:searchKnowledgeBase] Database connection acquired.`);

      // C. Construct the similarity search query
      let paramIndex = 1;
      const queryParams: any[] = [];

      let searchQuery = `
        SELECT
          id, developer_id, topic, content_summary, source_pr,
          extracted_from_section, created_at,
          embedding <-> $${paramIndex++} AS similarity_score -- Calculate L2 distance
        FROM public.knowledge_snippets
        WHERE developer_id = $${paramIndex++}
      `;
      queryParams.push(queryEmbeddingString); // $1: query embedding
      queryParams.push(developer_id);        // $2: developer_id

      // Add topic filter if provided
      if (topicFilter) {
        searchQuery += ` AND topic = $${paramIndex++}`;
        queryParams.push(topicFilter);
      }

      // Add ordering and limit
      searchQuery += `
        ORDER BY similarity_score ASC -- Order by distance (ascending)
        LIMIT $${paramIndex++};
      `;
      queryParams.push(topK);

      console.log(`[Tool:searchKnowledgeBase] Executing search query...`);
      // console.log("[DEBUG] Query:", searchQuery); // Uncomment for debugging
      // console.log("[DEBUG] Params:", queryParams); // Uncomment for debugging

      // D. Execute the query
      const searchResult = await client.query(searchQuery, queryParams);

      // E. Format the results
      const results = searchResult.rows.map(row => ({
        ...row,
        topic: row.topic || null,
        source_pr: row.source_pr || null,
        extracted_from_section: row.extracted_from_section || null,
        created_at: new Date(row.created_at), // Convert to Date object
        similarity_score: parseFloat(row.similarity_score) // Ensure score is a number
      }));

      console.log(`[Tool:searchKnowledgeBase] Found ${results.length} relevant snippets.`);

      // F. Optional: Validate output against schema (good practice)
      const validation = SearchKnowledgeOutputSchema.safeParse({ success: true, results });
      if (!validation.success) {
        console.error("[Tool:searchKnowledgeBase] Output validation failed:", validation.error);
        // Decide how to handle validation errors (e.g., return error or unvalidated data)
        return { success: false, message: "Search successful, but output validation failed." };
      }

      return validation.data; // Return validated data

    } catch (error: any) {
      console.error(`[Tool:searchKnowledgeBase] Error searching knowledge for developer ${developer_id}:`, error);
      let errorMessage = "An unexpected error occurred during search.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      return { success: false, message: `Error searching knowledge: ${errorMessage}` };
    } finally {
      if (client) {
        client.release();
        console.log(`[Tool:searchKnowledgeBase] Database connection released.`);
      }
    }
  },
}); 