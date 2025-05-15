import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import pg from 'pg';
import { openaiEmbeddingModel } from "../model-provider/openai"; // Import the shared embedder

// Reuse the connection string and pool configuration from other tools
const connectionString = process.env.MEMORY_DB_PG_VECTOR!;
const pool = new pg.Pool({ connectionString });

// Define the input schema for the data to be saved
const KnowledgeSnippetInputSchema = z.object({
  developer_id: z.string().describe("开发者的唯一标识符"),
  content_summary: z.string().min(10).describe("提炼的知识点/解决方案的核心内容 (至少 10 个字符)"),
  topic: z.string().optional().describe("知识点的主题或分类 (可选)"),
  source_pr: z.string().optional().describe("来源 PR 链接或标识符 (可选)"),
  extracted_from_section: z.string().optional().describe("PR 中提炼的具体部分 (例如 'walkthrough', 'discussion', 可选)"),
});

// Define the tool's output schema
const SaveSnippetOutputSchema = z.object({
  success: z.boolean().describe("操作是否成功"),
  message: z.string().optional().describe("操作结果信息或错误信息"),
  snippetId: z.number().optional().describe("被创建的知识片段记录 ID"),
});

// Create the Tool
export const saveKnowledgeSnippetTool = createTool({
  id: "saveKnowledgeSnippet",
  description: "将提炼出的个人知识点或解决方案保存到知识库中。工具会自动为内容生成向量嵌入。",
  inputSchema: KnowledgeSnippetInputSchema, // Directly use the snippet schema as input
  outputSchema: SaveSnippetOutputSchema,

  // Implement the core execution logic
  execute: async ({ context }) => {
    // Directly use the context as input data, assuming it matches KnowledgeSnippetInputSchema
    const dataToSave = context;
    let client: pg.PoolClient | null = null; // Declare client outside try block

    console.log(`[Tool:saveKnowledgeSnippet] Attempting to save snippet for developer: ${dataToSave.developer_id}`);

    try {
      // 1. Generate embedding for the content summary
      console.log(`[Tool:saveKnowledgeSnippet] Generating embedding for content: "${dataToSave.content_summary.substring(0, 50)}..."`);
      const embeddingResult = await openaiEmbeddingModel.doEmbed({ values: [dataToSave.content_summary] });
      const embedding = embeddingResult.embeddings[0];
      console.log(`[Tool:saveKnowledgeSnippet] Embedding generated successfully (length: ${embedding.length})`);

      // Ensure embedding has the expected dimension (optional but good practice)
      if (embedding.length !== 1536) {
        console.error(`[Tool:saveKnowledgeSnippet] Error: Embedding dimension mismatch. Expected 1536, got ${embedding.length}`);
        return { success: false, message: `Embedding generation failed: Dimension mismatch (expected 1536, got ${embedding.length})` };
      }


      // 2. Connect to the database
      client = await pool.connect();
      console.log(`[Tool:saveKnowledgeSnippet] Database connection acquired.`);

      // 3. Insert the data into the knowledge_snippets table
      const insertQuery = `
        INSERT INTO public.knowledge_snippets (
          developer_id, topic, content_summary, embedding,
          source_pr, extracted_from_section, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, NOW()
        ) RETURNING id; -- Return the ID of the newly inserted row
      `;

      const queryParams = [
        dataToSave.developer_id,
        dataToSave.topic, // Optional, might be null
        dataToSave.content_summary,
        `[${embedding.join(',')}]`, // Format embedding array for pgvector
        dataToSave.source_pr, // Optional
        dataToSave.extracted_from_section // Optional
      ];

      console.log(`[Tool:saveKnowledgeSnippet] Executing insert query...`);
      const insertResult = await client.query(insertQuery, queryParams);

      const snippetId = insertResult.rows[0].id;
      const message = `Knowledge snippet saved successfully (ID: ${snippetId})`;
      console.log(`[Tool:saveKnowledgeSnippet] ${message}`);

      return { success: true, message, snippetId };

    } catch (error: any) {
      console.error(`[Tool:saveKnowledgeSnippet] Error saving knowledge snippet for developer ${dataToSave.developer_id}:`, error);
      // Provide more specific error feedback if possible
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      // Check for specific DB errors if needed (e.g., connection error, constraint violation)

      return { success: false, message: `Error saving snippet: ${errorMessage}` };
    } finally {
      if (client) {
        client.release(); // Release the database connection back to the pool
        console.log(`[Tool:saveKnowledgeSnippet] Database connection released.`);
      }
    }
  },
}); 