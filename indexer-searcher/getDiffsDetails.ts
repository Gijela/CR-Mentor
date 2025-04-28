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
            }
        ]
    }
}

// ==========================================================================
// 小型 PR 模拟数据 (Small PR Mock Data)
// 目标：总 Token 远低于软阈值，预期 status: 'full'
// ==========================================================================
export const smallPrDetails = {
    success: true,
    data: {
        files: [
            {
                "sha": "a1b2c3d4e5f6",
                "filename": "src/utils/helpers.ts",
                "status": "modified",
                "additions": 15,
                "deletions": 5,
                "changes": 20,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                "patch": "@@ -10,7 +10,15 @@\n // existing code...\n+\n+export function newUtilityFunction(input: string): string {\n+  // Simple implementation for demonstration\n+  if (!input) return '';\n+  const processed = input.trim().toLowerCase();\n+  console.log('Processing:', processed);\n+  return `processed: ${processed}`;\n+}\n+\n // more existing code..." // ~200 chars -> ~50 tokens
            },
            {
                "sha": "f6e5d4c3b2a1",
                "filename": "src/components/Button.tsx",
                "status": "added",
                "additions": 35,
                "deletions": 0,
                "changes": 35,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                "patch": "@@ -0,0 +1,35 @@\n+import React from 'react';\n+\n+interface ButtonProps {\n+  label: string;\n+  onClick: () => void;\n+  variant?: 'primary' | 'secondary';\n+}\n+\n+export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {\n+  const baseStyle = 'px-4 py-2 rounded focus:outline-none';\n+  const variantStyle = variant === 'primary'\n+    ? 'bg-blue-500 text-white hover:bg-blue-600'\n+    : 'bg-gray-200 text-gray-800 hover:bg-gray-300';\n+\n+  return (\n+    <button\n+      className={`${baseStyle} ${variantStyle}`}\n+      onClick={onClick}\n+    >\n+      {label}\n+    </button>\n+  );\n+};\n+" // ~600 chars -> ~150 tokens
            },
            {
                "sha": "deadbeef1234",
                "filename": "docs/README_old.md",
                "status": "removed",
                "additions": 0,
                "deletions": 50,
                "changes": 50,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                "patch": null // Deleted file, no patch content needed here for simulation
            }
        ],
        "commits": [ {
            "sha": "eeef454a5a597305828bc8fffe73b3ceff48134b", // Using original commit as placeholder
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
                "message": "feat(small-pr): example small changes",
                "tree": {
                    "sha": "6f97dc719ed319ce47fb804734029192ef3831b3",
                    "url": "..."
                },
                "url": "...",
                "comment_count": 0,
                "verification": {
                    "verified": false,
                    "reason": "unsigned",
                    "signature": null,
                    "payload": null,
                    "verified_at": null
                }
            },
             "url": "...",
             "html_url": "...",
             "comments_url": "...",
             "author": { /* Placeholder */ },
             "committer": { /* Placeholder */ },
             "parents": [ { "sha": "...", "url": "...", "html_url": "..." } ]
          }
        ]
    }
};

// ==========================================================================
// 中型 PR 模拟数据 (Medium PR Mock Data)
// 目标：总 Token 略高于软阈值，预期 status: 'pruned_single' (largePrHandling=false)
// ==========================================================================
export const mediumPrDetails = {
    success: true,
    data: {
        files: [
            {
                "sha": "b1c2d3e4f5a6",
                "filename": "src/core/processor.ts",
                "status": "modified",
                "additions": 250,
                "deletions": 100,
                "changes": 350,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                // Target: ~1250 tokens (~5000 chars) - Increased length further
                "patch": `@@ -50,10 +50,250 @@\n // ... existing code ...\n+${'// Added line for medium PR simulation v2 to increase tokens significantly\n'.repeat(130)}\n // ... more existing code ...`
            },
            {
                "sha": "a6f5e4d3c2b1",
                "filename": "src/services/apiClient.ts",
                "status": "modified",
                "additions": 300,
                "deletions": 50,
                "changes": 350,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                // Target: ~1250 tokens (~5000 chars) - Increased length further
                "patch": `@@ -100,15 +100,260 @@\n // ... existing code ...\n+${'console.log("Medium PR simulation log entry - much more content v2 - to pass threshold");\n'.repeat(105)}\n // ... more existing code ...`
            },
             {
                "sha": "c3b2a1f6e5d4",
                "filename": "test/integration/main.test.ts",
                "status": "added",
                "additions": 200,
                "deletions": 0,
                "changes": 200,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                 // Target: ~1100 tokens (~4400 chars) - Increased length further
                 "patch": `@@ -0,0 +1,240 @@\n+${'it("should pass this medium simulation test v2 with significantly more generated content to ensure token count", () => { expect(true).toBe(true); });\n'.repeat(60)}`
            },
            {
                "sha": "cafebabe1234",
                "filename": "config/old_config.yaml",
                "status": "removed",
                "additions": 0,
                "deletions": 80,
                "changes": 80,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                "patch": null
            }
        ],
        "commits": [ {
             "sha": "eeef454a5a597305828bc8fffe73b3ceff48134b", // Using original commit as placeholder
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
                "message": "feat(medium-pr): example medium changes",
                "tree": {
                    "sha": "6f97dc719ed319ce47fb804734029192ef3831b3",
                    "url": "..."
                },
                "url": "...",
                "comment_count": 0,
                "verification": {
                    "verified": false,
                    "reason": "unsigned",
                    "signature": null,
                    "payload": null,
                    "verified_at": null
                }
            },
             "url": "...",
             "html_url": "...",
             "comments_url": "...",
             "author": { /* Placeholder */ },
             "committer": { /* Placeholder */ },
             "parents": [ { "sha": "...", "url": "...", "html_url": "..." } ]
           }
         ]
    }
};

// ==========================================================================
// 大型 PR 模拟数据 (Large PR Mock Data)
// 目标：总 Token 显著超过硬阈值，强制分块，预期 status: 'pruned_multiple' (largePrHandling=true)
// ==========================================================================
export const largePrDetails = {
    success: true,
    data: {
        files: [
            {
                "sha": "d1e2f3a4b5c6",
                "filename": "src/modules/moduleA/feature1.ts",
                "status": "modified",
                "additions": 500,
                "deletions": 50,
                "changes": 550,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                // Simulate a very large patch with ~6000 chars -> ~1500 tokens
                "patch": `@@ -10,5 +10,500 @@\n // ... existing code ...\n+${'#'.repeat(5900)}\n // ... end ...`
            },
            {
                "sha": "c6b5a4f3e2d1",
                "filename": "src/modules/moduleB/logic.py", // Different language example
                "status": "modified",
                "additions": 600,
                "deletions": 100,
                "changes": 700,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                // Simulate a very large patch with ~6000 chars -> ~1500 tokens
                 "patch": `@@ -20,10 +20,600 @@\n # ... existing python code ...\n+${'# new python logic\n'.repeat(300)}`
            },
             {
                "sha": "e2d1c6b5a4f3",
                "filename": "src/modules/moduleC/component.vue", // Different language example
                "status": "added",
                "additions": 700,
                "deletions": 0,
                "changes": 700,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                 // Simulate a very large patch with ~6000 chars -> ~1500 tokens
                 "patch": `@@ -0,0 +1,700 @@\n<template>\n<div>\n${'  <!-- New Vue Component -->\n'.repeat(200)}\n</div>\n</template>`
            },
             {
                "sha": "f3e2d1c6b5a4",
                "filename": "src/data/largeDataset.json",
                "status": "added",
                "additions": 800,
                "deletions": 0,
                "changes": 800,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                // Simulate a very large patch with ~6000 chars -> ~1500 tokens
                "patch": `@@ -0,0 +1,800 @@\n{\n"data": [\n${'{"id": "...", "value": "..."},\n'.repeat(398)} {"id": "...", "value": "..."}\n]\n}`
            },
            {
                "sha": "badcoffee123",
                "filename": "temp/temp_output.log",
                "status": "removed",
                "additions": 0,
                "deletions": 1000,
                "changes": 1000,
                "blob_url": "...",
                "raw_url": "...",
                "contents_url": "...",
                "patch": null
            }
        ],
        "commits": [ {
             "sha": "eeef454a5a597305828bc8fffe73b3ceff48134b", // Using original commit as placeholder
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
                "message": "feat(large-pr): example large changes",
                "tree": {
                    "sha": "6f97dc719ed319ce47fb804734029192ef3831b3",
                    "url": "..."
                },
                "url": "...",
                "comment_count": 0,
                "verification": {
                    "verified": false,
                    "reason": "unsigned",
                    "signature": null,
                    "payload": null,
                    "verified_at": null
                }
            },
             "url": "...",
             "html_url": "...",
             "comments_url": "...",
             "author": { /* Placeholder */ },
             "committer": { /* Placeholder */ },
             "parents": [ { "sha": "...", "url": "...", "html_url": "..." } ]
           }
         ]
    }
};
