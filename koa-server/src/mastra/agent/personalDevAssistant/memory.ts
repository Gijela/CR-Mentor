import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";
import { openaiEmbeddingModel } from "../../model-provider/openai";

const connectionString = process.env.REPO_DB!;

export const memory = new Memory({
  storage: new PostgresStore({ connectionString }),
  vector: new PgVector(connectionString),
  embedder: openaiEmbeddingModel,
  options: {
    lastMessages: 10,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
  },
});
