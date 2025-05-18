// 查询开发者结构化问题模式和优势
import { queryStructuredDataTool } from "./queryStructuredDataTool";

// 保存开发者结构化问题模式和优势
import { saveStructuredDataTool } from "./saveStructuredDataTool";

// 从知识库保存开发者个人知识点或解决方案
import { saveKnowledgeSnippetTool } from "./saveKnowledgeSnippetTool";

// 从知识库搜索开发者个人知识点或解决方案
import { searchKnowledgeBaseTool } from "./searchKnowledgeBaseTool";

export const mcpTools = {
  queryStructuredData: queryStructuredDataTool,
  saveStructuredData: saveStructuredDataTool,
  saveKnowledgeSnippet: saveKnowledgeSnippetTool,
  searchKnowledgeBase: searchKnowledgeBaseTool,
}