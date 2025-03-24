export const diffsDetails = {
  success: true,
  data: {
    files: [
          {
              "sha": "92af228cd29f675605adc470b0aab1f6fe4cc862",
              "filename": ".cursorrules",
              "status": "added",
              "additions": 42,
              "deletions": 0,
              "changes": 42,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/.cursorrules",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/.cursorrules",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/.cursorrules?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -0,0 +1,42 @@\n+You are an expert in TypeScript, Node.js, React, Vite, TanStack Query, TanStack Router, and Tailwind.\n+\n+Response Constraints\n+- Do not remove any existing code unless necessary.\n+- Do not remove my comments or commented-out code unless necessary.\n+- Do not change the formatting of my imports.\n+- Do not change the formatting of my code unless important for new functionality.\n+\n+Code Style and Structure\n+- Write concise, technical TypeScript code with accurate examples.\n+- Use functional and declarative programming patterns; avoid classes.\n+- Prefer iteration and modularization over code duplication.\n+- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).\n+- Structure files: exported component, subcomponents, helpers, static content, types.\n+\n+Naming Conventions\n+- Use lowercase with dashes for directories (e.g., components/auth-wizard).\n+- Favor named exports for components.\n+\n+TypeScript Usage\n+- Use TypeScript for all code; prefer interfaces over types.\n+- Avoid enums; use maps instead.\n+- Use functional components with TypeScript interfaces.\n+\n+Syntax and Formatting\n+- Use the \"function\" keyword for pure functions.\n+- Use curly braces for all conditionals. Favor simplicity over cleverness.\n+- Use declarative JSX.\n+\n+UI and Styling\n+- Use Tailwind for components and styling.\n+\n+Performance Optimization\n+- Look for ways to make things faster:\n+  - Use immutable data structures\n+  - Use efficient data fetching strategies\n+  - Optimize network requests\n+  - Use efficient data structures\n+  - Use efficient algorithms\n+  - Use efficient rendering strategies\n+  - Use efficient state management\n+"
          },
          {
              "sha": "f3503388b9ff381475a7627c200564d30b36923f",
              "filename": ".env.example",
              "status": "removed",
              "additions": 0,
              "deletions": 6,
              "changes": 6,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/.env.example",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/.env.example",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/.env.example?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,6 +0,0 @@\n-# Git 代理设置\n-HTTP_PROXY=http://127.0.0.1:7890\n-HTTPS_PROXY=http://127.0.0.1:7890\n-\n-# 其他配置\n-NODE_ENV=development \n\\ No newline at end of file"
          },
          {
              "sha": "e8408c949c57f639c72a4a86d1eaf60717a304ba",
              "filename": ".gitignore",
              "status": "modified",
              "additions": 6,
              "deletions": 2,
              "changes": 8,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/.gitignore",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/.gitignore",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/.gitignore?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -2,7 +2,6 @@\n node_modules/\n \n # 构建输出\n-dist/*\n build/*\n \n # 环境变量\n@@ -40,4 +39,9 @@ coverage/\n # 本地配置文件\n .npmrc\n .yarnrc\n-.pnpmrc \n\\ No newline at end of file\n+.pnpmrc \n+\n+repo\n+# dist\n+build\n+.vercel"
          },
          {
              "sha": "9d7375375c40ba50dd7617f28011006d5fb3895b",
              "filename": "README-zh.md",
              "status": "added",
              "additions": 304,
              "deletions": 0,
              "changes": 304,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/README-zh.md",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/README-zh.md",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/README-zh.md?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -0,0 +1,304 @@\n+# Git-Analyze\n+\n+一个强大的 GitHub 代码仓库分析工具,支持代码知识图谱构建、语义化代码检索和代码结构可视化。\n+\n+## 核心特性\n+\n+- 支持从 GitHub URL 或本地目录分析代码\n+- 智能代码依赖分析,自动追踪相关文件\n+- 生成代码知识图谱,展示代码结构和关系\n+- 支持代码 Token 消耗预估\n+- 支持二进制文件过滤和大小限制\n+- 支持自定义域名映射\n+- 基于知识图谱的智能代码检索\n+- 支持语义化代码理解和关联分析\n+- 自动构建代码知识库,支持上下文相关性检索\n+- 免费开源,无需 API Key\n+\n+## 工作流程\n+\n+### 1. 代码获取\n+\n+- 支持从 GitHub URL 克隆代码\n+- 支持分析本地目录\n+- 自动处理临时文件清理\n+\n+### 2. 智能知识图谱\n+\n+系统会自动分析代码结构和依赖关系,构建知识图谱:\n+\n+- 自动识别代码实体(类、函数、变量等)\n+- 分析实体间的调用、继承、实现关系\n+- 构建语义化的代码知识网络\n+- 支持基于图谱的相关性检索\n+- 提供可视化知识图谱展示\n+\n+### 3. 依赖分析\n+\n+```151:194:src/core/scanner.ts\n+  // [依赖文件按需分析]: 分析依赖文件\n+  protected async analyzeDependencies(\n+    content: string,\n+    filePath: string,\n+    basePath: string\n+  ): Promise<string[]> {\n+    const dependencies: string[] = [];\n+    // 匹配导入路径。示例: import { Button } from '@/components/Button'\n+    const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n+\n+    // 移除多行注释\n+    const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n+    const lines = contentWithoutComments\n+      .split(\"\\n\")\n+      .filter((line) => {\n+        const trimmed = line.trim();\n+        return trimmed && !trimmed.startsWith(\"//\");\n+      })\n+      .join(\"\\n\");\n+\n+    // 匹配导入路径\n+    let match;\n+    // 遍历每一行，匹配导入路径\n+    while ((match = importRegex.exec(lines)) !== null) {\n+      // 获取导入路径。示例: import { Button } from '@/components/Button'\n+      const importPath = match[1];\n+      // 获取当前文件路径。示例: src/components/Button/index.ts\n+      const currentDir = dirname(filePath);\n+\n+      // 查找导入路径。示例: src/components/Button/index.ts\n+      const resolvedPath = await this.findModuleFile(\n+        importPath,\n+        currentDir,\n+        basePath\n+      );\n+      // 如果导入路径存在，且不在依赖列表中，则添加到依赖列表\n+      if (resolvedPath && !dependencies.includes(resolvedPath)) {\n+        dependencies.push(resolvedPath);\n+      }\n+    }\n+\n+    // 返回依赖列表。示例：['src/components/Button/index.ts', 'src/components/Input/index.ts']\n+    return dependencies;\n+  }\n+```\n+\n+### 4. 代码分析\n+\n+```71:90:src/core/codeAnalyzer.ts\n+  public analyzeCode(filePath: string, sourceCode: string): void {\n+    if (!filePath) {\n+      throw new Error('File path cannot be undefined');\n+    }\n+    this.currentFile = filePath;\n+    try {\n+      console.log(`[CodeAnalyzer] Processing file: ${filePath}`);\n+\n+      const tree = this.parser.parse(sourceCode);\n+      console.log(`[CodeAnalyzer] AST generated for ${filePath}`);\n+\n+      this.visitNode(tree.rootNode);\n+\n+      console.log(`[CodeAnalyzer] Analysis complete for ${filePath}`);\n+      console.log(`[CodeAnalyzer] Found ${this.codeElements.length} nodes`);\n+      console.log(`[CodeAnalyzer] Found ${this.relations.length} relationships`);\n+    } catch (error) {\n+      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n+    }\n+  }\n+```\n+\n+### 5. 知识图谱生成\n+\n+```382:431:src/core/codeAnalyzer.ts\n+  public getKnowledgeGraph(): KnowledgeGraph {\n+    console.log(`[Debug] Generating knowledge graph:`, {\n+      totalElements: this.codeElements.length,\n+      totalRelations: this.relations.length\n+    });\n+\n+    // 1. 先转换节点,添加 implementation 字段\n+    const nodes: KnowledgeNode[] = this.codeElements.map(element => ({\n+      id: element.id!,\n+      name: element.name,\n+      type: element.type,\n+      filePath: element.filePath,\n+      location: element.location,\n+      implementation: element.implementation || '' // 添加 implementation 字段\n+    }));\n+\n+    // 2. 验证所有关系\n+    const validRelations = this.relations.filter(relation => {\n+      const sourceExists = this.codeElements.some(e => e.id === relation.sourceId);\n+      const targetExists = this.codeElements.some(e => e.id === relation.targetId);\n+\n+      if (!sourceExists || !targetExists) {\n+        console.warn(`[Warning] Invalid relation:`, {\n+          source: relation.sourceId,\n+          target: relation.targetId,\n+          type: relation.type,\n+          sourceExists,\n+          targetExists\n+        });\n+        return false;\n+      }\n+      return true;\n+    });\n+\n+    // 3. 转换关系\n+    const edges: KnowledgeEdge[] = validRelations.map(relation => ({\n+      source: relation.sourceId,\n+      target: relation.targetId,\n+      type: relation.type,\n+      properties: {}\n+    }));\n+\n+    console.log(`[Debug] Knowledge graph generated:`, {\n+      nodes: nodes.length,\n+      edges: edges.length,\n+      relationTypes: new Set(edges.map(e => e.type))\n+    });\n+\n+    return { nodes, edges };\n+  }\n+```\n+\n+## 使用示例\n+\n+```typescript\n+import { GitIngest } from \"git-analyze\";\n+\n+// 创建实例\n+const analyzer = new GitIngest({\n+  tempDir: \"temp\",\n+  defaultMaxFileSize: 1024 * 1024, // 1MB\n+  defaultPatterns: {\n+    include: [\"**/*\"],\n+    exclude: [\"**/node_modules/**\"],\n+  },\n+});\n+\n+// 从 GitHub 分析\n+const result = await analyzer.analyzeFromUrl(\n+  \"https://github.com/username/repo\",\n+  {\n+    branch: \"main\",\n+    targetPaths: [\"src/\"],\n+  }\n+);\n+\n+// 从本地目录分析\n+const result = await analyzer.analyzeFromDirectory(\"./my-project\", {\n+  maxFileSize: 2 * 1024 * 1024,\n+  includePatterns: [\"src/**/*.ts\"],\n+});\n+\n+// 分析结果\n+console.log(result.metadata); // 项目元数据\n+console.log(result.fileTree); // 文件树结构\n+console.log(result.sizeTree); // 大小树结构\n+console.log(result.codeAnalysis); // 代码分析结果\n+\n+// 获取知识图谱\n+const graph = result.knowledgeGraph;\n+\n+// 检索相关代码\n+const searchResult = await analyzer.searchRelatedCode(\"UserService\", {\n+  maxResults: 10,\n+  includeContext: true,\n+});\n+\n+// 获取代码关系\n+const relations = await analyzer.getCodeRelations(\"src/services/user.ts\");\n+```\n+\n+## 配置选项\n+\n+### GitIngestConfig\n+\n+```75:94:src/types/index.ts\n+export interface GitIngestConfig {\n+  // 保存克隆仓库的临时目录名\n+  tempDir?: string;\n+  /* 默认检索的最大的文件 */\n+  defaultMaxFileSize?: number;\n+  /* 文件模式 */\n+  defaultPatterns?: {\n+    /* 包含的文件/目录 */\n+    include?: string[];\n+    /* 不会去检索的文件/目录 */\n+    exclude?: string[];\n+  };\n+  /* 保留克隆的仓库 */\n+  keepTempFiles?: boolean;\n+  /* 自定义域名 */\n+  customDomainMap?: {\n+    targetDomain: string;\n+    originalDomain: string;\n+  };\n+}\n+```\n+\n+### AnalyzeOptions\n+\n+```1:14:src/types/index.ts\n+export interface AnalyzeOptions {\n+  // 最大文件大小\n+  maxFileSize?: number;\n+  // 包含的文件模式\n+  includePatterns?: string[];\n+  // 排除的文件模式\n+  excludePatterns?: string[];\n+  // 目标文件路径\n+  targetPaths?: string[];\n+  // 分支\n+  branch?: string;\n+  // 提交\n+  commit?: string;\n+}\n+```\n+\n+## Token 预估算法\n+\n+工具使用智能算法预估代码 Token 消耗:\n+\n+```4:18:src/utils/index.ts\n+export function estimateTokens(text: string): number {\n+  // 1. 计算中文字符数量\n+  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n+\n+  // 2. 计算英文单词数量（包括数字和标点）\n+  const otherChars = text.length - chineseChars;\n+\n+  // 3. 计算总 token：\n+  // - 中文字符通常是 1:1 或 1:2 的比例，保守起见使用 2\n+  // - 其他字符按照 1:0.25 的比例\n+  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n+\n+  // 4. 添加 10% 的安全余量\n+  return Math.ceil(estimatedTokens * 1.1);\n+}\n+```\n+\n+## 安装\n+\n+```bash\n+npm install git-analyze\n+```\n+\n+## 许可证\n+\n+MIT\n+\n+## 技术栈\n+\n+- TypeScript\n+- tree-sitter (AST 解析)\n+- glob (文件匹配)\n+- 知识图谱算法\n+\n+## 注意事项\n+\n+1. 默认不保存临时文件,可通过 `keepTempFiles` 配置保留\n+2. 默认过滤二进制文件和 node_modules\n+3. 支持的代码文件类型: .ts, .tsx, .js, .jsx, .vue\n+4. Token 预估值包含 10% 的安全余量"
          },
          {
              "sha": "93bcd2bf22c07748bbd9e6f5c499b1c3230f92cd",
              "filename": "README.md",
              "status": "modified",
              "additions": 304,
              "deletions": 67,
              "changes": 371,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/README.md",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/README.md",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/README.md?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -1,67 +1,304 @@\n-好的，让我为您梳理当前项目已实现的功能：\n-\n-### 1. 核心分析功能\n-\n-- ✅ 支持分析 GitHub 仓库代码\n-- ✅ 支持分析本地目录代码\n-- ✅ 智能解析代码依赖关系\n-- ✅ 生成项目文件树结构\n-- ✅ 统计项目基本信息（文件数、大小、Token数等）\n-- ✅ 生成项目概要信息\n-- ✅ 分析文件类型分布\n-\n-### 2. Web 界面功能\n-\n-- ✅ RESTful API 接口\n-  - `/analyze/local` - 分析本地目录\n-  - `/analyze/github` - 分析 GitHub 仓库\n-  - `/:owner/:repo` - 直接访问 GitHub 仓库分析\n-  - `/health` - 健康检查接口\n-- ✅ 可视化展示\n-  - 项目基本信息展示\n-  - 文件树可视化\n-  - 项目概要展示\n-  - 文件内容展示\n-- ✅ 跨域支持 (CORS)\n-- ✅ 静态文件服务\n-\n-### 3. 配置功能\n-\n-- ✅ 临时文件管理\n-  - 自动清理临时文件\n-  - 可配置是否保留临时文件\n-- ✅ 文件过滤\n-  - 文件大小限制\n-  - 文件类型过滤\n-  - 自定义包含/排除模式\n-- ✅ 代理支持\n-  - HTTP 代理\n-  - HTTPS 代理\n-\n-### 4. 错误处理\n-\n-- ✅ 自定义错误类型\n-- ✅ 错误日志记录\n-- ✅ 请求日志记录\n-- ✅ 友好的错误提示\n-\n-### 5. 性能优化\n-\n-- ✅ 异步文件处理\n-- ✅ 文件大小限制（默认 500KB）\n-- ✅ 二进制文件过滤\n-- ✅ 注释和空行过滤\n-\n-### 6. 安全特性\n-\n-- ✅ 文件大小限制\n-- ✅ 路径规范化\n-- ✅ 错误信息过滤\n-\n-### 7. 开发支持\n-\n-- ✅ TypeScript 支持\n-- ✅ ESM 模块支持\n-- ✅ 完整的类型定义\n-\n-这个项目主要面向代码分析和 LLM 上下文准备，提供了完整的分析功能和友好的使用界面。\n+# Git-Analyze\n+\n+A powerful GitHub repository analysis tool that supports code knowledge graph construction, semantic code search, and code structure visualization.\n+\n+## Core Features\n+\n+- Support code analysis from GitHub URL or local directory\n+- Intelligent code dependency analysis with automatic file tracking\n+- Generate code knowledge graphs showing code structure and relationships\n+- Support code token consumption estimation\n+- Support binary file filtering and size limits\n+- Support custom domain mapping\n+- Intelligent code search based on knowledge graphs\n+- Support semantic code understanding and relationship analysis\n+- Automatically build code knowledge base with contextual relevance search\n+- Free and open source, no API key required\n+\n+## Workflow\n+\n+### 1. Code Acquisition\n+\n+- Support cloning code from GitHub URL\n+- Support analyzing local directories\n+- Automatic temporary file cleanup\n+\n+### 2. Intelligent Knowledge Graph\n+\n+The system automatically analyzes code structure and dependencies to build a knowledge graph:\n+\n+- Automatic identification of code entities (classes, functions, variables, etc.)\n+- Analysis of entity relationships (calls, inheritance, implementation)\n+- Construction of semantic code knowledge network\n+- Support for relevance-based search using the graph\n+- Provide visualization of the knowledge graph\n+\n+### 3. Dependency Analysis\n+\n+```151:194:src/core/scanner.ts\n+  // [Analyze dependencies as needed]: Analyze dependent files\n+  protected async analyzeDependencies(\n+    content: string,\n+    filePath: string,\n+    basePath: string\n+  ): Promise<string[]> {\n+    const dependencies: string[] = [];\n+    // Match import paths. Example: import { Button } from '@/components/Button'\n+    const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n+\n+    // Remove multi-line comments\n+    const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n+    const lines = contentWithoutComments\n+      .split(\"\\n\")\n+      .filter((line) => {\n+        const trimmed = line.trim();\n+        return trimmed && !trimmed.startsWith(\"//\");\n+      })\n+      .join(\"\\n\");\n+\n+    // Match import paths\n+    let match;\n+    // Iterate through each line, matching import paths\n+    while ((match = importRegex.exec(lines)) !== null) {\n+      // Get import path. Example: import { Button } from '@/components/Button'\n+      const importPath = match[1];\n+      // Get current file path. Example: src/components/Button/index.ts\n+      const currentDir = dirname(filePath);\n+\n+      // Find import path. Example: src/components/Button/index.ts\n+      const resolvedPath = await this.findModuleFile(\n+        importPath,\n+        currentDir,\n+        basePath\n+      );\n+      // If import path exists and not in dependencies list, add it\n+      if (resolvedPath && !dependencies.includes(resolvedPath)) {\n+        dependencies.push(resolvedPath);\n+      }\n+    }\n+\n+    // Return dependencies list. Example: ['src/components/Button/index.ts', 'src/components/Input/index.ts']\n+    return dependencies;\n+  }\n+```\n+\n+### 4. Code Analysis\n+\n+```71:90:src/core/codeAnalyzer.ts\n+  public analyzeCode(filePath: string, sourceCode: string): void {\n+    if (!filePath) {\n+      throw new Error('File path cannot be undefined');\n+    }\n+    this.currentFile = filePath;\n+    try {\n+      console.log(`[CodeAnalyzer] Processing file: ${filePath}`);\n+\n+      const tree = this.parser.parse(sourceCode);\n+      console.log(`[CodeAnalyzer] AST generated for ${filePath}`);\n+\n+      this.visitNode(tree.rootNode);\n+\n+      console.log(`[CodeAnalyzer] Analysis complete for ${filePath}`);\n+      console.log(`[CodeAnalyzer] Found ${this.codeElements.length} nodes`);\n+      console.log(`[CodeAnalyzer] Found ${this.relations.length} relationships`);\n+    } catch (error) {\n+      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n+    }\n+  }\n+```\n+\n+### 5. Knowledge Graph Generation\n+\n+```382:431:src/core/codeAnalyzer.ts\n+  public getKnowledgeGraph(): KnowledgeGraph {\n+    console.log(`[Debug] Generating knowledge graph:`, {\n+      totalElements: this.codeElements.length,\n+      totalRelations: this.relations.length\n+    });\n+\n+    // 1. First convert nodes, add implementation field\n+    const nodes: KnowledgeNode[] = this.codeElements.map(element => ({\n+      id: element.id!,\n+      name: element.name,\n+      type: element.type,\n+      filePath: element.filePath,\n+      location: element.location,\n+      implementation: element.implementation || '' // Add implementation field\n+    }));\n+\n+    // 2. Validate all relationships\n+    const validRelations = this.relations.filter(relation => {\n+      const sourceExists = this.codeElements.some(e => e.id === relation.sourceId);\n+      const targetExists = this.codeElements.some(e => e.id === relation.targetId);\n+\n+      if (!sourceExists || !targetExists) {\n+        console.warn(`[Warning] Invalid relation:`, {\n+          source: relation.sourceId,\n+          target: relation.targetId,\n+          type: relation.type,\n+          sourceExists,\n+          targetExists\n+        });\n+        return false;\n+      }\n+      return true;\n+    });\n+\n+    // 3. Convert relationships\n+    const edges: KnowledgeEdge[] = validRelations.map(relation => ({\n+      source: relation.sourceId,\n+      target: relation.targetId,\n+      type: relation.type,\n+      properties: {}\n+    }));\n+\n+    console.log(`[Debug] Knowledge graph generated:`, {\n+      nodes: nodes.length,\n+      edges: edges.length,\n+      relationTypes: new Set(edges.map(e => e.type))\n+    });\n+\n+    return { nodes, edges };\n+  }\n+```\n+\n+## Usage Example\n+\n+```typescript\n+import { GitIngest } from \"git-analyze\";\n+\n+// Create instance\n+const analyzer = new GitIngest({\n+  tempDir: \"temp\",\n+  defaultMaxFileSize: 1024 * 1024, // 1MB\n+  defaultPatterns: {\n+    include: [\"**/*\"],\n+    exclude: [\"**/node_modules/**\"],\n+  },\n+});\n+\n+// Analyze from GitHub\n+const result = await analyzer.analyzeFromUrl(\n+  \"https://github.com/username/repo\",\n+  {\n+    branch: \"main\",\n+    targetPaths: [\"src/\"],\n+  }\n+);\n+\n+// Analyze from local directory\n+const result = await analyzer.analyzeFromDirectory(\"./my-project\", {\n+  maxFileSize: 2 * 1024 * 1024,\n+  includePatterns: [\"src/**/*.ts\"],\n+});\n+\n+// Analysis results\n+console.log(result.metadata); // Project metadata\n+console.log(result.fileTree); // File tree structure\n+console.log(result.sizeTree); // Size tree structure\n+console.log(result.codeAnalysis); // Code analysis results\n+\n+// Get knowledge graph\n+const graph = result.knowledgeGraph;\n+\n+// Search related code\n+const searchResult = await analyzer.searchRelatedCode(\"UserService\", {\n+  maxResults: 10,\n+  includeContext: true,\n+});\n+\n+// Get code relationships\n+const relations = await analyzer.getCodeRelations(\"src/services/user.ts\");\n+```\n+\n+## Configuration Options\n+\n+### GitIngestConfig\n+\n+```75:94:src/types/index.ts\n+export interface GitIngestConfig {\n+  // Temporary directory name for storing cloned repositories\n+  tempDir?: string;\n+  /* Maximum file size for scanning */\n+  defaultMaxFileSize?: number;\n+  /* File patterns */\n+  defaultPatterns?: {\n+    /* Files/directories to include */\n+    include?: string[];\n+    /* Files/directories to exclude from scanning */\n+    exclude?: string[];\n+  };\n+  /* Keep cloned repositories */\n+  keepTempFiles?: boolean;\n+  /* Custom domain mapping */\n+  customDomainMap?: {\n+    targetDomain: string;\n+    originalDomain: string;\n+  };\n+}\n+```\n+\n+### AnalyzeOptions\n+\n+```1:14:src/types/index.ts\n+export interface AnalyzeOptions {\n+  // Maximum file size\n+  maxFileSize?: number;\n+  // Include file patterns\n+  includePatterns?: string[];\n+  // Exclude file patterns\n+  excludePatterns?: string[];\n+  // Target file paths\n+  targetPaths?: string[];\n+  // Branch\n+  branch?: string;\n+  // Commit\n+  commit?: string;\n+}\n+```\n+\n+## Token Estimation Algorithm\n+\n+The tool uses a smart algorithm to estimate code token consumption:\n+\n+```4:18:src/utils/index.ts\n+export function estimateTokens(text: string): number {\n+  // 1. Calculate Chinese character count\n+  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n+\n+  // 2. Calculate English word count (including numbers and punctuation)\n+  const otherChars = text.length - chineseChars;\n+\n+  // 3. Calculate total tokens:\n+  // - Chinese characters typically have a 1:1 or 1:2 ratio, conservatively using 2\n+  // - Other characters use a 1:0.25 ratio\n+  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n+\n+  // 4. Add 10% safety margin\n+  return Math.ceil(estimatedTokens * 1.1);\n+}\n+```\n+\n+## Installation\n+\n+```bash\n+npm install git-analyze\n+```\n+\n+## License\n+\n+MIT\n+\n+## Tech Stack\n+\n+- TypeScript\n+- tree-sitter (AST parsing)\n+- glob (file matching)\n+- Knowledge graph algorithms\n+\n+## Notes\n+\n+1. Temporary files are not saved by default, can be retained via `keepTempFiles` configuration\n+2. Binary files and node_modules are filtered by default\n+3. Supported code file types: .ts, .tsx, .js, .jsx, .vue\n+4. Token estimates include a 10% safety margin"
          },
          {
              "sha": "4736d21618b76d6baf6cc816dd227d5c2eebc34d",
              "filename": "dist/index.d.ts",
              "status": "added",
              "additions": 134,
              "deletions": 0,
              "changes": 134,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/dist%2Findex.d.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/dist%2Findex.d.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/dist%2Findex.d.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -0,0 +1,134 @@\n+interface AnalyzeOptions {\n+    maxFileSize?: number;\n+    includePatterns?: string[];\n+    excludePatterns?: string[];\n+    targetPaths?: string[];\n+    branch?: string;\n+    commit?: string;\n+    miniCommonRoot?: string;\n+}\n+interface FileInfo {\n+    path: string;\n+    content: string;\n+    token: number;\n+}\n+interface AnalysisResult {\n+    metadata: {\n+        files: number;\n+        tokens: number;\n+    };\n+    fileTree: string;\n+    totalCode: {\n+        path: string;\n+        content: string;\n+        token: number;\n+    }[];\n+    sizeTree: {\n+        name: string;\n+        token: number;\n+        isFile: boolean;\n+        children?: {\n+            [key: string]: {\n+                name: string;\n+                token: number;\n+                children?: any;\n+                isFile: boolean;\n+            };\n+        };\n+    };\n+    codeAnalysis: CodeAnalysis;\n+    dependencyGraph: any;\n+}\n+interface CodeAnalysis {\n+    codeIndex: Map<string, any[]>;\n+    knowledgeGraph: {\n+        nodes: any[];\n+        edges: any[];\n+    };\n+}\n+interface GitIngestConfig {\n+    tempDir?: string;\n+    defaultMaxFileSize?: number;\n+    defaultPatterns?: {\n+        include?: string[];\n+        exclude?: string[];\n+    };\n+    keepTempFiles?: boolean;\n+    customDomainMap?: {\n+        targetDomain: string;\n+        originalDomain: string;\n+    };\n+}\n+\n+declare class GitIngestError extends Error {\n+    constructor(message: string);\n+}\n+declare class GitOperationError extends GitIngestError {\n+    constructor(operation: string, details: string);\n+}\n+declare class ValidationError extends GitIngestError {\n+    constructor(message: string);\n+}\n+\n+interface KnowledgeNode {\n+    id: string;\n+    name: string;\n+    type: string;\n+    filePath: string;\n+    location: {\n+        file: string;\n+        line: number;\n+    };\n+    description?: string;\n+    properties?: Record<string, any>;\n+    implementation?: string;\n+}\n+interface KnowledgeEdge {\n+    source: string;\n+    target: string;\n+    type: string;\n+    properties?: Record<string, any>;\n+}\n+interface KnowledgeGraph {\n+    nodes: KnowledgeNode[];\n+    edges: KnowledgeEdge[];\n+}\n+interface SearchOptions {\n+    entities: string[];\n+    relationTypes?: string[];\n+    maxDistance?: number;\n+    limit?: number;\n+}\n+interface SearchResult {\n+    nodes: KnowledgeNode[];\n+    edges: KnowledgeEdge[];\n+    metadata: {\n+        totalNodes: number;\n+        totalEdges: number;\n+        entities: string[];\n+        relationTypes: string[];\n+        maxDistance: number;\n+    };\n+}\n+/**\n+ * 基于实体名称列表搜索关联的知识图谱\n+ * @param graph 知识图谱\n+ * @param options 搜索选项\n+ * @returns 搜索结果\n+ */\n+declare function searchKnowledgeGraph(graph: KnowledgeGraph, options: SearchOptions): SearchResult;\n+\n+declare class GitIngest {\n+    private git;\n+    private scanner;\n+    private analyzer;\n+    private config;\n+    constructor(config?: GitIngestConfig);\n+    private cleanupTempDir;\n+    private transformCustomDomainUrl;\n+    private isCustomDomainUrl;\n+    analyzeFromUrl(url: string, options?: AnalyzeOptions): Promise<AnalysisResult>;\n+    analyzeFromDirectory(dirPath: string, options?: AnalyzeOptions): Promise<AnalysisResult>;\n+}\n+\n+export { type AnalysisResult, type AnalyzeOptions, type CodeAnalysis, type FileInfo, GitIngest, type GitIngestConfig, GitIngestError, GitOperationError, type KnowledgeEdge, type KnowledgeGraph, type KnowledgeNode, type SearchOptions, type SearchResult, ValidationError, searchKnowledgeGraph };"
          },
          {
              "sha": "5fe06b590be8f7ca2344d63a40a045eacf7dcd38",
              "filename": "dist/index.js",
              "status": "added",
              "additions": 1205,
              "deletions": 0,
              "changes": 1205,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/dist%2Findex.js",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/dist%2Findex.js",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/dist%2Findex.js?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -0,0 +1,1205 @@\n+var __defProp = Object.defineProperty;\n+var __defProps = Object.defineProperties;\n+var __getOwnPropDescs = Object.getOwnPropertyDescriptors;\n+var __getOwnPropSymbols = Object.getOwnPropertySymbols;\n+var __hasOwnProp = Object.prototype.hasOwnProperty;\n+var __propIsEnum = Object.prototype.propertyIsEnumerable;\n+var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;\n+var __spreadValues = (a, b) => {\n+  for (var prop in b || (b = {}))\n+    if (__hasOwnProp.call(b, prop))\n+      __defNormalProp(a, prop, b[prop]);\n+  if (__getOwnPropSymbols)\n+    for (var prop of __getOwnPropSymbols(b)) {\n+      if (__propIsEnum.call(b, prop))\n+        __defNormalProp(a, prop, b[prop]);\n+    }\n+  return a;\n+};\n+var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));\n+var __async = (__this, __arguments, generator) => {\n+  return new Promise((resolve, reject) => {\n+    var fulfilled = (value) => {\n+      try {\n+        step(generator.next(value));\n+      } catch (e) {\n+        reject(e);\n+      }\n+    };\n+    var rejected = (value) => {\n+      try {\n+        step(generator.throw(value));\n+      } catch (e) {\n+        reject(e);\n+      }\n+    };\n+    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);\n+    step((generator = generator.apply(__this, __arguments)).next());\n+  });\n+};\n+\n+// src/core/gitAction.ts\n+import { simpleGit } from \"simple-git\";\n+\n+// src/core/errors.ts\n+var GitIngestError = class extends Error {\n+  constructor(message) {\n+    super(message);\n+    this.name = \"GitIngestError\";\n+  }\n+};\n+var GitOperationError = class extends GitIngestError {\n+  constructor(operation, details) {\n+    super(`Git operation '${operation}' failed: ${details}`);\n+    this.name = \"GitOperationError\";\n+  }\n+};\n+var FileProcessError = class extends GitIngestError {\n+  constructor(path3, reason) {\n+    super(`Failed to process file '${path3}': ${reason}`);\n+    this.name = \"FileProcessError\";\n+  }\n+};\n+var ValidationError = class extends GitIngestError {\n+  constructor(message) {\n+    super(`Validation failed: ${message}`);\n+    this.name = \"ValidationError\";\n+  }\n+};\n+\n+// src/core/gitAction.ts\n+var GitAction = class {\n+  constructor() {\n+    this.git = simpleGit({ baseDir: process.cwd() });\n+  }\n+  clone(url, path3) {\n+    return __async(this, null, function* () {\n+      try {\n+        yield this.git.clone(url, path3);\n+      } catch (error) {\n+        throw new GitOperationError(\"clone\", error.message);\n+      }\n+    });\n+  }\n+  checkoutBranch(path3, branch) {\n+    return __async(this, null, function* () {\n+      try {\n+        const git = simpleGit(path3);\n+        yield git.checkout(branch);\n+      } catch (error) {\n+        throw new GitOperationError(\"checkout\", error.message);\n+      }\n+    });\n+  }\n+};\n+\n+// src/core/scanner.ts\n+import { glob } from \"glob\";\n+import { readFile, stat } from \"fs/promises\";\n+import { dirname, join } from \"path\";\n+\n+// src/utils/graphSearch.ts\n+function findRelatedNodes(graph, startNodes, maxDistance) {\n+  const relatedNodes = /* @__PURE__ */ new Set();\n+  const relatedEdges = /* @__PURE__ */ new Set();\n+  const processedNodeIds = /* @__PURE__ */ new Set();\n+  function processNode(node, distance) {\n+    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n+    processedNodeIds.add(node.id);\n+    relatedNodes.add(node);\n+    const directEdges = graph.edges.filter(\n+      (edge) => edge.source === node.id || edge.target === node.id\n+    );\n+    directEdges.forEach((edge) => {\n+      relatedEdges.add(edge);\n+      const otherId = edge.source === node.id ? edge.target : edge.source;\n+      const otherNode = graph.nodes.find((n) => n.id === otherId);\n+      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n+        processNode(otherNode, distance + 1);\n+      }\n+    });\n+    if (node.type === \"class\") {\n+      const methodNodes = graph.nodes.filter((n) => {\n+        if (n.type !== \"function\" && n.type !== \"class_method\") return false;\n+        if (n.filePath !== node.filePath) return false;\n+        if (n.name === \"constructor\") return false;\n+        const classNode = graph.nodes.find(\n+          (c) => c.type === \"class\" && c.filePath === n.filePath && c.id === n.id.split(\"#\")[0] + \"#\" + node.name\n+        );\n+        return classNode !== void 0;\n+      });\n+      methodNodes.forEach((methodNode) => {\n+        if (!processedNodeIds.has(methodNode.id)) {\n+          const edge = {\n+            source: node.id,\n+            target: methodNode.id,\n+            type: \"defines\",\n+            properties: {}\n+          };\n+          relatedEdges.add(edge);\n+          processNode(methodNode, distance + 1);\n+        }\n+      });\n+    }\n+    if (node.type === \"class\" && node.name.endsWith(\"Error\")) {\n+      const parentNode = graph.nodes.find((n) => n.name === \"Error\");\n+      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n+        const edge = {\n+          source: node.id,\n+          target: \"Error\",\n+          type: \"extends\",\n+          properties: {}\n+        };\n+        relatedEdges.add(edge);\n+        processNode(parentNode, distance + 1);\n+      }\n+    }\n+  }\n+  startNodes.forEach((node) => processNode(node, 0));\n+  return {\n+    nodes: Array.from(relatedNodes),\n+    edges: Array.from(relatedEdges)\n+  };\n+}\n+function searchKnowledgeGraph(graph, options) {\n+  const { entities, maxDistance = 2 } = options;\n+  const startNodes = graph.nodes.filter(\n+    (node) => entities.some((entity) => node.name === entity)\n+  );\n+  if (!startNodes.length) {\n+    console.warn(`[Warning] No nodes found for entities:`, entities);\n+    return {\n+      nodes: [],\n+      edges: [],\n+      metadata: {\n+        totalNodes: 0,\n+        totalEdges: 0,\n+        entities,\n+        relationTypes: [],\n+        maxDistance\n+      }\n+    };\n+  }\n+  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance);\n+  const methodNodes = nodes.filter((n) => n.type === \"function\" || n.type === \"class_method\");\n+  const classNodes = nodes.filter((n) => n.type === \"class\");\n+  methodNodes.forEach((method) => {\n+    const className = method.id.split(\"#\")[1];\n+    const relatedClass = classNodes.find((c) => c.name === className);\n+    if (relatedClass) {\n+      edges.push({\n+        source: relatedClass.id,\n+        target: method.id,\n+        type: \"defines\",\n+        properties: {}\n+      });\n+    }\n+  });\n+  const errorClasses = classNodes.filter((n) => n.name.endsWith(\"Error\"));\n+  errorClasses.forEach((errorClass) => {\n+    edges.push({\n+      source: errorClass.id,\n+      target: \"Error\",\n+      type: \"extends\",\n+      properties: {}\n+    });\n+  });\n+  return {\n+    nodes,\n+    edges,\n+    metadata: {\n+      totalNodes: nodes.length,\n+      totalEdges: edges.length,\n+      entities,\n+      relationTypes: Array.from(new Set(edges.map((e) => e.type))),\n+      maxDistance\n+    }\n+  };\n+}\n+\n+// src/utils/index.ts\n+function estimateTokens(text) {\n+  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n+  const otherChars = text.length - chineseChars;\n+  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n+  return Math.ceil(estimatedTokens * 1.1);\n+}\n+function generateTree(files) {\n+  const tree = {};\n+  for (const file of files) {\n+    const parts = file.path.split(\"/\");\n+    let current = tree;\n+    for (const part of parts.slice(0, -1)) {\n+      if (!current[part]) {\n+        current[part] = {};\n+      }\n+      current = current[part];\n+    }\n+    current[parts[parts.length - 1]] = null;\n+  }\n+  function stringify(node, prefix = \"\") {\n+    let result = \"\";\n+    const entries = Object.entries(node);\n+    for (let i = 0; i < entries.length; i++) {\n+      const [key, value] = entries[i];\n+      const isLast = i === entries.length - 1;\n+      const connector = isLast ? \"\\u2514\\u2500\\u2500 \" : \"\\u251C\\u2500\\u2500 \";\n+      const childPrefix = isLast ? \"    \" : \"\\u2502   \";\n+      result += prefix + connector + key + \"\\n\";\n+      if (value !== null) {\n+        result += stringify(value, prefix + childPrefix);\n+      }\n+    }\n+    return result;\n+  }\n+  return stringify(tree);\n+}\n+function buildSizeTree(files) {\n+  const root = {\n+    name: \"root\",\n+    token: 0,\n+    children: {},\n+    isFile: false\n+  };\n+  for (const file of files) {\n+    const parts = file.path.split(\"/\");\n+    let current = root;\n+    for (let i = 0; i < parts.length; i++) {\n+      const part = parts[i];\n+      const isLastPart = i === parts.length - 1;\n+      if (!current.children[part]) {\n+        current.children[part] = __spreadProps(__spreadValues({\n+          name: part,\n+          token: isLastPart ? file.token : 0\n+        }, isLastPart && file.content ? { content: file.content } : {}), {\n+          children: {},\n+          isFile: isLastPart\n+        });\n+      }\n+      current = current.children[part];\n+    }\n+  }\n+  function calculateSize(node) {\n+    if (node.isFile) {\n+      return node.token;\n+    }\n+    let totalToken = 0;\n+    for (const child of Object.values(node.children)) {\n+      totalToken += calculateSize(child);\n+    }\n+    node.token = totalToken;\n+    return totalToken;\n+  }\n+  calculateSize(root);\n+  return root;\n+}\n+\n+// src/core/scanner.ts\n+var BINARY_FILE_TYPES = [\n+  \".jpg\",\n+  \".jpeg\",\n+  \".png\",\n+  \".gif\",\n+  \".bmp\",\n+  \".pdf\",\n+  \".doc\",\n+  \".docx\",\n+  \".xls\",\n+  \".xlsx\",\n+  \".zip\",\n+  \".rar\",\n+  \".7z\",\n+  \".tar\",\n+  \".gz\",\n+  \".exe\",\n+  \".dll\",\n+  \".so\",\n+  \".dylib\",\n+  \".svg\",\n+  \".ico\",\n+  \".webp\",\n+  \".mp4\",\n+  \".mp3\",\n+  \".wav\",\n+  \".avi\"\n+];\n+var FileScanner = class {\n+  constructor() {\n+    this.processedFiles = /* @__PURE__ */ new Set();\n+  }\n+  // 查找模块文件\n+  findModuleFile(importPath, currentDir, basePath) {\n+    return __async(this, null, function* () {\n+      if (!importPath.startsWith(\".\")) {\n+        return importPath;\n+      }\n+      const cleanCurrentDir = currentDir.replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\").replace(new RegExp(`^${basePath}/`), \"\");\n+      const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n+      const pathParts = resolvedPath.split(\"/\");\n+      const fileName = pathParts.pop() || \"\";\n+      const dirPath = pathParts.join(\"/\");\n+      const getExtensions = (importName) => {\n+        if (importName.toLowerCase().endsWith(\".css\")) {\n+          return [\".css\", \".less\", \".scss\", \".sass\"];\n+        }\n+        return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n+      };\n+      const extensions = getExtensions(fileName);\n+      const targetBasePath = join(basePath, dirPath);\n+      if (!fileName.includes(\".\")) {\n+        for (const ext of extensions) {\n+          const fullPath = join(targetBasePath, fileName + ext);\n+          try {\n+            const stats = yield stat(fullPath);\n+            if (stats.isFile()) {\n+              return join(dirPath, fileName + ext).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n+            }\n+          } catch (error) {\n+            continue;\n+          }\n+        }\n+        const dirFullPath = join(targetBasePath, fileName);\n+        try {\n+          const stats = yield stat(dirFullPath);\n+          if (stats.isDirectory()) {\n+            for (const ext of extensions) {\n+              const indexPath = join(dirFullPath, \"index\" + ext);\n+              try {\n+                const indexStats = yield stat(indexPath);\n+                if (indexStats.isFile()) {\n+                  return join(dirPath, fileName, \"index\" + ext).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n+                }\n+              } catch (error) {\n+                continue;\n+              }\n+            }\n+          }\n+        } catch (error) {\n+        }\n+      } else {\n+        const fullPath = join(targetBasePath, fileName);\n+        try {\n+          const stats = yield stat(fullPath);\n+          if (stats.isFile()) {\n+            return join(dirPath, fileName).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n+          }\n+        } catch (error) {\n+        }\n+      }\n+      return null;\n+    });\n+  }\n+  // [依赖文件按需分析]: 分析依赖文件\n+  analyzeDependencies(content, filePath, basePath) {\n+    return __async(this, null, function* () {\n+      const dependencies = [];\n+      const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n+      const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n+      const lines = contentWithoutComments.split(\"\\n\").filter((line) => {\n+        const trimmed = line.trim();\n+        return trimmed && !trimmed.startsWith(\"//\");\n+      }).join(\"\\n\");\n+      let match;\n+      while ((match = importRegex.exec(lines)) !== null) {\n+        const importPath = match[1];\n+        const currentDir = dirname(filePath);\n+        const resolvedPath = yield this.findModuleFile(\n+          importPath,\n+          currentDir,\n+          basePath\n+        );\n+        if (resolvedPath && !dependencies.includes(resolvedPath)) {\n+          dependencies.push(resolvedPath);\n+        }\n+      }\n+      return dependencies;\n+    });\n+  }\n+  // 扫描目录\n+  scanDirectory(path3, options) {\n+    return __async(this, null, function* () {\n+      if (!path3) {\n+        throw new ValidationError(\"Path is required\");\n+      }\n+      try {\n+        this.processedFiles.clear();\n+        const allFiles = [];\n+        if (options.targetPaths && options.targetPaths.length > 0) {\n+          for (const targetPath of options.targetPaths) {\n+            yield this.processFileAndDependencies(\n+              path3,\n+              targetPath,\n+              options,\n+              allFiles\n+            );\n+          }\n+          return allFiles;\n+        }\n+        const files = yield glob(\"**/*\", {\n+          cwd: path3,\n+          ignore: [\n+            ...options.excludePatterns || [],\n+            \"**/node_modules/**\",\n+            \"**/.git/**\"\n+          ],\n+          nodir: true,\n+          absolute: false,\n+          windowsPathsNoEscape: true\n+        });\n+        const results = yield Promise.all(\n+          files.map((file) => this.processFile(path3, file, options))\n+        );\n+        return results.filter((file) => file !== null);\n+      } catch (error) {\n+        throw new FileProcessError(path3, error.message);\n+      }\n+    });\n+  }\n+  // 扫描目标文件及其依赖文件\n+  processFileAndDependencies(basePath, relativePath, options, allFiles) {\n+    return __async(this, null, function* () {\n+      if (this.processedFiles.has(relativePath)) {\n+        return;\n+      }\n+      const fileInfo = yield this.processFile(basePath, relativePath, options);\n+      if (fileInfo) {\n+        this.processedFiles.add(relativePath);\n+        allFiles.push(fileInfo);\n+        if (options.includeDependencies !== false) {\n+          const dependencies = yield this.analyzeDependencies(\n+            fileInfo.content,\n+            relativePath,\n+            basePath\n+          );\n+          for (const dep of dependencies) {\n+            yield this.processFileAndDependencies(\n+              basePath,\n+              dep,\n+              options,\n+              allFiles\n+            );\n+          }\n+        }\n+      }\n+    });\n+  }\n+  // 尝试查找文件\n+  tryFindFile(basePath, filePath, options) {\n+    return __async(this, null, function* () {\n+      try {\n+        const stats = yield stat(filePath);\n+        if (options.maxFileSize && stats.size > options.maxFileSize) {\n+          return null;\n+        }\n+        const content = yield readFile(filePath, \"utf-8\");\n+        const basePathParts = basePath.split(\"/\");\n+        const deleteHashRepoName = basePathParts[basePathParts.length - 1].replace(/-[^-]*$/, \"\");\n+        const relativePath = filePath.replace(new RegExp(`^${basePathParts[0]}/`), \"\").replace(\n+          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n+          deleteHashRepoName\n+        ).replace(/\\\\/g, \"/\");\n+        return {\n+          path: relativePath,\n+          content,\n+          // size: stats.size,\n+          token: estimateTokens(content)\n+        };\n+      } catch (error) {\n+        return null;\n+      }\n+    });\n+  }\n+  // 扫描文件\n+  processFile(basePath, relativePath, options) {\n+    return __async(this, null, function* () {\n+      try {\n+        const ext = relativePath.toLowerCase().split(\".\").pop();\n+        if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n+          return null;\n+        }\n+        const normalizedPath = relativePath.replace(/^[\\/\\\\]+/, \"\").replace(/\\\\/g, \"/\");\n+        const pathParts = normalizedPath.split(\"/\");\n+        const fileName = pathParts.pop() || \"\";\n+        const dirPath = pathParts.join(\"/\");\n+        const targetBasePath = join(basePath, dirPath);\n+        const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n+        if (!fileName.includes(\".\")) {\n+          for (const ext2 of extensions) {\n+            const fullPath = join(targetBasePath, fileName + ext2);\n+            const result = yield this.tryFindFile(basePath, fullPath, options);\n+            if (result) return result;\n+          }\n+          const dirFullPath = join(targetBasePath, fileName);\n+          for (const ext2 of extensions) {\n+            const indexPath = join(dirFullPath, \"index\" + ext2);\n+            const result = yield this.tryFindFile(basePath, indexPath, options);\n+            if (result) return result;\n+          }\n+        } else {\n+          const fullPath = join(targetBasePath, fileName);\n+          const result = yield this.tryFindFile(basePath, fullPath, options);\n+          if (result) return result;\n+        }\n+        return null;\n+      } catch (error) {\n+        console.warn(`Warning: Failed to process file ${relativePath}: ${error}`);\n+        return null;\n+      }\n+    });\n+  }\n+};\n+\n+// src/core/codeAnalyzer.ts\n+import Parser from \"tree-sitter\";\n+import TypeScript from \"tree-sitter-typescript\";\n+import path from \"path\";\n+var CodeAnalyzer = class {\n+  constructor() {\n+    this.codeElements = [];\n+    this.relations = [];\n+    this.currentFile = \"\";\n+    this.currentClass = null;\n+    this.currentFunctionId = null;\n+    this.scopeStack = [];\n+    this.parser = new Parser();\n+    this.parser.setLanguage(TypeScript.typescript);\n+  }\n+  /**\n+   * 分析代码文件\n+   */\n+  analyzeCode(filePath, sourceCode) {\n+    if (!filePath) {\n+      throw new Error(\"File path cannot be undefined\");\n+    }\n+    this.currentFile = filePath;\n+    try {\n+      const tree = this.parser.parse(sourceCode);\n+      this.visitNode(tree.rootNode);\n+    } catch (error) {\n+      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n+    }\n+  }\n+  /**\n+   * 访问 AST 节点\n+   */\n+  visitNode(node) {\n+    switch (node.type) {\n+      case \"function_declaration\":\n+      case \"method_definition\":\n+      // 添加方法定义\n+      case \"arrow_function\":\n+        this.analyzeFunctionDeclaration(node);\n+        break;\n+      case \"class_declaration\":\n+      case \"class\":\n+        this.analyzeClassDeclaration(node, this.currentFile);\n+        break;\n+      case \"interface_declaration\":\n+        this.analyzeInterface(node);\n+        break;\n+      case \"type_alias_declaration\":\n+        this.analyzeTypeAlias(node);\n+        break;\n+      case \"call_expression\":\n+      case \"new_expression\":\n+        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n+        break;\n+      case \"import_declaration\":\n+      case \"import_statement\":\n+        this.analyzeImportStatement(node, this.currentFile);\n+        break;\n+      case \"variable_declaration\":\n+        this.analyzeVariableDeclaration(node);\n+        break;\n+      case \"implements_clause\":\n+        this.analyzeImplementsRelation(node);\n+        break;\n+    }\n+    for (const child of node.children) {\n+      this.visitNode(child);\n+    }\n+  }\n+  /**\n+   * 分析函数声明\n+   */\n+  analyzeFunctionDeclaration(node) {\n+    const nameNode = node.childForFieldName(\"name\");\n+    if (!nameNode) return;\n+    const element = {\n+      type: \"function\",\n+      name: nameNode.text,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: nameNode.startPosition.row + 1\n+      },\n+      implementation: node.text\n+    };\n+    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n+    this.scopeStack.push(this.currentFunctionId);\n+    this.addCodeElement(element);\n+    this.currentFunctionId = null;\n+  }\n+  /**\n+   * 分析类声明\n+   */\n+  analyzeClassDeclaration(node, filePath) {\n+    const className = this.getNodeName(node);\n+    if (!className) return;\n+    const classElement = {\n+      type: \"class\",\n+      name: className,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: node.startPosition.row + 1\n+      },\n+      implementation: node.text\n+    };\n+    this.addCodeElement(classElement);\n+    this.currentClass = className;\n+    const extendsClause = node.childForFieldName(\"extends\");\n+    if (extendsClause) {\n+      const superClassName = this.getNodeName(extendsClause);\n+      if (superClassName) {\n+        const currentClassId = `${this.currentFile}#${className}`;\n+        const superClassId = this.resolveTypeReference(superClassName);\n+        if (superClassId) {\n+          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n+          this.addRelation(currentClassId, superClassId, \"extends\");\n+        }\n+      }\n+    }\n+    for (const child of node.children) {\n+      if (child.type === \"method_definition\" || child.type === \"constructor\") {\n+        this.analyzeClassMethod(child, className);\n+      }\n+    }\n+    const implementsClause = node.childForFieldName(\"implements\");\n+    if (implementsClause) {\n+      this.analyzeImplementsRelation(implementsClause);\n+    }\n+    this.currentClass = null;\n+  }\n+  /**\n+   * 分析接口声明\n+   */\n+  analyzeInterface(node) {\n+    const nameNode = node.childForFieldName(\"name\");\n+    if (!nameNode) return;\n+    const element = {\n+      type: \"interface\",\n+      name: nameNode.text,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: nameNode.startPosition.row + 1\n+      },\n+      id: `${this.currentFile}#Interface#${nameNode.text}`,\n+      implementation: node.text\n+    };\n+    this.addCodeElement(element);\n+  }\n+  /**\n+   * 分析函数调用\n+   */\n+  analyzeCallExpression(node, currentScope) {\n+    const calleeName = this.resolveCallee(node);\n+    if (calleeName) {\n+      const currentNode = this.codeElements.find((e) => e.id === currentScope);\n+      const calleeNode = this.codeElements.find((e) => e.id === calleeName);\n+      if (currentNode && calleeNode) {\n+        this.addRelation(currentScope, calleeName, \"calls\");\n+      }\n+    }\n+  }\n+  /**\n+   * 分析导入声明\n+   */\n+  analyzeImportStatement(node, filePath) {\n+    const importPath = this.getImportPath(node);\n+    if (importPath) {\n+      this.addRelation(filePath, importPath, \"imports\");\n+    }\n+  }\n+  normalizePath(importPath) {\n+    const builtinModules = [\"fs\", \"path\", \"crypto\", \"util\"];\n+    if (builtinModules.includes(importPath)) {\n+      return importPath;\n+    }\n+    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n+    if (!fullPath.endsWith(\".ts\")) {\n+      return `${fullPath}.ts`;\n+    }\n+    return fullPath;\n+  }\n+  /**\n+   * 添加代码元素\n+   */\n+  addCodeElement(element) {\n+    const elementId = (() => {\n+      switch (element.type) {\n+        case \"class\":\n+          return `${element.filePath}#${element.name}`;\n+        case \"class_method\":\n+        case \"constructor\":\n+          return `${element.filePath}#${element.className}#${element.name}`;\n+        case \"interface\":\n+          return `${element.filePath}#Interface#${element.name}`;\n+        case \"type_alias\":\n+          return `${element.filePath}#Type#${element.name}`;\n+        default:\n+          return `${element.filePath}#${element.name}`;\n+      }\n+    })();\n+    const codeElement = __spreadProps(__spreadValues({}, element), {\n+      id: elementId\n+    });\n+    this.codeElements.push(codeElement);\n+  }\n+  /**\n+   * 添加关系\n+   */\n+  addRelation(source, target, type) {\n+    const sourceNode = this.codeElements.find((e) => e.id === source);\n+    const targetNode = this.codeElements.find((e) => e.id === target);\n+    if (!sourceNode) {\n+      return;\n+    }\n+    if (!targetNode) {\n+      return;\n+    }\n+    const relation = {\n+      sourceId: source,\n+      targetId: target,\n+      type\n+    };\n+    const exists = this.relations.some(\n+      (r) => r.sourceId === source && r.targetId === target && r.type === type\n+    );\n+    if (!exists) {\n+      this.relations.push(relation);\n+    }\n+  }\n+  /**\n+   * 获取代码索引\n+   */\n+  getCodeIndex() {\n+    const codeIndex = /* @__PURE__ */ new Map();\n+    this.codeElements.forEach((element) => {\n+      const filePath = element.filePath;\n+      const existingElements = codeIndex.get(filePath) || [];\n+      existingElements.push(element);\n+      codeIndex.set(filePath, existingElements);\n+    });\n+    return codeIndex;\n+  }\n+  /**\n+   * 获取知识图谱\n+   */\n+  getKnowledgeGraph() {\n+    console.log(`[Debug] Generating knowledge graph:`, {\n+      totalElements: this.codeElements.length,\n+      totalRelations: this.relations.length\n+    });\n+    const nodes = this.codeElements.map((element) => ({\n+      id: element.id,\n+      name: element.name,\n+      type: element.type,\n+      filePath: element.filePath,\n+      location: element.location,\n+      implementation: element.implementation || \"\"\n+      // 添加 implementation 字段\n+    }));\n+    const validRelations = this.relations.filter((relation) => {\n+      const sourceExists = this.codeElements.some((e) => e.id === relation.sourceId);\n+      const targetExists = this.codeElements.some((e) => e.id === relation.targetId);\n+      if (!sourceExists || !targetExists) {\n+        console.warn(`[Warning] Invalid relation:`, {\n+          source: relation.sourceId,\n+          target: relation.targetId,\n+          type: relation.type,\n+          sourceExists,\n+          targetExists\n+        });\n+        return false;\n+      }\n+      return true;\n+    });\n+    const edges = validRelations.map((relation) => ({\n+      source: relation.sourceId,\n+      target: relation.targetId,\n+      type: relation.type,\n+      properties: {}\n+    }));\n+    console.log(`[Debug] Knowledge graph generated:`, {\n+      nodes: nodes.length,\n+      edges: edges.length,\n+      relationTypes: new Set(edges.map((e) => e.type))\n+    });\n+    return { nodes, edges };\n+  }\n+  /**\n+   * 获取特定类型的所有元素\n+   */\n+  getElementsByType(type) {\n+    return this.codeElements.filter((element) => element.type === type);\n+  }\n+  /**\n+   * 获取特定元素的所有关系\n+   */\n+  getElementRelations(elementName) {\n+    return this.relations.filter(\n+      (edge) => edge.sourceId === elementName || edge.targetId === elementName\n+    );\n+  }\n+  /**\n+   * 导出分析结果\n+   */\n+  exportAnalysis() {\n+    return JSON.stringify({\n+      codeElements: this.codeElements,\n+      relations: this.relations\n+    }, null, 2);\n+  }\n+  // 添加变量声明分析\n+  analyzeVariableDeclaration(node) {\n+    const declarator = node.childForFieldName(\"declarator\");\n+    const nameNode = declarator == null ? void 0 : declarator.childForFieldName(\"name\");\n+    if (!nameNode) return;\n+    const element = {\n+      type: \"variable\",\n+      name: nameNode.text,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: nameNode.startPosition.row + 1\n+      },\n+      implementation: node.text\n+    };\n+    this.addCodeElement(element);\n+  }\n+  validateAnalysis() {\n+    let isValid = true;\n+    const idSet = /* @__PURE__ */ new Set();\n+    this.codeElements.forEach((node) => {\n+      if (node.id && idSet.has(node.id)) {\n+        console.error(`[Validation] \\u91CD\\u590D\\u8282\\u70B9ID: ${node.id}`);\n+        isValid = false;\n+      }\n+      if (node.id) {\n+        idSet.add(node.id);\n+      }\n+    });\n+    this.relations.forEach((edge) => {\n+      const sourceExists = this.codeElements.some((e) => e.id === edge.sourceId);\n+      const targetExists = this.codeElements.some((e) => e.id === edge.targetId);\n+      if (!sourceExists) {\n+        console.error(`[Validation] \\u65E0\\u6548\\u5173\\u7CFB\\u6E90: ${edge.sourceId}`);\n+        isValid = false;\n+      }\n+      if (!targetExists) {\n+        console.error(`[Validation] \\u65E0\\u6548\\u5173\\u7CFB\\u76EE\\u6807: ${edge.targetId}`);\n+        isValid = false;\n+      }\n+    });\n+    return isValid;\n+  }\n+  getNodeName(node) {\n+    const nameNode = node.childForFieldName(\"name\");\n+    return nameNode == null ? void 0 : nameNode.text;\n+  }\n+  getImplementedInterfaces(node) {\n+    return node.text.replace(\"implements \", \"\").split(\",\").map((s) => s.trim());\n+  }\n+  analyzeClassMethod(node, className) {\n+    const isConstructor = node.type === \"constructor\";\n+    const methodNameNode = isConstructor ? node.childForFieldName(\"name\") : node.childForFieldName(\"name\");\n+    const methodName = (methodNameNode == null ? void 0 : methodNameNode.text) || \"anonymous\";\n+    const element = {\n+      type: isConstructor ? \"constructor\" : \"class_method\",\n+      name: methodName,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: node.startPosition.row + 1\n+      },\n+      className\n+    };\n+    this.addCodeElement(element);\n+    const classId = `${this.currentFile}#${className}`;\n+    const methodId = `${this.currentFile}#${className}#${methodName}`;\n+    console.log(`[Debug] Adding class method relation:`, {\n+      class: className,\n+      method: methodName,\n+      classId,\n+      methodId,\n+      type: element.type\n+    });\n+    this.addRelation(classId, methodId, \"defines\");\n+  }\n+  // 添加一个辅助方法来验证关系\n+  validateMethodRelation(classId, methodId) {\n+    const classNode = this.codeElements.find((e) => e.id === classId);\n+    const methodNode = this.codeElements.find((e) => e.id === methodId);\n+    if (!classNode) {\n+      console.error(`[Error] Class node not found: ${classId}`);\n+      return false;\n+    }\n+    if (!methodNode) {\n+      console.error(`[Error] Method node not found: ${methodId}`);\n+      return false;\n+    }\n+    console.log(`[Debug] Validated method relation:`, {\n+      class: classNode.name,\n+      method: methodNode.name,\n+      classId,\n+      methodId\n+    });\n+    return true;\n+  }\n+  analyzeImplementsRelation(node) {\n+    const interfaces = this.getImplementedInterfaces(node);\n+    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n+    interfaces.forEach((interfaceName) => {\n+      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n+      if (interfaceId) {\n+        this.addRelation(currentClassId, interfaceId, \"implements\");\n+      }\n+    });\n+  }\n+  analyzeTypeAlias(node) {\n+    const nameNode = node.childForFieldName(\"name\");\n+    if (!nameNode) return;\n+    const element = {\n+      type: \"type_alias\",\n+      name: nameNode.text,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: nameNode.startPosition.row + 1\n+      }\n+    };\n+    this.addCodeElement(element);\n+  }\n+  resolveCallee(node) {\n+    const calleeNode = node.childForFieldName(\"function\");\n+    if (!calleeNode) return void 0;\n+    const calleeName = calleeNode.text;\n+    const calleeClass = this.currentClass;\n+    const possibleIds = [\n+      `${this.currentFile}#${calleeName}`,\n+      // 普通函数\n+      `${this.currentFile}#${calleeClass}#${calleeName}`,\n+      // 类方法\n+      `${this.currentFile}#${calleeClass}#constructor`\n+      // 构造函数\n+    ];\n+    for (const id of possibleIds) {\n+      const element = this.codeElements.find((e) => e.id === id);\n+      if (element) return id;\n+    }\n+    return void 0;\n+  }\n+  getImportPath(node) {\n+    const moduleNode = node.childForFieldName(\"source\");\n+    if (!moduleNode) return \"\";\n+    return moduleNode.text.replace(/['\"]/g, \"\");\n+  }\n+  resolveTypeReference(typeName) {\n+    const element = this.codeElements.find((e) => e.name === typeName);\n+    return element == null ? void 0 : element.id;\n+  }\n+};\n+\n+// src/index.ts\n+import path2 from \"path\";\n+import { mkdir, rm } from \"fs/promises\";\n+import { existsSync } from \"fs\";\n+import crypto from \"crypto\";\n+\n+// src/utils/analyzeDependencies.ts\n+import { cruise } from \"dependency-cruiser\";\n+var analyzeDependencies = (rootDir) => __async(void 0, null, function* () {\n+  try {\n+    const result = yield cruise(\n+      [rootDir],\n+      // 要分析的目录\n+      {\n+        // 配置选项\n+        exclude: \"node_modules\",\n+        // 排除 node_modules\n+        outputType: \"json\"\n+        // 输出为 JSON 格式\n+      }\n+    );\n+    const dependencies = JSON.parse(result.output);\n+    return dependencies;\n+  } catch (error) {\n+    console.error(\"Error analyzing dependencies:\", error);\n+  }\n+});\n+\n+// src/index.ts\n+var GitIngest = class {\n+  constructor(config) {\n+    this.git = new GitAction();\n+    this.scanner = new FileScanner();\n+    this.analyzer = new CodeAnalyzer();\n+    this.config = __spreadValues({\n+      tempDir: \"repo\",\n+      // 默认保存仓库的目录名(不会暴露到外部)\n+      keepTempFiles: false,\n+      // 默认不保留临时文件\n+      defaultMaxFileSize: 1024 * 1024,\n+      // 默认检索不超过 1MB 的文件\n+      defaultPatterns: {\n+        include: [\"**/*\"],\n+        exclude: [\"**/node_modules/**\", \"**/.git/**\"]\n+      }\n+    }, config);\n+  }\n+  // 清理临时目录\n+  cleanupTempDir(dirPath) {\n+    return __async(this, null, function* () {\n+      try {\n+        if (existsSync(dirPath)) {\n+          yield rm(dirPath, { recursive: true, force: true });\n+        }\n+      } catch (error) {\n+        console.warn(\n+          `Warning: Failed to cleanup temporary directory ${dirPath}: ${error.message}`\n+        );\n+      }\n+    });\n+  }\n+  // 检查URL是否使用自定义域名，如果是则转换为原始GitHub URL\n+  transformCustomDomainUrl(url) {\n+    if (!this.config.customDomainMap) {\n+      return url;\n+    }\n+    const { targetDomain, originalDomain } = this.config.customDomainMap;\n+    if (url.includes(targetDomain)) {\n+      return url.replace(targetDomain, originalDomain);\n+    }\n+    return url;\n+  }\n+  // 检查URL是否匹配自定义域名\n+  isCustomDomainUrl(url) {\n+    if (!this.config.customDomainMap) {\n+      return false;\n+    }\n+    return url.includes(this.config.customDomainMap.targetDomain);\n+  }\n+  // [核心步骤0]: 开端，根据 url 按需获取仓库代码\n+  analyzeFromUrl(url, options) {\n+    return __async(this, null, function* () {\n+      const isCustomDomain = this.isCustomDomainUrl(url);\n+      const githubUrl = this.transformCustomDomainUrl(url);\n+      if (!githubUrl) {\n+        throw new ValidationError(\"URL is required\");\n+      }\n+      if (!githubUrl.match(/^https?:\\/\\//)) {\n+        throw new ValidationError(\"Invalid URL format\");\n+      }\n+      if (!this.config.tempDir) {\n+        throw new ValidationError(\"Temporary directory is required\");\n+      }\n+      const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n+      const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n+      const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n+      const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n+      let result;\n+      try {\n+        if (!existsSync(this.config.tempDir)) {\n+          yield mkdir(this.config.tempDir, { recursive: true });\n+        }\n+        yield this.git.clone(githubUrl, workDir);\n+        if (options == null ? void 0 : options.branch) {\n+          yield this.git.checkoutBranch(workDir, options.branch);\n+        }\n+        result = yield this.analyzeFromDirectory(workDir, options);\n+        if (!this.config.keepTempFiles) {\n+          yield this.cleanupTempDir(workDir);\n+        }\n+        return result;\n+      } catch (error) {\n+        if (!this.config.keepTempFiles) {\n+          yield this.cleanupTempDir(workDir);\n+        }\n+        if (error instanceof GitIngestError) {\n+          throw error;\n+        }\n+        throw new GitIngestError(\n+          `Failed to analyze repository: ${error.message}`\n+        );\n+      }\n+    });\n+  }\n+  // 分析扫描目录\n+  analyzeFromDirectory(dirPath, options) {\n+    return __async(this, null, function* () {\n+      var _a, _b;\n+      if (!dirPath) {\n+        throw new ValidationError(\"Path is required\");\n+      }\n+      if (!existsSync(dirPath)) {\n+        throw new ValidationError(`Directory not found: ${dirPath}`);\n+      }\n+      try {\n+        const files = yield this.scanner.scanDirectory(dirPath, {\n+          maxFileSize: (options == null ? void 0 : options.maxFileSize) || this.config.defaultMaxFileSize,\n+          includePatterns: (options == null ? void 0 : options.includePatterns) || ((_a = this.config.defaultPatterns) == null ? void 0 : _a.include),\n+          excludePatterns: (options == null ? void 0 : options.excludePatterns) || ((_b = this.config.defaultPatterns) == null ? void 0 : _b.exclude),\n+          targetPaths: options == null ? void 0 : options.targetPaths,\n+          includeDependencies: true\n+        });\n+        if (files.length === 0) {\n+          throw new ValidationError(\"No files found in the specified directory\");\n+        }\n+        this.analyzer = new CodeAnalyzer();\n+        for (const file of files) {\n+          try {\n+            if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n+              const content = file.content;\n+              const absolutePath = path2.resolve(dirPath, file.path);\n+              this.analyzer.analyzeCode(absolutePath, content);\n+            }\n+          } catch (error) {\n+            console.warn(\n+              `Warning: Failed to analyze file ${file.path}: ${error.message}`\n+            );\n+          }\n+        }\n+        const codeIndex = this.analyzer.getCodeIndex();\n+        const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n+        console.log(`Analysis complete. Found ${codeIndex.size} code elements`);\n+        return {\n+          metadata: {\n+            files: files.length,\n+            tokens: files.reduce((acc, file) => acc + file.token, 0)\n+          },\n+          totalCode: files,\n+          fileTree: generateTree(files),\n+          sizeTree: buildSizeTree(files),\n+          codeAnalysis: { codeIndex, knowledgeGraph },\n+          dependencyGraph: yield analyzeDependencies(dirPath + ((options == null ? void 0 : options.miniCommonRoot) || \"\"))\n+        };\n+      } catch (error) {\n+        if (error instanceof GitIngestError) {\n+          throw error;\n+        }\n+        throw new GitIngestError(\n+          `Failed to analyze directory: ${error.message}`\n+        );\n+      }\n+    });\n+  }\n+};\n+export {\n+  GitIngest,\n+  GitIngestError,\n+  GitOperationError,\n+  ValidationError,\n+  searchKnowledgeGraph\n+};"
          },
          {
              "sha": "8cb45369b9245982242c3db7fc3cf9a2e52c289e",
              "filename": "examples/scanner.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 64,
              "changes": 64,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fscanner.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fscanner.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Fscanner.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,64 +0,0 @@\n-import { GitIngest } from \"../src/index.js\";\n-\n-async function test() {\n-  console.log(\"开始测试...\\n\");\n-\n-  // 1. 测试本地目录选择性分析\n-  console.log(\"1. 测试本地目录选择性分析\");\n-  const localIngest = new GitIngest({\n-    tempDir: \"./temp-test\",\n-    keepTempFiles: false,\n-  });\n-\n-  try {\n-    // 测试分析特定文件\n-    console.log(\"\\n1.2 分析特定文件：\");\n-    console.log(\"正在分析文件...\");\n-    const fileResult = await localIngest.analyzeFromDirectory(\"./\", { // 分析当前目录下的文件\n-      targetPaths: ['examples/test/index.ts', 'examples/scanner.ts'] // 分析指定入口文件, 会递归分析出所有的依赖文件\n-    });\n-    console.log(\"分析完成！\");\n-    console.log(\"\\n分析结果:\");\n-    console.log(\"- 文件数:\", fileResult.metadata.files);\n-    console.log(\"- 总大小:\", fileResult.metadata.size, \"bytes\");\n-    // console.log(\"\\n文件内容:\");\n-    // console.log(fileResult.content);\n-    console.log(\"\\n特定文件扫描出来的的文件树(包含依赖文件)：\");\n-    console.log(fileResult.tree);\n-  } catch (error) {\n-    console.error(\"本地目录分析失败:\", error);\n-  }\n-\n-  // 2. 测试 GitHub 仓库选择性分析\n-  console.log(\"\\n2. 测试 GitHub 仓库选择性分析\");\n-  const githubIngest = new GitIngest({\n-    tempDir: \"./temp-test\",\n-    keepTempFiles: false,\n-    defaultPatterns: {\n-      exclude: [\"**/node_modules/**\", \"**/.git/**\", \"**/dist/**\"],\n-    }\n-  });\n-\n-  try {\n-    console.log(\"\\n1.2 GitHub 仓库分析特定文件：\");\n-    console.log(\"正在分析文件...\");\n-    const githubResult = await githubIngest.analyzeFromUrl(\n-      \"https://github.com/Gijela/gitingest-ts\", // 项目第一层作为分析的根目录\n-      {\n-        branch: \"dev\",\n-        maxFileSize: 500 * 1024, // 500KB\n-        targetPaths: ['examples/test/index.ts', 'examples/scanner.ts'] // 分析指定入口文件, 会递归分析出所有的依赖文件\n-      }\n-    );\n-    console.log(\"GitHub 仓库分析完成！\");\n-    console.log(\"\\n分析结果:\");\n-    console.log(\"- 文件数:\", githubResult.metadata.files);\n-    console.log(\"- 总大小:\", githubResult.metadata.size, \"bytes\");\n-    console.log(\"\\n仓库特定文件扫描出来的的文件树(包含依赖文件)：\");\n-    console.log(githubResult.tree);\n-  } catch (error) {\n-    console.error(\"GitHub 仓库分析失败:\", error);\n-  }\n-}\n-\n-test().catch(console.error); \n\\ No newline at end of file"
          },
          {
              "sha": "bd3ebe3ed4d59ca71b1fb7fa95cfaee25d12b6ab",
              "filename": "examples/test/branch-analysis.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 90,
              "changes": 90,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Ftest%2Fbranch-analysis.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Ftest%2Fbranch-analysis.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Ftest%2Fbranch-analysis.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,90 +0,0 @@\n-import { simpleGit } from 'simple-git';\n-import { DependencyAnalyzer } from '../../src/core/dependency/analyzer.js';\n-import { BranchAnalyzer } from '../../src/core/git/branch-analyzer.js';\n-\n-async function main() {\n-  try {\n-    const git = simpleGit();\n-    const dependencyAnalyzer = new DependencyAnalyzer();\n-    const branchAnalyzer = new BranchAnalyzer(git, dependencyAnalyzer);\n-\n-    // 分析当前分支与目标分支的差异\n-    console.log('Analyzing branch differences...');\n-    const analysis = await branchAnalyzer.analyzeBranchDiff('dev', 'main');\n-\n-    console.log('\\nBranch Analysis Results:');\n-    console.log('========================');\n-\n-    console.log('\\nBranch Information:');\n-    console.log(`Source: ${analysis.sourceBranch}`);\n-    console.log(`Target: ${analysis.targetBranch}`);\n-\n-    console.log('\\nCommit Statistics:');\n-    console.log(`Ahead by: ${analysis.commits.ahead.length} commits`);\n-    console.log(`Behind by: ${analysis.commits.behind.length} commits`);\n-    console.log(`Diverged commits: ${analysis.commits.diverged.length}`);\n-\n-    console.log('\\nFile Changes:');\n-    console.log(`Added: ${analysis.files.added.length} files`);\n-    console.log(`Modified: ${analysis.files.modified.length} files`);\n-    console.log(`Deleted: ${analysis.files.deleted.length} files`);\n-    console.log(`Renamed: ${analysis.files.renamed.length} files`);\n-\n-    if (analysis.files.added.length > 0) {\n-      console.log('\\nAdded Files:');\n-      analysis.files.added.forEach(file => console.log(`  + ${file}`));\n-    }\n-\n-    if (analysis.files.modified.length > 0) {\n-      console.log('\\nModified Files:');\n-      analysis.files.modified.forEach(file => console.log(`  M ${file}`));\n-    }\n-\n-    if (analysis.files.deleted.length > 0) {\n-      console.log('\\nDeleted Files:');\n-      analysis.files.deleted.forEach(file => console.log(`  - ${file}`));\n-    }\n-\n-    if (analysis.files.renamed.length > 0) {\n-      console.log('\\nRenamed Files:');\n-      analysis.files.renamed.forEach(({ from, to }) =>\n-        console.log(`  ${from} -> ${to}`)\n-      );\n-    }\n-\n-    console.log('\\nConflict Analysis:');\n-    console.log(`Potential Conflicts: ${analysis.conflicts.files.length} files`);\n-    console.log(`Conflict Probability: ${(analysis.conflicts.probability * 100).toFixed(1)}%`);\n-\n-    if (analysis.conflicts.files.length > 0) {\n-      console.log('\\nConflicting Files:');\n-      analysis.conflicts.files.forEach(file => console.log(`  ! ${file}`));\n-\n-      console.log('\\nConflict Areas:');\n-      analysis.conflicts.conflictAreas.forEach(area => {\n-        console.log(`  ${area.file} (Severity: ${area.severity})`);\n-        console.log(`    Lines: ${area.lines.join(', ')}`);\n-      });\n-    }\n-\n-    console.log('\\nDependency Impact:');\n-    console.log(`Risk Level: ${analysis.dependencyImpact.risk}`);\n-    console.log(`Broken Dependencies: ${analysis.dependencyImpact.broken.length}`);\n-    console.log(`Affected Modules: ${analysis.dependencyImpact.affected.length}`);\n-\n-    if (analysis.dependencyImpact.broken.length > 0) {\n-      console.log('\\nBroken Dependencies:');\n-      analysis.dependencyImpact.broken.forEach(dep => console.log(`  ! ${dep}`));\n-    }\n-\n-    if (analysis.dependencyImpact.affected.length > 0) {\n-      console.log('\\nAffected Modules:');\n-      analysis.dependencyImpact.affected.forEach(mod => console.log(`  * ${mod}`));\n-    }\n-\n-  } catch (error) {\n-    console.error('Analysis failed:', error);\n-  }\n-}\n-\n-main(); \n\\ No newline at end of file"
          },
          {
              "sha": "b084eff229c9385e974567a0a0c2b46c08cc865f",
              "filename": "examples/test/dependency-analysis.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 50,
              "changes": 50,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Ftest%2Fdependency-analysis.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Ftest%2Fdependency-analysis.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Ftest%2Fdependency-analysis.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,50 +0,0 @@\n-import { DependencyAnalyzer } from '../../src/core/dependency/analyzer.js';\n-import { EnhancedScanner } from '../../src/core/dependency/enhanced-scanner.js';\n-import { GitAnalyzer } from '../../src/core/git/analyzer.js';\n-import { join } from 'path';\n-\n-async function main() {\n-  try {\n-    // 初始化分析器\n-    const dependencyAnalyzer = new DependencyAnalyzer();\n-    const scanner = new EnhancedScanner(dependencyAnalyzer);\n-    const gitAnalyzer = new GitAnalyzer(process.cwd(), dependencyAnalyzer);\n-\n-    // 分析当前目录\n-    console.log('Analyzing dependencies...');\n-    const files = await scanner.scanDirectory(process.cwd(), {\n-      includePatterns: ['**/*.ts'],\n-      excludePatterns: ['**/node_modules/**', '**/dist/**'],\n-      includeDependencies: true\n-    });\n-\n-    console.log(`Found ${files.length} files`);\n-\n-    // 分析最近的提交\n-    console.log('\\nAnalyzing recent commit...');\n-    const analysis = await gitAnalyzer.analyzeChanges('HEAD');\n-\n-    console.log('\\nCommit Info:');\n-    console.log(analysis.commitInfo);\n-\n-    console.log('\\nChanged Files:');\n-    console.log(analysis.changes.map(c => `${c.type}: ${c.file}`));\n-\n-    console.log('\\nImpact Analysis:');\n-    console.log('Direct Files:', analysis.impacts.directFiles);\n-    console.log('Indirect Files:', analysis.impacts.indirectFiles);\n-    console.log('Impact Level:', analysis.impacts.potentialImpact);\n-\n-    console.log('\\nRelated Commits:');\n-    console.log(analysis.relatedCommits.map(c => ({\n-      hash: c.hash.slice(0, 7),\n-      message: c.message.split('\\n')[0],\n-      score: c.relevanceScore.toFixed(2)\n-    })));\n-\n-  } catch (error) {\n-    console.error('Analysis failed:', error);\n-  }\n-}\n-\n-main(); \n\\ No newline at end of file"
          },
          {
              "sha": "fdfaa69357e5b5d730b7f0d35350365d8fc9a395",
              "filename": "examples/test/index.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 3,
              "changes": 3,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Ftest%2Findex.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Ftest%2Findex.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Ftest%2Findex.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,3 +0,0 @@\n-import { GitHandler } from '../../src/core/git.js';\n-\n-console.log('222');\n\\ No newline at end of file"
          },
          {
              "sha": "b3375aa3756bcaeb0e72227480d06246657218e0",
              "filename": "examples/web/READMD.MD",
              "status": "removed",
              "additions": 0,
              "deletions": 114,
              "changes": 114,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2FREADMD.MD",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2FREADMD.MD",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Fweb%2FREADMD.MD?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,114 +0,0 @@\n-让我分析一下当前 Web 界面使用到的功能：\n-\n-### 1. 界面功能\n-\n-1. **分析选项**\n-\n-- ✅ 本地目录分析\n-- ✅ GitHub 仓库分析\n-- ✅ 分支选择\n-- ✅ 目标文件筛选\n-\n-2. **结果展示**\n-\n-- ✅ 基本信息展示（文件数、大小、Token数）\n-- ✅ 文件树展示\n-- ✅ 项目概要展示\n-- ✅ 文件内容展示\n-- ⚠️ 依赖关系图（已实现基础版本）\n-\n-### 2. 后端 API\n-\n-1. **分析接口**\n-\n-- ✅ `/analyze/local` - 本地目录分析\n-- ✅ `/analyze/github` - GitHub 仓库分析\n-- ✅ `/:owner/:repo` - 直接访问 GitHub 仓库\n-- ✅ `/health` - 健康检查\n-\n-2. **数据处理**\n-\n-- ✅ 目标路径处理\n-- ✅ 文件内容格式化\n-- ✅ 错误处理\n-- ✅ CORS 支持\n-\n-### 3. 可视化功能\n-\n-1. **Mermaid 图表支持**\n-\n-- ✅ 依赖关系图基础实现\n-  ```javascript\n-  const mermaidDiagrams = {\n-    dependencies: generateDependencyGraph(result),\n-  };\n-  ```\n-- ❌ 类关系图\n-- ❌ 函数调用图\n-- ❌ 时序图\n-\n-2. **依赖分析可视化**\n-\n-- ✅ 基础的导入导出关系\n-- ❌ 循环依赖展示\n-- ❌ 间接依赖展示\n-- ❌ 依赖深度分析\n-\n-### 4. 待优化功能\n-\n-1. **UI/UX 优化**\n-\n-- ❌ 加载状态优化\n-- ❌ 错误提示优化\n-- ❌ 分析进度展示\n-- ❌ 结果导出功能\n-\n-2. **可视化增强**\n-\n-- ❌ 交互式依赖图\n-- ❌ 图表缩放和拖拽\n-- ❌ 节点详情展示\n-- ❌ 关系筛选功能\n-\n-3. **分析功能增强**\n-\n-- ❌ 代码质量分析\n-- ❌ 复杂度分析\n-- ❌ 重复代码检测\n-- ❌ 变更影响分析\n-\n-4. **性能优化**\n-\n-- ❌ 大型项目分析优化\n-- ❌ 增量分析支持\n-- ❌ 分析结果缓存\n-- ❌ 并行处理优化\n-\n-### 建议优先实现的功能\n-\n-1. **可视化增强**\n-\n-- 完善依赖关系图的交互性\n-- 添加类关系图和函数调用图\n-- 增加图表交互功能\n-\n-2. **分析功能**\n-\n-- 实现循环依赖检测\n-- 添加代码质量分析\n-- 支持变更影响分析\n-\n-3. **用户体验**\n-\n-- 优化加载状态展示\n-- 添加分析进度条\n-- 完善错误提示\n-- 添加结果导出功能\n-\n-4. **性能优化**\n-\n-- 实现增量分析\n-- 添加结果缓存\n-- 优化大型项目分析\n-\n-这些建议基于当前实现和用户实际需求，按照实用性和实现难度进行优先级排序。"
          },
          {
              "sha": "b4b84364897fcfd2c6d3f56e47adb0e614e8e219",
              "filename": "examples/web/index.html",
              "status": "removed",
              "additions": 0,
              "deletions": 144,
              "changes": 144,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2Findex.html",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2Findex.html",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Fweb%2Findex.html?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,144 +0,0 @@\n-<!DOCTYPE html>\n-<html lang=\"zh-CN\">\n-\n-<head>\n-  <meta charset=\"UTF-8\">\n-  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n-  <title>GitIngest-TS 代码分析工具</title>\n-  <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css\" rel=\"stylesheet\">\n-  <script src=\"https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js\"></script>\n-  <style>\n-    .tree-view {\n-      font-family: monospace;\n-      white-space: pre;\n-    }\n-\n-    .code-block {\n-      font-family: monospace;\n-      white-space: pre-wrap;\n-      max-height: 400px;\n-      overflow-y: auto;\n-    }\n-\n-    .mermaid {\n-      background: white;\n-      padding: 1rem;\n-      border-radius: 0.5rem;\n-    }\n-  </style>\n-  <script>\n-    mermaid.initialize({\n-      startOnLoad: false,\n-      theme: 'default',\n-      logLevel: 'error',\n-      securityLevel: 'loose',\n-      flowchart: {\n-        useMaxWidth: true,\n-        htmlLabels: true,\n-        curve: 'basis'\n-      },\n-      sequence: {\n-        useMaxWidth: true,\n-        showSequenceNumbers: false,\n-        wrap: true\n-      }\n-    });\n-  </script>\n-</head>\n-\n-<body class=\"bg-gray-100\">\n-  <div class=\"container mx-auto px-4 py-8\">\n-    <h1 class=\"text-4xl font-bold text-center mb-8\">GitIngest-TS 代码分析工具</h1>\n-\n-    <!-- 分析选项卡 -->\n-    <div class=\"bg-white rounded-lg shadow-lg p-6 mb-8\">\n-      <div class=\"flex mb-4\">\n-        <button id=\"localTab\" class=\"px-4 py-2 bg-blue-500 text-white rounded-lg mr-4\">本地目录分析</button>\n-        <button id=\"githubTab\" class=\"px-4 py-2 bg-gray-300 text-gray-700 rounded-lg\">GitHub 仓库分析</button>\n-      </div>\n-\n-      <!-- 本地目录分析表单 -->\n-      <div id=\"localForm\" class=\"mb-4\">\n-        <div class=\"mb-4\">\n-          <label class=\"block text-gray-700 mb-2\">目录路径</label>\n-          <input type=\"text\" id=\"localPath\" class=\"w-full p-2 border rounded\" placeholder=\"输入本地目录路径\">\n-        </div>\n-        <div class=\"mb-4\">\n-          <label class=\"block text-gray-700 mb-2\">目标文件（可选，多个文件用逗号分隔）</label>\n-          <input type=\"text\" id=\"localTargetPaths\" class=\"w-full p-2 border rounded\"\n-            placeholder=\"例如: src/index.ts,README.md\">\n-        </div>\n-      </div>\n-\n-      <!-- GitHub 仓库分析表单 -->\n-      <div id=\"githubForm\" class=\"mb-4 hidden\">\n-        <div class=\"mb-4\">\n-          <label class=\"block text-gray-700 mb-2\">仓库 URL</label>\n-          <input type=\"text\" id=\"githubUrl\" class=\"w-full p-2 border rounded\"\n-            placeholder=\"例如: https://github.com/user/repo\">\n-        </div>\n-        <div class=\"mb-4\">\n-          <label class=\"block text-gray-700 mb-2\">分支（可选）</label>\n-          <input type=\"text\" id=\"branch\" class=\"w-full p-2 border rounded\" placeholder=\"例如: main\">\n-        </div>\n-        <div class=\"mb-4\">\n-          <label class=\"block text-gray-700 mb-2\">目标文件（可选，多个文件用逗号分隔）</label>\n-          <input type=\"text\" id=\"githubTargetPaths\" class=\"w-full p-2 border rounded\"\n-            placeholder=\"例如: src/index.ts,README.md\">\n-        </div>\n-      </div>\n-\n-      <button id=\"analyzeBtn\" class=\"w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600\">开始分析</button>\n-    </div>\n-\n-    <!-- 分析结果 -->\n-    <div id=\"results\" class=\"hidden\">\n-      <div class=\"bg-white rounded-lg shadow-lg p-6 mb-8\">\n-        <h2 class=\"text-2xl font-bold mb-4\">分析结果</h2>\n-\n-        <!-- 基本信息 -->\n-        <div class=\"mb-6\">\n-          <h3 class=\"text-xl font-semibold mb-2\">基本信息</h3>\n-          <div id=\"metadata\" class=\"bg-gray-50 p-4 rounded\"></div>\n-        </div>\n-\n-        <!-- 文件树 -->\n-        <div class=\"mb-6\">\n-          <h3 class=\"text-xl font-semibold mb-2\">文件树</h3>\n-          <div id=\"tree\" class=\"bg-gray-50 p-4 rounded tree-view\"></div>\n-        </div>\n-\n-        <!-- 项目概要 -->\n-        <div class=\"mb-6\">\n-          <h3 class=\"text-xl font-semibold mb-2\">项目概要</h3>\n-          <div id=\"summary\" class=\"bg-gray-50 p-4 rounded whitespace-pre-line\"></div>\n-        </div>\n-\n-        <!-- 可视化图表 -->\n-        <div class=\"mb-6\">\n-          <h3 class=\"text-xl font-semibold mb-2\">可视化图表</h3>\n-\n-          <div class=\"space-y-6\">\n-            <!-- 依赖关系图 -->\n-            <div>\n-              <h4 class=\"text-lg font-medium mb-2\">依赖关系图</h4>\n-              <div id=\"dependencyGraph\" class=\"mermaid\"></div>\n-            </div>\n-          </div>\n-        </div>\n-\n-        <!-- 文件内容 -->\n-        <div>\n-          <h3 class=\"text-xl font-semibold mb-2\">文件内容</h3>\n-          <div id=\"fileContents\" class=\"space-y-4\">\n-            <!-- 文件内容将在这里动态添加 -->\n-          </div>\n-        </div>\n-      </div>\n-    </div>\n-  </div>\n-\n-  <script src=\"index.js\"></script>\n-</body>\n-\n-</html>\n\\ No newline at end of file"
          },
          {
              "sha": "75af757a03c2390a522ebea35fc192317e217f3b",
              "filename": "examples/web/index.js",
              "status": "removed",
              "additions": 0,
              "deletions": 175,
              "changes": 175,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2Findex.js",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2Findex.js",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Fweb%2Findex.js?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,175 +0,0 @@\n-document.addEventListener(\"DOMContentLoaded\", () => {\n-  const localTab = document.getElementById(\"localTab\");\n-  const githubTab = document.getElementById(\"githubTab\");\n-  const localForm = document.getElementById(\"localForm\");\n-  const githubForm = document.getElementById(\"githubForm\");\n-  const analyzeBtn = document.getElementById(\"analyzeBtn\");\n-  const results = document.getElementById(\"results\");\n-  const fileContents = document.getElementById(\"fileContents\");\n-\n-  // 切换表单\n-  localTab.addEventListener(\"click\", () => {\n-    localTab.classList.replace(\"bg-gray-300\", \"bg-blue-500\");\n-    localTab.classList.replace(\"text-gray-700\", \"text-white\");\n-    githubTab.classList.replace(\"bg-blue-500\", \"bg-gray-300\");\n-    githubTab.classList.replace(\"text-white\", \"text-gray-700\");\n-    localForm.classList.remove(\"hidden\");\n-    githubForm.classList.add(\"hidden\");\n-  });\n-\n-  githubTab.addEventListener(\"click\", () => {\n-    githubTab.classList.replace(\"bg-gray-300\", \"bg-blue-500\");\n-    githubTab.classList.replace(\"text-gray-700\", \"text-white\");\n-    localTab.classList.replace(\"bg-blue-500\", \"bg-gray-300\");\n-    localTab.classList.replace(\"text-white\", \"text-gray-700\");\n-    githubForm.classList.remove(\"hidden\");\n-    localForm.classList.add(\"hidden\");\n-  });\n-\n-  // 创建文件内容展示元素\n-  function createFileContentElement(filePath, content) {\n-    const fileDiv = document.createElement(\"div\");\n-    fileDiv.className = \"bg-gray-50 p-4 rounded\";\n-\n-    const header = document.createElement(\"div\");\n-    header.className = \"font-semibold mb-2 text-blue-600\";\n-    header.textContent = filePath;\n-\n-    const codeBlock = document.createElement(\"div\");\n-    codeBlock.className = \"code-block bg-gray-100 p-4 rounded\";\n-    codeBlock.textContent = content;\n-\n-    fileDiv.appendChild(header);\n-    fileDiv.appendChild(codeBlock);\n-\n-    return fileDiv;\n-  }\n-\n-  // 更新图表函数\n-  async function updateMermaidGraphs(mermaidDiagrams) {\n-    const graphs = {\n-      dependencyGraph: mermaidDiagrams.dependencies,\n-    };\n-\n-    // 清除所有现有图表\n-    document.querySelectorAll(\".mermaid\").forEach((element) => {\n-      element.innerHTML = \"\";\n-      element.removeAttribute(\"data-processed\");\n-    });\n-\n-    // 逐个渲染图表\n-    for (const [elementId, graphDefinition] of Object.entries(graphs)) {\n-      if (!graphDefinition) continue;\n-\n-      const element = document.getElementById(elementId);\n-      if (element) {\n-        try {\n-          element.innerHTML = graphDefinition;\n-          await mermaid.init(undefined, element);\n-        } catch (error) {\n-          console.error(`图表 ${elementId} 渲染错误:`, error);\n-          element.innerHTML = `\n-            <div class=\"text-red-500 p-4 border border-red-300 rounded\">\n-              <p class=\"font-bold\">图表渲染失败</p>\n-              <pre class=\"mt-2 text-sm\">${graphDefinition}</pre>\n-              <p class=\"mt-2 text-sm\">${error.message}</p>\n-            </div>\n-          `;\n-        }\n-      }\n-    }\n-  }\n-\n-  // 分析按钮点击事件\n-  analyzeBtn.addEventListener(\"click\", async () => {\n-    const isLocal = !localForm.classList.contains(\"hidden\");\n-    const endpoint = isLocal ? \"/analyze/local\" : \"/analyze/github\";\n-\n-    let data;\n-    if (isLocal) {\n-      const path = document.getElementById(\"localPath\").value;\n-      if (!path) {\n-        alert(\"请输入目录路径\");\n-        return;\n-      }\n-      data = {\n-        path,\n-        targetPaths: document.getElementById(\"localTargetPaths\").value,\n-      };\n-    } else {\n-      const url = document.getElementById(\"githubUrl\").value;\n-      if (!url) {\n-        alert(\"请输入仓库 URL\");\n-        return;\n-      }\n-      data = {\n-        url,\n-        branch: document.getElementById(\"branch\").value,\n-        targetPaths: document.getElementById(\"githubTargetPaths\").value,\n-      };\n-    }\n-\n-    try {\n-      analyzeBtn.disabled = true;\n-      analyzeBtn.textContent = \"分析中...\";\n-\n-      const response = await fetch(`http://localhost:3000${endpoint}`, {\n-        method: \"POST\",\n-        headers: {\n-          \"Content-Type\": \"application/json\",\n-        },\n-        body: JSON.stringify(data),\n-      });\n-\n-      const result = await response.json();\n-\n-      if (!result.success) {\n-        throw new Error(result.error);\n-      }\n-\n-      const { data: analysisResult } = result;\n-\n-      // 显示结果\n-      document.getElementById(\"metadata\").textContent =\n-        `文件数: ${analysisResult.metadata.files}\n-总大小: ${analysisResult.metadata.size} bytes\n-预估Token数: ${analysisResult.metadata.tokens}`;\n-\n-      document.getElementById(\"tree\").textContent = analysisResult.tree;\n-      document.getElementById(\"summary\").textContent = analysisResult.summary;\n-\n-      // 更新可视化图表\n-      if (analysisResult.mermaidDiagrams) {\n-        updateMermaidGraphs(analysisResult.mermaidDiagrams);\n-      }\n-\n-      // 清空并显示文件内容\n-      fileContents.innerHTML = \"\";\n-\n-      // 分割文件内容\n-      const files = analysisResult.content\n-        .split(/File: /)\n-        .filter(Boolean)\n-        .map((section) => {\n-          const lines = section.split(\"\\n\");\n-          const filePath = lines[0].trim();\n-          const content = lines.slice(2).join(\"\\n\").trim();\n-          return { filePath, content };\n-        });\n-\n-      // 创建文件内容元素\n-      files.forEach(({ filePath, content }) => {\n-        const fileElement = createFileContentElement(filePath, content);\n-        fileContents.appendChild(fileElement);\n-      });\n-\n-      results.classList.remove(\"hidden\");\n-    } catch (error) {\n-      console.error(\"Error details:\", error);\n-      alert(`错误: ${error.message}`);\n-    } finally {\n-      analyzeBtn.disabled = false;\n-      analyzeBtn.textContent = \"开始分析\";\n-    }\n-  });\n-});"
          },
          {
              "sha": "412dff3febdac7efb27134808d9449da1d68c973",
              "filename": "examples/web/public/test.png",
              "status": "removed",
              "additions": 0,
              "deletions": 0,
              "changes": 0,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2Fpublic%2Ftest.png",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2Fpublic%2Ftest.png",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Fweb%2Fpublic%2Ftest.png?ref=82e261f659a990442a8b5090659ac1d6b74cb89b"
          },
          {
              "sha": "98fa222a16c010545558f64e46ffe2983268fc5c",
              "filename": "examples/web/server.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 476,
              "changes": 476,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2Fserver.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/examples%2Fweb%2Fserver.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/examples%2Fweb%2Fserver.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,476 +0,0 @@\n-import Koa from 'koa';\n-import Router from '@koa/router';\n-import { koaBody } from 'koa-body';\n-import cors from '@koa/cors';\n-import serve from 'koa-static';\n-import { GitIngest } from '../../src/index.js';\n-import path from 'path';\n-import { fileURLToPath } from 'url';\n-import { DependencyAnalyzer } from '../../src/core/dependency/analyzer.js';\n-import { EnhancedScanner } from '../../src/core/dependency/enhanced-scanner.js';\n-import { join } from 'path';\n-\n-const __filename = fileURLToPath(import.meta.url);\n-const __dirname = path.dirname(__filename);\n-\n-// 创建应用实例\n-const app = new Koa();\n-const router = new Router();\n-\n-// 错误处理中间件\n-app.use(async (ctx, next) => {\n-  try {\n-    await next();\n-  } catch (err) {\n-    const error = err as Error;\n-    ctx.status = error.name === 'ValidationError' ? 400 : 500;\n-    ctx.body = {\n-      success: false,\n-      error: error.message\n-    };\n-    // 记录错误日志\n-    console.error(`[${new Date().toISOString()}] Error:`, error);\n-  }\n-});\n-\n-// 请求日志中间件\n-app.use(async (ctx, next) => {\n-  const start = Date.now();\n-  await next();\n-  const ms = Date.now() - start;\n-  console.log(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url} - ${ms}ms`);\n-});\n-\n-// 基础中间件\n-app.use(koaBody());\n-app.use(cors({\n-  allowMethods: ['GET', 'POST'],\n-  allowHeaders: ['Content-Type', 'Authorization']\n-}));\n-app.use(serve(__dirname));\n-\n-// 创建 GitIngest 实例\n-const ingest = new GitIngest({\n-  tempDir: \"./temp-web\",\n-  keepTempFiles: false,\n-  defaultPatterns: {\n-    exclude: [\"**/node_modules/**\", \"**/.git/**\", \"**/dist/**\"],\n-  }\n-});\n-\n-// 创建依赖分析器和增强扫描器实例\n-const dependencyAnalyzer = new DependencyAnalyzer();\n-const enhancedScanner = new EnhancedScanner(dependencyAnalyzer);\n-\n-// 工具函数：处理目标路径\n-const processTargetPaths = (paths?: string) => {\n-  if (!paths) return undefined;\n-  return paths.split(',').map(p => p.trim()).filter(Boolean);\n-};\n-\n-// 工具函数：格式化文件内容\n-const formatFileContent = (content: string) => {\n-  // 移除多余的空行和分隔符\n-  return content.split('File: ')\n-    .filter(Boolean)\n-    .map(section => {\n-      const [path, ...contentLines] = section.trim().split('\\n');\n-      // 清理路径，移除临时目录前缀\n-      const cleanPath = path\n-        .replace(/^temp-web\\/\\d+\\/[^/]+\\/src\\//, 'src/') // 处理带临时目录的 src 路径\n-        .replace(/^temp-web\\/\\d+\\/[^/]+\\//, '')          // 处理其他临时目录路径\n-        .replace(/\\\\/g, '/');                            // 统一使用正斜杠\n-      return `File: ${cleanPath}\\n${contentLines.join('\\n')}`;\n-    })\n-    .join('\\n\\n');\n-};\n-\n-// 修改分析结果处理函数\n-async function processAnalysisResult(result: any) {\n-  const mermaidDiagrams = {\n-    dependencies: generateDependencyGraph(result)\n-  };\n-\n-  return {\n-    ...result,\n-    mermaidDiagrams\n-  };\n-}\n-\n-// API 路由\n-router.post('/analyze/local', async (ctx) => {\n-  const { path: dirPath, targetPaths } = ctx.request.body as {\n-    path?: string;\n-    targetPaths?: string;\n-  };\n-\n-  if (!dirPath) {\n-    ctx.status = 400;\n-    ctx.body = {\n-      success: false,\n-      error: '目录路径不能为空'\n-    };\n-    return;\n-  }\n-\n-  const result = await ingest.analyzeFromDirectory(dirPath, {\n-    targetPaths: processTargetPaths(targetPaths)\n-  });\n-\n-  result.content = formatFileContent(result.content);\n-\n-  // 使用新的处理函数\n-  ctx.body = {\n-    success: true,\n-    data: await processAnalysisResult(result)\n-  };\n-});\n-\n-// 工具函数：生成依赖关系图\n-function generateDependencyGraph(result: any) {\n-  let graph = 'graph LR\\n';\n-  const nodes = new Map<string, Set<string>>(); // 文件 -> 导出项集合\n-  const externalDeps = new Set<string>(); // 外部依赖库\n-  const edges = new Set<string>();\n-\n-  // 忽略的文件类型\n-  const ignoredExtensions = ['.css', '.less', '.scss', '.sass', '.style', '.styles'];\n-\n-  // 判断是否为样式文件\n-  const isStyleFile = (path: string) => {\n-    return ignoredExtensions.some(ext =>\n-      path.toLowerCase().endsWith(ext) || path.toLowerCase().includes(ext + '.')\n-    );\n-  };\n-\n-  // 第一遍扫描：收集所有文件及其导出项\n-  result.content.split('File: ').forEach((section: string) => {\n-    if (!section) return;\n-    const lines = section.split('\\n');\n-    const filePath = lines[0].trim();\n-\n-    // 跳过样式文件\n-    if (isStyleFile(filePath)) return;\n-\n-    const exports = new Set<string>();\n-\n-    lines.forEach((line: string) => {\n-      // 收集导出的类\n-      const classMatch = line.match(/export\\s+class\\s+(\\w+)/);\n-      if (classMatch) {\n-        exports.add(classMatch[1]);\n-      }\n-\n-      // 收集导出的类型和接口\n-      const typeMatch = line.match(/export\\s+(type|interface)\\s+(\\w+)/);\n-      if (typeMatch) {\n-        exports.add(typeMatch[2]);\n-      }\n-\n-      // 收集导出的常量和函数\n-      const constMatch = line.match(/export\\s+(?:const|function)\\s+(\\w+)/);\n-      if (constMatch) {\n-        exports.add(constMatch[1]);\n-      }\n-    });\n-\n-    nodes.set(filePath, exports);\n-  });\n-\n-  // 生成节点ID映射\n-  const nodeIds = new Map<string, string>();\n-  Array.from(nodes.keys()).forEach((file, index) => {\n-    nodeIds.set(file, `n${index}`);\n-  });\n-\n-  // 添加文件节点\n-  nodes.forEach((exports, file) => {\n-    const nodeId = nodeIds.get(file) || '';\n-    graph += `  ${nodeId}[\"${file}\"]\\n`;\n-  });\n-\n-  // 添加外部依赖节点\n-  let externalNodeCount = 0;\n-  const externalNodeIds = new Map<string, string>();\n-\n-  // 修改解析导入路径函数\n-  function resolveImportPath(currentFile: string, importPath: string): string | null {\n-    if (!importPath.startsWith('.')) {\n-      return null; // 忽略非相对路径导入\n-    }\n-\n-    // 获取当前文件的目录和导入路径的分解\n-    const currentDir = currentFile.split('/').slice(0, -1).join('/');\n-    const importParts = importPath.split('/');\n-    const importFileName = importParts.pop() || '';\n-    const importDirPath = importParts.join('/');\n-\n-    // 解析基础目录路径\n-    let resolvedBasePath = importPath.startsWith('./')\n-      ? join(currentDir, importDirPath).replace(/\\\\/g, '/')\n-      : importPath.startsWith('../')\n-        ? join(currentDir, '..', importDirPath).replace(/\\\\/g, '/')\n-        : join(currentDir, importDirPath).replace(/\\\\/g, '/');\n-\n-    // 规范化路径\n-    resolvedBasePath = resolvedBasePath.split('/').reduce((acc: string[], part: string) => {\n-      if (part === '..') {\n-        acc.pop();\n-      } else if (part !== '.') {\n-        acc.push(part);\n-      }\n-      return acc;\n-    }, []).join('/');\n-\n-    // 如果文件名已有扩展名，直接返回完整路径\n-    if (importFileName.includes('.')) {\n-      return join(resolvedBasePath, importFileName).replace(/\\\\/g, '/');\n-    }\n-\n-    // 尝试不同的可能性\n-    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue'];\n-\n-    // 1. 尝试直接添加扩展名\n-    for (const ext of extensions) {\n-      const pathWithExt = join(resolvedBasePath, importFileName + ext).replace(/\\\\/g, '/');\n-      // 检查完整路径和相对路径\n-      const possiblePaths = [\n-        pathWithExt,\n-        pathWithExt.replace(/^.*?\\/src\\//, 'src/'), // 尝试从 src 开始的路径\n-        pathWithExt.replace(/^.*?\\/src\\//, '')      // 尝试不带 src 的路径\n-      ];\n-\n-      for (const path of possiblePaths) {\n-        if (nodes.has(path)) {\n-          return path;\n-        }\n-      }\n-    }\n-\n-    // 2. 尝试查找 index 文件\n-    for (const ext of extensions) {\n-      const indexPath = join(resolvedBasePath, importFileName, 'index' + ext).replace(/\\\\/g, '/');\n-      // 同样检查完整路径和相对路径\n-      const possiblePaths = [\n-        indexPath,\n-        indexPath.replace(/^.*?\\/src\\//, 'src/'), // 尝试从 src 开始的路径\n-        indexPath.replace(/^.*?\\/src\\//, '')      // 尝试不带 src 的路径\n-      ];\n-\n-      for (const path of possiblePaths) {\n-        if (nodes.has(path)) {\n-          return path;\n-        }\n-      }\n-    }\n-\n-    // 如果都没找到，返回最可能的路径（用于显示在图中）\n-    const defaultPath = join(resolvedBasePath, importFileName + '.ts').replace(/\\\\/g, '/');\n-    return defaultPath.replace(/^.*?\\/src\\//, 'src/'); // 默认使用 src 开头的路径\n-  }\n-\n-  // 第二遍扫描：分析导入关系\n-  result.content.split('File: ').forEach((section: string) => {\n-    if (!section) return;\n-    const lines = section.split('\\n');\n-    const currentFile = lines[0].trim();\n-\n-    // 跳过样式文件\n-    if (isStyleFile(currentFile)) return;\n-\n-    const currentId = nodeIds.get(currentFile);\n-    if (!currentId) return;\n-\n-    lines.forEach((line: string) => {\n-      // 匹配所有类型的导入语句\n-      const importMatches = [\n-        // 具名导入: import { x } from 'y'\n-        line.match(/import\\s+{([^}]+)}\\s+from\\s+['\"]([^'\"]+)['\"]/),\n-        // 默认导入: import x from 'y'\n-        line.match(/import\\s+(\\w+)\\s+from\\s+['\"]([^'\"]+)['\"]/),\n-        // 命名空间导入: import * as x from 'y'\n-        line.match(/import\\s+\\*\\s+as\\s+\\w+\\s+from\\s+['\"]([^'\"]+)['\"]/),\n-        // 副作用导入: import 'y'\n-        line.match(/import\\s+['\"]([^'\"]+)['\"]/),\n-        // 类型导入: import type { x } from 'y'\n-        line.match(/import\\s+type\\s+{([^}]+)}\\s+from\\s+['\"]([^'\"]+)['\"]/),\n-      ].filter(Boolean);\n-\n-      for (const match of importMatches) {\n-        if (!match) continue;\n-\n-        // 获取导入路径 (最后一个捕获组总是路径)\n-        const from = match[match.length - 1];\n-\n-        // 跳过样式文件的导入\n-        if (isStyleFile(from)) continue;\n-\n-        // 处理外部库导入\n-        if (!from.startsWith('.')) {\n-          if (!externalNodeIds.has(from)) {\n-            const extId = `ext${externalNodeCount++}`;\n-            externalNodeIds.set(from, extId);\n-            graph += `  ${extId}[\"${from}\"]\\n`;\n-          }\n-          graph += `  ${currentId} --> ${externalNodeIds.get(from)}\\n`;\n-          continue;\n-        }\n-\n-        // 处理相对路径导入\n-        const importPath = resolveImportPath(currentFile, from);\n-        if (importPath && !isStyleFile(importPath)) {\n-          const targetId = nodeIds.get(importPath);\n-          if (targetId) {\n-            graph += `  ${currentId} --> ${targetId}\\n`;\n-          }\n-        }\n-      }\n-    });\n-  });\n-\n-  return graph;\n-}\n-\n-router.post('/analyze/github', async (ctx) => {\n-  const { url, branch, targetPaths } = ctx.request.body as {\n-    url?: string;\n-    branch?: string;\n-    targetPaths?: string;\n-  };\n-\n-  if (!url) {\n-    ctx.status = 400;\n-    ctx.body = {\n-      success: false,\n-      error: '仓库 URL 不能为空'\n-    };\n-    return;\n-  }\n-\n-  const result = await ingest.analyzeFromUrl(url, {\n-    branch,\n-    targetPaths: processTargetPaths(targetPaths),\n-    maxFileSize: 500 * 1024 // 500KB\n-  });\n-\n-  result.content = formatFileContent(result.content);\n-\n-  // 使用新的处理函数\n-  ctx.body = {\n-    success: true,\n-    data: await processAnalysisResult(result)\n-  };\n-});\n-\n-// 添加新的路由处理 /:owner/:repo 格式的请求\n-router.get('/:owner/:repo', async (ctx) => {\n-  const { owner, repo } = ctx.params;\n-  const githubUrl = `https://github.com/${owner}/${repo}`;\n-\n-  try {\n-    // 分析仓库\n-    const result = await ingest.analyzeFromUrl(githubUrl, {\n-      maxFileSize: 500 * 1024 // 500KB\n-    });\n-\n-    // 渲染 HTML 页面\n-    const html = `\n-    <!DOCTYPE html>\n-    <html lang=\"zh-CN\">\n-    <head>\n-      <meta charset=\"UTF-8\">\n-      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n-      <title>${owner}/${repo} - GitIngest 分析结果</title>\n-      <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css\" rel=\"stylesheet\">\n-      <style>\n-        .tree-view { font-family: monospace; white-space: pre; }\n-        .code-block { font-family: monospace; white-space: pre-wrap; max-height: 400px; overflow-y: auto; }\n-      </style>\n-    </head>\n-    <body class=\"bg-gray-100\">\n-      <div class=\"container mx-auto px-4 py-8\">\n-        <h1 class=\"text-4xl font-bold text-center mb-8\">${owner}/${repo}</h1>\n-        \n-        <div class=\"bg-white rounded-lg shadow-lg p-6 mb-8\">\n-          <!-- 基本信息 -->\n-          <div class=\"mb-6\">\n-            <h3 class=\"text-xl font-semibold mb-2\">基本信息</h3>\n-            <div class=\"bg-gray-50 p-4 rounded\">\n-              文件数: ${result.metadata.files}\n-              总大小: ${result.metadata.size} bytes\n-              预估Token数: ${result.metadata.tokens}\n-            </div>\n-          </div>\n-\n-          <!-- 文件树 -->\n-          <div class=\"mb-6\">\n-            <h3 class=\"text-xl font-semibold mb-2\">文件树</h3>\n-            <div class=\"bg-gray-50 p-4 rounded tree-view\">${result.tree}</div>\n-          </div>\n-\n-          <!-- 项目概要 -->\n-          <div class=\"mb-6\">\n-            <h3 class=\"text-xl font-semibold mb-2\">项目概要</h3>\n-            <div class=\"bg-gray-50 p-4 rounded whitespace-pre-line\">${result.summary}</div>\n-          </div>\n-\n-          <!-- 文件内容 -->\n-          <div>\n-            <h3 class=\"text-xl font-semibold mb-2\">文件内容</h3>\n-            <div class=\"space-y-4\">\n-              ${result.content\n-        .split(/File: /)\n-        .filter(Boolean)\n-        .map(section => {\n-          const lines = section.split('\\n');\n-          const filePath = lines[0].trim();\n-          const content = lines.slice(2).join('\\n').trim();\n-          return `\n-                    <div class=\"bg-gray-50 p-4 rounded\">\n-                      <div class=\"font-semibold mb-2 text-blue-600\">${filePath}</div>\n-                      <div class=\"code-block bg-gray-100 p-4 rounded\">${content}</div>\n-                    </div>\n-                  `;\n-        })\n-        .join('')}\n-            </div>\n-          </div>\n-        </div>\n-      </div>\n-    </body>\n-    </html>\n-    `;\n-\n-    ctx.type = 'html';\n-    ctx.body = html;\n-  } catch (error) {\n-    ctx.status = 500;\n-    ctx.body = {\n-      success: false,\n-      // error: error.message\n-    };\n-  }\n-});\n-\n-// 健康检查接口\n-router.get('/health', (ctx) => {\n-  ctx.body = {\n-    success: true,\n-    timestamp: new Date().toISOString(),\n-    status: 'running'\n-  };\n-});\n-\n-// 注册路由\n-app.use(router.routes()).use(router.allowedMethods());\n-\n-// 全局错误事件监听\n-app.on('error', (err, ctx) => {\n-  console.error('服务器错误:', err);\n-});\n-\n-// 启动服务器\n-const PORT = process.env.PORT || 3000;\n-app.listen(PORT, () => {\n-  console.log(`[${new Date().toISOString()}] 服务器启动成功: http://localhost:${PORT}`);\n-}); \n\\ No newline at end of file"
          },
          {
              "sha": "8df9522b88dd2f9a306c0c149da73ac5996d9e50",
              "filename": "package.json",
              "status": "modified",
              "additions": 28,
              "deletions": 27,
              "changes": 55,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/package.json",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/package.json",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/package.json?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -1,6 +1,7 @@\n {\n-  \"name\": \"gitingest-ts\",\n-  \"version\": \"0.1.0\",\n+  \"name\": \"git-analyze\",\n+  \"version\": \"1.0.4\",\n+  \"description\": \"A tool for analyzing Git repositories \",\n   \"type\": \"module\",\n   \"main\": \"./dist/index.js\",\n   \"types\": \"./dist/index.d.ts\",\n@@ -15,38 +16,38 @@\n   ],\n   \"scripts\": {\n     \"dev\": \"tsup src/index.ts --format esm --watch\",\n-    \"build\": \"tsup src/index.ts --format esm --dts --clean\",\n-    \"lint\": \"eslint src --ext .ts\",\n-    \"format\": \"prettier --write \\\"src/**/*.ts\\\"\",\n-    \"test:example\": \"tsx examples/scanner.ts\",\n-    \"test:dependency\": \"tsx examples/test/dependency-analysis.ts\",\n-    \"test:branch\": \"tsx examples/test/branch-analysis.ts\",\n-    \"web:dev\": \"tsx examples/web/server.ts\",\n-    \"web:build\": \"tsup examples/web/server.ts --format esm --dts --clean\"\n+    \"build\": \"tsup src/index.ts --format esm --dts\"\n   },\n   \"dependencies\": {\n-    \"@koa/cors\": \"^5.0.0\",\n-    \"@koa/router\": \"^13.1.0\",\n-    \"@types/koa\": \"^2.15.0\",\n-    \"@types/koa__router\": \"^12.0.4\",\n-    \"@vue/compiler-sfc\": \"^3.5.13\",\n-    \"dotenv\": \"^16.4.7\",\n+    \"crypto\": \"^1.0.1\",\n+    \"dependency-cruiser\": \"^16.10.0\",\n     \"glob\": \"^11.0.0\",\n-    \"koa\": \"^2.15.3\",\n-    \"koa-body\": \"^6.0.1\",\n-    \"koa-static\": \"^5.0.0\",\n     \"simple-git\": \"^3.27.0\",\n+    \"tree-sitter\": \"^0.22.4\",\n+    \"tree-sitter-javascript\": \"^0.23.1\",\n+    \"tree-sitter-python\": \"^0.23.6\",\n+    \"tree-sitter-typescript\": \"^0.23.2\",\n     \"typescript\": \"^5.7.2\"\n   },\n   \"devDependencies\": {\n-    \"@types/koa-static\": \"^4.0.4\",\n-    \"@types/koa__cors\": \"^5.0.0\",\n-    \"@types/node\": \"^22.10.2\",\n-    \"@typescript-eslint/eslint-plugin\": \"^8.18.2\",\n-    \"@typescript-eslint/parser\": \"^8.18.2\",\n-    \"eslint\": \"^9.17.0\",\n-    \"prettier\": \"^3.4.2\",\n+    \"@types/node\": \"^22.13.8\",\n     \"tsup\": \"^8.3.5\",\n     \"tsx\": \"^4.19.2\"\n-  }\n+  },\n+  \"author\": \"Gijela\",\n+  \"keywords\": [\n+    \"git\",\n+    \"analysis\",\n+    \"ingest\",\n+    \"code review\"\n+  ],\n+  \"repository\": {\n+    \"type\": \"git\",\n+    \"url\": \"git+https://github.com/Gijela/git-analyze.git\"\n+  },\n+  \"license\": \"MIT\",\n+  \"bugs\": {\n+    \"url\": \"https://github.com/Gijela/git-analyze/issues\"\n+  },\n+  \"homepage\": \"https://github.com/Gijela/git-analyze#readme\"\n }"
          },
          {
              "sha": "25af888a5abfedd935c503721fa1fc48c612e09d",
              "filename": "pnpm-lock.yaml",
              "status": "modified",
              "additions": 317,
              "deletions": 1700,
              "changes": 2017,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/pnpm-lock.yaml",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/pnpm-lock.yaml",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/pnpm-lock.yaml?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -8,90 +8,46 @@ importers:\n \n   .:\n     dependencies:\n-      '@koa/cors':\n-        specifier: ^5.0.0\n-        version: 5.0.0\n-      '@koa/router':\n-        specifier: ^13.1.0\n-        version: 13.1.0\n-      '@types/koa':\n-        specifier: ^2.15.0\n-        version: 2.15.0\n-      '@types/koa__router':\n-        specifier: ^12.0.4\n-        version: 12.0.4\n-      '@vue/compiler-sfc':\n-        specifier: ^3.5.13\n-        version: 3.5.13\n-      dotenv:\n-        specifier: ^16.4.7\n-        version: 16.4.7\n+      crypto:\n+        specifier: ^1.0.1\n+        version: 1.0.1\n+      dependency-cruiser:\n+        specifier: ^16.10.0\n+        version: 16.10.0\n       glob:\n         specifier: ^11.0.0\n         version: 11.0.0\n-      koa:\n-        specifier: ^2.15.3\n-        version: 2.15.3\n-      koa-body:\n-        specifier: ^6.0.1\n-        version: 6.0.1\n-      koa-static:\n-        specifier: ^5.0.0\n-        version: 5.0.0\n       simple-git:\n         specifier: ^3.27.0\n         version: 3.27.0\n+      tree-sitter:\n+        specifier: ^0.22.4\n+        version: 0.22.4\n+      tree-sitter-javascript:\n+        specifier: ^0.23.1\n+        version: 0.23.1(tree-sitter@0.22.4)\n+      tree-sitter-python:\n+        specifier: ^0.23.6\n+        version: 0.23.6(tree-sitter@0.22.4)\n+      tree-sitter-typescript:\n+        specifier: ^0.23.2\n+        version: 0.23.2(tree-sitter@0.22.4)\n       typescript:\n         specifier: ^5.7.2\n         version: 5.7.2\n     devDependencies:\n-      '@types/koa-static':\n-        specifier: ^4.0.4\n-        version: 4.0.4\n-      '@types/koa__cors':\n-        specifier: ^5.0.0\n-        version: 5.0.0\n       '@types/node':\n-        specifier: ^22.10.2\n-        version: 22.10.2\n-      '@typescript-eslint/eslint-plugin':\n-        specifier: ^8.18.2\n-        version: 8.18.2(@typescript-eslint/parser@8.18.2(eslint@9.17.0)(typescript@5.7.2))(eslint@9.17.0)(typescript@5.7.2)\n-      '@typescript-eslint/parser':\n-        specifier: ^8.18.2\n-        version: 8.18.2(eslint@9.17.0)(typescript@5.7.2)\n-      eslint:\n-        specifier: ^9.17.0\n-        version: 9.17.0\n-      prettier:\n-        specifier: ^3.4.2\n-        version: 3.4.2\n+        specifier: ^22.13.8\n+        version: 22.13.8\n       tsup:\n         specifier: ^8.3.5\n-        version: 8.3.5(postcss@8.4.49)(tsx@4.19.2)(typescript@5.7.2)\n+        version: 8.3.5(postcss@8.5.3)(tsx@4.19.2)(typescript@5.7.2)\n       tsx:\n         specifier: ^4.19.2\n         version: 4.19.2\n \n packages:\n \n-  '@babel/helper-string-parser@7.25.9':\n-    resolution: {integrity: sha512-4A/SCr/2KLd5jrtOMFzaKjVtAei3+2r/NChoBNoZ3EyP/+GlhoaEGoWOZUmFmoITP7zOJyHIMm+DYRd8o3PvHA==}\n-    engines: {node: '>=6.9.0'}\n-\n-  '@babel/helper-validator-identifier@7.25.9':\n-    resolution: {integrity: sha512-Ed61U6XJc3CVRfkERJWDz4dJwKe7iLmmJsbOGu9wSloNSFttHV0I8g6UAgb7qnK5ly5bGLPd4oXZlxCdANBOWQ==}\n-    engines: {node: '>=6.9.0'}\n-\n-  '@babel/parser@7.26.3':\n-    resolution: {integrity: sha512-WJ/CvmY8Mea8iDXo6a7RK2wbmJITT5fN3BEkRuFlxVyNx8jOKIIhmC4fSkTcPcf8JyavbBwIe6OpiCOBXt/IcA==}\n-    engines: {node: '>=6.0.0'}\n-    hasBin: true\n-\n-  '@babel/types@7.26.3':\n-    resolution: {integrity: sha512-vN5p+1kl59GVKMvTHt55NzzmYVxprfJD+ql7U9NFIfKCBkYE55LYtS+WtPlaYOyzydrKI8Nezd+aZextrd+FMA==}\n-    engines: {node: '>=6.9.0'}\n-\n   '@esbuild/aix-ppc64@0.23.1':\n     resolution: {integrity: sha512-6VhYk1diRqrhBAqpJEdjASR/+WVRtfjpqKuNw11cLiaWpAT/Uu+nokB+UJnevzy/P9C/ty6AOe0dwueMrGh/iQ==}\n     engines: {node: '>=18'}\n@@ -386,63 +342,6 @@ packages:\n     cpu: [x64]\n     os: [win32]\n \n-  '@eslint-community/eslint-utils@4.4.1':\n-    resolution: {integrity: sha512-s3O3waFUrMV8P/XaF/+ZTp1X9XBZW1a4B97ZnjQF2KYWaFD2A8KyFBsrsfSjEmjn3RGWAIuvlneuZm3CUK3jbA==}\n-    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}\n-    peerDependencies:\n-      eslint: ^6.0.0 || ^7.0.0 || >=8.0.0\n-\n-  '@eslint-community/regexpp@4.12.1':\n-    resolution: {integrity: sha512-CCZCDJuduB9OUkFkY2IgppNZMi2lBQgD2qzwXkEia16cge2pijY/aXi96CJMquDMn3nJdlPV1A5KrJEXwfLNzQ==}\n-    engines: {node: ^12.0.0 || ^14.0.0 || >=16.0.0}\n-\n-  '@eslint/config-array@0.19.1':\n-    resolution: {integrity: sha512-fo6Mtm5mWyKjA/Chy1BYTdn5mGJoDNjC7C64ug20ADsRDGrA85bN3uK3MaKbeRkRuuIEAR5N33Jr1pbm411/PA==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@eslint/core@0.9.1':\n-    resolution: {integrity: sha512-GuUdqkyyzQI5RMIWkHhvTWLCyLo1jNK3vzkSyaExH5kHPDHcuL2VOpHjmMY+y3+NC69qAKToBqldTBgYeLSr9Q==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@eslint/eslintrc@3.2.0':\n-    resolution: {integrity: sha512-grOjVNN8P3hjJn/eIETF1wwd12DdnwFDoyceUJLYYdkpbwq3nLi+4fqrTAONx7XDALqlL220wC/RHSC/QTI/0w==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@eslint/js@9.17.0':\n-    resolution: {integrity: sha512-Sxc4hqcs1kTu0iID3kcZDW3JHq2a77HO9P8CP6YEA/FpH3Ll8UXE2r/86Rz9YJLKme39S9vU5OWNjC6Xl0Cr3w==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@eslint/object-schema@2.1.5':\n-    resolution: {integrity: sha512-o0bhxnL89h5Bae5T318nFoFzGy+YE5i/gGkoPAgkmTVdRKTiv3p8JHevPiPaMwoloKfEiiaHlawCqaZMqRm+XQ==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@eslint/plugin-kit@0.2.4':\n-    resolution: {integrity: sha512-zSkKow6H5Kdm0ZUQUB2kV5JIXqoG0+uH5YADhaEHswm664N9Db8dXSi0nMJpacpMf+MyyglF1vnZohpEg5yUtg==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@hapi/bourne@3.0.0':\n-    resolution: {integrity: sha512-Waj1cwPXJDucOib4a3bAISsKJVb15MKi9IvmTI/7ssVEm6sywXGjVJDhl6/umt1pK1ZS7PacXU3A1PmFKHEZ2w==}\n-\n-  '@humanfs/core@0.19.1':\n-    resolution: {integrity: sha512-5DyQ4+1JEUzejeK1JGICcideyfUbGixgS9jNgex5nqkW+cY7WZhxBigmieN5Qnw9ZosSNVC9KQKyb+GUaGyKUA==}\n-    engines: {node: '>=18.18.0'}\n-\n-  '@humanfs/node@0.16.6':\n-    resolution: {integrity: sha512-YuI2ZHQL78Q5HbhDiBA1X4LmYdXCKCMQIfw0pw7piHJwyREFebJUvrQN4cMssyES6x+vfUbx1CIpaQUKYdQZOw==}\n-    engines: {node: '>=18.18.0'}\n-\n-  '@humanwhocodes/module-importer@1.0.1':\n-    resolution: {integrity: sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==}\n-    engines: {node: '>=12.22'}\n-\n-  '@humanwhocodes/retry@0.3.1':\n-    resolution: {integrity: sha512-JBxkERygn7Bv/GbN5Rv8Ul6LVknS+5Bp6RgDC/O8gEBU/yeH5Ui5C/OlWrTb6qct7LjjfT6Re2NxB0ln0yYybA==}\n-    engines: {node: '>=18.18'}\n-\n-  '@humanwhocodes/retry@0.4.1':\n-    resolution: {integrity: sha512-c7hNEllBlenFTHBky65mhq8WD2kbN9Q6gk0bTk8lSBvc554jpXSkST1iePudpt7+A/AQvuHs9EMqjHDXMY1lrA==}\n-    engines: {node: '>=18.18'}\n-\n   '@isaacs/cliui@8.0.2':\n     resolution: {integrity: sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==}\n     engines: {node: '>=12'}\n@@ -465,32 +364,12 @@ packages:\n   '@jridgewell/trace-mapping@0.3.25':\n     resolution: {integrity: sha512-vNk6aEwybGtawWmy/PzwnGDOjCkLWSD2wqvjGGAgOAwCGWySYXfYoxt00IJkTF+8Lb57DwOb3Aa0o9CApepiYQ==}\n \n-  '@koa/cors@5.0.0':\n-    resolution: {integrity: sha512-x/iUDjcS90W69PryLDIMgFyV21YLTnG9zOpPXS7Bkt2b8AsY3zZsIpOLBkYr9fBcF3HbkKaER5hOBZLfpLgYNw==}\n-    engines: {node: '>= 14.0.0'}\n-\n-  '@koa/router@13.1.0':\n-    resolution: {integrity: sha512-mNVu1nvkpSd8Q8gMebGbCkDWJ51ODetrFvLKYusej+V0ByD4btqHYnPIzTBLXnQMVUlm/oxVwqmWBY3zQfZilw==}\n-    engines: {node: '>= 18'}\n-\n   '@kwsites/file-exists@1.1.1':\n     resolution: {integrity: sha512-m9/5YGR18lIwxSFDwfE3oA7bWuq9kdau6ugN4H2rJeyhFQZcG9AgSHkQtSD15a8WvTgfz9aikZMrKPHvbpqFiw==}\n \n   '@kwsites/promise-deferred@1.1.1':\n     resolution: {integrity: sha512-GaHYm+c0O9MjZRu0ongGBRbinu8gVAMd2UZjji6jVmqKtZluZnptXGWhz1E8j8D2HJ3f/yMxKAUC0b+57wncIw==}\n \n-  '@nodelib/fs.scandir@2.1.5':\n-    resolution: {integrity: sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==}\n-    engines: {node: '>= 8'}\n-\n-  '@nodelib/fs.stat@2.0.5':\n-    resolution: {integrity: sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==}\n-    engines: {node: '>= 8'}\n-\n-  '@nodelib/fs.walk@1.2.8':\n-    resolution: {integrity: sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==}\n-    engines: {node: '>= 8'}\n-\n   '@pkgjs/parseargs@0.11.0':\n     resolution: {integrity: sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==}\n     engines: {node: '>=14'}\n@@ -529,61 +408,51 @@ packages:\n     resolution: {integrity: sha512-Py5vFd5HWYN9zxBv3WMrLAXY3yYJ6Q/aVERoeUFwiDGiMOWsMs7FokXihSOaT/PMWUty/Pj60XDQndK3eAfE6A==}\n     cpu: [arm]\n     os: [linux]\n-    libc: [glibc]\n \n   '@rollup/rollup-linux-arm-musleabihf@4.29.1':\n     resolution: {integrity: sha512-RiWpGgbayf7LUcuSNIbahr0ys2YnEERD4gYdISA06wa0i8RALrnzflh9Wxii7zQJEB2/Eh74dX4y/sHKLWp5uQ==}\n     cpu: [arm]\n     os: [linux]\n-    libc: [musl]\n \n   '@rollup/rollup-linux-arm64-gnu@4.29.1':\n     resolution: {integrity: sha512-Z80O+taYxTQITWMjm/YqNoe9d10OX6kDh8X5/rFCMuPqsKsSyDilvfg+vd3iXIqtfmp+cnfL1UrYirkaF8SBZA==}\n     cpu: [arm64]\n     os: [linux]\n-    libc: [glibc]\n \n   '@rollup/rollup-linux-arm64-musl@4.29.1':\n     resolution: {integrity: sha512-fOHRtF9gahwJk3QVp01a/GqS4hBEZCV1oKglVVq13kcK3NeVlS4BwIFzOHDbmKzt3i0OuHG4zfRP0YoG5OF/rA==}\n     cpu: [arm64]\n     os: [linux]\n-    libc: [musl]\n \n   '@rollup/rollup-linux-loongarch64-gnu@4.29.1':\n     resolution: {integrity: sha512-5a7q3tnlbcg0OodyxcAdrrCxFi0DgXJSoOuidFUzHZ2GixZXQs6Tc3CHmlvqKAmOs5eRde+JJxeIf9DonkmYkw==}\n     cpu: [loong64]\n     os: [linux]\n-    libc: [glibc]\n \n   '@rollup/rollup-linux-powerpc64le-gnu@4.29.1':\n     resolution: {integrity: sha512-9b4Mg5Yfz6mRnlSPIdROcfw1BU22FQxmfjlp/CShWwO3LilKQuMISMTtAu/bxmmrE6A902W2cZJuzx8+gJ8e9w==}\n     cpu: [ppc64]\n     os: [linux]\n-    libc: [glibc]\n \n   '@rollup/rollup-linux-riscv64-gnu@4.29.1':\n     resolution: {integrity: sha512-G5pn0NChlbRM8OJWpJFMX4/i8OEU538uiSv0P6roZcbpe/WfhEO+AT8SHVKfp8qhDQzaz7Q+1/ixMy7hBRidnQ==}\n     cpu: [riscv64]\n     os: [linux]\n-    libc: [glibc]\n \n   '@rollup/rollup-linux-s390x-gnu@4.29.1':\n     resolution: {integrity: sha512-WM9lIkNdkhVwiArmLxFXpWndFGuOka4oJOZh8EP3Vb8q5lzdSCBuhjavJsw68Q9AKDGeOOIHYzYm4ZFvmWez5g==}\n     cpu: [s390x]\n     os: [linux]\n-    libc: [glibc]\n \n   '@rollup/rollup-linux-x64-gnu@4.29.1':\n     resolution: {integrity: sha512-87xYCwb0cPGZFoGiErT1eDcssByaLX4fc0z2nRM6eMtV9njAfEE6OW3UniAoDhX4Iq5xQVpE6qO9aJbCFumKYQ==}\n     cpu: [x64]\n     os: [linux]\n-    libc: [glibc]\n \n   '@rollup/rollup-linux-x64-musl@4.29.1':\n     resolution: {integrity: sha512-xufkSNppNOdVRCEC4WKvlR1FBDyqCSCpQeMMgv9ZyXqqtKBfkw1yfGMTUTs9Qsl6WQbJnsGboWCp7pJGkeMhKA==}\n     cpu: [x64]\n     os: [linux]\n-    libc: [musl]\n \n   '@rollup/rollup-win32-arm64-msvc@4.29.1':\n     resolution: {integrity: sha512-F2OiJ42m77lSkizZQLuC+jiZ2cgueWQL5YC9tjo3AgaEw+KJmVxHGSyQfDUoYR9cci0lAywv2Clmckzulcq6ig==}\n@@ -600,162 +469,35 @@ packages:\n     cpu: [x64]\n     os: [win32]\n \n-  '@types/accepts@1.3.7':\n-    resolution: {integrity: sha512-Pay9fq2lM2wXPWbteBsRAGiWH2hig4ZE2asK+mm7kUzlxRTfL961rj89I6zV/E3PcIkDqyuBEcMxFT7rccugeQ==}\n-\n-  '@types/body-parser@1.19.5':\n-    resolution: {integrity: sha512-fB3Zu92ucau0iQ0JMCFQE7b/dv8Ot07NI3KaZIkIUNXq82k4eBAqUaneXfleGY9JWskeS9y+u0nXMyspcuQrCg==}\n-\n-  '@types/co-body@6.1.3':\n-    resolution: {integrity: sha512-UhuhrQ5hclX6UJctv5m4Rfp52AfG9o9+d9/HwjxhVB5NjXxr5t9oKgJxN8xRHgr35oo8meUEHUPFWiKg6y71aA==}\n-\n-  '@types/connect@3.4.38':\n-    resolution: {integrity: sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==}\n-\n-  '@types/content-disposition@0.5.8':\n-    resolution: {integrity: sha512-QVSSvno3dE0MgO76pJhmv4Qyi/j0Yk9pBp0Y7TJ2Tlj+KCgJWY6qX7nnxCOLkZ3VYRSIk1WTxCvwUSdx6CCLdg==}\n-\n-  '@types/cookies@0.9.0':\n-    resolution: {integrity: sha512-40Zk8qR147RABiQ7NQnBzWzDcjKzNrntB5BAmeGCb2p/MIyOE+4BVvc17wumsUqUw00bJYqoXFHYygQnEFh4/Q==}\n-\n   '@types/estree@1.0.6':\n     resolution: {integrity: sha512-AYnb1nQyY49te+VRAVgmzfcgjYS91mY5P0TKUDCLEM+gNnA+3T6rWITXRLYCpahpqSQbN5cE+gHpnPyXjHWxcw==}\n \n-  '@types/express-serve-static-core@5.0.2':\n-    resolution: {integrity: sha512-vluaspfvWEtE4vcSDlKRNer52DvOGrB2xv6diXy6UKyKW0lqZiWHGNApSyxOv+8DE5Z27IzVvE7hNkxg7EXIcg==}\n-\n-  '@types/express@5.0.0':\n-    resolution: {integrity: sha512-DvZriSMehGHL1ZNLzi6MidnsDhUZM/x2pRdDIKdwbUNqqwHxMlRdkxtn6/EPKyqKpHqTl/4nRZsRNLpZxZRpPQ==}\n-\n-  '@types/formidable@2.0.6':\n-    resolution: {integrity: sha512-L4HcrA05IgQyNYJj6kItuIkXrInJvsXTPC5B1i64FggWKKqSL+4hgt7asiSNva75AoLQjq29oPxFfU4GAQ6Z2w==}\n-\n-  '@types/http-assert@1.5.6':\n-    resolution: {integrity: sha512-TTEwmtjgVbYAzZYWyeHPrrtWnfVkm8tQkP8P21uQifPgMRgjrow3XDEYqucuC8SKZJT7pUnhU/JymvjggxO9vw==}\n-\n-  '@types/http-errors@2.0.4':\n-    resolution: {integrity: sha512-D0CFMMtydbJAegzOyHjtiKPLlvnm3iTZyZRSZoLq2mRhDdmLfIWOCYPfQJ4cu2erKghU++QvjcUjp/5h7hESpA==}\n-\n-  '@types/json-schema@7.0.15':\n-    resolution: {integrity: sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==}\n-\n-  '@types/keygrip@1.0.6':\n-    resolution: {integrity: sha512-lZuNAY9xeJt7Bx4t4dx0rYCDqGPW8RXhQZK1td7d4H6E9zYbLoOtjBvfwdTKpsyxQI/2jv+armjX/RW+ZNpXOQ==}\n-\n-  '@types/koa-compose@3.2.8':\n-    resolution: {integrity: sha512-4Olc63RY+MKvxMwVknCUDhRQX1pFQoBZ/lXcRLP69PQkEpze/0cr8LNqJQe5NFb/b19DWi2a5bTi2VAlQzhJuA==}\n-\n-  '@types/koa-send@4.1.6':\n-    resolution: {integrity: sha512-vgnNGoOJkx7FrF0Jl6rbK1f8bBecqAchKpXtKuXzqIEdXTDO6dsSTjr+eZ5m7ltSjH4K/E7auNJEQCAd0McUPA==}\n-\n-  '@types/koa-static@4.0.4':\n-    resolution: {integrity: sha512-j1AUzzl7eJYEk9g01hNTlhmipFh8RFbOQmaMNLvLcNNAkPw0bdTs3XTa3V045XFlrWN0QYnblbDJv2RzawTn6A==}\n-\n-  '@types/koa@2.15.0':\n-    resolution: {integrity: sha512-7QFsywoE5URbuVnG3loe03QXuGajrnotr3gQkXcEBShORai23MePfFYdhz90FEtBBpkyIYQbVD+evKtloCgX3g==}\n-\n-  '@types/koa__cors@5.0.0':\n-    resolution: {integrity: sha512-LCk/n25Obq5qlernGOK/2LUwa/2YJb2lxHUkkvYFDOpLXlVI6tKcdfCHRBQnOY4LwH6el5WOLs6PD/a8Uzau6g==}\n-\n-  '@types/koa__router@12.0.4':\n-    resolution: {integrity: sha512-Y7YBbSmfXZpa/m5UGGzb7XadJIRBRnwNY9cdAojZGp65Cpe5MAP3mOZE7e3bImt8dfKS4UFcR16SLH8L/z7PBw==}\n-\n-  '@types/mime@1.3.5':\n-    resolution: {integrity: sha512-/pyBZWSLD2n0dcHE3hq8s8ZvcETHtEuF+3E7XVt0Ig2nvsVQXdghHVcEkIWjy9A0wKfTn97a/PSDYohKIlnP/w==}\n-\n-  '@types/node@22.10.2':\n-    resolution: {integrity: sha512-Xxr6BBRCAOQixvonOye19wnzyDiUtTeqldOOmj3CkeblonbccA12PFwlufvRdrpjXxqnmUaeiU5EOA+7s5diUQ==}\n-\n-  '@types/qs@6.9.17':\n-    resolution: {integrity: sha512-rX4/bPcfmvxHDv0XjfJELTTr+iB+tn032nPILqHm5wbthUUUuVtNGGqzhya9XUxjTP8Fpr0qYgSZZKxGY++svQ==}\n-\n-  '@types/range-parser@1.2.7':\n-    resolution: {integrity: sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ==}\n-\n-  '@types/send@0.17.4':\n-    resolution: {integrity: sha512-x2EM6TJOybec7c52BX0ZspPodMsQUd5L6PRwOunVyVUhXiBSKf3AezDL8Dgvgt5o0UfKNfuA0eMLr2wLT4AiBA==}\n-\n-  '@types/serve-static@1.15.7':\n-    resolution: {integrity: sha512-W8Ym+h8nhuRwaKPaDw34QUkwsGi6Rc4yYqvKFo5rm2FUEhCFbzVWrxXUxuKK8TASjWsysJY0nsmNCGhCOIsrOw==}\n-\n-  '@typescript-eslint/eslint-plugin@8.18.2':\n-    resolution: {integrity: sha512-adig4SzPLjeQ0Tm+jvsozSGiCliI2ajeURDGHjZ2llnA+A67HihCQ+a3amtPhUakd1GlwHxSRvzOZktbEvhPPg==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-    peerDependencies:\n-      '@typescript-eslint/parser': ^8.0.0 || ^8.0.0-alpha.0\n-      eslint: ^8.57.0 || ^9.0.0\n-      typescript: '>=4.8.4 <5.8.0'\n-\n-  '@typescript-eslint/parser@8.18.2':\n-    resolution: {integrity: sha512-y7tcq4StgxQD4mDr9+Jb26dZ+HTZ/SkfqpXSiqeUXZHxOUyjWDKsmwKhJ0/tApR08DgOhrFAoAhyB80/p3ViuA==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-    peerDependencies:\n-      eslint: ^8.57.0 || ^9.0.0\n-      typescript: '>=4.8.4 <5.8.0'\n-\n-  '@typescript-eslint/scope-manager@8.18.2':\n-    resolution: {integrity: sha512-YJFSfbd0CJjy14r/EvWapYgV4R5CHzptssoag2M7y3Ra7XNta6GPAJPPP5KGB9j14viYXyrzRO5GkX7CRfo8/g==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@typescript-eslint/type-utils@8.18.2':\n-    resolution: {integrity: sha512-AB/Wr1Lz31bzHfGm/jgbFR0VB0SML/hd2P1yxzKDM48YmP7vbyJNHRExUE/wZsQj2wUCvbWH8poNHFuxLqCTnA==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-    peerDependencies:\n-      eslint: ^8.57.0 || ^9.0.0\n-      typescript: '>=4.8.4 <5.8.0'\n-\n-  '@typescript-eslint/types@8.18.2':\n-    resolution: {integrity: sha512-Z/zblEPp8cIvmEn6+tPDIHUbRu/0z5lqZ+NvolL5SvXWT5rQy7+Nch83M0++XzO0XrWRFWECgOAyE8bsJTl1GQ==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@typescript-eslint/typescript-estree@8.18.2':\n-    resolution: {integrity: sha512-WXAVt595HjpmlfH4crSdM/1bcsqh+1weFRWIa9XMTx/XHZ9TCKMcr725tLYqWOgzKdeDrqVHxFotrvWcEsk2Tg==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-    peerDependencies:\n-      typescript: '>=4.8.4 <5.8.0'\n-\n-  '@typescript-eslint/utils@8.18.2':\n-    resolution: {integrity: sha512-Cr4A0H7DtVIPkauj4sTSXVl+VBWewE9/o40KcF3TV9aqDEOWoXF3/+oRXNby3DYzZeCATvbdksYsGZzplwnK/Q==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-    peerDependencies:\n-      eslint: ^8.57.0 || ^9.0.0\n-      typescript: '>=4.8.4 <5.8.0'\n-\n-  '@typescript-eslint/visitor-keys@8.18.2':\n-    resolution: {integrity: sha512-zORcwn4C3trOWiCqFQP1x6G3xTRyZ1LYydnj51cRnJ6hxBlr/cKPckk+PKPUw/fXmvfKTcw7bwY3w9izgx5jZw==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  '@vue/compiler-core@3.5.13':\n-    resolution: {integrity: sha512-oOdAkwqUfW1WqpwSYJce06wvt6HljgY3fGeM9NcVA1HaYOij3mZG9Rkysn0OHuyUAGMbEbARIpsG+LPVlBJ5/Q==}\n-\n-  '@vue/compiler-dom@3.5.13':\n-    resolution: {integrity: sha512-ZOJ46sMOKUjO3e94wPdCzQ6P1Lx/vhp2RSvfaab88Ajexs0AHeV0uasYhi99WPaogmBlRHNRuly8xV75cNTMDA==}\n-\n-  '@vue/compiler-sfc@3.5.13':\n-    resolution: {integrity: sha512-6VdaljMpD82w6c2749Zhf5T9u5uLBWKnVue6XWxprDobftnletJ8+oel7sexFfM3qIxNmVE7LSFGTpv6obNyaQ==}\n-\n-  '@vue/compiler-ssr@3.5.13':\n-    resolution: {integrity: sha512-wMH6vrYHxQl/IybKJagqbquvxpWCuVYpoUJfCqFZwa/JY1GdATAQ+TgVtgrwwMZ0D07QhA99rs/EAAWfvG6KpA==}\n-\n-  '@vue/shared@3.5.13':\n-    resolution: {integrity: sha512-/hnE/qP5ZoGpol0a5mDi45bOd7t3tjYJBjsgCsivow7D48cJeV5l05RD82lPqi7gRiphZM37rnhW1l6ZoCNNnQ==}\n+  '@types/node@22.13.8':\n+    resolution: {integrity: sha512-G3EfaZS+iOGYWLLRCEAXdWK9my08oHNZ+FHluRiggIYJPOXzhOiDgpVCUHaUvyIC5/fj7C/p637jdzC666AOKQ==}\n \n-  accepts@1.3.8:\n-    resolution: {integrity: sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==}\n-    engines: {node: '>= 0.6'}\n+  acorn-jsx-walk@2.0.0:\n+    resolution: {integrity: sha512-uuo6iJj4D4ygkdzd6jPtcxs8vZgDX9YFIkqczGImoypX2fQ4dVImmu3UzA4ynixCIMTrEOWW+95M2HuBaCEOVA==}\n \n   acorn-jsx@5.3.2:\n     resolution: {integrity: sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==}\n     peerDependencies:\n       acorn: ^6.0.0 || ^7.0.0 || ^8.0.0\n \n+  acorn-loose@8.4.0:\n+    resolution: {integrity: sha512-M0EUka6rb+QC4l9Z3T0nJEzNOO7JcoJlYMrBlyBCiFSXRyxjLKayd4TbQs2FDRWQU1h9FR7QVNHt+PEaoNL5rQ==}\n+    engines: {node: '>=0.4.0'}\n+\n+  acorn-walk@8.3.4:\n+    resolution: {integrity: sha512-ueEepnujpqee2o5aIYnvHU6C0A42MNdsIDeqy5BydrkuC5R1ZuUFnm27EeFJGoEHJQgn3uleRvmTXaJgfXbt4g==}\n+    engines: {node: '>=0.4.0'}\n+\n   acorn@8.14.0:\n     resolution: {integrity: sha512-cl669nCJTZBsL97OF4kUQm5g5hC2uihk0NxY3WENAC0TYdILVkAyHymAntgxGkl7K+t0cXIrH5siy5S4XkFycA==}\n     engines: {node: '>=0.4.0'}\n     hasBin: true\n \n-  ajv@6.12.6:\n-    resolution: {integrity: sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==}\n+  ajv@8.17.1:\n+    resolution: {integrity: sha512-B/gBuNg5SiMTrPkC+A2+cW0RszwxYmn6VYxB/inlBStS5nx6xHIt/ehKRhIMhqusl7a8LjQoZnjCs5vhwxOQ1g==}\n \n   ansi-regex@5.0.1:\n     resolution: {integrity: sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==}\n@@ -776,55 +518,22 @@ packages:\n   any-promise@1.3.0:\n     resolution: {integrity: sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==}\n \n-  argparse@2.0.1:\n-    resolution: {integrity: sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==}\n-\n-  asap@2.0.6:\n-    resolution: {integrity: sha512-BSHWgDSAiKs50o2Re8ppvp3seVHXSRM44cdSsT9FfNEUUZLOGWVCsiWaRPWM1Znn+mqZ1OfVZ3z3DWEzSp7hRA==}\n-\n   balanced-match@1.0.2:\n     resolution: {integrity: sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==}\n \n-  brace-expansion@1.1.11:\n-    resolution: {integrity: sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==}\n-\n   brace-expansion@2.0.1:\n     resolution: {integrity: sha512-XnAIvQ8eM+kC6aULx6wuQiwVsnzsi9d3WxzV3FpWTGA19F621kwdbsAcFKXgKUHZWsy+mY6iL1sHTxWEFCytDA==}\n \n-  braces@3.0.3:\n-    resolution: {integrity: sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==}\n-    engines: {node: '>=8'}\n-\n   bundle-require@5.1.0:\n     resolution: {integrity: sha512-3WrrOuZiyaaZPWiEt4G3+IffISVC9HYlWueJEBWED4ZH4aIAC2PnkdnuRrR94M+w6yGWn4AglWtJtBI8YqvgoA==}\n     engines: {node: ^12.20.0 || ^14.13.1 || >=16.0.0}\n     peerDependencies:\n       esbuild: '>=0.18'\n \n-  bytes@3.1.2:\n-    resolution: {integrity: sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==}\n-    engines: {node: '>= 0.8'}\n-\n   cac@6.7.14:\n     resolution: {integrity: sha512-b6Ilus+c3RrdDk+JhLKUAQfzzgLEPy6wcXqS7f/xe1EETvsDP6GORG7SFuOs6cID5YkqchW/LXZbX5bc8j7ZcQ==}\n     engines: {node: '>=8'}\n \n-  cache-content-type@1.0.1:\n-    resolution: {integrity: sha512-IKufZ1o4Ut42YUrZSo8+qnMTrFuKkvyoLXUywKz9GJ5BrhOFGhLdkx9sG4KAnVvbY6kEcSFjLQul+DVmBm2bgA==}\n-    engines: {node: '>= 6.0.0'}\n-\n-  call-bind-apply-helpers@1.0.1:\n-    resolution: {integrity: sha512-BhYE+WDaywFg2TBWYNXAE+8B1ATnThNBqXHP5nQu0jWJdVvY2hvkpyB3qOmtmDePiS5/BDQ8wASEWGMWRG148g==}\n-    engines: {node: '>= 0.4'}\n-\n-  call-bound@1.0.3:\n-    resolution: {integrity: sha512-YTd+6wGlNlPxSuri7Y6X8tY2dmm12UMH66RpKMhiX6rsk5wXXnYgbUcOt8kiS31/AjfoTOvCsE+w8nZQLQnzHA==}\n-    engines: {node: '>= 0.4'}\n-\n-  callsites@3.1.0:\n-    resolution: {integrity: sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==}\n-    engines: {node: '>=6'}\n-\n   chalk@4.1.2:\n     resolution: {integrity: sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==}\n     engines: {node: '>=10'}\n@@ -833,55 +542,32 @@ packages:\n     resolution: {integrity: sha512-Qgzu8kfBvo+cA4962jnP1KkS6Dop5NS6g7R5LFYJr4b8Ub94PPQXUksCw9PvXoeXPRRddRNC5C1JQUR2SMGtnA==}\n     engines: {node: '>= 14.16.0'}\n \n-  co-body@6.2.0:\n-    resolution: {integrity: sha512-Kbpv2Yd1NdL1V/V4cwLVxraHDV6K8ayohr2rmH0J87Er8+zJjcTa6dAn9QMPC9CRgU8+aNajKbSf1TzDB1yKPA==}\n-    engines: {node: '>=8.0.0'}\n-\n-  co@4.6.0:\n-    resolution: {integrity: sha512-QVb0dM5HvG+uaxitm8wONl7jltx8dqhfU33DcqtOZcLSVIKSDDLDi7+0LbAKiyI8hD9u42m2YxXSkMGWThaecQ==}\n-    engines: {iojs: '>= 1.0.0', node: '>= 0.12.0'}\n-\n   color-convert@2.0.1:\n     resolution: {integrity: sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==}\n     engines: {node: '>=7.0.0'}\n \n   color-name@1.1.4:\n     resolution: {integrity: sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==}\n \n+  commander@13.1.0:\n+    resolution: {integrity: sha512-/rFeCpNJQbhSZjGVwO9RFV3xPqbnERS8MmIQzCtD/zl6gpJuV/bMLuN92oG3F7d8oDEHHRrujSXNUr8fpjntKw==}\n+    engines: {node: '>=18'}\n+\n   commander@4.1.1:\n     resolution: {integrity: sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==}\n     engines: {node: '>= 6'}\n \n-  concat-map@0.0.1:\n-    resolution: {integrity: sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==}\n-\n   consola@3.3.3:\n     resolution: {integrity: sha512-Qil5KwghMzlqd51UXM0b6fyaGHtOC22scxrwrz4A2882LyUMwQjnvaedN1HAeXzphspQ6CpHkzMAWxBTUruDLg==}\n     engines: {node: ^14.18.0 || >=16.10.0}\n \n-  content-disposition@0.5.4:\n-    resolution: {integrity: sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==}\n-    engines: {node: '>= 0.6'}\n-\n-  content-type@1.0.5:\n-    resolution: {integrity: sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==}\n-    engines: {node: '>= 0.6'}\n-\n-  cookies@0.9.1:\n-    resolution: {integrity: sha512-TG2hpqe4ELx54QER/S3HQ9SRVnQnGBtKUz5bLQWtYAQ+o6GpgMs6sYUvaiJjVxb+UXwhRhAEP3m7LbsIZ77Hmw==}\n-    engines: {node: '>= 0.8'}\n-\n   cross-spawn@7.0.6:\n     resolution: {integrity: sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==}\n     engines: {node: '>= 8'}\n \n-  debug@3.2.7:\n-    resolution: {integrity: sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==}\n-    peerDependencies:\n-      supports-color: '*'\n-    peerDependenciesMeta:\n-      supports-color:\n-        optional: true\n+  crypto@1.0.1:\n+    resolution: {integrity: sha512-VxBKmeNcqQdiUQUW2Tzq0t377b54N2bMtXO/qiLa+6eRRmmC4qT3D4OnTGoT/U6O9aklQ/jTwbOtRMTTY8G0Ig==}\n+    deprecated: This package is no longer supported. It's now a built-in Node module. If you've depended on crypto, you should switch to the one that's built-in.\n \n   debug@4.4.0:\n     resolution: {integrity: sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==}\n@@ -892,69 +578,23 @@ packages:\n       supports-color:\n         optional: true\n \n-  deep-equal@1.0.1:\n-    resolution: {integrity: sha512-bHtC0iYvWhyaTzvV3CZgPeZQqCOBGyGsVV7v4eevpdkLHfiSrXUdBG+qAuSz4RI70sszvjQ1QSZ98An1yNwpSw==}\n-\n-  deep-is@0.1.4:\n-    resolution: {integrity: sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==}\n-\n-  delegates@1.0.0:\n-    resolution: {integrity: sha512-bd2L678uiWATM6m5Z1VzNCErI3jiGzt6HGY8OVICs40JQq/HALfbyNJmp0UDakEY4pMMaN0Ly5om/B1VI/+xfQ==}\n-\n-  depd@1.1.2:\n-    resolution: {integrity: sha512-7emPTl6Dpo6JRXOXjLRxck+FlLRX5847cLKEn00PLAgc3g2hTZZgr+e4c2v6QpSmLeFP3n5yUo7ft6avBK/5jQ==}\n-    engines: {node: '>= 0.6'}\n-\n-  depd@2.0.0:\n-    resolution: {integrity: sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==}\n-    engines: {node: '>= 0.8'}\n-\n-  destroy@1.2.0:\n-    resolution: {integrity: sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==}\n-    engines: {node: '>= 0.8', npm: 1.2.8000 || >= 1.4.16}\n-\n-  dezalgo@1.0.4:\n-    resolution: {integrity: sha512-rXSP0bf+5n0Qonsb+SVVfNfIsimO4HEtmnIpPHY8Q1UCzKlQrDMfdobr8nJOOsRgWCyMRqeSBQzmWUMq7zvVig==}\n-\n-  dotenv@16.4.7:\n-    resolution: {integrity: sha512-47qPchRCykZC03FhkYAhrvwU4xDBFIj1QPqaarj6mdM/hgUzfPHcpkHJOn3mJAufFeeAxAzeGsr5X0M4k6fLZQ==}\n-    engines: {node: '>=12'}\n-\n-  dunder-proto@1.0.1:\n-    resolution: {integrity: sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==}\n-    engines: {node: '>= 0.4'}\n+  dependency-cruiser@16.10.0:\n+    resolution: {integrity: sha512-o6pEB8X/XS0AjpQBhPJW3pSY7HIviRM7+G601T9ruV63NVJC4DxLMA+a1VzZlKOzO2fO6JKRHjRmGjzZZHEFYA==}\n+    engines: {node: ^18.17||>=20}\n+    hasBin: true\n \n   eastasianwidth@0.2.0:\n     resolution: {integrity: sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==}\n \n-  ee-first@1.1.1:\n-    resolution: {integrity: sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==}\n-\n   emoji-regex@8.0.0:\n     resolution: {integrity: sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==}\n \n   emoji-regex@9.2.2:\n     resolution: {integrity: sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==}\n \n-  encodeurl@1.0.2:\n-    resolution: {integrity: sha512-TPJXq8JqFaVYm2CWmPvnP2Iyo4ZSM7/QKcSmuMLDObfpH5fi7RUGmd/rTDf+rut/saiDiQEeVTNgAmJEdAOx0w==}\n-    engines: {node: '>= 0.8'}\n-\n-  entities@4.5.0:\n-    resolution: {integrity: sha512-V0hjH4dGPh9Ao5p0MoRY6BVqtwCjhz6vI5LT8AJ55H+4g9/4vbHx1I54fS0XuclLhDHArPQCiMjDxjaL8fPxhw==}\n-    engines: {node: '>=0.12'}\n-\n-  es-define-property@1.0.1:\n-    resolution: {integrity: sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==}\n-    engines: {node: '>= 0.4'}\n-\n-  es-errors@1.3.0:\n-    resolution: {integrity: sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==}\n-    engines: {node: '>= 0.4'}\n-\n-  es-object-atoms@1.0.0:\n-    resolution: {integrity: sha512-MZ4iQ6JwHOBQjahnjwaC1ZtIBH+2ohjamzAO3oaHcXYup7qxjF2fixyH+Q71voWHeOkI2q/TnJao/KfXYIZWbw==}\n-    engines: {node: '>= 0.4'}\n+  enhanced-resolve@5.18.1:\n+    resolution: {integrity: sha512-ZSW3ma5GkcQBIpwZTSRAI8N71Uuwgs93IezB7mf7R60tC8ZbJideoDNKjHn2O9KIlx6rkGTTEk1xUCK2E1Y2Yg==}\n+    engines: {node: '>=10.13.0'}\n \n   esbuild@0.23.1:\n     resolution: {integrity: sha512-VVNz/9Sa0bs5SELtn3f7qhJCDPCF5oMEl5cO9/SSinpE9hbPVvxbd572HH5AKiP7WD8INO53GgfDDhRjkylHEg==}\n@@ -966,73 +606,11 @@ packages:\n     engines: {node: '>=18'}\n     hasBin: true\n \n-  escape-html@1.0.3:\n-    resolution: {integrity: sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==}\n-\n-  escape-string-regexp@4.0.0:\n-    resolution: {integrity: sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==}\n-    engines: {node: '>=10'}\n-\n-  eslint-scope@8.2.0:\n-    resolution: {integrity: sha512-PHlWUfG6lvPc3yvP5A4PNyBL1W8fkDUccmI21JUu/+GKZBoH/W5u6usENXUrWFRsyoW5ACUjFGgAFQp5gUlb/A==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  eslint-visitor-keys@3.4.3:\n-    resolution: {integrity: sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==}\n-    engines: {node: ^12.22.0 || ^14.17.0 || >=16.0.0}\n-\n-  eslint-visitor-keys@4.2.0:\n-    resolution: {integrity: sha512-UyLnSehNt62FFhSwjZlHmeokpRK59rcz29j+F1/aDgbkbRTk7wIc9XzdoasMUbRNKDM0qQt/+BJ4BrpFeABemw==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  eslint@9.17.0:\n-    resolution: {integrity: sha512-evtlNcpJg+cZLcnVKwsai8fExnqjGPicK7gnUtlNuzu+Fv9bI0aLpND5T44VLQtoMEnI57LoXO9XAkIXwohKrA==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-    hasBin: true\n-    peerDependencies:\n-      jiti: '*'\n-    peerDependenciesMeta:\n-      jiti:\n-        optional: true\n-\n-  espree@10.3.0:\n-    resolution: {integrity: sha512-0QYC8b24HWY8zjRnDTL6RiHfDbAWn63qb4LMj1Z4b076A4une81+z03Kg7l7mn/48PUTqoLptSXez8oknU8Clg==}\n-    engines: {node: ^18.18.0 || ^20.9.0 || >=21.1.0}\n-\n-  esquery@1.6.0:\n-    resolution: {integrity: sha512-ca9pw9fomFcKPvFLXhBKUK90ZvGibiGOvRJNbjljY7s7uq/5YO4BOzcYtJqExdx99rF6aAcnRxHmcUHcz6sQsg==}\n-    engines: {node: '>=0.10'}\n-\n-  esrecurse@4.3.0:\n-    resolution: {integrity: sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==}\n-    engines: {node: '>=4.0'}\n-\n-  estraverse@5.3.0:\n-    resolution: {integrity: sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==}\n-    engines: {node: '>=4.0'}\n-\n-  estree-walker@2.0.2:\n-    resolution: {integrity: sha512-Rfkk/Mp/DL7JVje3u18FxFujQlTNR2q6QfMSMB7AvCBx91NGj/ba3kCfza0f6dVDbw7YlRf/nDrn7pQrCCyQ/w==}\n-\n-  esutils@2.0.3:\n-    resolution: {integrity: sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==}\n-    engines: {node: '>=0.10.0'}\n-\n   fast-deep-equal@3.1.3:\n     resolution: {integrity: sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==}\n \n-  fast-glob@3.3.2:\n-    resolution: {integrity: sha512-oX2ruAFQwf/Orj8m737Y5adxDQO0LAB7/S5MnxCdTNDd4p6BsyIVsv9JQsATbTSq8KHRpLwIHbVlUNatxd+1Ow==}\n-    engines: {node: '>=8.6.0'}\n-\n-  fast-json-stable-stringify@2.1.0:\n-    resolution: {integrity: sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==}\n-\n-  fast-levenshtein@2.0.6:\n-    resolution: {integrity: sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==}\n-\n-  fastq@1.18.0:\n-    resolution: {integrity: sha512-QKHXPW0hD8g4UET03SdOdunzSouc9N4AuHdsX8XNcTsuz+yYFILVNIX4l9yHABMhiEI9Db0JTTIpu0wB+Y1QQw==}\n+  fast-uri@3.0.6:\n+    resolution: {integrity: sha512-Atfo14OibSv5wAp4VWNsFYE1AchQRTv9cBGWET4pZWHzYshFSS9NQI6I57rdKn9croWVMbYFbLhJ+yJvmZIIHw==}\n \n   fdir@6.4.2:\n     resolution: {integrity: sha512-KnhMXsKSPZlAhp7+IjUkRZKPb4fUyccpDrdFXbi4QL1qkmFh9kVY09Yox+n4MaOb3lHZ1Tv829C3oaaXoMYPDQ==}\n@@ -1042,36 +620,10 @@ packages:\n       picomatch:\n         optional: true\n \n-  file-entry-cache@8.0.0:\n-    resolution: {integrity: sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==}\n-    engines: {node: '>=16.0.0'}\n-\n-  fill-range@7.1.1:\n-    resolution: {integrity: sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==}\n-    engines: {node: '>=8'}\n-\n-  find-up@5.0.0:\n-    resolution: {integrity: sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==}\n-    engines: {node: '>=10'}\n-\n-  flat-cache@4.0.1:\n-    resolution: {integrity: sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==}\n-    engines: {node: '>=16'}\n-\n-  flatted@3.3.2:\n-    resolution: {integrity: sha512-AiwGJM8YcNOaobumgtng+6NHuOqC3A7MixFeDafM3X9cIUM+xUXoS5Vfgf+OihAYe20fxqNM9yPBXJzRtZ/4eA==}\n-\n   foreground-child@3.3.0:\n     resolution: {integrity: sha512-Ld2g8rrAyMYFXBhEqMz8ZAHBi4J4uS1i/CxGMDnjyFWddMXLVcDp051DZfu+t7+ab7Wv6SMqpWmyFIj5UbfFvg==}\n     engines: {node: '>=14'}\n \n-  formidable@2.1.2:\n-    resolution: {integrity: sha512-CM3GuJ57US06mlpQ47YcunuUZ9jpm8Vx+P2CGt2j7HpgkKZO/DJYQ0Bobim8G6PFQmK5lOqOOdUXboU+h73A4g==}\n-\n-  fresh@0.5.2:\n-    resolution: {integrity: sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==}\n-    engines: {node: '>= 0.6'}\n-\n   fsevents@2.3.3:\n     resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}\n     engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}\n@@ -1080,21 +632,9 @@ packages:\n   function-bind@1.1.2:\n     resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}\n \n-  get-intrinsic@1.2.6:\n-    resolution: {integrity: sha512-qxsEs+9A+u85HhllWJJFicJfPDhRmjzoYdl64aMWW9yRIJmSyxdn8IEkuIM530/7T+lv0TIHd8L6Q/ra0tEoeA==}\n-    engines: {node: '>= 0.4'}\n-\n   get-tsconfig@4.8.1:\n     resolution: {integrity: sha512-k9PN+cFBmaLWtVz29SkUoqU5O0slLuHJXt/2P+tMVFT+phsSGXGkp9t3rQIqdz0e+06EHNGs3oM6ZX1s2zHxRg==}\n \n-  glob-parent@5.1.2:\n-    resolution: {integrity: sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==}\n-    engines: {node: '>= 6'}\n-\n-  glob-parent@6.0.2:\n-    resolution: {integrity: sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==}\n-    engines: {node: '>=10.13.0'}\n-\n   glob@10.4.5:\n     resolution: {integrity: sha512-7Bv8RF0k6xjo7d4A/PxYLbUCfb6c+Vpd2/mB2yRDlew7Jb5hEXiCD9ibfO7wpk8i4sevK6DFny9h7EYbM3/sHg==}\n     hasBin: true\n@@ -1104,98 +644,48 @@ packages:\n     engines: {node: 20 || >=22}\n     hasBin: true\n \n-  globals@14.0.0:\n-    resolution: {integrity: sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==}\n+  global-directory@4.0.1:\n+    resolution: {integrity: sha512-wHTUcDUoZ1H5/0iVqEudYW4/kAlN5cZ3j/bXn0Dpbizl9iaUVeWSHqiOjsgk6OW2bkLclbBjzewBz6weQ1zA2Q==}\n     engines: {node: '>=18'}\n \n-  gopd@1.2.0:\n-    resolution: {integrity: sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==}\n-    engines: {node: '>= 0.4'}\n-\n-  graphemer@1.4.0:\n-    resolution: {integrity: sha512-EtKwoO6kxCL9WO5xipiHTZlSzBm7WLT627TqC/uVRd0HKmq8NXyebnNYxDoBi7wt8eTWrUrKXCOVaFq9x1kgag==}\n+  graceful-fs@4.2.11:\n+    resolution: {integrity: sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==}\n \n   has-flag@4.0.0:\n     resolution: {integrity: sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==}\n     engines: {node: '>=8'}\n \n-  has-symbols@1.1.0:\n-    resolution: {integrity: sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==}\n-    engines: {node: '>= 0.4'}\n-\n-  has-tostringtag@1.0.2:\n-    resolution: {integrity: sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==}\n-    engines: {node: '>= 0.4'}\n-\n   hasown@2.0.2:\n     resolution: {integrity: sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==}\n     engines: {node: '>= 0.4'}\n \n-  hexoid@1.0.0:\n-    resolution: {integrity: sha512-QFLV0taWQOZtvIRIAdBChesmogZrtuXvVWsFHZTk2SU+anspqZ2vMnoLg7IE1+Uk16N19APic1BuF8bC8c2m5g==}\n-    engines: {node: '>=8'}\n-\n-  http-assert@1.5.0:\n-    resolution: {integrity: sha512-uPpH7OKX4H25hBmU6G1jWNaqJGpTXxey+YOUizJUAgu0AjLUeC8D73hTrhvDS5D+GJN1DN1+hhc/eF/wpxtp0w==}\n-    engines: {node: '>= 0.8'}\n-\n-  http-errors@1.6.3:\n-    resolution: {integrity: sha512-lks+lVC8dgGyh97jxvxeYTWQFvh4uw4yC12gVl63Cg30sjPX4wuGcdkICVXDAESr6OJGjqGA8Iz5mkeN6zlD7A==}\n-    engines: {node: '>= 0.6'}\n-\n-  http-errors@1.8.1:\n-    resolution: {integrity: sha512-Kpk9Sm7NmI+RHhnj6OIWDI1d6fIoFAtFt9RLaTMRlg/8w49juAStsrBgp0Dp4OdxdVbRIeKhtCUvoi/RuAhO4g==}\n-    engines: {node: '>= 0.6'}\n-\n-  http-errors@2.0.0:\n-    resolution: {integrity: sha512-FtwrG/euBzaEjYeRqOgly7G0qviiXoJWnvEH2Z1plBdXgbyjv34pHTSb9zoeHMyDy33+DWy5Wt9Wo+TURtOYSQ==}\n-    engines: {node: '>= 0.8'}\n-\n-  iconv-lite@0.4.24:\n-    resolution: {integrity: sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==}\n-    engines: {node: '>=0.10.0'}\n-\n-  ignore@5.3.2:\n-    resolution: {integrity: sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==}\n+  ignore@7.0.3:\n+    resolution: {integrity: sha512-bAH5jbK/F3T3Jls4I0SO1hmPR0dKU0a7+SY6n1yzRtG54FLO8d6w/nxLFX2Nb7dBu6cCWXPaAME6cYqFUMmuCA==}\n     engines: {node: '>= 4'}\n \n-  import-fresh@3.3.0:\n-    resolution: {integrity: sha512-veYYhQa+D1QBKznvhUHxb8faxlrwUnxseDAbAp457E0wLNio2bOSKnjYDhMj+YiAq61xrMGhQk9iXVk5FzgQMw==}\n-    engines: {node: '>=6'}\n-\n-  imurmurhash@0.1.4:\n-    resolution: {integrity: sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==}\n-    engines: {node: '>=0.8.19'}\n-\n-  inflation@2.1.0:\n-    resolution: {integrity: sha512-t54PPJHG1Pp7VQvxyVCJ9mBbjG3Hqryges9bXoOO6GExCPa+//i/d5GSuFtpx3ALLd7lgIAur6zrIlBQyJuMlQ==}\n-    engines: {node: '>= 0.8.0'}\n+  ini@4.1.1:\n+    resolution: {integrity: sha512-QQnnxNyfvmHFIsj7gkPcYymR8Jdw/o7mp5ZFihxn6h8Ci6fh3Dx4E1gPjpQEpIuPo9XVNY/ZUwh4BPMjGyL01g==}\n+    engines: {node: ^14.17.0 || ^16.13.0 || >=18.0.0}\n \n-  inherits@2.0.3:\n-    resolution: {integrity: sha512-x00IRNXNy63jwGkJmzPigoySHbaqpNuzKbBOmzK+g2OdZpQ9w+sxCN+VSB3ja7IAge2OP2qpfxTjeNcyjmW1uw==}\n-\n-  inherits@2.0.4:\n-    resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}\n+  interpret@3.1.1:\n+    resolution: {integrity: sha512-6xwYfHbajpoF0xLW+iwLkhwgvLoZDfjYfoFNu8ftMoXINzwuymNLd9u/KmwtdT2GbR+/Cz66otEGEVVUHX9QLQ==}\n+    engines: {node: '>=10.13.0'}\n \n-  is-extglob@2.1.1:\n-    resolution: {integrity: sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==}\n-    engines: {node: '>=0.10.0'}\n+  is-core-module@2.16.1:\n+    resolution: {integrity: sha512-UfoeMA6fIJ8wTYFEUjelnaGI67v6+N7qXJEvQuIGa99l4xsCruSYOVSQ0uPANn4dAzm8lkYPaKLrrijLq7x23w==}\n+    engines: {node: '>= 0.4'}\n \n   is-fullwidth-code-point@3.0.0:\n     resolution: {integrity: sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==}\n     engines: {node: '>=8'}\n \n-  is-generator-function@1.0.10:\n-    resolution: {integrity: sha512-jsEjy9l3yiXEQ+PsXdmBwEPcOxaXWLspKdplFUVI9vq1iZgIekeC0L167qeu86czQaxed3q/Uzuw0swL0irL8A==}\n-    engines: {node: '>= 0.4'}\n-\n-  is-glob@4.0.3:\n-    resolution: {integrity: sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==}\n-    engines: {node: '>=0.10.0'}\n+  is-installed-globally@1.0.0:\n+    resolution: {integrity: sha512-K55T22lfpQ63N4KEN57jZUAaAYqYHEe8veb/TycJRk9DdSCLLcovXz/mL6mOnhQaZsQGwPhuFopdQIlqGSEjiQ==}\n+    engines: {node: '>=18'}\n \n-  is-number@7.0.0:\n-    resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}\n-    engines: {node: '>=0.12.0'}\n+  is-path-inside@4.0.0:\n+    resolution: {integrity: sha512-lJJV/5dYS+RcL8uQdBDW9c9uWFLLBNRyFhnAKXw5tVqLlKZ4RMGZKv+YQ/IA3OhD+RpbJa1LLFM1FQPGyIXvOA==}\n+    engines: {node: '>=12'}\n \n   isexe@2.0.0:\n     resolution: {integrity: sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==}\n@@ -1211,51 +701,17 @@ packages:\n     resolution: {integrity: sha512-34wB/Y7MW7bzjKRjUKTa46I2Z7eV62Rkhva+KkopW7Qvv/OSWBqvkSY7vusOPrNuZcUG3tApvdVgNB8POj3SPw==}\n     engines: {node: '>=10'}\n \n-  js-yaml@4.1.0:\n-    resolution: {integrity: sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==}\n-    hasBin: true\n-\n-  json-buffer@3.0.1:\n-    resolution: {integrity: sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==}\n-\n-  json-schema-traverse@0.4.1:\n-    resolution: {integrity: sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==}\n-\n-  json-stable-stringify-without-jsonify@1.0.1:\n-    resolution: {integrity: sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==}\n-\n-  keygrip@1.1.0:\n-    resolution: {integrity: sha512-iYSchDJ+liQ8iwbSI2QqsQOvqv58eJCEanyJPJi+Khyu8smkcKSFUCbPwzFcL7YVtZ6eONjqRX/38caJ7QjRAQ==}\n-    engines: {node: '>= 0.6'}\n-\n-  keyv@4.5.4:\n-    resolution: {integrity: sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==}\n-\n-  koa-body@6.0.1:\n-    resolution: {integrity: sha512-M8ZvMD8r+kPHy28aWP9VxL7kY8oPWA+C7ZgCljrCMeaU7uX6wsIQgDHskyrAr9sw+jqnIXyv4Mlxri5R4InIJg==}\n+  json-schema-traverse@1.0.0:\n+    resolution: {integrity: sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==}\n \n-  koa-compose@4.1.0:\n-    resolution: {integrity: sha512-8ODW8TrDuMYvXRwra/Kh7/rJo9BtOfPc6qO8eAfC80CnCvSjSl0bkRM24X6/XBBEyj0v1nRUQ1LyOy3dbqOWXw==}\n-\n-  koa-convert@2.0.0:\n-    resolution: {integrity: sha512-asOvN6bFlSnxewce2e/DK3p4tltyfC4VM7ZwuTuepI7dEQVcvpyFuBcEARu1+Hxg8DIwytce2n7jrZtRlPrARA==}\n-    engines: {node: '>= 10'}\n-\n-  koa-send@5.0.1:\n-    resolution: {integrity: sha512-tmcyQ/wXXuxpDxyNXv5yNNkdAMdFRqwtegBXUaowiQzUKqJehttS0x2j0eOZDQAyloAth5w6wwBImnFzkUz3pQ==}\n-    engines: {node: '>= 8'}\n-\n-  koa-static@5.0.0:\n-    resolution: {integrity: sha512-UqyYyH5YEXaJrf9S8E23GoJFQZXkBVJ9zYYMPGz919MSX1KuvAcycIuS0ci150HCoPf4XQVhQ84Qf8xRPWxFaQ==}\n-    engines: {node: '>= 7.6.0'}\n-\n-  koa@2.15.3:\n-    resolution: {integrity: sha512-j/8tY9j5t+GVMLeioLaxweJiKUayFhlGqNTzf2ZGwL0ZCQijd2RLHK0SLW5Tsko8YyyqCZC2cojIb0/s62qTAg==}\n-    engines: {node: ^4.8.4 || ^6.10.1 || ^7.10.1 || >= 8.1.4}\n+  json5@2.2.3:\n+    resolution: {integrity: sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==}\n+    engines: {node: '>=6'}\n+    hasBin: true\n \n-  levn@0.4.1:\n-    resolution: {integrity: sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==}\n-    engines: {node: '>= 0.8.0'}\n+  kleur@3.0.3:\n+    resolution: {integrity: sha512-eTIzlVOSUR+JxdDFepEYcBMtZ9Qqdef+rnzWdRZuMbOywu5tO2w2N7rqjoANZ5k9vywhL6Br1VRjUIgTQx4E8w==}\n+    engines: {node: '>=6'}\n \n   lilconfig@3.1.3:\n     resolution: {integrity: sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==}\n@@ -1268,13 +724,6 @@ packages:\n     resolution: {integrity: sha512-IXO6OCs9yg8tMKzfPZ1YmheJbZCiEsnBdcB03l0OcfK9prKnJb96siuHCr5Fl37/yo9DnKU+TLpxzTUspw9shg==}\n     engines: {node: ^12.20.0 || ^14.13.1 || >=16.0.0}\n \n-  locate-path@6.0.0:\n-    resolution: {integrity: sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==}\n-    engines: {node: '>=10'}\n-\n-  lodash.merge@4.6.2:\n-    resolution: {integrity: sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==}\n-\n   lodash.sortby@4.7.0:\n     resolution: {integrity: sha512-HDWXG8isMntAyRF5vZ7xKuEvOhT4AhlRt/3czTSjvGUxjYCBVRQY48ViDHyfYz9VIoBkW4TMGQNapx+l3RUwdA==}\n \n@@ -1285,44 +734,25 @@ packages:\n     resolution: {integrity: sha512-123qHRfJBmo2jXDbo/a5YOQrJoHF/GNQTLzQ5+IdK5pWpceK17yRc6ozlWd25FxvGKQbIUs91fDFkXmDHTKcyA==}\n     engines: {node: 20 || >=22}\n \n-  magic-string@0.30.17:\n-    resolution: {integrity: sha512-sNPKHvyjVf7gyjwS4xGTaW/mCnF8wnjtifKBEhxfZ7E/S8tQ0rssrwGNn6q8JH/ohItJfSQp9mBtQYuTlH5QnA==}\n-\n-  math-intrinsics@1.1.0:\n-    resolution: {integrity: sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==}\n-    engines: {node: '>= 0.4'}\n-\n-  media-typer@0.3.0:\n-    resolution: {integrity: sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==}\n-    engines: {node: '>= 0.6'}\n-\n-  merge2@1.4.1:\n-    resolution: {integrity: sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==}\n-    engines: {node: '>= 8'}\n-\n-  micromatch@4.0.8:\n-    resolution: {integrity: sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==}\n-    engines: {node: '>=8.6'}\n-\n-  mime-db@1.52.0:\n-    resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}\n-    engines: {node: '>= 0.6'}\n+  memoize@10.1.0:\n+    resolution: {integrity: sha512-MMbFhJzh4Jlg/poq1si90XRlTZRDHVqdlz2mPyGJ6kqMpyHUyVpDd5gpFAvVehW64+RA1eKE9Yt8aSLY7w2Kgg==}\n+    engines: {node: '>=18'}\n \n-  mime-types@2.1.35:\n-    resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}\n-    engines: {node: '>= 0.6'}\n+  mimic-function@5.0.1:\n+    resolution: {integrity: sha512-VP79XUPxV2CigYP3jWwAUFSku2aKqBH7uTAapFWCBqutsbmDo96KY5o8uh6U+/YSIn5OxJnXp73beVkpqMIGhA==}\n+    engines: {node: '>=18'}\n \n   minimatch@10.0.1:\n     resolution: {integrity: sha512-ethXTt3SGGR+95gudmqJ1eNhRO7eGEGIgYA9vnPatK4/etz2MEVDno5GMCibdMTuBMyElzIlgxMna3K94XDIDQ==}\n     engines: {node: 20 || >=22}\n \n-  minimatch@3.1.2:\n-    resolution: {integrity: sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==}\n-\n   minimatch@9.0.5:\n     resolution: {integrity: sha512-G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==}\n     engines: {node: '>=16 || 14 >=14.17'}\n \n+  minimist@1.2.8:\n+    resolution: {integrity: sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==}\n+\n   minipass@7.1.2:\n     resolution: {integrity: sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==}\n     engines: {node: '>=16 || 14 >=14.17'}\n@@ -1338,66 +768,28 @@ packages:\n     engines: {node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1}\n     hasBin: true\n \n-  natural-compare@1.4.0:\n-    resolution: {integrity: sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==}\n+  node-addon-api@8.3.0:\n+    resolution: {integrity: sha512-8VOpLHFrOQlAH+qA0ZzuGRlALRA6/LVh8QJldbrC4DY0hXoMP0l4Acq8TzFC018HztWiRqyCEj2aTWY2UvnJUg==}\n+    engines: {node: ^18 || ^20 || >= 21}\n \n-  negotiator@0.6.3:\n-    resolution: {integrity: sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==}\n-    engines: {node: '>= 0.6'}\n+  node-gyp-build@4.8.4:\n+    resolution: {integrity: sha512-LA4ZjwlnUblHVgq0oBF3Jl/6h/Nvs5fzBLwdEF4nuxnFdsfajde4WfxtJr3CaiH+F6ewcIB/q4jQ4UzPyid+CQ==}\n+    hasBin: true\n \n   object-assign@4.1.1:\n     resolution: {integrity: sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==}\n     engines: {node: '>=0.10.0'}\n \n-  object-inspect@1.13.3:\n-    resolution: {integrity: sha512-kDCGIbxkDSXE3euJZZXzc6to7fCrKHNI/hSRQnRuQ+BWjFNzZwiFF8fj/6o2t2G9/jTj8PSIYTfCLelLZEeRpA==}\n-    engines: {node: '>= 0.4'}\n-\n-  on-finished@2.4.1:\n-    resolution: {integrity: sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==}\n-    engines: {node: '>= 0.8'}\n-\n-  once@1.4.0:\n-    resolution: {integrity: sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==}\n-\n-  only@0.0.2:\n-    resolution: {integrity: sha512-Fvw+Jemq5fjjyWz6CpKx6w9s7xxqo3+JCyM0WXWeCSOboZ8ABkyvP8ID4CZuChA/wxSx+XSJmdOm8rGVyJ1hdQ==}\n-\n-  optionator@0.9.4:\n-    resolution: {integrity: sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==}\n-    engines: {node: '>= 0.8.0'}\n-\n-  p-limit@3.1.0:\n-    resolution: {integrity: sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==}\n-    engines: {node: '>=10'}\n-\n-  p-locate@5.0.0:\n-    resolution: {integrity: sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==}\n-    engines: {node: '>=10'}\n-\n   package-json-from-dist@1.0.1:\n     resolution: {integrity: sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==}\n \n-  parent-module@1.0.1:\n-    resolution: {integrity: sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==}\n-    engines: {node: '>=6'}\n-\n-  parseurl@1.3.3:\n-    resolution: {integrity: sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==}\n-    engines: {node: '>= 0.8'}\n-\n-  path-exists@4.0.0:\n-    resolution: {integrity: sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==}\n-    engines: {node: '>=8'}\n-\n-  path-is-absolute@1.0.1:\n-    resolution: {integrity: sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==}\n-    engines: {node: '>=0.10.0'}\n-\n   path-key@3.1.1:\n     resolution: {integrity: sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==}\n     engines: {node: '>=8'}\n \n+  path-parse@1.0.7:\n+    resolution: {integrity: sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==}\n+\n   path-scurry@1.11.1:\n     resolution: {integrity: sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==}\n     engines: {node: '>=16 || 14 >=14.18'}\n@@ -1406,16 +798,9 @@ packages:\n     resolution: {integrity: sha512-ypGJsmGtdXUOeM5u93TyeIEfEhM6s+ljAhrk5vAvSx8uyY/02OvrZnA0YNGUrPXfpJMgI1ODd3nwz8Npx4O4cg==}\n     engines: {node: 20 || >=22}\n \n-  path-to-regexp@6.3.0:\n-    resolution: {integrity: sha512-Yhpw4T9C6hPpgPeA28us07OJeqZ5EzQTkbfwuhsUg0c237RomFoETJgmp2sa3F/41gfLE6G5cqcYwznmeEeOlQ==}\n-\n   picocolors@1.1.1:\n     resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}\n \n-  picomatch@2.3.1:\n-    resolution: {integrity: sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==}\n-    engines: {node: '>=8.6'}\n-\n   picomatch@4.0.2:\n     resolution: {integrity: sha512-M7BAV6Rlcy5u+m6oPhAPFgJTzAioX/6B0DxyvDlo9l8+T3nLKbrczg2WLUyzd45L8RqfUMyGPzekbMvX2Ldkwg==}\n     engines: {node: '>=12'}\n@@ -1442,82 +827,59 @@ packages:\n       yaml:\n         optional: true\n \n-  postcss@8.4.49:\n-    resolution: {integrity: sha512-OCVPnIObs4N29kxTjzLfUryOkvZEq+pf8jTF0lg8E7uETuWHA+v7j3c/xJmiqpX450191LlmZfUKkXxkTry7nA==}\n+  postcss@8.5.3:\n+    resolution: {integrity: sha512-dle9A3yYxlBSrt8Fu+IpjGT8SY8hN0mlaA6GY8t0P5PjIOZemULz/E2Bnm/2dcUOena75OTNkHI76uZBNUUq3A==}\n     engines: {node: ^10 || ^12 || >=14}\n \n-  prelude-ls@1.2.1:\n-    resolution: {integrity: sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==}\n-    engines: {node: '>= 0.8.0'}\n-\n-  prettier@3.4.2:\n-    resolution: {integrity: sha512-e9MewbtFo+Fevyuxn/4rrcDAaq0IYxPGLvObpQjiZBMAzB9IGmzlnG9RZy3FFas+eBMu2vA0CszMeduow5dIuQ==}\n-    engines: {node: '>=14'}\n-    hasBin: true\n+  prompts@2.4.2:\n+    resolution: {integrity: sha512-NxNv/kLguCA7p3jE8oL2aEBsrJWgAakBpgmgK6lpPWV+WuOmY6r2/zbAVnP+T8bQlA0nzHXSJSJW0Hq7ylaD2Q==}\n+    engines: {node: '>= 6'}\n \n   punycode@2.3.1:\n     resolution: {integrity: sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==}\n     engines: {node: '>=6'}\n \n-  qs@6.13.1:\n-    resolution: {integrity: sha512-EJPeIn0CYrGu+hli1xilKAPXODtJ12T0sP63Ijx2/khC2JtuaN3JyNIpvmnkmaEtha9ocbG4A4cMcr+TvqvwQg==}\n-    engines: {node: '>=0.6'}\n-\n-  queue-microtask@1.2.3:\n-    resolution: {integrity: sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==}\n-\n-  raw-body@2.5.2:\n-    resolution: {integrity: sha512-8zGqypfENjCIqGhgXToC8aB2r7YrBX+AQAfIPs/Mlk+BtPTztOvTS01NRW/3Eh60J+a48lt8qsCzirQ6loCVfA==}\n-    engines: {node: '>= 0.8'}\n-\n   readdirp@4.0.2:\n     resolution: {integrity: sha512-yDMz9g+VaZkqBYS/ozoBJwaBhTbZo3UNYQHNRw1D3UFQB8oHB4uS/tAODO+ZLjGWmUbKnIlOWO+aaIiAxrUWHA==}\n     engines: {node: '>= 14.16.0'}\n \n-  resolve-from@4.0.0:\n-    resolution: {integrity: sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==}\n-    engines: {node: '>=4'}\n+  rechoir@0.8.0:\n+    resolution: {integrity: sha512-/vxpCXddiX8NGfGO/mTafwjq4aFa/71pvamip0++IQk3zG8cbCj0fifNPrjjF1XMXUne91jL9OoxmdykoEtifQ==}\n+    engines: {node: '>= 10.13.0'}\n+\n+  regexp-tree@0.1.27:\n+    resolution: {integrity: sha512-iETxpjK6YoRWJG5o6hXLwvjYAoW+FEZn9os0PD/b6AP6xQwsa/Y7lCVgIixBbUPMfhu+i2LtdeAqVTgGlQarfA==}\n+    hasBin: true\n+\n+  require-from-string@2.0.2:\n+    resolution: {integrity: sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==}\n+    engines: {node: '>=0.10.0'}\n \n   resolve-from@5.0.0:\n     resolution: {integrity: sha512-qYg9KP24dD5qka9J47d0aVky0N+b4fTU89LN9iDnjB5waksiC49rvMB0PrUJQGoTmH50XPiqOvAjDfaijGxYZw==}\n     engines: {node: '>=8'}\n \n-  resolve-path@1.4.0:\n-    resolution: {integrity: sha512-i1xevIst/Qa+nA9olDxLWnLk8YZbi8R/7JPbCMcgyWaFR6bKWaexgJgEB5oc2PKMjYdrHynyz0NY+if+H98t1w==}\n-    engines: {node: '>= 0.8'}\n-\n   resolve-pkg-maps@1.0.0:\n     resolution: {integrity: sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==}\n \n-  reusify@1.0.4:\n-    resolution: {integrity: sha512-U9nH88a3fc/ekCF1l0/UP1IosiuIjyTh7hBvXVMHYgVcfGvt897Xguj2UOLDeI5BG2m7/uwyaLVT6fbtCwTyzw==}\n-    engines: {iojs: '>=1.0.0', node: '>=0.10.0'}\n+  resolve@1.22.10:\n+    resolution: {integrity: sha512-NPRy+/ncIMeDlTAsuqwKIiferiawhefFJtkNSW0qZJEqMEb+qBt/77B/jGeeek+F0uOeN05CDa6HXbbIgtVX4w==}\n+    engines: {node: '>= 0.4'}\n+    hasBin: true\n \n   rollup@4.29.1:\n     resolution: {integrity: sha512-RaJ45M/kmJUzSWDs1Nnd5DdV4eerC98idtUOVr6FfKcgxqvjwHmxc5upLF9qZU9EpsVzzhleFahrT3shLuJzIw==}\n     engines: {node: '>=18.0.0', npm: '>=8.0.0'}\n     hasBin: true\n \n-  run-parallel@1.2.0:\n-    resolution: {integrity: sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==}\n-\n-  safe-buffer@5.2.1:\n-    resolution: {integrity: sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==}\n-\n-  safer-buffer@2.1.2:\n-    resolution: {integrity: sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==}\n+  safe-regex@2.1.1:\n+    resolution: {integrity: sha512-rx+x8AMzKb5Q5lQ95Zoi6ZbJqwCLkqi3XuJXp5P3rT8OEc6sZCJG5AE5dU3lsgRr/F4Bs31jSlVN+j5KrsGu9A==}\n \n-  semver@7.6.3:\n-    resolution: {integrity: sha512-oVekP1cKtI+CTDvHWYFUcMtsK/00wmAEfyqKfNdARm8u1wNVhSgaX7A8d4UuIlUI5e84iEwOhs7ZPYRmzU9U6A==}\n+  semver@7.7.1:\n+    resolution: {integrity: sha512-hlq8tAfn0m/61p4BVRcPzIGr6LKiMwo4VM6dGi6pt4qcRkmNzTcWq6eCEjEh+qXjkMDvPlOFFSGwQjoEa6gyMA==}\n     engines: {node: '>=10'}\n     hasBin: true\n \n-  setprototypeof@1.1.0:\n-    resolution: {integrity: sha512-BvE/TwpZX4FXExxOxZyRGQQv651MSwmWKZGqvmPcRIjDqWub67kTKuIMx43cZZrS/cBBzwBcNDWoFxt2XEFIpQ==}\n-\n-  setprototypeof@1.2.0:\n-    resolution: {integrity: sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==}\n-\n   shebang-command@2.0.0:\n     resolution: {integrity: sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==}\n     engines: {node: '>=8'}\n@@ -1526,29 +888,16 @@ packages:\n     resolution: {integrity: sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==}\n     engines: {node: '>=8'}\n \n-  side-channel-list@1.0.0:\n-    resolution: {integrity: sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==}\n-    engines: {node: '>= 0.4'}\n-\n-  side-channel-map@1.0.1:\n-    resolution: {integrity: sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==}\n-    engines: {node: '>= 0.4'}\n-\n-  side-channel-weakmap@1.0.2:\n-    resolution: {integrity: sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==}\n-    engines: {node: '>= 0.4'}\n-\n-  side-channel@1.1.0:\n-    resolution: {integrity: sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==}\n-    engines: {node: '>= 0.4'}\n-\n   signal-exit@4.1.0:\n     resolution: {integrity: sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==}\n     engines: {node: '>=14'}\n \n   simple-git@3.27.0:\n     resolution: {integrity: sha512-ivHoFS9Yi9GY49ogc6/YAi3Fl9ROnF4VyubNylgCkA+RVqLaKWnDSzXOVzya8csELIaWaYNutsEuAhZrtOjozA==}\n \n+  sisteransi@1.0.5:\n+    resolution: {integrity: sha512-bLGGlR1QxBcynn2d5YmDX4MGjlZvy2MRBDRNHLJ8VI6l6+9FUiyTFNJ0IveOSP0bcXgVDPRcfGqA0pjaqUpfVg==}\n+\n   source-map-js@1.2.1:\n     resolution: {integrity: sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==}\n     engines: {node: '>=0.10.0'}\n@@ -1557,14 +906,6 @@ packages:\n     resolution: {integrity: sha512-2ymg6oRBpebeZi9UUNsgQ89bhx01TcTkmNTGnNO88imTmbSgy4nfujrgVEFKWpMTEGA11EDkTt7mqObTPdigIA==}\n     engines: {node: '>= 8'}\n \n-  statuses@1.5.0:\n-    resolution: {integrity: sha512-OpZ3zP+jT1PI7I8nemJX4AKmAX070ZkYPVWV/AaKTJl+tXCTGyVdC1a4SL8RUQYEwk/f34ZX8UTykN68FwrqAA==}\n-    engines: {node: '>= 0.6'}\n-\n-  statuses@2.0.1:\n-    resolution: {integrity: sha512-RwNA9Z/7PrK06rYLIzFMlaF+l73iwpzsqRIFgbMLbTcLD6cOao82TaWefPXQvB2fOC4AjuYSEndS7N/mTCbkdQ==}\n-    engines: {node: '>= 0.8'}\n-\n   string-width@4.2.3:\n     resolution: {integrity: sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==}\n     engines: {node: '>=8'}\n@@ -1581,9 +922,9 @@ packages:\n     resolution: {integrity: sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==}\n     engines: {node: '>=12'}\n \n-  strip-json-comments@3.1.1:\n-    resolution: {integrity: sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==}\n-    engines: {node: '>=8'}\n+  strip-bom@3.0.0:\n+    resolution: {integrity: sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==}\n+    engines: {node: '>=4'}\n \n   sucrase@3.35.0:\n     resolution: {integrity: sha512-8EbVDiu9iN/nESwxeSxDKe0dunta1GOlHufmSSXxMD2z2/tMZpDMpvXQGsc+ajGo8y2uYUmixaSRUc/QPoQ0GA==}\n@@ -1594,6 +935,17 @@ packages:\n     resolution: {integrity: sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==}\n     engines: {node: '>=8'}\n \n+  supports-preserve-symlinks-flag@1.0.0:\n+    resolution: {integrity: sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==}\n+    engines: {node: '>= 0.4'}\n+\n+  tapable@2.2.1:\n+    resolution: {integrity: sha512-GNzQvQTOIP6RyTfE2Qxb8ZVlNmw0n88vp1szwWRimP02mnTsx3Wtn5qRdqY9w2XduFNUgvOwhNnQsjwCp+kqaQ==}\n+    engines: {node: '>=6'}\n+\n+  teamcity-service-messages@0.1.14:\n+    resolution: {integrity: sha512-29aQwaHqm8RMX74u2o/h1KbMLP89FjNiMxD9wbF2BbWOnbM+q+d1sCEC+MqCc4QW3NJykn77OMpTFw/xTHIc0w==}\n+\n   thenify-all@1.6.0:\n     resolution: {integrity: sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==}\n     engines: {node: '>=0.8'}\n@@ -1608,33 +960,50 @@ packages:\n     resolution: {integrity: sha512-Zc+8eJlFMvgatPZTl6A9L/yht8QqdmUNtURHaKZLmKBE12hNPSrqNkUp2cs3M/UKmNVVAMFQYSjYIVHDjW5zew==}\n     engines: {node: '>=12.0.0'}\n \n-  to-regex-range@5.0.1:\n-    resolution: {integrity: sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==}\n-    engines: {node: '>=8.0'}\n-\n-  toidentifier@1.0.1:\n-    resolution: {integrity: sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==}\n-    engines: {node: '>=0.6'}\n-\n   tr46@1.0.1:\n     resolution: {integrity: sha512-dTpowEjclQ7Kgx5SdBkqRzVhERQXov8/l9Ft9dVM9fmg0W0KQSVaXX9T4i6twCPNtYiZM53lpSSUAwJbFPOHxA==}\n \n   tree-kill@1.2.2:\n     resolution: {integrity: sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==}\n     hasBin: true\n \n-  ts-api-utils@1.4.3:\n-    resolution: {integrity: sha512-i3eMG77UTMD0hZhgRS562pv83RC6ukSAC2GMNWc+9dieh/+jDM5u5YG+NHX6VNDRHQcHwmsTHctP9LhbC3WxVw==}\n-    engines: {node: '>=16'}\n+  tree-sitter-javascript@0.23.1:\n+    resolution: {integrity: sha512-/bnhbrTD9frUYHQTiYnPcxyHORIw157ERBa6dqzaKxvR/x3PC4Yzd+D1pZIMS6zNg2v3a8BZ0oK7jHqsQo9fWA==}\n+    peerDependencies:\n+      tree-sitter: ^0.21.1\n+    peerDependenciesMeta:\n+      tree-sitter:\n+        optional: true\n+\n+  tree-sitter-python@0.23.6:\n+    resolution: {integrity: sha512-yIM9z0oxKIxT7bAtPOhgoVl6gTXlmlIhue7liFT4oBPF/lha7Ha4dQBS82Av6hMMRZoVnFJI8M6mL+SwWoLD3A==}\n+    peerDependencies:\n+      tree-sitter: ^0.22.1\n+    peerDependenciesMeta:\n+      tree-sitter:\n+        optional: true\n+\n+  tree-sitter-typescript@0.23.2:\n+    resolution: {integrity: sha512-e04JUUKxTT53/x3Uq1zIL45DoYKVfHH4CZqwgZhPg5qYROl5nQjV+85ruFzFGZxu+QeFVbRTPDRnqL9UbU4VeA==}\n     peerDependencies:\n-      typescript: '>=4.2.0'\n+      tree-sitter: ^0.21.0\n+    peerDependenciesMeta:\n+      tree-sitter:\n+        optional: true\n+\n+  tree-sitter@0.22.4:\n+    resolution: {integrity: sha512-usbHZP9/oxNsUY65MQUsduGRqDHQOou1cagUSwjhoSYAmSahjQDAVsh9s+SlZkn8X8+O1FULRGwHu7AFP3kjzg==}\n \n   ts-interface-checker@0.1.13:\n     resolution: {integrity: sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==}\n \n-  tsscmp@1.0.6:\n-    resolution: {integrity: sha512-LxhtAkPDTkVCMQjt2h6eBVY28KCjikZqZfMcC15YBeNjkgUpdCfBu5HoiOTDu86v6smE8yOjyEktJ8hlbANHQA==}\n-    engines: {node: '>=0.6.x'}\n+  tsconfig-paths-webpack-plugin@4.2.0:\n+    resolution: {integrity: sha512-zbem3rfRS8BgeNK50Zz5SIQgXzLafiHjOwUAvk/38/o1jHn/V5QAgVUcz884or7WYcPaH3N2CIfUc2u0ul7UcA==}\n+    engines: {node: '>=10.13.0'}\n+\n+  tsconfig-paths@4.2.0:\n+    resolution: {integrity: sha512-NoZ4roiN7LnbKn9QqE1amc9DJfzvZXxF4xDavcOWt1BPkdx+m+0gJuPM+S0vCe7zTJMYUP0R8pO2XMr+Y8oLIg==}\n+    engines: {node: '>=6'}\n \n   tsup@8.3.5:\n     resolution: {integrity: sha512-Tunf6r6m6tnZsG9GYWndg0z8dEV7fD733VBFzFJ5Vcm1FtlXB8xBD/rtrBi2a3YKEV7hHtxiZtW5EAVADoe1pA==}\n@@ -1660,14 +1029,6 @@ packages:\n     engines: {node: '>=18.0.0'}\n     hasBin: true\n \n-  type-check@0.4.0:\n-    resolution: {integrity: sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==}\n-    engines: {node: '>= 0.8.0'}\n-\n-  type-is@1.6.18:\n-    resolution: {integrity: sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==}\n-    engines: {node: '>= 0.6'}\n-\n   typescript@5.7.2:\n     resolution: {integrity: sha512-i5t66RHxDvVN40HfDd1PsEThGNnlMCMT3jMUuoh9/0TaqWevNontacunWyN02LA9/fIbEWlcHZcgTKb9QoaLfg==}\n     engines: {node: '>=14.17'}\n@@ -1676,16 +1037,10 @@ packages:\n   undici-types@6.20.0:\n     resolution: {integrity: sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==}\n \n-  unpipe@1.0.0:\n-    resolution: {integrity: sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==}\n-    engines: {node: '>= 0.8'}\n-\n-  uri-js@4.4.1:\n-    resolution: {integrity: sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==}\n-\n-  vary@1.1.2:\n-    resolution: {integrity: sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==}\n-    engines: {node: '>= 0.8'}\n+  watskeburt@4.2.3:\n+    resolution: {integrity: sha512-uG9qtQYoHqAsnT711nG5iZc/8M5inSmkGCOp7pFaytKG2aTfIca7p//CjiVzAE4P7hzaYuCozMjNNaLgmhbK5g==}\n+    engines: {node: ^18||>=20}\n+    hasBin: true\n \n   webidl-conversions@4.0.2:\n     resolution: {integrity: sha512-YQ+BmxuTgd6UXZW3+ICGfyqRyHXVlD5GtQr5+qjiNW7bF0cqrzX500HVXPBOvgXb5YnzDd+h0zqyv61KUD7+Sg==}\n@@ -1698,10 +1053,6 @@ packages:\n     engines: {node: '>= 8'}\n     hasBin: true\n \n-  word-wrap@1.2.5:\n-    resolution: {integrity: sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==}\n-    engines: {node: '>=0.10.0'}\n-\n   wrap-ansi@7.0.0:\n     resolution: {integrity: sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==}\n     engines: {node: '>=10'}\n@@ -1710,35 +1061,8 @@ packages:\n     resolution: {integrity: sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==}\n     engines: {node: '>=12'}\n \n-  wrappy@1.0.2:\n-    resolution: {integrity: sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==}\n-\n-  ylru@1.4.0:\n-    resolution: {integrity: sha512-2OQsPNEmBCvXuFlIni/a+Rn+R2pHW9INm0BxXJ4hVDA8TirqMj+J/Rp9ItLatT/5pZqWwefVrTQcHpixsxnVlA==}\n-    engines: {node: '>= 4.0.0'}\n-\n-  yocto-queue@0.1.0:\n-    resolution: {integrity: sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==}\n-    engines: {node: '>=10'}\n-\n-  zod@3.24.1:\n-    resolution: {integrity: sha512-muH7gBL9sI1nciMZV67X5fTKKBLtwpZ5VBp1vsOQzj1MhrBZ4wlVCm3gedKZWLp0Oyel8sIGfeiz54Su+OVT+A==}\n-\n snapshots:\n \n-  '@babel/helper-string-parser@7.25.9': {}\n-\n-  '@babel/helper-validator-identifier@7.25.9': {}\n-\n-  '@babel/parser@7.26.3':\n-    dependencies:\n-      '@babel/types': 7.26.3\n-\n-  '@babel/types@7.26.3':\n-    dependencies:\n-      '@babel/helper-string-parser': 7.25.9\n-      '@babel/helper-validator-identifier': 7.25.9\n-\n   '@esbuild/aix-ppc64@0.23.1':\n     optional: true\n \n@@ -1886,62 +1210,6 @@ snapshots:\n   '@esbuild/win32-x64@0.24.2':\n     optional: true\n \n-  '@eslint-community/eslint-utils@4.4.1(eslint@9.17.0)':\n-    dependencies:\n-      eslint: 9.17.0\n-      eslint-visitor-keys: 3.4.3\n-\n-  '@eslint-community/regexpp@4.12.1': {}\n-\n-  '@eslint/config-array@0.19.1':\n-    dependencies:\n-      '@eslint/object-schema': 2.1.5\n-      debug: 4.4.0\n-      minimatch: 3.1.2\n-    transitivePeerDependencies:\n-      - supports-color\n-\n-  '@eslint/core@0.9.1':\n-    dependencies:\n-      '@types/json-schema': 7.0.15\n-\n-  '@eslint/eslintrc@3.2.0':\n-    dependencies:\n-      ajv: 6.12.6\n-      debug: 4.4.0\n-      espree: 10.3.0\n-      globals: 14.0.0\n-      ignore: 5.3.2\n-      import-fresh: 3.3.0\n-      js-yaml: 4.1.0\n-      minimatch: 3.1.2\n-      strip-json-comments: 3.1.1\n-    transitivePeerDependencies:\n-      - supports-color\n-\n-  '@eslint/js@9.17.0': {}\n-\n-  '@eslint/object-schema@2.1.5': {}\n-\n-  '@eslint/plugin-kit@0.2.4':\n-    dependencies:\n-      levn: 0.4.1\n-\n-  '@hapi/bourne@3.0.0': {}\n-\n-  '@humanfs/core@0.19.1': {}\n-\n-  '@humanfs/node@0.16.6':\n-    dependencies:\n-      '@humanfs/core': 0.19.1\n-      '@humanwhocodes/retry': 0.3.1\n-\n-  '@humanwhocodes/module-importer@1.0.1': {}\n-\n-  '@humanwhocodes/retry@0.3.1': {}\n-\n-  '@humanwhocodes/retry@0.4.1': {}\n-\n   '@isaacs/cliui@8.0.2':\n     dependencies:\n       string-width: 5.1.2\n@@ -1968,16 +1236,6 @@ snapshots:\n       '@jridgewell/resolve-uri': 3.1.2\n       '@jridgewell/sourcemap-codec': 1.5.0\n \n-  '@koa/cors@5.0.0':\n-    dependencies:\n-      vary: 1.1.2\n-\n-  '@koa/router@13.1.0':\n-    dependencies:\n-      http-errors: 2.0.0\n-      koa-compose: 4.1.0\n-      path-to-regexp: 6.3.0\n-\n   '@kwsites/file-exists@1.1.1':\n     dependencies:\n       debug: 4.4.0\n@@ -1986,18 +1244,6 @@ snapshots:\n \n   '@kwsites/promise-deferred@1.1.1': {}\n \n-  '@nodelib/fs.scandir@2.1.5':\n-    dependencies:\n-      '@nodelib/fs.stat': 2.0.5\n-      run-parallel: 1.2.0\n-\n-  '@nodelib/fs.stat@2.0.5': {}\n-\n-  '@nodelib/fs.walk@1.2.8':\n-    dependencies:\n-      '@nodelib/fs.scandir': 2.1.5\n-      fastq: 1.18.0\n-\n   '@pkgjs/parseargs@0.11.0':\n     optional: true\n \n@@ -2058,240 +1304,34 @@ snapshots:\n   '@rollup/rollup-win32-x64-msvc@4.29.1':\n     optional: true\n \n-  '@types/accepts@1.3.7':\n-    dependencies:\n-      '@types/node': 22.10.2\n-\n-  '@types/body-parser@1.19.5':\n-    dependencies:\n-      '@types/connect': 3.4.38\n-      '@types/node': 22.10.2\n-\n-  '@types/co-body@6.1.3':\n-    dependencies:\n-      '@types/node': 22.10.2\n-      '@types/qs': 6.9.17\n-\n-  '@types/connect@3.4.38':\n-    dependencies:\n-      '@types/node': 22.10.2\n-\n-  '@types/content-disposition@0.5.8': {}\n-\n-  '@types/cookies@0.9.0':\n-    dependencies:\n-      '@types/connect': 3.4.38\n-      '@types/express': 5.0.0\n-      '@types/keygrip': 1.0.6\n-      '@types/node': 22.10.2\n-\n   '@types/estree@1.0.6': {}\n \n-  '@types/express-serve-static-core@5.0.2':\n-    dependencies:\n-      '@types/node': 22.10.2\n-      '@types/qs': 6.9.17\n-      '@types/range-parser': 1.2.7\n-      '@types/send': 0.17.4\n-\n-  '@types/express@5.0.0':\n-    dependencies:\n-      '@types/body-parser': 1.19.5\n-      '@types/express-serve-static-core': 5.0.2\n-      '@types/qs': 6.9.17\n-      '@types/serve-static': 1.15.7\n-\n-  '@types/formidable@2.0.6':\n-    dependencies:\n-      '@types/node': 22.10.2\n-\n-  '@types/http-assert@1.5.6': {}\n-\n-  '@types/http-errors@2.0.4': {}\n-\n-  '@types/json-schema@7.0.15': {}\n-\n-  '@types/keygrip@1.0.6': {}\n-\n-  '@types/koa-compose@3.2.8':\n-    dependencies:\n-      '@types/koa': 2.15.0\n-\n-  '@types/koa-send@4.1.6':\n-    dependencies:\n-      '@types/koa': 2.15.0\n-\n-  '@types/koa-static@4.0.4':\n-    dependencies:\n-      '@types/koa': 2.15.0\n-      '@types/koa-send': 4.1.6\n-\n-  '@types/koa@2.15.0':\n-    dependencies:\n-      '@types/accepts': 1.3.7\n-      '@types/content-disposition': 0.5.8\n-      '@types/cookies': 0.9.0\n-      '@types/http-assert': 1.5.6\n-      '@types/http-errors': 2.0.4\n-      '@types/keygrip': 1.0.6\n-      '@types/koa-compose': 3.2.8\n-      '@types/node': 22.10.2\n-\n-  '@types/koa__cors@5.0.0':\n-    dependencies:\n-      '@types/koa': 2.15.0\n-\n-  '@types/koa__router@12.0.4':\n-    dependencies:\n-      '@types/koa': 2.15.0\n-\n-  '@types/mime@1.3.5': {}\n-\n-  '@types/node@22.10.2':\n+  '@types/node@22.13.8':\n     dependencies:\n       undici-types: 6.20.0\n \n-  '@types/qs@6.9.17': {}\n-\n-  '@types/range-parser@1.2.7': {}\n-\n-  '@types/send@0.17.4':\n-    dependencies:\n-      '@types/mime': 1.3.5\n-      '@types/node': 22.10.2\n-\n-  '@types/serve-static@1.15.7':\n-    dependencies:\n-      '@types/http-errors': 2.0.4\n-      '@types/node': 22.10.2\n-      '@types/send': 0.17.4\n-\n-  '@typescript-eslint/eslint-plugin@8.18.2(@typescript-eslint/parser@8.18.2(eslint@9.17.0)(typescript@5.7.2))(eslint@9.17.0)(typescript@5.7.2)':\n-    dependencies:\n-      '@eslint-community/regexpp': 4.12.1\n-      '@typescript-eslint/parser': 8.18.2(eslint@9.17.0)(typescript@5.7.2)\n-      '@typescript-eslint/scope-manager': 8.18.2\n-      '@typescript-eslint/type-utils': 8.18.2(eslint@9.17.0)(typescript@5.7.2)\n-      '@typescript-eslint/utils': 8.18.2(eslint@9.17.0)(typescript@5.7.2)\n-      '@typescript-eslint/visitor-keys': 8.18.2\n-      eslint: 9.17.0\n-      graphemer: 1.4.0\n-      ignore: 5.3.2\n-      natural-compare: 1.4.0\n-      ts-api-utils: 1.4.3(typescript@5.7.2)\n-      typescript: 5.7.2\n-    transitivePeerDependencies:\n-      - supports-color\n-\n-  '@typescript-eslint/parser@8.18.2(eslint@9.17.0)(typescript@5.7.2)':\n-    dependencies:\n-      '@typescript-eslint/scope-manager': 8.18.2\n-      '@typescript-eslint/types': 8.18.2\n-      '@typescript-eslint/typescript-estree': 8.18.2(typescript@5.7.2)\n-      '@typescript-eslint/visitor-keys': 8.18.2\n-      debug: 4.4.0\n-      eslint: 9.17.0\n-      typescript: 5.7.2\n-    transitivePeerDependencies:\n-      - supports-color\n-\n-  '@typescript-eslint/scope-manager@8.18.2':\n-    dependencies:\n-      '@typescript-eslint/types': 8.18.2\n-      '@typescript-eslint/visitor-keys': 8.18.2\n-\n-  '@typescript-eslint/type-utils@8.18.2(eslint@9.17.0)(typescript@5.7.2)':\n-    dependencies:\n-      '@typescript-eslint/typescript-estree': 8.18.2(typescript@5.7.2)\n-      '@typescript-eslint/utils': 8.18.2(eslint@9.17.0)(typescript@5.7.2)\n-      debug: 4.4.0\n-      eslint: 9.17.0\n-      ts-api-utils: 1.4.3(typescript@5.7.2)\n-      typescript: 5.7.2\n-    transitivePeerDependencies:\n-      - supports-color\n-\n-  '@typescript-eslint/types@8.18.2': {}\n-\n-  '@typescript-eslint/typescript-estree@8.18.2(typescript@5.7.2)':\n-    dependencies:\n-      '@typescript-eslint/types': 8.18.2\n-      '@typescript-eslint/visitor-keys': 8.18.2\n-      debug: 4.4.0\n-      fast-glob: 3.3.2\n-      is-glob: 4.0.3\n-      minimatch: 9.0.5\n-      semver: 7.6.3\n-      ts-api-utils: 1.4.3(typescript@5.7.2)\n-      typescript: 5.7.2\n-    transitivePeerDependencies:\n-      - supports-color\n-\n-  '@typescript-eslint/utils@8.18.2(eslint@9.17.0)(typescript@5.7.2)':\n-    dependencies:\n-      '@eslint-community/eslint-utils': 4.4.1(eslint@9.17.0)\n-      '@typescript-eslint/scope-manager': 8.18.2\n-      '@typescript-eslint/types': 8.18.2\n-      '@typescript-eslint/typescript-estree': 8.18.2(typescript@5.7.2)\n-      eslint: 9.17.0\n-      typescript: 5.7.2\n-    transitivePeerDependencies:\n-      - supports-color\n+  acorn-jsx-walk@2.0.0: {}\n \n-  '@typescript-eslint/visitor-keys@8.18.2':\n-    dependencies:\n-      '@typescript-eslint/types': 8.18.2\n-      eslint-visitor-keys: 4.2.0\n-\n-  '@vue/compiler-core@3.5.13':\n-    dependencies:\n-      '@babel/parser': 7.26.3\n-      '@vue/shared': 3.5.13\n-      entities: 4.5.0\n-      estree-walker: 2.0.2\n-      source-map-js: 1.2.1\n-\n-  '@vue/compiler-dom@3.5.13':\n-    dependencies:\n-      '@vue/compiler-core': 3.5.13\n-      '@vue/shared': 3.5.13\n-\n-  '@vue/compiler-sfc@3.5.13':\n-    dependencies:\n-      '@babel/parser': 7.26.3\n-      '@vue/compiler-core': 3.5.13\n-      '@vue/compiler-dom': 3.5.13\n-      '@vue/compiler-ssr': 3.5.13\n-      '@vue/shared': 3.5.13\n-      estree-walker: 2.0.2\n-      magic-string: 0.30.17\n-      postcss: 8.4.49\n-      source-map-js: 1.2.1\n-\n-  '@vue/compiler-ssr@3.5.13':\n+  acorn-jsx@5.3.2(acorn@8.14.0):\n     dependencies:\n-      '@vue/compiler-dom': 3.5.13\n-      '@vue/shared': 3.5.13\n-\n-  '@vue/shared@3.5.13': {}\n+      acorn: 8.14.0\n \n-  accepts@1.3.8:\n+  acorn-loose@8.4.0:\n     dependencies:\n-      mime-types: 2.1.35\n-      negotiator: 0.6.3\n+      acorn: 8.14.0\n \n-  acorn-jsx@5.3.2(acorn@8.14.0):\n+  acorn-walk@8.3.4:\n     dependencies:\n       acorn: 8.14.0\n \n   acorn@8.14.0: {}\n \n-  ajv@6.12.6:\n+  ajv@8.17.1:\n     dependencies:\n       fast-deep-equal: 3.1.3\n-      fast-json-stable-stringify: 2.1.0\n-      json-schema-traverse: 0.4.1\n-      uri-js: 4.4.1\n+      fast-uri: 3.0.6\n+      json-schema-traverse: 1.0.0\n+      require-from-string: 2.0.2\n \n   ansi-regex@5.0.1: {}\n \n@@ -2305,51 +1345,19 @@ snapshots:\n \n   any-promise@1.3.0: {}\n \n-  argparse@2.0.1: {}\n-\n-  asap@2.0.6: {}\n-\n   balanced-match@1.0.2: {}\n \n-  brace-expansion@1.1.11:\n-    dependencies:\n-      balanced-match: 1.0.2\n-      concat-map: 0.0.1\n-\n   brace-expansion@2.0.1:\n     dependencies:\n       balanced-match: 1.0.2\n \n-  braces@3.0.3:\n-    dependencies:\n-      fill-range: 7.1.1\n-\n   bundle-require@5.1.0(esbuild@0.24.2):\n     dependencies:\n       esbuild: 0.24.2\n       load-tsconfig: 0.2.5\n \n-  bytes@3.1.2: {}\n-\n   cac@6.7.14: {}\n \n-  cache-content-type@1.0.1:\n-    dependencies:\n-      mime-types: 2.1.35\n-      ylru: 1.4.0\n-\n-  call-bind-apply-helpers@1.0.1:\n-    dependencies:\n-      es-errors: 1.3.0\n-      function-bind: 1.1.2\n-\n-  call-bound@1.0.3:\n-    dependencies:\n-      call-bind-apply-helpers: 1.0.1\n-      get-intrinsic: 1.2.6\n-\n-  callsites@3.1.0: {}\n-\n   chalk@4.1.2:\n     dependencies:\n       ansi-styles: 4.3.0\n@@ -2359,97 +1367,65 @@ snapshots:\n     dependencies:\n       readdirp: 4.0.2\n \n-  co-body@6.2.0:\n-    dependencies:\n-      '@hapi/bourne': 3.0.0\n-      inflation: 2.1.0\n-      qs: 6.13.1\n-      raw-body: 2.5.2\n-      type-is: 1.6.18\n-\n-  co@4.6.0: {}\n-\n   color-convert@2.0.1:\n     dependencies:\n       color-name: 1.1.4\n \n   color-name@1.1.4: {}\n \n-  commander@4.1.1: {}\n+  commander@13.1.0: {}\n \n-  concat-map@0.0.1: {}\n+  commander@4.1.1: {}\n \n   consola@3.3.3: {}\n \n-  content-disposition@0.5.4:\n-    dependencies:\n-      safe-buffer: 5.2.1\n-\n-  content-type@1.0.5: {}\n-\n-  cookies@0.9.1:\n-    dependencies:\n-      depd: 2.0.0\n-      keygrip: 1.1.0\n-\n   cross-spawn@7.0.6:\n     dependencies:\n       path-key: 3.1.1\n       shebang-command: 2.0.0\n       which: 2.0.2\n \n-  debug@3.2.7:\n-    dependencies:\n-      ms: 2.1.3\n+  crypto@1.0.1: {}\n \n   debug@4.4.0:\n     dependencies:\n       ms: 2.1.3\n \n-  deep-equal@1.0.1: {}\n-\n-  deep-is@0.1.4: {}\n-\n-  delegates@1.0.0: {}\n-\n-  depd@1.1.2: {}\n-\n-  depd@2.0.0: {}\n-\n-  destroy@1.2.0: {}\n-\n-  dezalgo@1.0.4:\n+  dependency-cruiser@16.10.0:\n     dependencies:\n-      asap: 2.0.6\n-      wrappy: 1.0.2\n-\n-  dotenv@16.4.7: {}\n-\n-  dunder-proto@1.0.1:\n-    dependencies:\n-      call-bind-apply-helpers: 1.0.1\n-      es-errors: 1.3.0\n-      gopd: 1.2.0\n+      acorn: 8.14.0\n+      acorn-jsx: 5.3.2(acorn@8.14.0)\n+      acorn-jsx-walk: 2.0.0\n+      acorn-loose: 8.4.0\n+      acorn-walk: 8.3.4\n+      ajv: 8.17.1\n+      commander: 13.1.0\n+      enhanced-resolve: 5.18.1\n+      ignore: 7.0.3\n+      interpret: 3.1.1\n+      is-installed-globally: 1.0.0\n+      json5: 2.2.3\n+      memoize: 10.1.0\n+      picocolors: 1.1.1\n+      picomatch: 4.0.2\n+      prompts: 2.4.2\n+      rechoir: 0.8.0\n+      safe-regex: 2.1.1\n+      semver: 7.7.1\n+      teamcity-service-messages: 0.1.14\n+      tsconfig-paths-webpack-plugin: 4.2.0\n+      watskeburt: 4.2.3\n \n   eastasianwidth@0.2.0: {}\n \n-  ee-first@1.1.1: {}\n-\n   emoji-regex@8.0.0: {}\n \n   emoji-regex@9.2.2: {}\n \n-  encodeurl@1.0.2: {}\n-\n-  entities@4.5.0: {}\n-\n-  es-define-property@1.0.1: {}\n-\n-  es-errors@1.3.0: {}\n-\n-  es-object-atoms@1.0.0:\n+  enhanced-resolve@5.18.1:\n     dependencies:\n-      es-errors: 1.3.0\n+      graceful-fs: 4.2.11\n+      tapable: 2.2.1\n \n   esbuild@0.23.1:\n     optionalDependencies:\n@@ -2506,164 +1482,28 @@ snapshots:\n       '@esbuild/win32-ia32': 0.24.2\n       '@esbuild/win32-x64': 0.24.2\n \n-  escape-html@1.0.3: {}\n-\n-  escape-string-regexp@4.0.0: {}\n-\n-  eslint-scope@8.2.0:\n-    dependencies:\n-      esrecurse: 4.3.0\n-      estraverse: 5.3.0\n-\n-  eslint-visitor-keys@3.4.3: {}\n-\n-  eslint-visitor-keys@4.2.0: {}\n-\n-  eslint@9.17.0:\n-    dependencies:\n-      '@eslint-community/eslint-utils': 4.4.1(eslint@9.17.0)\n-      '@eslint-community/regexpp': 4.12.1\n-      '@eslint/config-array': 0.19.1\n-      '@eslint/core': 0.9.1\n-      '@eslint/eslintrc': 3.2.0\n-      '@eslint/js': 9.17.0\n-      '@eslint/plugin-kit': 0.2.4\n-      '@humanfs/node': 0.16.6\n-      '@humanwhocodes/module-importer': 1.0.1\n-      '@humanwhocodes/retry': 0.4.1\n-      '@types/estree': 1.0.6\n-      '@types/json-schema': 7.0.15\n-      ajv: 6.12.6\n-      chalk: 4.1.2\n-      cross-spawn: 7.0.6\n-      debug: 4.4.0\n-      escape-string-regexp: 4.0.0\n-      eslint-scope: 8.2.0\n-      eslint-visitor-keys: 4.2.0\n-      espree: 10.3.0\n-      esquery: 1.6.0\n-      esutils: 2.0.3\n-      fast-deep-equal: 3.1.3\n-      file-entry-cache: 8.0.0\n-      find-up: 5.0.0\n-      glob-parent: 6.0.2\n-      ignore: 5.3.2\n-      imurmurhash: 0.1.4\n-      is-glob: 4.0.3\n-      json-stable-stringify-without-jsonify: 1.0.1\n-      lodash.merge: 4.6.2\n-      minimatch: 3.1.2\n-      natural-compare: 1.4.0\n-      optionator: 0.9.4\n-    transitivePeerDependencies:\n-      - supports-color\n-\n-  espree@10.3.0:\n-    dependencies:\n-      acorn: 8.14.0\n-      acorn-jsx: 5.3.2(acorn@8.14.0)\n-      eslint-visitor-keys: 4.2.0\n-\n-  esquery@1.6.0:\n-    dependencies:\n-      estraverse: 5.3.0\n-\n-  esrecurse@4.3.0:\n-    dependencies:\n-      estraverse: 5.3.0\n-\n-  estraverse@5.3.0: {}\n-\n-  estree-walker@2.0.2: {}\n-\n-  esutils@2.0.3: {}\n-\n   fast-deep-equal@3.1.3: {}\n \n-  fast-glob@3.3.2:\n-    dependencies:\n-      '@nodelib/fs.stat': 2.0.5\n-      '@nodelib/fs.walk': 1.2.8\n-      glob-parent: 5.1.2\n-      merge2: 1.4.1\n-      micromatch: 4.0.8\n-\n-  fast-json-stable-stringify@2.1.0: {}\n-\n-  fast-levenshtein@2.0.6: {}\n-\n-  fastq@1.18.0:\n-    dependencies:\n-      reusify: 1.0.4\n+  fast-uri@3.0.6: {}\n \n   fdir@6.4.2(picomatch@4.0.2):\n     optionalDependencies:\n       picomatch: 4.0.2\n \n-  file-entry-cache@8.0.0:\n-    dependencies:\n-      flat-cache: 4.0.1\n-\n-  fill-range@7.1.1:\n-    dependencies:\n-      to-regex-range: 5.0.1\n-\n-  find-up@5.0.0:\n-    dependencies:\n-      locate-path: 6.0.0\n-      path-exists: 4.0.0\n-\n-  flat-cache@4.0.1:\n-    dependencies:\n-      flatted: 3.3.2\n-      keyv: 4.5.4\n-\n-  flatted@3.3.2: {}\n-\n   foreground-child@3.3.0:\n     dependencies:\n       cross-spawn: 7.0.6\n       signal-exit: 4.1.0\n \n-  formidable@2.1.2:\n-    dependencies:\n-      dezalgo: 1.0.4\n-      hexoid: 1.0.0\n-      once: 1.4.0\n-      qs: 6.13.1\n-\n-  fresh@0.5.2: {}\n-\n   fsevents@2.3.3:\n     optional: true\n \n   function-bind@1.1.2: {}\n \n-  get-intrinsic@1.2.6:\n-    dependencies:\n-      call-bind-apply-helpers: 1.0.1\n-      dunder-proto: 1.0.1\n-      es-define-property: 1.0.1\n-      es-errors: 1.3.0\n-      es-object-atoms: 1.0.0\n-      function-bind: 1.1.2\n-      gopd: 1.2.0\n-      has-symbols: 1.1.0\n-      hasown: 2.0.2\n-      math-intrinsics: 1.1.0\n-\n   get-tsconfig@4.8.1:\n     dependencies:\n       resolve-pkg-maps: 1.0.0\n \n-  glob-parent@5.1.2:\n-    dependencies:\n-      is-glob: 4.0.3\n-\n-  glob-parent@6.0.2:\n-    dependencies:\n-      is-glob: 4.0.3\n-\n   glob@10.4.5:\n     dependencies:\n       foreground-child: 3.3.0\n@@ -2682,86 +1522,36 @@ snapshots:\n       package-json-from-dist: 1.0.1\n       path-scurry: 2.0.0\n \n-  globals@14.0.0: {}\n-\n-  gopd@1.2.0: {}\n+  global-directory@4.0.1:\n+    dependencies:\n+      ini: 4.1.1\n \n-  graphemer@1.4.0: {}\n+  graceful-fs@4.2.11: {}\n \n   has-flag@4.0.0: {}\n \n-  has-symbols@1.1.0: {}\n-\n-  has-tostringtag@1.0.2:\n-    dependencies:\n-      has-symbols: 1.1.0\n-\n   hasown@2.0.2:\n     dependencies:\n       function-bind: 1.1.2\n \n-  hexoid@1.0.0: {}\n-\n-  http-assert@1.5.0:\n-    dependencies:\n-      deep-equal: 1.0.1\n-      http-errors: 1.8.1\n+  ignore@7.0.3: {}\n \n-  http-errors@1.6.3:\n-    dependencies:\n-      depd: 1.1.2\n-      inherits: 2.0.3\n-      setprototypeof: 1.1.0\n-      statuses: 1.5.0\n+  ini@4.1.1: {}\n \n-  http-errors@1.8.1:\n-    dependencies:\n-      depd: 1.1.2\n-      inherits: 2.0.4\n-      setprototypeof: 1.2.0\n-      statuses: 1.5.0\n-      toidentifier: 1.0.1\n-\n-  http-errors@2.0.0:\n-    dependencies:\n-      depd: 2.0.0\n-      inherits: 2.0.4\n-      setprototypeof: 1.2.0\n-      statuses: 2.0.1\n-      toidentifier: 1.0.1\n+  interpret@3.1.1: {}\n \n-  iconv-lite@0.4.24:\n+  is-core-module@2.16.1:\n     dependencies:\n-      safer-buffer: 2.1.2\n-\n-  ignore@5.3.2: {}\n-\n-  import-fresh@3.3.0:\n-    dependencies:\n-      parent-module: 1.0.1\n-      resolve-from: 4.0.0\n-\n-  imurmurhash@0.1.4: {}\n-\n-  inflation@2.1.0: {}\n-\n-  inherits@2.0.3: {}\n-\n-  inherits@2.0.4: {}\n-\n-  is-extglob@2.1.1: {}\n+      hasown: 2.0.2\n \n   is-fullwidth-code-point@3.0.0: {}\n \n-  is-generator-function@1.0.10:\n+  is-installed-globally@1.0.0:\n     dependencies:\n-      has-tostringtag: 1.0.2\n+      global-directory: 4.0.1\n+      is-path-inside: 4.0.0\n \n-  is-glob@4.0.3:\n-    dependencies:\n-      is-extglob: 2.1.1\n-\n-  is-number@7.0.0: {}\n+  is-path-inside@4.0.0: {}\n \n   isexe@2.0.0: {}\n \n@@ -2777,139 +1567,40 @@ snapshots:\n \n   joycon@3.1.1: {}\n \n-  js-yaml@4.1.0:\n-    dependencies:\n-      argparse: 2.0.1\n-\n-  json-buffer@3.0.1: {}\n-\n-  json-schema-traverse@0.4.1: {}\n-\n-  json-stable-stringify-without-jsonify@1.0.1: {}\n-\n-  keygrip@1.1.0:\n-    dependencies:\n-      tsscmp: 1.0.6\n-\n-  keyv@4.5.4:\n-    dependencies:\n-      json-buffer: 3.0.1\n-\n-  koa-body@6.0.1:\n-    dependencies:\n-      '@types/co-body': 6.1.3\n-      '@types/formidable': 2.0.6\n-      '@types/koa': 2.15.0\n-      co-body: 6.2.0\n-      formidable: 2.1.2\n-      zod: 3.24.1\n-\n-  koa-compose@4.1.0: {}\n-\n-  koa-convert@2.0.0:\n-    dependencies:\n-      co: 4.6.0\n-      koa-compose: 4.1.0\n-\n-  koa-send@5.0.1:\n-    dependencies:\n-      debug: 4.4.0\n-      http-errors: 1.8.1\n-      resolve-path: 1.4.0\n-    transitivePeerDependencies:\n-      - supports-color\n-\n-  koa-static@5.0.0:\n-    dependencies:\n-      debug: 3.2.7\n-      koa-send: 5.0.1\n-    transitivePeerDependencies:\n-      - supports-color\n+  json-schema-traverse@1.0.0: {}\n \n-  koa@2.15.3:\n-    dependencies:\n-      accepts: 1.3.8\n-      cache-content-type: 1.0.1\n-      content-disposition: 0.5.4\n-      content-type: 1.0.5\n-      cookies: 0.9.1\n-      debug: 4.4.0\n-      delegates: 1.0.0\n-      depd: 2.0.0\n-      destroy: 1.2.0\n-      encodeurl: 1.0.2\n-      escape-html: 1.0.3\n-      fresh: 0.5.2\n-      http-assert: 1.5.0\n-      http-errors: 1.8.1\n-      is-generator-function: 1.0.10\n-      koa-compose: 4.1.0\n-      koa-convert: 2.0.0\n-      on-finished: 2.4.1\n-      only: 0.0.2\n-      parseurl: 1.3.3\n-      statuses: 1.5.0\n-      type-is: 1.6.18\n-      vary: 1.1.2\n-    transitivePeerDependencies:\n-      - supports-color\n+  json5@2.2.3: {}\n \n-  levn@0.4.1:\n-    dependencies:\n-      prelude-ls: 1.2.1\n-      type-check: 0.4.0\n+  kleur@3.0.3: {}\n \n   lilconfig@3.1.3: {}\n \n   lines-and-columns@1.2.4: {}\n \n   load-tsconfig@0.2.5: {}\n \n-  locate-path@6.0.0:\n-    dependencies:\n-      p-locate: 5.0.0\n-\n-  lodash.merge@4.6.2: {}\n-\n   lodash.sortby@4.7.0: {}\n \n   lru-cache@10.4.3: {}\n \n   lru-cache@11.0.2: {}\n \n-  magic-string@0.30.17:\n-    dependencies:\n-      '@jridgewell/sourcemap-codec': 1.5.0\n-\n-  math-intrinsics@1.1.0: {}\n-\n-  media-typer@0.3.0: {}\n-\n-  merge2@1.4.1: {}\n-\n-  micromatch@4.0.8:\n+  memoize@10.1.0:\n     dependencies:\n-      braces: 3.0.3\n-      picomatch: 2.3.1\n+      mimic-function: 5.0.1\n \n-  mime-db@1.52.0: {}\n-\n-  mime-types@2.1.35:\n-    dependencies:\n-      mime-db: 1.52.0\n+  mimic-function@5.0.1: {}\n \n   minimatch@10.0.1:\n     dependencies:\n       brace-expansion: 2.0.1\n \n-  minimatch@3.1.2:\n-    dependencies:\n-      brace-expansion: 1.1.11\n-\n   minimatch@9.0.5:\n     dependencies:\n       brace-expansion: 2.0.1\n \n+  minimist@1.2.8: {}\n+\n   minipass@7.1.2: {}\n \n   ms@2.1.3: {}\n@@ -2920,57 +1611,21 @@ snapshots:\n       object-assign: 4.1.1\n       thenify-all: 1.6.0\n \n-  nanoid@3.3.8: {}\n+  nanoid@3.3.8:\n+    optional: true\n \n-  natural-compare@1.4.0: {}\n+  node-addon-api@8.3.0: {}\n \n-  negotiator@0.6.3: {}\n+  node-gyp-build@4.8.4: {}\n \n   object-assign@4.1.1: {}\n \n-  object-inspect@1.13.3: {}\n-\n-  on-finished@2.4.1:\n-    dependencies:\n-      ee-first: 1.1.1\n-\n-  once@1.4.0:\n-    dependencies:\n-      wrappy: 1.0.2\n-\n-  only@0.0.2: {}\n-\n-  optionator@0.9.4:\n-    dependencies:\n-      deep-is: 0.1.4\n-      fast-levenshtein: 2.0.6\n-      levn: 0.4.1\n-      prelude-ls: 1.2.1\n-      type-check: 0.4.0\n-      word-wrap: 1.2.5\n-\n-  p-limit@3.1.0:\n-    dependencies:\n-      yocto-queue: 0.1.0\n-\n-  p-locate@5.0.0:\n-    dependencies:\n-      p-limit: 3.1.0\n-\n   package-json-from-dist@1.0.1: {}\n \n-  parent-module@1.0.1:\n-    dependencies:\n-      callsites: 3.1.0\n-\n-  parseurl@1.3.3: {}\n-\n-  path-exists@4.0.0: {}\n-\n-  path-is-absolute@1.0.1: {}\n-\n   path-key@3.1.1: {}\n \n+  path-parse@1.0.7: {}\n+\n   path-scurry@1.11.1:\n     dependencies:\n       lru-cache: 10.4.3\n@@ -2981,62 +1636,52 @@ snapshots:\n       lru-cache: 11.0.2\n       minipass: 7.1.2\n \n-  path-to-regexp@6.3.0: {}\n-\n   picocolors@1.1.1: {}\n \n-  picomatch@2.3.1: {}\n-\n   picomatch@4.0.2: {}\n \n   pirates@4.0.6: {}\n \n-  postcss-load-config@6.0.1(postcss@8.4.49)(tsx@4.19.2):\n+  postcss-load-config@6.0.1(postcss@8.5.3)(tsx@4.19.2):\n     dependencies:\n       lilconfig: 3.1.3\n     optionalDependencies:\n-      postcss: 8.4.49\n+      postcss: 8.5.3\n       tsx: 4.19.2\n \n-  postcss@8.4.49:\n+  postcss@8.5.3:\n     dependencies:\n       nanoid: 3.3.8\n       picocolors: 1.1.1\n       source-map-js: 1.2.1\n+    optional: true\n \n-  prelude-ls@1.2.1: {}\n-\n-  prettier@3.4.2: {}\n+  prompts@2.4.2:\n+    dependencies:\n+      kleur: 3.0.3\n+      sisteransi: 1.0.5\n \n   punycode@2.3.1: {}\n \n-  qs@6.13.1:\n-    dependencies:\n-      side-channel: 1.1.0\n-\n-  queue-microtask@1.2.3: {}\n+  readdirp@4.0.2: {}\n \n-  raw-body@2.5.2:\n+  rechoir@0.8.0:\n     dependencies:\n-      bytes: 3.1.2\n-      http-errors: 2.0.0\n-      iconv-lite: 0.4.24\n-      unpipe: 1.0.0\n+      resolve: 1.22.10\n \n-  readdirp@4.0.2: {}\n+  regexp-tree@0.1.27: {}\n \n-  resolve-from@4.0.0: {}\n+  require-from-string@2.0.2: {}\n \n   resolve-from@5.0.0: {}\n \n-  resolve-path@1.4.0:\n-    dependencies:\n-      http-errors: 1.6.3\n-      path-is-absolute: 1.0.1\n-\n   resolve-pkg-maps@1.0.0: {}\n \n-  reusify@1.0.4: {}\n+  resolve@1.22.10:\n+    dependencies:\n+      is-core-module: 2.16.1\n+      path-parse: 1.0.7\n+      supports-preserve-symlinks-flag: 1.0.0\n \n   rollup@4.29.1:\n     dependencies:\n@@ -3063,54 +1708,18 @@ snapshots:\n       '@rollup/rollup-win32-x64-msvc': 4.29.1\n       fsevents: 2.3.3\n \n-  run-parallel@1.2.0:\n+  safe-regex@2.1.1:\n     dependencies:\n-      queue-microtask: 1.2.3\n-\n-  safe-buffer@5.2.1: {}\n-\n-  safer-buffer@2.1.2: {}\n-\n-  semver@7.6.3: {}\n+      regexp-tree: 0.1.27\n \n-  setprototypeof@1.1.0: {}\n-\n-  setprototypeof@1.2.0: {}\n+  semver@7.7.1: {}\n \n   shebang-command@2.0.0:\n     dependencies:\n       shebang-regex: 3.0.0\n \n   shebang-regex@3.0.0: {}\n \n-  side-channel-list@1.0.0:\n-    dependencies:\n-      es-errors: 1.3.0\n-      object-inspect: 1.13.3\n-\n-  side-channel-map@1.0.1:\n-    dependencies:\n-      call-bound: 1.0.3\n-      es-errors: 1.3.0\n-      get-intrinsic: 1.2.6\n-      object-inspect: 1.13.3\n-\n-  side-channel-weakmap@1.0.2:\n-    dependencies:\n-      call-bound: 1.0.3\n-      es-errors: 1.3.0\n-      get-intrinsic: 1.2.6\n-      object-inspect: 1.13.3\n-      side-channel-map: 1.0.1\n-\n-  side-channel@1.1.0:\n-    dependencies:\n-      es-errors: 1.3.0\n-      object-inspect: 1.13.3\n-      side-channel-list: 1.0.0\n-      side-channel-map: 1.0.1\n-      side-channel-weakmap: 1.0.2\n-\n   signal-exit@4.1.0: {}\n \n   simple-git@3.27.0:\n@@ -3121,16 +1730,15 @@ snapshots:\n     transitivePeerDependencies:\n       - supports-color\n \n-  source-map-js@1.2.1: {}\n+  sisteransi@1.0.5: {}\n+\n+  source-map-js@1.2.1:\n+    optional: true\n \n   source-map@0.8.0-beta.0:\n     dependencies:\n       whatwg-url: 7.1.0\n \n-  statuses@1.5.0: {}\n-\n-  statuses@2.0.1: {}\n-\n   string-width@4.2.3:\n     dependencies:\n       emoji-regex: 8.0.0\n@@ -3151,7 +1759,7 @@ snapshots:\n     dependencies:\n       ansi-regex: 6.1.0\n \n-  strip-json-comments@3.1.1: {}\n+  strip-bom@3.0.0: {}\n \n   sucrase@3.35.0:\n     dependencies:\n@@ -3167,6 +1775,12 @@ snapshots:\n     dependencies:\n       has-flag: 4.0.0\n \n+  supports-preserve-symlinks-flag@1.0.0: {}\n+\n+  tapable@2.2.1: {}\n+\n+  teamcity-service-messages@0.1.14: {}\n+\n   thenify-all@1.6.0:\n     dependencies:\n       thenify: 3.3.1\n@@ -3182,27 +1796,55 @@ snapshots:\n       fdir: 6.4.2(picomatch@4.0.2)\n       picomatch: 4.0.2\n \n-  to-regex-range@5.0.1:\n-    dependencies:\n-      is-number: 7.0.0\n-\n-  toidentifier@1.0.1: {}\n-\n   tr46@1.0.1:\n     dependencies:\n       punycode: 2.3.1\n \n   tree-kill@1.2.2: {}\n \n-  ts-api-utils@1.4.3(typescript@5.7.2):\n+  tree-sitter-javascript@0.23.1(tree-sitter@0.22.4):\n     dependencies:\n-      typescript: 5.7.2\n+      node-addon-api: 8.3.0\n+      node-gyp-build: 4.8.4\n+    optionalDependencies:\n+      tree-sitter: 0.22.4\n+\n+  tree-sitter-python@0.23.6(tree-sitter@0.22.4):\n+    dependencies:\n+      node-addon-api: 8.3.0\n+      node-gyp-build: 4.8.4\n+    optionalDependencies:\n+      tree-sitter: 0.22.4\n+\n+  tree-sitter-typescript@0.23.2(tree-sitter@0.22.4):\n+    dependencies:\n+      node-addon-api: 8.3.0\n+      node-gyp-build: 4.8.4\n+      tree-sitter-javascript: 0.23.1(tree-sitter@0.22.4)\n+    optionalDependencies:\n+      tree-sitter: 0.22.4\n+\n+  tree-sitter@0.22.4:\n+    dependencies:\n+      node-addon-api: 8.3.0\n+      node-gyp-build: 4.8.4\n \n   ts-interface-checker@0.1.13: {}\n \n-  tsscmp@1.0.6: {}\n+  tsconfig-paths-webpack-plugin@4.2.0:\n+    dependencies:\n+      chalk: 4.1.2\n+      enhanced-resolve: 5.18.1\n+      tapable: 2.2.1\n+      tsconfig-paths: 4.2.0\n+\n+  tsconfig-paths@4.2.0:\n+    dependencies:\n+      json5: 2.2.3\n+      minimist: 1.2.8\n+      strip-bom: 3.0.0\n \n-  tsup@8.3.5(postcss@8.4.49)(tsx@4.19.2)(typescript@5.7.2):\n+  tsup@8.3.5(postcss@8.5.3)(tsx@4.19.2)(typescript@5.7.2):\n     dependencies:\n       bundle-require: 5.1.0(esbuild@0.24.2)\n       cac: 6.7.14\n@@ -3212,7 +1854,7 @@ snapshots:\n       esbuild: 0.24.2\n       joycon: 3.1.1\n       picocolors: 1.1.1\n-      postcss-load-config: 6.0.1(postcss@8.4.49)(tsx@4.19.2)\n+      postcss-load-config: 6.0.1(postcss@8.5.3)(tsx@4.19.2)\n       resolve-from: 5.0.0\n       rollup: 4.29.1\n       source-map: 0.8.0-beta.0\n@@ -3221,7 +1863,7 @@ snapshots:\n       tinyglobby: 0.2.10\n       tree-kill: 1.2.2\n     optionalDependencies:\n-      postcss: 8.4.49\n+      postcss: 8.5.3\n       typescript: 5.7.2\n     transitivePeerDependencies:\n       - jiti\n@@ -3236,26 +1878,11 @@ snapshots:\n     optionalDependencies:\n       fsevents: 2.3.3\n \n-  type-check@0.4.0:\n-    dependencies:\n-      prelude-ls: 1.2.1\n-\n-  type-is@1.6.18:\n-    dependencies:\n-      media-typer: 0.3.0\n-      mime-types: 2.1.35\n-\n   typescript@5.7.2: {}\n \n   undici-types@6.20.0: {}\n \n-  unpipe@1.0.0: {}\n-\n-  uri-js@4.4.1:\n-    dependencies:\n-      punycode: 2.3.1\n-\n-  vary@1.1.2: {}\n+  watskeburt@4.2.3: {}\n \n   webidl-conversions@4.0.2: {}\n \n@@ -3269,8 +1896,6 @@ snapshots:\n     dependencies:\n       isexe: 2.0.0\n \n-  word-wrap@1.2.5: {}\n-\n   wrap-ansi@7.0.0:\n     dependencies:\n       ansi-styles: 4.3.0\n@@ -3282,11 +1907,3 @@ snapshots:\n       ansi-styles: 6.2.1\n       string-width: 5.1.2\n       strip-ansi: 7.1.0\n-\n-  wrappy@1.0.2: {}\n-\n-  ylru@1.4.0: {}\n-\n-  yocto-queue@0.1.0: {}\n-\n-  zod@3.24.1: {}"
          },
          {
              "sha": "ea1c093d8455f1df2f9b0452e56baa208efd8e8f",
              "filename": "src/core/codeAnalyzer.ts",
              "status": "added",
              "additions": 646,
              "deletions": 0,
              "changes": 646,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Fcore%2FcodeAnalyzer.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Fcore%2FcodeAnalyzer.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2FcodeAnalyzer.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -0,0 +1,646 @@\n+import Parser from 'tree-sitter';\n+import TypeScript from 'tree-sitter-typescript';\n+import path from 'path';\n+import fs from 'fs';\n+// 导入知识图谱相关接口\n+import { KnowledgeNode, KnowledgeEdge, KnowledgeGraph as IKnowledgeGraph } from '../utils/graphSearch';\n+\n+// 代码元素类型定义\n+type ElementType =\n+  | 'function'\n+  | 'class'\n+  | 'interface'\n+  | 'variable'\n+  | 'import'\n+  | 'constructor'\n+  | 'class_method'\n+  | 'type_alias';\n+\n+// 代码元素接口\n+interface CodeElement {\n+  id?: string;\n+  type: ElementType;\n+  name: string;\n+  filePath: string;\n+  className?: string;\n+  location: {\n+    file: string;\n+    line: number;\n+  };\n+  implementation?: string;\n+}\n+\n+// 代码关系类型\n+export type RelationType =\n+  | 'calls'      // 函数调用关系\n+  | 'imports'    // 导入关系\n+  | 'extends'    // 继承关系\n+  | 'implements' // 接口实现关系\n+  | 'defines';   // 定义关系\n+\n+// 代码关系接口\n+export interface CodeRelation {\n+  sourceId: string;\n+  targetId: string;\n+  type: RelationType;\n+}\n+\n+// 修改知识图谱接口名称以避免冲突\n+interface KnowledgeGraph extends IKnowledgeGraph {\n+  nodes: KnowledgeNode[];\n+  edges: KnowledgeEdge[];\n+}\n+\n+export class CodeAnalyzer {\n+  private parser: Parser;\n+  private codeElements: CodeElement[] = [];\n+  private relations: CodeRelation[] = [];\n+  private currentFile: string = '';\n+  private currentClass: string | null = null;\n+  private currentFunctionId: string | null = null;\n+  private scopeStack: string[] = [];\n+\n+  constructor() {\n+    this.parser = new Parser();\n+    this.parser.setLanguage(TypeScript.typescript as any);\n+  }\n+\n+  /**\n+   * 分析代码文件\n+   */\n+  public analyzeCode(filePath: string, sourceCode: string): void {\n+    if (!filePath) {\n+      throw new Error('File path cannot be undefined');\n+    }\n+    this.currentFile = filePath;\n+    try {\n+      // console.log(`[CodeAnalyzer] Processing file: ${filePath}`);\n+\n+      const tree = this.parser.parse(sourceCode);\n+      // console.log(`[CodeAnalyzer] AST generated for ${filePath}`);\n+\n+      this.visitNode(tree.rootNode);\n+\n+      // console.log(`[CodeAnalyzer] Analysis complete for ${filePath}`);\n+      // console.log(`[CodeAnalyzer] Found ${this.codeElements.length} nodes`);\n+      // console.log(`[CodeAnalyzer] Found ${this.relations.length} relationships`);\n+    } catch (error) {\n+      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n+    }\n+  }\n+\n+  /**\n+   * 访问 AST 节点\n+   */\n+  private visitNode(node: Parser.SyntaxNode): void {\n+    // 添加更多节点类型匹配\n+    switch (node.type) {\n+      case 'function_declaration':\n+      case 'method_definition':  // 添加方法定义\n+      case 'arrow_function':     // 添加箭头函数\n+        this.analyzeFunctionDeclaration(node);\n+        break;\n+\n+      case 'class_declaration':\n+      case 'class':             // 添加类表达式\n+        this.analyzeClassDeclaration(node, this.currentFile);\n+        break;\n+\n+      case 'interface_declaration':\n+        this.analyzeInterface(node);\n+        break;\n+\n+      case 'type_alias_declaration':  // 添加类型别名\n+        this.analyzeTypeAlias(node);\n+        break;\n+\n+      case 'call_expression':\n+      case 'new_expression':    // 添加 new 表达式\n+        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n+        break;\n+\n+      case 'import_declaration':\n+      case 'import_statement':\n+        this.analyzeImportStatement(node, this.currentFile);\n+        break;\n+\n+      case 'variable_declaration':    // 添加变量声明\n+        this.analyzeVariableDeclaration(node);\n+        break;\n+\n+      case 'implements_clause':\n+        this.analyzeImplementsRelation(node);\n+        break;\n+    }\n+\n+    // 递归访问子节点\n+    for (const child of node.children) {\n+      this.visitNode(child);\n+    }\n+  }\n+\n+  /**\n+   * 分析函数声明\n+   */\n+  private analyzeFunctionDeclaration(node: Parser.SyntaxNode): void {\n+    const nameNode = node.childForFieldName('name');\n+    if (!nameNode) return;\n+\n+    const element: CodeElement = {\n+      type: 'function',\n+      name: nameNode.text,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: nameNode.startPosition.row + 1\n+      },\n+      implementation: node.text\n+    };\n+\n+    // 设置当前函数上下文\n+    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n+    this.scopeStack.push(this.currentFunctionId);  // 使用栈维护嵌套调用\n+    this.addCodeElement(element);\n+    this.currentFunctionId = null; // 重置上下文\n+  }\n+\n+  /**\n+   * 分析类声明\n+   */\n+  private analyzeClassDeclaration(node: Parser.SyntaxNode, filePath: string): void {\n+    const className = this.getNodeName(node);\n+    if (!className) return;\n+\n+    // 1. 添加类定义\n+    const classElement: CodeElement = {\n+      type: 'class',\n+      name: className,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: node.startPosition.row + 1\n+      },\n+      implementation: node.text\n+    };\n+\n+    this.addCodeElement(classElement);\n+    this.currentClass = className;\n+\n+    // 2. 分析继承关系\n+    const extendsClause = node.childForFieldName('extends');\n+    if (extendsClause) {\n+      const superClassName = this.getNodeName(extendsClause);\n+      if (superClassName) {\n+        const currentClassId = `${this.currentFile}#${className}`;\n+        const superClassId = this.resolveTypeReference(superClassName);\n+        if (superClassId) {\n+          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n+          this.addRelation(currentClassId, superClassId, 'extends');\n+        }\n+      }\n+    }\n+\n+    // 3. 分析类的方法\n+    for (const child of node.children) {\n+      if (child.type === 'method_definition' || child.type === 'constructor') {\n+        this.analyzeClassMethod(child, className);\n+      }\n+    }\n+\n+    // 4. 分析接口实现\n+    const implementsClause = node.childForFieldName('implements');\n+    if (implementsClause) {\n+      this.analyzeImplementsRelation(implementsClause);\n+    }\n+\n+    this.currentClass = null;\n+  }\n+\n+  /**\n+   * 分析接口声明\n+   */\n+  private analyzeInterface(node: Parser.SyntaxNode): void {\n+    const nameNode = node.childForFieldName('name');\n+    if (!nameNode) return;\n+\n+    const element: CodeElement = {\n+      type: 'interface',\n+      name: nameNode.text,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: nameNode.startPosition.row + 1\n+      },\n+      id: `${this.currentFile}#Interface#${nameNode.text}`,\n+      implementation: node.text\n+    };\n+    this.addCodeElement(element);\n+  }\n+\n+  /**\n+   * 分析函数调用\n+   */\n+  private analyzeCallExpression(node: Parser.SyntaxNode, currentScope: string) {\n+    const calleeName = this.resolveCallee(node);\n+    if (calleeName) {\n+      const currentNode = this.codeElements.find(e => e.id === currentScope);\n+      const calleeNode = this.codeElements.find(e => e.id === calleeName);\n+\n+      if (currentNode && calleeNode) {\n+        // console.log(`[Debug] Found call expression:`, {\n+        //   caller: currentNode.name,\n+        //   callee: calleeNode.name,\n+        //   callerId: currentScope,\n+        //   calleeId: calleeName\n+        // });\n+        this.addRelation(currentScope, calleeName, 'calls');\n+      }\n+    }\n+  }\n+\n+  /**\n+   * 分析导入声明\n+   */\n+  private analyzeImportStatement(node: Parser.SyntaxNode, filePath: string) {\n+    const importPath = this.getImportPath(node);\n+    if (importPath) {\n+      // console.log(`[Debug] Found import:`, {\n+      //   importer: filePath,\n+      //   imported: importPath\n+      // });\n+      this.addRelation(filePath, importPath, 'imports');\n+    }\n+  }\n+\n+  private normalizePath(importPath: string): string {\n+    // 内置模块列表\n+    const builtinModules = ['fs', 'path', 'crypto', 'util'];\n+\n+    if (builtinModules.includes(importPath)) {\n+      return importPath;\n+    }\n+\n+    // 将相对路径转换为绝对路径\n+    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n+\n+    // 确保路径以 .ts 结尾\n+    if (!fullPath.endsWith('.ts')) {\n+      return `${fullPath}.ts`;\n+    }\n+\n+    return fullPath;\n+  }\n+\n+  /**\n+   * 添加代码元素\n+   */\n+  private addCodeElement(element: Omit<CodeElement, 'id'>): void {\n+    const elementId = (() => {\n+      switch (element.type) {\n+        case 'class':\n+          return `${element.filePath}#${element.name}`;\n+        case 'class_method':\n+        case 'constructor':\n+          return `${element.filePath}#${element.className}#${element.name}`;\n+        case 'interface':\n+          return `${element.filePath}#Interface#${element.name}`;\n+        case 'type_alias':\n+          return `${element.filePath}#Type#${element.name}`;\n+        default:\n+          return `${element.filePath}#${element.name}`;\n+      }\n+    })();\n+\n+    const codeElement: CodeElement = {\n+      ...element,\n+      id: elementId\n+    };\n+\n+    // console.log(`[Debug] Adding code element:`, {\n+    //   type: element.type,\n+    //   name: element.name,\n+    //   id: elementId,\n+    //   className: 'className' in element ? element.className : undefined\n+    // });\n+\n+    this.codeElements.push(codeElement);\n+  }\n+\n+  /**\n+   * 添加关系\n+   */\n+  private addRelation(source: string, target: string, type: RelationType): void {\n+    // 检查源节点和目标节点是否存在\n+    const sourceNode = this.codeElements.find(e => e.id === source);\n+    const targetNode = this.codeElements.find(e => e.id === target);\n+\n+    if (!sourceNode) {\n+      // console.warn(`[Warning] Source node not found: ${source}`);\n+      return;\n+    }\n+    if (!targetNode) {\n+      // console.warn(`[Warning] Target node not found: ${target}`);\n+      return;\n+    }\n+\n+    const relation: CodeRelation = {\n+      sourceId: source,\n+      targetId: target,\n+      type\n+    };\n+\n+    // 检查是否已存在相同的关系\n+    const exists = this.relations.some(r =>\n+      r.sourceId === source &&\n+      r.targetId === target &&\n+      r.type === type\n+    );\n+\n+    if (!exists) {\n+      this.relations.push(relation);\n+      // console.log(`[Debug] Added relation: ${sourceNode.name} -[${type}]-> ${targetNode.name}`);\n+    }\n+  }\n+\n+  /**\n+   * 获取代码索引\n+   */\n+  public getCodeIndex(): Map<string, CodeElement[]> {\n+    const codeIndex = new Map<string, CodeElement[]>();\n+    this.codeElements.forEach(element => {\n+      const filePath = element.filePath;\n+      const existingElements = codeIndex.get(filePath) || [];\n+      existingElements.push(element);\n+      codeIndex.set(filePath, existingElements);\n+    });\n+    return codeIndex;\n+  }\n+\n+  /**\n+   * 获取知识图谱\n+   */\n+  public getKnowledgeGraph(): KnowledgeGraph {\n+    console.log(`[Debug] Generating knowledge graph:`, {\n+      totalElements: this.codeElements.length,\n+      totalRelations: this.relations.length\n+    });\n+\n+    // 1. 先转换节点,添加 implementation 字段\n+    const nodes: KnowledgeNode[] = this.codeElements.map(element => ({\n+      id: element.id!,\n+      name: element.name,\n+      type: element.type,\n+      filePath: element.filePath,\n+      location: element.location,\n+      implementation: element.implementation || '' // 添加 implementation 字段\n+    }));\n+\n+    // 2. 验证所有关系\n+    const validRelations = this.relations.filter(relation => {\n+      const sourceExists = this.codeElements.some(e => e.id === relation.sourceId);\n+      const targetExists = this.codeElements.some(e => e.id === relation.targetId);\n+\n+      if (!sourceExists || !targetExists) {\n+        console.warn(`[Warning] Invalid relation:`, {\n+          source: relation.sourceId,\n+          target: relation.targetId,\n+          type: relation.type,\n+          sourceExists,\n+          targetExists\n+        });\n+        return false;\n+      }\n+      return true;\n+    });\n+\n+    // 3. 转换关系\n+    const edges: KnowledgeEdge[] = validRelations.map(relation => ({\n+      source: relation.sourceId,\n+      target: relation.targetId,\n+      type: relation.type,\n+      properties: {}\n+    }));\n+\n+    console.log(`[Debug] Knowledge graph generated:`, {\n+      nodes: nodes.length,\n+      edges: edges.length,\n+      relationTypes: new Set(edges.map(e => e.type))\n+    });\n+\n+    return { nodes, edges };\n+  }\n+\n+  /**\n+   * 获取特定类型的所有元素\n+   */\n+  public getElementsByType(type: ElementType): CodeElement[] {\n+    return this.codeElements.filter(element => element.type === type);\n+  }\n+\n+  /**\n+   * 获取特定元素的所有关系\n+   */\n+  public getElementRelations(elementName: string): CodeRelation[] {\n+    return this.relations.filter(\n+      edge => edge.sourceId === elementName || edge.targetId === elementName\n+    );\n+  }\n+\n+  /**\n+   * 导出分析结果\n+   */\n+  public exportAnalysis(): string {\n+    return JSON.stringify({\n+      codeElements: this.codeElements,\n+      relations: this.relations\n+    }, null, 2);\n+  }\n+\n+  // 添加变量声明分析\n+  private analyzeVariableDeclaration(node: Parser.SyntaxNode): void {\n+    const declarator = node.childForFieldName('declarator');\n+    const nameNode = declarator?.childForFieldName('name');\n+    if (!nameNode) return;\n+\n+    const element: CodeElement = {\n+      type: 'variable',\n+      name: nameNode.text,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: nameNode.startPosition.row + 1\n+      },\n+      implementation: node.text\n+    };\n+\n+    this.addCodeElement(element);\n+  }\n+\n+  public validateAnalysis(): boolean {\n+    let isValid = true;\n+\n+    // 唯一性检查\n+    const idSet = new Set<string>();\n+    this.codeElements.forEach(node => {\n+      if (node.id && idSet.has(node.id)) {\n+        console.error(`[Validation] 重复节点ID: ${node.id}`);\n+        isValid = false;\n+      }\n+      if (node.id) {\n+        idSet.add(node.id);\n+      }\n+    });\n+\n+    // 关系有效性检查\n+    this.relations.forEach(edge => {\n+      const sourceExists = this.codeElements.some(e => e.id === edge.sourceId);\n+      const targetExists = this.codeElements.some(e => e.id === edge.targetId);\n+\n+      if (!sourceExists) {\n+        console.error(`[Validation] 无效关系源: ${edge.sourceId}`);\n+        isValid = false;\n+      }\n+      if (!targetExists) {\n+        console.error(`[Validation] 无效关系目标: ${edge.targetId}`);\n+        isValid = false;\n+      }\n+    });\n+\n+    return isValid;\n+  }\n+\n+  private getNodeName(node: Parser.SyntaxNode): string | undefined {\n+    const nameNode = node.childForFieldName('name');\n+    return nameNode?.text;\n+  }\n+\n+  private getImplementedInterfaces(node: Parser.SyntaxNode): string[] {\n+    return node.text.replace('implements ', '').split(',').map(s => s.trim());\n+  }\n+\n+  private analyzeClassMethod(node: Parser.SyntaxNode, className: string): void {\n+    const isConstructor = node.type === 'constructor';\n+    const methodNameNode = isConstructor\n+      ? node.childForFieldName('name')\n+      : node.childForFieldName('name');\n+\n+    const methodName = methodNameNode?.text || 'anonymous';\n+\n+    // 1. 添加方法定义\n+    const element: CodeElement = {\n+      type: isConstructor ? 'constructor' : 'class_method',\n+      name: methodName,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: node.startPosition.row + 1\n+      },\n+      className\n+    };\n+\n+    this.addCodeElement(element);\n+\n+    // 2. 添加类定义方法的关系\n+    const classId = `${this.currentFile}#${className}`;\n+    const methodId = `${this.currentFile}#${className}#${methodName}`;\n+\n+    console.log(`[Debug] Adding class method relation:`, {\n+      class: className,\n+      method: methodName,\n+      classId,\n+      methodId,\n+      type: element.type\n+    });\n+\n+    this.addRelation(classId, methodId, 'defines');\n+  }\n+\n+  // 添加一个辅助方法来验证关系\n+  private validateMethodRelation(classId: string, methodId: string): boolean {\n+    const classNode = this.codeElements.find(e => e.id === classId);\n+    const methodNode = this.codeElements.find(e => e.id === methodId);\n+\n+    if (!classNode) {\n+      console.error(`[Error] Class node not found: ${classId}`);\n+      return false;\n+    }\n+    if (!methodNode) {\n+      console.error(`[Error] Method node not found: ${methodId}`);\n+      return false;\n+    }\n+\n+    console.log(`[Debug] Validated method relation:`, {\n+      class: classNode.name,\n+      method: methodNode.name,\n+      classId,\n+      methodId\n+    });\n+\n+    return true;\n+  }\n+\n+  private analyzeImplementsRelation(node: Parser.SyntaxNode): void {\n+    const interfaces = this.getImplementedInterfaces(node);\n+    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n+\n+    interfaces.forEach(interfaceName => {\n+      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n+      if (interfaceId) {\n+        this.addRelation(currentClassId, interfaceId, 'implements');\n+      }\n+    });\n+  }\n+\n+  private analyzeTypeAlias(node: Parser.SyntaxNode): void {\n+    const nameNode = node.childForFieldName('name');\n+    if (!nameNode) return;\n+\n+    const element: CodeElement = {\n+      type: 'type_alias',\n+      name: nameNode.text,\n+      filePath: this.currentFile,\n+      location: {\n+        file: this.currentFile,\n+        line: nameNode.startPosition.row + 1\n+      }\n+    };\n+    this.addCodeElement(element);\n+  }\n+\n+  private resolveCallee(node: Parser.SyntaxNode): string | undefined {\n+    const calleeNode = node.childForFieldName('function');\n+    if (!calleeNode) return undefined;\n+\n+    // 通过完整路径查找元素\n+    const calleeName = calleeNode.text;\n+    const calleeClass = this.currentClass;\n+\n+    // 构建可能的ID格式\n+    const possibleIds = [\n+      `${this.currentFile}#${calleeName}`,                    // 普通函数\n+      `${this.currentFile}#${calleeClass}#${calleeName}`,    // 类方法\n+      `${this.currentFile}#${calleeClass}#constructor`        // 构造函数\n+    ];\n+\n+    // 查找匹配的元素\n+    for (const id of possibleIds) {\n+      const element = this.codeElements.find(e => e.id === id);\n+      if (element) return id;\n+    }\n+\n+    return undefined;\n+  }\n+\n+  private getImportPath(node: Parser.SyntaxNode): string {\n+    const moduleNode = node.childForFieldName('source');\n+    if (!moduleNode) return '';\n+\n+    // 移除引号\n+    return moduleNode.text.replace(/['\"]/g, '');\n+  }\n+\n+  private resolveTypeReference(typeName: string): string | undefined {\n+    const element = this.codeElements.find(e => e.name === typeName);\n+    return element?.id;\n+  }\n+} \n\\ No newline at end of file"
          },
          {
              "sha": "39c8f0ea16aa4ba736a5fd98d84a4842ea509b43",
              "filename": "src/core/dependency/analyzer.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 278,
              "changes": 278,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fdependency%2Fanalyzer.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fdependency%2Fanalyzer.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2Fdependency%2Fanalyzer.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,278 +0,0 @@\n-import * as ts from 'typescript';\n-import { parse } from '@vue/compiler-sfc';\n-import type {\n-  DependencyAnalysis,\n-  ImportInfo,\n-  ExportInfo,\n-  FunctionCallInfo,\n-  ClassRelationInfo,\n-  MethodInfo,\n-  CodeLocation,\n-  FileType\n-} from '../../types/dependency/index.js';\n-import * as path from 'path';\n-\n-export class DependencyAnalyzer {\n-  private program: ts.Program;\n-\n-  constructor(configPath?: string) {\n-    // 如果提供了tsconfig路径，使用它创建program\n-    if (configPath) {\n-      const config = ts.readConfigFile(configPath, ts.sys.readFile);\n-      const parsedConfig = ts.parseJsonConfigFileContent(\n-        config.config,\n-        ts.sys,\n-        process.cwd()\n-      );\n-      this.program = ts.createProgram(\n-        parsedConfig.fileNames,\n-        parsedConfig.options\n-      );\n-    }\n-  }\n-\n-  private getSourceFile(content: string, filePath: string): ts.SourceFile {\n-    return ts.createSourceFile(\n-      filePath,\n-      content,\n-      ts.ScriptTarget.Latest,\n-      true\n-    );\n-  }\n-\n-  private getCodeLocation(node: ts.Node, sourceFile: ts.SourceFile): CodeLocation {\n-    const { line, character } = sourceFile.getLineAndCharacterOfPosition(\n-      node.getStart()\n-    );\n-    return {\n-      line: line + 1,\n-      column: character + 1,\n-      filePath: sourceFile.fileName\n-    };\n-  }\n-\n-  private analyzeImports(sourceFile: ts.SourceFile): ImportInfo[] {\n-    const imports: ImportInfo[] = [];\n-\n-    const visitNode = (node: ts.Node) => {\n-      if (ts.isImportDeclaration(node)) {\n-        const importPath = (node.moduleSpecifier as ts.StringLiteral).text;\n-        const specifiers: string[] = [];\n-        let importType: ImportInfo['importType'] = 'named';\n-\n-        if (node.importClause) {\n-          if (node.importClause.name) {\n-            specifiers.push(node.importClause.name.text);\n-            importType = 'default';\n-          }\n-\n-          const namedBindings = node.importClause.namedBindings;\n-          if (namedBindings) {\n-            if (ts.isNamespaceImport(namedBindings)) {\n-              importType = 'namespace';\n-              specifiers.push(namedBindings.name.text);\n-            } else if (ts.isNamedImports(namedBindings)) {\n-              namedBindings.elements.forEach(element => {\n-                specifiers.push(element.name.text);\n-              });\n-            }\n-          }\n-        }\n-\n-        imports.push({\n-          source: importPath,\n-          specifiers,\n-          importType,\n-          location: this.getCodeLocation(node, sourceFile)\n-        });\n-      }\n-\n-      ts.forEachChild(node, visitNode);\n-    };\n-\n-    visitNode(sourceFile);\n-    return imports;\n-  }\n-\n-  private analyzeExports(sourceFile: ts.SourceFile): ExportInfo[] {\n-    const exports: ExportInfo[] = [];\n-\n-    const visitNode = (node: ts.Node) => {\n-      if (ts.isExportDeclaration(node)) {\n-        if (node.exportClause && ts.isNamedExports(node.exportClause)) {\n-          node.exportClause.elements.forEach(element => {\n-            exports.push({\n-              name: element.name.text,\n-              type: 'named',\n-              location: this.getCodeLocation(element, sourceFile)\n-            });\n-          });\n-        }\n-      } else if (ts.isExportAssignment(node)) {\n-        exports.push({\n-          name: node.expression.getText(),\n-          type: 'default',\n-          location: this.getCodeLocation(node, sourceFile)\n-        });\n-      }\n-\n-      ts.forEachChild(node, visitNode);\n-    };\n-\n-    visitNode(sourceFile);\n-    return exports;\n-  }\n-\n-  private analyzeFunctionCalls(sourceFile: ts.SourceFile): FunctionCallInfo[] {\n-    const functionCalls: FunctionCallInfo[] = [];\n-\n-    const visitNode = (node: ts.Node) => {\n-      if (ts.isCallExpression(node)) {\n-        const callee = node.expression;\n-        if (ts.isIdentifier(callee)) {\n-          functionCalls.push({\n-            caller: {\n-              name: this.getFunctionName(node),\n-              location: this.getCodeLocation(node, sourceFile)\n-            },\n-            callee: {\n-              name: callee.text,\n-              location: this.getCodeLocation(callee, sourceFile)\n-            }\n-          });\n-        }\n-      }\n-\n-      ts.forEachChild(node, visitNode);\n-    };\n-\n-    visitNode(sourceFile);\n-    return functionCalls;\n-  }\n-\n-  private getFunctionName(node: ts.Node): string {\n-    let current = node.parent;\n-    while (current) {\n-      if (ts.isFunctionDeclaration(current) && current.name) {\n-        return current.name.text;\n-      }\n-      if (ts.isMethodDeclaration(current) && current.name) {\n-        return current.name.getText();\n-      }\n-      current = current.parent;\n-    }\n-    return 'anonymous';\n-  }\n-\n-  private analyzeClassRelations(sourceFile: ts.SourceFile): ClassRelationInfo[] {\n-    const classRelations: ClassRelationInfo[] = [];\n-\n-    const visitNode = (node: ts.Node) => {\n-      if (ts.isClassDeclaration(node) && node.name) {\n-        const className = node.name.text;\n-        const extendsClause = node.heritageClauses?.find(\n-          clause => clause.token === ts.SyntaxKind.ExtendsKeyword\n-        );\n-        const implementsClause = node.heritageClauses?.find(\n-          clause => clause.token === ts.SyntaxKind.ImplementsKeyword\n-        );\n-\n-        const methods: MethodInfo[] = node.members\n-          .filter(ts.isMethodDeclaration)\n-          .map(method => ({\n-            name: method.name.getText(),\n-            visibility: this.getMethodVisibility(method),\n-            isStatic: method.modifiers?.some(\n-              mod => mod.kind === ts.SyntaxKind.StaticKeyword\n-            ) ?? false,\n-            location: this.getCodeLocation(method, sourceFile)\n-          }));\n-\n-        classRelations.push({\n-          className,\n-          extends: extendsClause?.types[0].expression.getText(),\n-          implements: implementsClause?.types.map(t => t.expression.getText()),\n-          methods,\n-          location: this.getCodeLocation(node, sourceFile)\n-        });\n-      }\n-\n-      ts.forEachChild(node, visitNode);\n-    };\n-\n-    visitNode(sourceFile);\n-    return classRelations;\n-  }\n-\n-  private getMethodVisibility(method: ts.MethodDeclaration): 'public' | 'private' | 'protected' {\n-    if (method.modifiers) {\n-      if (method.modifiers.some(mod => mod.kind === ts.SyntaxKind.PrivateKeyword)) {\n-        return 'private';\n-      }\n-      if (method.modifiers.some(mod => mod.kind === ts.SyntaxKind.ProtectedKeyword)) {\n-        return 'protected';\n-      }\n-    }\n-    return 'public';\n-  }\n-\n-  private getFileType(filePath: string): FileType {\n-    const ext = path.extname(filePath).toLowerCase();\n-    switch (ext) {\n-      case '.ts': return 'typescript';\n-      case '.js': return 'javascript';\n-      case '.vue': return 'vue';\n-      case '.jsx': return 'jsx';\n-      case '.tsx': return 'tsx';\n-      default: return 'javascript';\n-    }\n-  }\n-\n-  private analyzeVueFile(content: string, filePath: string): DependencyAnalysis {\n-    // 解析 Vue SFC\n-    const { descriptor } = parse(content);\n-    let scriptContent = '';\n-\n-    // 获取脚本内容\n-    if (descriptor.script) {\n-      scriptContent = descriptor.script.content;\n-    } else if (descriptor.scriptSetup) {\n-      scriptContent = descriptor.scriptSetup.content;\n-    }\n-\n-    // 创建一个虚拟的 ts/js 文件来分析脚本部分\n-    const sourceFile = this.getSourceFile(scriptContent, filePath);\n-\n-    return {\n-      filePath,\n-      fileType: 'vue',\n-      imports: this.analyzeImports(sourceFile),\n-      exports: this.analyzeExports(sourceFile),\n-      functionCalls: this.analyzeFunctionCalls(sourceFile),\n-      classRelations: this.analyzeClassRelations(sourceFile),\n-      dependencies: []\n-    };\n-  }\n-\n-  async analyzeFile(content: string, filePath: string): Promise<DependencyAnalysis> {\n-    const fileType = this.getFileType(filePath);\n-\n-    // 对于 Vue 文件使用专门的分析器\n-    if (fileType === 'vue') {\n-      return this.analyzeVueFile(content, filePath);\n-    }\n-\n-    // 其他类型文件(ts/js/jsx/tsx)都使用 TypeScript 分析器\n-    const sourceFile = this.getSourceFile(content, filePath);\n-\n-    return {\n-      filePath,\n-      fileType,\n-      imports: this.analyzeImports(sourceFile),\n-      exports: this.analyzeExports(sourceFile),\n-      functionCalls: this.analyzeFunctionCalls(sourceFile),\n-      classRelations: this.analyzeClassRelations(sourceFile),\n-      dependencies: []\n-    };\n-  }\n-} \n\\ No newline at end of file"
          },
          {
              "sha": "4512619f07d4b77b1c9d58b40bd17dd3a39048e8",
              "filename": "src/core/dependency/enhanced-scanner.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 89,
              "changes": 89,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fdependency%2Fenhanced-scanner.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fdependency%2Fenhanced-scanner.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2Fdependency%2Fenhanced-scanner.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,89 +0,0 @@\n-import { FileScanner } from '../scanner.js';\n-import type { DependencyAnalysis, ImportInfo } from '../../types/dependency/index.js';\n-import { DependencyAnalyzer } from './analyzer.js';\n-\n-interface AnalysisCacheEntry {\n-  analysis: DependencyAnalysis;\n-  timestamp: number;\n-  contentHash: string;\n-}\n-\n-export class EnhancedScanner extends FileScanner {\n-  private analysisCache: Map<string, AnalysisCacheEntry> = new Map();\n-  private readonly CACHE_TTL = 1000 * 60 * 5; // 5分钟缓存过期\n-\n-  constructor(private dependencyAnalyzer: DependencyAnalyzer) {\n-    super();\n-  }\n-\n-  private calculateContentHash(content: string): string {\n-    return Buffer.from(content).toString('base64');\n-  }\n-\n-  private isCacheValid(entry: AnalysisCacheEntry, contentHash: string): boolean {\n-    const now = Date.now();\n-    return (\n-      entry.contentHash === contentHash &&\n-      now - entry.timestamp < this.CACHE_TTL\n-    );\n-  }\n-\n-  protected override async analyzeDependencies(\n-    content: string,\n-    filePath: string,\n-    basePath: string\n-  ): Promise<string[]> {\n-    // 计算内容hash用于缓存验证\n-    const contentHash = this.calculateContentHash(content);\n-    const cacheKey = `${filePath}:${contentHash}`;\n-\n-    // 检查缓存\n-    const cachedEntry = this.analysisCache.get(cacheKey);\n-    if (cachedEntry && this.isCacheValid(cachedEntry, contentHash)) {\n-      return cachedEntry.analysis.dependencies;\n-    }\n-\n-    // 获取基础依赖分析\n-    const basicDeps = await super.analyzeDependencies(content, filePath, basePath);\n-\n-    // 使用依赖分析器进行深度分析\n-    const analysis = await this.dependencyAnalyzer.analyzeFile(content, filePath);\n-\n-    // 合并基础依赖和深度分析结果\n-    const enhancedAnalysis: DependencyAnalysis = {\n-      ...analysis,\n-      dependencies: basicDeps\n-    };\n-\n-    // 更新缓存\n-    this.analysisCache.set(cacheKey, {\n-      analysis: enhancedAnalysis,\n-      timestamp: Date.now(),\n-      contentHash\n-    });\n-\n-    return basicDeps;\n-  }\n-\n-  // 获取完整的依赖分析结果\n-  async getAnalysis(\n-    content: string,\n-    filePath: string,\n-    basePath: string\n-  ): Promise<DependencyAnalysis> {\n-    await this.analyzeDependencies(content, filePath, basePath);\n-    const contentHash = this.calculateContentHash(content);\n-    const cacheKey = `${filePath}:${contentHash}`;\n-    return this.analysisCache.get(cacheKey)!.analysis;\n-  }\n-\n-  // 清理过期缓存\n-  private cleanExpiredCache(): void {\n-    const now = Date.now();\n-    for (const [key, entry] of this.analysisCache.entries()) {\n-      if (now - entry.timestamp >= this.CACHE_TTL) {\n-        this.analysisCache.delete(key);\n-      }\n-    }\n-  }\n-} \n\\ No newline at end of file"
          },
          {
              "sha": "da0ed07d87d09b29279747732ee19a6813d8f45a",
              "filename": "src/core/errors.ts",
              "status": "modified",
              "additions": 14,
              "deletions": 8,
              "changes": 22,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Fcore%2Ferrors.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Fcore%2Ferrors.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2Ferrors.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -1,49 +1,55 @@\n+// 错误基类\n export class GitIngestError extends Error {\n   constructor(message: string) {\n     super(message);\n-    this.name = 'GitIngestError';\n+    this.name = \"GitIngestError\";\n   }\n }\n \n+// 错误基类\n export class GitOperationError extends GitIngestError {\n   constructor(operation: string, details: string) {\n     super(`Git operation '${operation}' failed: ${details}`);\n-    this.name = 'GitOperationError';\n+    this.name = \"GitOperationError\";\n   }\n }\n \n+// 文件处理错误\n export class FileProcessError extends GitIngestError {\n   constructor(path: string, reason: string) {\n     super(`Failed to process file '${path}': ${reason}`);\n-    this.name = 'FileProcessError';\n+    this.name = \"FileProcessError\";\n   }\n }\n \n+// 验证错误\n export class ValidationError extends GitIngestError {\n   constructor(message: string) {\n     super(`Validation failed: ${message}`);\n-    this.name = 'ValidationError';\n+    this.name = \"ValidationError\";\n   }\n }\n \n+// 依赖分析错误\n export class DependencyAnalysisError extends Error {\n   constructor(\n     public readonly filePath: string,\n-    public readonly errorType: 'parse' | 'resolve' | 'analyze',\n+    public readonly errorType: \"parse\" | \"resolve\" | \"analyze\",\n     message: string\n   ) {\n     super(`[${errorType}] ${message} in file: ${filePath}`);\n-    this.name = 'DependencyAnalysisError';\n+    this.name = \"DependencyAnalysisError\";\n   }\n }\n \n+// git 分析错误\n export class GitAnalysisError extends Error {\n   constructor(\n     public readonly operation: string,\n     public readonly target: string,\n     message: string\n   ) {\n     super(`Git analysis failed: ${message} (${operation} on ${target})`);\n-    this.name = 'GitAnalysisError';\n+    this.name = \"GitAnalysisError\";\n   }\n-} \n\\ No newline at end of file\n+}"
          },
          {
              "sha": "878dd8b50436c6104aa26b09ad4d358c6e548f2b",
              "filename": "src/core/git.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 44,
              "changes": 44,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fgit.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fgit.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2Fgit.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,44 +0,0 @@\n-import { simpleGit, SimpleGit } from 'simple-git';\n-import { GitOperationError } from './errors.js';\n-import { env } from '../utils/env.js';\n-\n-export class GitHandler {\n-  private git: SimpleGit;\n-\n-  constructor() {\n-    const config: string[] = [];\n-\n-    console.log(\"HTTP_PROXY:\", env.HTTP_PROXY);\n-    console.log(\"HTTPS_PROXY:\", env.HTTPS_PROXY);\n-\n-    // 如果存在vpn代理，则使用环境变量\n-    if (env.HTTP_PROXY) {\n-      config.push(`http.proxy=${env.HTTP_PROXY}`);\n-    }\n-    if (env.HTTPS_PROXY) {\n-      config.push(`https.proxy=${env.HTTPS_PROXY}`);\n-    }\n-\n-    this.git = simpleGit({\n-      baseDir: process.cwd(),\n-      ...(config.length > 0 ? { config } : {})\n-    });\n-  }\n-\n-  async clone(url: string, path: string): Promise<void> {\n-    try {\n-      await this.git.clone(url, path);\n-    } catch (error) {\n-      throw new GitOperationError('clone', (error as Error).message);\n-    }\n-  }\n-\n-  async checkoutBranch(path: string, branch: string): Promise<void> {\n-    try {\n-      const git = simpleGit(path);\n-      await git.checkout(branch);\n-    } catch (error) {\n-      throw new GitOperationError('checkout', (error as Error).message);\n-    }\n-  }\n-} \n\\ No newline at end of file"
          },
          {
              "sha": "d209c27d5cb65cb7def24c1198a0ce333cf7d683",
              "filename": "src/core/git/analyzer.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 440,
              "changes": 440,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fgit%2Fanalyzer.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fgit%2Fanalyzer.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2Fgit%2Fanalyzer.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,440 +0,0 @@\n-import { simpleGit, SimpleGit } from 'simple-git';\n-import type {\n-  ChangeAnalysis,\n-  CommitInfo,\n-  FileChange,\n-  GitAnalysisOptions,\n-  ImpactAnalysis,\n-  RelatedCommit\n-} from '../../types/git/index.js';\n-import { DependencyAnalyzer } from '../dependency/analyzer.js';\n-import { GitAnalysisError } from '../errors.js';\n-\n-interface CommitCache {\n-  timestamp: number;\n-  data: any;\n-}\n-\n-export class GitAnalyzer {\n-  private git: SimpleGit;\n-  private defaultOptions: GitAnalysisOptions = {\n-    maxDepth: 10,\n-    includeMerges: false,\n-    analyzeImpact: true,\n-    findRelated: true\n-  };\n-\n-  // 缓存以提高性能\n-  private commitCache: Map<string, CommitCache> = new Map();\n-  private readonly CACHE_TTL = 1000 * 60 * 5; // 5分钟缓存过期\n-\n-  constructor(\n-    private repoPath: string,\n-    private dependencyAnalyzer: DependencyAnalyzer\n-  ) {\n-    this.git = simpleGit(repoPath);\n-  }\n-\n-  private getCachedData<T>(key: string): T | null {\n-    const cached = this.commitCache.get(key);\n-    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {\n-      return cached.data as T;\n-    }\n-    return null;\n-  }\n-\n-  private setCachedData(key: string, data: any): void {\n-    this.commitCache.set(key, {\n-      timestamp: Date.now(),\n-      data\n-    });\n-  }\n-\n-  async analyzeChanges(\n-    commitHash: string,\n-    options?: GitAnalysisOptions\n-  ): Promise<ChangeAnalysis> {\n-    try {\n-      const opts = { ...this.defaultOptions, ...options };\n-\n-      // 获取提交信息\n-      const commitInfo = await this.getCommitInfo(commitHash);\n-\n-      // 获取文件变更\n-      const changes = await this.getFileChanges(commitHash);\n-\n-      // 分析影响\n-      const impacts = opts.analyzeImpact\n-        ? await this.analyzeImpact(changes)\n-        : { directFiles: [], indirectFiles: [], potentialImpact: 'low' as const };\n-\n-      // 查找相关提交\n-      const relatedCommits = opts.findRelated\n-        ? await this.findRelatedCommits(commitHash, changes, opts.maxDepth)\n-        : [];\n-\n-      return {\n-        commitInfo,\n-        changes,\n-        impacts,\n-        relatedCommits\n-      };\n-    } catch (error) {\n-      throw new GitAnalysisError(\n-        'analyzeChanges',\n-        commitHash,\n-        (error as Error).message\n-      );\n-    }\n-  }\n-\n-  private async getCommitInfo(hash: string): Promise<CommitInfo> {\n-    const cacheKey = `commit:${hash}`;\n-    const cached = this.getCachedData<CommitInfo>(cacheKey);\n-    if (cached) return cached;\n-\n-    try {\n-      const log = await this.git.log(['-1', hash]);\n-      const commit = log.latest;\n-      if (!commit) {\n-        throw new Error(`Commit ${hash} not found`);\n-      }\n-\n-      const info = {\n-        hash: commit.hash,\n-        author: commit.author_name,\n-        date: new Date(commit.date),\n-        message: commit.message,\n-        branch: await this.getBranchForCommit(hash)\n-      };\n-\n-      this.setCachedData(cacheKey, info);\n-      return info;\n-    } catch (error) {\n-      throw new GitAnalysisError(\n-        'getCommitInfo',\n-        hash,\n-        (error as Error).message\n-      );\n-    }\n-  }\n-\n-  private async getBranchForCommit(hash: string): Promise<string | undefined> {\n-    try {\n-      const result = await this.git.branch(['--contains', hash]);\n-      const branches = result.all.filter(b => !b.startsWith('remotes/'));\n-      return branches[0];\n-    } catch {\n-      return undefined;\n-    }\n-  }\n-\n-  private async getFileChanges(hash: string): Promise<FileChange[]> {\n-    const cacheKey = `changes:${hash}`;\n-    const cached = this.getCachedData<FileChange[]>(cacheKey);\n-    if (cached) return cached;\n-\n-    try {\n-      const changes: FileChange[] = [];\n-      const parentHash = await this.getParentHash(hash);\n-\n-      // 使用单个命令获取所有需要的信息\n-      const stats = await this.git.show([\n-        hash,\n-        '--numstat',\n-        '--format=',\n-        '--unified=3'\n-      ]);\n-\n-      // 解析统计信息\n-      const lines = stats.trim().split('\\n');\n-      const fileStats = new Map<string, { additions: number; deletions: number }>();\n-\n-      for (const line of lines) {\n-        if (!line.trim() || line.startsWith('diff')) continue;\n-\n-        const [additions, deletions, file] = line.split('\\t');\n-        if (!file) continue;\n-\n-        fileStats.set(file, {\n-          additions: parseInt(additions) || 0,\n-          deletions: parseInt(deletions) || 0\n-        });\n-      }\n-\n-      // 获取文件变更类型和补丁\n-      const diff = await this.git.show([hash]);\n-      const patches = this.extractAllPatches(diff);\n-\n-      for (const [file, stats] of fileStats) {\n-        const type = await this.getChangeType(hash, file, parentHash);\n-        changes.push({\n-          file,\n-          type,\n-          additions: stats.additions,\n-          deletions: stats.deletions,\n-          patches: patches.get(file) || []\n-        });\n-      }\n-\n-      this.setCachedData(cacheKey, changes);\n-      return changes;\n-    } catch (error) {\n-      throw new GitAnalysisError(\n-        'getFileChanges',\n-        hash,\n-        (error as Error).message\n-      );\n-    }\n-  }\n-\n-  private extractAllPatches(diff: string): Map<string, string[]> {\n-    const patches = new Map<string, string[]>();\n-    const diffParts = diff.split('diff --git');\n-\n-    for (const part of diffParts) {\n-      if (!part.trim()) continue;\n-\n-      const fileMatch = part.match(/a\\/(.*?) b\\//);\n-      if (!fileMatch) continue;\n-\n-      const file = fileMatch[1];\n-      const currentPatches: string[] = [];\n-      const lines = part.split('\\n');\n-      let currentPatch: string[] = [];\n-      let inPatch = false;\n-\n-      for (const line of lines) {\n-        if (line.startsWith('@@')) {\n-          if (currentPatch.length > 0) {\n-            currentPatches.push(currentPatch.join('\\n'));\n-            currentPatch = [];\n-          }\n-          inPatch = true;\n-        }\n-\n-        if (inPatch) {\n-          currentPatch.push(line);\n-        }\n-      }\n-\n-      if (currentPatch.length > 0) {\n-        currentPatches.push(currentPatch.join('\\n'));\n-      }\n-\n-      patches.set(file, currentPatches);\n-    }\n-\n-    return patches;\n-  }\n-\n-  private async getChangeType(\n-    hash: string,\n-    file: string,\n-    parentHash: string | null\n-  ): Promise<'add' | 'modify' | 'delete'> {\n-    const cacheKey = `type:${hash}:${file}`;\n-    const cached = this.getCachedData<'add' | 'modify' | 'delete'>(cacheKey);\n-    if (cached) return cached;\n-\n-    try {\n-      if (!parentHash) return 'add';\n-\n-      const fileExistsInParent = await this.git.raw([\n-        'ls-tree',\n-        '-r',\n-        parentHash,\n-        file\n-      ]);\n-\n-      const fileExistsInCurrent = await this.git.raw([\n-        'ls-tree',\n-        '-r',\n-        hash,\n-        file\n-      ]);\n-\n-      let type: 'add' | 'modify' | 'delete';\n-      if (!fileExistsInParent) {\n-        type = 'add';\n-      } else if (!fileExistsInCurrent) {\n-        type = 'delete';\n-      } else {\n-        type = 'modify';\n-      }\n-\n-      this.setCachedData(cacheKey, type);\n-      return type;\n-    } catch {\n-      return 'modify';\n-    }\n-  }\n-\n-  private async getParentHash(hash: string): Promise<string | null> {\n-    try {\n-      const result = await this.git.raw(['rev-parse', `${hash}^`]);\n-      return result.trim();\n-    } catch {\n-      return null;\n-    }\n-  }\n-\n-  private async analyzeImpact(changes: FileChange[]): Promise<ImpactAnalysis> {\n-    const directFiles = changes.map(c => c.file);\n-    const indirectFiles: string[] = [];\n-\n-    // 分析依赖关系\n-    for (const change of changes) {\n-      try {\n-        const content = await this.git.show([`HEAD:${change.file}`]);\n-        const analysis = await this.dependencyAnalyzer.analyzeFile(\n-          content,\n-          change.file\n-        );\n-\n-        // 添加依赖文件到间接影响列表\n-        for (const dep of analysis.dependencies) {\n-          if (!directFiles.includes(dep) && !indirectFiles.includes(dep)) {\n-            indirectFiles.push(dep);\n-          }\n-        }\n-      } catch {\n-        // 忽略无法分析的文件\n-        continue;\n-      }\n-    }\n-\n-    // 计算影响程度\n-    const potentialImpact = this.calculateImpactLevel(\n-      directFiles,\n-      indirectFiles\n-    );\n-\n-    return {\n-      directFiles,\n-      indirectFiles,\n-      potentialImpact\n-    };\n-  }\n-\n-  private calculateImpactLevel(\n-    directFiles: string[],\n-    indirectFiles: string[]\n-  ): 'high' | 'medium' | 'low' {\n-    const totalImpact = directFiles.length + indirectFiles.length * 0.5;\n-\n-    if (totalImpact > 10) return 'high';\n-    if (totalImpact > 5) return 'medium';\n-    return 'low';\n-  }\n-\n-  private async findRelatedCommits(\n-    hash: string,\n-    changes: FileChange[],\n-    maxDepth: number = 10\n-  ): Promise<RelatedCommit[]> {\n-    const cacheKey = `related:${hash}`;\n-    const cached = this.getCachedData<RelatedCommit[]>(cacheKey);\n-    if (cached) return cached;\n-\n-    try {\n-      const relatedCommits = new Map<string, RelatedCommit>();\n-      const files = changes.map(c => c.file);\n-\n-      // 获取每个文件的历史提交\n-      for (const file of files) {\n-        const logs = await this.git.log({\n-          file,\n-          maxCount: maxDepth\n-        });\n-\n-        for (const commit of logs.all) {\n-          if (commit.hash === hash) continue;\n-\n-          const relevanceScore = await this.calculateRelevanceScore(\n-            hash,\n-            commit.hash,\n-            file\n-          );\n-\n-          // 如果已存在这个提交，更新最高的相关性得分\n-          if (relatedCommits.has(commit.hash)) {\n-            const existing = relatedCommits.get(commit.hash)!;\n-            if (relevanceScore > existing.relevanceScore) {\n-              existing.relevanceScore = relevanceScore;\n-            }\n-          } else {\n-            relatedCommits.set(commit.hash, {\n-              hash: commit.hash,\n-              message: commit.message,\n-              date: new Date(commit.date),\n-              relevanceType: 'same-file',\n-              relevanceScore\n-            });\n-          }\n-        }\n-      }\n-\n-      // 转换为数组并排序\n-      const result = Array.from(relatedCommits.values())\n-        .sort((a, b) => b.relevanceScore - a.relevanceScore)\n-        .slice(0, maxDepth);\n-\n-      this.setCachedData(cacheKey, result);\n-      return result;\n-    } catch (error) {\n-      throw new GitAnalysisError(\n-        'findRelatedCommits',\n-        hash,\n-        (error as Error).message\n-      );\n-    }\n-  }\n-\n-  private async calculateRelevanceScore(\n-    currentHash: string,\n-    relatedHash: string,\n-    file: string\n-  ): Promise<number> {\n-    const cacheKey = `score:${currentHash}:${relatedHash}:${file}`;\n-    const cached = this.getCachedData<number>(cacheKey);\n-    if (cached !== null) return cached;\n-\n-    try {\n-      // 获取两个提交中文件的差异\n-      const diff = await this.git.diff([currentHash, relatedHash, '--', file]);\n-\n-      // 计算更复杂的相关性得分\n-      const lines = diff.split('\\n');\n-      const changedLines = lines.filter(\n-        line => line.startsWith('+') || line.startsWith('-')\n-      );\n-      const contextLines = lines.filter(\n-        line => !line.startsWith('+') && !line.startsWith('-') && !line.startsWith('@@')\n-      );\n-\n-      // 考虑变更行数和上下文行数的比例\n-      const changeRatio = changedLines.length / (lines.length || 1);\n-      const contextRatio = contextLines.length / (lines.length || 1);\n-\n-      // 结合变更比例和上下文比例计算最终得分\n-      const score = (1 - changeRatio) * 0.7 + contextRatio * 0.3;\n-      const finalScore = Math.max(0, Math.min(1, score));\n-\n-      this.setCachedData(cacheKey, finalScore);\n-      return finalScore;\n-    } catch {\n-      return 0;\n-    }\n-  }\n-\n-  // 清理过期缓存\n-  private cleanExpiredCache(): void {\n-    const now = Date.now();\n-    for (const [key, entry] of this.commitCache.entries()) {\n-      if (now - entry.timestamp >= this.CACHE_TTL) {\n-        this.commitCache.delete(key);\n-      }\n-    }\n-  }\n-} \n\\ No newline at end of file"
          },
          {
              "sha": "95cd68cfb8e3fc7251a6befdf3e221a162b2da30",
              "filename": "src/core/git/branch-analyzer.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 343,
              "changes": 343,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fgit%2Fbranch-analyzer.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Fcore%2Fgit%2Fbranch-analyzer.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2Fgit%2Fbranch-analyzer.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,343 +0,0 @@\n-import { SimpleGit } from 'simple-git';\n-import type { BranchDiffAnalysis, BranchAnalysisOptions } from '../../types/git/branch.js';\n-import type { CommitInfo } from '../../types/git/index.js';\n-import { DependencyAnalyzer } from '../dependency/analyzer.js';\n-import { GitAnalysisError } from '../errors.js';\n-\n-interface ConflictArea {\n-  file: string;\n-  lines: number[];\n-  severity: 'high' | 'medium' | 'low';\n-}\n-\n-export class BranchAnalyzer {\n-  private defaultOptions: Required<BranchAnalysisOptions> = {\n-    includeCommits: true,\n-    includeConflicts: true,\n-    includeDependencies: true,\n-    maxDepth: 100\n-  };\n-\n-  constructor(\n-    private git: SimpleGit,\n-    private dependencyAnalyzer: DependencyAnalyzer\n-  ) { }\n-\n-  async analyzeBranchDiff(\n-    sourceBranch: string,\n-    targetBranch: string,\n-    options?: BranchAnalysisOptions\n-  ): Promise<BranchDiffAnalysis> {\n-    try {\n-      const opts = { ...this.defaultOptions, ...options };\n-\n-      // 获取分支差异信息\n-      const mergeBase = await this.getMergeBase(sourceBranch, targetBranch);\n-\n-      // 获取提交信息\n-      const commits = opts.includeCommits\n-        ? await this.analyzeCommits(sourceBranch, targetBranch, mergeBase)\n-        : { ahead: [], behind: [], diverged: [] };\n-\n-      // 分析文件差异\n-      const files = await this.analyzeFiles(sourceBranch, targetBranch);\n-\n-      // 分析冲突\n-      const conflicts = opts.includeConflicts\n-        ? await this.analyzeConflicts(sourceBranch, targetBranch, files)\n-        : { files: [], probability: 0, conflictAreas: [] };\n-\n-      // 分析依赖影响\n-      const dependencyImpact = opts.includeDependencies\n-        ? await this.analyzeDependencyImpact(files)\n-        : { broken: [], affected: [], risk: 'low' as const };\n-\n-      return {\n-        sourceBranch,\n-        targetBranch,\n-        commits,\n-        files,\n-        conflicts,\n-        dependencyImpact\n-      };\n-    } catch (error) {\n-      throw new GitAnalysisError(\n-        'analyzeBranchDiff',\n-        `${sourceBranch}..${targetBranch}`,\n-        (error as Error).message\n-      );\n-    }\n-  }\n-\n-  private async getMergeBase(source: string, target: string): Promise<string> {\n-    const result = await this.git.raw(['merge-base', source, target]);\n-    return result.trim();\n-  }\n-\n-  private async analyzeCommits(\n-    source: string,\n-    target: string,\n-    mergeBase: string\n-  ): Promise<BranchDiffAnalysis['commits']> {\n-    const [sourceLog, targetLog] = await Promise.all([\n-      this.git.log([`${mergeBase}..${source}`]),\n-      this.git.log([`${mergeBase}..${target}`])\n-    ]);\n-\n-    const ahead = sourceLog.all.map(commit => ({\n-      hash: commit.hash,\n-      author: commit.author_name,\n-      date: new Date(commit.date),\n-      message: commit.message\n-    }));\n-\n-    const behind = targetLog.all.map(commit => ({\n-      hash: commit.hash,\n-      author: commit.author_name,\n-      date: new Date(commit.date),\n-      message: commit.message\n-    }));\n-\n-    // 找出分叉的提交\n-    const diverged = await this.findDivergedCommits(source, target, mergeBase);\n-\n-    return { ahead, behind, diverged };\n-  }\n-\n-  private async findDivergedCommits(\n-    source: string,\n-    target: string,\n-    mergeBase: string\n-  ): Promise<CommitInfo[]> {\n-    const log = await this.git.log([\n-      '--graph',\n-      '--format=%H %P',\n-      `${mergeBase}..${source}`,\n-      `${mergeBase}..${target}`\n-    ]);\n-\n-    const commits = new Set<string>();\n-    const lines = log.all.map(c => c.hash);\n-\n-    for (const line of lines) {\n-      const [commit, ...parents] = line.split(' ');\n-      if (parents.length > 1) {\n-        commits.add(commit);\n-      }\n-    }\n-\n-    // 获取分叉提交的详细信息\n-    const divergedCommits: CommitInfo[] = [];\n-    for (const hash of commits) {\n-      const commit = await this.git.show(['--format=%H %an %aI %s', '-s', hash]);\n-      const [commitHash, author, date, ...messageParts] = commit.split(' ');\n-      divergedCommits.push({\n-        hash: commitHash,\n-        author,\n-        date: new Date(date),\n-        message: messageParts.join(' ')\n-      });\n-    }\n-\n-    return divergedCommits;\n-  }\n-\n-  private async analyzeFiles(\n-    source: string,\n-    target: string\n-  ): Promise<BranchDiffAnalysis['files']> {\n-    const diff = await this.git.diff([source, target, '--name-status']);\n-    const files = {\n-      added: [] as string[],\n-      modified: [] as string[],\n-      deleted: [] as string[],\n-      renamed: [] as { from: string; to: string; }[]\n-    };\n-\n-    const lines = diff.split('\\n');\n-    for (const line of lines) {\n-      if (!line.trim()) continue;\n-\n-      const [status, ...paths] = line.split('\\t');\n-      switch (status[0]) {\n-        case 'A':\n-          files.added.push(paths[0]);\n-          break;\n-        case 'M':\n-          files.modified.push(paths[0]);\n-          break;\n-        case 'D':\n-          files.deleted.push(paths[0]);\n-          break;\n-        case 'R':\n-          files.renamed.push({ from: paths[0], to: paths[1] });\n-          break;\n-      }\n-    }\n-\n-    return files;\n-  }\n-\n-  private async analyzeConflicts(\n-    source: string,\n-    target: string,\n-    files: BranchDiffAnalysis['files']\n-  ): Promise<BranchDiffAnalysis['conflicts']> {\n-    const conflictFiles = new Set<string>();\n-    const conflictAreas: ConflictArea[] = [];\n-\n-    // 检查每个修改的文件\n-    for (const file of [...files.modified, ...files.renamed.map(r => r.to)]) {\n-      try {\n-        // 尝试合并以检测冲突\n-        await this.git.raw(['merge-tree', source, target, file]);\n-      } catch (error) {\n-        const errorMessage = (error as Error).message;\n-        if (errorMessage.includes('conflict')) {\n-          conflictFiles.add(file);\n-\n-          // 分析冲突区域\n-          const areas = await this.analyzeFileConflicts(file, source, target);\n-          conflictAreas.push(...areas);\n-        }\n-      }\n-    }\n-\n-    return {\n-      files: Array.from(conflictFiles),\n-      probability: this.calculateConflictProbability(conflictAreas),\n-      conflictAreas\n-    };\n-  }\n-\n-  private async analyzeFileConflicts(\n-    file: string,\n-    source: string,\n-    target: string\n-  ): Promise<ConflictArea[]> {\n-    const areas: ConflictArea[] = [];\n-\n-    try {\n-      const diff = await this.git.diff([source, target, '--', file]);\n-      const chunks = diff.split('@@');\n-\n-      for (let i = 1; i < chunks.length; i++) {\n-        const chunk = chunks[i];\n-        const lines = chunk.split('\\n');\n-        const header = lines[0];\n-        const match = header.match(/-(\\d+),(\\d+) \\+(\\d+),(\\d+)/);\n-\n-        if (match) {\n-          const [, startA, lengthA, startB, lengthB] = match.map(Number);\n-          const severity = this.calculateConflictSeverity(lines);\n-\n-          areas.push({\n-            file,\n-            lines: Array.from(\n-              { length: Math.max(lengthA, lengthB) },\n-              (_, i) => startA + i\n-            ),\n-            severity\n-          });\n-        }\n-      }\n-    } catch {\n-      // 如果无法分析具体行，则将整个文件标记为潜在冲突\n-      areas.push({\n-        file,\n-        lines: [],\n-        severity: 'medium'\n-      });\n-    }\n-\n-    return areas;\n-  }\n-\n-  private calculateConflictSeverity(\n-    lines: string[]\n-  ): 'high' | 'medium' | 'low' {\n-    const changes = lines.filter(line => line.startsWith('+') || line.startsWith('-'));\n-    const overlap = changes.length / lines.length;\n-\n-    if (overlap > 0.5) return 'high';\n-    if (overlap > 0.2) return 'medium';\n-    return 'low';\n-  }\n-\n-  private calculateConflictProbability(areas: ConflictArea[]): number {\n-    if (areas.length === 0) return 0;\n-\n-    const weights = {\n-      high: 1,\n-      medium: 0.6,\n-      low: 0.3\n-    };\n-\n-    const totalWeight = areas.reduce(\n-      (sum, area) => sum + weights[area.severity] * area.lines.length,\n-      0\n-    );\n-\n-    return Math.min(1, totalWeight / (areas.length * 100));\n-  }\n-\n-  private async analyzeDependencyImpact(\n-    files: BranchDiffAnalysis['files']\n-  ): Promise<BranchDiffAnalysis['dependencyImpact']> {\n-    const broken = new Set<string>();\n-    const affected = new Set<string>();\n-\n-    // 分析修改和删除的文件\n-    for (const file of [...files.modified, ...files.deleted]) {\n-      try {\n-        const content = await this.git.show([`HEAD:${file}`]);\n-        const analysis = await this.dependencyAnalyzer.analyzeFile(content, file);\n-\n-        // 检查依赖是否被破坏\n-        for (const dep of analysis.dependencies) {\n-          if (files.deleted.includes(dep)) {\n-            broken.add(dep);\n-          }\n-          affected.add(dep);\n-        }\n-      } catch {\n-        // 忽略无法分析的文件\n-        continue;\n-      }\n-    }\n-\n-    // 分析重命名的文件\n-    for (const { from, to } of files.renamed) {\n-      try {\n-        const content = await this.git.show([`HEAD:${from}`]);\n-        const analysis = await this.dependencyAnalyzer.analyzeFile(content, from);\n-\n-        // 更新依赖路径\n-        for (const dep of analysis.dependencies) {\n-          if (files.deleted.includes(dep)) {\n-            broken.add(dep);\n-          }\n-          affected.add(dep);\n-        }\n-      } catch {\n-        continue;\n-      }\n-    }\n-\n-    return {\n-      broken: Array.from(broken),\n-      affected: Array.from(affected),\n-      risk: this.calculateDependencyRisk(broken.size, affected.size)\n-    };\n-  }\n-\n-  private calculateDependencyRisk(\n-    brokenCount: number,\n-    affectedCount: number\n-  ): 'high' | 'medium' | 'low' {\n-    const risk = (brokenCount * 2 + affectedCount) / 2;\n-    if (risk > 10) return 'high';\n-    if (risk > 5) return 'medium';\n-    return 'low';\n-  }\n-} \n\\ No newline at end of file"
          },
          {
              "sha": "249c98be9d5d8ace6de143dc37665c285fe0eaf6",
              "filename": "src/core/gitAction.ts",
              "status": "added",
              "additions": 27,
              "deletions": 0,
              "changes": 27,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Fcore%2FgitAction.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Fcore%2FgitAction.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2FgitAction.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -0,0 +1,27 @@\n+import { simpleGit, SimpleGit } from \"simple-git\";\n+import { GitOperationError } from \"./errors\";\n+\n+export class GitAction {\n+  private git: SimpleGit;\n+\n+  constructor() {\n+    this.git = simpleGit({ baseDir: process.cwd() });\n+  }\n+\n+  async clone(url: string, path: string): Promise<void> {\n+    try {\n+      await this.git.clone(url, path);\n+    } catch (error) {\n+      throw new GitOperationError(\"clone\", (error as Error).message);\n+    }\n+  }\n+\n+  async checkoutBranch(path: string, branch: string): Promise<void> {\n+    try {\n+      const git = simpleGit(path);\n+      await git.checkout(branch);\n+    } catch (error) {\n+      throw new GitOperationError(\"checkout\", (error as Error).message);\n+    }\n+  }\n+}"
          },
          {
              "sha": "f8eeafd046cfce10fea7bdfd723d04e069539939",
              "filename": "src/core/scanner.ts",
              "status": "modified",
              "additions": 234,
              "deletions": 153,
              "changes": 387,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Fcore%2Fscanner.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Fcore%2Fscanner.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Fcore%2Fscanner.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -1,8 +1,9 @@\n-import { glob } from 'glob';\n-import { readFile, stat } from 'fs/promises';\n-import type { FileInfo } from '../types/index.js';\n-import { FileProcessError, ValidationError } from '../core/errors.js';\n-import { dirname, join, resolve } from 'path';\n+import { glob } from \"glob\";\n+import { readFile, stat } from \"fs/promises\";\n+import type { FileInfo } from \"../types/index\";\n+import { FileProcessError, ValidationError } from \"./errors\";\n+import { dirname, join } from \"path\";\n+import { estimateTokens } from \"../utils\";\n \n interface ScanOptions {\n   maxFileSize?: number;\n@@ -13,182 +14,224 @@ interface ScanOptions {\n }\n \n const BINARY_FILE_TYPES = [\n-  '.jpg', '.jpeg', '.png', '.gif', '.bmp',\n-  '.pdf', '.doc', '.docx', '.xls', '.xlsx',\n-  '.zip', '.rar', '.7z', '.tar', '.gz',\n-  '.exe', '.dll', '.so', '.dylib'\n-];\n+  \".jpg\",\n+  \".jpeg\",\n+  \".png\",\n+  \".gif\",\n+  \".bmp\",\n+  \".pdf\",\n+  \".doc\",\n+  \".docx\",\n+  \".xls\",\n+  \".xlsx\",\n+  \".zip\",\n+  \".rar\",\n+  \".7z\",\n+  \".tar\",\n+  \".gz\",\n+  \".exe\",\n+  \".dll\",\n+  \".so\",\n+  \".dylib\",\n+  \".svg\",\n+  \".ico\",\n+  \".webp\",\n+  \".mp4\",\n+  \".mp3\",\n+  \".wav\",\n+  \".avi\",\n+  ];\n \n export class FileScanner {\n   protected processedFiles: Set<string> = new Set();\n \n-  private async findModuleFile(importPath: string, currentDir: string, basePath: string): Promise<string | null> {\n+  // 查找模块文件\n+  private async findModuleFile(\n+    importPath: string,\n+    currentDir: string,\n+    basePath: string\n+  ): Promise<string | null> {\n     // 处理外部依赖\n-    if (!importPath.startsWith('.')) {\n+    if (!importPath.startsWith(\".\")) {\n       return importPath; // 直接返回包名，让依赖图生成器处理\n     }\n \n     // 清理当前目录路径，移除临时目录部分\n     const cleanCurrentDir = currentDir\n-      .replace(new RegExp(`^${basePath}/.*?/src/`), 'src/')\n-      .replace(new RegExp(`^${basePath}/`), '');\n+      .replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\")\n+      .replace(new RegExp(`^${basePath}/`), \"\");\n \n     // 解析基础目录路径\n-    const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, '/');\n-    const pathParts = resolvedPath.split('/');\n-    const fileName = pathParts.pop() || '';\n-    const dirPath = pathParts.join('/');\n+    const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n+    const pathParts = resolvedPath.split(\"/\");\n+    const fileName = pathParts.pop() || \"\";\n+    const dirPath = pathParts.join(\"/\");\n \n     // 可能的文件扩展名，根据导入文件类型调整优先级\n     const getExtensions = (importName: string) => {\n-      if (importName.toLowerCase().endsWith('.css')) {\n-        return ['.css', '.less', '.scss', '.sass'];\n+      if (importName.toLowerCase().endsWith(\".css\")) {\n+        return [\".css\", \".less\", \".scss\", \".sass\"];\n       }\n-      return ['.tsx', '.ts', '.jsx', '.js', '.vue'];\n+      return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n     };\n \n     const extensions = getExtensions(fileName);\n \n+    const targetBasePath = join(basePath, dirPath);\n+\n     // 构建可能的基础路径\n-    const possibleBasePaths = [\n-      join(basePath, dirPath),\n-      join(basePath, 'src', dirPath),\n-      ...glob.sync(`${basePath}/*/src/${dirPath}`, { absolute: true })\n-    ];\n+    // const possibleBasePaths = [\n+    //   join(basePath, dirPath),\n+    //   join(basePath, 'src', dirPath),\n+    //   ...glob.sync(`${basePath}/*/src/${dirPath}`, { absolute: true })\n+    // ];\n \n     // 如果文件名没有扩展名\n-    if (!fileName.includes('.')) {\n-      for (const currentBasePath of possibleBasePaths) {\n-        // 1. 尝试直接添加扩展名\n-        for (const ext of extensions) {\n-          const fullPath = join(currentBasePath, fileName + ext);\n-          try {\n-            const stats = await stat(fullPath);\n-            if (stats.isFile()) {\n-              // 返回清理过的路径\n-              return join(dirPath, fileName + ext)\n-                .replace(new RegExp(`^${basePath}/.*?/src/`), 'src/')\n-                .replace(new RegExp(`^${basePath}/`), '')\n-                .replace(/\\\\/g, '/');\n-            }\n-          } catch (error) {\n-            continue;\n+    if (!fileName.includes(\".\")) {\n+      // for (const currentBasePath of possibleBasePaths) {\n+      // 1. 尝试直接添加扩展名\n+      for (const ext of extensions) {\n+        const fullPath = join(targetBasePath, fileName + ext);\n+        try {\n+          const stats = await stat(fullPath);\n+          if (stats.isFile()) {\n+            // 返回清理过的路径\n+            return join(dirPath, fileName + ext)\n+              .replace(new RegExp(`^${basePath}/`), \"\")\n+              .replace(/\\\\/g, \"/\");\n           }\n+        } catch (error) {\n+          continue;\n         }\n+      }\n \n-        // 2. 尝试查找 index 文件\n-        const dirFullPath = join(currentBasePath, fileName);\n-        try {\n-          const stats = await stat(dirFullPath);\n-          if (stats.isDirectory()) {\n-            for (const ext of extensions) {\n-              const indexPath = join(dirFullPath, 'index' + ext);\n-              try {\n-                const indexStats = await stat(indexPath);\n-                if (indexStats.isFile()) {\n-                  // 返回清理过的路径\n-                  return join(dirPath, fileName, 'index' + ext)\n-                    .replace(new RegExp(`^${basePath}/.*?/src/`), 'src/')\n-                    .replace(new RegExp(`^${basePath}/`), '')\n-                    .replace(/\\\\/g, '/');\n-                }\n-              } catch (error) {\n-                continue;\n+      // 2. 尝试查找 index 文件\n+      const dirFullPath = join(targetBasePath, fileName);\n+      try {\n+        const stats = await stat(dirFullPath);\n+        if (stats.isDirectory()) {\n+          for (const ext of extensions) {\n+            const indexPath = join(dirFullPath, \"index\" + ext);\n+            try {\n+              const indexStats = await stat(indexPath);\n+              if (indexStats.isFile()) {\n+                return join(dirPath, fileName, \"index\" + ext)\n+                  .replace(new RegExp(`^${basePath}/`), \"\")\n+                  .replace(/\\\\/g, \"/\");\n               }\n+            } catch (error) {\n+              continue;\n             }\n           }\n-        } catch (error) {\n-          continue;\n         }\n+      } catch (error) {\n+        // continue;\n       }\n-\n-      console.warn(\n-        `Warning: Could not resolve import '${importPath}' in '${cleanCurrentDir}'. ` +\n-        `Tried extensions: ${extensions.join(', ')} and index files.`\n-      );\n+      // }\n     } else {\n       // 文件名已有扩展名，尝试所有可能的基础路径\n-      for (const currentBasePath of possibleBasePaths) {\n-        const fullPath = join(currentBasePath, fileName);\n-        try {\n-          const stats = await stat(fullPath);\n-          if (stats.isFile()) {\n-            // 返回清理过的路径\n-            return join(dirPath, fileName)\n-              .replace(new RegExp(`^${basePath}/.*?/src/`), 'src/')\n-              .replace(new RegExp(`^${basePath}/`), '')\n-              .replace(/\\\\/g, '/');\n-          }\n-        } catch (error) {\n-          continue;\n+      // for (const currentBasePath of possibleBasePaths) {\n+      const fullPath = join(targetBasePath, fileName);\n+      try {\n+        const stats = await stat(fullPath);\n+        if (stats.isFile()) {\n+          return join(dirPath, fileName)\n+            .replace(new RegExp(`^${basePath}/`), \"\")\n+            .replace(/\\\\/g, \"/\");\n         }\n+      } catch (error) {\n+        // continue;\n       }\n-      console.warn(`Warning: Could not find file '${resolvedPath}' referenced in '${cleanCurrentDir}'`);\n+      // }\n     }\n \n     return null;\n   }\n \n-  protected async analyzeDependencies(content: string, filePath: string, basePath: string): Promise<string[]> {\n+  // [依赖文件按需分析]: 分析依赖文件\n+  protected async analyzeDependencies(\n+    content: string,\n+    filePath: string,\n+    basePath: string\n+  ): Promise<string[]> {\n     const dependencies: string[] = [];\n+    // 匹配导入路径。示例: import { Button } from '@/components/Button'\n     const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n \n     // 移除多行注释\n-    const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');\n-    const lines = contentWithoutComments.split('\\n')\n-      .filter(line => {\n+    const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n+    const lines = contentWithoutComments\n+      .split(\"\\n\")\n+      .filter((line) => {\n         const trimmed = line.trim();\n-        return trimmed && !trimmed.startsWith('//');\n+        return trimmed && !trimmed.startsWith(\"//\");\n       })\n-      .join('\\n');\n+      .join(\"\\n\");\n \n+    // 匹配导入路径\n     let match;\n+    // 遍历每一行，匹配导入路径\n     while ((match = importRegex.exec(lines)) !== null) {\n+      // 获取导入路径。示例: import { Button } from '@/components/Button'\n       const importPath = match[1];\n+      // 获取当前文件路径。示例: src/components/Button/index.ts\n       const currentDir = dirname(filePath);\n \n-      const resolvedPath = await this.findModuleFile(importPath, currentDir, basePath);\n+      // 查找导入路径。示例: src/components/Button/index.ts\n+      const resolvedPath = await this.findModuleFile(\n+        importPath,\n+        currentDir,\n+        basePath\n+      );\n+      // 如果导入路径存在，且不在依赖列表中，则添加到依赖列表\n       if (resolvedPath && !dependencies.includes(resolvedPath)) {\n         dependencies.push(resolvedPath);\n       }\n     }\n \n+    // 返回依赖列表。示例：['src/components/Button/index.ts', 'src/components/Input/index.ts']\n     return dependencies;\n   }\n \n-  async scanDirectory(\n-    path: string,\n-    options: ScanOptions\n-  ): Promise<FileInfo[]> {\n+  // 扫描目录\n+  async scanDirectory(path: string, options: ScanOptions): Promise<FileInfo[]> {\n     if (!path) {\n-      throw new ValidationError('Path is required');\n+      throw new ValidationError(\"Path is required\");\n     }\n \n     try {\n+      // 清除已处理文件\n       this.processedFiles.clear();\n       const allFiles: FileInfo[] = [];\n \n+      // 如果指定了目标文件路径，则扫描目标文件及其依赖文件\n       if (options.targetPaths && options.targetPaths.length > 0) {\n         for (const targetPath of options.targetPaths) {\n-          await this.processFileAndDependencies(path, targetPath, options, allFiles);\n+          // [核心步骤三]: 扫描目标文件及其依赖文件\n+          await this.processFileAndDependencies(\n+            path,\n+            targetPath,\n+            options,\n+            allFiles\n+          );\n         }\n         return allFiles;\n       }\n \n-      const files = await glob('**/*', {\n+      const files = await glob(\"**/*\", {\n         cwd: path,\n         ignore: [\n           ...(options.excludePatterns || []),\n-          '**/node_modules/**',\n-          '**/.git/**'\n+          \"**/node_modules/**\",\n+          \"**/.git/**\",\n         ],\n         nodir: true,\n         absolute: false,\n-        windowsPathsNoEscape: true\n+        windowsPathsNoEscape: true,\n       });\n \n       const results = await Promise.all(\n-        files.map(file => this.processFile(path, file, options))\n+        files.map((file) => this.processFile(path, file, options))\n       );\n \n       return results.filter((file): file is FileInfo => file !== null);\n@@ -197,6 +240,7 @@ export class FileScanner {\n     }\n   }\n \n+  // 扫描目标文件及其依赖文件\n   private async processFileAndDependencies(\n     basePath: string,\n     relativePath: string,\n@@ -207,107 +251,144 @@ export class FileScanner {\n       return;\n     }\n \n+    /**\n+     * 核心步骤四: 扫描目标文件\n+     * 示例: fileInfo: { path: 'src/components/Button/index.ts', content: '...', size: 1024 }\n+     */\n     const fileInfo = await this.processFile(basePath, relativePath, options);\n+    // 如果文件存在，则添加到已处理文件集合，并添加到结果数组\n     if (fileInfo) {\n       this.processedFiles.add(relativePath);\n       allFiles.push(fileInfo);\n \n+      // [依赖文件按需分析]: 如果 includeDependencies 为 true，则分析依赖文件\n       if (options.includeDependencies !== false) {\n-        const dependencies = await this.analyzeDependencies(fileInfo.content, relativePath, basePath);\n+        // 分析依赖文件\n+        const dependencies = await this.analyzeDependencies(\n+          fileInfo.content,\n+          relativePath,\n+          basePath\n+        );\n+        // 遍历依赖文件，递归扫描依赖文件\n         for (const dep of dependencies) {\n-          await this.processFileAndDependencies(basePath, dep, options, allFiles);\n+          await this.processFileAndDependencies(\n+            basePath,\n+            dep,\n+            options,\n+            allFiles\n+          );\n         }\n       }\n     }\n   }\n \n-  private async tryFindFile(basePath: string, filePath: string, options: ScanOptions): Promise<FileInfo | null> {\n+  // 尝试查找文件\n+  private async tryFindFile(\n+    basePath: string,\n+    filePath: string,\n+    options: ScanOptions\n+  ): Promise<FileInfo | null> {\n     try {\n       const stats = await stat(filePath);\n       if (options.maxFileSize && stats.size > options.maxFileSize) {\n         return null;\n       }\n \n-      const content = await readFile(filePath, 'utf-8');\n-      // 移除临时目录前缀，只保留项目相关路径\n+      // [核心步骤六]: 读取文件内容\n+      const content = await readFile(filePath, \"utf-8\");\n+      /**\n+       * @desc 移除临时目录前缀，只保留项目相关路径\n+       * 示例:\n+       * filePath: repo/github101-250644/src/core/gitAction.ts\n+       * basePath: 'repo/github101-492772'\n+       * relativePath: repo/github101-250644/src/core/gitAction.ts\n+       */\n+      const basePathParts = basePath.split(\"/\"); // eg: ['repo', 'github101-492772']\n+      const deleteHashRepoName = basePathParts[\n+        basePathParts.length - 1\n+      ].replace(/-[^-]*$/, \"\"); // github101\n       const relativePath = filePath\n-        .replace(new RegExp(`^${basePath}/.*?/src/`), 'src/') // 处理带临时目录的路径\n-        .replace(new RegExp(`^${basePath}/`), '')             // 处理普通路径\n-        .replace(/\\\\/g, '/');                                 // 统一使用正斜杠\n+        .replace(new RegExp(`^${basePathParts[0]}/`), \"\") // 去除临时目录前缀 repo/\n+        .replace(\n+          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n+          deleteHashRepoName\n+        ) // 去掉[-hash]\n+        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n \n       return {\n         path: relativePath,\n         content,\n-        size: stats.size\n+        // size: stats.size,\n+        token: estimateTokens(content),\n       };\n     } catch (error) {\n       return null;\n     }\n   }\n \n+  // 扫描文件\n   private async processFile(\n     basePath: string,\n     relativePath: string,\n     options: ScanOptions\n   ): Promise<FileInfo | null> {\n     try {\n-      const ext = relativePath.toLowerCase().split('.').pop();\n+      // 获取文件扩展名\n+      const ext = relativePath.toLowerCase().split(\".\").pop();\n+      // 如果文件是二进制文件，则跳过\n       if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n         return null;\n       }\n \n-      // 规范化路径\n+      /**\n+       * @desc 规范化路径\n+       * 示例:\n+       * relativePath: src/components/Button/index.ts\n+       * normalizedPath: src/components/Button/index.ts\n+       */\n       const normalizedPath = relativePath\n-        .replace(/^[\\/\\\\]+/, '')  // 移除开头的斜杠\n-        .replace(/\\\\/g, '/');     // 统一使用正斜杠\n-\n-      // 获取基础路径和文件名部分\n-      const pathParts = normalizedPath.split('/');\n-      const fileName = pathParts.pop() || '';\n-      const dirPath = pathParts.join('/');\n-\n-      // 构建完整的基础路径，包括可能的 src 目录\n-      const possibleBasePaths = [\n-        join(basePath, dirPath),\n-        join(basePath, 'src', dirPath),\n-        // 处理临时目录的情况\n-        ...glob.sync(`${basePath}/*/src/${dirPath}`, { absolute: true })\n-      ];\n+        .replace(/^[\\/\\\\]+/, \"\") // 移除开头的斜杠\n+        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n+\n+      /**\n+       * @desc 获取基础路径和文件名部分\n+       * 示例:\n+       * normalizedPath: src/components/Button/index.ts\n+       * pathParts: ['src', 'components', 'Button', 'index.ts']\n+       * fileName: 'index.ts'\n+       * dirPath: 'src/components/Button'\n+       * targetBasePath: ${basePath}/src/components/Button\n+       */\n+      const pathParts = normalizedPath.split(\"/\");\n+      const fileName = pathParts.pop() || \"\";\n+      const dirPath = pathParts.join(\"/\");\n+      const targetBasePath = join(basePath, dirPath);\n \n       // 可能的文件扩展名\n-      const extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue'];\n+      const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n \n+      // [核心步骤五]: tryFindFile 尝试查找文件\n       // 如果路径没有扩展名，尝试多种可能性\n-      if (!fileName.includes('.')) {\n-        for (const currentBasePath of possibleBasePaths) {\n-          // 1. 尝试直接添加扩展名\n-          for (const ext of extensions) {\n-            const fullPath = join(currentBasePath, fileName + ext);\n-            const result = await this.tryFindFile(basePath, fullPath, options);\n-            if (result) return result;\n-          }\n-\n-          // 2. 尝试作为目录查找 index 文件\n-          const dirFullPath = join(currentBasePath, fileName);\n-          for (const ext of extensions) {\n-            const indexPath = join(dirFullPath, 'index' + ext);\n-            const result = await this.tryFindFile(basePath, indexPath, options);\n-            if (result) return result;\n-          }\n-        }\n-\n-        console.warn(\n-          `Warning: Could not find file ${fileName} in any possible location`\n-        );\n-      } else {\n-        // 文件名已有扩展名，尝试所有可能的基础路径\n-        for (const currentBasePath of possibleBasePaths) {\n-          const fullPath = join(currentBasePath, fileName);\n+      if (!fileName.includes(\".\")) {\n+        // 1. 尝试直接添加扩展名\n+        for (const ext of extensions) {\n+          const fullPath = join(targetBasePath, fileName + ext);\n           const result = await this.tryFindFile(basePath, fullPath, options);\n           if (result) return result;\n         }\n \n-        console.warn(`Warning: Could not find file ${normalizedPath}`);\n+        // 2. 尝试作为目录查找 index 文件\n+        const dirFullPath = join(targetBasePath, fileName);\n+        for (const ext of extensions) {\n+          const indexPath = join(dirFullPath, \"index\" + ext);\n+          const result = await this.tryFindFile(basePath, indexPath, options);\n+          if (result) return result;\n+        }\n+      } else {\n+        // 文件名已有扩展名，尝试所有可能的基础路径\n+        const fullPath = join(targetBasePath, fileName);\n+        const result = await this.tryFindFile(basePath, fullPath, options);\n+        if (result) return result;\n       }\n \n       return null;\n@@ -316,4 +397,4 @@ export class FileScanner {\n       return null;\n     }\n   }\n-} \n\\ No newline at end of file\n+}"
          },
          {
              "sha": "0be8a4d259e3d27c938bc6a03836eb17c45c6280",
              "filename": "src/index.ts",
              "status": "modified",
              "additions": 110,
              "deletions": 77,
              "changes": 187,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Findex.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Findex.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Findex.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -1,33 +1,44 @@\n-import { GitHandler } from './core/git.js';\n-import { FileScanner } from './core/scanner.js';\n+import { GitAction } from \"./core/gitAction\";\n+import { FileScanner } from \"./core/scanner\";\n+import { CodeAnalyzer } from \"./core/codeAnalyzer\";\n+import path from 'path';  // 添加 path 模块\n import type {\n   AnalyzeOptions,\n   AnalysisResult,\n   GitIngestConfig,\n-  FileInfo\n-} from './types/index.js';\n-import { estimateTokens, generateTree, generateSummary } from './utils/index.js';\n-import { GitIngestError, ValidationError, GitOperationError } from './core/errors.js';\n-import { mkdir, rm } from 'fs/promises';\n-import { existsSync } from 'fs';\n+  FileInfo,\n+  CodeAnalysis\n+} from \"./types/index\";\n+import { generateTree, buildSizeTree, estimateTokens } from \"./utils/index\";\n+import {\n+  GitIngestError,\n+  ValidationError,\n+  GitOperationError,\n+} from \"./core/errors\";\n+import { mkdir, rm } from \"fs/promises\";\n+import { existsSync } from \"fs\";\n+import crypto from \"crypto\";\n+import { analyzeDependencies } from \"./utils/analyzeDependencies\";\n \n export class GitIngest {\n-  private git: GitHandler;\n+  private git: GitAction;\n   private scanner: FileScanner;\n+  private analyzer: CodeAnalyzer;\n   private config: GitIngestConfig;\n \n   constructor(config?: GitIngestConfig) {\n-    this.git = new GitHandler();\n+    this.git = new GitAction();\n     this.scanner = new FileScanner();\n+    this.analyzer = new CodeAnalyzer();\n     this.config = {\n-      tempDir: './temp',\n-      defaultMaxFileSize: 1024 * 1024, // 1MB\n+      tempDir: \"repo\", // 默认保存仓库的目录名(不会暴露到外部)\n+      keepTempFiles: false, // 默认不保留临时文件\n+      defaultMaxFileSize: 1024 * 1024, // 默认检索不超过 1MB 的文件\n       defaultPatterns: {\n-        include: ['**/*'],\n-        exclude: ['**/node_modules/**', '**/.git/**']\n+        include: [\"**/*\"],\n+        exclude: [\"**/node_modules/**\", \"**/.git/**\"],\n       },\n-      keepTempFiles: false, // 默认不保留临时文件\n-      ...config\n+      ...config,\n     };\n   }\n \n@@ -38,7 +49,10 @@ export class GitIngest {\n         await rm(dirPath, { recursive: true, force: true });\n       }\n     } catch (error) {\n-      console.warn(`Warning: Failed to cleanup temporary directory ${dirPath}: ${(error as Error).message}`);\n+      console.warn(\n+        `Warning: Failed to cleanup temporary directory ${dirPath}: ${(error as Error).message\n+        }`\n+      );\n     }\n   }\n \n@@ -65,6 +79,7 @@ export class GitIngest {\n     return url.includes(this.config.customDomainMap.targetDomain);\n   }\n \n+  // [核心步骤0]: 开端，根据 url 按需获取仓库代码\n   async analyzeFromUrl(\n     url: string,\n     options?: AnalyzeOptions\n@@ -75,18 +90,24 @@ export class GitIngest {\n     const githubUrl = this.transformCustomDomainUrl(url);\n \n     if (!githubUrl) {\n-      throw new ValidationError('URL is required');\n+      throw new ValidationError(\"URL is required\");\n     }\n \n     if (!githubUrl.match(/^https?:\\/\\//)) {\n-      throw new ValidationError('Invalid URL format');\n+      throw new ValidationError(\"Invalid URL format\");\n     }\n \n     if (!this.config.tempDir) {\n-      throw new ValidationError('Temporary directory is required');\n+      throw new ValidationError(\"Temporary directory is required\");\n     }\n \n-    const workDir = `${this.config.tempDir}/${Date.now()}`;\n+    // 从URL中提取仓库名\n+    const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n+    const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n+    // 生成唯一标识符（使用时间戳的后6位作为唯一值）\n+    const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n+    const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n+\n     let result: AnalysisResult;\n \n     try {\n@@ -103,7 +124,7 @@ export class GitIngest {\n         await this.git.checkoutBranch(workDir, options.branch);\n       }\n \n-      // 扫描文件\n+      // [核心步骤一]: 调用扫描目录\n       result = await this.analyzeFromDirectory(workDir, options);\n \n       // 如果不保留临时文件，则清理\n@@ -112,9 +133,9 @@ export class GitIngest {\n       }\n \n       // 如果是自定义域名访问，添加额外信息\n-      if (isCustomDomain) {\n-        result.summary = `通过自定义域名 ${this.config.customDomainMap?.targetDomain} 访问\\n原始仓库: ${githubUrl}\\n\\n${result.summary}`;\n-      }\n+      // if (isCustomDomain) {\n+      //   result.summary = `通过自定义域名 ${this.config.customDomainMap?.targetDomain} 访问\\n原始仓库: ${githubUrl}\\n\\n${result.summary}`;\n+      // }\n \n       return result;\n     } catch (error) {\n@@ -126,87 +147,99 @@ export class GitIngest {\n       if (error instanceof GitIngestError) {\n         throw error;\n       }\n-      throw new GitIngestError(`Failed to analyze repository: ${(error as Error).message}`);\n+      throw new GitIngestError(\n+        `Failed to analyze repository: ${(error as Error).message}`\n+      );\n     }\n   }\n \n+  // 分析扫描目录\n   async analyzeFromDirectory(\n-    path: string,\n+    dirPath: string,\n     options?: AnalyzeOptions\n   ): Promise<AnalysisResult> {\n-    if (!path) {\n-      throw new ValidationError('Path is required');\n+    if (!dirPath) {\n+      throw new ValidationError(\"Path is required\");\n     }\n \n-    if (!existsSync(path)) {\n-      throw new ValidationError(`Directory not found: ${path}`);\n+    if (!existsSync(dirPath)) {\n+      throw new ValidationError(`Directory not found: ${dirPath}`);\n     }\n \n     try {\n-      const files = await this.scanner.scanDirectory(path, {\n+      const files = await this.scanner.scanDirectory(dirPath, {\n         maxFileSize: options?.maxFileSize || this.config.defaultMaxFileSize,\n-        includePatterns: options?.includePatterns || this.config.defaultPatterns?.include,\n-        excludePatterns: options?.excludePatterns || this.config.defaultPatterns?.exclude,\n+        includePatterns:\n+          options?.includePatterns || this.config.defaultPatterns?.include,\n+        excludePatterns:\n+          options?.excludePatterns || this.config.defaultPatterns?.exclude,\n         targetPaths: options?.targetPaths,\n-        includeDependencies: true\n+        includeDependencies: true,\n       });\n \n       if (files.length === 0) {\n-        throw new ValidationError('No files found in the specified directory');\n+        throw new ValidationError(\"No files found in the specified directory\");\n+      }\n+\n+      // 重置分析器状态\n+      this.analyzer = new CodeAnalyzer();\n+\n+      // 分析代码并构建索引和知识图谱\n+      for (const file of files) {\n+        try {\n+          // 确保是 TypeScript/JavaScript 文件\n+          if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n+            // 使用 file.content 而不是重新读取文件\n+            const content = file.content;\n+            // 使用绝对路径\n+            const absolutePath = path.resolve(dirPath, file.path);\n+\n+            // console.log(`Analyzing file: ${absolutePath}`); // 添加日志\n+            this.analyzer.analyzeCode(absolutePath, content);\n+          }\n+        } catch (error) {\n+          console.warn(\n+            `Warning: Failed to analyze file ${file.path}: ${(error as Error).message}`\n+          );\n+        }\n       }\n \n-      // 计算元数据\n-      const metadata = this.calculateMetadata(files);\n+      // 获取分析结果\n+      const codeIndex = this.analyzer.getCodeIndex();\n+      const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n+\n+      console.log(`Analysis complete. Found ${codeIndex.size} code elements`); // 添加日志\n \n-      // 生成分析结果\n       return {\n-        summary: this.generateSummary(files, metadata),\n-        tree: this.generateTree(files),\n-        content: this.generateContent(files),\n-        metadata\n+        metadata: {\n+          files: files.length,\n+          tokens: files.reduce((acc, file) => acc + file.token, 0),\n+        },\n+        totalCode: files,\n+        fileTree: generateTree(files),\n+        sizeTree: buildSizeTree(files),\n+        codeAnalysis: { codeIndex, knowledgeGraph },\n+        dependencyGraph: await analyzeDependencies(dirPath + (options?.miniCommonRoot || ''))\n       };\n     } catch (error) {\n       if (error instanceof GitIngestError) {\n         throw error;\n       }\n-      throw new GitIngestError(`Failed to analyze directory: ${(error as Error).message}`);\n+      throw new GitIngestError(\n+        `Failed to analyze directory: ${(error as Error).message}`\n+      );\n     }\n   }\n-\n-  private calculateMetadata(files: FileInfo[]) {\n-    return {\n-      files: files.length,\n-      size: files.reduce((acc, file) => acc + file.size, 0),\n-      tokens: files.reduce((acc, file) => acc + this.estimateTokens(file.content), 0)\n-    };\n-  }\n-\n-  private generateSummary(files: FileInfo[], metadata: any): string {\n-    return generateSummary(files, metadata);\n-  }\n-\n-  private generateTree(files: FileInfo[]): string {\n-    return generateTree(files);\n-  }\n-\n-  private generateContent(files: FileInfo[]): string {\n-    return files.map(file => {\n-      return `File: ${file.path}\\n${'='.repeat(40)}\\n${file.content}\\n\\n`;\n-    }).join('\\n');\n-  }\n-\n-  private estimateTokens(content: string): number {\n-    return estimateTokens(content);\n-  }\n }\n \n // 导出错误类型\n-export { GitIngestError, ValidationError, GitOperationError } from './core/errors.js';\n+export {\n+  GitIngestError,\n+  ValidationError,\n+  GitOperationError,\n+} from \"./core/errors\";\n \n // 导出类型定义\n-export type {\n-  AnalyzeOptions,\n-  AnalysisResult,\n-  GitIngestConfig,\n-  FileInfo\n-}; \n\\ No newline at end of file\n+export type { AnalyzeOptions, AnalysisResult, GitIngestConfig, FileInfo, CodeAnalysis };\n+\n+export * from \"./utils/graphSearch\";\n\\ No newline at end of file"
          },
          {
              "sha": "9e67394f30f23522a93e1f7fe8d9ab6366acadd1",
              "filename": "src/types/dependency/index.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 70,
              "changes": 70,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Ftypes%2Fdependency%2Findex.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Ftypes%2Fdependency%2Findex.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Ftypes%2Fdependency%2Findex.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,70 +0,0 @@\n-import { FileInfo } from '../index.js';\n-\n-export interface CodeLocation {\n-  line: number;\n-  column: number;\n-  filePath: string;\n-}\n-\n-export interface ImportInfo {\n-  source: string;\n-  specifiers: string[];\n-  importType: 'named' | 'default' | 'namespace' | 'type';\n-  location: CodeLocation;\n-}\n-\n-export interface ExportInfo {\n-  name: string;\n-  type: 'named' | 'default';\n-  location: CodeLocation;\n-}\n-\n-export interface FunctionCallInfo {\n-  caller: {\n-    name: string;\n-    location: CodeLocation;\n-  };\n-  callee: {\n-    name: string;\n-    source?: string;  // 如果是外部导入的函数\n-    location?: CodeLocation;\n-  };\n-}\n-\n-export interface MethodInfo {\n-  name: string;\n-  visibility: 'public' | 'private' | 'protected';\n-  isStatic: boolean;\n-  location: CodeLocation;\n-}\n-\n-export interface ClassRelationInfo {\n-  className: string;\n-  extends?: string;\n-  implements?: string[];\n-  methods: MethodInfo[];\n-  location: CodeLocation;\n-}\n-\n-export type FileType =\n-  | 'typescript'\n-  | 'javascript'\n-  | 'vue'\n-  | 'jsx'\n-  | 'tsx';\n-\n-export interface DependencyAnalysis {\n-  filePath: string;\n-  fileType: FileType;\n-  imports: ImportInfo[];\n-  exports: ExportInfo[];\n-  functionCalls: FunctionCallInfo[];\n-  classRelations: ClassRelationInfo[];\n-  dependencies: string[];  // 所有依赖文件的路径\n-}\n-\n-export interface ProjectAnalysis {\n-  files: DependencyAnalysis[];\n-  dependencies: Map<string, string[]>;  // 文件依赖关系图\n-  exportMap: Map<string, ExportInfo[]>; // 导出映射\n-} \n\\ No newline at end of file"
          },
          {
              "sha": "293b293ef38def74f11a1d69281e2547ab204193",
              "filename": "src/types/git/branch.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 50,
              "changes": 50,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Ftypes%2Fgit%2Fbranch.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Ftypes%2Fgit%2Fbranch.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Ftypes%2Fgit%2Fbranch.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,50 +0,0 @@\n-import type { CommitInfo } from './index.js';\n-\n-export interface BranchDiffAnalysis {\n-  // 基本信息\n-  sourceBranch: string;\n-  targetBranch: string;\n-\n-  // 提交差异\n-  commits: {\n-    ahead: CommitInfo[];    // source 比 target 多的提交\n-    behind: CommitInfo[];   // source 比 target 少的提交\n-    diverged: CommitInfo[]; // 分叉的提交\n-  };\n-\n-  // 文件差异\n-  files: {\n-    added: string[];      // 新增的文件\n-    modified: string[];   // 修改的文件\n-    deleted: string[];    // 删除的文件\n-    renamed: {           // 重命名的文件\n-      from: string;\n-      to: string;\n-    }[];\n-  };\n-\n-  // 冲突分析\n-  conflicts: {\n-    files: string[];           // 可能冲突的文件\n-    probability: number;       // 冲突概率\n-    conflictAreas: {          // 具体冲突区域\n-      file: string;\n-      lines: number[];\n-      severity: 'high' | 'medium' | 'low';\n-    }[];\n-  };\n-\n-  // 依赖影响\n-  dependencyImpact: {\n-    broken: string[];         // 破坏的依赖关系\n-    affected: string[];       // 受影响的模块\n-    risk: 'high' | 'medium' | 'low';\n-  };\n-}\n-\n-export interface BranchAnalysisOptions {\n-  includeCommits?: boolean;     // 是否包含提交信息\n-  includeConflicts?: boolean;   // 是否分析冲突\n-  includeDependencies?: boolean; // 是否分析依赖影响\n-  maxDepth?: number;            // 分析的最大深度\n-} \n\\ No newline at end of file"
          },
          {
              "sha": "8e334689c55a54c7af0665b3ff74b7982efd222d",
              "filename": "src/types/git/index.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 49,
              "changes": 49,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Ftypes%2Fgit%2Findex.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Ftypes%2Fgit%2Findex.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Ftypes%2Fgit%2Findex.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,49 +0,0 @@\n-export interface CommitInfo {\n-  hash: string;\n-  author: string;\n-  date: Date;\n-  message: string;\n-  branch?: string;\n-}\n-\n-export interface FileChange {\n-  file: string;\n-  type: 'add' | 'modify' | 'delete';\n-  additions: number;\n-  deletions: number;\n-  patches: string[];\n-}\n-\n-export interface ImpactAnalysis {\n-  directFiles: string[];      // 直接影响的文件\n-  indirectFiles: string[];    // 间接影响的文件\n-  potentialImpact: 'high' | 'medium' | 'low';\n-}\n-\n-export interface RelatedCommit {\n-  hash: string;\n-  message: string;\n-  date: Date;\n-  relevanceType: 'same-file' | 'same-function' | 'dependency';\n-  relevanceScore: number;     // 相关性得分 0-1\n-}\n-\n-export interface ChangeAnalysis {\n-  commitInfo: CommitInfo;\n-  changes: FileChange[];\n-  impacts: ImpactAnalysis;\n-  relatedCommits: RelatedCommit[];\n-}\n-\n-export interface CommitRange {\n-  from: string;\n-  to: string;\n-  branch?: string;\n-}\n-\n-export interface GitAnalysisOptions {\n-  maxDepth?: number;          // 最大分析深度\n-  includeMerges?: boolean;    // 是否包含合并提交\n-  analyzeImpact?: boolean;    // 是否分析影响\n-  findRelated?: boolean;      // 是否查找相关提交\n-} \n\\ No newline at end of file"
          },
          {
              "sha": "44a1069c75d3e8c05795e127700830b6b2392b83",
              "filename": "src/types/index.ts",
              "status": "modified",
              "additions": 65,
              "deletions": 6,
              "changes": 71,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Ftypes%2Findex.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Ftypes%2Findex.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Ftypes%2Findex.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -1,39 +1,98 @@\n export interface AnalyzeOptions {\n+  // 最大文件大小\n   maxFileSize?: number;\n+  // 包含的文件模式\n   includePatterns?: string[];\n+  // 排除的文件模式\n   excludePatterns?: string[];\n+  // 目标文件路径\n   targetPaths?: string[];\n+  // 分支\n   branch?: string;\n+  // 提交\n   commit?: string;\n+  // 最小公共根目录\n+  miniCommonRoot?: string;\n }\n \n export interface FileInfo {\n+  // 文件路径\n   path: string;\n+  // 文件内容\n   content: string;\n-  size: number;\n+  // 文件预估消耗 token 数量\n+  token: number;\n }\n \n export interface AnalysisResult {\n-  summary: string;\n-  tree: string;\n-  content: string;\n+  // 项目概况\n   metadata: {\n     files: number;\n-    size: number;\n     tokens: number;\n   };\n+  // 文件树\n+  fileTree: string;\n+  // 总代码\n+  totalCode: {\n+    // 文件路径\n+    path: string;\n+    // 文件内容\n+    content: string;\n+    // 文件预估消耗 token 数量\n+    token: number;\n+  }[];\n+  // 文件大小树，表示文件及其子文件夹的大小结构\n+  sizeTree: {\n+    // 文件或文件夹的名称\n+    name: string;\n+    // 文件或文件夹预估消耗 token 数量\n+    token: number;\n+    // 是否为文件\n+    isFile: boolean;\n+    // 子文件或子文件夹的集合\n+    children?: {\n+      [key: string]: {\n+        // 子文件或子文件夹的名称\n+        name: string;\n+        // 子文件或子文件夹预估消耗 token 数量\n+        token: number;\n+        // 子文件或子文件夹的集合\n+        children?: any; // 递归定义，允许嵌套\n+        // 是否为文件\n+        isFile: boolean;\n+      };\n+    };\n+  };\n+  // 代码分析\n+  codeAnalysis: CodeAnalysis;\n+  // 依赖关系图\n+  dependencyGraph: any;\n }\n \n+export interface CodeAnalysis {\n+  codeIndex: Map<string, any[]>;\n+  knowledgeGraph: {\n+    nodes: any[];\n+    edges: any[];\n+  };\n+}\n export interface GitIngestConfig {\n+  // 保存克隆仓库的临时目录名\n   tempDir?: string;\n+  /* 默认检索的最大的文件 */\n   defaultMaxFileSize?: number;\n+  /* 文件模式 */\n   defaultPatterns?: {\n+    /* 包含的文件/目录 */\n     include?: string[];\n+    /* 不会去检索的文件/目录 */\n     exclude?: string[];\n   };\n+  /* 保留克隆的仓库 */\n   keepTempFiles?: boolean;\n+  /* 自定义域名 */\n   customDomainMap?: {\n     targetDomain: string;\n     originalDomain: string;\n   };\n-} \n\\ No newline at end of file\n+}"
          },
          {
              "sha": "be1530b2a7a75320a7d482bf81b2fae65b5ba385",
              "filename": "src/utils/analyzeDependencies.ts",
              "status": "added",
              "additions": 20,
              "deletions": 0,
              "changes": 20,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Futils%2FanalyzeDependencies.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Futils%2FanalyzeDependencies.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Futils%2FanalyzeDependencies.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -0,0 +1,20 @@\n+import { cruise } from \"dependency-cruiser\";\n+\n+// 根据指定目录分析依赖关系\n+export const analyzeDependencies = async (rootDir: string) => {\n+  try {\n+    const result = await cruise(\n+      [rootDir], // 要分析的目录\n+      { // 配置选项\n+        exclude: \"node_modules\", // 排除 node_modules\n+        outputType: \"json\", // 输出为 JSON 格式\n+      }\n+    );\n+\n+    const dependencies = JSON.parse(result.output as string);\n+\n+    return dependencies;\n+  } catch (error) {\n+    console.error(\"Error analyzing dependencies:\", error);\n+  }\n+}"
          },
          {
              "sha": "071b91e5d334d5934b8694e8fc97fadd9438ff63",
              "filename": "src/utils/env.ts",
              "status": "removed",
              "additions": 0,
              "deletions": 19,
              "changes": 19,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Futils%2Fenv.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/82e261f659a990442a8b5090659ac1d6b74cb89b/src%2Futils%2Fenv.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Futils%2Fenv.ts?ref=82e261f659a990442a8b5090659ac1d6b74cb89b",
              "patch": "@@ -1,19 +0,0 @@\n-import { config } from 'dotenv';\n-import { join } from 'path';\n-\n-// 加载环境变量\n-config({ path: join(process.cwd(), '.env') });\n-\n-// 导出环境变量类型\n-export interface Env {\n-  HTTP_PROXY?: string;\n-  HTTPS_PROXY?: string;\n-  NODE_ENV?: string;\n-}\n-\n-// 导出环境变量\n-export const env: Env = {\n-  HTTP_PROXY: process.env.HTTP_PROXY,\n-  HTTPS_PROXY: process.env.HTTPS_PROXY,\n-  NODE_ENV: process.env.NODE_ENV\n-}; \n\\ No newline at end of file"
          },
          {
              "sha": "d23a87a1900c9b96cf27f05fcbb01aacb50e55d2",
              "filename": "src/utils/graphSearch.ts",
              "status": "added",
              "additions": 221,
              "deletions": 0,
              "changes": 221,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Futils%2FgraphSearch.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Futils%2FgraphSearch.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Futils%2FgraphSearch.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -0,0 +1,221 @@\n+export interface KnowledgeNode {\n+  id: string;\n+  name: string;\n+  type: string;\n+  filePath: string;\n+  location: {\n+    file: string;\n+    line: number;\n+  };\n+  description?: string;\n+  properties?: Record<string, any>;\n+  implementation?: string;\n+}\n+\n+export interface KnowledgeEdge {\n+  source: string;\n+  target: string;\n+  type: string;\n+  properties?: Record<string, any>;\n+}\n+\n+export interface KnowledgeGraph {\n+  nodes: KnowledgeNode[];\n+  edges: KnowledgeEdge[];\n+}\n+\n+export interface SearchOptions {\n+  entities: string[];         // 实体名称数组\n+  relationTypes?: string[];   // 按关系类型过滤\n+  maxDistance?: number;       // 关系距离限制\n+  limit?: number;             // 结果数量限制\n+}\n+\n+export interface SearchResult {\n+  nodes: KnowledgeNode[];\n+  edges: KnowledgeEdge[];\n+  metadata: {\n+    totalNodes: number;\n+    totalEdges: number;\n+    entities: string[];\n+    relationTypes: string[];\n+    maxDistance: number;\n+  };\n+}\n+\n+interface RelatedNodesResult {\n+  nodes: KnowledgeNode[];\n+  edges: KnowledgeEdge[];\n+}\n+\n+function findRelatedNodes(\n+  graph: KnowledgeGraph,\n+  startNodes: KnowledgeNode[],\n+  maxDistance: number\n+): RelatedNodesResult {\n+  const relatedNodes = new Set<KnowledgeNode>();\n+  const relatedEdges = new Set<KnowledgeEdge>();\n+  const processedNodeIds = new Set<string>();\n+\n+  function processNode(node: KnowledgeNode, distance: number) {\n+    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n+    processedNodeIds.add(node.id);\n+    relatedNodes.add(node);\n+\n+    // 1. 查找直接相关的边\n+    const directEdges = graph.edges.filter(edge =>\n+      edge.source === node.id || edge.target === node.id\n+    );\n+\n+    directEdges.forEach(edge => {\n+      relatedEdges.add(edge);\n+\n+      // 处理边的另一端节点\n+      const otherId = edge.source === node.id ? edge.target : edge.source;\n+      const otherNode = graph.nodes.find(n => n.id === otherId);\n+\n+      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n+        processNode(otherNode, distance + 1);\n+      }\n+    });\n+\n+    // 2. 查找类和方法的关系\n+    if (node.type === 'class') {\n+      // 先找到类的所有方法\n+      const methodNodes = graph.nodes.filter(n => {\n+        if (n.type !== 'function' && n.type !== 'class_method') return false;\n+        if (n.filePath !== node.filePath) return false;\n+        if (n.name === 'constructor') return false;\n+\n+        // 检查方法是否属于这个类\n+        const classNode = graph.nodes.find(c =>\n+          c.type === 'class' &&\n+          c.filePath === n.filePath &&\n+          c.id === n.id.split('#')[0] + '#' + node.name\n+        );\n+        return classNode !== undefined;\n+      });\n+\n+      methodNodes.forEach(methodNode => {\n+        if (!processedNodeIds.has(methodNode.id)) {\n+          // 添加 defines 关系\n+          const edge: KnowledgeEdge = {\n+            source: node.id,\n+            target: methodNode.id,\n+            type: 'defines',\n+            properties: {}\n+          };\n+          relatedEdges.add(edge);\n+          processNode(methodNode, distance + 1);\n+        }\n+      });\n+    }\n+\n+    // 3. 查找继承关系\n+    if (node.type === 'class' && node.name.endsWith('Error')) {\n+      const parentNode = graph.nodes.find(n => n.name === 'Error');\n+      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n+        const edge: KnowledgeEdge = {\n+          source: node.id,\n+          target: 'Error',\n+          type: 'extends',\n+          properties: {}\n+        };\n+        relatedEdges.add(edge);\n+        processNode(parentNode, distance + 1);\n+      }\n+    }\n+  }\n+\n+  // 从每个起始节点开始处理\n+  startNodes.forEach(node => processNode(node, 0));\n+\n+  return {\n+    nodes: Array.from(relatedNodes),\n+    edges: Array.from(relatedEdges)\n+  };\n+}\n+\n+/**\n+ * 基于实体名称列表搜索关联的知识图谱\n+ * @param graph 知识图谱\n+ * @param options 搜索选项\n+ * @returns 搜索结果\n+ */\n+export function searchKnowledgeGraph(\n+  graph: KnowledgeGraph,\n+  options: SearchOptions\n+): SearchResult {\n+  const { entities, maxDistance = 2 } = options;\n+\n+  // 1. 找到起始节点\n+  const startNodes = graph.nodes.filter(node =>\n+    entities.some(entity => node.name === entity)\n+  );\n+\n+  if (!startNodes.length) {\n+    console.warn(`[Warning] No nodes found for entities:`, entities);\n+    return {\n+      nodes: [],\n+      edges: [],\n+      metadata: {\n+        totalNodes: 0,\n+        totalEdges: 0,\n+        entities,\n+        relationTypes: [],\n+        maxDistance\n+      }\n+    };\n+  }\n+\n+  // 2. 找到相关节点和边\n+  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance);\n+\n+  // 3. 添加类和方法的关系\n+  const methodNodes = nodes.filter(n => n.type === 'function' || n.type === 'class_method');\n+  const classNodes = nodes.filter(n => n.type === 'class');\n+\n+  methodNodes.forEach(method => {\n+    const className = method.id.split('#')[1];\n+    const relatedClass = classNodes.find(c => c.name === className);\n+    if (relatedClass) {\n+      edges.push({\n+        source: relatedClass.id,\n+        target: method.id,\n+        type: 'defines',\n+        properties: {}\n+      });\n+    }\n+  });\n+\n+  // 4. 添加继承关系\n+  const errorClasses = classNodes.filter(n => n.name.endsWith('Error'));\n+  errorClasses.forEach(errorClass => {\n+    edges.push({\n+      source: errorClass.id,\n+      target: 'Error',\n+      type: 'extends',\n+      properties: {}\n+    });\n+  });\n+\n+  return {\n+    nodes,\n+    edges,\n+    metadata: {\n+      totalNodes: nodes.length,\n+      totalEdges: edges.length,\n+      entities,\n+      relationTypes: Array.from(new Set(edges.map(e => e.type))),\n+      maxDistance\n+    }\n+  };\n+}\n+\n+function printGraphStats(graph: KnowledgeGraph) {\n+  console.log('Nodes:', graph.nodes.length);\n+  console.log('Edges:', graph.edges.length);\n+  console.log('Unique Relationships:',\n+    new Set(graph.edges.map(e => `${e.type}:${e.source}->${e.target}`)).size\n+  );\n+} \n\\ No newline at end of file"
          },
          {
              "sha": "c9562ef7244ad7d46c3918df62d4de644ae99b36",
              "filename": "src/utils/index.ts",
              "status": "modified",
              "additions": 75,
              "deletions": 33,
              "changes": 108,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Futils%2Findex.ts",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/src%2Futils%2Findex.ts",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/src%2Futils%2Findex.ts?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -1,14 +1,28 @@\n-import type { FileInfo } from '../types/index.js';\n+import type { FileInfo } from \"../types/index\";\n \n-export function estimateTokens(content: string): number {\n-  return content.trim().split(/\\s+/).length;\n+// 估计内容 token 数量\n+export function estimateTokens(text: string): number {\n+  // 1. 计算中文字符数量\n+  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n+\n+  // 2. 计算英文单词数量（包括数字和标点）\n+  const otherChars = text.length - chineseChars;\n+\n+  // 3. 计算总 token：\n+  // - 中文字符通常是 1:1 或 1:2 的比例，保守起见使用 2\n+  // - 其他字符按照 1:0.25 的比例\n+  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n+\n+  // 4. 添加 10% 的安全余量\n+  return Math.ceil(estimatedTokens * 1.1);\n }\n \n+// 生成目录树\n export function generateTree(files: FileInfo[]): string {\n   const tree: { [key: string]: any } = {};\n \n   for (const file of files) {\n-    const parts = file.path.split('/');\n+    const parts = file.path.split(\"/\");\n     let current = tree;\n \n     for (const part of parts.slice(0, -1)) {\n@@ -21,17 +35,17 @@ export function generateTree(files: FileInfo[]): string {\n     current[parts[parts.length - 1]] = null;\n   }\n \n-  function stringify(node: any, prefix = ''): string {\n-    let result = '';\n+  function stringify(node: any, prefix = \"\"): string {\n+    let result = \"\";\n     const entries = Object.entries(node);\n \n     for (let i = 0; i < entries.length; i++) {\n       const [key, value] = entries[i];\n       const isLast = i === entries.length - 1;\n-      const connector = isLast ? '└── ' : '├── ';\n-      const childPrefix = isLast ? '    ' : '│   ';\n+      const connector = isLast ? \"└── \" : \"├── \";\n+      const childPrefix = isLast ? \"    \" : \"│   \";\n \n-      result += prefix + connector + key + '\\n';\n+      result += prefix + connector + key + \"\\n\";\n \n       if (value !== null) {\n         result += stringify(value, prefix + childPrefix);\n@@ -44,36 +58,64 @@ export function generateTree(files: FileInfo[]): string {\n   return stringify(tree);\n }\n \n-export function generateSummary(files: FileInfo[], metadata: any): string {\n-  const fileTypes = new Map<string, number>();\n+interface TreeNode {\n+  name: string;\n+  token: number;\n+  content?: string;\n+  children: { [key: string]: TreeNode };\n+  isFile: boolean;\n+}\n \n+// 构建文件大小树\n+export function buildSizeTree(files: FileInfo[]): TreeNode {\n+  // 创建根节点\n+  const root: TreeNode = {\n+    name: \"root\",\n+    token: 0,\n+    children: {},\n+    isFile: false,\n+  };\n+\n+  // 构建树结构\n   for (const file of files) {\n-    const ext = file.path.split('.').pop() || 'unknown';\n-    fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);\n+    const parts = file.path.split(\"/\");\n+    let current = root;\n+\n+    // 遍历路径的每一部分\n+    for (let i = 0; i < parts.length; i++) {\n+      const part = parts[i];\n+      const isLastPart = i === parts.length - 1;\n+\n+      if (!current.children[part]) {\n+        current.children[part] = {\n+          name: part,\n+          token: isLastPart ? file.token : 0,\n+          ...(isLastPart && file.content ? { content: file.content } : {}),\n+          children: {},\n+          isFile: isLastPart,\n+        };\n+      }\n+\n+      current = current.children[part];\n+    }\n   }\n \n-  let summary = `项目概况:\\n`;\n-  summary += `- 总文件数: ${metadata.files}\\n`;\n-  summary += `- 总大小: ${formatSize(metadata.size)}\\n`;\n-  summary += `- 预估Token数: ${metadata.tokens}\\n\\n`;\n+  // 计算每个目录的总大小\n+  function calculateSize(node: TreeNode): number {\n+    if (node.isFile) {\n+      return node.token;\n+    }\n \n-  summary += `文件类型分布:\\n`;\n-  for (const [ext, count] of fileTypes) {\n-    summary += `- ${ext}: ${count} 个文件\\n`;\n+    let totalToken = 0;\n+    for (const child of Object.values(node.children)) {\n+      totalToken += calculateSize(child);\n+    }\n+    node.token = totalToken;\n+    return totalToken;\n   }\n \n-  return summary;\n+  calculateSize(root);\n+  return root;\n }\n \n-function formatSize(bytes: number): string {\n-  const units = ['B', 'KB', 'MB', 'GB'];\n-  let size = bytes;\n-  let unitIndex = 0;\n-\n-  while (size >= 1024 && unitIndex < units.length - 1) {\n-    size /= 1024;\n-    unitIndex++;\n-  }\n-\n-  return `${size.toFixed(2)} ${units[unitIndex]}`;\n-} \n\\ No newline at end of file\n+export * from './graphSearch';"
          },
          {
              "sha": "9eeac1567fea249a453f97c96d11d35e05cf68c7",
              "filename": "tsconfig.json",
              "status": "modified",
              "additions": 4,
              "deletions": 4,
              "changes": 8,
              "blob_url": "https://github.com/Gijela/git-analyze/blob/758077d717ff0ab82ad40ef37b7790c60b22cc70/tsconfig.json",
              "raw_url": "https://github.com/Gijela/git-analyze/raw/758077d717ff0ab82ad40ef37b7790c60b22cc70/tsconfig.json",
              "contents_url": "https://api.github.com/repos/Gijela/git-analyze/contents/tsconfig.json?ref=758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "patch": "@@ -1,8 +1,8 @@\n {\n   \"compilerOptions\": {\n-    \"target\": \"ES2020\",\n-    \"module\": \"NodeNext\",\n-    \"moduleResolution\": \"NodeNext\",\n+    \"module\": \"ESNext\",\n+    \"target\": \"ES6\",\n+    \"moduleResolution\": \"node\",\n     \"types\": [\"node\"],\n     \"esModuleInterop\": true,\n     \"strict\": true,\n@@ -14,6 +14,6 @@\n     \"noEmit\": false,\n     \"rootDir\": \".\"\n   },\n-  \"include\": [\"src/**/*\", \"examples/**/*\"],\n+  \"include\": [\"src/**/*.ts\", \"src/**/*.d.ts\"],\n   \"exclude\": [\"node_modules\", \"dist\"]\n }"
          }
      ],
      "commits": [
          {
              "sha": "eeef454a5a597305828bc8fffe73b3ceff48134b",
              "node_id": "C_kwDONjRya9oAKGVlZWY0NTRhNWE1OTczMDU4MjhiYzhmZmZlNzNiM2NlZmY0ODEzNGI",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-02T18:27:23Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-02T18:27:23Z"
                  },
                  "message": "feat(core): add support for Java, Python, and Go dependencies\n\n- Implement new language analyzers for Java, Python, and Go\n- Update dependency analyzer to use new language-specific analyzers\n- Add new file types and import patterns for these languages\n- Improve overall dependency analysis capabilities",
                  "tree": {
                      "sha": "6f97dc719ed319ce47fb804734029192ef3831b3",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/6f97dc719ed319ce47fb804734029192ef3831b3"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/eeef454a5a597305828bc8fffe73b3ceff48134b",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/eeef454a5a597305828bc8fffe73b3ceff48134b",
              "html_url": "https://github.com/Gijela/git-analyze/commit/eeef454a5a597305828bc8fffe73b3ceff48134b",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/eeef454a5a597305828bc8fffe73b3ceff48134b/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "82e261f659a990442a8b5090659ac1d6b74cb89b",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/82e261f659a990442a8b5090659ac1d6b74cb89b",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/82e261f659a990442a8b5090659ac1d6b74cb89b"
                  }
              ]
          },
          {
              "sha": "221c7bfdded9f7fcdc5b0cbcd7155128ab5bb2ce",
              "node_id": "C_kwDONjRya9oAKDIyMWM3YmZkZGVkOWY3ZmNkYzViMGNiY2Q3MTU1MTI4YWI1YmIyY2U",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-01-03T01:47:01Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-01-03T01:47:01Z"
                  },
                  "message": "feat(web): enhance dependency graph generation and import path resolution\n\n- Refactor dependency graph generation to use Maps for edges, improving performance and clarity.\n- Introduce handling for '@' alias imports, allowing for more flexible path resolution.\n- Simplify import matching logic by creating a dedicated function for different file types.\n- Improve edge labeling in the dependency graph to include import items, enhancing visualization.\n- Maintain existing functionality while optimizing code structure for better readability and maintainability.",
                  "tree": {
                      "sha": "d44ef0fe9af636e8a728cbc75dded4020a5acb45",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/d44ef0fe9af636e8a728cbc75dded4020a5acb45"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/221c7bfdded9f7fcdc5b0cbcd7155128ab5bb2ce",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/221c7bfdded9f7fcdc5b0cbcd7155128ab5bb2ce",
              "html_url": "https://github.com/Gijela/git-analyze/commit/221c7bfdded9f7fcdc5b0cbcd7155128ab5bb2ce",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/221c7bfdded9f7fcdc5b0cbcd7155128ab5bb2ce/comments",
              "author": null,
              "committer": null,
              "parents": [
                  {
                      "sha": "eeef454a5a597305828bc8fffe73b3ceff48134b",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/eeef454a5a597305828bc8fffe73b3ceff48134b",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/eeef454a5a597305828bc8fffe73b3ceff48134b"
                  }
              ]
          },
          {
              "sha": "2ab2eb6b9a440745d558ca85bd100416b3daa051",
              "node_id": "C_kwDONjRya9oAKDJhYjJlYjZiOWE0NDA3NDVkNTU4Y2E4NWJkMTAwNDE2YjNkYWEwNTE",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-04T14:56:52Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-04T14:56:52Z"
                  },
                  "message": "feat(web): add @ path alias support and dependency analysis\n\n- Add @ path alias support for GitHub analysis\n- Implement dependency analysis for local and GitHub projects\n- Update UI to include @ path alias input\n- Refactor server to handle new dependency analysis features",
                  "tree": {
                      "sha": "72cad14a9bf268664941b8122caeb3602ed3fd5d",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/72cad14a9bf268664941b8122caeb3602ed3fd5d"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/2ab2eb6b9a440745d558ca85bd100416b3daa051",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/2ab2eb6b9a440745d558ca85bd100416b3daa051",
              "html_url": "https://github.com/Gijela/git-analyze/commit/2ab2eb6b9a440745d558ca85bd100416b3daa051",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/2ab2eb6b9a440745d558ca85bd100416b3daa051/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "221c7bfdded9f7fcdc5b0cbcd7155128ab5bb2ce",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/221c7bfdded9f7fcdc5b0cbcd7155128ab5bb2ce",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/221c7bfdded9f7fcdc5b0cbcd7155128ab5bb2ce"
                  }
              ]
          },
          {
              "sha": "3ee365692ff467681ea78f56191aa4bbd552b48c",
              "node_id": "C_kwDONjRya9oAKDNlZTM2NTY5MmZmNDY3NjgxZWE3OGY1NjE5MWFhNGJiZDU1MmI0OGM",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-04T17:15:11Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-04T17:15:11Z"
                  },
                  "message": "refactor(web): improve file path handling and clean up directory structure\n\n- Simplify file path processing by removing unnecessary replacements\n- Remove temporary directory information from the file tree\n- Optimize code readability and maintainability",
                  "tree": {
                      "sha": "105defcf77326c849ece9922a3344fdcc7e978a1",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/105defcf77326c849ece9922a3344fdcc7e978a1"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/3ee365692ff467681ea78f56191aa4bbd552b48c",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/3ee365692ff467681ea78f56191aa4bbd552b48c",
              "html_url": "https://github.com/Gijela/git-analyze/commit/3ee365692ff467681ea78f56191aa4bbd552b48c",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/3ee365692ff467681ea78f56191aa4bbd552b48c/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "2ab2eb6b9a440745d558ca85bd100416b3daa051",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/2ab2eb6b9a440745d558ca85bd100416b3daa051",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/2ab2eb6b9a440745d558ca85bd100416b3daa051"
                  }
              ]
          },
          {
              "sha": "eda34b51a1691aa590eba6f6330bedde0a16ee95",
              "node_id": "C_kwDONjRya9oAKGVkYTM0YjUxYTE2OTFhYTU5MGViYTZmNjMzMGJlZGRlMGExNmVlOTU",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-04T17:48:00Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-04T17:48:00Z"
                  },
                  "message": "feat(web): enhance analysis result formatting and visualization\n\n- Add project name extraction and usage in dependency graph\n- Implement root node in dependency graph to represent the project\n- Connect all file nodes to the root node\n- Modify file path cleaning to retain project name\n- Update HTML rendering for analysis results\n- Refactor analysis result processing for better reusability",
                  "tree": {
                      "sha": "9daf8144e4cb7c572c2b85f1d9f451d6e63568c1",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/9daf8144e4cb7c572c2b85f1d9f451d6e63568c1"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/eda34b51a1691aa590eba6f6330bedde0a16ee95",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/eda34b51a1691aa590eba6f6330bedde0a16ee95",
              "html_url": "https://github.com/Gijela/git-analyze/commit/eda34b51a1691aa590eba6f6330bedde0a16ee95",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/eda34b51a1691aa590eba6f6330bedde0a16ee95/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "3ee365692ff467681ea78f56191aa4bbd552b48c",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/3ee365692ff467681ea78f56191aa4bbd552b48c",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/3ee365692ff467681ea78f56191aa4bbd552b48c"
                  }
              ]
          },
          {
              "sha": "97186090075a70b90602d76d9f3053f83d0d3474",
              "node_id": "C_kwDONjRya9oAKDk3MTg2MDkwMDc1YTcwYjkwNjAyZDc2ZDlmMzA1M2Y4M2QwZDM0NzQ",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-09T18:00:30Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-09T18:00:30Z"
                  },
                  "message": "refactor(examples): remove web interface and simplify test server\n\n- Remove web interface HTML, CSS, and JavaScript files\n- Delete examples/web directory and its contents\n- Remove scanner.ts, branch-analysis.ts, and dependency-analysis.ts from examples/test\n- Simplify test server implementation in examples/testServer",
                  "tree": {
                      "sha": "6485c0eb95bb1f1d87ccab0cef6705cb0c357937",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/6485c0eb95bb1f1d87ccab0cef6705cb0c357937"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/97186090075a70b90602d76d9f3053f83d0d3474",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/97186090075a70b90602d76d9f3053f83d0d3474",
              "html_url": "https://github.com/Gijela/git-analyze/commit/97186090075a70b90602d76d9f3053f83d0d3474",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/97186090075a70b90602d76d9f3053f83d0d3474/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "eda34b51a1691aa590eba6f6330bedde0a16ee95",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/eda34b51a1691aa590eba6f6330bedde0a16ee95",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/eda34b51a1691aa590eba6f6330bedde0a16ee95"
                  }
              ]
          },
          {
              "sha": "ba29da047b7c88e6db5af4c9474336d43467dcd9",
              "node_id": "C_kwDONjRya9oAKGJhMjlkYTA0N2I3Yzg4ZTZkYjVhZjRjOTQ3NDMzNmQ0MzQ2N2RjZDk",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-12T17:37:08Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-12T17:37:08Z"
                  },
                  "message": "refactor(testServer): simplify GitHub repository analysis endpoint\n\n- Remove dependency analysis logic from the route handler\n- Delete unused imports and code related to dependency analysis\n- Increase code readability and maintainability by reducing complexity",
                  "tree": {
                      "sha": "0abbf2bf293f75330500b88abadda3e054e8fc0f",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/0abbf2bf293f75330500b88abadda3e054e8fc0f"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/ba29da047b7c88e6db5af4c9474336d43467dcd9",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/ba29da047b7c88e6db5af4c9474336d43467dcd9",
              "html_url": "https://github.com/Gijela/git-analyze/commit/ba29da047b7c88e6db5af4c9474336d43467dcd9",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/ba29da047b7c88e6db5af4c9474336d43467dcd9/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "97186090075a70b90602d76d9f3053f83d0d3474",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/97186090075a70b90602d76d9f3053f83d0d3474",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/97186090075a70b90602d76d9f3053f83d0d3474"
                  }
              ]
          },
          {
              "sha": "b45ec53f5b2147b29917320afdcd66fb596cc19e",
              "node_id": "C_kwDONjRya9oAKGI0NWVjNTNmNWIyMTQ3YjI5OTE3MzIwYWZkY2Q2NmZiNTk2Y2MxOWU",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-12T17:47:24Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-12T17:47:24Z"
                  },
                  "message": "refactor(core): streamline GitIngest methods and enhance error handling\n\n- Replace class methods with direct function calls for summary, tree, and token estimation in GitIngest.\n- Improve error handling by adding descriptive comments for error classes in errors.ts.\n- Clean up imports in scanner.ts for better organization and clarity.",
                  "tree": {
                      "sha": "b71eebe256f393aed2e739cbc7241e760a3cb005",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/b71eebe256f393aed2e739cbc7241e760a3cb005"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/b45ec53f5b2147b29917320afdcd66fb596cc19e",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/b45ec53f5b2147b29917320afdcd66fb596cc19e",
              "html_url": "https://github.com/Gijela/git-analyze/commit/b45ec53f5b2147b29917320afdcd66fb596cc19e",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/b45ec53f5b2147b29917320afdcd66fb596cc19e/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "ba29da047b7c88e6db5af4c9474336d43467dcd9",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/ba29da047b7c88e6db5af4c9474336d43467dcd9",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/ba29da047b7c88e6db5af4c9474336d43467dcd9"
                  }
              ]
          },
          {
              "sha": "3ad98d8badfe36f705d15416399828b177f8f17c",
              "node_id": "C_kwDONjRya9oAKDNhZDk4ZDhiYWRmZTM2ZjcwNWQxNTQxNjM5OTgyOGIxNzdmOGYxN2M",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-12T18:35:41Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-12T18:35:41Z"
                  },
                  "message": "refactor(core): update temporary directory handling and improve file scanning logic\n\n- Change temporary directory from './temp' to './repo' in GitIngest and related configurations.\n- Simplify file path resolution logic in FileScanner by removing unnecessary base path checks and improving clarity.\n- Enhance comments and documentation for better understanding of file scanning and dependency analysis processes.",
                  "tree": {
                      "sha": "13e33d07b121c485ec40d1ffcd4f948e929d9ffe",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/13e33d07b121c485ec40d1ffcd4f948e929d9ffe"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/3ad98d8badfe36f705d15416399828b177f8f17c",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/3ad98d8badfe36f705d15416399828b177f8f17c",
              "html_url": "https://github.com/Gijela/git-analyze/commit/3ad98d8badfe36f705d15416399828b177f8f17c",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/3ad98d8badfe36f705d15416399828b177f8f17c/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "b45ec53f5b2147b29917320afdcd66fb596cc19e",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/b45ec53f5b2147b29917320afdcd66fb596cc19e",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/b45ec53f5b2147b29917320afdcd66fb596cc19e"
                  }
              ]
          },
          {
              "sha": "af36717d20bc1105810d5efa58cc57fd0391a4c8",
              "node_id": "C_kwDONjRya9oAKGFmMzY3MTdkMjBiYzExMDU4MTBkNWVmYTU4Y2M1N2ZkMDM5MWE0Yzg",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-14T19:18:50Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-14T19:18:50Z"
                  },
                  "message": "feat(utils): add code analysis and parsing functionality\n\n- Add Tree-sitter dependencies and related packages\n- Implement code analysis for TypeScript and Vue files\n- Extract core functionality and work flow from code\n- Parse and generate syntax trees for different code sections\n- Update package.json and pnpm-lock.yaml with new dependencies",
                  "tree": {
                      "sha": "c97cfb00891efd796d8b8f01f2f8b4f2c7012d59",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/c97cfb00891efd796d8b8f01f2f8b4f2c7012d59"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/af36717d20bc1105810d5efa58cc57fd0391a4c8",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/af36717d20bc1105810d5efa58cc57fd0391a4c8",
              "html_url": "https://github.com/Gijela/git-analyze/commit/af36717d20bc1105810d5efa58cc57fd0391a4c8",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/af36717d20bc1105810d5efa58cc57fd0391a4c8/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "3ad98d8badfe36f705d15416399828b177f8f17c",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/3ad98d8badfe36f705d15416399828b177f8f17c",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/3ad98d8badfe36f705d15416399828b177f8f17c"
                  }
              ]
          },
          {
              "sha": "695dc71b30cfbfbc1cfdcee302f5baf1f308aea0",
              "node_id": "C_kwDONjRya9oAKDY5NWRjNzFiMzBjZmJmYmMxY2ZkY2VlMzAyZjViYWYxZjMwOGFlYTA",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-15T17:53:13Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-15T17:53:13Z"
                  },
                  "message": "feat: refactor project structure and add file size tree\n\n- Update package.json and pnpm-lock.yaml for dependencies and script changes\n- Refactor src directory to use new analysis result structure\n- Add buildSizeTree function to generate file size tree\n- Update GitIngest class to use new analysis methods\n- Modify utils/index.ts to include new and commented-out functions",
                  "tree": {
                      "sha": "41957d28cf80b0a81a589249449c673e8bbe755d",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/41957d28cf80b0a81a589249449c673e8bbe755d"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/695dc71b30cfbfbc1cfdcee302f5baf1f308aea0",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/695dc71b30cfbfbc1cfdcee302f5baf1f308aea0",
              "html_url": "https://github.com/Gijela/git-analyze/commit/695dc71b30cfbfbc1cfdcee302f5baf1f308aea0",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/695dc71b30cfbfbc1cfdcee302f5baf1f308aea0/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "af36717d20bc1105810d5efa58cc57fd0391a4c8",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/af36717d20bc1105810d5efa58cc57fd0391a4c8",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/af36717d20bc1105810d5efa58cc57fd0391a4c8"
                  }
              ]
          },
          {
              "sha": "b51309ee648f0061b18c00890223ad956b505697",
              "node_id": "C_kwDONjRya9oAKGI1MTMwOWVlNjQ4ZjAwNjFiMThjMDA4OTAyMjNhZDk1NmI1MDU2OTc",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-15T17:55:49Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-15T17:55:49Z"
                  },
                  "message": "refactor: remove unused Tree-sitter related code\n\n- Remove Tree-sitter dependencies from package.json\n- Delete Tree-sitter related code from src/utils\n- Remove aa.ts, test.ts, and treeSitter.ts files\n- Update index.ts to remove FileInfo import",
                  "tree": {
                      "sha": "0d935ba46c0b4d9265520156dd76ac16df38dbbe",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/0d935ba46c0b4d9265520156dd76ac16df38dbbe"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/b51309ee648f0061b18c00890223ad956b505697",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/b51309ee648f0061b18c00890223ad956b505697",
              "html_url": "https://github.com/Gijela/git-analyze/commit/b51309ee648f0061b18c00890223ad956b505697",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/b51309ee648f0061b18c00890223ad956b505697/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "695dc71b30cfbfbc1cfdcee302f5baf1f308aea0",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/695dc71b30cfbfbc1cfdcee302f5baf1f308aea0",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/695dc71b30cfbfbc1cfdcee302f5baf1f308aea0"
                  }
              ]
          },
          {
              "sha": "96e3df001e900cd7d727d6d2dba5ac5040655161",
              "node_id": "C_kwDONjRya9oAKDk2ZTNkZjAwMWU5MDBjZDdkNzI3ZDZkMmRiYTVhYzUwNDA2NTUxNjE",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-01-16T05:44:23Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-01-16T05:44:23Z"
                  },
                  "message": "refactor: remove dependence",
                  "tree": {
                      "sha": "f57c82a63970d46b6370c09fff8a6d6907d15c70",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/f57c82a63970d46b6370c09fff8a6d6907d15c70"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/96e3df001e900cd7d727d6d2dba5ac5040655161",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/96e3df001e900cd7d727d6d2dba5ac5040655161",
              "html_url": "https://github.com/Gijela/git-analyze/commit/96e3df001e900cd7d727d6d2dba5ac5040655161",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/96e3df001e900cd7d727d6d2dba5ac5040655161/comments",
              "author": null,
              "committer": null,
              "parents": [
                  {
                      "sha": "b51309ee648f0061b18c00890223ad956b505697",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/b51309ee648f0061b18c00890223ad956b505697",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/b51309ee648f0061b18c00890223ad956b505697"
                  }
              ]
          },
          {
              "sha": "c3caae91ee1a544b0d62f7675a77d4fbfc0642cc",
              "node_id": "C_kwDONjRya9oAKGMzY2FhZTkxZWUxYTU0NGIwZDYyZjc2NzVhNzdkNGZiZmMwNjQyY2M",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-01-16T06:02:31Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-01-16T06:02:31Z"
                  },
                  "message": "feat: replace folder",
                  "tree": {
                      "sha": "a178c67c993c9bd4b7d1cc9b132786eaf54b8bab",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/a178c67c993c9bd4b7d1cc9b132786eaf54b8bab"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/c3caae91ee1a544b0d62f7675a77d4fbfc0642cc",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/c3caae91ee1a544b0d62f7675a77d4fbfc0642cc",
              "html_url": "https://github.com/Gijela/git-analyze/commit/c3caae91ee1a544b0d62f7675a77d4fbfc0642cc",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/c3caae91ee1a544b0d62f7675a77d4fbfc0642cc/comments",
              "author": null,
              "committer": null,
              "parents": [
                  {
                      "sha": "96e3df001e900cd7d727d6d2dba5ac5040655161",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/96e3df001e900cd7d727d6d2dba5ac5040655161",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/96e3df001e900cd7d727d6d2dba5ac5040655161"
                  }
              ]
          },
          {
              "sha": "cfe9a5dc9307ad68257f7d21ffc89d5d0dafe1f8",
              "node_id": "C_kwDONjRya9oAKGNmZTlhNWRjOTMwN2FkNjgyNTdmN2QyMWZmYzg5ZDVkMGRhZmUxZjg",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-01-16T06:30:59Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-01-16T06:30:59Z"
                  },
                  "message": "release: publish 1.0.0",
                  "tree": {
                      "sha": "2e236c670abc1ac9c524ef0df62bad23539edb86",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/2e236c670abc1ac9c524ef0df62bad23539edb86"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/cfe9a5dc9307ad68257f7d21ffc89d5d0dafe1f8",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/cfe9a5dc9307ad68257f7d21ffc89d5d0dafe1f8",
              "html_url": "https://github.com/Gijela/git-analyze/commit/cfe9a5dc9307ad68257f7d21ffc89d5d0dafe1f8",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/cfe9a5dc9307ad68257f7d21ffc89d5d0dafe1f8/comments",
              "author": null,
              "committer": null,
              "parents": [
                  {
                      "sha": "c3caae91ee1a544b0d62f7675a77d4fbfc0642cc",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/c3caae91ee1a544b0d62f7675a77d4fbfc0642cc",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/c3caae91ee1a544b0d62f7675a77d4fbfc0642cc"
                  }
              ]
          },
          {
              "sha": "b2d86135e67a2f406cc6ec0cc334383d624ff733",
              "node_id": "C_kwDONjRya9oAKGIyZDg2MTM1ZTY3YTJmNDA2Y2M2ZWMwY2MzMzQzODNkNjI0ZmY3MzM",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-19T03:56:43Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-19T03:56:43Z"
                  },
                  "message": "refactor(git-ingest): improve token estimation and analysis result structure\n\n- Move token estimation from metadata calculation to file scanning\n- Update AnalysisResult type to include token information for files and directories\n- Refactor estimateTokens function to provide more accurate token counts\n- Adjust sizeTree to use token counts instead of file sizes",
                  "tree": {
                      "sha": "ad258d38e7c91c8243ee39803f6b75edd33b57e6",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/ad258d38e7c91c8243ee39803f6b75edd33b57e6"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/b2d86135e67a2f406cc6ec0cc334383d624ff733",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/b2d86135e67a2f406cc6ec0cc334383d624ff733",
              "html_url": "https://github.com/Gijela/git-analyze/commit/b2d86135e67a2f406cc6ec0cc334383d624ff733",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/b2d86135e67a2f406cc6ec0cc334383d624ff733/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "cfe9a5dc9307ad68257f7d21ffc89d5d0dafe1f8",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/cfe9a5dc9307ad68257f7d21ffc89d5d0dafe1f8",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/cfe9a5dc9307ad68257f7d21ffc89d5d0dafe1f8"
                  }
              ]
          },
          {
              "sha": "20adc1b1dc80fe1975e66865f8165a3cf1f10882",
              "node_id": "C_kwDONjRya9oAKDIwYWRjMWIxZGM4MGZlMTk3NWU2Njg2NWY4MTY1YTNjZjFmMTA4ODI",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-22T16:58:22Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-01-22T16:58:22Z"
                  },
                  "message": "build: bump version to 1.0.1 and update repository URL\n\n- Increment package version from 1.0.0 to 1.0.1\n- Update repository URL to include 'git+' prefix for proper Git protocol specification",
                  "tree": {
                      "sha": "084565e0af56ba8d49f47c84d78712eef91a0413",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/084565e0af56ba8d49f47c84d78712eef91a0413"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/20adc1b1dc80fe1975e66865f8165a3cf1f10882",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/20adc1b1dc80fe1975e66865f8165a3cf1f10882",
              "html_url": "https://github.com/Gijela/git-analyze/commit/20adc1b1dc80fe1975e66865f8165a3cf1f10882",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/20adc1b1dc80fe1975e66865f8165a3cf1f10882/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "b2d86135e67a2f406cc6ec0cc334383d624ff733",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/b2d86135e67a2f406cc6ec0cc334383d624ff733",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/b2d86135e67a2f406cc6ec0cc334383d624ff733"
                  }
              ]
          },
          {
              "sha": "391a5d0f54a95cbd8840c2ef3b81902f2c8ede86",
              "node_id": "C_kwDONjRya9oAKDM5MWE1ZDBmNTRhOTVjYmQ4ODQwYzJlZjNiODE5MDJmMmM4ZWRlODY",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-02-10T06:25:55Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-02-10T06:25:55Z"
                  },
                  "message": "feat(code-analysis): implement Tree-sitter based code analyzer\n\n- Add CodeAnalyzer class with advanced code parsing capabilities\n- Integrate Tree-sitter for parsing TypeScript/JavaScript files\n- Implement code element extraction and knowledge graph generation\n- Add example script demonstrating code analysis functionality\n- Update package.json and pnpm-lock.yaml with Tree-sitter dependencies\n- Extend types to support new code analysis features",
                  "tree": {
                      "sha": "d8ae2f9e403984f19ef1254c31f1d342ec0b9582",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/d8ae2f9e403984f19ef1254c31f1d342ec0b9582"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/391a5d0f54a95cbd8840c2ef3b81902f2c8ede86",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/391a5d0f54a95cbd8840c2ef3b81902f2c8ede86",
              "html_url": "https://github.com/Gijela/git-analyze/commit/391a5d0f54a95cbd8840c2ef3b81902f2c8ede86",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/391a5d0f54a95cbd8840c2ef3b81902f2c8ede86/comments",
              "author": null,
              "committer": null,
              "parents": [
                  {
                      "sha": "20adc1b1dc80fe1975e66865f8165a3cf1f10882",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/20adc1b1dc80fe1975e66865f8165a3cf1f10882",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/20adc1b1dc80fe1975e66865f8165a3cf1f10882"
                  }
              ]
          },
          {
              "sha": "f1a2abdc8de726deb5edcad69ddbf3bb3fbeb4a0",
              "node_id": "C_kwDONjRya9oAKGYxYTJhYmRjOGRlNzI2ZGViNWVkY2FkNjlkZGJmM2JiM2ZiZWI0YTA",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-02-11T02:20:27Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-02-11T02:20:27Z"
                  },
                  "message": "feat(example): add Express.js server with code analysis API endpoint\n\n- Integrate Express.js framework into the example script\n- Create a POST /analyze endpoint that returns file tree and code analysis results\n- Modify main() function to support API response format\n- Configure server to run on port 3789\n- Simplify console logging in main() function",
                  "tree": {
                      "sha": "3a5782be15f7ab41de2bb5ae0731d70b8c7f77f3",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/3a5782be15f7ab41de2bb5ae0731d70b8c7f77f3"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/f1a2abdc8de726deb5edcad69ddbf3bb3fbeb4a0",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/f1a2abdc8de726deb5edcad69ddbf3bb3fbeb4a0",
              "html_url": "https://github.com/Gijela/git-analyze/commit/f1a2abdc8de726deb5edcad69ddbf3bb3fbeb4a0",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/f1a2abdc8de726deb5edcad69ddbf3bb3fbeb4a0/comments",
              "author": null,
              "committer": null,
              "parents": [
                  {
                      "sha": "391a5d0f54a95cbd8840c2ef3b81902f2c8ede86",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/391a5d0f54a95cbd8840c2ef3b81902f2c8ede86",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/391a5d0f54a95cbd8840c2ef3b81902f2c8ede86"
                  }
              ]
          },
          {
              "sha": "2441c865eba853d175c84c0b4b0f2cb71eb80c06",
              "node_id": "C_kwDONjRya9oAKDI0NDFjODY1ZWJhODUzZDE3NWM4NGMwYjRiMGYyY2I3MWViODBjMDY",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-17T16:40:00Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-17T16:40:00Z"
                  },
                  "message": "feat(example): add knowledge graph search functionality\n\n- Implement knowledge graph search in example project\n- Add new search API endpoint\n- Update main function to accept parameters for analysis\n- Improve code organization and structure",
                  "tree": {
                      "sha": "28c974b8c0c2a388a396b089246758892c8e7455",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/28c974b8c0c2a388a396b089246758892c8e7455"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/2441c865eba853d175c84c0b4b0f2cb71eb80c06",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/2441c865eba853d175c84c0b4b0f2cb71eb80c06",
              "html_url": "https://github.com/Gijela/git-analyze/commit/2441c865eba853d175c84c0b4b0f2cb71eb80c06",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/2441c865eba853d175c84c0b4b0f2cb71eb80c06/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "f1a2abdc8de726deb5edcad69ddbf3bb3fbeb4a0",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/f1a2abdc8de726deb5edcad69ddbf3bb3fbeb4a0",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/f1a2abdc8de726deb5edcad69ddbf3bb3fbeb4a0"
                  }
              ]
          },
          {
              "sha": "158b0b029c462d5ad0352512df0c03411968b702",
              "node_id": "C_kwDONjRya9oAKDE1OGIwYjAyOWM0NjJkNWFkMDM1MjUxMmRmMGMwMzQxMTk2OGI3MDI",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-02-18T10:52:35Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "linjianhui1@xdf.xn",
                      "date": "2025-02-18T10:52:35Z"
                  },
                  "message": "feat(core): 重构代码分析器并添加新功能\n\n- 重构了 CodeAnalyzer 类，优化了代码元素的处理逻辑\n- 添加了对类方法、构造函数和类型别名的分析\n- 改进了函数调用和类型引用的解析\n- 优化了导入声明的处理，支持路径解析\n- 增加了代码分析的验证功能\n- 改进了知识图谱的搜索算法",
                  "tree": {
                      "sha": "1e6125734760aabf8e0611ca80c15d153742d0ff",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/1e6125734760aabf8e0611ca80c15d153742d0ff"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/158b0b029c462d5ad0352512df0c03411968b702",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/158b0b029c462d5ad0352512df0c03411968b702",
              "html_url": "https://github.com/Gijela/git-analyze/commit/158b0b029c462d5ad0352512df0c03411968b702",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/158b0b029c462d5ad0352512df0c03411968b702/comments",
              "author": null,
              "committer": null,
              "parents": [
                  {
                      "sha": "2441c865eba853d175c84c0b4b0f2cb71eb80c06",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/2441c865eba853d175c84c0b4b0f2cb71eb80c06",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/2441c865eba853d175c84c0b4b0f2cb71eb80c06"
                  }
              ]
          },
          {
              "sha": "58293e455252a54156d6180c769ec6691fc8ec38",
              "node_id": "C_kwDONjRya9oAKDU4MjkzZTQ1NTI1MmE1NDE1NmQ2MTgwYzc2OWVjNjY5MWZjOGVjMzg",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-18T15:22:41Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-18T15:22:41Z"
                  },
                  "message": "feat(core): refactor code analysis and improve import handling\n\n- Refactor CodeAnalyzer class to enhance modularity and readability\n- Implement improved handling of import statements and type references\n- Add support for detecting and visualizing 'defines' relationship\n- Optimize knowledge graph generation and validation\n- Update graphSearch utility to handle imports more effectively",
                  "tree": {
                      "sha": "2080d6a17757d4e1a6acf807dd522facad088935",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/2080d6a17757d4e1a6acf807dd522facad088935"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/58293e455252a54156d6180c769ec6691fc8ec38",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/58293e455252a54156d6180c769ec6691fc8ec38",
              "html_url": "https://github.com/Gijela/git-analyze/commit/58293e455252a54156d6180c769ec6691fc8ec38",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/58293e455252a54156d6180c769ec6691fc8ec38/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "158b0b029c462d5ad0352512df0c03411968b702",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/158b0b029c462d5ad0352512df0c03411968b702",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/158b0b029c462d5ad0352512df0c03411968b702"
                  }
              ]
          },
          {
              "sha": "bae370017ab85285277470658124802bae7266bc",
              "node_id": "C_kwDONjRya9oAKGJhZTM3MDAxN2FiODUyODUyNzc0NzA2NTgxMjQ4MDJiYWU3MjY2YmM",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-18T16:22:09Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-18T16:22:09Z"
                  },
                  "message": "feat(core): improve class analysis and relation handling\n\n- Refactor class declaration analysis for better code element creation\n- Enhance method relation handling within classes\n- Implement inheritance relation validation\n- Optimize graph generation and relation checking\n- Improve search functionality by adding method relations and inheritance",
                  "tree": {
                      "sha": "3201a893dbfe4f687faa9fd11a0153a62ee47667",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/3201a893dbfe4f687faa9fd11a0153a62ee47667"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/bae370017ab85285277470658124802bae7266bc",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/bae370017ab85285277470658124802bae7266bc",
              "html_url": "https://github.com/Gijela/git-analyze/commit/bae370017ab85285277470658124802bae7266bc",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/bae370017ab85285277470658124802bae7266bc/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "58293e455252a54156d6180c769ec6691fc8ec38",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/58293e455252a54156d6180c769ec6691fc8ec38",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/58293e455252a54156d6180c769ec6691fc8ec38"
                  }
              ]
          },
          {
              "sha": "e31880761f656b8495c5ef68a8bf9d0eeaa673d9",
              "node_id": "C_kwDONjRya9oAKGUzMTg4MDc2MWY2NTZiODQ5NWM1ZWY2OGE4YmY5ZDBlZWFhNjczZDk",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-18T16:32:05Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-18T16:32:05Z"
                  },
                  "message": "feat(core): add implementation content to code elements\n\n- Add 'implementation' field to CodeElement interface\n- Populate implementation content for functions, classes, and interfaces\n- Update knowledge graph generation to include implementation information",
                  "tree": {
                      "sha": "457c447a5e4b030573983f4a4d568a050b2c8344",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/457c447a5e4b030573983f4a4d568a050b2c8344"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/e31880761f656b8495c5ef68a8bf9d0eeaa673d9",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/e31880761f656b8495c5ef68a8bf9d0eeaa673d9",
              "html_url": "https://github.com/Gijela/git-analyze/commit/e31880761f656b8495c5ef68a8bf9d0eeaa673d9",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/e31880761f656b8495c5ef68a8bf9d0eeaa673d9/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "bae370017ab85285277470658124802bae7266bc",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/bae370017ab85285277470658124802bae7266bc",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/bae370017ab85285277470658124802bae7266bc"
                  }
              ]
          },
          {
              "sha": "ac172d5ccdb37598da2e27e20db281e82c15e798",
              "node_id": "C_kwDONjRya9oAKGFjMTcyZDVjY2RiMzc1OThkYTJlMjdlMjBkYjI4MWU4MmMxNWU3OTg",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-20T15:15:47Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-20T15:15:47Z"
                  },
                  "message": "refactor(example): simplify API response and improve binary file handling\n\n- Simplified API response structure in /analyze endpoint\n- Added more file types to BINARY_FILE_TYPES list in scanner.ts\n- Updated package name in package.json to \"git-analysts\"",
                  "tree": {
                      "sha": "c92df70b9636d982469a248227b34d29d00c8984",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/c92df70b9636d982469a248227b34d29d00c8984"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/ac172d5ccdb37598da2e27e20db281e82c15e798",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/ac172d5ccdb37598da2e27e20db281e82c15e798",
              "html_url": "https://github.com/Gijela/git-analyze/commit/ac172d5ccdb37598da2e27e20db281e82c15e798",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/ac172d5ccdb37598da2e27e20db281e82c15e798/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "e31880761f656b8495c5ef68a8bf9d0eeaa673d9",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/e31880761f656b8495c5ef68a8bf9d0eeaa673d9",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/e31880761f656b8495c5ef68a8bf9d0eeaa673d9"
                  }
              ]
          },
          {
              "sha": "f8319e4c181cca9e0520c017e07d593f0ab02e3f",
              "node_id": "C_kwDONjRya9oAKGY4MzE5ZTRjMTgxY2NhOWUwNTIwYzAxN2UwN2Q1OTNmMGFiMDJlM2Y",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-20T17:12:16Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-20T17:12:16Z"
                  },
                  "message": "deploy",
                  "tree": {
                      "sha": "7d975b8012c5a51d642354a2376c35b738b33267",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/7d975b8012c5a51d642354a2376c35b738b33267"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/f8319e4c181cca9e0520c017e07d593f0ab02e3f",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/f8319e4c181cca9e0520c017e07d593f0ab02e3f",
              "html_url": "https://github.com/Gijela/git-analyze/commit/f8319e4c181cca9e0520c017e07d593f0ab02e3f",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/f8319e4c181cca9e0520c017e07d593f0ab02e3f/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "ac172d5ccdb37598da2e27e20db281e82c15e798",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/ac172d5ccdb37598da2e27e20db281e82c15e798",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/ac172d5ccdb37598da2e27e20db281e82c15e798"
                  }
              ]
          },
          {
              "sha": "a6977e829f8fa3109cc5a11c136f39b3cf588e75",
              "node_id": "C_kwDONjRya9oAKGE2OTc3ZTgyOWY4ZmEzMTA5Y2M1YTExYzEzNmYzOWIzY2Y1ODhlNzU",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-20T18:17:29Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-20T18:17:29Z"
                  },
                  "message": "feat(example): add Vercel deployment support and improve code\n\n- Add vercel.json configuration for Vercel deployment\n- Update .gitignore to exclude .vercel directory\n- Refactor example/index.ts for better code quality\n- Update package.json to include @now/node dependency\n- Modify tsconfig.json to use ES2015 module resolution",
                  "tree": {
                      "sha": "0eac333a8223e19f79273e27939a450ad836b9fe",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/0eac333a8223e19f79273e27939a450ad836b9fe"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/a6977e829f8fa3109cc5a11c136f39b3cf588e75",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/a6977e829f8fa3109cc5a11c136f39b3cf588e75",
              "html_url": "https://github.com/Gijela/git-analyze/commit/a6977e829f8fa3109cc5a11c136f39b3cf588e75",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/a6977e829f8fa3109cc5a11c136f39b3cf588e75/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "f8319e4c181cca9e0520c017e07d593f0ab02e3f",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/f8319e4c181cca9e0520c017e07d593f0ab02e3f",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/f8319e4c181cca9e0520c017e07d593f0ab02e3f"
                  }
              ]
          },
          {
              "sha": "805a3afacf63e82988ab01aaf3ad7720ef92bab5",
              "node_id": "C_kwDONjRya9oAKDgwNWEzYWZhY2Y2M2U4Mjk4OGFiMDFhYWYzYWQ3NzIwZWY5MmJhYjU",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-20T18:47:12Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-20T18:47:12Z"
                  },
                  "message": "feat(example): add CORS support\n\n- Import and use cors middleware in example server\n- Add cors package to dependencies in package.json and pnpm-lock.yaml",
                  "tree": {
                      "sha": "e753858f29b9bcdf859052bd07501b7b10eb656e",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/e753858f29b9bcdf859052bd07501b7b10eb656e"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/805a3afacf63e82988ab01aaf3ad7720ef92bab5",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/805a3afacf63e82988ab01aaf3ad7720ef92bab5",
              "html_url": "https://github.com/Gijela/git-analyze/commit/805a3afacf63e82988ab01aaf3ad7720ef92bab5",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/805a3afacf63e82988ab01aaf3ad7720ef92bab5/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "a6977e829f8fa3109cc5a11c136f39b3cf588e75",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/a6977e829f8fa3109cc5a11c136f39b3cf588e75",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/a6977e829f8fa3109cc5a11c136f39b3cf588e75"
                  }
              ]
          },
          {
              "sha": "80d83354488d5c596504ae0b16b97dc5642bdb7d",
              "node_id": "C_kwDONjRya9oAKDgwZDgzMzU0NDg4ZDVjNTk2NTA0YWUwYjE2Yjk3ZGM1NjQyYmRiN2Q",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-23T15:52:56Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-23T15:52:56Z"
                  },
                  "message": "chore: update .gitignore and add new chunk\n\n- Remove dist from .gitignore\n- Add new chunk file chunk-HYMZLFNK.js to dist\n- Comment out dist in .gitignore",
                  "tree": {
                      "sha": "0efde6aa6de88790e24f32357243d0c670906bf5",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/0efde6aa6de88790e24f32357243d0c670906bf5"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/80d83354488d5c596504ae0b16b97dc5642bdb7d",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/80d83354488d5c596504ae0b16b97dc5642bdb7d",
              "html_url": "https://github.com/Gijela/git-analyze/commit/80d83354488d5c596504ae0b16b97dc5642bdb7d",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/80d83354488d5c596504ae0b16b97dc5642bdb7d/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "805a3afacf63e82988ab01aaf3ad7720ef92bab5",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/805a3afacf63e82988ab01aaf3ad7720ef92bab5",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/805a3afacf63e82988ab01aaf3ad7720ef92bab5"
                  }
              ]
          },
          {
              "sha": "6b42e8ce2256168807e6f5b4e91b0d74f9295118",
              "node_id": "C_kwDONjRya9oAKDZiNDJlOGNlMjI1NjE2ODgwN2U2ZjViNGU5MWIwZDc0ZjkyOTUxMTg",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-23T16:00:08Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-02-23T16:00:08Z"
                  },
                  "message": "build(dist): update package version and distribution files\n\n- Add distribution file to dist/index.js\n- Update package version from 1.0.6 to 1.0.8\n- Update import path in example/index.ts\n- Update dependencies and lock file for new version",
                  "tree": {
                      "sha": "bbe75b9db2084009e7f8796796c3d3c23cee95e3",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/bbe75b9db2084009e7f8796796c3d3c23cee95e3"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/6b42e8ce2256168807e6f5b4e91b0d74f9295118",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/6b42e8ce2256168807e6f5b4e91b0d74f9295118",
              "html_url": "https://github.com/Gijela/git-analyze/commit/6b42e8ce2256168807e6f5b4e91b0d74f9295118",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/6b42e8ce2256168807e6f5b4e91b0d74f9295118/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "80d83354488d5c596504ae0b16b97dc5642bdb7d",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/80d83354488d5c596504ae0b16b97dc5642bdb7d",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/80d83354488d5c596504ae0b16b97dc5642bdb7d"
                  }
              ]
          },
          {
              "sha": "195e3551e5e82b0ee15219371d120936427d5429",
              "node_id": "C_kwDONjRya9oAKDE5NWUzNTUxZTVlODJiMGVlMTUyMTkzNzFkMTIwOTM2NDI3ZDU0Mjk",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-03-02T08:24:31Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-03-02T08:24:31Z"
                  },
                  "message": "release: v1.0.0",
                  "tree": {
                      "sha": "b096168c92642671a757f2faabb68ba0d05fc238",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/b096168c92642671a757f2faabb68ba0d05fc238"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/195e3551e5e82b0ee15219371d120936427d5429",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/195e3551e5e82b0ee15219371d120936427d5429",
              "html_url": "https://github.com/Gijela/git-analyze/commit/195e3551e5e82b0ee15219371d120936427d5429",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/195e3551e5e82b0ee15219371d120936427d5429/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "6b42e8ce2256168807e6f5b4e91b0d74f9295118",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/6b42e8ce2256168807e6f5b4e91b0d74f9295118",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/6b42e8ce2256168807e6f5b4e91b0d74f9295118"
                  }
              ]
          },
          {
              "sha": "98d6bea573bcb097264c08154b9a57e2c5e58dc3",
              "node_id": "C_kwDONjRya9oAKDk4ZDZiZWE1NzNiY2IwOTcyNjRjMDgxNTRiOWE1N2UyYzVlNThkYzM",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-03-02T08:35:01Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-03-02T08:35:01Z"
                  },
                  "message": "docs(README): update documentation and add Chinese translation\n\n- Update README.md with detailed feature descriptions, usage examples, and configuration options\n- Add Chinese translation in README-zh.md\n- Include information about token estimation algorithm and technical stack\n- Update package.json version to 1.0.1",
                  "tree": {
                      "sha": "027398b32a87c82bcb1b84b37d42c81d7821182e",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/027398b32a87c82bcb1b84b37d42c81d7821182e"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/98d6bea573bcb097264c08154b9a57e2c5e58dc3",
                  "comment_count": 0,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/98d6bea573bcb097264c08154b9a57e2c5e58dc3",
              "html_url": "https://github.com/Gijela/git-analyze/commit/98d6bea573bcb097264c08154b9a57e2c5e58dc3",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/98d6bea573bcb097264c08154b9a57e2c5e58dc3/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "195e3551e5e82b0ee15219371d120936427d5429",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/195e3551e5e82b0ee15219371d120936427d5429",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/195e3551e5e82b0ee15219371d120936427d5429"
                  }
              ]
          },
          {
              "sha": "758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "node_id": "C_kwDONjRya9oAKDc1ODA3N2Q3MTdmZjBhYjgyYWQ0MGVmMzdiNzc5MGM2MGIyMmNjNzA",
              "commit": {
                  "author": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-03-04T16:48:37Z"
                  },
                  "committer": {
                      "name": "Gijela",
                      "email": "961323961@qq.com",
                      "date": "2025-03-04T16:48:37Z"
                  },
                  "message": "feat(analyze): add dependency graph and optimize code analysis\n\n- Add dependency graph to analysis result\n- Remove unnecessary console logs\n- Improve code readability and performance\n- Update type definitions",
                  "tree": {
                      "sha": "073b4f60c38e45572043705ae5870070dced4aa6",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/git/trees/073b4f60c38e45572043705ae5870070dced4aa6"
                  },
                  "url": "https://api.github.com/repos/Gijela/git-analyze/git/commits/758077d717ff0ab82ad40ef37b7790c60b22cc70",
                  "comment_count": 2,
                  "verification": {
                      "verified": false,
                      "reason": "unsigned",
                      "signature": null,
                      "payload": null,
                      "verified_at": null
                  }
              },
              "url": "https://api.github.com/repos/Gijela/git-analyze/commits/758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "html_url": "https://github.com/Gijela/git-analyze/commit/758077d717ff0ab82ad40ef37b7790c60b22cc70",
              "comments_url": "https://api.github.com/repos/Gijela/git-analyze/commits/758077d717ff0ab82ad40ef37b7790c60b22cc70/comments",
              "author": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "committer": {
                  "login": "Gijela",
                  "id": 82071209,
                  "node_id": "MDQ6VXNlcjgyMDcxMjA5",
                  "avatar_url": "https://avatars.githubusercontent.com/u/82071209?v=4",
                  "gravatar_id": "",
                  "url": "https://api.github.com/users/Gijela",
                  "html_url": "https://github.com/Gijela",
                  "followers_url": "https://api.github.com/users/Gijela/followers",
                  "following_url": "https://api.github.com/users/Gijela/following{/other_user}",
                  "gists_url": "https://api.github.com/users/Gijela/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/Gijela/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/Gijela/subscriptions",
                  "organizations_url": "https://api.github.com/users/Gijela/orgs",
                  "repos_url": "https://api.github.com/users/Gijela/repos",
                  "events_url": "https://api.github.com/users/Gijela/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/Gijela/received_events",
                  "type": "User",
                  "user_view_type": "public",
                  "site_admin": false
              },
              "parents": [
                  {
                      "sha": "98d6bea573bcb097264c08154b9a57e2c5e58dc3",
                      "url": "https://api.github.com/repos/Gijela/git-analyze/commits/98d6bea573bcb097264c08154b9a57e2c5e58dc3",
                      "html_url": "https://github.com/Gijela/git-analyze/commit/98d6bea573bcb097264c08154b9a57e2c5e58dc3"
                  }
              ]
          }
      ]
  }
}
