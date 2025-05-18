import { Agent } from "@mastra/core/agent";

import { memory } from "./memory";
import { agentInstructions } from "./instruction";
import { deepSeekModel } from "../../model-provider/deepseek";
import { saveStructuredDataTool } from "./tools/saveStructuredDataTool";
import { queryStructuredDataTool } from "./tools/queryStructuredDataTool";
import { saveKnowledgeSnippetTool } from "./tools/saveKnowledgeSnippetTool";
import { searchKnowledgeBaseTool } from "./tools/searchKnowledgeBaseTool";
import { githubFileCommentTool } from "./tools/githubFileCommentTool";
import { githubPrSummaryTool } from "./tools/githubPrSummaryTool";
import { openaiChatModel } from "../../model-provider/openai";

export const personalDevAssistantAgent = new Agent({
  name: "personalDevAssistant",
  instructions: agentInstructions,
  model: deepSeekModel,
  memory,
  tools: {
    saveStructuredData: saveStructuredDataTool,
    queryStructuredData: queryStructuredDataTool,
    saveKnowledgeSnippet: saveKnowledgeSnippetTool,
    searchKnowledgeBase: searchKnowledgeBaseTool,
    githubFileComment: githubFileCommentTool,
    githubPrSummary: githubPrSummaryTool,
  },
});