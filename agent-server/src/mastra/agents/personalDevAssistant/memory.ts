import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";

const connectionString = process.env.REPO_DB!;

export const memory = new Memory({
  storage: new PostgresStore({ connectionString }),
  vector: new PgVector(connectionString),
  options: {
    lastMessages: 10,
    semanticRecall: false,
  },
});
