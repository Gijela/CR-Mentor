import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";
import { openaiEmbeddingModel } from "../../model-provider/openai";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MEMORY_DB_PG_VECTOR!;

export const memory = new Memory({
  storage: new PostgresStore({ connectionString }) as any,
  vector: new PgVector({ connectionString }) as any,
  embedder: openaiEmbeddingModel,
  options: {
    lastMessages: 10,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
    threads: {
      generateTitle: true,
    },
  },
});
