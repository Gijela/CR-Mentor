import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { memory } from "./memory";
import { agentInstructions } from "./instruction";

import { saveStructuredDataTool } from "./tools/saveStructuredDataTool";
import { queryStructuredDataTool } from "./tools/queryStructuredDataTool";
import { saveKnowledgeSnippetTool } from "./tools/saveKnowledgeSnippetTool";
import { searchKnowledgeBaseTool } from "./tools/searchKnowledgeBaseTool";

export const personalDevAssistantAgent = new Agent({
  name: "personalDevAssistant",
  instructions: agentInstructions,
  memory,
  model: openai("gpt-4o-mini"),
  tools: {
    saveStructuredData: saveStructuredDataTool,
    queryStructuredData: queryStructuredDataTool,
    saveKnowledgeSnippet: saveKnowledgeSnippetTool,
    searchKnowledgeBase: searchKnowledgeBaseTool,
  }
});