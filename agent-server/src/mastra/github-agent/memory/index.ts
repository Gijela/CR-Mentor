import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

export const githubAgentMemory = new Memory({
  storage: new PostgresStore({ connectionString: process.env.REPO_DB! }),
  options: { lastMessages: 10 },
  // embedder: new OpenAIEmbedder({
  //   model: "text-embedding-3-small",
  // }),
});
