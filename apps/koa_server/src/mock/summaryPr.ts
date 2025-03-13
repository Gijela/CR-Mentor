export const mockSummaryPr = {
  "success": true,
  "data": {
    "summary": "本次PR增强了依赖分析和代码分析功能，支持多种编程语言，进行了结构重构和API更新，同时新增了Git操作类。",
    "changes": "| 文件路径             | 修改内容总结                                                                                       |\n|----------------------|-------------------------------------------------------------------------------------------------|\n| dist/index.d.ts      | 新增类型定义和接口，包括分析选项、结果及错误处理等。                                               |\n| src/core/gitAction.ts | 引入Git操作类，增加了clone和checkoutBranch方法。                                                  |\n| src/core/scanner.ts  | 增加了支持新的文件扩展名、元数据的读取、依赖分析与模块查找功能，并重构代码以提升可读性和维护性。                |\n| src/index.ts         | 重构 GitIngest 类，替换 GitHandler 为 GitAction，并引入 CodeAnalyzer，增强了依赖分析和文件扫描流程。           |",
    "sequenceDiagram": "```mermaid\nsequenceDiagram\n    participant User\n    participant GitIngest\n    User->>GitIngest: analyzeFromUrl(url)\n    GitIngest->>GitIngest: transformCustomDomainUrl(url)\n    GitIngest->>GitIngest: analyzeFromDirectory(workDir)\n    GitIngest->>FileScanner: scanDirectory(dirPath)\n    FileScanner-->>GitIngest: 文件列表\n    GitIngest->>CodeAnalyzer: analyzeCode(absolutePath, content)\n    CodeAnalyzer-->>GitIngest: 完成分析\n    GitIngest-->>User: 返回分析结果\n```"
  }
}
