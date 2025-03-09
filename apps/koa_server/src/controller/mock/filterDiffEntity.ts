export const mockFilterDiffEntity = {
  success: true,
  data: {
    entityList: [
      {
        file_path: "src/core/codeAnalyzer.ts",
        entities: [
          "CodeAnalyzer",
          "ElementType",
          "CodeElement",
          "RelationType",
          "CodeRelation",
          "KnowledgeGraph",
        ],
      },
      {
        file_path: "src/core/gitAction.ts",
        entities: ["GitAction"],
      },
      {
        file_path: "src/core/scanner.ts",
        entities: ["FileScanner"],
      },
      {
        file_path: "src/index.ts",
        entities: [
          "GitIngest",
          "AnalyzeOptions",
          "AnalysisResult",
          "GitIngestConfig",
          "FileInfo",
          "CodeAnalysis",
        ],
      },
      {
        file_path: "src/types/index.ts",
        entities: [
          "AnalyzeOptions",
          "FileInfo",
          "AnalysisResult",
          "CodeAnalysis",
          "GitIngestConfig",
        ],
      },
      {
        file_path: "src/utils/analyzeDependencies.ts",
        entities: ["analyzeDependencies"],
      },
      {
        file_path: "src/utils/graphSearch.ts",
        entities: [
          "KnowledgeNode",
          "KnowledgeEdge",
          "KnowledgeGraph",
          "SearchOptions",
          "SearchResult",
          "RelatedNodesResult",
          "findRelatedNodes",
          "searchKnowledgeGraph",
          "printGraphStats",
        ],
      },
    ],
  },
}
