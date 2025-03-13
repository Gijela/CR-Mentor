export const mockAnalyzeRepo = {
  "success": true,
  "data": {
      "metadata": {
          "files": 11,
          "tokens": 28593
      },
      "totalCode": [
          {
              "path": "git-analyze-bZ/dist/index.d.ts",
              "content": "interface AnalyzeOptions {\n    maxFileSize?: number;\n    includePatterns?: string[];\n    excludePatterns?: string[];\n    targetPaths?: string[];\n    branch?: string;\n    commit?: string;\n    miniCommonRoot?: string;\n}\ninterface FileInfo {\n    path: string;\n    content: string;\n    token: number;\n}\ninterface AnalysisResult {\n    metadata: {\n        files: number;\n        tokens: number;\n    };\n    fileTree: string;\n    totalCode: {\n        path: string;\n        content: string;\n        token: number;\n    }[];\n    sizeTree: {\n        name: string;\n        token: number;\n        isFile: boolean;\n        children?: {\n            [key: string]: {\n                name: string;\n                token: number;\n                children?: any;\n                isFile: boolean;\n            };\n        };\n    };\n    codeAnalysis: CodeAnalysis;\n    dependencyGraph: any;\n}\ninterface CodeAnalysis {\n    codeIndex: Map<string, any[]>;\n    knowledgeGraph: {\n        nodes: any[];\n        edges: any[];\n    };\n}\ninterface GitIngestConfig {\n    tempDir?: string;\n    defaultMaxFileSize?: number;\n    defaultPatterns?: {\n        include?: string[];\n        exclude?: string[];\n    };\n    keepTempFiles?: boolean;\n    customDomainMap?: {\n        targetDomain: string;\n        originalDomain: string;\n    };\n}\n\ndeclare class GitIngestError extends Error {\n    constructor(message: string);\n}\ndeclare class GitOperationError extends GitIngestError {\n    constructor(operation: string, details: string);\n}\ndeclare class ValidationError extends GitIngestError {\n    constructor(message: string);\n}\n\ninterface KnowledgeNode {\n    id: string;\n    name: string;\n    type: string;\n    filePath: string;\n    location: {\n        file: string;\n        line: number;\n    };\n    description?: string;\n    properties?: Record<string, any>;\n    implementation?: string;\n}\ninterface KnowledgeEdge {\n    source: string;\n    target: string;\n    type: string;\n    properties?: Record<string, any>;\n}\ninterface KnowledgeGraph {\n    nodes: KnowledgeNode[];\n    edges: KnowledgeEdge[];\n}\ninterface SearchOptions {\n    entities: string[];\n    relationTypes?: string[];\n    maxDistance?: number;\n    limit?: number;\n}\ninterface SearchResult {\n    nodes: KnowledgeNode[];\n    edges: KnowledgeEdge[];\n    metadata: {\n        totalNodes: number;\n        totalEdges: number;\n        entities: string[];\n        relationTypes: string[];\n        maxDistance: number;\n    };\n}\n/**\n * 基于实体名称列表搜索关联的知识图谱\n * @param graph 知识图谱\n * @param options 搜索选项\n * @returns 搜索结果\n */\ndeclare function searchKnowledgeGraph(graph: KnowledgeGraph, options: SearchOptions): SearchResult;\n\ndeclare class GitIngest {\n    private git;\n    private scanner;\n    private analyzer;\n    private config;\n    constructor(config?: GitIngestConfig);\n    private cleanupTempDir;\n    private transformCustomDomainUrl;\n    private isCustomDomainUrl;\n    analyzeFromUrl(url: string, options?: AnalyzeOptions): Promise<AnalysisResult>;\n    analyzeFromDirectory(dirPath: string, options?: AnalyzeOptions): Promise<AnalysisResult>;\n}\n\nexport { type AnalysisResult, type AnalyzeOptions, type CodeAnalysis, type FileInfo, GitIngest, type GitIngestConfig, GitIngestError, GitOperationError, type KnowledgeEdge, type KnowledgeGraph, type KnowledgeNode, type SearchOptions, type SearchResult, ValidationError, searchKnowledgeGraph };\n",
              "token": 977
          },
          {
              "path": "git-analyze-bZ/dist/index.js",
              "content": "var __defProp = Object.defineProperty;\nvar __defProps = Object.defineProperties;\nvar __getOwnPropDescs = Object.getOwnPropertyDescriptors;\nvar __getOwnPropSymbols = Object.getOwnPropertySymbols;\nvar __hasOwnProp = Object.prototype.hasOwnProperty;\nvar __propIsEnum = Object.prototype.propertyIsEnumerable;\nvar __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;\nvar __spreadValues = (a, b) => {\n  for (var prop in b || (b = {}))\n    if (__hasOwnProp.call(b, prop))\n      __defNormalProp(a, prop, b[prop]);\n  if (__getOwnPropSymbols)\n    for (var prop of __getOwnPropSymbols(b)) {\n      if (__propIsEnum.call(b, prop))\n        __defNormalProp(a, prop, b[prop]);\n    }\n  return a;\n};\nvar __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));\nvar __async = (__this, __arguments, generator) => {\n  return new Promise((resolve, reject) => {\n    var fulfilled = (value) => {\n      try {\n        step(generator.next(value));\n      } catch (e) {\n        reject(e);\n      }\n    };\n    var rejected = (value) => {\n      try {\n        step(generator.throw(value));\n      } catch (e) {\n        reject(e);\n      }\n    };\n    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);\n    step((generator = generator.apply(__this, __arguments)).next());\n  });\n};\n\n// src/core/gitAction.ts\nimport { simpleGit } from \"simple-git\";\n\n// src/core/errors.ts\nvar GitIngestError = class extends Error {\n  constructor(message) {\n    super(message);\n    this.name = \"GitIngestError\";\n  }\n};\nvar GitOperationError = class extends GitIngestError {\n  constructor(operation, details) {\n    super(`Git operation '${operation}' failed: ${details}`);\n    this.name = \"GitOperationError\";\n  }\n};\nvar FileProcessError = class extends GitIngestError {\n  constructor(path3, reason) {\n    super(`Failed to process file '${path3}': ${reason}`);\n    this.name = \"FileProcessError\";\n  }\n};\nvar ValidationError = class extends GitIngestError {\n  constructor(message) {\n    super(`Validation failed: ${message}`);\n    this.name = \"ValidationError\";\n  }\n};\n\n// src/core/gitAction.ts\nvar GitAction = class {\n  constructor() {\n    this.git = simpleGit({ baseDir: process.cwd() });\n  }\n  clone(url, path3) {\n    return __async(this, null, function* () {\n      try {\n        yield this.git.clone(url, path3);\n      } catch (error) {\n        throw new GitOperationError(\"clone\", error.message);\n      }\n    });\n  }\n  checkoutBranch(path3, branch) {\n    return __async(this, null, function* () {\n      try {\n        const git = simpleGit(path3);\n        yield git.checkout(branch);\n      } catch (error) {\n        throw new GitOperationError(\"checkout\", error.message);\n      }\n    });\n  }\n};\n\n// src/core/scanner.ts\nimport { glob } from \"glob\";\nimport { readFile, stat } from \"fs/promises\";\nimport { dirname, join } from \"path\";\n\n// src/utils/graphSearch.ts\nfunction findRelatedNodes(graph, startNodes, maxDistance) {\n  const relatedNodes = /* @__PURE__ */ new Set();\n  const relatedEdges = /* @__PURE__ */ new Set();\n  const processedNodeIds = /* @__PURE__ */ new Set();\n  function processNode(node, distance) {\n    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n    processedNodeIds.add(node.id);\n    relatedNodes.add(node);\n    const directEdges = graph.edges.filter(\n      (edge) => edge.source === node.id || edge.target === node.id\n    );\n    directEdges.forEach((edge) => {\n      relatedEdges.add(edge);\n      const otherId = edge.source === node.id ? edge.target : edge.source;\n      const otherNode = graph.nodes.find((n) => n.id === otherId);\n      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n        processNode(otherNode, distance + 1);\n      }\n    });\n    if (node.type === \"class\") {\n      const methodNodes = graph.nodes.filter((n) => {\n        if (n.type !== \"function\" && n.type !== \"class_method\") return false;\n        if (n.filePath !== node.filePath) return false;\n        if (n.name === \"constructor\") return false;\n        const classNode = graph.nodes.find(\n          (c) => c.type === \"class\" && c.filePath === n.filePath && c.id === n.id.split(\"#\")[0] + \"#\" + node.name\n        );\n        return classNode !== void 0;\n      });\n      methodNodes.forEach((methodNode) => {\n        if (!processedNodeIds.has(methodNode.id)) {\n          const edge = {\n            source: node.id,\n            target: methodNode.id,\n            type: \"defines\",\n            properties: {}\n          };\n          relatedEdges.add(edge);\n          processNode(methodNode, distance + 1);\n        }\n      });\n    }\n    if (node.type === \"class\" && node.name.endsWith(\"Error\")) {\n      const parentNode = graph.nodes.find((n) => n.name === \"Error\");\n      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n        const edge = {\n          source: node.id,\n          target: \"Error\",\n          type: \"extends\",\n          properties: {}\n        };\n        relatedEdges.add(edge);\n        processNode(parentNode, distance + 1);\n      }\n    }\n  }\n  startNodes.forEach((node) => processNode(node, 0));\n  return {\n    nodes: Array.from(relatedNodes),\n    edges: Array.from(relatedEdges)\n  };\n}\nfunction searchKnowledgeGraph(graph, options) {\n  const { entities, maxDistance = 2 } = options;\n  const startNodes = graph.nodes.filter(\n    (node) => entities.some((entity) => node.name === entity)\n  );\n  if (!startNodes.length) {\n    console.warn(`[Warning] No nodes found for entities:`, entities);\n    return {\n      nodes: [],\n      edges: [],\n      metadata: {\n        totalNodes: 0,\n        totalEdges: 0,\n        entities,\n        relationTypes: [],\n        maxDistance\n      }\n    };\n  }\n  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance);\n  const methodNodes = nodes.filter((n) => n.type === \"function\" || n.type === \"class_method\");\n  const classNodes = nodes.filter((n) => n.type === \"class\");\n  methodNodes.forEach((method) => {\n    const className = method.id.split(\"#\")[1];\n    const relatedClass = classNodes.find((c) => c.name === className);\n    if (relatedClass) {\n      edges.push({\n        source: relatedClass.id,\n        target: method.id,\n        type: \"defines\",\n        properties: {}\n      });\n    }\n  });\n  const errorClasses = classNodes.filter((n) => n.name.endsWith(\"Error\"));\n  errorClasses.forEach((errorClass) => {\n    edges.push({\n      source: errorClass.id,\n      target: \"Error\",\n      type: \"extends\",\n      properties: {}\n    });\n  });\n  return {\n    nodes,\n    edges,\n    metadata: {\n      totalNodes: nodes.length,\n      totalEdges: edges.length,\n      entities,\n      relationTypes: Array.from(new Set(edges.map((e) => e.type))),\n      maxDistance\n    }\n  };\n}\n\n// src/utils/index.ts\nfunction estimateTokens(text) {\n  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n  const otherChars = text.length - chineseChars;\n  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n  return Math.ceil(estimatedTokens * 1.1);\n}\nfunction generateTree(files) {\n  const tree = {};\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = tree;\n    for (const part of parts.slice(0, -1)) {\n      if (!current[part]) {\n        current[part] = {};\n      }\n      current = current[part];\n    }\n    current[parts[parts.length - 1]] = null;\n  }\n  function stringify(node, prefix = \"\") {\n    let result = \"\";\n    const entries = Object.entries(node);\n    for (let i = 0; i < entries.length; i++) {\n      const [key, value] = entries[i];\n      const isLast = i === entries.length - 1;\n      const connector = isLast ? \"\\u2514\\u2500\\u2500 \" : \"\\u251C\\u2500\\u2500 \";\n      const childPrefix = isLast ? \"    \" : \"\\u2502   \";\n      result += prefix + connector + key + \"\\n\";\n      if (value !== null) {\n        result += stringify(value, prefix + childPrefix);\n      }\n    }\n    return result;\n  }\n  return stringify(tree);\n}\nfunction buildSizeTree(files) {\n  const root = {\n    name: \"root\",\n    token: 0,\n    children: {},\n    isFile: false\n  };\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = root;\n    for (let i = 0; i < parts.length; i++) {\n      const part = parts[i];\n      const isLastPart = i === parts.length - 1;\n      if (!current.children[part]) {\n        current.children[part] = __spreadProps(__spreadValues({\n          name: part,\n          token: isLastPart ? file.token : 0\n        }, isLastPart && file.content ? { content: file.content } : {}), {\n          children: {},\n          isFile: isLastPart\n        });\n      }\n      current = current.children[part];\n    }\n  }\n  function calculateSize(node) {\n    if (node.isFile) {\n      return node.token;\n    }\n    let totalToken = 0;\n    for (const child of Object.values(node.children)) {\n      totalToken += calculateSize(child);\n    }\n    node.token = totalToken;\n    return totalToken;\n  }\n  calculateSize(root);\n  return root;\n}\n\n// src/core/scanner.ts\nvar BINARY_FILE_TYPES = [\n  \".jpg\",\n  \".jpeg\",\n  \".png\",\n  \".gif\",\n  \".bmp\",\n  \".pdf\",\n  \".doc\",\n  \".docx\",\n  \".xls\",\n  \".xlsx\",\n  \".zip\",\n  \".rar\",\n  \".7z\",\n  \".tar\",\n  \".gz\",\n  \".exe\",\n  \".dll\",\n  \".so\",\n  \".dylib\",\n  \".svg\",\n  \".ico\",\n  \".webp\",\n  \".mp4\",\n  \".mp3\",\n  \".wav\",\n  \".avi\"\n];\nvar FileScanner = class {\n  constructor() {\n    this.processedFiles = /* @__PURE__ */ new Set();\n  }\n  // 查找模块文件\n  findModuleFile(importPath, currentDir, basePath) {\n    return __async(this, null, function* () {\n      if (!importPath.startsWith(\".\")) {\n        return importPath;\n      }\n      const cleanCurrentDir = currentDir.replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\").replace(new RegExp(`^${basePath}/`), \"\");\n      const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n      const pathParts = resolvedPath.split(\"/\");\n      const fileName = pathParts.pop() || \"\";\n      const dirPath = pathParts.join(\"/\");\n      const getExtensions = (importName) => {\n        if (importName.toLowerCase().endsWith(\".css\")) {\n          return [\".css\", \".less\", \".scss\", \".sass\"];\n        }\n        return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n      };\n      const extensions = getExtensions(fileName);\n      const targetBasePath = join(basePath, dirPath);\n      if (!fileName.includes(\".\")) {\n        for (const ext of extensions) {\n          const fullPath = join(targetBasePath, fileName + ext);\n          try {\n            const stats = yield stat(fullPath);\n            if (stats.isFile()) {\n              return join(dirPath, fileName + ext).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n            }\n          } catch (error) {\n            continue;\n          }\n        }\n        const dirFullPath = join(targetBasePath, fileName);\n        try {\n          const stats = yield stat(dirFullPath);\n          if (stats.isDirectory()) {\n            for (const ext of extensions) {\n              const indexPath = join(dirFullPath, \"index\" + ext);\n              try {\n                const indexStats = yield stat(indexPath);\n                if (indexStats.isFile()) {\n                  return join(dirPath, fileName, \"index\" + ext).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n                }\n              } catch (error) {\n                continue;\n              }\n            }\n          }\n        } catch (error) {\n        }\n      } else {\n        const fullPath = join(targetBasePath, fileName);\n        try {\n          const stats = yield stat(fullPath);\n          if (stats.isFile()) {\n            return join(dirPath, fileName).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n          }\n        } catch (error) {\n        }\n      }\n      return null;\n    });\n  }\n  // [依赖文件按需分析]: 分析依赖文件\n  analyzeDependencies(content, filePath, basePath) {\n    return __async(this, null, function* () {\n      const dependencies = [];\n      const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n      const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n      const lines = contentWithoutComments.split(\"\\n\").filter((line) => {\n        const trimmed = line.trim();\n        return trimmed && !trimmed.startsWith(\"//\");\n      }).join(\"\\n\");\n      let match;\n      while ((match = importRegex.exec(lines)) !== null) {\n        const importPath = match[1];\n        const currentDir = dirname(filePath);\n        const resolvedPath = yield this.findModuleFile(\n          importPath,\n          currentDir,\n          basePath\n        );\n        if (resolvedPath && !dependencies.includes(resolvedPath)) {\n          dependencies.push(resolvedPath);\n        }\n      }\n      return dependencies;\n    });\n  }\n  // 扫描目录\n  scanDirectory(path3, options) {\n    return __async(this, null, function* () {\n      if (!path3) {\n        throw new ValidationError(\"Path is required\");\n      }\n      try {\n        this.processedFiles.clear();\n        const allFiles = [];\n        if (options.targetPaths && options.targetPaths.length > 0) {\n          for (const targetPath of options.targetPaths) {\n            yield this.processFileAndDependencies(\n              path3,\n              targetPath,\n              options,\n              allFiles\n            );\n          }\n          return allFiles;\n        }\n        const files = yield glob(\"**/*\", {\n          cwd: path3,\n          ignore: [\n            ...options.excludePatterns || [],\n            \"**/node_modules/**\",\n            \"**/.git/**\"\n          ],\n          nodir: true,\n          absolute: false,\n          windowsPathsNoEscape: true\n        });\n        const results = yield Promise.all(\n          files.map((file) => this.processFile(path3, file, options))\n        );\n        return results.filter((file) => file !== null);\n      } catch (error) {\n        throw new FileProcessError(path3, error.message);\n      }\n    });\n  }\n  // 扫描目标文件及其依赖文件\n  processFileAndDependencies(basePath, relativePath, options, allFiles) {\n    return __async(this, null, function* () {\n      if (this.processedFiles.has(relativePath)) {\n        return;\n      }\n      const fileInfo = yield this.processFile(basePath, relativePath, options);\n      if (fileInfo) {\n        this.processedFiles.add(relativePath);\n        allFiles.push(fileInfo);\n        if (options.includeDependencies !== false) {\n          const dependencies = yield this.analyzeDependencies(\n            fileInfo.content,\n            relativePath,\n            basePath\n          );\n          for (const dep of dependencies) {\n            yield this.processFileAndDependencies(\n              basePath,\n              dep,\n              options,\n              allFiles\n            );\n          }\n        }\n      }\n    });\n  }\n  // 尝试查找文件\n  tryFindFile(basePath, filePath, options) {\n    return __async(this, null, function* () {\n      try {\n        const stats = yield stat(filePath);\n        if (options.maxFileSize && stats.size > options.maxFileSize) {\n          return null;\n        }\n        const content = yield readFile(filePath, \"utf-8\");\n        const basePathParts = basePath.split(\"/\");\n        const deleteHashRepoName = basePathParts[basePathParts.length - 1].replace(/-[^-]*$/, \"\");\n        const relativePath = filePath.replace(new RegExp(`^${basePathParts[0]}/`), \"\").replace(\n          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n          deleteHashRepoName\n        ).replace(/\\\\/g, \"/\");\n        return {\n          path: relativePath,\n          content,\n          // size: stats.size,\n          token: estimateTokens(content)\n        };\n      } catch (error) {\n        return null;\n      }\n    });\n  }\n  // 扫描文件\n  processFile(basePath, relativePath, options) {\n    return __async(this, null, function* () {\n      try {\n        const ext = relativePath.toLowerCase().split(\".\").pop();\n        if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n          return null;\n        }\n        const normalizedPath = relativePath.replace(/^[\\/\\\\]+/, \"\").replace(/\\\\/g, \"/\");\n        const pathParts = normalizedPath.split(\"/\");\n        const fileName = pathParts.pop() || \"\";\n        const dirPath = pathParts.join(\"/\");\n        const targetBasePath = join(basePath, dirPath);\n        const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n        if (!fileName.includes(\".\")) {\n          for (const ext2 of extensions) {\n            const fullPath = join(targetBasePath, fileName + ext2);\n            const result = yield this.tryFindFile(basePath, fullPath, options);\n            if (result) return result;\n          }\n          const dirFullPath = join(targetBasePath, fileName);\n          for (const ext2 of extensions) {\n            const indexPath = join(dirFullPath, \"index\" + ext2);\n            const result = yield this.tryFindFile(basePath, indexPath, options);\n            if (result) return result;\n          }\n        } else {\n          const fullPath = join(targetBasePath, fileName);\n          const result = yield this.tryFindFile(basePath, fullPath, options);\n          if (result) return result;\n        }\n        return null;\n      } catch (error) {\n        console.warn(`Warning: Failed to process file ${relativePath}: ${error}`);\n        return null;\n      }\n    });\n  }\n};\n\n// src/core/codeAnalyzer.ts\nimport Parser from \"tree-sitter\";\nimport TypeScript from \"tree-sitter-typescript\";\nimport path from \"path\";\nvar CodeAnalyzer = class {\n  constructor() {\n    this.codeElements = [];\n    this.relations = [];\n    this.currentFile = \"\";\n    this.currentClass = null;\n    this.currentFunctionId = null;\n    this.scopeStack = [];\n    this.parser = new Parser();\n    this.parser.setLanguage(TypeScript.typescript);\n  }\n  /**\n   * 分析代码文件\n   */\n  analyzeCode(filePath, sourceCode) {\n    if (!filePath) {\n      throw new Error(\"File path cannot be undefined\");\n    }\n    this.currentFile = filePath;\n    try {\n      const tree = this.parser.parse(sourceCode);\n      this.visitNode(tree.rootNode);\n    } catch (error) {\n      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n    }\n  }\n  /**\n   * 访问 AST 节点\n   */\n  visitNode(node) {\n    switch (node.type) {\n      case \"function_declaration\":\n      case \"method_definition\":\n      // 添加方法定义\n      case \"arrow_function\":\n        this.analyzeFunctionDeclaration(node);\n        break;\n      case \"class_declaration\":\n      case \"class\":\n        this.analyzeClassDeclaration(node, this.currentFile);\n        break;\n      case \"interface_declaration\":\n        this.analyzeInterface(node);\n        break;\n      case \"type_alias_declaration\":\n        this.analyzeTypeAlias(node);\n        break;\n      case \"call_expression\":\n      case \"new_expression\":\n        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n        break;\n      case \"import_declaration\":\n      case \"import_statement\":\n        this.analyzeImportStatement(node, this.currentFile);\n        break;\n      case \"variable_declaration\":\n        this.analyzeVariableDeclaration(node);\n        break;\n      case \"implements_clause\":\n        this.analyzeImplementsRelation(node);\n        break;\n    }\n    for (const child of node.children) {\n      this.visitNode(child);\n    }\n  }\n  /**\n   * 分析函数声明\n   */\n  analyzeFunctionDeclaration(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"function\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n    this.scopeStack.push(this.currentFunctionId);\n    this.addCodeElement(element);\n    this.currentFunctionId = null;\n  }\n  /**\n   * 分析类声明\n   */\n  analyzeClassDeclaration(node, filePath) {\n    const className = this.getNodeName(node);\n    if (!className) return;\n    const classElement = {\n      type: \"class\",\n      name: className,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.addCodeElement(classElement);\n    this.currentClass = className;\n    const extendsClause = node.childForFieldName(\"extends\");\n    if (extendsClause) {\n      const superClassName = this.getNodeName(extendsClause);\n      if (superClassName) {\n        const currentClassId = `${this.currentFile}#${className}`;\n        const superClassId = this.resolveTypeReference(superClassName);\n        if (superClassId) {\n          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n          this.addRelation(currentClassId, superClassId, \"extends\");\n        }\n      }\n    }\n    for (const child of node.children) {\n      if (child.type === \"method_definition\" || child.type === \"constructor\") {\n        this.analyzeClassMethod(child, className);\n      }\n    }\n    const implementsClause = node.childForFieldName(\"implements\");\n    if (implementsClause) {\n      this.analyzeImplementsRelation(implementsClause);\n    }\n    this.currentClass = null;\n  }\n  /**\n   * 分析接口声明\n   */\n  analyzeInterface(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"interface\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      id: `${this.currentFile}#Interface#${nameNode.text}`,\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }\n  /**\n   * 分析函数调用\n   */\n  analyzeCallExpression(node, currentScope) {\n    const calleeName = this.resolveCallee(node);\n    if (calleeName) {\n      const currentNode = this.codeElements.find((e) => e.id === currentScope);\n      const calleeNode = this.codeElements.find((e) => e.id === calleeName);\n      if (currentNode && calleeNode) {\n        this.addRelation(currentScope, calleeName, \"calls\");\n      }\n    }\n  }\n  /**\n   * 分析导入声明\n   */\n  analyzeImportStatement(node, filePath) {\n    const importPath = this.getImportPath(node);\n    if (importPath) {\n      this.addRelation(filePath, importPath, \"imports\");\n    }\n  }\n  normalizePath(importPath) {\n    const builtinModules = [\"fs\", \"path\", \"crypto\", \"util\"];\n    if (builtinModules.includes(importPath)) {\n      return importPath;\n    }\n    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n    if (!fullPath.endsWith(\".ts\")) {\n      return `${fullPath}.ts`;\n    }\n    return fullPath;\n  }\n  /**\n   * 添加代码元素\n   */\n  addCodeElement(element) {\n    const elementId = (() => {\n      switch (element.type) {\n        case \"class\":\n          return `${element.filePath}#${element.name}`;\n        case \"class_method\":\n        case \"constructor\":\n          return `${element.filePath}#${element.className}#${element.name}`;\n        case \"interface\":\n          return `${element.filePath}#Interface#${element.name}`;\n        case \"type_alias\":\n          return `${element.filePath}#Type#${element.name}`;\n        default:\n          return `${element.filePath}#${element.name}`;\n      }\n    })();\n    const codeElement = __spreadProps(__spreadValues({}, element), {\n      id: elementId\n    });\n    this.codeElements.push(codeElement);\n  }\n  /**\n   * 添加关系\n   */\n  addRelation(source, target, type) {\n    const sourceNode = this.codeElements.find((e) => e.id === source);\n    const targetNode = this.codeElements.find((e) => e.id === target);\n    if (!sourceNode) {\n      return;\n    }\n    if (!targetNode) {\n      return;\n    }\n    const relation = {\n      sourceId: source,\n      targetId: target,\n      type\n    };\n    const exists = this.relations.some(\n      (r) => r.sourceId === source && r.targetId === target && r.type === type\n    );\n    if (!exists) {\n      this.relations.push(relation);\n    }\n  }\n  /**\n   * 获取代码索引\n   */\n  getCodeIndex() {\n    const codeIndex = /* @__PURE__ */ new Map();\n    this.codeElements.forEach((element) => {\n      const filePath = element.filePath;\n      const existingElements = codeIndex.get(filePath) || [];\n      existingElements.push(element);\n      codeIndex.set(filePath, existingElements);\n    });\n    return codeIndex;\n  }\n  /**\n   * 获取知识图谱\n   */\n  getKnowledgeGraph() {\n    console.log(`[Debug] Generating knowledge graph:`, {\n      totalElements: this.codeElements.length,\n      totalRelations: this.relations.length\n    });\n    const nodes = this.codeElements.map((element) => ({\n      id: element.id,\n      name: element.name,\n      type: element.type,\n      filePath: element.filePath,\n      location: element.location,\n      implementation: element.implementation || \"\"\n      // 添加 implementation 字段\n    }));\n    const validRelations = this.relations.filter((relation) => {\n      const sourceExists = this.codeElements.some((e) => e.id === relation.sourceId);\n      const targetExists = this.codeElements.some((e) => e.id === relation.targetId);\n      if (!sourceExists || !targetExists) {\n        console.warn(`[Warning] Invalid relation:`, {\n          source: relation.sourceId,\n          target: relation.targetId,\n          type: relation.type,\n          sourceExists,\n          targetExists\n        });\n        return false;\n      }\n      return true;\n    });\n    const edges = validRelations.map((relation) => ({\n      source: relation.sourceId,\n      target: relation.targetId,\n      type: relation.type,\n      properties: {}\n    }));\n    console.log(`[Debug] Knowledge graph generated:`, {\n      nodes: nodes.length,\n      edges: edges.length,\n      relationTypes: new Set(edges.map((e) => e.type))\n    });\n    return { nodes, edges };\n  }\n  /**\n   * 获取特定类型的所有元素\n   */\n  getElementsByType(type) {\n    return this.codeElements.filter((element) => element.type === type);\n  }\n  /**\n   * 获取特定元素的所有关系\n   */\n  getElementRelations(elementName) {\n    return this.relations.filter(\n      (edge) => edge.sourceId === elementName || edge.targetId === elementName\n    );\n  }\n  /**\n   * 导出分析结果\n   */\n  exportAnalysis() {\n    return JSON.stringify({\n      codeElements: this.codeElements,\n      relations: this.relations\n    }, null, 2);\n  }\n  // 添加变量声明分析\n  analyzeVariableDeclaration(node) {\n    const declarator = node.childForFieldName(\"declarator\");\n    const nameNode = declarator == null ? void 0 : declarator.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"variable\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }\n  validateAnalysis() {\n    let isValid = true;\n    const idSet = /* @__PURE__ */ new Set();\n    this.codeElements.forEach((node) => {\n      if (node.id && idSet.has(node.id)) {\n        console.error(`[Validation] \\u91CD\\u590D\\u8282\\u70B9ID: ${node.id}`);\n        isValid = false;\n      }\n      if (node.id) {\n        idSet.add(node.id);\n      }\n    });\n    this.relations.forEach((edge) => {\n      const sourceExists = this.codeElements.some((e) => e.id === edge.sourceId);\n      const targetExists = this.codeElements.some((e) => e.id === edge.targetId);\n      if (!sourceExists) {\n        console.error(`[Validation] \\u65E0\\u6548\\u5173\\u7CFB\\u6E90: ${edge.sourceId}`);\n        isValid = false;\n      }\n      if (!targetExists) {\n        console.error(`[Validation] \\u65E0\\u6548\\u5173\\u7CFB\\u76EE\\u6807: ${edge.targetId}`);\n        isValid = false;\n      }\n    });\n    return isValid;\n  }\n  getNodeName(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    return nameNode == null ? void 0 : nameNode.text;\n  }\n  getImplementedInterfaces(node) {\n    return node.text.replace(\"implements \", \"\").split(\",\").map((s) => s.trim());\n  }\n  analyzeClassMethod(node, className) {\n    const isConstructor = node.type === \"constructor\";\n    const methodNameNode = isConstructor ? node.childForFieldName(\"name\") : node.childForFieldName(\"name\");\n    const methodName = (methodNameNode == null ? void 0 : methodNameNode.text) || \"anonymous\";\n    const element = {\n      type: isConstructor ? \"constructor\" : \"class_method\",\n      name: methodName,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      className\n    };\n    this.addCodeElement(element);\n    const classId = `${this.currentFile}#${className}`;\n    const methodId = `${this.currentFile}#${className}#${methodName}`;\n    console.log(`[Debug] Adding class method relation:`, {\n      class: className,\n      method: methodName,\n      classId,\n      methodId,\n      type: element.type\n    });\n    this.addRelation(classId, methodId, \"defines\");\n  }\n  // 添加一个辅助方法来验证关系\n  validateMethodRelation(classId, methodId) {\n    const classNode = this.codeElements.find((e) => e.id === classId);\n    const methodNode = this.codeElements.find((e) => e.id === methodId);\n    if (!classNode) {\n      console.error(`[Error] Class node not found: ${classId}`);\n      return false;\n    }\n    if (!methodNode) {\n      console.error(`[Error] Method node not found: ${methodId}`);\n      return false;\n    }\n    console.log(`[Debug] Validated method relation:`, {\n      class: classNode.name,\n      method: methodNode.name,\n      classId,\n      methodId\n    });\n    return true;\n  }\n  analyzeImplementsRelation(node) {\n    const interfaces = this.getImplementedInterfaces(node);\n    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n    interfaces.forEach((interfaceName) => {\n      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n      if (interfaceId) {\n        this.addRelation(currentClassId, interfaceId, \"implements\");\n      }\n    });\n  }\n  analyzeTypeAlias(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"type_alias\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      }\n    };\n    this.addCodeElement(element);\n  }\n  resolveCallee(node) {\n    const calleeNode = node.childForFieldName(\"function\");\n    if (!calleeNode) return void 0;\n    const calleeName = calleeNode.text;\n    const calleeClass = this.currentClass;\n    const possibleIds = [\n      `${this.currentFile}#${calleeName}`,\n      // 普通函数\n      `${this.currentFile}#${calleeClass}#${calleeName}`,\n      // 类方法\n      `${this.currentFile}#${calleeClass}#constructor`\n      // 构造函数\n    ];\n    for (const id of possibleIds) {\n      const element = this.codeElements.find((e) => e.id === id);\n      if (element) return id;\n    }\n    return void 0;\n  }\n  getImportPath(node) {\n    const moduleNode = node.childForFieldName(\"source\");\n    if (!moduleNode) return \"\";\n    return moduleNode.text.replace(/['\"]/g, \"\");\n  }\n  resolveTypeReference(typeName) {\n    const element = this.codeElements.find((e) => e.name === typeName);\n    return element == null ? void 0 : element.id;\n  }\n};\n\n// src/index.ts\nimport path2 from \"path\";\nimport { mkdir, rm } from \"fs/promises\";\nimport { existsSync } from \"fs\";\nimport crypto from \"crypto\";\n\n// src/utils/analyzeDependencies.ts\nimport { cruise } from \"dependency-cruiser\";\nvar analyzeDependencies = (rootDir) => __async(void 0, null, function* () {\n  try {\n    const result = yield cruise(\n      [rootDir],\n      // 要分析的目录\n      {\n        // 配置选项\n        exclude: \"node_modules\",\n        // 排除 node_modules\n        outputType: \"json\"\n        // 输出为 JSON 格式\n      }\n    );\n    const dependencies = JSON.parse(result.output);\n    return dependencies;\n  } catch (error) {\n    console.error(\"Error analyzing dependencies:\", error);\n  }\n});\n\n// src/index.ts\nvar GitIngest = class {\n  constructor(config) {\n    this.git = new GitAction();\n    this.scanner = new FileScanner();\n    this.analyzer = new CodeAnalyzer();\n    this.config = __spreadValues({\n      tempDir: \"repo\",\n      // 默认保存仓库的目录名(不会暴露到外部)\n      keepTempFiles: false,\n      // 默认不保留临时文件\n      defaultMaxFileSize: 1024 * 1024,\n      // 默认检索不超过 1MB 的文件\n      defaultPatterns: {\n        include: [\"**/*\"],\n        exclude: [\"**/node_modules/**\", \"**/.git/**\"]\n      }\n    }, config);\n  }\n  // 清理临时目录\n  cleanupTempDir(dirPath) {\n    return __async(this, null, function* () {\n      try {\n        if (existsSync(dirPath)) {\n          yield rm(dirPath, { recursive: true, force: true });\n        }\n      } catch (error) {\n        console.warn(\n          `Warning: Failed to cleanup temporary directory ${dirPath}: ${error.message}`\n        );\n      }\n    });\n  }\n  // 检查URL是否使用自定义域名，如果是则转换为原始GitHub URL\n  transformCustomDomainUrl(url) {\n    if (!this.config.customDomainMap) {\n      return url;\n    }\n    const { targetDomain, originalDomain } = this.config.customDomainMap;\n    if (url.includes(targetDomain)) {\n      return url.replace(targetDomain, originalDomain);\n    }\n    return url;\n  }\n  // 检查URL是否匹配自定义域名\n  isCustomDomainUrl(url) {\n    if (!this.config.customDomainMap) {\n      return false;\n    }\n    return url.includes(this.config.customDomainMap.targetDomain);\n  }\n  // [核心步骤0]: 开端，根据 url 按需获取仓库代码\n  analyzeFromUrl(url, options) {\n    return __async(this, null, function* () {\n      const isCustomDomain = this.isCustomDomainUrl(url);\n      const githubUrl = this.transformCustomDomainUrl(url);\n      if (!githubUrl) {\n        throw new ValidationError(\"URL is required\");\n      }\n      if (!githubUrl.match(/^https?:\\/\\//)) {\n        throw new ValidationError(\"Invalid URL format\");\n      }\n      if (!this.config.tempDir) {\n        throw new ValidationError(\"Temporary directory is required\");\n      }\n      const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n      const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n      const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n      const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n      let result;\n      try {\n        if (!existsSync(this.config.tempDir)) {\n          yield mkdir(this.config.tempDir, { recursive: true });\n        }\n        yield this.git.clone(githubUrl, workDir);\n        if (options == null ? void 0 : options.branch) {\n          yield this.git.checkoutBranch(workDir, options.branch);\n        }\n        result = yield this.analyzeFromDirectory(workDir, options);\n        if (!this.config.keepTempFiles) {\n          yield this.cleanupTempDir(workDir);\n        }\n        return result;\n      } catch (error) {\n        if (!this.config.keepTempFiles) {\n          yield this.cleanupTempDir(workDir);\n        }\n        if (error instanceof GitIngestError) {\n          throw error;\n        }\n        throw new GitIngestError(\n          `Failed to analyze repository: ${error.message}`\n        );\n      }\n    });\n  }\n  // 分析扫描目录\n  analyzeFromDirectory(dirPath, options) {\n    return __async(this, null, function* () {\n      var _a, _b;\n      if (!dirPath) {\n        throw new ValidationError(\"Path is required\");\n      }\n      if (!existsSync(dirPath)) {\n        throw new ValidationError(`Directory not found: ${dirPath}`);\n      }\n      try {\n        const files = yield this.scanner.scanDirectory(dirPath, {\n          maxFileSize: (options == null ? void 0 : options.maxFileSize) || this.config.defaultMaxFileSize,\n          includePatterns: (options == null ? void 0 : options.includePatterns) || ((_a = this.config.defaultPatterns) == null ? void 0 : _a.include),\n          excludePatterns: (options == null ? void 0 : options.excludePatterns) || ((_b = this.config.defaultPatterns) == null ? void 0 : _b.exclude),\n          targetPaths: options == null ? void 0 : options.targetPaths,\n          includeDependencies: true\n        });\n        if (files.length === 0) {\n          throw new ValidationError(\"No files found in the specified directory\");\n        }\n        this.analyzer = new CodeAnalyzer();\n        for (const file of files) {\n          try {\n            if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n              const content = file.content;\n              const absolutePath = path2.resolve(dirPath, file.path);\n              this.analyzer.analyzeCode(absolutePath, content);\n            }\n          } catch (error) {\n            console.warn(\n              `Warning: Failed to analyze file ${file.path}: ${error.message}`\n            );\n          }\n        }\n        const codeIndex = this.analyzer.getCodeIndex();\n        const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n        console.log(`Analysis complete. Found ${codeIndex.size} code elements`);\n        return {\n          metadata: {\n            files: files.length,\n            tokens: files.reduce((acc, file) => acc + file.token, 0)\n          },\n          totalCode: files,\n          fileTree: generateTree(files),\n          sizeTree: buildSizeTree(files),\n          codeAnalysis: { codeIndex, knowledgeGraph },\n          dependencyGraph: yield analyzeDependencies(dirPath + ((options == null ? void 0 : options.miniCommonRoot) || \"\"))\n        };\n      } catch (error) {\n        if (error instanceof GitIngestError) {\n          throw error;\n        }\n        throw new GitIngestError(\n          `Failed to analyze directory: ${error.message}`\n        );\n      }\n    });\n  }\n};\nexport {\n  GitIngest,\n  GitIngestError,\n  GitOperationError,\n  ValidationError,\n  searchKnowledgeGraph\n};\n",
              "token": 10835
          },
          {
              "path": "git-analyze-bZ/src/core/codeAnalyzer.ts",
              "content": "import Parser from 'tree-sitter';\nimport TypeScript from 'tree-sitter-typescript';\nimport path from 'path';\nimport fs from 'fs';\n// 导入知识图谱相关接口\nimport { KnowledgeNode, KnowledgeEdge, KnowledgeGraph as IKnowledgeGraph } from '../utils/graphSearch';\n\n// 代码元素类型定义\ntype ElementType =\n  | 'function'\n  | 'class'\n  | 'interface'\n  | 'variable'\n  | 'import'\n  | 'constructor'\n  | 'class_method'\n  | 'type_alias';\n\n// 代码元素接口\ninterface CodeElement {\n  id?: string;\n  type: ElementType;\n  name: string;\n  filePath: string;\n  className?: string;\n  location: {\n    file: string;\n    line: number;\n  };\n  implementation?: string;\n}\n\n// 代码关系类型\nexport type RelationType =\n  | 'calls'      // 函数调用关系\n  | 'imports'    // 导入关系\n  | 'extends'    // 继承关系\n  | 'implements' // 接口实现关系\n  | 'defines';   // 定义关系\n\n// 代码关系接口\nexport interface CodeRelation {\n  sourceId: string;\n  targetId: string;\n  type: RelationType;\n}\n\n// 修改知识图谱接口名称以避免冲突\ninterface KnowledgeGraph extends IKnowledgeGraph {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}\n\nexport class CodeAnalyzer {\n  private parser: Parser;\n  private codeElements: CodeElement[] = [];\n  private relations: CodeRelation[] = [];\n  private currentFile: string = '';\n  private currentClass: string | null = null;\n  private currentFunctionId: string | null = null;\n  private scopeStack: string[] = [];\n\n  constructor() {\n    this.parser = new Parser();\n    this.parser.setLanguage(TypeScript.typescript as any);\n  }\n\n  /**\n   * 分析代码文件\n   */\n  public analyzeCode(filePath: string, sourceCode: string): void {\n    if (!filePath) {\n      throw new Error('File path cannot be undefined');\n    }\n    this.currentFile = filePath;\n    try {\n      // console.log(`[CodeAnalyzer] Processing file: ${filePath}`);\n\n      const tree = this.parser.parse(sourceCode);\n      // console.log(`[CodeAnalyzer] AST generated for ${filePath}`);\n\n      this.visitNode(tree.rootNode);\n\n      // console.log(`[CodeAnalyzer] Analysis complete for ${filePath}`);\n      // console.log(`[CodeAnalyzer] Found ${this.codeElements.length} nodes`);\n      // console.log(`[CodeAnalyzer] Found ${this.relations.length} relationships`);\n    } catch (error) {\n      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n    }\n  }\n\n  /**\n   * 访问 AST 节点\n   */\n  private visitNode(node: Parser.SyntaxNode): void {\n    // 添加更多节点类型匹配\n    switch (node.type) {\n      case 'function_declaration':\n      case 'method_definition':  // 添加方法定义\n      case 'arrow_function':     // 添加箭头函数\n        this.analyzeFunctionDeclaration(node);\n        break;\n\n      case 'class_declaration':\n      case 'class':             // 添加类表达式\n        this.analyzeClassDeclaration(node, this.currentFile);\n        break;\n\n      case 'interface_declaration':\n        this.analyzeInterface(node);\n        break;\n\n      case 'type_alias_declaration':  // 添加类型别名\n        this.analyzeTypeAlias(node);\n        break;\n\n      case 'call_expression':\n      case 'new_expression':    // 添加 new 表达式\n        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n        break;\n\n      case 'import_declaration':\n      case 'import_statement':\n        this.analyzeImportStatement(node, this.currentFile);\n        break;\n\n      case 'variable_declaration':    // 添加变量声明\n        this.analyzeVariableDeclaration(node);\n        break;\n\n      case 'implements_clause':\n        this.analyzeImplementsRelation(node);\n        break;\n    }\n\n    // 递归访问子节点\n    for (const child of node.children) {\n      this.visitNode(child);\n    }\n  }\n\n  /**\n   * 分析函数声明\n   */\n  private analyzeFunctionDeclaration(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'function',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    // 设置当前函数上下文\n    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n    this.scopeStack.push(this.currentFunctionId);  // 使用栈维护嵌套调用\n    this.addCodeElement(element);\n    this.currentFunctionId = null; // 重置上下文\n  }\n\n  /**\n   * 分析类声明\n   */\n  private analyzeClassDeclaration(node: Parser.SyntaxNode, filePath: string): void {\n    const className = this.getNodeName(node);\n    if (!className) return;\n\n    // 1. 添加类定义\n    const classElement: CodeElement = {\n      type: 'class',\n      name: className,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    this.addCodeElement(classElement);\n    this.currentClass = className;\n\n    // 2. 分析继承关系\n    const extendsClause = node.childForFieldName('extends');\n    if (extendsClause) {\n      const superClassName = this.getNodeName(extendsClause);\n      if (superClassName) {\n        const currentClassId = `${this.currentFile}#${className}`;\n        const superClassId = this.resolveTypeReference(superClassName);\n        if (superClassId) {\n          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n          this.addRelation(currentClassId, superClassId, 'extends');\n        }\n      }\n    }\n\n    // 3. 分析类的方法\n    for (const child of node.children) {\n      if (child.type === 'method_definition' || child.type === 'constructor') {\n        this.analyzeClassMethod(child, className);\n      }\n    }\n\n    // 4. 分析接口实现\n    const implementsClause = node.childForFieldName('implements');\n    if (implementsClause) {\n      this.analyzeImplementsRelation(implementsClause);\n    }\n\n    this.currentClass = null;\n  }\n\n  /**\n   * 分析接口声明\n   */\n  private analyzeInterface(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'interface',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      id: `${this.currentFile}#Interface#${nameNode.text}`,\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }\n\n  /**\n   * 分析函数调用\n   */\n  private analyzeCallExpression(node: Parser.SyntaxNode, currentScope: string) {\n    const calleeName = this.resolveCallee(node);\n    if (calleeName) {\n      const currentNode = this.codeElements.find(e => e.id === currentScope);\n      const calleeNode = this.codeElements.find(e => e.id === calleeName);\n\n      if (currentNode && calleeNode) {\n        // console.log(`[Debug] Found call expression:`, {\n        //   caller: currentNode.name,\n        //   callee: calleeNode.name,\n        //   callerId: currentScope,\n        //   calleeId: calleeName\n        // });\n        this.addRelation(currentScope, calleeName, 'calls');\n      }\n    }\n  }\n\n  /**\n   * 分析导入声明\n   */\n  private analyzeImportStatement(node: Parser.SyntaxNode, filePath: string) {\n    const importPath = this.getImportPath(node);\n    if (importPath) {\n      // console.log(`[Debug] Found import:`, {\n      //   importer: filePath,\n      //   imported: importPath\n      // });\n      this.addRelation(filePath, importPath, 'imports');\n    }\n  }\n\n  private normalizePath(importPath: string): string {\n    // 内置模块列表\n    const builtinModules = ['fs', 'path', 'crypto', 'util'];\n\n    if (builtinModules.includes(importPath)) {\n      return importPath;\n    }\n\n    // 将相对路径转换为绝对路径\n    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n\n    // 确保路径以 .ts 结尾\n    if (!fullPath.endsWith('.ts')) {\n      return `${fullPath}.ts`;\n    }\n\n    return fullPath;\n  }\n\n  /**\n   * 添加代码元素\n   */\n  private addCodeElement(element: Omit<CodeElement, 'id'>): void {\n    const elementId = (() => {\n      switch (element.type) {\n        case 'class':\n          return `${element.filePath}#${element.name}`;\n        case 'class_method':\n        case 'constructor':\n          return `${element.filePath}#${element.className}#${element.name}`;\n        case 'interface':\n          return `${element.filePath}#Interface#${element.name}`;\n        case 'type_alias':\n          return `${element.filePath}#Type#${element.name}`;\n        default:\n          return `${element.filePath}#${element.name}`;\n      }\n    })();\n\n    const codeElement: CodeElement = {\n      ...element,\n      id: elementId\n    };\n\n    // console.log(`[Debug] Adding code element:`, {\n    //   type: element.type,\n    //   name: element.name,\n    //   id: elementId,\n    //   className: 'className' in element ? element.className : undefined\n    // });\n\n    this.codeElements.push(codeElement);\n  }\n\n  /**\n   * 添加关系\n   */\n  private addRelation(source: string, target: string, type: RelationType): void {\n    // 检查源节点和目标节点是否存在\n    const sourceNode = this.codeElements.find(e => e.id === source);\n    const targetNode = this.codeElements.find(e => e.id === target);\n\n    if (!sourceNode) {\n      // console.warn(`[Warning] Source node not found: ${source}`);\n      return;\n    }\n    if (!targetNode) {\n      // console.warn(`[Warning] Target node not found: ${target}`);\n      return;\n    }\n\n    const relation: CodeRelation = {\n      sourceId: source,\n      targetId: target,\n      type\n    };\n\n    // 检查是否已存在相同的关系\n    const exists = this.relations.some(r =>\n      r.sourceId === source &&\n      r.targetId === target &&\n      r.type === type\n    );\n\n    if (!exists) {\n      this.relations.push(relation);\n      // console.log(`[Debug] Added relation: ${sourceNode.name} -[${type}]-> ${targetNode.name}`);\n    }\n  }\n\n  /**\n   * 获取代码索引\n   */\n  public getCodeIndex(): Map<string, CodeElement[]> {\n    const codeIndex = new Map<string, CodeElement[]>();\n    this.codeElements.forEach(element => {\n      const filePath = element.filePath;\n      const existingElements = codeIndex.get(filePath) || [];\n      existingElements.push(element);\n      codeIndex.set(filePath, existingElements);\n    });\n    return codeIndex;\n  }\n\n  /**\n   * 获取知识图谱\n   */\n  public getKnowledgeGraph(): KnowledgeGraph {\n    console.log(`[Debug] Generating knowledge graph:`, {\n      totalElements: this.codeElements.length,\n      totalRelations: this.relations.length\n    });\n\n    // 1. 先转换节点,添加 implementation 字段\n    const nodes: KnowledgeNode[] = this.codeElements.map(element => ({\n      id: element.id!,\n      name: element.name,\n      type: element.type,\n      filePath: element.filePath,\n      location: element.location,\n      implementation: element.implementation || '' // 添加 implementation 字段\n    }));\n\n    // 2. 验证所有关系\n    const validRelations = this.relations.filter(relation => {\n      const sourceExists = this.codeElements.some(e => e.id === relation.sourceId);\n      const targetExists = this.codeElements.some(e => e.id === relation.targetId);\n\n      if (!sourceExists || !targetExists) {\n        console.warn(`[Warning] Invalid relation:`, {\n          source: relation.sourceId,\n          target: relation.targetId,\n          type: relation.type,\n          sourceExists,\n          targetExists\n        });\n        return false;\n      }\n      return true;\n    });\n\n    // 3. 转换关系\n    const edges: KnowledgeEdge[] = validRelations.map(relation => ({\n      source: relation.sourceId,\n      target: relation.targetId,\n      type: relation.type,\n      properties: {}\n    }));\n\n    console.log(`[Debug] Knowledge graph generated:`, {\n      nodes: nodes.length,\n      edges: edges.length,\n      relationTypes: new Set(edges.map(e => e.type))\n    });\n\n    return { nodes, edges };\n  }\n\n  /**\n   * 获取特定类型的所有元素\n   */\n  public getElementsByType(type: ElementType): CodeElement[] {\n    return this.codeElements.filter(element => element.type === type);\n  }\n\n  /**\n   * 获取特定元素的所有关系\n   */\n  public getElementRelations(elementName: string): CodeRelation[] {\n    return this.relations.filter(\n      edge => edge.sourceId === elementName || edge.targetId === elementName\n    );\n  }\n\n  /**\n   * 导出分析结果\n   */\n  public exportAnalysis(): string {\n    return JSON.stringify({\n      codeElements: this.codeElements,\n      relations: this.relations\n    }, null, 2);\n  }\n\n  // 添加变量声明分析\n  private analyzeVariableDeclaration(node: Parser.SyntaxNode): void {\n    const declarator = node.childForFieldName('declarator');\n    const nameNode = declarator?.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'variable',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    this.addCodeElement(element);\n  }\n\n  public validateAnalysis(): boolean {\n    let isValid = true;\n\n    // 唯一性检查\n    const idSet = new Set<string>();\n    this.codeElements.forEach(node => {\n      if (node.id && idSet.has(node.id)) {\n        console.error(`[Validation] 重复节点ID: ${node.id}`);\n        isValid = false;\n      }\n      if (node.id) {\n        idSet.add(node.id);\n      }\n    });\n\n    // 关系有效性检查\n    this.relations.forEach(edge => {\n      const sourceExists = this.codeElements.some(e => e.id === edge.sourceId);\n      const targetExists = this.codeElements.some(e => e.id === edge.targetId);\n\n      if (!sourceExists) {\n        console.error(`[Validation] 无效关系源: ${edge.sourceId}`);\n        isValid = false;\n      }\n      if (!targetExists) {\n        console.error(`[Validation] 无效关系目标: ${edge.targetId}`);\n        isValid = false;\n      }\n    });\n\n    return isValid;\n  }\n\n  private getNodeName(node: Parser.SyntaxNode): string | undefined {\n    const nameNode = node.childForFieldName('name');\n    return nameNode?.text;\n  }\n\n  private getImplementedInterfaces(node: Parser.SyntaxNode): string[] {\n    return node.text.replace('implements ', '').split(',').map(s => s.trim());\n  }\n\n  private analyzeClassMethod(node: Parser.SyntaxNode, className: string): void {\n    const isConstructor = node.type === 'constructor';\n    const methodNameNode = isConstructor\n      ? node.childForFieldName('name')\n      : node.childForFieldName('name');\n\n    const methodName = methodNameNode?.text || 'anonymous';\n\n    // 1. 添加方法定义\n    const element: CodeElement = {\n      type: isConstructor ? 'constructor' : 'class_method',\n      name: methodName,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      className\n    };\n\n    this.addCodeElement(element);\n\n    // 2. 添加类定义方法的关系\n    const classId = `${this.currentFile}#${className}`;\n    const methodId = `${this.currentFile}#${className}#${methodName}`;\n\n    console.log(`[Debug] Adding class method relation:`, {\n      class: className,\n      method: methodName,\n      classId,\n      methodId,\n      type: element.type\n    });\n\n    this.addRelation(classId, methodId, 'defines');\n  }\n\n  // 添加一个辅助方法来验证关系\n  private validateMethodRelation(classId: string, methodId: string): boolean {\n    const classNode = this.codeElements.find(e => e.id === classId);\n    const methodNode = this.codeElements.find(e => e.id === methodId);\n\n    if (!classNode) {\n      console.error(`[Error] Class node not found: ${classId}`);\n      return false;\n    }\n    if (!methodNode) {\n      console.error(`[Error] Method node not found: ${methodId}`);\n      return false;\n    }\n\n    console.log(`[Debug] Validated method relation:`, {\n      class: classNode.name,\n      method: methodNode.name,\n      classId,\n      methodId\n    });\n\n    return true;\n  }\n\n  private analyzeImplementsRelation(node: Parser.SyntaxNode): void {\n    const interfaces = this.getImplementedInterfaces(node);\n    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n\n    interfaces.forEach(interfaceName => {\n      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n      if (interfaceId) {\n        this.addRelation(currentClassId, interfaceId, 'implements');\n      }\n    });\n  }\n\n  private analyzeTypeAlias(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'type_alias',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      }\n    };\n    this.addCodeElement(element);\n  }\n\n  private resolveCallee(node: Parser.SyntaxNode): string | undefined {\n    const calleeNode = node.childForFieldName('function');\n    if (!calleeNode) return undefined;\n\n    // 通过完整路径查找元素\n    const calleeName = calleeNode.text;\n    const calleeClass = this.currentClass;\n\n    // 构建可能的ID格式\n    const possibleIds = [\n      `${this.currentFile}#${calleeName}`,                    // 普通函数\n      `${this.currentFile}#${calleeClass}#${calleeName}`,    // 类方法\n      `${this.currentFile}#${calleeClass}#constructor`        // 构造函数\n    ];\n\n    // 查找匹配的元素\n    for (const id of possibleIds) {\n      const element = this.codeElements.find(e => e.id === id);\n      if (element) return id;\n    }\n\n    return undefined;\n  }\n\n  private getImportPath(node: Parser.SyntaxNode): string {\n    const moduleNode = node.childForFieldName('source');\n    if (!moduleNode) return '';\n\n    // 移除引号\n    return moduleNode.text.replace(/['\"]/g, '');\n  }\n\n  private resolveTypeReference(typeName: string): string | undefined {\n    const element = this.codeElements.find(e => e.name === typeName);\n    return element?.id;\n  }\n} ",
              "token": 5635
          },
          {
              "path": "git-analyze-bZ/src/utils/graphSearch.ts",
              "content": "export interface KnowledgeNode {\n  id: string;\n  name: string;\n  type: string;\n  filePath: string;\n  location: {\n    file: string;\n    line: number;\n  };\n  description?: string;\n  properties?: Record<string, any>;\n  implementation?: string;\n}\n\nexport interface KnowledgeEdge {\n  source: string;\n  target: string;\n  type: string;\n  properties?: Record<string, any>;\n}\n\nexport interface KnowledgeGraph {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}\n\nexport interface SearchOptions {\n  entities: string[];         // 实体名称数组\n  relationTypes?: string[];   // 按关系类型过滤\n  maxDistance?: number;       // 关系距离限制\n  limit?: number;             // 结果数量限制\n}\n\nexport interface SearchResult {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n  metadata: {\n    totalNodes: number;\n    totalEdges: number;\n    entities: string[];\n    relationTypes: string[];\n    maxDistance: number;\n  };\n}\n\ninterface RelatedNodesResult {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}\n\nfunction findRelatedNodes(\n  graph: KnowledgeGraph,\n  startNodes: KnowledgeNode[],\n  maxDistance: number\n): RelatedNodesResult {\n  const relatedNodes = new Set<KnowledgeNode>();\n  const relatedEdges = new Set<KnowledgeEdge>();\n  const processedNodeIds = new Set<string>();\n\n  function processNode(node: KnowledgeNode, distance: number) {\n    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n    processedNodeIds.add(node.id);\n    relatedNodes.add(node);\n\n    // 1. 查找直接相关的边\n    const directEdges = graph.edges.filter(edge =>\n      edge.source === node.id || edge.target === node.id\n    );\n\n    directEdges.forEach(edge => {\n      relatedEdges.add(edge);\n\n      // 处理边的另一端节点\n      const otherId = edge.source === node.id ? edge.target : edge.source;\n      const otherNode = graph.nodes.find(n => n.id === otherId);\n\n      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n        processNode(otherNode, distance + 1);\n      }\n    });\n\n    // 2. 查找类和方法的关系\n    if (node.type === 'class') {\n      // 先找到类的所有方法\n      const methodNodes = graph.nodes.filter(n => {\n        if (n.type !== 'function' && n.type !== 'class_method') return false;\n        if (n.filePath !== node.filePath) return false;\n        if (n.name === 'constructor') return false;\n\n        // 检查方法是否属于这个类\n        const classNode = graph.nodes.find(c =>\n          c.type === 'class' &&\n          c.filePath === n.filePath &&\n          c.id === n.id.split('#')[0] + '#' + node.name\n        );\n        return classNode !== undefined;\n      });\n\n      methodNodes.forEach(methodNode => {\n        if (!processedNodeIds.has(methodNode.id)) {\n          // 添加 defines 关系\n          const edge: KnowledgeEdge = {\n            source: node.id,\n            target: methodNode.id,\n            type: 'defines',\n            properties: {}\n          };\n          relatedEdges.add(edge);\n          processNode(methodNode, distance + 1);\n        }\n      });\n    }\n\n    // 3. 查找继承关系\n    if (node.type === 'class' && node.name.endsWith('Error')) {\n      const parentNode = graph.nodes.find(n => n.name === 'Error');\n      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n        const edge: KnowledgeEdge = {\n          source: node.id,\n          target: 'Error',\n          type: 'extends',\n          properties: {}\n        };\n        relatedEdges.add(edge);\n        processNode(parentNode, distance + 1);\n      }\n    }\n  }\n\n  // 从每个起始节点开始处理\n  startNodes.forEach(node => processNode(node, 0));\n\n  return {\n    nodes: Array.from(relatedNodes),\n    edges: Array.from(relatedEdges)\n  };\n}\n\n/**\n * 基于实体名称列表搜索关联的知识图谱\n * @param graph 知识图谱\n * @param options 搜索选项\n * @returns 搜索结果\n */\nexport function searchKnowledgeGraph(\n  graph: KnowledgeGraph,\n  options: SearchOptions\n): SearchResult {\n  const { entities, maxDistance = 2 } = options;\n\n  // 1. 找到起始节点\n  const startNodes = graph.nodes.filter(node =>\n    entities.some(entity => node.name === entity)\n  );\n\n  if (!startNodes.length) {\n    console.warn(`[Warning] No nodes found for entities:`, entities);\n    return {\n      nodes: [],\n      edges: [],\n      metadata: {\n        totalNodes: 0,\n        totalEdges: 0,\n        entities,\n        relationTypes: [],\n        maxDistance\n      }\n    };\n  }\n\n  // 2. 找到相关节点和边\n  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance);\n\n  // 3. 添加类和方法的关系\n  const methodNodes = nodes.filter(n => n.type === 'function' || n.type === 'class_method');\n  const classNodes = nodes.filter(n => n.type === 'class');\n\n  methodNodes.forEach(method => {\n    const className = method.id.split('#')[1];\n    const relatedClass = classNodes.find(c => c.name === className);\n    if (relatedClass) {\n      edges.push({\n        source: relatedClass.id,\n        target: method.id,\n        type: 'defines',\n        properties: {}\n      });\n    }\n  });\n\n  // 4. 添加继承关系\n  const errorClasses = classNodes.filter(n => n.name.endsWith('Error'));\n  errorClasses.forEach(errorClass => {\n    edges.push({\n      source: errorClass.id,\n      target: 'Error',\n      type: 'extends',\n      properties: {}\n    });\n  });\n\n  return {\n    nodes,\n    edges,\n    metadata: {\n      totalNodes: nodes.length,\n      totalEdges: edges.length,\n      entities,\n      relationTypes: Array.from(new Set(edges.map(e => e.type))),\n      maxDistance\n    }\n  };\n}\n\nfunction printGraphStats(graph: KnowledgeGraph) {\n  console.log('Nodes:', graph.nodes.length);\n  console.log('Edges:', graph.edges.length);\n  console.log('Unique Relationships:',\n    new Set(graph.edges.map(e => `${e.type}:${e.source}->${e.target}`)).size\n  );\n} ",
              "token": 1810
          },
          {
              "path": "git-analyze-bZ/src/core/gitAction.ts",
              "content": "import { simpleGit, SimpleGit } from \"simple-git\";\nimport { GitOperationError } from \"./errors\";\n\nexport class GitAction {\n  private git: SimpleGit;\n\n  constructor() {\n    this.git = simpleGit({ baseDir: process.cwd() });\n  }\n\n  async clone(url: string, path: string): Promise<void> {\n    try {\n      await this.git.clone(url, path);\n    } catch (error) {\n      throw new GitOperationError(\"clone\", (error as Error).message);\n    }\n  }\n\n  async checkoutBranch(path: string, branch: string): Promise<void> {\n    try {\n      const git = simpleGit(path);\n      await git.checkout(branch);\n    } catch (error) {\n      throw new GitOperationError(\"checkout\", (error as Error).message);\n    }\n  }\n}\n",
              "token": 192
          },
          {
              "path": "git-analyze-bZ/src/core/errors.ts",
              "content": "// 错误基类\nexport class GitIngestError extends Error {\n  constructor(message: string) {\n    super(message);\n    this.name = \"GitIngestError\";\n  }\n}\n\n// 错误基类\nexport class GitOperationError extends GitIngestError {\n  constructor(operation: string, details: string) {\n    super(`Git operation '${operation}' failed: ${details}`);\n    this.name = \"GitOperationError\";\n  }\n}\n\n// 文件处理错误\nexport class FileProcessError extends GitIngestError {\n  constructor(path: string, reason: string) {\n    super(`Failed to process file '${path}': ${reason}`);\n    this.name = \"FileProcessError\";\n  }\n}\n\n// 验证错误\nexport class ValidationError extends GitIngestError {\n  constructor(message: string) {\n    super(`Validation failed: ${message}`);\n    this.name = \"ValidationError\";\n  }\n}\n\n// 依赖分析错误\nexport class DependencyAnalysisError extends Error {\n  constructor(\n    public readonly filePath: string,\n    public readonly errorType: \"parse\" | \"resolve\" | \"analyze\",\n    message: string\n  ) {\n    super(`[${errorType}] ${message} in file: ${filePath}`);\n    this.name = \"DependencyAnalysisError\";\n  }\n}\n\n// git 分析错误\nexport class GitAnalysisError extends Error {\n  constructor(\n    public readonly operation: string,\n    public readonly target: string,\n    message: string\n  ) {\n    super(`Git analysis failed: ${message} (${operation} on ${target})`);\n    this.name = \"GitAnalysisError\";\n  }\n}\n",
              "token": 431
          },
          {
              "path": "git-analyze-bZ/src/core/scanner.ts",
              "content": "import { glob } from \"glob\";\nimport { readFile, stat } from \"fs/promises\";\nimport type { FileInfo } from \"../types/index\";\nimport { FileProcessError, ValidationError } from \"./errors\";\nimport { dirname, join } from \"path\";\nimport { estimateTokens } from \"../utils\";\n\ninterface ScanOptions {\n  maxFileSize?: number;\n  includePatterns?: string[];\n  excludePatterns?: string[];\n  targetPaths?: string[];\n  includeDependencies?: boolean;\n}\n\nconst BINARY_FILE_TYPES = [\n  \".jpg\",\n  \".jpeg\",\n  \".png\",\n  \".gif\",\n  \".bmp\",\n  \".pdf\",\n  \".doc\",\n  \".docx\",\n  \".xls\",\n  \".xlsx\",\n  \".zip\",\n  \".rar\",\n  \".7z\",\n  \".tar\",\n  \".gz\",\n  \".exe\",\n  \".dll\",\n  \".so\",\n  \".dylib\",\n  \".svg\",\n  \".ico\",\n  \".webp\",\n  \".mp4\",\n  \".mp3\",\n  \".wav\",\n  \".avi\",\n  ];\n\nexport class FileScanner {\n  protected processedFiles: Set<string> = new Set();\n\n  // 查找模块文件\n  private async findModuleFile(\n    importPath: string,\n    currentDir: string,\n    basePath: string\n  ): Promise<string | null> {\n    // 处理外部依赖\n    if (!importPath.startsWith(\".\")) {\n      return importPath; // 直接返回包名，让依赖图生成器处理\n    }\n\n    // 清理当前目录路径，移除临时目录部分\n    const cleanCurrentDir = currentDir\n      .replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\")\n      .replace(new RegExp(`^${basePath}/`), \"\");\n\n    // 解析基础目录路径\n    const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n    const pathParts = resolvedPath.split(\"/\");\n    const fileName = pathParts.pop() || \"\";\n    const dirPath = pathParts.join(\"/\");\n\n    // 可能的文件扩展名，根据导入文件类型调整优先级\n    const getExtensions = (importName: string) => {\n      if (importName.toLowerCase().endsWith(\".css\")) {\n        return [\".css\", \".less\", \".scss\", \".sass\"];\n      }\n      return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n    };\n\n    const extensions = getExtensions(fileName);\n\n    const targetBasePath = join(basePath, dirPath);\n\n    // 构建可能的基础路径\n    // const possibleBasePaths = [\n    //   join(basePath, dirPath),\n    //   join(basePath, 'src', dirPath),\n    //   ...glob.sync(`${basePath}/*/src/${dirPath}`, { absolute: true })\n    // ];\n\n    // 如果文件名没有扩展名\n    if (!fileName.includes(\".\")) {\n      // for (const currentBasePath of possibleBasePaths) {\n      // 1. 尝试直接添加扩展名\n      for (const ext of extensions) {\n        const fullPath = join(targetBasePath, fileName + ext);\n        try {\n          const stats = await stat(fullPath);\n          if (stats.isFile()) {\n            // 返回清理过的路径\n            return join(dirPath, fileName + ext)\n              .replace(new RegExp(`^${basePath}/`), \"\")\n              .replace(/\\\\/g, \"/\");\n          }\n        } catch (error) {\n          continue;\n        }\n      }\n\n      // 2. 尝试查找 index 文件\n      const dirFullPath = join(targetBasePath, fileName);\n      try {\n        const stats = await stat(dirFullPath);\n        if (stats.isDirectory()) {\n          for (const ext of extensions) {\n            const indexPath = join(dirFullPath, \"index\" + ext);\n            try {\n              const indexStats = await stat(indexPath);\n              if (indexStats.isFile()) {\n                return join(dirPath, fileName, \"index\" + ext)\n                  .replace(new RegExp(`^${basePath}/`), \"\")\n                  .replace(/\\\\/g, \"/\");\n              }\n            } catch (error) {\n              continue;\n            }\n          }\n        }\n      } catch (error) {\n        // continue;\n      }\n      // }\n    } else {\n      // 文件名已有扩展名，尝试所有可能的基础路径\n      // for (const currentBasePath of possibleBasePaths) {\n      const fullPath = join(targetBasePath, fileName);\n      try {\n        const stats = await stat(fullPath);\n        if (stats.isFile()) {\n          return join(dirPath, fileName)\n            .replace(new RegExp(`^${basePath}/`), \"\")\n            .replace(/\\\\/g, \"/\");\n        }\n      } catch (error) {\n        // continue;\n      }\n      // }\n    }\n\n    return null;\n  }\n\n  // [依赖文件按需分析]: 分析依赖文件\n  protected async analyzeDependencies(\n    content: string,\n    filePath: string,\n    basePath: string\n  ): Promise<string[]> {\n    const dependencies: string[] = [];\n    // 匹配导入路径。示例: import { Button } from '@/components/Button'\n    const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n\n    // 移除多行注释\n    const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n    const lines = contentWithoutComments\n      .split(\"\\n\")\n      .filter((line) => {\n        const trimmed = line.trim();\n        return trimmed && !trimmed.startsWith(\"//\");\n      })\n      .join(\"\\n\");\n\n    // 匹配导入路径\n    let match;\n    // 遍历每一行，匹配导入路径\n    while ((match = importRegex.exec(lines)) !== null) {\n      // 获取导入路径。示例: import { Button } from '@/components/Button'\n      const importPath = match[1];\n      // 获取当前文件路径。示例: src/components/Button/index.ts\n      const currentDir = dirname(filePath);\n\n      // 查找导入路径。示例: src/components/Button/index.ts\n      const resolvedPath = await this.findModuleFile(\n        importPath,\n        currentDir,\n        basePath\n      );\n      // 如果导入路径存在，且不在依赖列表中，则添加到依赖列表\n      if (resolvedPath && !dependencies.includes(resolvedPath)) {\n        dependencies.push(resolvedPath);\n      }\n    }\n\n    // 返回依赖列表。示例：['src/components/Button/index.ts', 'src/components/Input/index.ts']\n    return dependencies;\n  }\n\n  // 扫描目录\n  async scanDirectory(path: string, options: ScanOptions): Promise<FileInfo[]> {\n    if (!path) {\n      throw new ValidationError(\"Path is required\");\n    }\n\n    try {\n      // 清除已处理文件\n      this.processedFiles.clear();\n      const allFiles: FileInfo[] = [];\n\n      // 如果指定了目标文件路径，则扫描目标文件及其依赖文件\n      if (options.targetPaths && options.targetPaths.length > 0) {\n        for (const targetPath of options.targetPaths) {\n          // [核心步骤三]: 扫描目标文件及其依赖文件\n          await this.processFileAndDependencies(\n            path,\n            targetPath,\n            options,\n            allFiles\n          );\n        }\n        return allFiles;\n      }\n\n      const files = await glob(\"**/*\", {\n        cwd: path,\n        ignore: [\n          ...(options.excludePatterns || []),\n          \"**/node_modules/**\",\n          \"**/.git/**\",\n        ],\n        nodir: true,\n        absolute: false,\n        windowsPathsNoEscape: true,\n      });\n\n      const results = await Promise.all(\n        files.map((file) => this.processFile(path, file, options))\n      );\n\n      return results.filter((file): file is FileInfo => file !== null);\n    } catch (error) {\n      throw new FileProcessError(path, (error as Error).message);\n    }\n  }\n\n  // 扫描目标文件及其依赖文件\n  private async processFileAndDependencies(\n    basePath: string,\n    relativePath: string,\n    options: ScanOptions,\n    allFiles: FileInfo[]\n  ): Promise<void> {\n    if (this.processedFiles.has(relativePath)) {\n      return;\n    }\n\n    /**\n     * 核心步骤四: 扫描目标文件\n     * 示例: fileInfo: { path: 'src/components/Button/index.ts', content: '...', size: 1024 }\n     */\n    const fileInfo = await this.processFile(basePath, relativePath, options);\n    // 如果文件存在，则添加到已处理文件集合，并添加到结果数组\n    if (fileInfo) {\n      this.processedFiles.add(relativePath);\n      allFiles.push(fileInfo);\n\n      // [依赖文件按需分析]: 如果 includeDependencies 为 true，则分析依赖文件\n      if (options.includeDependencies !== false) {\n        // 分析依赖文件\n        const dependencies = await this.analyzeDependencies(\n          fileInfo.content,\n          relativePath,\n          basePath\n        );\n        // 遍历依赖文件，递归扫描依赖文件\n        for (const dep of dependencies) {\n          await this.processFileAndDependencies(\n            basePath,\n            dep,\n            options,\n            allFiles\n          );\n        }\n      }\n    }\n  }\n\n  // 尝试查找文件\n  private async tryFindFile(\n    basePath: string,\n    filePath: string,\n    options: ScanOptions\n  ): Promise<FileInfo | null> {\n    try {\n      const stats = await stat(filePath);\n      if (options.maxFileSize && stats.size > options.maxFileSize) {\n        return null;\n      }\n\n      // [核心步骤六]: 读取文件内容\n      const content = await readFile(filePath, \"utf-8\");\n      /**\n       * @desc 移除临时目录前缀，只保留项目相关路径\n       * 示例:\n       * filePath: repo/github101-250644/src/core/gitAction.ts\n       * basePath: 'repo/github101-492772'\n       * relativePath: repo/github101-250644/src/core/gitAction.ts\n       */\n      const basePathParts = basePath.split(\"/\"); // eg: ['repo', 'github101-492772']\n      const deleteHashRepoName = basePathParts[\n        basePathParts.length - 1\n      ].replace(/-[^-]*$/, \"\"); // github101\n      const relativePath = filePath\n        .replace(new RegExp(`^${basePathParts[0]}/`), \"\") // 去除临时目录前缀 repo/\n        .replace(\n          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n          deleteHashRepoName\n        ) // 去掉[-hash]\n        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n\n      return {\n        path: relativePath,\n        content,\n        // size: stats.size,\n        token: estimateTokens(content),\n      };\n    } catch (error) {\n      return null;\n    }\n  }\n\n  // 扫描文件\n  private async processFile(\n    basePath: string,\n    relativePath: string,\n    options: ScanOptions\n  ): Promise<FileInfo | null> {\n    try {\n      // 获取文件扩展名\n      const ext = relativePath.toLowerCase().split(\".\").pop();\n      // 如果文件是二进制文件，则跳过\n      if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n        return null;\n      }\n\n      /**\n       * @desc 规范化路径\n       * 示例:\n       * relativePath: src/components/Button/index.ts\n       * normalizedPath: src/components/Button/index.ts\n       */\n      const normalizedPath = relativePath\n        .replace(/^[\\/\\\\]+/, \"\") // 移除开头的斜杠\n        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n\n      /**\n       * @desc 获取基础路径和文件名部分\n       * 示例:\n       * normalizedPath: src/components/Button/index.ts\n       * pathParts: ['src', 'components', 'Button', 'index.ts']\n       * fileName: 'index.ts'\n       * dirPath: 'src/components/Button'\n       * targetBasePath: ${basePath}/src/components/Button\n       */\n      const pathParts = normalizedPath.split(\"/\");\n      const fileName = pathParts.pop() || \"\";\n      const dirPath = pathParts.join(\"/\");\n      const targetBasePath = join(basePath, dirPath);\n\n      // 可能的文件扩展名\n      const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n\n      // [核心步骤五]: tryFindFile 尝试查找文件\n      // 如果路径没有扩展名，尝试多种可能性\n      if (!fileName.includes(\".\")) {\n        // 1. 尝试直接添加扩展名\n        for (const ext of extensions) {\n          const fullPath = join(targetBasePath, fileName + ext);\n          const result = await this.tryFindFile(basePath, fullPath, options);\n          if (result) return result;\n        }\n\n        // 2. 尝试作为目录查找 index 文件\n        const dirFullPath = join(targetBasePath, fileName);\n        for (const ext of extensions) {\n          const indexPath = join(dirFullPath, \"index\" + ext);\n          const result = await this.tryFindFile(basePath, indexPath, options);\n          if (result) return result;\n        }\n      } else {\n        // 文件名已有扩展名，尝试所有可能的基础路径\n        const fullPath = join(targetBasePath, fileName);\n        const result = await this.tryFindFile(basePath, fullPath, options);\n        if (result) return result;\n      }\n\n      return null;\n    } catch (error) {\n      console.warn(`Warning: Failed to process file ${relativePath}: ${error}`);\n      return null;\n    }\n  }\n}\n",
              "token": 4132
          },
          {
              "path": "git-analyze-bZ/src/types/index.ts",
              "content": "export interface AnalyzeOptions {\n  // 最大文件大小\n  maxFileSize?: number;\n  // 包含的文件模式\n  includePatterns?: string[];\n  // 排除的文件模式\n  excludePatterns?: string[];\n  // 目标文件路径\n  targetPaths?: string[];\n  // 分支\n  branch?: string;\n  // 提交\n  commit?: string;\n  // 最小公共根目录\n  miniCommonRoot?: string;\n}\n\nexport interface FileInfo {\n  // 文件路径\n  path: string;\n  // 文件内容\n  content: string;\n  // 文件预估消耗 token 数量\n  token: number;\n}\n\nexport interface AnalysisResult {\n  // 项目概况\n  metadata: {\n    files: number;\n    tokens: number;\n  };\n  // 文件树\n  fileTree: string;\n  // 总代码\n  totalCode: {\n    // 文件路径\n    path: string;\n    // 文件内容\n    content: string;\n    // 文件预估消耗 token 数量\n    token: number;\n  }[];\n  // 文件大小树，表示文件及其子文件夹的大小结构\n  sizeTree: {\n    // 文件或文件夹的名称\n    name: string;\n    // 文件或文件夹预估消耗 token 数量\n    token: number;\n    // 是否为文件\n    isFile: boolean;\n    // 子文件或子文件夹的集合\n    children?: {\n      [key: string]: {\n        // 子文件或子文件夹的名称\n        name: string;\n        // 子文件或子文件夹预估消耗 token 数量\n        token: number;\n        // 子文件或子文件夹的集合\n        children?: any; // 递归定义，允许嵌套\n        // 是否为文件\n        isFile: boolean;\n      };\n    };\n  };\n  // 代码分析\n  codeAnalysis: CodeAnalysis;\n  // 依赖关系图\n  dependencyGraph: any;\n}\n\nexport interface CodeAnalysis {\n  codeIndex: Map<string, any[]>;\n  knowledgeGraph: {\n    nodes: any[];\n    edges: any[];\n  };\n}\nexport interface GitIngestConfig {\n  // 保存克隆仓库的临时目录名\n  tempDir?: string;\n  /* 默认检索的最大的文件 */\n  defaultMaxFileSize?: number;\n  /* 文件模式 */\n  defaultPatterns?: {\n    /* 包含的文件/目录 */\n    include?: string[];\n    /* 不会去检索的文件/目录 */\n    exclude?: string[];\n  };\n  /* 保留克隆的仓库 */\n  keepTempFiles?: boolean;\n  /* 自定义域名 */\n  customDomainMap?: {\n    targetDomain: string;\n    originalDomain: string;\n  };\n}\n",
              "token": 953
          },
          {
              "path": "git-analyze-bZ/src/utils/index.ts",
              "content": "import type { FileInfo } from \"../types/index\";\n\n// 估计内容 token 数量\nexport function estimateTokens(text: string): number {\n  // 1. 计算中文字符数量\n  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n\n  // 2. 计算英文单词数量（包括数字和标点）\n  const otherChars = text.length - chineseChars;\n\n  // 3. 计算总 token：\n  // - 中文字符通常是 1:1 或 1:2 的比例，保守起见使用 2\n  // - 其他字符按照 1:0.25 的比例\n  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n\n  // 4. 添加 10% 的安全余量\n  return Math.ceil(estimatedTokens * 1.1);\n}\n\n// 生成目录树\nexport function generateTree(files: FileInfo[]): string {\n  const tree: { [key: string]: any } = {};\n\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = tree;\n\n    for (const part of parts.slice(0, -1)) {\n      if (!current[part]) {\n        current[part] = {};\n      }\n      current = current[part];\n    }\n\n    current[parts[parts.length - 1]] = null;\n  }\n\n  function stringify(node: any, prefix = \"\"): string {\n    let result = \"\";\n    const entries = Object.entries(node);\n\n    for (let i = 0; i < entries.length; i++) {\n      const [key, value] = entries[i];\n      const isLast = i === entries.length - 1;\n      const connector = isLast ? \"└── \" : \"├── \";\n      const childPrefix = isLast ? \"    \" : \"│   \";\n\n      result += prefix + connector + key + \"\\n\";\n\n      if (value !== null) {\n        result += stringify(value, prefix + childPrefix);\n      }\n    }\n\n    return result;\n  }\n\n  return stringify(tree);\n}\n\ninterface TreeNode {\n  name: string;\n  token: number;\n  content?: string;\n  children: { [key: string]: TreeNode };\n  isFile: boolean;\n}\n\n// 构建文件大小树\nexport function buildSizeTree(files: FileInfo[]): TreeNode {\n  // 创建根节点\n  const root: TreeNode = {\n    name: \"root\",\n    token: 0,\n    children: {},\n    isFile: false,\n  };\n\n  // 构建树结构\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = root;\n\n    // 遍历路径的每一部分\n    for (let i = 0; i < parts.length; i++) {\n      const part = parts[i];\n      const isLastPart = i === parts.length - 1;\n\n      if (!current.children[part]) {\n        current.children[part] = {\n          name: part,\n          token: isLastPart ? file.token : 0,\n          ...(isLastPart && file.content ? { content: file.content } : {}),\n          children: {},\n          isFile: isLastPart,\n        };\n      }\n\n      current = current.children[part];\n    }\n  }\n\n  // 计算每个目录的总大小\n  function calculateSize(node: TreeNode): number {\n    if (node.isFile) {\n      return node.token;\n    }\n\n    let totalToken = 0;\n    for (const child of Object.values(node.children)) {\n      totalToken += calculateSize(child);\n    }\n    node.token = totalToken;\n    return totalToken;\n  }\n\n  calculateSize(root);\n  return root;\n}\n\nexport * from './graphSearch';\n",
              "token": 963
          },
          {
              "path": "git-analyze-bZ/src/index.ts",
              "content": "import { GitAction } from \"./core/gitAction\";\nimport { FileScanner } from \"./core/scanner\";\nimport { CodeAnalyzer } from \"./core/codeAnalyzer\";\nimport path from 'path';  // 添加 path 模块\nimport type {\n  AnalyzeOptions,\n  AnalysisResult,\n  GitIngestConfig,\n  FileInfo,\n  CodeAnalysis\n} from \"./types/index\";\nimport { generateTree, buildSizeTree, estimateTokens } from \"./utils/index\";\nimport {\n  GitIngestError,\n  ValidationError,\n  GitOperationError,\n} from \"./core/errors\";\nimport { mkdir, rm } from \"fs/promises\";\nimport { existsSync } from \"fs\";\nimport crypto from \"crypto\";\nimport { analyzeDependencies } from \"./utils/analyzeDependencies\";\n\nexport class GitIngest {\n  private git: GitAction;\n  private scanner: FileScanner;\n  private analyzer: CodeAnalyzer;\n  private config: GitIngestConfig;\n\n  constructor(config?: GitIngestConfig) {\n    this.git = new GitAction();\n    this.scanner = new FileScanner();\n    this.analyzer = new CodeAnalyzer();\n    this.config = {\n      tempDir: \"repo\", // 默认保存仓库的目录名(不会暴露到外部)\n      keepTempFiles: false, // 默认不保留临时文件\n      defaultMaxFileSize: 1024 * 1024, // 默认检索不超过 1MB 的文件\n      defaultPatterns: {\n        include: [\"**/*\"],\n        exclude: [\"**/node_modules/**\", \"**/.git/**\"],\n      },\n      ...config,\n    };\n  }\n\n  // 清理临时目录\n  private async cleanupTempDir(dirPath: string): Promise<void> {\n    try {\n      if (existsSync(dirPath)) {\n        await rm(dirPath, { recursive: true, force: true });\n      }\n    } catch (error) {\n      console.warn(\n        `Warning: Failed to cleanup temporary directory ${dirPath}: ${(error as Error).message\n        }`\n      );\n    }\n  }\n\n  // 检查URL是否使用自定义域名，如果是则转换为原始GitHub URL\n  private transformCustomDomainUrl(url: string): string {\n    if (!this.config.customDomainMap) {\n      return url;\n    }\n\n    const { targetDomain, originalDomain } = this.config.customDomainMap;\n    if (url.includes(targetDomain)) {\n      return url.replace(targetDomain, originalDomain);\n    }\n\n    return url;\n  }\n\n  // 检查URL是否匹配自定义域名\n  private isCustomDomainUrl(url: string): boolean {\n    if (!this.config.customDomainMap) {\n      return false;\n    }\n\n    return url.includes(this.config.customDomainMap.targetDomain);\n  }\n\n  // [核心步骤0]: 开端，根据 url 按需获取仓库代码\n  async analyzeFromUrl(\n    url: string,\n    options?: AnalyzeOptions\n  ): Promise<AnalysisResult> {\n    // 检查是否是自定义域名URL\n    const isCustomDomain = this.isCustomDomainUrl(url);\n    // 转换URL\n    const githubUrl = this.transformCustomDomainUrl(url);\n\n    if (!githubUrl) {\n      throw new ValidationError(\"URL is required\");\n    }\n\n    if (!githubUrl.match(/^https?:\\/\\//)) {\n      throw new ValidationError(\"Invalid URL format\");\n    }\n\n    if (!this.config.tempDir) {\n      throw new ValidationError(\"Temporary directory is required\");\n    }\n\n    // 从URL中提取仓库名\n    const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n    const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n    // 生成唯一标识符（使用时间戳的后6位作为唯一值）\n    const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n    const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n\n    let result: AnalysisResult;\n\n    try {\n      // 确保临时目录存在\n      if (!existsSync(this.config.tempDir)) {\n        await mkdir(this.config.tempDir, { recursive: true });\n      }\n\n      // 克隆仓库\n      await this.git.clone(githubUrl, workDir);\n\n      // 如果指定了分支,切换到对应分支\n      if (options?.branch) {\n        await this.git.checkoutBranch(workDir, options.branch);\n      }\n\n      // [核心步骤一]: 调用扫描目录\n      result = await this.analyzeFromDirectory(workDir, options);\n\n      // 如果不保留临时文件，则清理\n      if (!this.config.keepTempFiles) {\n        await this.cleanupTempDir(workDir);\n      }\n\n      // 如果是自定义域名访问，添加额外信息\n      // if (isCustomDomain) {\n      //   result.summary = `通过自定义域名 ${this.config.customDomainMap?.targetDomain} 访问\\n原始仓库: ${githubUrl}\\n\\n${result.summary}`;\n      // }\n\n      return result;\n    } catch (error) {\n      // 发生错误时也尝试清理临时文件\n      if (!this.config.keepTempFiles) {\n        await this.cleanupTempDir(workDir);\n      }\n\n      if (error instanceof GitIngestError) {\n        throw error;\n      }\n      throw new GitIngestError(\n        `Failed to analyze repository: ${(error as Error).message}`\n      );\n    }\n  }\n\n  // 分析扫描目录\n  async analyzeFromDirectory(\n    dirPath: string,\n    options?: AnalyzeOptions\n  ): Promise<AnalysisResult> {\n    if (!dirPath) {\n      throw new ValidationError(\"Path is required\");\n    }\n\n    if (!existsSync(dirPath)) {\n      throw new ValidationError(`Directory not found: ${dirPath}`);\n    }\n\n    try {\n      const files = await this.scanner.scanDirectory(dirPath, {\n        maxFileSize: options?.maxFileSize || this.config.defaultMaxFileSize,\n        includePatterns:\n          options?.includePatterns || this.config.defaultPatterns?.include,\n        excludePatterns:\n          options?.excludePatterns || this.config.defaultPatterns?.exclude,\n        targetPaths: options?.targetPaths,\n        includeDependencies: true,\n      });\n\n      if (files.length === 0) {\n        throw new ValidationError(\"No files found in the specified directory\");\n      }\n\n      // 重置分析器状态\n      this.analyzer = new CodeAnalyzer();\n\n      // 分析代码并构建索引和知识图谱\n      for (const file of files) {\n        try {\n          // 确保是 TypeScript/JavaScript 文件\n          if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n            // 使用 file.content 而不是重新读取文件\n            const content = file.content;\n            // 使用绝对路径\n            const absolutePath = path.resolve(dirPath, file.path);\n\n            // console.log(`Analyzing file: ${absolutePath}`); // 添加日志\n            this.analyzer.analyzeCode(absolutePath, content);\n          }\n        } catch (error) {\n          console.warn(\n            `Warning: Failed to analyze file ${file.path}: ${(error as Error).message}`\n          );\n        }\n      }\n\n      // 获取分析结果\n      const codeIndex = this.analyzer.getCodeIndex();\n      const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n\n      console.log(`Analysis complete. Found ${codeIndex.size} code elements`); // 添加日志\n\n      return {\n        metadata: {\n          files: files.length,\n          tokens: files.reduce((acc, file) => acc + file.token, 0),\n        },\n        totalCode: files,\n        fileTree: generateTree(files),\n        sizeTree: buildSizeTree(files),\n        codeAnalysis: { codeIndex, knowledgeGraph },\n        dependencyGraph: await analyzeDependencies(dirPath + (options?.miniCommonRoot || ''))\n      };\n    } catch (error) {\n      if (error instanceof GitIngestError) {\n        throw error;\n      }\n      throw new GitIngestError(\n        `Failed to analyze directory: ${(error as Error).message}`\n      );\n    }\n  }\n}\n\n// 导出错误类型\nexport {\n  GitIngestError,\n  ValidationError,\n  GitOperationError,\n} from \"./core/errors\";\n\n// 导出类型定义\nexport type { AnalyzeOptions, AnalysisResult, GitIngestConfig, FileInfo, CodeAnalysis };\n\nexport * from \"./utils/graphSearch\";",
              "token": 2472
          },
          {
              "path": "git-analyze-bZ/src/utils/analyzeDependencies.ts",
              "content": "import { cruise } from \"dependency-cruiser\";\n\n// 根据指定目录分析依赖关系\nexport const analyzeDependencies = async (rootDir: string) => {\n  try {\n    const result = await cruise(\n      [rootDir], // 要分析的目录\n      { // 配置选项\n        exclude: \"node_modules\", // 排除 node_modules\n        outputType: \"json\", // 输出为 JSON 格式\n      }\n    );\n\n    const dependencies = JSON.parse(result.output as string);\n\n    return dependencies;\n  } catch (error) {\n    console.error(\"Error analyzing dependencies:\", error);\n  }\n}\n",
              "token": 193
          }
      ],
      "fileTree": "└── git-analyze-bZ\n    ├── dist\n    │   ├── index.d.ts\n    │   └── index.js\n    └── src\n        ├── core\n        │   ├── codeAnalyzer.ts\n        │   ├── gitAction.ts\n        │   ├── errors.ts\n        │   └── scanner.ts\n        ├── utils\n        │   ├── graphSearch.ts\n        │   ├── index.ts\n        │   └── analyzeDependencies.ts\n        ├── types\n        │   └── index.ts\n        └── index.ts\n",
      "sizeTree": {
          "name": "root",
          "token": 28593,
          "children": {
              "git-analyze-bZ": {
                  "name": "git-analyze-bZ",
                  "token": 28593,
                  "children": {
                      "dist": {
                          "name": "dist",
                          "token": 11812,
                          "children": {
                              "index.d.ts": {
                                  "name": "index.d.ts",
                                  "token": 977,
                                  "content": "interface AnalyzeOptions {\n    maxFileSize?: number;\n    includePatterns?: string[];\n    excludePatterns?: string[];\n    targetPaths?: string[];\n    branch?: string;\n    commit?: string;\n    miniCommonRoot?: string;\n}\ninterface FileInfo {\n    path: string;\n    content: string;\n    token: number;\n}\ninterface AnalysisResult {\n    metadata: {\n        files: number;\n        tokens: number;\n    };\n    fileTree: string;\n    totalCode: {\n        path: string;\n        content: string;\n        token: number;\n    }[];\n    sizeTree: {\n        name: string;\n        token: number;\n        isFile: boolean;\n        children?: {\n            [key: string]: {\n                name: string;\n                token: number;\n                children?: any;\n                isFile: boolean;\n            };\n        };\n    };\n    codeAnalysis: CodeAnalysis;\n    dependencyGraph: any;\n}\ninterface CodeAnalysis {\n    codeIndex: Map<string, any[]>;\n    knowledgeGraph: {\n        nodes: any[];\n        edges: any[];\n    };\n}\ninterface GitIngestConfig {\n    tempDir?: string;\n    defaultMaxFileSize?: number;\n    defaultPatterns?: {\n        include?: string[];\n        exclude?: string[];\n    };\n    keepTempFiles?: boolean;\n    customDomainMap?: {\n        targetDomain: string;\n        originalDomain: string;\n    };\n}\n\ndeclare class GitIngestError extends Error {\n    constructor(message: string);\n}\ndeclare class GitOperationError extends GitIngestError {\n    constructor(operation: string, details: string);\n}\ndeclare class ValidationError extends GitIngestError {\n    constructor(message: string);\n}\n\ninterface KnowledgeNode {\n    id: string;\n    name: string;\n    type: string;\n    filePath: string;\n    location: {\n        file: string;\n        line: number;\n    };\n    description?: string;\n    properties?: Record<string, any>;\n    implementation?: string;\n}\ninterface KnowledgeEdge {\n    source: string;\n    target: string;\n    type: string;\n    properties?: Record<string, any>;\n}\ninterface KnowledgeGraph {\n    nodes: KnowledgeNode[];\n    edges: KnowledgeEdge[];\n}\ninterface SearchOptions {\n    entities: string[];\n    relationTypes?: string[];\n    maxDistance?: number;\n    limit?: number;\n}\ninterface SearchResult {\n    nodes: KnowledgeNode[];\n    edges: KnowledgeEdge[];\n    metadata: {\n        totalNodes: number;\n        totalEdges: number;\n        entities: string[];\n        relationTypes: string[];\n        maxDistance: number;\n    };\n}\n/**\n * 基于实体名称列表搜索关联的知识图谱\n * @param graph 知识图谱\n * @param options 搜索选项\n * @returns 搜索结果\n */\ndeclare function searchKnowledgeGraph(graph: KnowledgeGraph, options: SearchOptions): SearchResult;\n\ndeclare class GitIngest {\n    private git;\n    private scanner;\n    private analyzer;\n    private config;\n    constructor(config?: GitIngestConfig);\n    private cleanupTempDir;\n    private transformCustomDomainUrl;\n    private isCustomDomainUrl;\n    analyzeFromUrl(url: string, options?: AnalyzeOptions): Promise<AnalysisResult>;\n    analyzeFromDirectory(dirPath: string, options?: AnalyzeOptions): Promise<AnalysisResult>;\n}\n\nexport { type AnalysisResult, type AnalyzeOptions, type CodeAnalysis, type FileInfo, GitIngest, type GitIngestConfig, GitIngestError, GitOperationError, type KnowledgeEdge, type KnowledgeGraph, type KnowledgeNode, type SearchOptions, type SearchResult, ValidationError, searchKnowledgeGraph };\n",
                                  "children": {},
                                  "isFile": true
                              },
                              "index.js": {
                                  "name": "index.js",
                                  "token": 10835,
                                  "content": "var __defProp = Object.defineProperty;\nvar __defProps = Object.defineProperties;\nvar __getOwnPropDescs = Object.getOwnPropertyDescriptors;\nvar __getOwnPropSymbols = Object.getOwnPropertySymbols;\nvar __hasOwnProp = Object.prototype.hasOwnProperty;\nvar __propIsEnum = Object.prototype.propertyIsEnumerable;\nvar __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;\nvar __spreadValues = (a, b) => {\n  for (var prop in b || (b = {}))\n    if (__hasOwnProp.call(b, prop))\n      __defNormalProp(a, prop, b[prop]);\n  if (__getOwnPropSymbols)\n    for (var prop of __getOwnPropSymbols(b)) {\n      if (__propIsEnum.call(b, prop))\n        __defNormalProp(a, prop, b[prop]);\n    }\n  return a;\n};\nvar __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));\nvar __async = (__this, __arguments, generator) => {\n  return new Promise((resolve, reject) => {\n    var fulfilled = (value) => {\n      try {\n        step(generator.next(value));\n      } catch (e) {\n        reject(e);\n      }\n    };\n    var rejected = (value) => {\n      try {\n        step(generator.throw(value));\n      } catch (e) {\n        reject(e);\n      }\n    };\n    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);\n    step((generator = generator.apply(__this, __arguments)).next());\n  });\n};\n\n// src/core/gitAction.ts\nimport { simpleGit } from \"simple-git\";\n\n// src/core/errors.ts\nvar GitIngestError = class extends Error {\n  constructor(message) {\n    super(message);\n    this.name = \"GitIngestError\";\n  }\n};\nvar GitOperationError = class extends GitIngestError {\n  constructor(operation, details) {\n    super(`Git operation '${operation}' failed: ${details}`);\n    this.name = \"GitOperationError\";\n  }\n};\nvar FileProcessError = class extends GitIngestError {\n  constructor(path3, reason) {\n    super(`Failed to process file '${path3}': ${reason}`);\n    this.name = \"FileProcessError\";\n  }\n};\nvar ValidationError = class extends GitIngestError {\n  constructor(message) {\n    super(`Validation failed: ${message}`);\n    this.name = \"ValidationError\";\n  }\n};\n\n// src/core/gitAction.ts\nvar GitAction = class {\n  constructor() {\n    this.git = simpleGit({ baseDir: process.cwd() });\n  }\n  clone(url, path3) {\n    return __async(this, null, function* () {\n      try {\n        yield this.git.clone(url, path3);\n      } catch (error) {\n        throw new GitOperationError(\"clone\", error.message);\n      }\n    });\n  }\n  checkoutBranch(path3, branch) {\n    return __async(this, null, function* () {\n      try {\n        const git = simpleGit(path3);\n        yield git.checkout(branch);\n      } catch (error) {\n        throw new GitOperationError(\"checkout\", error.message);\n      }\n    });\n  }\n};\n\n// src/core/scanner.ts\nimport { glob } from \"glob\";\nimport { readFile, stat } from \"fs/promises\";\nimport { dirname, join } from \"path\";\n\n// src/utils/graphSearch.ts\nfunction findRelatedNodes(graph, startNodes, maxDistance) {\n  const relatedNodes = /* @__PURE__ */ new Set();\n  const relatedEdges = /* @__PURE__ */ new Set();\n  const processedNodeIds = /* @__PURE__ */ new Set();\n  function processNode(node, distance) {\n    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n    processedNodeIds.add(node.id);\n    relatedNodes.add(node);\n    const directEdges = graph.edges.filter(\n      (edge) => edge.source === node.id || edge.target === node.id\n    );\n    directEdges.forEach((edge) => {\n      relatedEdges.add(edge);\n      const otherId = edge.source === node.id ? edge.target : edge.source;\n      const otherNode = graph.nodes.find((n) => n.id === otherId);\n      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n        processNode(otherNode, distance + 1);\n      }\n    });\n    if (node.type === \"class\") {\n      const methodNodes = graph.nodes.filter((n) => {\n        if (n.type !== \"function\" && n.type !== \"class_method\") return false;\n        if (n.filePath !== node.filePath) return false;\n        if (n.name === \"constructor\") return false;\n        const classNode = graph.nodes.find(\n          (c) => c.type === \"class\" && c.filePath === n.filePath && c.id === n.id.split(\"#\")[0] + \"#\" + node.name\n        );\n        return classNode !== void 0;\n      });\n      methodNodes.forEach((methodNode) => {\n        if (!processedNodeIds.has(methodNode.id)) {\n          const edge = {\n            source: node.id,\n            target: methodNode.id,\n            type: \"defines\",\n            properties: {}\n          };\n          relatedEdges.add(edge);\n          processNode(methodNode, distance + 1);\n        }\n      });\n    }\n    if (node.type === \"class\" && node.name.endsWith(\"Error\")) {\n      const parentNode = graph.nodes.find((n) => n.name === \"Error\");\n      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n        const edge = {\n          source: node.id,\n          target: \"Error\",\n          type: \"extends\",\n          properties: {}\n        };\n        relatedEdges.add(edge);\n        processNode(parentNode, distance + 1);\n      }\n    }\n  }\n  startNodes.forEach((node) => processNode(node, 0));\n  return {\n    nodes: Array.from(relatedNodes),\n    edges: Array.from(relatedEdges)\n  };\n}\nfunction searchKnowledgeGraph(graph, options) {\n  const { entities, maxDistance = 2 } = options;\n  const startNodes = graph.nodes.filter(\n    (node) => entities.some((entity) => node.name === entity)\n  );\n  if (!startNodes.length) {\n    console.warn(`[Warning] No nodes found for entities:`, entities);\n    return {\n      nodes: [],\n      edges: [],\n      metadata: {\n        totalNodes: 0,\n        totalEdges: 0,\n        entities,\n        relationTypes: [],\n        maxDistance\n      }\n    };\n  }\n  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance);\n  const methodNodes = nodes.filter((n) => n.type === \"function\" || n.type === \"class_method\");\n  const classNodes = nodes.filter((n) => n.type === \"class\");\n  methodNodes.forEach((method) => {\n    const className = method.id.split(\"#\")[1];\n    const relatedClass = classNodes.find((c) => c.name === className);\n    if (relatedClass) {\n      edges.push({\n        source: relatedClass.id,\n        target: method.id,\n        type: \"defines\",\n        properties: {}\n      });\n    }\n  });\n  const errorClasses = classNodes.filter((n) => n.name.endsWith(\"Error\"));\n  errorClasses.forEach((errorClass) => {\n    edges.push({\n      source: errorClass.id,\n      target: \"Error\",\n      type: \"extends\",\n      properties: {}\n    });\n  });\n  return {\n    nodes,\n    edges,\n    metadata: {\n      totalNodes: nodes.length,\n      totalEdges: edges.length,\n      entities,\n      relationTypes: Array.from(new Set(edges.map((e) => e.type))),\n      maxDistance\n    }\n  };\n}\n\n// src/utils/index.ts\nfunction estimateTokens(text) {\n  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n  const otherChars = text.length - chineseChars;\n  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n  return Math.ceil(estimatedTokens * 1.1);\n}\nfunction generateTree(files) {\n  const tree = {};\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = tree;\n    for (const part of parts.slice(0, -1)) {\n      if (!current[part]) {\n        current[part] = {};\n      }\n      current = current[part];\n    }\n    current[parts[parts.length - 1]] = null;\n  }\n  function stringify(node, prefix = \"\") {\n    let result = \"\";\n    const entries = Object.entries(node);\n    for (let i = 0; i < entries.length; i++) {\n      const [key, value] = entries[i];\n      const isLast = i === entries.length - 1;\n      const connector = isLast ? \"\\u2514\\u2500\\u2500 \" : \"\\u251C\\u2500\\u2500 \";\n      const childPrefix = isLast ? \"    \" : \"\\u2502   \";\n      result += prefix + connector + key + \"\\n\";\n      if (value !== null) {\n        result += stringify(value, prefix + childPrefix);\n      }\n    }\n    return result;\n  }\n  return stringify(tree);\n}\nfunction buildSizeTree(files) {\n  const root = {\n    name: \"root\",\n    token: 0,\n    children: {},\n    isFile: false\n  };\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = root;\n    for (let i = 0; i < parts.length; i++) {\n      const part = parts[i];\n      const isLastPart = i === parts.length - 1;\n      if (!current.children[part]) {\n        current.children[part] = __spreadProps(__spreadValues({\n          name: part,\n          token: isLastPart ? file.token : 0\n        }, isLastPart && file.content ? { content: file.content } : {}), {\n          children: {},\n          isFile: isLastPart\n        });\n      }\n      current = current.children[part];\n    }\n  }\n  function calculateSize(node) {\n    if (node.isFile) {\n      return node.token;\n    }\n    let totalToken = 0;\n    for (const child of Object.values(node.children)) {\n      totalToken += calculateSize(child);\n    }\n    node.token = totalToken;\n    return totalToken;\n  }\n  calculateSize(root);\n  return root;\n}\n\n// src/core/scanner.ts\nvar BINARY_FILE_TYPES = [\n  \".jpg\",\n  \".jpeg\",\n  \".png\",\n  \".gif\",\n  \".bmp\",\n  \".pdf\",\n  \".doc\",\n  \".docx\",\n  \".xls\",\n  \".xlsx\",\n  \".zip\",\n  \".rar\",\n  \".7z\",\n  \".tar\",\n  \".gz\",\n  \".exe\",\n  \".dll\",\n  \".so\",\n  \".dylib\",\n  \".svg\",\n  \".ico\",\n  \".webp\",\n  \".mp4\",\n  \".mp3\",\n  \".wav\",\n  \".avi\"\n];\nvar FileScanner = class {\n  constructor() {\n    this.processedFiles = /* @__PURE__ */ new Set();\n  }\n  // 查找模块文件\n  findModuleFile(importPath, currentDir, basePath) {\n    return __async(this, null, function* () {\n      if (!importPath.startsWith(\".\")) {\n        return importPath;\n      }\n      const cleanCurrentDir = currentDir.replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\").replace(new RegExp(`^${basePath}/`), \"\");\n      const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n      const pathParts = resolvedPath.split(\"/\");\n      const fileName = pathParts.pop() || \"\";\n      const dirPath = pathParts.join(\"/\");\n      const getExtensions = (importName) => {\n        if (importName.toLowerCase().endsWith(\".css\")) {\n          return [\".css\", \".less\", \".scss\", \".sass\"];\n        }\n        return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n      };\n      const extensions = getExtensions(fileName);\n      const targetBasePath = join(basePath, dirPath);\n      if (!fileName.includes(\".\")) {\n        for (const ext of extensions) {\n          const fullPath = join(targetBasePath, fileName + ext);\n          try {\n            const stats = yield stat(fullPath);\n            if (stats.isFile()) {\n              return join(dirPath, fileName + ext).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n            }\n          } catch (error) {\n            continue;\n          }\n        }\n        const dirFullPath = join(targetBasePath, fileName);\n        try {\n          const stats = yield stat(dirFullPath);\n          if (stats.isDirectory()) {\n            for (const ext of extensions) {\n              const indexPath = join(dirFullPath, \"index\" + ext);\n              try {\n                const indexStats = yield stat(indexPath);\n                if (indexStats.isFile()) {\n                  return join(dirPath, fileName, \"index\" + ext).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n                }\n              } catch (error) {\n                continue;\n              }\n            }\n          }\n        } catch (error) {\n        }\n      } else {\n        const fullPath = join(targetBasePath, fileName);\n        try {\n          const stats = yield stat(fullPath);\n          if (stats.isFile()) {\n            return join(dirPath, fileName).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n          }\n        } catch (error) {\n        }\n      }\n      return null;\n    });\n  }\n  // [依赖文件按需分析]: 分析依赖文件\n  analyzeDependencies(content, filePath, basePath) {\n    return __async(this, null, function* () {\n      const dependencies = [];\n      const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n      const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n      const lines = contentWithoutComments.split(\"\\n\").filter((line) => {\n        const trimmed = line.trim();\n        return trimmed && !trimmed.startsWith(\"//\");\n      }).join(\"\\n\");\n      let match;\n      while ((match = importRegex.exec(lines)) !== null) {\n        const importPath = match[1];\n        const currentDir = dirname(filePath);\n        const resolvedPath = yield this.findModuleFile(\n          importPath,\n          currentDir,\n          basePath\n        );\n        if (resolvedPath && !dependencies.includes(resolvedPath)) {\n          dependencies.push(resolvedPath);\n        }\n      }\n      return dependencies;\n    });\n  }\n  // 扫描目录\n  scanDirectory(path3, options) {\n    return __async(this, null, function* () {\n      if (!path3) {\n        throw new ValidationError(\"Path is required\");\n      }\n      try {\n        this.processedFiles.clear();\n        const allFiles = [];\n        if (options.targetPaths && options.targetPaths.length > 0) {\n          for (const targetPath of options.targetPaths) {\n            yield this.processFileAndDependencies(\n              path3,\n              targetPath,\n              options,\n              allFiles\n            );\n          }\n          return allFiles;\n        }\n        const files = yield glob(\"**/*\", {\n          cwd: path3,\n          ignore: [\n            ...options.excludePatterns || [],\n            \"**/node_modules/**\",\n            \"**/.git/**\"\n          ],\n          nodir: true,\n          absolute: false,\n          windowsPathsNoEscape: true\n        });\n        const results = yield Promise.all(\n          files.map((file) => this.processFile(path3, file, options))\n        );\n        return results.filter((file) => file !== null);\n      } catch (error) {\n        throw new FileProcessError(path3, error.message);\n      }\n    });\n  }\n  // 扫描目标文件及其依赖文件\n  processFileAndDependencies(basePath, relativePath, options, allFiles) {\n    return __async(this, null, function* () {\n      if (this.processedFiles.has(relativePath)) {\n        return;\n      }\n      const fileInfo = yield this.processFile(basePath, relativePath, options);\n      if (fileInfo) {\n        this.processedFiles.add(relativePath);\n        allFiles.push(fileInfo);\n        if (options.includeDependencies !== false) {\n          const dependencies = yield this.analyzeDependencies(\n            fileInfo.content,\n            relativePath,\n            basePath\n          );\n          for (const dep of dependencies) {\n            yield this.processFileAndDependencies(\n              basePath,\n              dep,\n              options,\n              allFiles\n            );\n          }\n        }\n      }\n    });\n  }\n  // 尝试查找文件\n  tryFindFile(basePath, filePath, options) {\n    return __async(this, null, function* () {\n      try {\n        const stats = yield stat(filePath);\n        if (options.maxFileSize && stats.size > options.maxFileSize) {\n          return null;\n        }\n        const content = yield readFile(filePath, \"utf-8\");\n        const basePathParts = basePath.split(\"/\");\n        const deleteHashRepoName = basePathParts[basePathParts.length - 1].replace(/-[^-]*$/, \"\");\n        const relativePath = filePath.replace(new RegExp(`^${basePathParts[0]}/`), \"\").replace(\n          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n          deleteHashRepoName\n        ).replace(/\\\\/g, \"/\");\n        return {\n          path: relativePath,\n          content,\n          // size: stats.size,\n          token: estimateTokens(content)\n        };\n      } catch (error) {\n        return null;\n      }\n    });\n  }\n  // 扫描文件\n  processFile(basePath, relativePath, options) {\n    return __async(this, null, function* () {\n      try {\n        const ext = relativePath.toLowerCase().split(\".\").pop();\n        if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n          return null;\n        }\n        const normalizedPath = relativePath.replace(/^[\\/\\\\]+/, \"\").replace(/\\\\/g, \"/\");\n        const pathParts = normalizedPath.split(\"/\");\n        const fileName = pathParts.pop() || \"\";\n        const dirPath = pathParts.join(\"/\");\n        const targetBasePath = join(basePath, dirPath);\n        const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n        if (!fileName.includes(\".\")) {\n          for (const ext2 of extensions) {\n            const fullPath = join(targetBasePath, fileName + ext2);\n            const result = yield this.tryFindFile(basePath, fullPath, options);\n            if (result) return result;\n          }\n          const dirFullPath = join(targetBasePath, fileName);\n          for (const ext2 of extensions) {\n            const indexPath = join(dirFullPath, \"index\" + ext2);\n            const result = yield this.tryFindFile(basePath, indexPath, options);\n            if (result) return result;\n          }\n        } else {\n          const fullPath = join(targetBasePath, fileName);\n          const result = yield this.tryFindFile(basePath, fullPath, options);\n          if (result) return result;\n        }\n        return null;\n      } catch (error) {\n        console.warn(`Warning: Failed to process file ${relativePath}: ${error}`);\n        return null;\n      }\n    });\n  }\n};\n\n// src/core/codeAnalyzer.ts\nimport Parser from \"tree-sitter\";\nimport TypeScript from \"tree-sitter-typescript\";\nimport path from \"path\";\nvar CodeAnalyzer = class {\n  constructor() {\n    this.codeElements = [];\n    this.relations = [];\n    this.currentFile = \"\";\n    this.currentClass = null;\n    this.currentFunctionId = null;\n    this.scopeStack = [];\n    this.parser = new Parser();\n    this.parser.setLanguage(TypeScript.typescript);\n  }\n  /**\n   * 分析代码文件\n   */\n  analyzeCode(filePath, sourceCode) {\n    if (!filePath) {\n      throw new Error(\"File path cannot be undefined\");\n    }\n    this.currentFile = filePath;\n    try {\n      const tree = this.parser.parse(sourceCode);\n      this.visitNode(tree.rootNode);\n    } catch (error) {\n      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n    }\n  }\n  /**\n   * 访问 AST 节点\n   */\n  visitNode(node) {\n    switch (node.type) {\n      case \"function_declaration\":\n      case \"method_definition\":\n      // 添加方法定义\n      case \"arrow_function\":\n        this.analyzeFunctionDeclaration(node);\n        break;\n      case \"class_declaration\":\n      case \"class\":\n        this.analyzeClassDeclaration(node, this.currentFile);\n        break;\n      case \"interface_declaration\":\n        this.analyzeInterface(node);\n        break;\n      case \"type_alias_declaration\":\n        this.analyzeTypeAlias(node);\n        break;\n      case \"call_expression\":\n      case \"new_expression\":\n        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n        break;\n      case \"import_declaration\":\n      case \"import_statement\":\n        this.analyzeImportStatement(node, this.currentFile);\n        break;\n      case \"variable_declaration\":\n        this.analyzeVariableDeclaration(node);\n        break;\n      case \"implements_clause\":\n        this.analyzeImplementsRelation(node);\n        break;\n    }\n    for (const child of node.children) {\n      this.visitNode(child);\n    }\n  }\n  /**\n   * 分析函数声明\n   */\n  analyzeFunctionDeclaration(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"function\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n    this.scopeStack.push(this.currentFunctionId);\n    this.addCodeElement(element);\n    this.currentFunctionId = null;\n  }\n  /**\n   * 分析类声明\n   */\n  analyzeClassDeclaration(node, filePath) {\n    const className = this.getNodeName(node);\n    if (!className) return;\n    const classElement = {\n      type: \"class\",\n      name: className,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.addCodeElement(classElement);\n    this.currentClass = className;\n    const extendsClause = node.childForFieldName(\"extends\");\n    if (extendsClause) {\n      const superClassName = this.getNodeName(extendsClause);\n      if (superClassName) {\n        const currentClassId = `${this.currentFile}#${className}`;\n        const superClassId = this.resolveTypeReference(superClassName);\n        if (superClassId) {\n          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n          this.addRelation(currentClassId, superClassId, \"extends\");\n        }\n      }\n    }\n    for (const child of node.children) {\n      if (child.type === \"method_definition\" || child.type === \"constructor\") {\n        this.analyzeClassMethod(child, className);\n      }\n    }\n    const implementsClause = node.childForFieldName(\"implements\");\n    if (implementsClause) {\n      this.analyzeImplementsRelation(implementsClause);\n    }\n    this.currentClass = null;\n  }\n  /**\n   * 分析接口声明\n   */\n  analyzeInterface(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"interface\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      id: `${this.currentFile}#Interface#${nameNode.text}`,\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }\n  /**\n   * 分析函数调用\n   */\n  analyzeCallExpression(node, currentScope) {\n    const calleeName = this.resolveCallee(node);\n    if (calleeName) {\n      const currentNode = this.codeElements.find((e) => e.id === currentScope);\n      const calleeNode = this.codeElements.find((e) => e.id === calleeName);\n      if (currentNode && calleeNode) {\n        this.addRelation(currentScope, calleeName, \"calls\");\n      }\n    }\n  }\n  /**\n   * 分析导入声明\n   */\n  analyzeImportStatement(node, filePath) {\n    const importPath = this.getImportPath(node);\n    if (importPath) {\n      this.addRelation(filePath, importPath, \"imports\");\n    }\n  }\n  normalizePath(importPath) {\n    const builtinModules = [\"fs\", \"path\", \"crypto\", \"util\"];\n    if (builtinModules.includes(importPath)) {\n      return importPath;\n    }\n    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n    if (!fullPath.endsWith(\".ts\")) {\n      return `${fullPath}.ts`;\n    }\n    return fullPath;\n  }\n  /**\n   * 添加代码元素\n   */\n  addCodeElement(element) {\n    const elementId = (() => {\n      switch (element.type) {\n        case \"class\":\n          return `${element.filePath}#${element.name}`;\n        case \"class_method\":\n        case \"constructor\":\n          return `${element.filePath}#${element.className}#${element.name}`;\n        case \"interface\":\n          return `${element.filePath}#Interface#${element.name}`;\n        case \"type_alias\":\n          return `${element.filePath}#Type#${element.name}`;\n        default:\n          return `${element.filePath}#${element.name}`;\n      }\n    })();\n    const codeElement = __spreadProps(__spreadValues({}, element), {\n      id: elementId\n    });\n    this.codeElements.push(codeElement);\n  }\n  /**\n   * 添加关系\n   */\n  addRelation(source, target, type) {\n    const sourceNode = this.codeElements.find((e) => e.id === source);\n    const targetNode = this.codeElements.find((e) => e.id === target);\n    if (!sourceNode) {\n      return;\n    }\n    if (!targetNode) {\n      return;\n    }\n    const relation = {\n      sourceId: source,\n      targetId: target,\n      type\n    };\n    const exists = this.relations.some(\n      (r) => r.sourceId === source && r.targetId === target && r.type === type\n    );\n    if (!exists) {\n      this.relations.push(relation);\n    }\n  }\n  /**\n   * 获取代码索引\n   */\n  getCodeIndex() {\n    const codeIndex = /* @__PURE__ */ new Map();\n    this.codeElements.forEach((element) => {\n      const filePath = element.filePath;\n      const existingElements = codeIndex.get(filePath) || [];\n      existingElements.push(element);\n      codeIndex.set(filePath, existingElements);\n    });\n    return codeIndex;\n  }\n  /**\n   * 获取知识图谱\n   */\n  getKnowledgeGraph() {\n    console.log(`[Debug] Generating knowledge graph:`, {\n      totalElements: this.codeElements.length,\n      totalRelations: this.relations.length\n    });\n    const nodes = this.codeElements.map((element) => ({\n      id: element.id,\n      name: element.name,\n      type: element.type,\n      filePath: element.filePath,\n      location: element.location,\n      implementation: element.implementation || \"\"\n      // 添加 implementation 字段\n    }));\n    const validRelations = this.relations.filter((relation) => {\n      const sourceExists = this.codeElements.some((e) => e.id === relation.sourceId);\n      const targetExists = this.codeElements.some((e) => e.id === relation.targetId);\n      if (!sourceExists || !targetExists) {\n        console.warn(`[Warning] Invalid relation:`, {\n          source: relation.sourceId,\n          target: relation.targetId,\n          type: relation.type,\n          sourceExists,\n          targetExists\n        });\n        return false;\n      }\n      return true;\n    });\n    const edges = validRelations.map((relation) => ({\n      source: relation.sourceId,\n      target: relation.targetId,\n      type: relation.type,\n      properties: {}\n    }));\n    console.log(`[Debug] Knowledge graph generated:`, {\n      nodes: nodes.length,\n      edges: edges.length,\n      relationTypes: new Set(edges.map((e) => e.type))\n    });\n    return { nodes, edges };\n  }\n  /**\n   * 获取特定类型的所有元素\n   */\n  getElementsByType(type) {\n    return this.codeElements.filter((element) => element.type === type);\n  }\n  /**\n   * 获取特定元素的所有关系\n   */\n  getElementRelations(elementName) {\n    return this.relations.filter(\n      (edge) => edge.sourceId === elementName || edge.targetId === elementName\n    );\n  }\n  /**\n   * 导出分析结果\n   */\n  exportAnalysis() {\n    return JSON.stringify({\n      codeElements: this.codeElements,\n      relations: this.relations\n    }, null, 2);\n  }\n  // 添加变量声明分析\n  analyzeVariableDeclaration(node) {\n    const declarator = node.childForFieldName(\"declarator\");\n    const nameNode = declarator == null ? void 0 : declarator.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"variable\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }\n  validateAnalysis() {\n    let isValid = true;\n    const idSet = /* @__PURE__ */ new Set();\n    this.codeElements.forEach((node) => {\n      if (node.id && idSet.has(node.id)) {\n        console.error(`[Validation] \\u91CD\\u590D\\u8282\\u70B9ID: ${node.id}`);\n        isValid = false;\n      }\n      if (node.id) {\n        idSet.add(node.id);\n      }\n    });\n    this.relations.forEach((edge) => {\n      const sourceExists = this.codeElements.some((e) => e.id === edge.sourceId);\n      const targetExists = this.codeElements.some((e) => e.id === edge.targetId);\n      if (!sourceExists) {\n        console.error(`[Validation] \\u65E0\\u6548\\u5173\\u7CFB\\u6E90: ${edge.sourceId}`);\n        isValid = false;\n      }\n      if (!targetExists) {\n        console.error(`[Validation] \\u65E0\\u6548\\u5173\\u7CFB\\u76EE\\u6807: ${edge.targetId}`);\n        isValid = false;\n      }\n    });\n    return isValid;\n  }\n  getNodeName(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    return nameNode == null ? void 0 : nameNode.text;\n  }\n  getImplementedInterfaces(node) {\n    return node.text.replace(\"implements \", \"\").split(\",\").map((s) => s.trim());\n  }\n  analyzeClassMethod(node, className) {\n    const isConstructor = node.type === \"constructor\";\n    const methodNameNode = isConstructor ? node.childForFieldName(\"name\") : node.childForFieldName(\"name\");\n    const methodName = (methodNameNode == null ? void 0 : methodNameNode.text) || \"anonymous\";\n    const element = {\n      type: isConstructor ? \"constructor\" : \"class_method\",\n      name: methodName,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      className\n    };\n    this.addCodeElement(element);\n    const classId = `${this.currentFile}#${className}`;\n    const methodId = `${this.currentFile}#${className}#${methodName}`;\n    console.log(`[Debug] Adding class method relation:`, {\n      class: className,\n      method: methodName,\n      classId,\n      methodId,\n      type: element.type\n    });\n    this.addRelation(classId, methodId, \"defines\");\n  }\n  // 添加一个辅助方法来验证关系\n  validateMethodRelation(classId, methodId) {\n    const classNode = this.codeElements.find((e) => e.id === classId);\n    const methodNode = this.codeElements.find((e) => e.id === methodId);\n    if (!classNode) {\n      console.error(`[Error] Class node not found: ${classId}`);\n      return false;\n    }\n    if (!methodNode) {\n      console.error(`[Error] Method node not found: ${methodId}`);\n      return false;\n    }\n    console.log(`[Debug] Validated method relation:`, {\n      class: classNode.name,\n      method: methodNode.name,\n      classId,\n      methodId\n    });\n    return true;\n  }\n  analyzeImplementsRelation(node) {\n    const interfaces = this.getImplementedInterfaces(node);\n    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n    interfaces.forEach((interfaceName) => {\n      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n      if (interfaceId) {\n        this.addRelation(currentClassId, interfaceId, \"implements\");\n      }\n    });\n  }\n  analyzeTypeAlias(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"type_alias\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      }\n    };\n    this.addCodeElement(element);\n  }\n  resolveCallee(node) {\n    const calleeNode = node.childForFieldName(\"function\");\n    if (!calleeNode) return void 0;\n    const calleeName = calleeNode.text;\n    const calleeClass = this.currentClass;\n    const possibleIds = [\n      `${this.currentFile}#${calleeName}`,\n      // 普通函数\n      `${this.currentFile}#${calleeClass}#${calleeName}`,\n      // 类方法\n      `${this.currentFile}#${calleeClass}#constructor`\n      // 构造函数\n    ];\n    for (const id of possibleIds) {\n      const element = this.codeElements.find((e) => e.id === id);\n      if (element) return id;\n    }\n    return void 0;\n  }\n  getImportPath(node) {\n    const moduleNode = node.childForFieldName(\"source\");\n    if (!moduleNode) return \"\";\n    return moduleNode.text.replace(/['\"]/g, \"\");\n  }\n  resolveTypeReference(typeName) {\n    const element = this.codeElements.find((e) => e.name === typeName);\n    return element == null ? void 0 : element.id;\n  }\n};\n\n// src/index.ts\nimport path2 from \"path\";\nimport { mkdir, rm } from \"fs/promises\";\nimport { existsSync } from \"fs\";\nimport crypto from \"crypto\";\n\n// src/utils/analyzeDependencies.ts\nimport { cruise } from \"dependency-cruiser\";\nvar analyzeDependencies = (rootDir) => __async(void 0, null, function* () {\n  try {\n    const result = yield cruise(\n      [rootDir],\n      // 要分析的目录\n      {\n        // 配置选项\n        exclude: \"node_modules\",\n        // 排除 node_modules\n        outputType: \"json\"\n        // 输出为 JSON 格式\n      }\n    );\n    const dependencies = JSON.parse(result.output);\n    return dependencies;\n  } catch (error) {\n    console.error(\"Error analyzing dependencies:\", error);\n  }\n});\n\n// src/index.ts\nvar GitIngest = class {\n  constructor(config) {\n    this.git = new GitAction();\n    this.scanner = new FileScanner();\n    this.analyzer = new CodeAnalyzer();\n    this.config = __spreadValues({\n      tempDir: \"repo\",\n      // 默认保存仓库的目录名(不会暴露到外部)\n      keepTempFiles: false,\n      // 默认不保留临时文件\n      defaultMaxFileSize: 1024 * 1024,\n      // 默认检索不超过 1MB 的文件\n      defaultPatterns: {\n        include: [\"**/*\"],\n        exclude: [\"**/node_modules/**\", \"**/.git/**\"]\n      }\n    }, config);\n  }\n  // 清理临时目录\n  cleanupTempDir(dirPath) {\n    return __async(this, null, function* () {\n      try {\n        if (existsSync(dirPath)) {\n          yield rm(dirPath, { recursive: true, force: true });\n        }\n      } catch (error) {\n        console.warn(\n          `Warning: Failed to cleanup temporary directory ${dirPath}: ${error.message}`\n        );\n      }\n    });\n  }\n  // 检查URL是否使用自定义域名，如果是则转换为原始GitHub URL\n  transformCustomDomainUrl(url) {\n    if (!this.config.customDomainMap) {\n      return url;\n    }\n    const { targetDomain, originalDomain } = this.config.customDomainMap;\n    if (url.includes(targetDomain)) {\n      return url.replace(targetDomain, originalDomain);\n    }\n    return url;\n  }\n  // 检查URL是否匹配自定义域名\n  isCustomDomainUrl(url) {\n    if (!this.config.customDomainMap) {\n      return false;\n    }\n    return url.includes(this.config.customDomainMap.targetDomain);\n  }\n  // [核心步骤0]: 开端，根据 url 按需获取仓库代码\n  analyzeFromUrl(url, options) {\n    return __async(this, null, function* () {\n      const isCustomDomain = this.isCustomDomainUrl(url);\n      const githubUrl = this.transformCustomDomainUrl(url);\n      if (!githubUrl) {\n        throw new ValidationError(\"URL is required\");\n      }\n      if (!githubUrl.match(/^https?:\\/\\//)) {\n        throw new ValidationError(\"Invalid URL format\");\n      }\n      if (!this.config.tempDir) {\n        throw new ValidationError(\"Temporary directory is required\");\n      }\n      const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n      const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n      const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n      const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n      let result;\n      try {\n        if (!existsSync(this.config.tempDir)) {\n          yield mkdir(this.config.tempDir, { recursive: true });\n        }\n        yield this.git.clone(githubUrl, workDir);\n        if (options == null ? void 0 : options.branch) {\n          yield this.git.checkoutBranch(workDir, options.branch);\n        }\n        result = yield this.analyzeFromDirectory(workDir, options);\n        if (!this.config.keepTempFiles) {\n          yield this.cleanupTempDir(workDir);\n        }\n        return result;\n      } catch (error) {\n        if (!this.config.keepTempFiles) {\n          yield this.cleanupTempDir(workDir);\n        }\n        if (error instanceof GitIngestError) {\n          throw error;\n        }\n        throw new GitIngestError(\n          `Failed to analyze repository: ${error.message}`\n        );\n      }\n    });\n  }\n  // 分析扫描目录\n  analyzeFromDirectory(dirPath, options) {\n    return __async(this, null, function* () {\n      var _a, _b;\n      if (!dirPath) {\n        throw new ValidationError(\"Path is required\");\n      }\n      if (!existsSync(dirPath)) {\n        throw new ValidationError(`Directory not found: ${dirPath}`);\n      }\n      try {\n        const files = yield this.scanner.scanDirectory(dirPath, {\n          maxFileSize: (options == null ? void 0 : options.maxFileSize) || this.config.defaultMaxFileSize,\n          includePatterns: (options == null ? void 0 : options.includePatterns) || ((_a = this.config.defaultPatterns) == null ? void 0 : _a.include),\n          excludePatterns: (options == null ? void 0 : options.excludePatterns) || ((_b = this.config.defaultPatterns) == null ? void 0 : _b.exclude),\n          targetPaths: options == null ? void 0 : options.targetPaths,\n          includeDependencies: true\n        });\n        if (files.length === 0) {\n          throw new ValidationError(\"No files found in the specified directory\");\n        }\n        this.analyzer = new CodeAnalyzer();\n        for (const file of files) {\n          try {\n            if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n              const content = file.content;\n              const absolutePath = path2.resolve(dirPath, file.path);\n              this.analyzer.analyzeCode(absolutePath, content);\n            }\n          } catch (error) {\n            console.warn(\n              `Warning: Failed to analyze file ${file.path}: ${error.message}`\n            );\n          }\n        }\n        const codeIndex = this.analyzer.getCodeIndex();\n        const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n        console.log(`Analysis complete. Found ${codeIndex.size} code elements`);\n        return {\n          metadata: {\n            files: files.length,\n            tokens: files.reduce((acc, file) => acc + file.token, 0)\n          },\n          totalCode: files,\n          fileTree: generateTree(files),\n          sizeTree: buildSizeTree(files),\n          codeAnalysis: { codeIndex, knowledgeGraph },\n          dependencyGraph: yield analyzeDependencies(dirPath + ((options == null ? void 0 : options.miniCommonRoot) || \"\"))\n        };\n      } catch (error) {\n        if (error instanceof GitIngestError) {\n          throw error;\n        }\n        throw new GitIngestError(\n          `Failed to analyze directory: ${error.message}`\n        );\n      }\n    });\n  }\n};\nexport {\n  GitIngest,\n  GitIngestError,\n  GitOperationError,\n  ValidationError,\n  searchKnowledgeGraph\n};\n",
                                  "children": {},
                                  "isFile": true
                              }
                          },
                          "isFile": false
                      },
                      "src": {
                          "name": "src",
                          "token": 16781,
                          "children": {
                              "core": {
                                  "name": "core",
                                  "token": 10390,
                                  "children": {
                                      "codeAnalyzer.ts": {
                                          "name": "codeAnalyzer.ts",
                                          "token": 5635,
                                          "content": "import Parser from 'tree-sitter';\nimport TypeScript from 'tree-sitter-typescript';\nimport path from 'path';\nimport fs from 'fs';\n// 导入知识图谱相关接口\nimport { KnowledgeNode, KnowledgeEdge, KnowledgeGraph as IKnowledgeGraph } from '../utils/graphSearch';\n\n// 代码元素类型定义\ntype ElementType =\n  | 'function'\n  | 'class'\n  | 'interface'\n  | 'variable'\n  | 'import'\n  | 'constructor'\n  | 'class_method'\n  | 'type_alias';\n\n// 代码元素接口\ninterface CodeElement {\n  id?: string;\n  type: ElementType;\n  name: string;\n  filePath: string;\n  className?: string;\n  location: {\n    file: string;\n    line: number;\n  };\n  implementation?: string;\n}\n\n// 代码关系类型\nexport type RelationType =\n  | 'calls'      // 函数调用关系\n  | 'imports'    // 导入关系\n  | 'extends'    // 继承关系\n  | 'implements' // 接口实现关系\n  | 'defines';   // 定义关系\n\n// 代码关系接口\nexport interface CodeRelation {\n  sourceId: string;\n  targetId: string;\n  type: RelationType;\n}\n\n// 修改知识图谱接口名称以避免冲突\ninterface KnowledgeGraph extends IKnowledgeGraph {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}\n\nexport class CodeAnalyzer {\n  private parser: Parser;\n  private codeElements: CodeElement[] = [];\n  private relations: CodeRelation[] = [];\n  private currentFile: string = '';\n  private currentClass: string | null = null;\n  private currentFunctionId: string | null = null;\n  private scopeStack: string[] = [];\n\n  constructor() {\n    this.parser = new Parser();\n    this.parser.setLanguage(TypeScript.typescript as any);\n  }\n\n  /**\n   * 分析代码文件\n   */\n  public analyzeCode(filePath: string, sourceCode: string): void {\n    if (!filePath) {\n      throw new Error('File path cannot be undefined');\n    }\n    this.currentFile = filePath;\n    try {\n      // console.log(`[CodeAnalyzer] Processing file: ${filePath}`);\n\n      const tree = this.parser.parse(sourceCode);\n      // console.log(`[CodeAnalyzer] AST generated for ${filePath}`);\n\n      this.visitNode(tree.rootNode);\n\n      // console.log(`[CodeAnalyzer] Analysis complete for ${filePath}`);\n      // console.log(`[CodeAnalyzer] Found ${this.codeElements.length} nodes`);\n      // console.log(`[CodeAnalyzer] Found ${this.relations.length} relationships`);\n    } catch (error) {\n      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n    }\n  }\n\n  /**\n   * 访问 AST 节点\n   */\n  private visitNode(node: Parser.SyntaxNode): void {\n    // 添加更多节点类型匹配\n    switch (node.type) {\n      case 'function_declaration':\n      case 'method_definition':  // 添加方法定义\n      case 'arrow_function':     // 添加箭头函数\n        this.analyzeFunctionDeclaration(node);\n        break;\n\n      case 'class_declaration':\n      case 'class':             // 添加类表达式\n        this.analyzeClassDeclaration(node, this.currentFile);\n        break;\n\n      case 'interface_declaration':\n        this.analyzeInterface(node);\n        break;\n\n      case 'type_alias_declaration':  // 添加类型别名\n        this.analyzeTypeAlias(node);\n        break;\n\n      case 'call_expression':\n      case 'new_expression':    // 添加 new 表达式\n        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n        break;\n\n      case 'import_declaration':\n      case 'import_statement':\n        this.analyzeImportStatement(node, this.currentFile);\n        break;\n\n      case 'variable_declaration':    // 添加变量声明\n        this.analyzeVariableDeclaration(node);\n        break;\n\n      case 'implements_clause':\n        this.analyzeImplementsRelation(node);\n        break;\n    }\n\n    // 递归访问子节点\n    for (const child of node.children) {\n      this.visitNode(child);\n    }\n  }\n\n  /**\n   * 分析函数声明\n   */\n  private analyzeFunctionDeclaration(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'function',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    // 设置当前函数上下文\n    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n    this.scopeStack.push(this.currentFunctionId);  // 使用栈维护嵌套调用\n    this.addCodeElement(element);\n    this.currentFunctionId = null; // 重置上下文\n  }\n\n  /**\n   * 分析类声明\n   */\n  private analyzeClassDeclaration(node: Parser.SyntaxNode, filePath: string): void {\n    const className = this.getNodeName(node);\n    if (!className) return;\n\n    // 1. 添加类定义\n    const classElement: CodeElement = {\n      type: 'class',\n      name: className,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    this.addCodeElement(classElement);\n    this.currentClass = className;\n\n    // 2. 分析继承关系\n    const extendsClause = node.childForFieldName('extends');\n    if (extendsClause) {\n      const superClassName = this.getNodeName(extendsClause);\n      if (superClassName) {\n        const currentClassId = `${this.currentFile}#${className}`;\n        const superClassId = this.resolveTypeReference(superClassName);\n        if (superClassId) {\n          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n          this.addRelation(currentClassId, superClassId, 'extends');\n        }\n      }\n    }\n\n    // 3. 分析类的方法\n    for (const child of node.children) {\n      if (child.type === 'method_definition' || child.type === 'constructor') {\n        this.analyzeClassMethod(child, className);\n      }\n    }\n\n    // 4. 分析接口实现\n    const implementsClause = node.childForFieldName('implements');\n    if (implementsClause) {\n      this.analyzeImplementsRelation(implementsClause);\n    }\n\n    this.currentClass = null;\n  }\n\n  /**\n   * 分析接口声明\n   */\n  private analyzeInterface(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'interface',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      id: `${this.currentFile}#Interface#${nameNode.text}`,\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }\n\n  /**\n   * 分析函数调用\n   */\n  private analyzeCallExpression(node: Parser.SyntaxNode, currentScope: string) {\n    const calleeName = this.resolveCallee(node);\n    if (calleeName) {\n      const currentNode = this.codeElements.find(e => e.id === currentScope);\n      const calleeNode = this.codeElements.find(e => e.id === calleeName);\n\n      if (currentNode && calleeNode) {\n        // console.log(`[Debug] Found call expression:`, {\n        //   caller: currentNode.name,\n        //   callee: calleeNode.name,\n        //   callerId: currentScope,\n        //   calleeId: calleeName\n        // });\n        this.addRelation(currentScope, calleeName, 'calls');\n      }\n    }\n  }\n\n  /**\n   * 分析导入声明\n   */\n  private analyzeImportStatement(node: Parser.SyntaxNode, filePath: string) {\n    const importPath = this.getImportPath(node);\n    if (importPath) {\n      // console.log(`[Debug] Found import:`, {\n      //   importer: filePath,\n      //   imported: importPath\n      // });\n      this.addRelation(filePath, importPath, 'imports');\n    }\n  }\n\n  private normalizePath(importPath: string): string {\n    // 内置模块列表\n    const builtinModules = ['fs', 'path', 'crypto', 'util'];\n\n    if (builtinModules.includes(importPath)) {\n      return importPath;\n    }\n\n    // 将相对路径转换为绝对路径\n    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n\n    // 确保路径以 .ts 结尾\n    if (!fullPath.endsWith('.ts')) {\n      return `${fullPath}.ts`;\n    }\n\n    return fullPath;\n  }\n\n  /**\n   * 添加代码元素\n   */\n  private addCodeElement(element: Omit<CodeElement, 'id'>): void {\n    const elementId = (() => {\n      switch (element.type) {\n        case 'class':\n          return `${element.filePath}#${element.name}`;\n        case 'class_method':\n        case 'constructor':\n          return `${element.filePath}#${element.className}#${element.name}`;\n        case 'interface':\n          return `${element.filePath}#Interface#${element.name}`;\n        case 'type_alias':\n          return `${element.filePath}#Type#${element.name}`;\n        default:\n          return `${element.filePath}#${element.name}`;\n      }\n    })();\n\n    const codeElement: CodeElement = {\n      ...element,\n      id: elementId\n    };\n\n    // console.log(`[Debug] Adding code element:`, {\n    //   type: element.type,\n    //   name: element.name,\n    //   id: elementId,\n    //   className: 'className' in element ? element.className : undefined\n    // });\n\n    this.codeElements.push(codeElement);\n  }\n\n  /**\n   * 添加关系\n   */\n  private addRelation(source: string, target: string, type: RelationType): void {\n    // 检查源节点和目标节点是否存在\n    const sourceNode = this.codeElements.find(e => e.id === source);\n    const targetNode = this.codeElements.find(e => e.id === target);\n\n    if (!sourceNode) {\n      // console.warn(`[Warning] Source node not found: ${source}`);\n      return;\n    }\n    if (!targetNode) {\n      // console.warn(`[Warning] Target node not found: ${target}`);\n      return;\n    }\n\n    const relation: CodeRelation = {\n      sourceId: source,\n      targetId: target,\n      type\n    };\n\n    // 检查是否已存在相同的关系\n    const exists = this.relations.some(r =>\n      r.sourceId === source &&\n      r.targetId === target &&\n      r.type === type\n    );\n\n    if (!exists) {\n      this.relations.push(relation);\n      // console.log(`[Debug] Added relation: ${sourceNode.name} -[${type}]-> ${targetNode.name}`);\n    }\n  }\n\n  /**\n   * 获取代码索引\n   */\n  public getCodeIndex(): Map<string, CodeElement[]> {\n    const codeIndex = new Map<string, CodeElement[]>();\n    this.codeElements.forEach(element => {\n      const filePath = element.filePath;\n      const existingElements = codeIndex.get(filePath) || [];\n      existingElements.push(element);\n      codeIndex.set(filePath, existingElements);\n    });\n    return codeIndex;\n  }\n\n  /**\n   * 获取知识图谱\n   */\n  public getKnowledgeGraph(): KnowledgeGraph {\n    console.log(`[Debug] Generating knowledge graph:`, {\n      totalElements: this.codeElements.length,\n      totalRelations: this.relations.length\n    });\n\n    // 1. 先转换节点,添加 implementation 字段\n    const nodes: KnowledgeNode[] = this.codeElements.map(element => ({\n      id: element.id!,\n      name: element.name,\n      type: element.type,\n      filePath: element.filePath,\n      location: element.location,\n      implementation: element.implementation || '' // 添加 implementation 字段\n    }));\n\n    // 2. 验证所有关系\n    const validRelations = this.relations.filter(relation => {\n      const sourceExists = this.codeElements.some(e => e.id === relation.sourceId);\n      const targetExists = this.codeElements.some(e => e.id === relation.targetId);\n\n      if (!sourceExists || !targetExists) {\n        console.warn(`[Warning] Invalid relation:`, {\n          source: relation.sourceId,\n          target: relation.targetId,\n          type: relation.type,\n          sourceExists,\n          targetExists\n        });\n        return false;\n      }\n      return true;\n    });\n\n    // 3. 转换关系\n    const edges: KnowledgeEdge[] = validRelations.map(relation => ({\n      source: relation.sourceId,\n      target: relation.targetId,\n      type: relation.type,\n      properties: {}\n    }));\n\n    console.log(`[Debug] Knowledge graph generated:`, {\n      nodes: nodes.length,\n      edges: edges.length,\n      relationTypes: new Set(edges.map(e => e.type))\n    });\n\n    return { nodes, edges };\n  }\n\n  /**\n   * 获取特定类型的所有元素\n   */\n  public getElementsByType(type: ElementType): CodeElement[] {\n    return this.codeElements.filter(element => element.type === type);\n  }\n\n  /**\n   * 获取特定元素的所有关系\n   */\n  public getElementRelations(elementName: string): CodeRelation[] {\n    return this.relations.filter(\n      edge => edge.sourceId === elementName || edge.targetId === elementName\n    );\n  }\n\n  /**\n   * 导出分析结果\n   */\n  public exportAnalysis(): string {\n    return JSON.stringify({\n      codeElements: this.codeElements,\n      relations: this.relations\n    }, null, 2);\n  }\n\n  // 添加变量声明分析\n  private analyzeVariableDeclaration(node: Parser.SyntaxNode): void {\n    const declarator = node.childForFieldName('declarator');\n    const nameNode = declarator?.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'variable',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    this.addCodeElement(element);\n  }\n\n  public validateAnalysis(): boolean {\n    let isValid = true;\n\n    // 唯一性检查\n    const idSet = new Set<string>();\n    this.codeElements.forEach(node => {\n      if (node.id && idSet.has(node.id)) {\n        console.error(`[Validation] 重复节点ID: ${node.id}`);\n        isValid = false;\n      }\n      if (node.id) {\n        idSet.add(node.id);\n      }\n    });\n\n    // 关系有效性检查\n    this.relations.forEach(edge => {\n      const sourceExists = this.codeElements.some(e => e.id === edge.sourceId);\n      const targetExists = this.codeElements.some(e => e.id === edge.targetId);\n\n      if (!sourceExists) {\n        console.error(`[Validation] 无效关系源: ${edge.sourceId}`);\n        isValid = false;\n      }\n      if (!targetExists) {\n        console.error(`[Validation] 无效关系目标: ${edge.targetId}`);\n        isValid = false;\n      }\n    });\n\n    return isValid;\n  }\n\n  private getNodeName(node: Parser.SyntaxNode): string | undefined {\n    const nameNode = node.childForFieldName('name');\n    return nameNode?.text;\n  }\n\n  private getImplementedInterfaces(node: Parser.SyntaxNode): string[] {\n    return node.text.replace('implements ', '').split(',').map(s => s.trim());\n  }\n\n  private analyzeClassMethod(node: Parser.SyntaxNode, className: string): void {\n    const isConstructor = node.type === 'constructor';\n    const methodNameNode = isConstructor\n      ? node.childForFieldName('name')\n      : node.childForFieldName('name');\n\n    const methodName = methodNameNode?.text || 'anonymous';\n\n    // 1. 添加方法定义\n    const element: CodeElement = {\n      type: isConstructor ? 'constructor' : 'class_method',\n      name: methodName,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      className\n    };\n\n    this.addCodeElement(element);\n\n    // 2. 添加类定义方法的关系\n    const classId = `${this.currentFile}#${className}`;\n    const methodId = `${this.currentFile}#${className}#${methodName}`;\n\n    console.log(`[Debug] Adding class method relation:`, {\n      class: className,\n      method: methodName,\n      classId,\n      methodId,\n      type: element.type\n    });\n\n    this.addRelation(classId, methodId, 'defines');\n  }\n\n  // 添加一个辅助方法来验证关系\n  private validateMethodRelation(classId: string, methodId: string): boolean {\n    const classNode = this.codeElements.find(e => e.id === classId);\n    const methodNode = this.codeElements.find(e => e.id === methodId);\n\n    if (!classNode) {\n      console.error(`[Error] Class node not found: ${classId}`);\n      return false;\n    }\n    if (!methodNode) {\n      console.error(`[Error] Method node not found: ${methodId}`);\n      return false;\n    }\n\n    console.log(`[Debug] Validated method relation:`, {\n      class: classNode.name,\n      method: methodNode.name,\n      classId,\n      methodId\n    });\n\n    return true;\n  }\n\n  private analyzeImplementsRelation(node: Parser.SyntaxNode): void {\n    const interfaces = this.getImplementedInterfaces(node);\n    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n\n    interfaces.forEach(interfaceName => {\n      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n      if (interfaceId) {\n        this.addRelation(currentClassId, interfaceId, 'implements');\n      }\n    });\n  }\n\n  private analyzeTypeAlias(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'type_alias',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      }\n    };\n    this.addCodeElement(element);\n  }\n\n  private resolveCallee(node: Parser.SyntaxNode): string | undefined {\n    const calleeNode = node.childForFieldName('function');\n    if (!calleeNode) return undefined;\n\n    // 通过完整路径查找元素\n    const calleeName = calleeNode.text;\n    const calleeClass = this.currentClass;\n\n    // 构建可能的ID格式\n    const possibleIds = [\n      `${this.currentFile}#${calleeName}`,                    // 普通函数\n      `${this.currentFile}#${calleeClass}#${calleeName}`,    // 类方法\n      `${this.currentFile}#${calleeClass}#constructor`        // 构造函数\n    ];\n\n    // 查找匹配的元素\n    for (const id of possibleIds) {\n      const element = this.codeElements.find(e => e.id === id);\n      if (element) return id;\n    }\n\n    return undefined;\n  }\n\n  private getImportPath(node: Parser.SyntaxNode): string {\n    const moduleNode = node.childForFieldName('source');\n    if (!moduleNode) return '';\n\n    // 移除引号\n    return moduleNode.text.replace(/['\"]/g, '');\n  }\n\n  private resolveTypeReference(typeName: string): string | undefined {\n    const element = this.codeElements.find(e => e.name === typeName);\n    return element?.id;\n  }\n} ",
                                          "children": {},
                                          "isFile": true
                                      },
                                      "gitAction.ts": {
                                          "name": "gitAction.ts",
                                          "token": 192,
                                          "content": "import { simpleGit, SimpleGit } from \"simple-git\";\nimport { GitOperationError } from \"./errors\";\n\nexport class GitAction {\n  private git: SimpleGit;\n\n  constructor() {\n    this.git = simpleGit({ baseDir: process.cwd() });\n  }\n\n  async clone(url: string, path: string): Promise<void> {\n    try {\n      await this.git.clone(url, path);\n    } catch (error) {\n      throw new GitOperationError(\"clone\", (error as Error).message);\n    }\n  }\n\n  async checkoutBranch(path: string, branch: string): Promise<void> {\n    try {\n      const git = simpleGit(path);\n      await git.checkout(branch);\n    } catch (error) {\n      throw new GitOperationError(\"checkout\", (error as Error).message);\n    }\n  }\n}\n",
                                          "children": {},
                                          "isFile": true
                                      },
                                      "errors.ts": {
                                          "name": "errors.ts",
                                          "token": 431,
                                          "content": "// 错误基类\nexport class GitIngestError extends Error {\n  constructor(message: string) {\n    super(message);\n    this.name = \"GitIngestError\";\n  }\n}\n\n// 错误基类\nexport class GitOperationError extends GitIngestError {\n  constructor(operation: string, details: string) {\n    super(`Git operation '${operation}' failed: ${details}`);\n    this.name = \"GitOperationError\";\n  }\n}\n\n// 文件处理错误\nexport class FileProcessError extends GitIngestError {\n  constructor(path: string, reason: string) {\n    super(`Failed to process file '${path}': ${reason}`);\n    this.name = \"FileProcessError\";\n  }\n}\n\n// 验证错误\nexport class ValidationError extends GitIngestError {\n  constructor(message: string) {\n    super(`Validation failed: ${message}`);\n    this.name = \"ValidationError\";\n  }\n}\n\n// 依赖分析错误\nexport class DependencyAnalysisError extends Error {\n  constructor(\n    public readonly filePath: string,\n    public readonly errorType: \"parse\" | \"resolve\" | \"analyze\",\n    message: string\n  ) {\n    super(`[${errorType}] ${message} in file: ${filePath}`);\n    this.name = \"DependencyAnalysisError\";\n  }\n}\n\n// git 分析错误\nexport class GitAnalysisError extends Error {\n  constructor(\n    public readonly operation: string,\n    public readonly target: string,\n    message: string\n  ) {\n    super(`Git analysis failed: ${message} (${operation} on ${target})`);\n    this.name = \"GitAnalysisError\";\n  }\n}\n",
                                          "children": {},
                                          "isFile": true
                                      },
                                      "scanner.ts": {
                                          "name": "scanner.ts",
                                          "token": 4132,
                                          "content": "import { glob } from \"glob\";\nimport { readFile, stat } from \"fs/promises\";\nimport type { FileInfo } from \"../types/index\";\nimport { FileProcessError, ValidationError } from \"./errors\";\nimport { dirname, join } from \"path\";\nimport { estimateTokens } from \"../utils\";\n\ninterface ScanOptions {\n  maxFileSize?: number;\n  includePatterns?: string[];\n  excludePatterns?: string[];\n  targetPaths?: string[];\n  includeDependencies?: boolean;\n}\n\nconst BINARY_FILE_TYPES = [\n  \".jpg\",\n  \".jpeg\",\n  \".png\",\n  \".gif\",\n  \".bmp\",\n  \".pdf\",\n  \".doc\",\n  \".docx\",\n  \".xls\",\n  \".xlsx\",\n  \".zip\",\n  \".rar\",\n  \".7z\",\n  \".tar\",\n  \".gz\",\n  \".exe\",\n  \".dll\",\n  \".so\",\n  \".dylib\",\n  \".svg\",\n  \".ico\",\n  \".webp\",\n  \".mp4\",\n  \".mp3\",\n  \".wav\",\n  \".avi\",\n  ];\n\nexport class FileScanner {\n  protected processedFiles: Set<string> = new Set();\n\n  // 查找模块文件\n  private async findModuleFile(\n    importPath: string,\n    currentDir: string,\n    basePath: string\n  ): Promise<string | null> {\n    // 处理外部依赖\n    if (!importPath.startsWith(\".\")) {\n      return importPath; // 直接返回包名，让依赖图生成器处理\n    }\n\n    // 清理当前目录路径，移除临时目录部分\n    const cleanCurrentDir = currentDir\n      .replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\")\n      .replace(new RegExp(`^${basePath}/`), \"\");\n\n    // 解析基础目录路径\n    const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n    const pathParts = resolvedPath.split(\"/\");\n    const fileName = pathParts.pop() || \"\";\n    const dirPath = pathParts.join(\"/\");\n\n    // 可能的文件扩展名，根据导入文件类型调整优先级\n    const getExtensions = (importName: string) => {\n      if (importName.toLowerCase().endsWith(\".css\")) {\n        return [\".css\", \".less\", \".scss\", \".sass\"];\n      }\n      return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n    };\n\n    const extensions = getExtensions(fileName);\n\n    const targetBasePath = join(basePath, dirPath);\n\n    // 构建可能的基础路径\n    // const possibleBasePaths = [\n    //   join(basePath, dirPath),\n    //   join(basePath, 'src', dirPath),\n    //   ...glob.sync(`${basePath}/*/src/${dirPath}`, { absolute: true })\n    // ];\n\n    // 如果文件名没有扩展名\n    if (!fileName.includes(\".\")) {\n      // for (const currentBasePath of possibleBasePaths) {\n      // 1. 尝试直接添加扩展名\n      for (const ext of extensions) {\n        const fullPath = join(targetBasePath, fileName + ext);\n        try {\n          const stats = await stat(fullPath);\n          if (stats.isFile()) {\n            // 返回清理过的路径\n            return join(dirPath, fileName + ext)\n              .replace(new RegExp(`^${basePath}/`), \"\")\n              .replace(/\\\\/g, \"/\");\n          }\n        } catch (error) {\n          continue;\n        }\n      }\n\n      // 2. 尝试查找 index 文件\n      const dirFullPath = join(targetBasePath, fileName);\n      try {\n        const stats = await stat(dirFullPath);\n        if (stats.isDirectory()) {\n          for (const ext of extensions) {\n            const indexPath = join(dirFullPath, \"index\" + ext);\n            try {\n              const indexStats = await stat(indexPath);\n              if (indexStats.isFile()) {\n                return join(dirPath, fileName, \"index\" + ext)\n                  .replace(new RegExp(`^${basePath}/`), \"\")\n                  .replace(/\\\\/g, \"/\");\n              }\n            } catch (error) {\n              continue;\n            }\n          }\n        }\n      } catch (error) {\n        // continue;\n      }\n      // }\n    } else {\n      // 文件名已有扩展名，尝试所有可能的基础路径\n      // for (const currentBasePath of possibleBasePaths) {\n      const fullPath = join(targetBasePath, fileName);\n      try {\n        const stats = await stat(fullPath);\n        if (stats.isFile()) {\n          return join(dirPath, fileName)\n            .replace(new RegExp(`^${basePath}/`), \"\")\n            .replace(/\\\\/g, \"/\");\n        }\n      } catch (error) {\n        // continue;\n      }\n      // }\n    }\n\n    return null;\n  }\n\n  // [依赖文件按需分析]: 分析依赖文件\n  protected async analyzeDependencies(\n    content: string,\n    filePath: string,\n    basePath: string\n  ): Promise<string[]> {\n    const dependencies: string[] = [];\n    // 匹配导入路径。示例: import { Button } from '@/components/Button'\n    const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n\n    // 移除多行注释\n    const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n    const lines = contentWithoutComments\n      .split(\"\\n\")\n      .filter((line) => {\n        const trimmed = line.trim();\n        return trimmed && !trimmed.startsWith(\"//\");\n      })\n      .join(\"\\n\");\n\n    // 匹配导入路径\n    let match;\n    // 遍历每一行，匹配导入路径\n    while ((match = importRegex.exec(lines)) !== null) {\n      // 获取导入路径。示例: import { Button } from '@/components/Button'\n      const importPath = match[1];\n      // 获取当前文件路径。示例: src/components/Button/index.ts\n      const currentDir = dirname(filePath);\n\n      // 查找导入路径。示例: src/components/Button/index.ts\n      const resolvedPath = await this.findModuleFile(\n        importPath,\n        currentDir,\n        basePath\n      );\n      // 如果导入路径存在，且不在依赖列表中，则添加到依赖列表\n      if (resolvedPath && !dependencies.includes(resolvedPath)) {\n        dependencies.push(resolvedPath);\n      }\n    }\n\n    // 返回依赖列表。示例：['src/components/Button/index.ts', 'src/components/Input/index.ts']\n    return dependencies;\n  }\n\n  // 扫描目录\n  async scanDirectory(path: string, options: ScanOptions): Promise<FileInfo[]> {\n    if (!path) {\n      throw new ValidationError(\"Path is required\");\n    }\n\n    try {\n      // 清除已处理文件\n      this.processedFiles.clear();\n      const allFiles: FileInfo[] = [];\n\n      // 如果指定了目标文件路径，则扫描目标文件及其依赖文件\n      if (options.targetPaths && options.targetPaths.length > 0) {\n        for (const targetPath of options.targetPaths) {\n          // [核心步骤三]: 扫描目标文件及其依赖文件\n          await this.processFileAndDependencies(\n            path,\n            targetPath,\n            options,\n            allFiles\n          );\n        }\n        return allFiles;\n      }\n\n      const files = await glob(\"**/*\", {\n        cwd: path,\n        ignore: [\n          ...(options.excludePatterns || []),\n          \"**/node_modules/**\",\n          \"**/.git/**\",\n        ],\n        nodir: true,\n        absolute: false,\n        windowsPathsNoEscape: true,\n      });\n\n      const results = await Promise.all(\n        files.map((file) => this.processFile(path, file, options))\n      );\n\n      return results.filter((file): file is FileInfo => file !== null);\n    } catch (error) {\n      throw new FileProcessError(path, (error as Error).message);\n    }\n  }\n\n  // 扫描目标文件及其依赖文件\n  private async processFileAndDependencies(\n    basePath: string,\n    relativePath: string,\n    options: ScanOptions,\n    allFiles: FileInfo[]\n  ): Promise<void> {\n    if (this.processedFiles.has(relativePath)) {\n      return;\n    }\n\n    /**\n     * 核心步骤四: 扫描目标文件\n     * 示例: fileInfo: { path: 'src/components/Button/index.ts', content: '...', size: 1024 }\n     */\n    const fileInfo = await this.processFile(basePath, relativePath, options);\n    // 如果文件存在，则添加到已处理文件集合，并添加到结果数组\n    if (fileInfo) {\n      this.processedFiles.add(relativePath);\n      allFiles.push(fileInfo);\n\n      // [依赖文件按需分析]: 如果 includeDependencies 为 true，则分析依赖文件\n      if (options.includeDependencies !== false) {\n        // 分析依赖文件\n        const dependencies = await this.analyzeDependencies(\n          fileInfo.content,\n          relativePath,\n          basePath\n        );\n        // 遍历依赖文件，递归扫描依赖文件\n        for (const dep of dependencies) {\n          await this.processFileAndDependencies(\n            basePath,\n            dep,\n            options,\n            allFiles\n          );\n        }\n      }\n    }\n  }\n\n  // 尝试查找文件\n  private async tryFindFile(\n    basePath: string,\n    filePath: string,\n    options: ScanOptions\n  ): Promise<FileInfo | null> {\n    try {\n      const stats = await stat(filePath);\n      if (options.maxFileSize && stats.size > options.maxFileSize) {\n        return null;\n      }\n\n      // [核心步骤六]: 读取文件内容\n      const content = await readFile(filePath, \"utf-8\");\n      /**\n       * @desc 移除临时目录前缀，只保留项目相关路径\n       * 示例:\n       * filePath: repo/github101-250644/src/core/gitAction.ts\n       * basePath: 'repo/github101-492772'\n       * relativePath: repo/github101-250644/src/core/gitAction.ts\n       */\n      const basePathParts = basePath.split(\"/\"); // eg: ['repo', 'github101-492772']\n      const deleteHashRepoName = basePathParts[\n        basePathParts.length - 1\n      ].replace(/-[^-]*$/, \"\"); // github101\n      const relativePath = filePath\n        .replace(new RegExp(`^${basePathParts[0]}/`), \"\") // 去除临时目录前缀 repo/\n        .replace(\n          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n          deleteHashRepoName\n        ) // 去掉[-hash]\n        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n\n      return {\n        path: relativePath,\n        content,\n        // size: stats.size,\n        token: estimateTokens(content),\n      };\n    } catch (error) {\n      return null;\n    }\n  }\n\n  // 扫描文件\n  private async processFile(\n    basePath: string,\n    relativePath: string,\n    options: ScanOptions\n  ): Promise<FileInfo | null> {\n    try {\n      // 获取文件扩展名\n      const ext = relativePath.toLowerCase().split(\".\").pop();\n      // 如果文件是二进制文件，则跳过\n      if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n        return null;\n      }\n\n      /**\n       * @desc 规范化路径\n       * 示例:\n       * relativePath: src/components/Button/index.ts\n       * normalizedPath: src/components/Button/index.ts\n       */\n      const normalizedPath = relativePath\n        .replace(/^[\\/\\\\]+/, \"\") // 移除开头的斜杠\n        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n\n      /**\n       * @desc 获取基础路径和文件名部分\n       * 示例:\n       * normalizedPath: src/components/Button/index.ts\n       * pathParts: ['src', 'components', 'Button', 'index.ts']\n       * fileName: 'index.ts'\n       * dirPath: 'src/components/Button'\n       * targetBasePath: ${basePath}/src/components/Button\n       */\n      const pathParts = normalizedPath.split(\"/\");\n      const fileName = pathParts.pop() || \"\";\n      const dirPath = pathParts.join(\"/\");\n      const targetBasePath = join(basePath, dirPath);\n\n      // 可能的文件扩展名\n      const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n\n      // [核心步骤五]: tryFindFile 尝试查找文件\n      // 如果路径没有扩展名，尝试多种可能性\n      if (!fileName.includes(\".\")) {\n        // 1. 尝试直接添加扩展名\n        for (const ext of extensions) {\n          const fullPath = join(targetBasePath, fileName + ext);\n          const result = await this.tryFindFile(basePath, fullPath, options);\n          if (result) return result;\n        }\n\n        // 2. 尝试作为目录查找 index 文件\n        const dirFullPath = join(targetBasePath, fileName);\n        for (const ext of extensions) {\n          const indexPath = join(dirFullPath, \"index\" + ext);\n          const result = await this.tryFindFile(basePath, indexPath, options);\n          if (result) return result;\n        }\n      } else {\n        // 文件名已有扩展名，尝试所有可能的基础路径\n        const fullPath = join(targetBasePath, fileName);\n        const result = await this.tryFindFile(basePath, fullPath, options);\n        if (result) return result;\n      }\n\n      return null;\n    } catch (error) {\n      console.warn(`Warning: Failed to process file ${relativePath}: ${error}`);\n      return null;\n    }\n  }\n}\n",
                                          "children": {},
                                          "isFile": true
                                      }
                                  },
                                  "isFile": false
                              },
                              "utils": {
                                  "name": "utils",
                                  "token": 2966,
                                  "children": {
                                      "graphSearch.ts": {
                                          "name": "graphSearch.ts",
                                          "token": 1810,
                                          "content": "export interface KnowledgeNode {\n  id: string;\n  name: string;\n  type: string;\n  filePath: string;\n  location: {\n    file: string;\n    line: number;\n  };\n  description?: string;\n  properties?: Record<string, any>;\n  implementation?: string;\n}\n\nexport interface KnowledgeEdge {\n  source: string;\n  target: string;\n  type: string;\n  properties?: Record<string, any>;\n}\n\nexport interface KnowledgeGraph {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}\n\nexport interface SearchOptions {\n  entities: string[];         // 实体名称数组\n  relationTypes?: string[];   // 按关系类型过滤\n  maxDistance?: number;       // 关系距离限制\n  limit?: number;             // 结果数量限制\n}\n\nexport interface SearchResult {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n  metadata: {\n    totalNodes: number;\n    totalEdges: number;\n    entities: string[];\n    relationTypes: string[];\n    maxDistance: number;\n  };\n}\n\ninterface RelatedNodesResult {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}\n\nfunction findRelatedNodes(\n  graph: KnowledgeGraph,\n  startNodes: KnowledgeNode[],\n  maxDistance: number\n): RelatedNodesResult {\n  const relatedNodes = new Set<KnowledgeNode>();\n  const relatedEdges = new Set<KnowledgeEdge>();\n  const processedNodeIds = new Set<string>();\n\n  function processNode(node: KnowledgeNode, distance: number) {\n    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n    processedNodeIds.add(node.id);\n    relatedNodes.add(node);\n\n    // 1. 查找直接相关的边\n    const directEdges = graph.edges.filter(edge =>\n      edge.source === node.id || edge.target === node.id\n    );\n\n    directEdges.forEach(edge => {\n      relatedEdges.add(edge);\n\n      // 处理边的另一端节点\n      const otherId = edge.source === node.id ? edge.target : edge.source;\n      const otherNode = graph.nodes.find(n => n.id === otherId);\n\n      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n        processNode(otherNode, distance + 1);\n      }\n    });\n\n    // 2. 查找类和方法的关系\n    if (node.type === 'class') {\n      // 先找到类的所有方法\n      const methodNodes = graph.nodes.filter(n => {\n        if (n.type !== 'function' && n.type !== 'class_method') return false;\n        if (n.filePath !== node.filePath) return false;\n        if (n.name === 'constructor') return false;\n\n        // 检查方法是否属于这个类\n        const classNode = graph.nodes.find(c =>\n          c.type === 'class' &&\n          c.filePath === n.filePath &&\n          c.id === n.id.split('#')[0] + '#' + node.name\n        );\n        return classNode !== undefined;\n      });\n\n      methodNodes.forEach(methodNode => {\n        if (!processedNodeIds.has(methodNode.id)) {\n          // 添加 defines 关系\n          const edge: KnowledgeEdge = {\n            source: node.id,\n            target: methodNode.id,\n            type: 'defines',\n            properties: {}\n          };\n          relatedEdges.add(edge);\n          processNode(methodNode, distance + 1);\n        }\n      });\n    }\n\n    // 3. 查找继承关系\n    if (node.type === 'class' && node.name.endsWith('Error')) {\n      const parentNode = graph.nodes.find(n => n.name === 'Error');\n      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n        const edge: KnowledgeEdge = {\n          source: node.id,\n          target: 'Error',\n          type: 'extends',\n          properties: {}\n        };\n        relatedEdges.add(edge);\n        processNode(parentNode, distance + 1);\n      }\n    }\n  }\n\n  // 从每个起始节点开始处理\n  startNodes.forEach(node => processNode(node, 0));\n\n  return {\n    nodes: Array.from(relatedNodes),\n    edges: Array.from(relatedEdges)\n  };\n}\n\n/**\n * 基于实体名称列表搜索关联的知识图谱\n * @param graph 知识图谱\n * @param options 搜索选项\n * @returns 搜索结果\n */\nexport function searchKnowledgeGraph(\n  graph: KnowledgeGraph,\n  options: SearchOptions\n): SearchResult {\n  const { entities, maxDistance = 2 } = options;\n\n  // 1. 找到起始节点\n  const startNodes = graph.nodes.filter(node =>\n    entities.some(entity => node.name === entity)\n  );\n\n  if (!startNodes.length) {\n    console.warn(`[Warning] No nodes found for entities:`, entities);\n    return {\n      nodes: [],\n      edges: [],\n      metadata: {\n        totalNodes: 0,\n        totalEdges: 0,\n        entities,\n        relationTypes: [],\n        maxDistance\n      }\n    };\n  }\n\n  // 2. 找到相关节点和边\n  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance);\n\n  // 3. 添加类和方法的关系\n  const methodNodes = nodes.filter(n => n.type === 'function' || n.type === 'class_method');\n  const classNodes = nodes.filter(n => n.type === 'class');\n\n  methodNodes.forEach(method => {\n    const className = method.id.split('#')[1];\n    const relatedClass = classNodes.find(c => c.name === className);\n    if (relatedClass) {\n      edges.push({\n        source: relatedClass.id,\n        target: method.id,\n        type: 'defines',\n        properties: {}\n      });\n    }\n  });\n\n  // 4. 添加继承关系\n  const errorClasses = classNodes.filter(n => n.name.endsWith('Error'));\n  errorClasses.forEach(errorClass => {\n    edges.push({\n      source: errorClass.id,\n      target: 'Error',\n      type: 'extends',\n      properties: {}\n    });\n  });\n\n  return {\n    nodes,\n    edges,\n    metadata: {\n      totalNodes: nodes.length,\n      totalEdges: edges.length,\n      entities,\n      relationTypes: Array.from(new Set(edges.map(e => e.type))),\n      maxDistance\n    }\n  };\n}\n\nfunction printGraphStats(graph: KnowledgeGraph) {\n  console.log('Nodes:', graph.nodes.length);\n  console.log('Edges:', graph.edges.length);\n  console.log('Unique Relationships:',\n    new Set(graph.edges.map(e => `${e.type}:${e.source}->${e.target}`)).size\n  );\n} ",
                                          "children": {},
                                          "isFile": true
                                      },
                                      "index.ts": {
                                          "name": "index.ts",
                                          "token": 963,
                                          "content": "import type { FileInfo } from \"../types/index\";\n\n// 估计内容 token 数量\nexport function estimateTokens(text: string): number {\n  // 1. 计算中文字符数量\n  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n\n  // 2. 计算英文单词数量（包括数字和标点）\n  const otherChars = text.length - chineseChars;\n\n  // 3. 计算总 token：\n  // - 中文字符通常是 1:1 或 1:2 的比例，保守起见使用 2\n  // - 其他字符按照 1:0.25 的比例\n  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n\n  // 4. 添加 10% 的安全余量\n  return Math.ceil(estimatedTokens * 1.1);\n}\n\n// 生成目录树\nexport function generateTree(files: FileInfo[]): string {\n  const tree: { [key: string]: any } = {};\n\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = tree;\n\n    for (const part of parts.slice(0, -1)) {\n      if (!current[part]) {\n        current[part] = {};\n      }\n      current = current[part];\n    }\n\n    current[parts[parts.length - 1]] = null;\n  }\n\n  function stringify(node: any, prefix = \"\"): string {\n    let result = \"\";\n    const entries = Object.entries(node);\n\n    for (let i = 0; i < entries.length; i++) {\n      const [key, value] = entries[i];\n      const isLast = i === entries.length - 1;\n      const connector = isLast ? \"└── \" : \"├── \";\n      const childPrefix = isLast ? \"    \" : \"│   \";\n\n      result += prefix + connector + key + \"\\n\";\n\n      if (value !== null) {\n        result += stringify(value, prefix + childPrefix);\n      }\n    }\n\n    return result;\n  }\n\n  return stringify(tree);\n}\n\ninterface TreeNode {\n  name: string;\n  token: number;\n  content?: string;\n  children: { [key: string]: TreeNode };\n  isFile: boolean;\n}\n\n// 构建文件大小树\nexport function buildSizeTree(files: FileInfo[]): TreeNode {\n  // 创建根节点\n  const root: TreeNode = {\n    name: \"root\",\n    token: 0,\n    children: {},\n    isFile: false,\n  };\n\n  // 构建树结构\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = root;\n\n    // 遍历路径的每一部分\n    for (let i = 0; i < parts.length; i++) {\n      const part = parts[i];\n      const isLastPart = i === parts.length - 1;\n\n      if (!current.children[part]) {\n        current.children[part] = {\n          name: part,\n          token: isLastPart ? file.token : 0,\n          ...(isLastPart && file.content ? { content: file.content } : {}),\n          children: {},\n          isFile: isLastPart,\n        };\n      }\n\n      current = current.children[part];\n    }\n  }\n\n  // 计算每个目录的总大小\n  function calculateSize(node: TreeNode): number {\n    if (node.isFile) {\n      return node.token;\n    }\n\n    let totalToken = 0;\n    for (const child of Object.values(node.children)) {\n      totalToken += calculateSize(child);\n    }\n    node.token = totalToken;\n    return totalToken;\n  }\n\n  calculateSize(root);\n  return root;\n}\n\nexport * from './graphSearch';\n",
                                          "children": {},
                                          "isFile": true
                                      },
                                      "analyzeDependencies.ts": {
                                          "name": "analyzeDependencies.ts",
                                          "token": 193,
                                          "content": "import { cruise } from \"dependency-cruiser\";\n\n// 根据指定目录分析依赖关系\nexport const analyzeDependencies = async (rootDir: string) => {\n  try {\n    const result = await cruise(\n      [rootDir], // 要分析的目录\n      { // 配置选项\n        exclude: \"node_modules\", // 排除 node_modules\n        outputType: \"json\", // 输出为 JSON 格式\n      }\n    );\n\n    const dependencies = JSON.parse(result.output as string);\n\n    return dependencies;\n  } catch (error) {\n    console.error(\"Error analyzing dependencies:\", error);\n  }\n}\n",
                                          "children": {},
                                          "isFile": true
                                      }
                                  },
                                  "isFile": false
                              },
                              "types": {
                                  "name": "types",
                                  "token": 953,
                                  "children": {
                                      "index.ts": {
                                          "name": "index.ts",
                                          "token": 953,
                                          "content": "export interface AnalyzeOptions {\n  // 最大文件大小\n  maxFileSize?: number;\n  // 包含的文件模式\n  includePatterns?: string[];\n  // 排除的文件模式\n  excludePatterns?: string[];\n  // 目标文件路径\n  targetPaths?: string[];\n  // 分支\n  branch?: string;\n  // 提交\n  commit?: string;\n  // 最小公共根目录\n  miniCommonRoot?: string;\n}\n\nexport interface FileInfo {\n  // 文件路径\n  path: string;\n  // 文件内容\n  content: string;\n  // 文件预估消耗 token 数量\n  token: number;\n}\n\nexport interface AnalysisResult {\n  // 项目概况\n  metadata: {\n    files: number;\n    tokens: number;\n  };\n  // 文件树\n  fileTree: string;\n  // 总代码\n  totalCode: {\n    // 文件路径\n    path: string;\n    // 文件内容\n    content: string;\n    // 文件预估消耗 token 数量\n    token: number;\n  }[];\n  // 文件大小树，表示文件及其子文件夹的大小结构\n  sizeTree: {\n    // 文件或文件夹的名称\n    name: string;\n    // 文件或文件夹预估消耗 token 数量\n    token: number;\n    // 是否为文件\n    isFile: boolean;\n    // 子文件或子文件夹的集合\n    children?: {\n      [key: string]: {\n        // 子文件或子文件夹的名称\n        name: string;\n        // 子文件或子文件夹预估消耗 token 数量\n        token: number;\n        // 子文件或子文件夹的集合\n        children?: any; // 递归定义，允许嵌套\n        // 是否为文件\n        isFile: boolean;\n      };\n    };\n  };\n  // 代码分析\n  codeAnalysis: CodeAnalysis;\n  // 依赖关系图\n  dependencyGraph: any;\n}\n\nexport interface CodeAnalysis {\n  codeIndex: Map<string, any[]>;\n  knowledgeGraph: {\n    nodes: any[];\n    edges: any[];\n  };\n}\nexport interface GitIngestConfig {\n  // 保存克隆仓库的临时目录名\n  tempDir?: string;\n  /* 默认检索的最大的文件 */\n  defaultMaxFileSize?: number;\n  /* 文件模式 */\n  defaultPatterns?: {\n    /* 包含的文件/目录 */\n    include?: string[];\n    /* 不会去检索的文件/目录 */\n    exclude?: string[];\n  };\n  /* 保留克隆的仓库 */\n  keepTempFiles?: boolean;\n  /* 自定义域名 */\n  customDomainMap?: {\n    targetDomain: string;\n    originalDomain: string;\n  };\n}\n",
                                          "children": {},
                                          "isFile": true
                                      }
                                  },
                                  "isFile": false
                              },
                              "index.ts": {
                                  "name": "index.ts",
                                  "token": 2472,
                                  "content": "import { GitAction } from \"./core/gitAction\";\nimport { FileScanner } from \"./core/scanner\";\nimport { CodeAnalyzer } from \"./core/codeAnalyzer\";\nimport path from 'path';  // 添加 path 模块\nimport type {\n  AnalyzeOptions,\n  AnalysisResult,\n  GitIngestConfig,\n  FileInfo,\n  CodeAnalysis\n} from \"./types/index\";\nimport { generateTree, buildSizeTree, estimateTokens } from \"./utils/index\";\nimport {\n  GitIngestError,\n  ValidationError,\n  GitOperationError,\n} from \"./core/errors\";\nimport { mkdir, rm } from \"fs/promises\";\nimport { existsSync } from \"fs\";\nimport crypto from \"crypto\";\nimport { analyzeDependencies } from \"./utils/analyzeDependencies\";\n\nexport class GitIngest {\n  private git: GitAction;\n  private scanner: FileScanner;\n  private analyzer: CodeAnalyzer;\n  private config: GitIngestConfig;\n\n  constructor(config?: GitIngestConfig) {\n    this.git = new GitAction();\n    this.scanner = new FileScanner();\n    this.analyzer = new CodeAnalyzer();\n    this.config = {\n      tempDir: \"repo\", // 默认保存仓库的目录名(不会暴露到外部)\n      keepTempFiles: false, // 默认不保留临时文件\n      defaultMaxFileSize: 1024 * 1024, // 默认检索不超过 1MB 的文件\n      defaultPatterns: {\n        include: [\"**/*\"],\n        exclude: [\"**/node_modules/**\", \"**/.git/**\"],\n      },\n      ...config,\n    };\n  }\n\n  // 清理临时目录\n  private async cleanupTempDir(dirPath: string): Promise<void> {\n    try {\n      if (existsSync(dirPath)) {\n        await rm(dirPath, { recursive: true, force: true });\n      }\n    } catch (error) {\n      console.warn(\n        `Warning: Failed to cleanup temporary directory ${dirPath}: ${(error as Error).message\n        }`\n      );\n    }\n  }\n\n  // 检查URL是否使用自定义域名，如果是则转换为原始GitHub URL\n  private transformCustomDomainUrl(url: string): string {\n    if (!this.config.customDomainMap) {\n      return url;\n    }\n\n    const { targetDomain, originalDomain } = this.config.customDomainMap;\n    if (url.includes(targetDomain)) {\n      return url.replace(targetDomain, originalDomain);\n    }\n\n    return url;\n  }\n\n  // 检查URL是否匹配自定义域名\n  private isCustomDomainUrl(url: string): boolean {\n    if (!this.config.customDomainMap) {\n      return false;\n    }\n\n    return url.includes(this.config.customDomainMap.targetDomain);\n  }\n\n  // [核心步骤0]: 开端，根据 url 按需获取仓库代码\n  async analyzeFromUrl(\n    url: string,\n    options?: AnalyzeOptions\n  ): Promise<AnalysisResult> {\n    // 检查是否是自定义域名URL\n    const isCustomDomain = this.isCustomDomainUrl(url);\n    // 转换URL\n    const githubUrl = this.transformCustomDomainUrl(url);\n\n    if (!githubUrl) {\n      throw new ValidationError(\"URL is required\");\n    }\n\n    if (!githubUrl.match(/^https?:\\/\\//)) {\n      throw new ValidationError(\"Invalid URL format\");\n    }\n\n    if (!this.config.tempDir) {\n      throw new ValidationError(\"Temporary directory is required\");\n    }\n\n    // 从URL中提取仓库名\n    const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n    const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n    // 生成唯一标识符（使用时间戳的后6位作为唯一值）\n    const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n    const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n\n    let result: AnalysisResult;\n\n    try {\n      // 确保临时目录存在\n      if (!existsSync(this.config.tempDir)) {\n        await mkdir(this.config.tempDir, { recursive: true });\n      }\n\n      // 克隆仓库\n      await this.git.clone(githubUrl, workDir);\n\n      // 如果指定了分支,切换到对应分支\n      if (options?.branch) {\n        await this.git.checkoutBranch(workDir, options.branch);\n      }\n\n      // [核心步骤一]: 调用扫描目录\n      result = await this.analyzeFromDirectory(workDir, options);\n\n      // 如果不保留临时文件，则清理\n      if (!this.config.keepTempFiles) {\n        await this.cleanupTempDir(workDir);\n      }\n\n      // 如果是自定义域名访问，添加额外信息\n      // if (isCustomDomain) {\n      //   result.summary = `通过自定义域名 ${this.config.customDomainMap?.targetDomain} 访问\\n原始仓库: ${githubUrl}\\n\\n${result.summary}`;\n      // }\n\n      return result;\n    } catch (error) {\n      // 发生错误时也尝试清理临时文件\n      if (!this.config.keepTempFiles) {\n        await this.cleanupTempDir(workDir);\n      }\n\n      if (error instanceof GitIngestError) {\n        throw error;\n      }\n      throw new GitIngestError(\n        `Failed to analyze repository: ${(error as Error).message}`\n      );\n    }\n  }\n\n  // 分析扫描目录\n  async analyzeFromDirectory(\n    dirPath: string,\n    options?: AnalyzeOptions\n  ): Promise<AnalysisResult> {\n    if (!dirPath) {\n      throw new ValidationError(\"Path is required\");\n    }\n\n    if (!existsSync(dirPath)) {\n      throw new ValidationError(`Directory not found: ${dirPath}`);\n    }\n\n    try {\n      const files = await this.scanner.scanDirectory(dirPath, {\n        maxFileSize: options?.maxFileSize || this.config.defaultMaxFileSize,\n        includePatterns:\n          options?.includePatterns || this.config.defaultPatterns?.include,\n        excludePatterns:\n          options?.excludePatterns || this.config.defaultPatterns?.exclude,\n        targetPaths: options?.targetPaths,\n        includeDependencies: true,\n      });\n\n      if (files.length === 0) {\n        throw new ValidationError(\"No files found in the specified directory\");\n      }\n\n      // 重置分析器状态\n      this.analyzer = new CodeAnalyzer();\n\n      // 分析代码并构建索引和知识图谱\n      for (const file of files) {\n        try {\n          // 确保是 TypeScript/JavaScript 文件\n          if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n            // 使用 file.content 而不是重新读取文件\n            const content = file.content;\n            // 使用绝对路径\n            const absolutePath = path.resolve(dirPath, file.path);\n\n            // console.log(`Analyzing file: ${absolutePath}`); // 添加日志\n            this.analyzer.analyzeCode(absolutePath, content);\n          }\n        } catch (error) {\n          console.warn(\n            `Warning: Failed to analyze file ${file.path}: ${(error as Error).message}`\n          );\n        }\n      }\n\n      // 获取分析结果\n      const codeIndex = this.analyzer.getCodeIndex();\n      const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n\n      console.log(`Analysis complete. Found ${codeIndex.size} code elements`); // 添加日志\n\n      return {\n        metadata: {\n          files: files.length,\n          tokens: files.reduce((acc, file) => acc + file.token, 0),\n        },\n        totalCode: files,\n        fileTree: generateTree(files),\n        sizeTree: buildSizeTree(files),\n        codeAnalysis: { codeIndex, knowledgeGraph },\n        dependencyGraph: await analyzeDependencies(dirPath + (options?.miniCommonRoot || ''))\n      };\n    } catch (error) {\n      if (error instanceof GitIngestError) {\n        throw error;\n      }\n      throw new GitIngestError(\n        `Failed to analyze directory: ${(error as Error).message}`\n      );\n    }\n  }\n}\n\n// 导出错误类型\nexport {\n  GitIngestError,\n  ValidationError,\n  GitOperationError,\n} from \"./core/errors\";\n\n// 导出类型定义\nexport type { AnalyzeOptions, AnalysisResult, GitIngestConfig, FileInfo, CodeAnalysis };\n\nexport * from \"./utils/graphSearch\";",
                                  "children": {},
                                  "isFile": true
                              }
                          },
                          "isFile": false
                      }
                  },
                  "isFile": false
              }
          },
          "isFile": false
      },
      "codeAnalysis": {
          "codeIndex": {},
          "knowledgeGraph": {
              "nodes": [
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#AnalyzeOptions",
                      "name": "AnalyzeOptions",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 1
                      },
                      "implementation": "interface AnalyzeOptions {\n    maxFileSize?: number;\n    includePatterns?: string[];\n    excludePatterns?: string[];\n    targetPaths?: string[];\n    branch?: string;\n    commit?: string;\n    miniCommonRoot?: string;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#FileInfo",
                      "name": "FileInfo",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 10
                      },
                      "implementation": "interface FileInfo {\n    path: string;\n    content: string;\n    token: number;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#AnalysisResult",
                      "name": "AnalysisResult",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 15
                      },
                      "implementation": "interface AnalysisResult {\n    metadata: {\n        files: number;\n        tokens: number;\n    };\n    fileTree: string;\n    totalCode: {\n        path: string;\n        content: string;\n        token: number;\n    }[];\n    sizeTree: {\n        name: string;\n        token: number;\n        isFile: boolean;\n        children?: {\n            [key: string]: {\n                name: string;\n                token: number;\n                children?: any;\n                isFile: boolean;\n            };\n        };\n    };\n    codeAnalysis: CodeAnalysis;\n    dependencyGraph: any;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#CodeAnalysis",
                      "name": "CodeAnalysis",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 42
                      },
                      "implementation": "interface CodeAnalysis {\n    codeIndex: Map<string, any[]>;\n    knowledgeGraph: {\n        nodes: any[];\n        edges: any[];\n    };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#GitIngestConfig",
                      "name": "GitIngestConfig",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 49
                      },
                      "implementation": "interface GitIngestConfig {\n    tempDir?: string;\n    defaultMaxFileSize?: number;\n    defaultPatterns?: {\n        include?: string[];\n        exclude?: string[];\n    };\n    keepTempFiles?: boolean;\n    customDomainMap?: {\n        targetDomain: string;\n        originalDomain: string;\n    };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#GitIngestError",
                      "name": "GitIngestError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 63
                      },
                      "implementation": "class GitIngestError extends Error {\n    constructor(message: string);\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#GitOperationError",
                      "name": "GitOperationError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 66
                      },
                      "implementation": "class GitOperationError extends GitIngestError {\n    constructor(operation: string, details: string);\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#ValidationError",
                      "name": "ValidationError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 69
                      },
                      "implementation": "class ValidationError extends GitIngestError {\n    constructor(message: string);\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#KnowledgeNode",
                      "name": "KnowledgeNode",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 73
                      },
                      "implementation": "interface KnowledgeNode {\n    id: string;\n    name: string;\n    type: string;\n    filePath: string;\n    location: {\n        file: string;\n        line: number;\n    };\n    description?: string;\n    properties?: Record<string, any>;\n    implementation?: string;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#KnowledgeEdge",
                      "name": "KnowledgeEdge",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 86
                      },
                      "implementation": "interface KnowledgeEdge {\n    source: string;\n    target: string;\n    type: string;\n    properties?: Record<string, any>;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#KnowledgeGraph",
                      "name": "KnowledgeGraph",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 92
                      },
                      "implementation": "interface KnowledgeGraph {\n    nodes: KnowledgeNode[];\n    edges: KnowledgeEdge[];\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#SearchOptions",
                      "name": "SearchOptions",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 96
                      },
                      "implementation": "interface SearchOptions {\n    entities: string[];\n    relationTypes?: string[];\n    maxDistance?: number;\n    limit?: number;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#Interface#SearchResult",
                      "name": "SearchResult",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 102
                      },
                      "implementation": "interface SearchResult {\n    nodes: KnowledgeNode[];\n    edges: KnowledgeEdge[];\n    metadata: {\n        totalNodes: number;\n        totalEdges: number;\n        entities: string[];\n        relationTypes: string[];\n        maxDistance: number;\n    };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts#GitIngest",
                      "name": "GitIngest",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.d.ts",
                          "line": 121
                      },
                      "implementation": "class GitIngest {\n    private git;\n    private scanner;\n    private analyzer;\n    private config;\n    constructor(config?: GitIngestConfig);\n    private cleanupTempDir;\n    private transformCustomDomainUrl;\n    private isCustomDomainUrl;\n    analyzeFromUrl(url: string, options?: AnalyzeOptions): Promise<AnalysisResult>;\n    analyzeFromDirectory(dirPath: string, options?: AnalyzeOptions): Promise<AnalysisResult>;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 46
                      },
                      "implementation": "constructor(message) {\n    super(message);\n    this.name = \"GitIngestError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 52
                      },
                      "implementation": "constructor(operation, details) {\n    super(`Git operation '${operation}' failed: ${details}`);\n    this.name = \"GitOperationError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 58
                      },
                      "implementation": "constructor(path3, reason) {\n    super(`Failed to process file '${path3}': ${reason}`);\n    this.name = \"FileProcessError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 64
                      },
                      "implementation": "constructor(message) {\n    super(`Validation failed: ${message}`);\n    this.name = \"ValidationError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 72
                      },
                      "implementation": "constructor() {\n    this.git = simpleGit({ baseDir: process.cwd() });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#clone",
                      "name": "clone",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 75
                      },
                      "implementation": "clone(url, path3) {\n    return __async(this, null, function* () {\n      try {\n        yield this.git.clone(url, path3);\n      } catch (error) {\n        throw new GitOperationError(\"clone\", error.message);\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#checkoutBranch",
                      "name": "checkoutBranch",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 84
                      },
                      "implementation": "checkoutBranch(path3, branch) {\n    return __async(this, null, function* () {\n      try {\n        const git = simpleGit(path3);\n        yield git.checkout(branch);\n      } catch (error) {\n        throw new GitOperationError(\"checkout\", error.message);\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#findRelatedNodes",
                      "name": "findRelatedNodes",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 102
                      },
                      "implementation": "function findRelatedNodes(graph, startNodes, maxDistance) {\n  const relatedNodes = /* @__PURE__ */ new Set();\n  const relatedEdges = /* @__PURE__ */ new Set();\n  const processedNodeIds = /* @__PURE__ */ new Set();\n  function processNode(node, distance) {\n    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n    processedNodeIds.add(node.id);\n    relatedNodes.add(node);\n    const directEdges = graph.edges.filter(\n      (edge) => edge.source === node.id || edge.target === node.id\n    );\n    directEdges.forEach((edge) => {\n      relatedEdges.add(edge);\n      const otherId = edge.source === node.id ? edge.target : edge.source;\n      const otherNode = graph.nodes.find((n) => n.id === otherId);\n      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n        processNode(otherNode, distance + 1);\n      }\n    });\n    if (node.type === \"class\") {\n      const methodNodes = graph.nodes.filter((n) => {\n        if (n.type !== \"function\" && n.type !== \"class_method\") return false;\n        if (n.filePath !== node.filePath) return false;\n        if (n.name === \"constructor\") return false;\n        const classNode = graph.nodes.find(\n          (c) => c.type === \"class\" && c.filePath === n.filePath && c.id === n.id.split(\"#\")[0] + \"#\" + node.name\n        );\n        return classNode !== void 0;\n      });\n      methodNodes.forEach((methodNode) => {\n        if (!processedNodeIds.has(methodNode.id)) {\n          const edge = {\n            source: node.id,\n            target: methodNode.id,\n            type: \"defines\",\n            properties: {}\n          };\n          relatedEdges.add(edge);\n          processNode(methodNode, distance + 1);\n        }\n      });\n    }\n    if (node.type === \"class\" && node.name.endsWith(\"Error\")) {\n      const parentNode = graph.nodes.find((n) => n.name === \"Error\");\n      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n        const edge = {\n          source: node.id,\n          target: \"Error\",\n          type: \"extends\",\n          properties: {}\n        };\n        relatedEdges.add(edge);\n        processNode(parentNode, distance + 1);\n      }\n    }\n  }\n  startNodes.forEach((node) => processNode(node, 0));\n  return {\n    nodes: Array.from(relatedNodes),\n    edges: Array.from(relatedEdges)\n  };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#processNode",
                      "name": "processNode",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 106
                      },
                      "implementation": "function processNode(node, distance) {\n    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n    processedNodeIds.add(node.id);\n    relatedNodes.add(node);\n    const directEdges = graph.edges.filter(\n      (edge) => edge.source === node.id || edge.target === node.id\n    );\n    directEdges.forEach((edge) => {\n      relatedEdges.add(edge);\n      const otherId = edge.source === node.id ? edge.target : edge.source;\n      const otherNode = graph.nodes.find((n) => n.id === otherId);\n      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n        processNode(otherNode, distance + 1);\n      }\n    });\n    if (node.type === \"class\") {\n      const methodNodes = graph.nodes.filter((n) => {\n        if (n.type !== \"function\" && n.type !== \"class_method\") return false;\n        if (n.filePath !== node.filePath) return false;\n        if (n.name === \"constructor\") return false;\n        const classNode = graph.nodes.find(\n          (c) => c.type === \"class\" && c.filePath === n.filePath && c.id === n.id.split(\"#\")[0] + \"#\" + node.name\n        );\n        return classNode !== void 0;\n      });\n      methodNodes.forEach((methodNode) => {\n        if (!processedNodeIds.has(methodNode.id)) {\n          const edge = {\n            source: node.id,\n            target: methodNode.id,\n            type: \"defines\",\n            properties: {}\n          };\n          relatedEdges.add(edge);\n          processNode(methodNode, distance + 1);\n        }\n      });\n    }\n    if (node.type === \"class\" && node.name.endsWith(\"Error\")) {\n      const parentNode = graph.nodes.find((n) => n.name === \"Error\");\n      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n        const edge = {\n          source: node.id,\n          target: \"Error\",\n          type: \"extends\",\n          properties: {}\n        };\n        relatedEdges.add(edge);\n        processNode(parentNode, distance + 1);\n      }\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#searchKnowledgeGraph",
                      "name": "searchKnowledgeGraph",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 164
                      },
                      "implementation": "function searchKnowledgeGraph(graph, options) {\n  const { entities, maxDistance = 2 } = options;\n  const startNodes = graph.nodes.filter(\n    (node) => entities.some((entity) => node.name === entity)\n  );\n  if (!startNodes.length) {\n    console.warn(`[Warning] No nodes found for entities:`, entities);\n    return {\n      nodes: [],\n      edges: [],\n      metadata: {\n        totalNodes: 0,\n        totalEdges: 0,\n        entities,\n        relationTypes: [],\n        maxDistance\n      }\n    };\n  }\n  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance);\n  const methodNodes = nodes.filter((n) => n.type === \"function\" || n.type === \"class_method\");\n  const classNodes = nodes.filter((n) => n.type === \"class\");\n  methodNodes.forEach((method) => {\n    const className = method.id.split(\"#\")[1];\n    const relatedClass = classNodes.find((c) => c.name === className);\n    if (relatedClass) {\n      edges.push({\n        source: relatedClass.id,\n        target: method.id,\n        type: \"defines\",\n        properties: {}\n      });\n    }\n  });\n  const errorClasses = classNodes.filter((n) => n.name.endsWith(\"Error\"));\n  errorClasses.forEach((errorClass) => {\n    edges.push({\n      source: errorClass.id,\n      target: \"Error\",\n      type: \"extends\",\n      properties: {}\n    });\n  });\n  return {\n    nodes,\n    edges,\n    metadata: {\n      totalNodes: nodes.length,\n      totalEdges: edges.length,\n      entities,\n      relationTypes: Array.from(new Set(edges.map((e) => e.type))),\n      maxDistance\n    }\n  };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#estimateTokens",
                      "name": "estimateTokens",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 221
                      },
                      "implementation": "function estimateTokens(text) {\n  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n  const otherChars = text.length - chineseChars;\n  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n  return Math.ceil(estimatedTokens * 1.1);\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#generateTree",
                      "name": "generateTree",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 227
                      },
                      "implementation": "function generateTree(files) {\n  const tree = {};\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = tree;\n    for (const part of parts.slice(0, -1)) {\n      if (!current[part]) {\n        current[part] = {};\n      }\n      current = current[part];\n    }\n    current[parts[parts.length - 1]] = null;\n  }\n  function stringify(node, prefix = \"\") {\n    let result = \"\";\n    const entries = Object.entries(node);\n    for (let i = 0; i < entries.length; i++) {\n      const [key, value] = entries[i];\n      const isLast = i === entries.length - 1;\n      const connector = isLast ? \"\\u2514\\u2500\\u2500 \" : \"\\u251C\\u2500\\u2500 \";\n      const childPrefix = isLast ? \"    \" : \"\\u2502   \";\n      result += prefix + connector + key + \"\\n\";\n      if (value !== null) {\n        result += stringify(value, prefix + childPrefix);\n      }\n    }\n    return result;\n  }\n  return stringify(tree);\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#stringify",
                      "name": "stringify",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 240
                      },
                      "implementation": "function stringify(node, prefix = \"\") {\n    let result = \"\";\n    const entries = Object.entries(node);\n    for (let i = 0; i < entries.length; i++) {\n      const [key, value] = entries[i];\n      const isLast = i === entries.length - 1;\n      const connector = isLast ? \"\\u2514\\u2500\\u2500 \" : \"\\u251C\\u2500\\u2500 \";\n      const childPrefix = isLast ? \"    \" : \"\\u2502   \";\n      result += prefix + connector + key + \"\\n\";\n      if (value !== null) {\n        result += stringify(value, prefix + childPrefix);\n      }\n    }\n    return result;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#buildSizeTree",
                      "name": "buildSizeTree",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 257
                      },
                      "implementation": "function buildSizeTree(files) {\n  const root = {\n    name: \"root\",\n    token: 0,\n    children: {},\n    isFile: false\n  };\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = root;\n    for (let i = 0; i < parts.length; i++) {\n      const part = parts[i];\n      const isLastPart = i === parts.length - 1;\n      if (!current.children[part]) {\n        current.children[part] = __spreadProps(__spreadValues({\n          name: part,\n          token: isLastPart ? file.token : 0\n        }, isLastPart && file.content ? { content: file.content } : {}), {\n          children: {},\n          isFile: isLastPart\n        });\n      }\n      current = current.children[part];\n    }\n  }\n  function calculateSize(node) {\n    if (node.isFile) {\n      return node.token;\n    }\n    let totalToken = 0;\n    for (const child of Object.values(node.children)) {\n      totalToken += calculateSize(child);\n    }\n    node.token = totalToken;\n    return totalToken;\n  }\n  calculateSize(root);\n  return root;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#calculateSize",
                      "name": "calculateSize",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 282
                      },
                      "implementation": "function calculateSize(node) {\n    if (node.isFile) {\n      return node.token;\n    }\n    let totalToken = 0;\n    for (const child of Object.values(node.children)) {\n      totalToken += calculateSize(child);\n    }\n    node.token = totalToken;\n    return totalToken;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 327
                      },
                      "implementation": "constructor() {\n    this.processedFiles = /* @__PURE__ */ new Set();\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#findModuleFile",
                      "name": "findModuleFile",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 331
                      },
                      "implementation": "findModuleFile(importPath, currentDir, basePath) {\n    return __async(this, null, function* () {\n      if (!importPath.startsWith(\".\")) {\n        return importPath;\n      }\n      const cleanCurrentDir = currentDir.replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\").replace(new RegExp(`^${basePath}/`), \"\");\n      const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n      const pathParts = resolvedPath.split(\"/\");\n      const fileName = pathParts.pop() || \"\";\n      const dirPath = pathParts.join(\"/\");\n      const getExtensions = (importName) => {\n        if (importName.toLowerCase().endsWith(\".css\")) {\n          return [\".css\", \".less\", \".scss\", \".sass\"];\n        }\n        return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n      };\n      const extensions = getExtensions(fileName);\n      const targetBasePath = join(basePath, dirPath);\n      if (!fileName.includes(\".\")) {\n        for (const ext of extensions) {\n          const fullPath = join(targetBasePath, fileName + ext);\n          try {\n            const stats = yield stat(fullPath);\n            if (stats.isFile()) {\n              return join(dirPath, fileName + ext).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n            }\n          } catch (error) {\n            continue;\n          }\n        }\n        const dirFullPath = join(targetBasePath, fileName);\n        try {\n          const stats = yield stat(dirFullPath);\n          if (stats.isDirectory()) {\n            for (const ext of extensions) {\n              const indexPath = join(dirFullPath, \"index\" + ext);\n              try {\n                const indexStats = yield stat(indexPath);\n                if (indexStats.isFile()) {\n                  return join(dirPath, fileName, \"index\" + ext).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n                }\n              } catch (error) {\n                continue;\n              }\n            }\n          }\n        } catch (error) {\n        }\n      } else {\n        const fullPath = join(targetBasePath, fileName);\n        try {\n          const stats = yield stat(fullPath);\n          if (stats.isFile()) {\n            return join(dirPath, fileName).replace(new RegExp(`^${basePath}/`), \"\").replace(/\\\\/g, \"/\");\n          }\n        } catch (error) {\n        }\n      }\n      return null;\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeDependencies",
                      "name": "analyzeDependencies",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 393
                      },
                      "implementation": "analyzeDependencies(content, filePath, basePath) {\n    return __async(this, null, function* () {\n      const dependencies = [];\n      const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n      const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n      const lines = contentWithoutComments.split(\"\\n\").filter((line) => {\n        const trimmed = line.trim();\n        return trimmed && !trimmed.startsWith(\"//\");\n      }).join(\"\\n\");\n      let match;\n      while ((match = importRegex.exec(lines)) !== null) {\n        const importPath = match[1];\n        const currentDir = dirname(filePath);\n        const resolvedPath = yield this.findModuleFile(\n          importPath,\n          currentDir,\n          basePath\n        );\n        if (resolvedPath && !dependencies.includes(resolvedPath)) {\n          dependencies.push(resolvedPath);\n        }\n      }\n      return dependencies;\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#scanDirectory",
                      "name": "scanDirectory",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 419
                      },
                      "implementation": "scanDirectory(path3, options) {\n    return __async(this, null, function* () {\n      if (!path3) {\n        throw new ValidationError(\"Path is required\");\n      }\n      try {\n        this.processedFiles.clear();\n        const allFiles = [];\n        if (options.targetPaths && options.targetPaths.length > 0) {\n          for (const targetPath of options.targetPaths) {\n            yield this.processFileAndDependencies(\n              path3,\n              targetPath,\n              options,\n              allFiles\n            );\n          }\n          return allFiles;\n        }\n        const files = yield glob(\"**/*\", {\n          cwd: path3,\n          ignore: [\n            ...options.excludePatterns || [],\n            \"**/node_modules/**\",\n            \"**/.git/**\"\n          ],\n          nodir: true,\n          absolute: false,\n          windowsPathsNoEscape: true\n        });\n        const results = yield Promise.all(\n          files.map((file) => this.processFile(path3, file, options))\n        );\n        return results.filter((file) => file !== null);\n      } catch (error) {\n        throw new FileProcessError(path3, error.message);\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#processFileAndDependencies",
                      "name": "processFileAndDependencies",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 459
                      },
                      "implementation": "processFileAndDependencies(basePath, relativePath, options, allFiles) {\n    return __async(this, null, function* () {\n      if (this.processedFiles.has(relativePath)) {\n        return;\n      }\n      const fileInfo = yield this.processFile(basePath, relativePath, options);\n      if (fileInfo) {\n        this.processedFiles.add(relativePath);\n        allFiles.push(fileInfo);\n        if (options.includeDependencies !== false) {\n          const dependencies = yield this.analyzeDependencies(\n            fileInfo.content,\n            relativePath,\n            basePath\n          );\n          for (const dep of dependencies) {\n            yield this.processFileAndDependencies(\n              basePath,\n              dep,\n              options,\n              allFiles\n            );\n          }\n        }\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#tryFindFile",
                      "name": "tryFindFile",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 487
                      },
                      "implementation": "tryFindFile(basePath, filePath, options) {\n    return __async(this, null, function* () {\n      try {\n        const stats = yield stat(filePath);\n        if (options.maxFileSize && stats.size > options.maxFileSize) {\n          return null;\n        }\n        const content = yield readFile(filePath, \"utf-8\");\n        const basePathParts = basePath.split(\"/\");\n        const deleteHashRepoName = basePathParts[basePathParts.length - 1].replace(/-[^-]*$/, \"\");\n        const relativePath = filePath.replace(new RegExp(`^${basePathParts[0]}/`), \"\").replace(\n          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n          deleteHashRepoName\n        ).replace(/\\\\/g, \"/\");\n        return {\n          path: relativePath,\n          content,\n          // size: stats.size,\n          token: estimateTokens(content)\n        };\n      } catch (error) {\n        return null;\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#processFile",
                      "name": "processFile",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 513
                      },
                      "implementation": "processFile(basePath, relativePath, options) {\n    return __async(this, null, function* () {\n      try {\n        const ext = relativePath.toLowerCase().split(\".\").pop();\n        if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n          return null;\n        }\n        const normalizedPath = relativePath.replace(/^[\\/\\\\]+/, \"\").replace(/\\\\/g, \"/\");\n        const pathParts = normalizedPath.split(\"/\");\n        const fileName = pathParts.pop() || \"\";\n        const dirPath = pathParts.join(\"/\");\n        const targetBasePath = join(basePath, dirPath);\n        const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n        if (!fileName.includes(\".\")) {\n          for (const ext2 of extensions) {\n            const fullPath = join(targetBasePath, fileName + ext2);\n            const result = yield this.tryFindFile(basePath, fullPath, options);\n            if (result) return result;\n          }\n          const dirFullPath = join(targetBasePath, fileName);\n          for (const ext2 of extensions) {\n            const indexPath = join(dirFullPath, \"index\" + ext2);\n            const result = yield this.tryFindFile(basePath, indexPath, options);\n            if (result) return result;\n          }\n        } else {\n          const fullPath = join(targetBasePath, fileName);\n          const result = yield this.tryFindFile(basePath, fullPath, options);\n          if (result) return result;\n        }\n        return null;\n      } catch (error) {\n        console.warn(`Warning: Failed to process file ${relativePath}: ${error}`);\n        return null;\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 557
                      },
                      "implementation": "constructor() {\n    this.codeElements = [];\n    this.relations = [];\n    this.currentFile = \"\";\n    this.currentClass = null;\n    this.currentFunctionId = null;\n    this.scopeStack = [];\n    this.parser = new Parser();\n    this.parser.setLanguage(TypeScript.typescript);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeCode",
                      "name": "analyzeCode",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 570
                      },
                      "implementation": "analyzeCode(filePath, sourceCode) {\n    if (!filePath) {\n      throw new Error(\"File path cannot be undefined\");\n    }\n    this.currentFile = filePath;\n    try {\n      const tree = this.parser.parse(sourceCode);\n      this.visitNode(tree.rootNode);\n    } catch (error) {\n      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#visitNode",
                      "name": "visitNode",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 585
                      },
                      "implementation": "visitNode(node) {\n    switch (node.type) {\n      case \"function_declaration\":\n      case \"method_definition\":\n      // 添加方法定义\n      case \"arrow_function\":\n        this.analyzeFunctionDeclaration(node);\n        break;\n      case \"class_declaration\":\n      case \"class\":\n        this.analyzeClassDeclaration(node, this.currentFile);\n        break;\n      case \"interface_declaration\":\n        this.analyzeInterface(node);\n        break;\n      case \"type_alias_declaration\":\n        this.analyzeTypeAlias(node);\n        break;\n      case \"call_expression\":\n      case \"new_expression\":\n        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n        break;\n      case \"import_declaration\":\n      case \"import_statement\":\n        this.analyzeImportStatement(node, this.currentFile);\n        break;\n      case \"variable_declaration\":\n        this.analyzeVariableDeclaration(node);\n        break;\n      case \"implements_clause\":\n        this.analyzeImplementsRelation(node);\n        break;\n    }\n    for (const child of node.children) {\n      this.visitNode(child);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeFunctionDeclaration",
                      "name": "analyzeFunctionDeclaration",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 625
                      },
                      "implementation": "analyzeFunctionDeclaration(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"function\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n    this.scopeStack.push(this.currentFunctionId);\n    this.addCodeElement(element);\n    this.currentFunctionId = null;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeClassDeclaration",
                      "name": "analyzeClassDeclaration",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 646
                      },
                      "implementation": "analyzeClassDeclaration(node, filePath) {\n    const className = this.getNodeName(node);\n    if (!className) return;\n    const classElement = {\n      type: \"class\",\n      name: className,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.addCodeElement(classElement);\n    this.currentClass = className;\n    const extendsClause = node.childForFieldName(\"extends\");\n    if (extendsClause) {\n      const superClassName = this.getNodeName(extendsClause);\n      if (superClassName) {\n        const currentClassId = `${this.currentFile}#${className}`;\n        const superClassId = this.resolveTypeReference(superClassName);\n        if (superClassId) {\n          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n          this.addRelation(currentClassId, superClassId, \"extends\");\n        }\n      }\n    }\n    for (const child of node.children) {\n      if (child.type === \"method_definition\" || child.type === \"constructor\") {\n        this.analyzeClassMethod(child, className);\n      }\n    }\n    const implementsClause = node.childForFieldName(\"implements\");\n    if (implementsClause) {\n      this.analyzeImplementsRelation(implementsClause);\n    }\n    this.currentClass = null;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeInterface",
                      "name": "analyzeInterface",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 687
                      },
                      "implementation": "analyzeInterface(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"interface\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      id: `${this.currentFile}#Interface#${nameNode.text}`,\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeCallExpression",
                      "name": "analyzeCallExpression",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 706
                      },
                      "implementation": "analyzeCallExpression(node, currentScope) {\n    const calleeName = this.resolveCallee(node);\n    if (calleeName) {\n      const currentNode = this.codeElements.find((e) => e.id === currentScope);\n      const calleeNode = this.codeElements.find((e) => e.id === calleeName);\n      if (currentNode && calleeNode) {\n        this.addRelation(currentScope, calleeName, \"calls\");\n      }\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeImportStatement",
                      "name": "analyzeImportStatement",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 719
                      },
                      "implementation": "analyzeImportStatement(node, filePath) {\n    const importPath = this.getImportPath(node);\n    if (importPath) {\n      this.addRelation(filePath, importPath, \"imports\");\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#normalizePath",
                      "name": "normalizePath",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 725
                      },
                      "implementation": "normalizePath(importPath) {\n    const builtinModules = [\"fs\", \"path\", \"crypto\", \"util\"];\n    if (builtinModules.includes(importPath)) {\n      return importPath;\n    }\n    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n    if (!fullPath.endsWith(\".ts\")) {\n      return `${fullPath}.ts`;\n    }\n    return fullPath;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#addCodeElement",
                      "name": "addCodeElement",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 739
                      },
                      "implementation": "addCodeElement(element) {\n    const elementId = (() => {\n      switch (element.type) {\n        case \"class\":\n          return `${element.filePath}#${element.name}`;\n        case \"class_method\":\n        case \"constructor\":\n          return `${element.filePath}#${element.className}#${element.name}`;\n        case \"interface\":\n          return `${element.filePath}#Interface#${element.name}`;\n        case \"type_alias\":\n          return `${element.filePath}#Type#${element.name}`;\n        default:\n          return `${element.filePath}#${element.name}`;\n      }\n    })();\n    const codeElement = __spreadProps(__spreadValues({}, element), {\n      id: elementId\n    });\n    this.codeElements.push(codeElement);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#addRelation",
                      "name": "addRelation",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 763
                      },
                      "implementation": "addRelation(source, target, type) {\n    const sourceNode = this.codeElements.find((e) => e.id === source);\n    const targetNode = this.codeElements.find((e) => e.id === target);\n    if (!sourceNode) {\n      return;\n    }\n    if (!targetNode) {\n      return;\n    }\n    const relation = {\n      sourceId: source,\n      targetId: target,\n      type\n    };\n    const exists = this.relations.some(\n      (r) => r.sourceId === source && r.targetId === target && r.type === type\n    );\n    if (!exists) {\n      this.relations.push(relation);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#getCodeIndex",
                      "name": "getCodeIndex",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 787
                      },
                      "implementation": "getCodeIndex() {\n    const codeIndex = /* @__PURE__ */ new Map();\n    this.codeElements.forEach((element) => {\n      const filePath = element.filePath;\n      const existingElements = codeIndex.get(filePath) || [];\n      existingElements.push(element);\n      codeIndex.set(filePath, existingElements);\n    });\n    return codeIndex;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#getKnowledgeGraph",
                      "name": "getKnowledgeGraph",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 800
                      },
                      "implementation": "getKnowledgeGraph() {\n    console.log(`[Debug] Generating knowledge graph:`, {\n      totalElements: this.codeElements.length,\n      totalRelations: this.relations.length\n    });\n    const nodes = this.codeElements.map((element) => ({\n      id: element.id,\n      name: element.name,\n      type: element.type,\n      filePath: element.filePath,\n      location: element.location,\n      implementation: element.implementation || \"\"\n      // 添加 implementation 字段\n    }));\n    const validRelations = this.relations.filter((relation) => {\n      const sourceExists = this.codeElements.some((e) => e.id === relation.sourceId);\n      const targetExists = this.codeElements.some((e) => e.id === relation.targetId);\n      if (!sourceExists || !targetExists) {\n        console.warn(`[Warning] Invalid relation:`, {\n          source: relation.sourceId,\n          target: relation.targetId,\n          type: relation.type,\n          sourceExists,\n          targetExists\n        });\n        return false;\n      }\n      return true;\n    });\n    const edges = validRelations.map((relation) => ({\n      source: relation.sourceId,\n      target: relation.targetId,\n      type: relation.type,\n      properties: {}\n    }));\n    console.log(`[Debug] Knowledge graph generated:`, {\n      nodes: nodes.length,\n      edges: edges.length,\n      relationTypes: new Set(edges.map((e) => e.type))\n    });\n    return { nodes, edges };\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#getElementsByType",
                      "name": "getElementsByType",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 845
                      },
                      "implementation": "getElementsByType(type) {\n    return this.codeElements.filter((element) => element.type === type);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#getElementRelations",
                      "name": "getElementRelations",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 851
                      },
                      "implementation": "getElementRelations(elementName) {\n    return this.relations.filter(\n      (edge) => edge.sourceId === elementName || edge.targetId === elementName\n    );\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#exportAnalysis",
                      "name": "exportAnalysis",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 859
                      },
                      "implementation": "exportAnalysis() {\n    return JSON.stringify({\n      codeElements: this.codeElements,\n      relations: this.relations\n    }, null, 2);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeVariableDeclaration",
                      "name": "analyzeVariableDeclaration",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 866
                      },
                      "implementation": "analyzeVariableDeclaration(node) {\n    const declarator = node.childForFieldName(\"declarator\");\n    const nameNode = declarator == null ? void 0 : declarator.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"variable\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#validateAnalysis",
                      "name": "validateAnalysis",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 882
                      },
                      "implementation": "validateAnalysis() {\n    let isValid = true;\n    const idSet = /* @__PURE__ */ new Set();\n    this.codeElements.forEach((node) => {\n      if (node.id && idSet.has(node.id)) {\n        console.error(`[Validation] \\u91CD\\u590D\\u8282\\u70B9ID: ${node.id}`);\n        isValid = false;\n      }\n      if (node.id) {\n        idSet.add(node.id);\n      }\n    });\n    this.relations.forEach((edge) => {\n      const sourceExists = this.codeElements.some((e) => e.id === edge.sourceId);\n      const targetExists = this.codeElements.some((e) => e.id === edge.targetId);\n      if (!sourceExists) {\n        console.error(`[Validation] \\u65E0\\u6548\\u5173\\u7CFB\\u6E90: ${edge.sourceId}`);\n        isValid = false;\n      }\n      if (!targetExists) {\n        console.error(`[Validation] \\u65E0\\u6548\\u5173\\u7CFB\\u76EE\\u6807: ${edge.targetId}`);\n        isValid = false;\n      }\n    });\n    return isValid;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#getNodeName",
                      "name": "getNodeName",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 908
                      },
                      "implementation": "getNodeName(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    return nameNode == null ? void 0 : nameNode.text;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#getImplementedInterfaces",
                      "name": "getImplementedInterfaces",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 912
                      },
                      "implementation": "getImplementedInterfaces(node) {\n    return node.text.replace(\"implements \", \"\").split(\",\").map((s) => s.trim());\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeClassMethod",
                      "name": "analyzeClassMethod",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 915
                      },
                      "implementation": "analyzeClassMethod(node, className) {\n    const isConstructor = node.type === \"constructor\";\n    const methodNameNode = isConstructor ? node.childForFieldName(\"name\") : node.childForFieldName(\"name\");\n    const methodName = (methodNameNode == null ? void 0 : methodNameNode.text) || \"anonymous\";\n    const element = {\n      type: isConstructor ? \"constructor\" : \"class_method\",\n      name: methodName,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      className\n    };\n    this.addCodeElement(element);\n    const classId = `${this.currentFile}#${className}`;\n    const methodId = `${this.currentFile}#${className}#${methodName}`;\n    console.log(`[Debug] Adding class method relation:`, {\n      class: className,\n      method: methodName,\n      classId,\n      methodId,\n      type: element.type\n    });\n    this.addRelation(classId, methodId, \"defines\");\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#validateMethodRelation",
                      "name": "validateMethodRelation",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 942
                      },
                      "implementation": "validateMethodRelation(classId, methodId) {\n    const classNode = this.codeElements.find((e) => e.id === classId);\n    const methodNode = this.codeElements.find((e) => e.id === methodId);\n    if (!classNode) {\n      console.error(`[Error] Class node not found: ${classId}`);\n      return false;\n    }\n    if (!methodNode) {\n      console.error(`[Error] Method node not found: ${methodId}`);\n      return false;\n    }\n    console.log(`[Debug] Validated method relation:`, {\n      class: classNode.name,\n      method: methodNode.name,\n      classId,\n      methodId\n    });\n    return true;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeImplementsRelation",
                      "name": "analyzeImplementsRelation",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 961
                      },
                      "implementation": "analyzeImplementsRelation(node) {\n    const interfaces = this.getImplementedInterfaces(node);\n    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n    interfaces.forEach((interfaceName) => {\n      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n      if (interfaceId) {\n        this.addRelation(currentClassId, interfaceId, \"implements\");\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeTypeAlias",
                      "name": "analyzeTypeAlias",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 971
                      },
                      "implementation": "analyzeTypeAlias(node) {\n    const nameNode = node.childForFieldName(\"name\");\n    if (!nameNode) return;\n    const element = {\n      type: \"type_alias\",\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      }\n    };\n    this.addCodeElement(element);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#resolveCallee",
                      "name": "resolveCallee",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 985
                      },
                      "implementation": "resolveCallee(node) {\n    const calleeNode = node.childForFieldName(\"function\");\n    if (!calleeNode) return void 0;\n    const calleeName = calleeNode.text;\n    const calleeClass = this.currentClass;\n    const possibleIds = [\n      `${this.currentFile}#${calleeName}`,\n      // 普通函数\n      `${this.currentFile}#${calleeClass}#${calleeName}`,\n      // 类方法\n      `${this.currentFile}#${calleeClass}#constructor`\n      // 构造函数\n    ];\n    for (const id of possibleIds) {\n      const element = this.codeElements.find((e) => e.id === id);\n      if (element) return id;\n    }\n    return void 0;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#getImportPath",
                      "name": "getImportPath",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 1004
                      },
                      "implementation": "getImportPath(node) {\n    const moduleNode = node.childForFieldName(\"source\");\n    if (!moduleNode) return \"\";\n    return moduleNode.text.replace(/['\"]/g, \"\");\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#resolveTypeReference",
                      "name": "resolveTypeReference",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 1009
                      },
                      "implementation": "resolveTypeReference(typeName) {\n    const element = this.codeElements.find((e) => e.name === typeName);\n    return element == null ? void 0 : element.id;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 1045
                      },
                      "implementation": "constructor(config) {\n    this.git = new GitAction();\n    this.scanner = new FileScanner();\n    this.analyzer = new CodeAnalyzer();\n    this.config = __spreadValues({\n      tempDir: \"repo\",\n      // 默认保存仓库的目录名(不会暴露到外部)\n      keepTempFiles: false,\n      // 默认不保留临时文件\n      defaultMaxFileSize: 1024 * 1024,\n      // 默认检索不超过 1MB 的文件\n      defaultPatterns: {\n        include: [\"**/*\"],\n        exclude: [\"**/node_modules/**\", \"**/.git/**\"]\n      }\n    }, config);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#cleanupTempDir",
                      "name": "cleanupTempDir",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 1063
                      },
                      "implementation": "cleanupTempDir(dirPath) {\n    return __async(this, null, function* () {\n      try {\n        if (existsSync(dirPath)) {\n          yield rm(dirPath, { recursive: true, force: true });\n        }\n      } catch (error) {\n        console.warn(\n          `Warning: Failed to cleanup temporary directory ${dirPath}: ${error.message}`\n        );\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#transformCustomDomainUrl",
                      "name": "transformCustomDomainUrl",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 1077
                      },
                      "implementation": "transformCustomDomainUrl(url) {\n    if (!this.config.customDomainMap) {\n      return url;\n    }\n    const { targetDomain, originalDomain } = this.config.customDomainMap;\n    if (url.includes(targetDomain)) {\n      return url.replace(targetDomain, originalDomain);\n    }\n    return url;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#isCustomDomainUrl",
                      "name": "isCustomDomainUrl",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 1088
                      },
                      "implementation": "isCustomDomainUrl(url) {\n    if (!this.config.customDomainMap) {\n      return false;\n    }\n    return url.includes(this.config.customDomainMap.targetDomain);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeFromUrl",
                      "name": "analyzeFromUrl",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 1095
                      },
                      "implementation": "analyzeFromUrl(url, options) {\n    return __async(this, null, function* () {\n      const isCustomDomain = this.isCustomDomainUrl(url);\n      const githubUrl = this.transformCustomDomainUrl(url);\n      if (!githubUrl) {\n        throw new ValidationError(\"URL is required\");\n      }\n      if (!githubUrl.match(/^https?:\\/\\//)) {\n        throw new ValidationError(\"Invalid URL format\");\n      }\n      if (!this.config.tempDir) {\n        throw new ValidationError(\"Temporary directory is required\");\n      }\n      const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n      const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n      const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n      const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n      let result;\n      try {\n        if (!existsSync(this.config.tempDir)) {\n          yield mkdir(this.config.tempDir, { recursive: true });\n        }\n        yield this.git.clone(githubUrl, workDir);\n        if (options == null ? void 0 : options.branch) {\n          yield this.git.checkoutBranch(workDir, options.branch);\n        }\n        result = yield this.analyzeFromDirectory(workDir, options);\n        if (!this.config.keepTempFiles) {\n          yield this.cleanupTempDir(workDir);\n        }\n        return result;\n      } catch (error) {\n        if (!this.config.keepTempFiles) {\n          yield this.cleanupTempDir(workDir);\n        }\n        if (error instanceof GitIngestError) {\n          throw error;\n        }\n        throw new GitIngestError(\n          `Failed to analyze repository: ${error.message}`\n        );\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeFromDirectory",
                      "name": "analyzeFromDirectory",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js",
                          "line": 1140
                      },
                      "implementation": "analyzeFromDirectory(dirPath, options) {\n    return __async(this, null, function* () {\n      var _a, _b;\n      if (!dirPath) {\n        throw new ValidationError(\"Path is required\");\n      }\n      if (!existsSync(dirPath)) {\n        throw new ValidationError(`Directory not found: ${dirPath}`);\n      }\n      try {\n        const files = yield this.scanner.scanDirectory(dirPath, {\n          maxFileSize: (options == null ? void 0 : options.maxFileSize) || this.config.defaultMaxFileSize,\n          includePatterns: (options == null ? void 0 : options.includePatterns) || ((_a = this.config.defaultPatterns) == null ? void 0 : _a.include),\n          excludePatterns: (options == null ? void 0 : options.excludePatterns) || ((_b = this.config.defaultPatterns) == null ? void 0 : _b.exclude),\n          targetPaths: options == null ? void 0 : options.targetPaths,\n          includeDependencies: true\n        });\n        if (files.length === 0) {\n          throw new ValidationError(\"No files found in the specified directory\");\n        }\n        this.analyzer = new CodeAnalyzer();\n        for (const file of files) {\n          try {\n            if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n              const content = file.content;\n              const absolutePath = path2.resolve(dirPath, file.path);\n              this.analyzer.analyzeCode(absolutePath, content);\n            }\n          } catch (error) {\n            console.warn(\n              `Warning: Failed to analyze file ${file.path}: ${error.message}`\n            );\n          }\n        }\n        const codeIndex = this.analyzer.getCodeIndex();\n        const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n        console.log(`Analysis complete. Found ${codeIndex.size} code elements`);\n        return {\n          metadata: {\n            files: files.length,\n            tokens: files.reduce((acc, file) => acc + file.token, 0)\n          },\n          totalCode: files,\n          fileTree: generateTree(files),\n          sizeTree: buildSizeTree(files),\n          codeAnalysis: { codeIndex, knowledgeGraph },\n          dependencyGraph: yield analyzeDependencies(dirPath + ((options == null ? void 0 : options.miniCommonRoot) || \"\"))\n        };\n      } catch (error) {\n        if (error instanceof GitIngestError) {\n          throw error;\n        }\n        throw new GitIngestError(\n          `Failed to analyze directory: ${error.message}`\n        );\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#Type#ElementType",
                      "name": "ElementType",
                      "type": "type_alias",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 9
                      },
                      "implementation": ""
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#Interface#CodeElement",
                      "name": "CodeElement",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 20
                      },
                      "implementation": "interface CodeElement {\n  id?: string;\n  type: ElementType;\n  name: string;\n  filePath: string;\n  className?: string;\n  location: {\n    file: string;\n    line: number;\n  };\n  implementation?: string;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#Type#RelationType",
                      "name": "RelationType",
                      "type": "type_alias",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 34
                      },
                      "implementation": ""
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#Interface#CodeRelation",
                      "name": "CodeRelation",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 42
                      },
                      "implementation": "interface CodeRelation {\n  sourceId: string;\n  targetId: string;\n  type: RelationType;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#Interface#KnowledgeGraph",
                      "name": "KnowledgeGraph",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 49
                      },
                      "implementation": "interface KnowledgeGraph extends IKnowledgeGraph {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#CodeAnalyzer",
                      "name": "CodeAnalyzer",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 54
                      },
                      "implementation": "class CodeAnalyzer {\n  private parser: Parser;\n  private codeElements: CodeElement[] = [];\n  private relations: CodeRelation[] = [];\n  private currentFile: string = '';\n  private currentClass: string | null = null;\n  private currentFunctionId: string | null = null;\n  private scopeStack: string[] = [];\n\n  constructor() {\n    this.parser = new Parser();\n    this.parser.setLanguage(TypeScript.typescript as any);\n  }\n\n  /**\n   * 分析代码文件\n   */\n  public analyzeCode(filePath: string, sourceCode: string): void {\n    if (!filePath) {\n      throw new Error('File path cannot be undefined');\n    }\n    this.currentFile = filePath;\n    try {\n      // console.log(`[CodeAnalyzer] Processing file: ${filePath}`);\n\n      const tree = this.parser.parse(sourceCode);\n      // console.log(`[CodeAnalyzer] AST generated for ${filePath}`);\n\n      this.visitNode(tree.rootNode);\n\n      // console.log(`[CodeAnalyzer] Analysis complete for ${filePath}`);\n      // console.log(`[CodeAnalyzer] Found ${this.codeElements.length} nodes`);\n      // console.log(`[CodeAnalyzer] Found ${this.relations.length} relationships`);\n    } catch (error) {\n      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n    }\n  }\n\n  /**\n   * 访问 AST 节点\n   */\n  private visitNode(node: Parser.SyntaxNode): void {\n    // 添加更多节点类型匹配\n    switch (node.type) {\n      case 'function_declaration':\n      case 'method_definition':  // 添加方法定义\n      case 'arrow_function':     // 添加箭头函数\n        this.analyzeFunctionDeclaration(node);\n        break;\n\n      case 'class_declaration':\n      case 'class':             // 添加类表达式\n        this.analyzeClassDeclaration(node, this.currentFile);\n        break;\n\n      case 'interface_declaration':\n        this.analyzeInterface(node);\n        break;\n\n      case 'type_alias_declaration':  // 添加类型别名\n        this.analyzeTypeAlias(node);\n        break;\n\n      case 'call_expression':\n      case 'new_expression':    // 添加 new 表达式\n        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n        break;\n\n      case 'import_declaration':\n      case 'import_statement':\n        this.analyzeImportStatement(node, this.currentFile);\n        break;\n\n      case 'variable_declaration':    // 添加变量声明\n        this.analyzeVariableDeclaration(node);\n        break;\n\n      case 'implements_clause':\n        this.analyzeImplementsRelation(node);\n        break;\n    }\n\n    // 递归访问子节点\n    for (const child of node.children) {\n      this.visitNode(child);\n    }\n  }\n\n  /**\n   * 分析函数声明\n   */\n  private analyzeFunctionDeclaration(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'function',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    // 设置当前函数上下文\n    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n    this.scopeStack.push(this.currentFunctionId);  // 使用栈维护嵌套调用\n    this.addCodeElement(element);\n    this.currentFunctionId = null; // 重置上下文\n  }\n\n  /**\n   * 分析类声明\n   */\n  private analyzeClassDeclaration(node: Parser.SyntaxNode, filePath: string): void {\n    const className = this.getNodeName(node);\n    if (!className) return;\n\n    // 1. 添加类定义\n    const classElement: CodeElement = {\n      type: 'class',\n      name: className,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    this.addCodeElement(classElement);\n    this.currentClass = className;\n\n    // 2. 分析继承关系\n    const extendsClause = node.childForFieldName('extends');\n    if (extendsClause) {\n      const superClassName = this.getNodeName(extendsClause);\n      if (superClassName) {\n        const currentClassId = `${this.currentFile}#${className}`;\n        const superClassId = this.resolveTypeReference(superClassName);\n        if (superClassId) {\n          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n          this.addRelation(currentClassId, superClassId, 'extends');\n        }\n      }\n    }\n\n    // 3. 分析类的方法\n    for (const child of node.children) {\n      if (child.type === 'method_definition' || child.type === 'constructor') {\n        this.analyzeClassMethod(child, className);\n      }\n    }\n\n    // 4. 分析接口实现\n    const implementsClause = node.childForFieldName('implements');\n    if (implementsClause) {\n      this.analyzeImplementsRelation(implementsClause);\n    }\n\n    this.currentClass = null;\n  }\n\n  /**\n   * 分析接口声明\n   */\n  private analyzeInterface(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'interface',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      id: `${this.currentFile}#Interface#${nameNode.text}`,\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }\n\n  /**\n   * 分析函数调用\n   */\n  private analyzeCallExpression(node: Parser.SyntaxNode, currentScope: string) {\n    const calleeName = this.resolveCallee(node);\n    if (calleeName) {\n      const currentNode = this.codeElements.find(e => e.id === currentScope);\n      const calleeNode = this.codeElements.find(e => e.id === calleeName);\n\n      if (currentNode && calleeNode) {\n        // console.log(`[Debug] Found call expression:`, {\n        //   caller: currentNode.name,\n        //   callee: calleeNode.name,\n        //   callerId: currentScope,\n        //   calleeId: calleeName\n        // });\n        this.addRelation(currentScope, calleeName, 'calls');\n      }\n    }\n  }\n\n  /**\n   * 分析导入声明\n   */\n  private analyzeImportStatement(node: Parser.SyntaxNode, filePath: string) {\n    const importPath = this.getImportPath(node);\n    if (importPath) {\n      // console.log(`[Debug] Found import:`, {\n      //   importer: filePath,\n      //   imported: importPath\n      // });\n      this.addRelation(filePath, importPath, 'imports');\n    }\n  }\n\n  private normalizePath(importPath: string): string {\n    // 内置模块列表\n    const builtinModules = ['fs', 'path', 'crypto', 'util'];\n\n    if (builtinModules.includes(importPath)) {\n      return importPath;\n    }\n\n    // 将相对路径转换为绝对路径\n    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n\n    // 确保路径以 .ts 结尾\n    if (!fullPath.endsWith('.ts')) {\n      return `${fullPath}.ts`;\n    }\n\n    return fullPath;\n  }\n\n  /**\n   * 添加代码元素\n   */\n  private addCodeElement(element: Omit<CodeElement, 'id'>): void {\n    const elementId = (() => {\n      switch (element.type) {\n        case 'class':\n          return `${element.filePath}#${element.name}`;\n        case 'class_method':\n        case 'constructor':\n          return `${element.filePath}#${element.className}#${element.name}`;\n        case 'interface':\n          return `${element.filePath}#Interface#${element.name}`;\n        case 'type_alias':\n          return `${element.filePath}#Type#${element.name}`;\n        default:\n          return `${element.filePath}#${element.name}`;\n      }\n    })();\n\n    const codeElement: CodeElement = {\n      ...element,\n      id: elementId\n    };\n\n    // console.log(`[Debug] Adding code element:`, {\n    //   type: element.type,\n    //   name: element.name,\n    //   id: elementId,\n    //   className: 'className' in element ? element.className : undefined\n    // });\n\n    this.codeElements.push(codeElement);\n  }\n\n  /**\n   * 添加关系\n   */\n  private addRelation(source: string, target: string, type: RelationType): void {\n    // 检查源节点和目标节点是否存在\n    const sourceNode = this.codeElements.find(e => e.id === source);\n    const targetNode = this.codeElements.find(e => e.id === target);\n\n    if (!sourceNode) {\n      // console.warn(`[Warning] Source node not found: ${source}`);\n      return;\n    }\n    if (!targetNode) {\n      // console.warn(`[Warning] Target node not found: ${target}`);\n      return;\n    }\n\n    const relation: CodeRelation = {\n      sourceId: source,\n      targetId: target,\n      type\n    };\n\n    // 检查是否已存在相同的关系\n    const exists = this.relations.some(r =>\n      r.sourceId === source &&\n      r.targetId === target &&\n      r.type === type\n    );\n\n    if (!exists) {\n      this.relations.push(relation);\n      // console.log(`[Debug] Added relation: ${sourceNode.name} -[${type}]-> ${targetNode.name}`);\n    }\n  }\n\n  /**\n   * 获取代码索引\n   */\n  public getCodeIndex(): Map<string, CodeElement[]> {\n    const codeIndex = new Map<string, CodeElement[]>();\n    this.codeElements.forEach(element => {\n      const filePath = element.filePath;\n      const existingElements = codeIndex.get(filePath) || [];\n      existingElements.push(element);\n      codeIndex.set(filePath, existingElements);\n    });\n    return codeIndex;\n  }\n\n  /**\n   * 获取知识图谱\n   */\n  public getKnowledgeGraph(): KnowledgeGraph {\n    console.log(`[Debug] Generating knowledge graph:`, {\n      totalElements: this.codeElements.length,\n      totalRelations: this.relations.length\n    });\n\n    // 1. 先转换节点,添加 implementation 字段\n    const nodes: KnowledgeNode[] = this.codeElements.map(element => ({\n      id: element.id!,\n      name: element.name,\n      type: element.type,\n      filePath: element.filePath,\n      location: element.location,\n      implementation: element.implementation || '' // 添加 implementation 字段\n    }));\n\n    // 2. 验证所有关系\n    const validRelations = this.relations.filter(relation => {\n      const sourceExists = this.codeElements.some(e => e.id === relation.sourceId);\n      const targetExists = this.codeElements.some(e => e.id === relation.targetId);\n\n      if (!sourceExists || !targetExists) {\n        console.warn(`[Warning] Invalid relation:`, {\n          source: relation.sourceId,\n          target: relation.targetId,\n          type: relation.type,\n          sourceExists,\n          targetExists\n        });\n        return false;\n      }\n      return true;\n    });\n\n    // 3. 转换关系\n    const edges: KnowledgeEdge[] = validRelations.map(relation => ({\n      source: relation.sourceId,\n      target: relation.targetId,\n      type: relation.type,\n      properties: {}\n    }));\n\n    console.log(`[Debug] Knowledge graph generated:`, {\n      nodes: nodes.length,\n      edges: edges.length,\n      relationTypes: new Set(edges.map(e => e.type))\n    });\n\n    return { nodes, edges };\n  }\n\n  /**\n   * 获取特定类型的所有元素\n   */\n  public getElementsByType(type: ElementType): CodeElement[] {\n    return this.codeElements.filter(element => element.type === type);\n  }\n\n  /**\n   * 获取特定元素的所有关系\n   */\n  public getElementRelations(elementName: string): CodeRelation[] {\n    return this.relations.filter(\n      edge => edge.sourceId === elementName || edge.targetId === elementName\n    );\n  }\n\n  /**\n   * 导出分析结果\n   */\n  public exportAnalysis(): string {\n    return JSON.stringify({\n      codeElements: this.codeElements,\n      relations: this.relations\n    }, null, 2);\n  }\n\n  // 添加变量声明分析\n  private analyzeVariableDeclaration(node: Parser.SyntaxNode): void {\n    const declarator = node.childForFieldName('declarator');\n    const nameNode = declarator?.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'variable',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    this.addCodeElement(element);\n  }\n\n  public validateAnalysis(): boolean {\n    let isValid = true;\n\n    // 唯一性检查\n    const idSet = new Set<string>();\n    this.codeElements.forEach(node => {\n      if (node.id && idSet.has(node.id)) {\n        console.error(`[Validation] 重复节点ID: ${node.id}`);\n        isValid = false;\n      }\n      if (node.id) {\n        idSet.add(node.id);\n      }\n    });\n\n    // 关系有效性检查\n    this.relations.forEach(edge => {\n      const sourceExists = this.codeElements.some(e => e.id === edge.sourceId);\n      const targetExists = this.codeElements.some(e => e.id === edge.targetId);\n\n      if (!sourceExists) {\n        console.error(`[Validation] 无效关系源: ${edge.sourceId}`);\n        isValid = false;\n      }\n      if (!targetExists) {\n        console.error(`[Validation] 无效关系目标: ${edge.targetId}`);\n        isValid = false;\n      }\n    });\n\n    return isValid;\n  }\n\n  private getNodeName(node: Parser.SyntaxNode): string | undefined {\n    const nameNode = node.childForFieldName('name');\n    return nameNode?.text;\n  }\n\n  private getImplementedInterfaces(node: Parser.SyntaxNode): string[] {\n    return node.text.replace('implements ', '').split(',').map(s => s.trim());\n  }\n\n  private analyzeClassMethod(node: Parser.SyntaxNode, className: string): void {\n    const isConstructor = node.type === 'constructor';\n    const methodNameNode = isConstructor\n      ? node.childForFieldName('name')\n      : node.childForFieldName('name');\n\n    const methodName = methodNameNode?.text || 'anonymous';\n\n    // 1. 添加方法定义\n    const element: CodeElement = {\n      type: isConstructor ? 'constructor' : 'class_method',\n      name: methodName,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      className\n    };\n\n    this.addCodeElement(element);\n\n    // 2. 添加类定义方法的关系\n    const classId = `${this.currentFile}#${className}`;\n    const methodId = `${this.currentFile}#${className}#${methodName}`;\n\n    console.log(`[Debug] Adding class method relation:`, {\n      class: className,\n      method: methodName,\n      classId,\n      methodId,\n      type: element.type\n    });\n\n    this.addRelation(classId, methodId, 'defines');\n  }\n\n  // 添加一个辅助方法来验证关系\n  private validateMethodRelation(classId: string, methodId: string): boolean {\n    const classNode = this.codeElements.find(e => e.id === classId);\n    const methodNode = this.codeElements.find(e => e.id === methodId);\n\n    if (!classNode) {\n      console.error(`[Error] Class node not found: ${classId}`);\n      return false;\n    }\n    if (!methodNode) {\n      console.error(`[Error] Method node not found: ${methodId}`);\n      return false;\n    }\n\n    console.log(`[Debug] Validated method relation:`, {\n      class: classNode.name,\n      method: methodNode.name,\n      classId,\n      methodId\n    });\n\n    return true;\n  }\n\n  private analyzeImplementsRelation(node: Parser.SyntaxNode): void {\n    const interfaces = this.getImplementedInterfaces(node);\n    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n\n    interfaces.forEach(interfaceName => {\n      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n      if (interfaceId) {\n        this.addRelation(currentClassId, interfaceId, 'implements');\n      }\n    });\n  }\n\n  private analyzeTypeAlias(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'type_alias',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      }\n    };\n    this.addCodeElement(element);\n  }\n\n  private resolveCallee(node: Parser.SyntaxNode): string | undefined {\n    const calleeNode = node.childForFieldName('function');\n    if (!calleeNode) return undefined;\n\n    // 通过完整路径查找元素\n    const calleeName = calleeNode.text;\n    const calleeClass = this.currentClass;\n\n    // 构建可能的ID格式\n    const possibleIds = [\n      `${this.currentFile}#${calleeName}`,                    // 普通函数\n      `${this.currentFile}#${calleeClass}#${calleeName}`,    // 类方法\n      `${this.currentFile}#${calleeClass}#constructor`        // 构造函数\n    ];\n\n    // 查找匹配的元素\n    for (const id of possibleIds) {\n      const element = this.codeElements.find(e => e.id === id);\n      if (element) return id;\n    }\n\n    return undefined;\n  }\n\n  private getImportPath(node: Parser.SyntaxNode): string {\n    const moduleNode = node.childForFieldName('source');\n    if (!moduleNode) return '';\n\n    // 移除引号\n    return moduleNode.text.replace(/['\"]/g, '');\n  }\n\n  private resolveTypeReference(typeName: string): string | undefined {\n    const element = this.codeElements.find(e => e.name === typeName);\n    return element?.id;\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 63
                      },
                      "implementation": "constructor() {\n    this.parser = new Parser();\n    this.parser.setLanguage(TypeScript.typescript as any);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeCode",
                      "name": "analyzeCode",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 71
                      },
                      "implementation": "public analyzeCode(filePath: string, sourceCode: string): void {\n    if (!filePath) {\n      throw new Error('File path cannot be undefined');\n    }\n    this.currentFile = filePath;\n    try {\n      // console.log(`[CodeAnalyzer] Processing file: ${filePath}`);\n\n      const tree = this.parser.parse(sourceCode);\n      // console.log(`[CodeAnalyzer] AST generated for ${filePath}`);\n\n      this.visitNode(tree.rootNode);\n\n      // console.log(`[CodeAnalyzer] Analysis complete for ${filePath}`);\n      // console.log(`[CodeAnalyzer] Found ${this.codeElements.length} nodes`);\n      // console.log(`[CodeAnalyzer] Found ${this.relations.length} relationships`);\n    } catch (error) {\n      console.error(`[CodeAnalyzer] Error analyzing file ${filePath}:`, error);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#visitNode",
                      "name": "visitNode",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 95
                      },
                      "implementation": "private visitNode(node: Parser.SyntaxNode): void {\n    // 添加更多节点类型匹配\n    switch (node.type) {\n      case 'function_declaration':\n      case 'method_definition':  // 添加方法定义\n      case 'arrow_function':     // 添加箭头函数\n        this.analyzeFunctionDeclaration(node);\n        break;\n\n      case 'class_declaration':\n      case 'class':             // 添加类表达式\n        this.analyzeClassDeclaration(node, this.currentFile);\n        break;\n\n      case 'interface_declaration':\n        this.analyzeInterface(node);\n        break;\n\n      case 'type_alias_declaration':  // 添加类型别名\n        this.analyzeTypeAlias(node);\n        break;\n\n      case 'call_expression':\n      case 'new_expression':    // 添加 new 表达式\n        this.analyzeCallExpression(node, this.scopeStack[this.scopeStack.length - 1]);\n        break;\n\n      case 'import_declaration':\n      case 'import_statement':\n        this.analyzeImportStatement(node, this.currentFile);\n        break;\n\n      case 'variable_declaration':    // 添加变量声明\n        this.analyzeVariableDeclaration(node);\n        break;\n\n      case 'implements_clause':\n        this.analyzeImplementsRelation(node);\n        break;\n    }\n\n    // 递归访问子节点\n    for (const child of node.children) {\n      this.visitNode(child);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeFunctionDeclaration",
                      "name": "analyzeFunctionDeclaration",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 145
                      },
                      "implementation": "private analyzeFunctionDeclaration(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'function',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    // 设置当前函数上下文\n    this.currentFunctionId = `${this.currentFile}#${nameNode.text}`;\n    this.scopeStack.push(this.currentFunctionId);  // 使用栈维护嵌套调用\n    this.addCodeElement(element);\n    this.currentFunctionId = null; // 重置上下文\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeClassDeclaration",
                      "name": "analyzeClassDeclaration",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 170
                      },
                      "implementation": "private analyzeClassDeclaration(node: Parser.SyntaxNode, filePath: string): void {\n    const className = this.getNodeName(node);\n    if (!className) return;\n\n    // 1. 添加类定义\n    const classElement: CodeElement = {\n      type: 'class',\n      name: className,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    this.addCodeElement(classElement);\n    this.currentClass = className;\n\n    // 2. 分析继承关系\n    const extendsClause = node.childForFieldName('extends');\n    if (extendsClause) {\n      const superClassName = this.getNodeName(extendsClause);\n      if (superClassName) {\n        const currentClassId = `${this.currentFile}#${className}`;\n        const superClassId = this.resolveTypeReference(superClassName);\n        if (superClassId) {\n          console.log(`[Debug] Adding extends relation: ${className} extends ${superClassName}`);\n          this.addRelation(currentClassId, superClassId, 'extends');\n        }\n      }\n    }\n\n    // 3. 分析类的方法\n    for (const child of node.children) {\n      if (child.type === 'method_definition' || child.type === 'constructor') {\n        this.analyzeClassMethod(child, className);\n      }\n    }\n\n    // 4. 分析接口实现\n    const implementsClause = node.childForFieldName('implements');\n    if (implementsClause) {\n      this.analyzeImplementsRelation(implementsClause);\n    }\n\n    this.currentClass = null;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeInterface",
                      "name": "analyzeInterface",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 222
                      },
                      "implementation": "private analyzeInterface(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'interface',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      id: `${this.currentFile}#Interface#${nameNode.text}`,\n      implementation: node.text\n    };\n    this.addCodeElement(element);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeCallExpression",
                      "name": "analyzeCallExpression",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 243
                      },
                      "implementation": "private analyzeCallExpression(node: Parser.SyntaxNode, currentScope: string) {\n    const calleeName = this.resolveCallee(node);\n    if (calleeName) {\n      const currentNode = this.codeElements.find(e => e.id === currentScope);\n      const calleeNode = this.codeElements.find(e => e.id === calleeName);\n\n      if (currentNode && calleeNode) {\n        // console.log(`[Debug] Found call expression:`, {\n        //   caller: currentNode.name,\n        //   callee: calleeNode.name,\n        //   callerId: currentScope,\n        //   calleeId: calleeName\n        // });\n        this.addRelation(currentScope, calleeName, 'calls');\n      }\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeImportStatement",
                      "name": "analyzeImportStatement",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 264
                      },
                      "implementation": "private analyzeImportStatement(node: Parser.SyntaxNode, filePath: string) {\n    const importPath = this.getImportPath(node);\n    if (importPath) {\n      // console.log(`[Debug] Found import:`, {\n      //   importer: filePath,\n      //   imported: importPath\n      // });\n      this.addRelation(filePath, importPath, 'imports');\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#normalizePath",
                      "name": "normalizePath",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 275
                      },
                      "implementation": "private normalizePath(importPath: string): string {\n    // 内置模块列表\n    const builtinModules = ['fs', 'path', 'crypto', 'util'];\n\n    if (builtinModules.includes(importPath)) {\n      return importPath;\n    }\n\n    // 将相对路径转换为绝对路径\n    const fullPath = path.resolve(path.dirname(this.currentFile), importPath);\n\n    // 确保路径以 .ts 结尾\n    if (!fullPath.endsWith('.ts')) {\n      return `${fullPath}.ts`;\n    }\n\n    return fullPath;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#addCodeElement",
                      "name": "addCodeElement",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 297
                      },
                      "implementation": "private addCodeElement(element: Omit<CodeElement, 'id'>): void {\n    const elementId = (() => {\n      switch (element.type) {\n        case 'class':\n          return `${element.filePath}#${element.name}`;\n        case 'class_method':\n        case 'constructor':\n          return `${element.filePath}#${element.className}#${element.name}`;\n        case 'interface':\n          return `${element.filePath}#Interface#${element.name}`;\n        case 'type_alias':\n          return `${element.filePath}#Type#${element.name}`;\n        default:\n          return `${element.filePath}#${element.name}`;\n      }\n    })();\n\n    const codeElement: CodeElement = {\n      ...element,\n      id: elementId\n    };\n\n    // console.log(`[Debug] Adding code element:`, {\n    //   type: element.type,\n    //   name: element.name,\n    //   id: elementId,\n    //   className: 'className' in element ? element.className : undefined\n    // });\n\n    this.codeElements.push(codeElement);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#addRelation",
                      "name": "addRelation",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 332
                      },
                      "implementation": "private addRelation(source: string, target: string, type: RelationType): void {\n    // 检查源节点和目标节点是否存在\n    const sourceNode = this.codeElements.find(e => e.id === source);\n    const targetNode = this.codeElements.find(e => e.id === target);\n\n    if (!sourceNode) {\n      // console.warn(`[Warning] Source node not found: ${source}`);\n      return;\n    }\n    if (!targetNode) {\n      // console.warn(`[Warning] Target node not found: ${target}`);\n      return;\n    }\n\n    const relation: CodeRelation = {\n      sourceId: source,\n      targetId: target,\n      type\n    };\n\n    // 检查是否已存在相同的关系\n    const exists = this.relations.some(r =>\n      r.sourceId === source &&\n      r.targetId === target &&\n      r.type === type\n    );\n\n    if (!exists) {\n      this.relations.push(relation);\n      // console.log(`[Debug] Added relation: ${sourceNode.name} -[${type}]-> ${targetNode.name}`);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#getCodeIndex",
                      "name": "getCodeIndex",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 368
                      },
                      "implementation": "public getCodeIndex(): Map<string, CodeElement[]> {\n    const codeIndex = new Map<string, CodeElement[]>();\n    this.codeElements.forEach(element => {\n      const filePath = element.filePath;\n      const existingElements = codeIndex.get(filePath) || [];\n      existingElements.push(element);\n      codeIndex.set(filePath, existingElements);\n    });\n    return codeIndex;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#getKnowledgeGraph",
                      "name": "getKnowledgeGraph",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 382
                      },
                      "implementation": "public getKnowledgeGraph(): KnowledgeGraph {\n    console.log(`[Debug] Generating knowledge graph:`, {\n      totalElements: this.codeElements.length,\n      totalRelations: this.relations.length\n    });\n\n    // 1. 先转换节点,添加 implementation 字段\n    const nodes: KnowledgeNode[] = this.codeElements.map(element => ({\n      id: element.id!,\n      name: element.name,\n      type: element.type,\n      filePath: element.filePath,\n      location: element.location,\n      implementation: element.implementation || '' // 添加 implementation 字段\n    }));\n\n    // 2. 验证所有关系\n    const validRelations = this.relations.filter(relation => {\n      const sourceExists = this.codeElements.some(e => e.id === relation.sourceId);\n      const targetExists = this.codeElements.some(e => e.id === relation.targetId);\n\n      if (!sourceExists || !targetExists) {\n        console.warn(`[Warning] Invalid relation:`, {\n          source: relation.sourceId,\n          target: relation.targetId,\n          type: relation.type,\n          sourceExists,\n          targetExists\n        });\n        return false;\n      }\n      return true;\n    });\n\n    // 3. 转换关系\n    const edges: KnowledgeEdge[] = validRelations.map(relation => ({\n      source: relation.sourceId,\n      target: relation.targetId,\n      type: relation.type,\n      properties: {}\n    }));\n\n    console.log(`[Debug] Knowledge graph generated:`, {\n      nodes: nodes.length,\n      edges: edges.length,\n      relationTypes: new Set(edges.map(e => e.type))\n    });\n\n    return { nodes, edges };\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#getElementsByType",
                      "name": "getElementsByType",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 436
                      },
                      "implementation": "public getElementsByType(type: ElementType): CodeElement[] {\n    return this.codeElements.filter(element => element.type === type);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#getElementRelations",
                      "name": "getElementRelations",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 443
                      },
                      "implementation": "public getElementRelations(elementName: string): CodeRelation[] {\n    return this.relations.filter(\n      edge => edge.sourceId === elementName || edge.targetId === elementName\n    );\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#exportAnalysis",
                      "name": "exportAnalysis",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 452
                      },
                      "implementation": "public exportAnalysis(): string {\n    return JSON.stringify({\n      codeElements: this.codeElements,\n      relations: this.relations\n    }, null, 2);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeVariableDeclaration",
                      "name": "analyzeVariableDeclaration",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 460
                      },
                      "implementation": "private analyzeVariableDeclaration(node: Parser.SyntaxNode): void {\n    const declarator = node.childForFieldName('declarator');\n    const nameNode = declarator?.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'variable',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      },\n      implementation: node.text\n    };\n\n    this.addCodeElement(element);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#validateAnalysis",
                      "name": "validateAnalysis",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 479
                      },
                      "implementation": "public validateAnalysis(): boolean {\n    let isValid = true;\n\n    // 唯一性检查\n    const idSet = new Set<string>();\n    this.codeElements.forEach(node => {\n      if (node.id && idSet.has(node.id)) {\n        console.error(`[Validation] 重复节点ID: ${node.id}`);\n        isValid = false;\n      }\n      if (node.id) {\n        idSet.add(node.id);\n      }\n    });\n\n    // 关系有效性检查\n    this.relations.forEach(edge => {\n      const sourceExists = this.codeElements.some(e => e.id === edge.sourceId);\n      const targetExists = this.codeElements.some(e => e.id === edge.targetId);\n\n      if (!sourceExists) {\n        console.error(`[Validation] 无效关系源: ${edge.sourceId}`);\n        isValid = false;\n      }\n      if (!targetExists) {\n        console.error(`[Validation] 无效关系目标: ${edge.targetId}`);\n        isValid = false;\n      }\n    });\n\n    return isValid;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#getNodeName",
                      "name": "getNodeName",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 512
                      },
                      "implementation": "private getNodeName(node: Parser.SyntaxNode): string | undefined {\n    const nameNode = node.childForFieldName('name');\n    return nameNode?.text;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#getImplementedInterfaces",
                      "name": "getImplementedInterfaces",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 517
                      },
                      "implementation": "private getImplementedInterfaces(node: Parser.SyntaxNode): string[] {\n    return node.text.replace('implements ', '').split(',').map(s => s.trim());\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeClassMethod",
                      "name": "analyzeClassMethod",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 521
                      },
                      "implementation": "private analyzeClassMethod(node: Parser.SyntaxNode, className: string): void {\n    const isConstructor = node.type === 'constructor';\n    const methodNameNode = isConstructor\n      ? node.childForFieldName('name')\n      : node.childForFieldName('name');\n\n    const methodName = methodNameNode?.text || 'anonymous';\n\n    // 1. 添加方法定义\n    const element: CodeElement = {\n      type: isConstructor ? 'constructor' : 'class_method',\n      name: methodName,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: node.startPosition.row + 1\n      },\n      className\n    };\n\n    this.addCodeElement(element);\n\n    // 2. 添加类定义方法的关系\n    const classId = `${this.currentFile}#${className}`;\n    const methodId = `${this.currentFile}#${className}#${methodName}`;\n\n    console.log(`[Debug] Adding class method relation:`, {\n      class: className,\n      method: methodName,\n      classId,\n      methodId,\n      type: element.type\n    });\n\n    this.addRelation(classId, methodId, 'defines');\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#validateMethodRelation",
                      "name": "validateMethodRelation",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 559
                      },
                      "implementation": "private validateMethodRelation(classId: string, methodId: string): boolean {\n    const classNode = this.codeElements.find(e => e.id === classId);\n    const methodNode = this.codeElements.find(e => e.id === methodId);\n\n    if (!classNode) {\n      console.error(`[Error] Class node not found: ${classId}`);\n      return false;\n    }\n    if (!methodNode) {\n      console.error(`[Error] Method node not found: ${methodId}`);\n      return false;\n    }\n\n    console.log(`[Debug] Validated method relation:`, {\n      class: classNode.name,\n      method: methodNode.name,\n      classId,\n      methodId\n    });\n\n    return true;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeImplementsRelation",
                      "name": "analyzeImplementsRelation",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 582
                      },
                      "implementation": "private analyzeImplementsRelation(node: Parser.SyntaxNode): void {\n    const interfaces = this.getImplementedInterfaces(node);\n    const currentClassId = `${this.currentFile}#${this.currentClass}`;\n\n    interfaces.forEach(interfaceName => {\n      const interfaceId = this.resolveTypeReference(interfaceName.trim());\n      if (interfaceId) {\n        this.addRelation(currentClassId, interfaceId, 'implements');\n      }\n    });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#analyzeTypeAlias",
                      "name": "analyzeTypeAlias",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 594
                      },
                      "implementation": "private analyzeTypeAlias(node: Parser.SyntaxNode): void {\n    const nameNode = node.childForFieldName('name');\n    if (!nameNode) return;\n\n    const element: CodeElement = {\n      type: 'type_alias',\n      name: nameNode.text,\n      filePath: this.currentFile,\n      location: {\n        file: this.currentFile,\n        line: nameNode.startPosition.row + 1\n      }\n    };\n    this.addCodeElement(element);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#resolveCallee",
                      "name": "resolveCallee",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 610
                      },
                      "implementation": "private resolveCallee(node: Parser.SyntaxNode): string | undefined {\n    const calleeNode = node.childForFieldName('function');\n    if (!calleeNode) return undefined;\n\n    // 通过完整路径查找元素\n    const calleeName = calleeNode.text;\n    const calleeClass = this.currentClass;\n\n    // 构建可能的ID格式\n    const possibleIds = [\n      `${this.currentFile}#${calleeName}`,                    // 普通函数\n      `${this.currentFile}#${calleeClass}#${calleeName}`,    // 类方法\n      `${this.currentFile}#${calleeClass}#constructor`        // 构造函数\n    ];\n\n    // 查找匹配的元素\n    for (const id of possibleIds) {\n      const element = this.codeElements.find(e => e.id === id);\n      if (element) return id;\n    }\n\n    return undefined;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#getImportPath",
                      "name": "getImportPath",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 634
                      },
                      "implementation": "private getImportPath(node: Parser.SyntaxNode): string {\n    const moduleNode = node.childForFieldName('source');\n    if (!moduleNode) return '';\n\n    // 移除引号\n    return moduleNode.text.replace(/['\"]/g, '');\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts#resolveTypeReference",
                      "name": "resolveTypeReference",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/codeAnalyzer.ts",
                          "line": 642
                      },
                      "implementation": "private resolveTypeReference(typeName: string): string | undefined {\n    const element = this.codeElements.find(e => e.name === typeName);\n    return element?.id;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#Interface#KnowledgeNode",
                      "name": "KnowledgeNode",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 1
                      },
                      "implementation": "interface KnowledgeNode {\n  id: string;\n  name: string;\n  type: string;\n  filePath: string;\n  location: {\n    file: string;\n    line: number;\n  };\n  description?: string;\n  properties?: Record<string, any>;\n  implementation?: string;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#Interface#KnowledgeEdge",
                      "name": "KnowledgeEdge",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 15
                      },
                      "implementation": "interface KnowledgeEdge {\n  source: string;\n  target: string;\n  type: string;\n  properties?: Record<string, any>;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#Interface#KnowledgeGraph",
                      "name": "KnowledgeGraph",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 22
                      },
                      "implementation": "interface KnowledgeGraph {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#Interface#SearchOptions",
                      "name": "SearchOptions",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 27
                      },
                      "implementation": "interface SearchOptions {\n  entities: string[];         // 实体名称数组\n  relationTypes?: string[];   // 按关系类型过滤\n  maxDistance?: number;       // 关系距离限制\n  limit?: number;             // 结果数量限制\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#Interface#SearchResult",
                      "name": "SearchResult",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 34
                      },
                      "implementation": "interface SearchResult {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n  metadata: {\n    totalNodes: number;\n    totalEdges: number;\n    entities: string[];\n    relationTypes: string[];\n    maxDistance: number;\n  };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#Interface#RelatedNodesResult",
                      "name": "RelatedNodesResult",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 46
                      },
                      "implementation": "interface RelatedNodesResult {\n  nodes: KnowledgeNode[];\n  edges: KnowledgeEdge[];\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#findRelatedNodes",
                      "name": "findRelatedNodes",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 51
                      },
                      "implementation": "function findRelatedNodes(\n  graph: KnowledgeGraph,\n  startNodes: KnowledgeNode[],\n  maxDistance: number\n): RelatedNodesResult {\n  const relatedNodes = new Set<KnowledgeNode>();\n  const relatedEdges = new Set<KnowledgeEdge>();\n  const processedNodeIds = new Set<string>();\n\n  function processNode(node: KnowledgeNode, distance: number) {\n    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n    processedNodeIds.add(node.id);\n    relatedNodes.add(node);\n\n    // 1. 查找直接相关的边\n    const directEdges = graph.edges.filter(edge =>\n      edge.source === node.id || edge.target === node.id\n    );\n\n    directEdges.forEach(edge => {\n      relatedEdges.add(edge);\n\n      // 处理边的另一端节点\n      const otherId = edge.source === node.id ? edge.target : edge.source;\n      const otherNode = graph.nodes.find(n => n.id === otherId);\n\n      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n        processNode(otherNode, distance + 1);\n      }\n    });\n\n    // 2. 查找类和方法的关系\n    if (node.type === 'class') {\n      // 先找到类的所有方法\n      const methodNodes = graph.nodes.filter(n => {\n        if (n.type !== 'function' && n.type !== 'class_method') return false;\n        if (n.filePath !== node.filePath) return false;\n        if (n.name === 'constructor') return false;\n\n        // 检查方法是否属于这个类\n        const classNode = graph.nodes.find(c =>\n          c.type === 'class' &&\n          c.filePath === n.filePath &&\n          c.id === n.id.split('#')[0] + '#' + node.name\n        );\n        return classNode !== undefined;\n      });\n\n      methodNodes.forEach(methodNode => {\n        if (!processedNodeIds.has(methodNode.id)) {\n          // 添加 defines 关系\n          const edge: KnowledgeEdge = {\n            source: node.id,\n            target: methodNode.id,\n            type: 'defines',\n            properties: {}\n          };\n          relatedEdges.add(edge);\n          processNode(methodNode, distance + 1);\n        }\n      });\n    }\n\n    // 3. 查找继承关系\n    if (node.type === 'class' && node.name.endsWith('Error')) {\n      const parentNode = graph.nodes.find(n => n.name === 'Error');\n      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n        const edge: KnowledgeEdge = {\n          source: node.id,\n          target: 'Error',\n          type: 'extends',\n          properties: {}\n        };\n        relatedEdges.add(edge);\n        processNode(parentNode, distance + 1);\n      }\n    }\n  }\n\n  // 从每个起始节点开始处理\n  startNodes.forEach(node => processNode(node, 0));\n\n  return {\n    nodes: Array.from(relatedNodes),\n    edges: Array.from(relatedEdges)\n  };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#processNode",
                      "name": "processNode",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 60
                      },
                      "implementation": "function processNode(node: KnowledgeNode, distance: number) {\n    if (distance > maxDistance || processedNodeIds.has(node.id)) return;\n    processedNodeIds.add(node.id);\n    relatedNodes.add(node);\n\n    // 1. 查找直接相关的边\n    const directEdges = graph.edges.filter(edge =>\n      edge.source === node.id || edge.target === node.id\n    );\n\n    directEdges.forEach(edge => {\n      relatedEdges.add(edge);\n\n      // 处理边的另一端节点\n      const otherId = edge.source === node.id ? edge.target : edge.source;\n      const otherNode = graph.nodes.find(n => n.id === otherId);\n\n      if (otherNode && !processedNodeIds.has(otherNode.id)) {\n        processNode(otherNode, distance + 1);\n      }\n    });\n\n    // 2. 查找类和方法的关系\n    if (node.type === 'class') {\n      // 先找到类的所有方法\n      const methodNodes = graph.nodes.filter(n => {\n        if (n.type !== 'function' && n.type !== 'class_method') return false;\n        if (n.filePath !== node.filePath) return false;\n        if (n.name === 'constructor') return false;\n\n        // 检查方法是否属于这个类\n        const classNode = graph.nodes.find(c =>\n          c.type === 'class' &&\n          c.filePath === n.filePath &&\n          c.id === n.id.split('#')[0] + '#' + node.name\n        );\n        return classNode !== undefined;\n      });\n\n      methodNodes.forEach(methodNode => {\n        if (!processedNodeIds.has(methodNode.id)) {\n          // 添加 defines 关系\n          const edge: KnowledgeEdge = {\n            source: node.id,\n            target: methodNode.id,\n            type: 'defines',\n            properties: {}\n          };\n          relatedEdges.add(edge);\n          processNode(methodNode, distance + 1);\n        }\n      });\n    }\n\n    // 3. 查找继承关系\n    if (node.type === 'class' && node.name.endsWith('Error')) {\n      const parentNode = graph.nodes.find(n => n.name === 'Error');\n      if (parentNode && !processedNodeIds.has(parentNode.id)) {\n        const edge: KnowledgeEdge = {\n          source: node.id,\n          target: 'Error',\n          type: 'extends',\n          properties: {}\n        };\n        relatedEdges.add(edge);\n        processNode(parentNode, distance + 1);\n      }\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#searchKnowledgeGraph",
                      "name": "searchKnowledgeGraph",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 145
                      },
                      "implementation": "function searchKnowledgeGraph(\n  graph: KnowledgeGraph,\n  options: SearchOptions\n): SearchResult {\n  const { entities, maxDistance = 2 } = options;\n\n  // 1. 找到起始节点\n  const startNodes = graph.nodes.filter(node =>\n    entities.some(entity => node.name === entity)\n  );\n\n  if (!startNodes.length) {\n    console.warn(`[Warning] No nodes found for entities:`, entities);\n    return {\n      nodes: [],\n      edges: [],\n      metadata: {\n        totalNodes: 0,\n        totalEdges: 0,\n        entities,\n        relationTypes: [],\n        maxDistance\n      }\n    };\n  }\n\n  // 2. 找到相关节点和边\n  const { nodes, edges } = findRelatedNodes(graph, startNodes, maxDistance);\n\n  // 3. 添加类和方法的关系\n  const methodNodes = nodes.filter(n => n.type === 'function' || n.type === 'class_method');\n  const classNodes = nodes.filter(n => n.type === 'class');\n\n  methodNodes.forEach(method => {\n    const className = method.id.split('#')[1];\n    const relatedClass = classNodes.find(c => c.name === className);\n    if (relatedClass) {\n      edges.push({\n        source: relatedClass.id,\n        target: method.id,\n        type: 'defines',\n        properties: {}\n      });\n    }\n  });\n\n  // 4. 添加继承关系\n  const errorClasses = classNodes.filter(n => n.name.endsWith('Error'));\n  errorClasses.forEach(errorClass => {\n    edges.push({\n      source: errorClass.id,\n      target: 'Error',\n      type: 'extends',\n      properties: {}\n    });\n  });\n\n  return {\n    nodes,\n    edges,\n    metadata: {\n      totalNodes: nodes.length,\n      totalEdges: edges.length,\n      entities,\n      relationTypes: Array.from(new Set(edges.map(e => e.type))),\n      maxDistance\n    }\n  };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#printGraphStats",
                      "name": "printGraphStats",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts",
                          "line": 215
                      },
                      "implementation": "function printGraphStats(graph: KnowledgeGraph) {\n  console.log('Nodes:', graph.nodes.length);\n  console.log('Edges:', graph.edges.length);\n  console.log('Unique Relationships:',\n    new Set(graph.edges.map(e => `${e.type}:${e.source}->${e.target}`)).size\n  );\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts#GitAction",
                      "name": "GitAction",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts",
                          "line": 4
                      },
                      "implementation": "class GitAction {\n  private git: SimpleGit;\n\n  constructor() {\n    this.git = simpleGit({ baseDir: process.cwd() });\n  }\n\n  async clone(url: string, path: string): Promise<void> {\n    try {\n      await this.git.clone(url, path);\n    } catch (error) {\n      throw new GitOperationError(\"clone\", (error as Error).message);\n    }\n  }\n\n  async checkoutBranch(path: string, branch: string): Promise<void> {\n    try {\n      const git = simpleGit(path);\n      await git.checkout(branch);\n    } catch (error) {\n      throw new GitOperationError(\"checkout\", (error as Error).message);\n    }\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts",
                          "line": 7
                      },
                      "implementation": "constructor() {\n    this.git = simpleGit({ baseDir: process.cwd() });\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts#clone",
                      "name": "clone",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts",
                          "line": 11
                      },
                      "implementation": "async clone(url: string, path: string): Promise<void> {\n    try {\n      await this.git.clone(url, path);\n    } catch (error) {\n      throw new GitOperationError(\"clone\", (error as Error).message);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts#checkoutBranch",
                      "name": "checkoutBranch",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/gitAction.ts",
                          "line": 19
                      },
                      "implementation": "async checkoutBranch(path: string, branch: string): Promise<void> {\n    try {\n      const git = simpleGit(path);\n      await git.checkout(branch);\n    } catch (error) {\n      throw new GitOperationError(\"checkout\", (error as Error).message);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#GitIngestError",
                      "name": "GitIngestError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 2
                      },
                      "implementation": "class GitIngestError extends Error {\n  constructor(message: string) {\n    super(message);\n    this.name = \"GitIngestError\";\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 3
                      },
                      "implementation": "constructor(message: string) {\n    super(message);\n    this.name = \"GitIngestError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#GitOperationError",
                      "name": "GitOperationError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 10
                      },
                      "implementation": "class GitOperationError extends GitIngestError {\n  constructor(operation: string, details: string) {\n    super(`Git operation '${operation}' failed: ${details}`);\n    this.name = \"GitOperationError\";\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 11
                      },
                      "implementation": "constructor(operation: string, details: string) {\n    super(`Git operation '${operation}' failed: ${details}`);\n    this.name = \"GitOperationError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#FileProcessError",
                      "name": "FileProcessError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 18
                      },
                      "implementation": "class FileProcessError extends GitIngestError {\n  constructor(path: string, reason: string) {\n    super(`Failed to process file '${path}': ${reason}`);\n    this.name = \"FileProcessError\";\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 19
                      },
                      "implementation": "constructor(path: string, reason: string) {\n    super(`Failed to process file '${path}': ${reason}`);\n    this.name = \"FileProcessError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#ValidationError",
                      "name": "ValidationError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 26
                      },
                      "implementation": "class ValidationError extends GitIngestError {\n  constructor(message: string) {\n    super(`Validation failed: ${message}`);\n    this.name = \"ValidationError\";\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 27
                      },
                      "implementation": "constructor(message: string) {\n    super(`Validation failed: ${message}`);\n    this.name = \"ValidationError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#DependencyAnalysisError",
                      "name": "DependencyAnalysisError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 34
                      },
                      "implementation": "class DependencyAnalysisError extends Error {\n  constructor(\n    public readonly filePath: string,\n    public readonly errorType: \"parse\" | \"resolve\" | \"analyze\",\n    message: string\n  ) {\n    super(`[${errorType}] ${message} in file: ${filePath}`);\n    this.name = \"DependencyAnalysisError\";\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 35
                      },
                      "implementation": "constructor(\n    public readonly filePath: string,\n    public readonly errorType: \"parse\" | \"resolve\" | \"analyze\",\n    message: string\n  ) {\n    super(`[${errorType}] ${message} in file: ${filePath}`);\n    this.name = \"DependencyAnalysisError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#GitAnalysisError",
                      "name": "GitAnalysisError",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 46
                      },
                      "implementation": "class GitAnalysisError extends Error {\n  constructor(\n    public readonly operation: string,\n    public readonly target: string,\n    message: string\n  ) {\n    super(`Git analysis failed: ${message} (${operation} on ${target})`);\n    this.name = \"GitAnalysisError\";\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/errors.ts",
                          "line": 47
                      },
                      "implementation": "constructor(\n    public readonly operation: string,\n    public readonly target: string,\n    message: string\n  ) {\n    super(`Git analysis failed: ${message} (${operation} on ${target})`);\n    this.name = \"GitAnalysisError\";\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts#Interface#ScanOptions",
                      "name": "ScanOptions",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                          "line": 8
                      },
                      "implementation": "interface ScanOptions {\n  maxFileSize?: number;\n  includePatterns?: string[];\n  excludePatterns?: string[];\n  targetPaths?: string[];\n  includeDependencies?: boolean;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts#FileScanner",
                      "name": "FileScanner",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                          "line": 45
                      },
                      "implementation": "class FileScanner {\n  protected processedFiles: Set<string> = new Set();\n\n  // 查找模块文件\n  private async findModuleFile(\n    importPath: string,\n    currentDir: string,\n    basePath: string\n  ): Promise<string | null> {\n    // 处理外部依赖\n    if (!importPath.startsWith(\".\")) {\n      return importPath; // 直接返回包名，让依赖图生成器处理\n    }\n\n    // 清理当前目录路径，移除临时目录部分\n    const cleanCurrentDir = currentDir\n      .replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\")\n      .replace(new RegExp(`^${basePath}/`), \"\");\n\n    // 解析基础目录路径\n    const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n    const pathParts = resolvedPath.split(\"/\");\n    const fileName = pathParts.pop() || \"\";\n    const dirPath = pathParts.join(\"/\");\n\n    // 可能的文件扩展名，根据导入文件类型调整优先级\n    const getExtensions = (importName: string) => {\n      if (importName.toLowerCase().endsWith(\".css\")) {\n        return [\".css\", \".less\", \".scss\", \".sass\"];\n      }\n      return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n    };\n\n    const extensions = getExtensions(fileName);\n\n    const targetBasePath = join(basePath, dirPath);\n\n    // 构建可能的基础路径\n    // const possibleBasePaths = [\n    //   join(basePath, dirPath),\n    //   join(basePath, 'src', dirPath),\n    //   ...glob.sync(`${basePath}/*/src/${dirPath}`, { absolute: true })\n    // ];\n\n    // 如果文件名没有扩展名\n    if (!fileName.includes(\".\")) {\n      // for (const currentBasePath of possibleBasePaths) {\n      // 1. 尝试直接添加扩展名\n      for (const ext of extensions) {\n        const fullPath = join(targetBasePath, fileName + ext);\n        try {\n          const stats = await stat(fullPath);\n          if (stats.isFile()) {\n            // 返回清理过的路径\n            return join(dirPath, fileName + ext)\n              .replace(new RegExp(`^${basePath}/`), \"\")\n              .replace(/\\\\/g, \"/\");\n          }\n        } catch (error) {\n          continue;\n        }\n      }\n\n      // 2. 尝试查找 index 文件\n      const dirFullPath = join(targetBasePath, fileName);\n      try {\n        const stats = await stat(dirFullPath);\n        if (stats.isDirectory()) {\n          for (const ext of extensions) {\n            const indexPath = join(dirFullPath, \"index\" + ext);\n            try {\n              const indexStats = await stat(indexPath);\n              if (indexStats.isFile()) {\n                return join(dirPath, fileName, \"index\" + ext)\n                  .replace(new RegExp(`^${basePath}/`), \"\")\n                  .replace(/\\\\/g, \"/\");\n              }\n            } catch (error) {\n              continue;\n            }\n          }\n        }\n      } catch (error) {\n        // continue;\n      }\n      // }\n    } else {\n      // 文件名已有扩展名，尝试所有可能的基础路径\n      // for (const currentBasePath of possibleBasePaths) {\n      const fullPath = join(targetBasePath, fileName);\n      try {\n        const stats = await stat(fullPath);\n        if (stats.isFile()) {\n          return join(dirPath, fileName)\n            .replace(new RegExp(`^${basePath}/`), \"\")\n            .replace(/\\\\/g, \"/\");\n        }\n      } catch (error) {\n        // continue;\n      }\n      // }\n    }\n\n    return null;\n  }\n\n  // [依赖文件按需分析]: 分析依赖文件\n  protected async analyzeDependencies(\n    content: string,\n    filePath: string,\n    basePath: string\n  ): Promise<string[]> {\n    const dependencies: string[] = [];\n    // 匹配导入路径。示例: import { Button } from '@/components/Button'\n    const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n\n    // 移除多行注释\n    const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n    const lines = contentWithoutComments\n      .split(\"\\n\")\n      .filter((line) => {\n        const trimmed = line.trim();\n        return trimmed && !trimmed.startsWith(\"//\");\n      })\n      .join(\"\\n\");\n\n    // 匹配导入路径\n    let match;\n    // 遍历每一行，匹配导入路径\n    while ((match = importRegex.exec(lines)) !== null) {\n      // 获取导入路径。示例: import { Button } from '@/components/Button'\n      const importPath = match[1];\n      // 获取当前文件路径。示例: src/components/Button/index.ts\n      const currentDir = dirname(filePath);\n\n      // 查找导入路径。示例: src/components/Button/index.ts\n      const resolvedPath = await this.findModuleFile(\n        importPath,\n        currentDir,\n        basePath\n      );\n      // 如果导入路径存在，且不在依赖列表中，则添加到依赖列表\n      if (resolvedPath && !dependencies.includes(resolvedPath)) {\n        dependencies.push(resolvedPath);\n      }\n    }\n\n    // 返回依赖列表。示例：['src/components/Button/index.ts', 'src/components/Input/index.ts']\n    return dependencies;\n  }\n\n  // 扫描目录\n  async scanDirectory(path: string, options: ScanOptions): Promise<FileInfo[]> {\n    if (!path) {\n      throw new ValidationError(\"Path is required\");\n    }\n\n    try {\n      // 清除已处理文件\n      this.processedFiles.clear();\n      const allFiles: FileInfo[] = [];\n\n      // 如果指定了目标文件路径，则扫描目标文件及其依赖文件\n      if (options.targetPaths && options.targetPaths.length > 0) {\n        for (const targetPath of options.targetPaths) {\n          // [核心步骤三]: 扫描目标文件及其依赖文件\n          await this.processFileAndDependencies(\n            path,\n            targetPath,\n            options,\n            allFiles\n          );\n        }\n        return allFiles;\n      }\n\n      const files = await glob(\"**/*\", {\n        cwd: path,\n        ignore: [\n          ...(options.excludePatterns || []),\n          \"**/node_modules/**\",\n          \"**/.git/**\",\n        ],\n        nodir: true,\n        absolute: false,\n        windowsPathsNoEscape: true,\n      });\n\n      const results = await Promise.all(\n        files.map((file) => this.processFile(path, file, options))\n      );\n\n      return results.filter((file): file is FileInfo => file !== null);\n    } catch (error) {\n      throw new FileProcessError(path, (error as Error).message);\n    }\n  }\n\n  // 扫描目标文件及其依赖文件\n  private async processFileAndDependencies(\n    basePath: string,\n    relativePath: string,\n    options: ScanOptions,\n    allFiles: FileInfo[]\n  ): Promise<void> {\n    if (this.processedFiles.has(relativePath)) {\n      return;\n    }\n\n    /**\n     * 核心步骤四: 扫描目标文件\n     * 示例: fileInfo: { path: 'src/components/Button/index.ts', content: '...', size: 1024 }\n     */\n    const fileInfo = await this.processFile(basePath, relativePath, options);\n    // 如果文件存在，则添加到已处理文件集合，并添加到结果数组\n    if (fileInfo) {\n      this.processedFiles.add(relativePath);\n      allFiles.push(fileInfo);\n\n      // [依赖文件按需分析]: 如果 includeDependencies 为 true，则分析依赖文件\n      if (options.includeDependencies !== false) {\n        // 分析依赖文件\n        const dependencies = await this.analyzeDependencies(\n          fileInfo.content,\n          relativePath,\n          basePath\n        );\n        // 遍历依赖文件，递归扫描依赖文件\n        for (const dep of dependencies) {\n          await this.processFileAndDependencies(\n            basePath,\n            dep,\n            options,\n            allFiles\n          );\n        }\n      }\n    }\n  }\n\n  // 尝试查找文件\n  private async tryFindFile(\n    basePath: string,\n    filePath: string,\n    options: ScanOptions\n  ): Promise<FileInfo | null> {\n    try {\n      const stats = await stat(filePath);\n      if (options.maxFileSize && stats.size > options.maxFileSize) {\n        return null;\n      }\n\n      // [核心步骤六]: 读取文件内容\n      const content = await readFile(filePath, \"utf-8\");\n      /**\n       * @desc 移除临时目录前缀，只保留项目相关路径\n       * 示例:\n       * filePath: repo/github101-250644/src/core/gitAction.ts\n       * basePath: 'repo/github101-492772'\n       * relativePath: repo/github101-250644/src/core/gitAction.ts\n       */\n      const basePathParts = basePath.split(\"/\"); // eg: ['repo', 'github101-492772']\n      const deleteHashRepoName = basePathParts[\n        basePathParts.length - 1\n      ].replace(/-[^-]*$/, \"\"); // github101\n      const relativePath = filePath\n        .replace(new RegExp(`^${basePathParts[0]}/`), \"\") // 去除临时目录前缀 repo/\n        .replace(\n          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n          deleteHashRepoName\n        ) // 去掉[-hash]\n        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n\n      return {\n        path: relativePath,\n        content,\n        // size: stats.size,\n        token: estimateTokens(content),\n      };\n    } catch (error) {\n      return null;\n    }\n  }\n\n  // 扫描文件\n  private async processFile(\n    basePath: string,\n    relativePath: string,\n    options: ScanOptions\n  ): Promise<FileInfo | null> {\n    try {\n      // 获取文件扩展名\n      const ext = relativePath.toLowerCase().split(\".\").pop();\n      // 如果文件是二进制文件，则跳过\n      if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n        return null;\n      }\n\n      /**\n       * @desc 规范化路径\n       * 示例:\n       * relativePath: src/components/Button/index.ts\n       * normalizedPath: src/components/Button/index.ts\n       */\n      const normalizedPath = relativePath\n        .replace(/^[\\/\\\\]+/, \"\") // 移除开头的斜杠\n        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n\n      /**\n       * @desc 获取基础路径和文件名部分\n       * 示例:\n       * normalizedPath: src/components/Button/index.ts\n       * pathParts: ['src', 'components', 'Button', 'index.ts']\n       * fileName: 'index.ts'\n       * dirPath: 'src/components/Button'\n       * targetBasePath: ${basePath}/src/components/Button\n       */\n      const pathParts = normalizedPath.split(\"/\");\n      const fileName = pathParts.pop() || \"\";\n      const dirPath = pathParts.join(\"/\");\n      const targetBasePath = join(basePath, dirPath);\n\n      // 可能的文件扩展名\n      const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n\n      // [核心步骤五]: tryFindFile 尝试查找文件\n      // 如果路径没有扩展名，尝试多种可能性\n      if (!fileName.includes(\".\")) {\n        // 1. 尝试直接添加扩展名\n        for (const ext of extensions) {\n          const fullPath = join(targetBasePath, fileName + ext);\n          const result = await this.tryFindFile(basePath, fullPath, options);\n          if (result) return result;\n        }\n\n        // 2. 尝试作为目录查找 index 文件\n        const dirFullPath = join(targetBasePath, fileName);\n        for (const ext of extensions) {\n          const indexPath = join(dirFullPath, \"index\" + ext);\n          const result = await this.tryFindFile(basePath, indexPath, options);\n          if (result) return result;\n        }\n      } else {\n        // 文件名已有扩展名，尝试所有可能的基础路径\n        const fullPath = join(targetBasePath, fileName);\n        const result = await this.tryFindFile(basePath, fullPath, options);\n        if (result) return result;\n      }\n\n      return null;\n    } catch (error) {\n      console.warn(`Warning: Failed to process file ${relativePath}: ${error}`);\n      return null;\n    }\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts#findModuleFile",
                      "name": "findModuleFile",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                          "line": 49
                      },
                      "implementation": "private async findModuleFile(\n    importPath: string,\n    currentDir: string,\n    basePath: string\n  ): Promise<string | null> {\n    // 处理外部依赖\n    if (!importPath.startsWith(\".\")) {\n      return importPath; // 直接返回包名，让依赖图生成器处理\n    }\n\n    // 清理当前目录路径，移除临时目录部分\n    const cleanCurrentDir = currentDir\n      .replace(new RegExp(`^${basePath}/.*?/src/`), \"src/\")\n      .replace(new RegExp(`^${basePath}/`), \"\");\n\n    // 解析基础目录路径\n    const resolvedPath = join(cleanCurrentDir, importPath).replace(/\\\\/g, \"/\");\n    const pathParts = resolvedPath.split(\"/\");\n    const fileName = pathParts.pop() || \"\";\n    const dirPath = pathParts.join(\"/\");\n\n    // 可能的文件扩展名，根据导入文件类型调整优先级\n    const getExtensions = (importName: string) => {\n      if (importName.toLowerCase().endsWith(\".css\")) {\n        return [\".css\", \".less\", \".scss\", \".sass\"];\n      }\n      return [\".tsx\", \".ts\", \".jsx\", \".js\", \".vue\"];\n    };\n\n    const extensions = getExtensions(fileName);\n\n    const targetBasePath = join(basePath, dirPath);\n\n    // 构建可能的基础路径\n    // const possibleBasePaths = [\n    //   join(basePath, dirPath),\n    //   join(basePath, 'src', dirPath),\n    //   ...glob.sync(`${basePath}/*/src/${dirPath}`, { absolute: true })\n    // ];\n\n    // 如果文件名没有扩展名\n    if (!fileName.includes(\".\")) {\n      // for (const currentBasePath of possibleBasePaths) {\n      // 1. 尝试直接添加扩展名\n      for (const ext of extensions) {\n        const fullPath = join(targetBasePath, fileName + ext);\n        try {\n          const stats = await stat(fullPath);\n          if (stats.isFile()) {\n            // 返回清理过的路径\n            return join(dirPath, fileName + ext)\n              .replace(new RegExp(`^${basePath}/`), \"\")\n              .replace(/\\\\/g, \"/\");\n          }\n        } catch (error) {\n          continue;\n        }\n      }\n\n      // 2. 尝试查找 index 文件\n      const dirFullPath = join(targetBasePath, fileName);\n      try {\n        const stats = await stat(dirFullPath);\n        if (stats.isDirectory()) {\n          for (const ext of extensions) {\n            const indexPath = join(dirFullPath, \"index\" + ext);\n            try {\n              const indexStats = await stat(indexPath);\n              if (indexStats.isFile()) {\n                return join(dirPath, fileName, \"index\" + ext)\n                  .replace(new RegExp(`^${basePath}/`), \"\")\n                  .replace(/\\\\/g, \"/\");\n              }\n            } catch (error) {\n              continue;\n            }\n          }\n        }\n      } catch (error) {\n        // continue;\n      }\n      // }\n    } else {\n      // 文件名已有扩展名，尝试所有可能的基础路径\n      // for (const currentBasePath of possibleBasePaths) {\n      const fullPath = join(targetBasePath, fileName);\n      try {\n        const stats = await stat(fullPath);\n        if (stats.isFile()) {\n          return join(dirPath, fileName)\n            .replace(new RegExp(`^${basePath}/`), \"\")\n            .replace(/\\\\/g, \"/\");\n        }\n      } catch (error) {\n        // continue;\n      }\n      // }\n    }\n\n    return null;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts#analyzeDependencies",
                      "name": "analyzeDependencies",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                          "line": 152
                      },
                      "implementation": "protected async analyzeDependencies(\n    content: string,\n    filePath: string,\n    basePath: string\n  ): Promise<string[]> {\n    const dependencies: string[] = [];\n    // 匹配导入路径。示例: import { Button } from '@/components/Button'\n    const importRegex = /(?:import|from)\\s+['\"]([^'\"]+)['\"]/g;\n\n    // 移除多行注释\n    const contentWithoutComments = content.replace(/\\/\\*[\\s\\S]*?\\*\\//g, \"\");\n    const lines = contentWithoutComments\n      .split(\"\\n\")\n      .filter((line) => {\n        const trimmed = line.trim();\n        return trimmed && !trimmed.startsWith(\"//\");\n      })\n      .join(\"\\n\");\n\n    // 匹配导入路径\n    let match;\n    // 遍历每一行，匹配导入路径\n    while ((match = importRegex.exec(lines)) !== null) {\n      // 获取导入路径。示例: import { Button } from '@/components/Button'\n      const importPath = match[1];\n      // 获取当前文件路径。示例: src/components/Button/index.ts\n      const currentDir = dirname(filePath);\n\n      // 查找导入路径。示例: src/components/Button/index.ts\n      const resolvedPath = await this.findModuleFile(\n        importPath,\n        currentDir,\n        basePath\n      );\n      // 如果导入路径存在，且不在依赖列表中，则添加到依赖列表\n      if (resolvedPath && !dependencies.includes(resolvedPath)) {\n        dependencies.push(resolvedPath);\n      }\n    }\n\n    // 返回依赖列表。示例：['src/components/Button/index.ts', 'src/components/Input/index.ts']\n    return dependencies;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts#scanDirectory",
                      "name": "scanDirectory",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                          "line": 197
                      },
                      "implementation": "async scanDirectory(path: string, options: ScanOptions): Promise<FileInfo[]> {\n    if (!path) {\n      throw new ValidationError(\"Path is required\");\n    }\n\n    try {\n      // 清除已处理文件\n      this.processedFiles.clear();\n      const allFiles: FileInfo[] = [];\n\n      // 如果指定了目标文件路径，则扫描目标文件及其依赖文件\n      if (options.targetPaths && options.targetPaths.length > 0) {\n        for (const targetPath of options.targetPaths) {\n          // [核心步骤三]: 扫描目标文件及其依赖文件\n          await this.processFileAndDependencies(\n            path,\n            targetPath,\n            options,\n            allFiles\n          );\n        }\n        return allFiles;\n      }\n\n      const files = await glob(\"**/*\", {\n        cwd: path,\n        ignore: [\n          ...(options.excludePatterns || []),\n          \"**/node_modules/**\",\n          \"**/.git/**\",\n        ],\n        nodir: true,\n        absolute: false,\n        windowsPathsNoEscape: true,\n      });\n\n      const results = await Promise.all(\n        files.map((file) => this.processFile(path, file, options))\n      );\n\n      return results.filter((file): file is FileInfo => file !== null);\n    } catch (error) {\n      throw new FileProcessError(path, (error as Error).message);\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts#processFileAndDependencies",
                      "name": "processFileAndDependencies",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                          "line": 244
                      },
                      "implementation": "private async processFileAndDependencies(\n    basePath: string,\n    relativePath: string,\n    options: ScanOptions,\n    allFiles: FileInfo[]\n  ): Promise<void> {\n    if (this.processedFiles.has(relativePath)) {\n      return;\n    }\n\n    /**\n     * 核心步骤四: 扫描目标文件\n     * 示例: fileInfo: { path: 'src/components/Button/index.ts', content: '...', size: 1024 }\n     */\n    const fileInfo = await this.processFile(basePath, relativePath, options);\n    // 如果文件存在，则添加到已处理文件集合，并添加到结果数组\n    if (fileInfo) {\n      this.processedFiles.add(relativePath);\n      allFiles.push(fileInfo);\n\n      // [依赖文件按需分析]: 如果 includeDependencies 为 true，则分析依赖文件\n      if (options.includeDependencies !== false) {\n        // 分析依赖文件\n        const dependencies = await this.analyzeDependencies(\n          fileInfo.content,\n          relativePath,\n          basePath\n        );\n        // 遍历依赖文件，递归扫描依赖文件\n        for (const dep of dependencies) {\n          await this.processFileAndDependencies(\n            basePath,\n            dep,\n            options,\n            allFiles\n          );\n        }\n      }\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts#tryFindFile",
                      "name": "tryFindFile",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                          "line": 286
                      },
                      "implementation": "private async tryFindFile(\n    basePath: string,\n    filePath: string,\n    options: ScanOptions\n  ): Promise<FileInfo | null> {\n    try {\n      const stats = await stat(filePath);\n      if (options.maxFileSize && stats.size > options.maxFileSize) {\n        return null;\n      }\n\n      // [核心步骤六]: 读取文件内容\n      const content = await readFile(filePath, \"utf-8\");\n      /**\n       * @desc 移除临时目录前缀，只保留项目相关路径\n       * 示例:\n       * filePath: repo/github101-250644/src/core/gitAction.ts\n       * basePath: 'repo/github101-492772'\n       * relativePath: repo/github101-250644/src/core/gitAction.ts\n       */\n      const basePathParts = basePath.split(\"/\"); // eg: ['repo', 'github101-492772']\n      const deleteHashRepoName = basePathParts[\n        basePathParts.length - 1\n      ].replace(/-[^-]*$/, \"\"); // github101\n      const relativePath = filePath\n        .replace(new RegExp(`^${basePathParts[0]}/`), \"\") // 去除临时目录前缀 repo/\n        .replace(\n          new RegExp(`^${basePathParts[basePathParts.length - 1]}`),\n          deleteHashRepoName\n        ) // 去掉[-hash]\n        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n\n      return {\n        path: relativePath,\n        content,\n        // size: stats.size,\n        token: estimateTokens(content),\n      };\n    } catch (error) {\n      return null;\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts#processFile",
                      "name": "processFile",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/core/scanner.ts",
                          "line": 330
                      },
                      "implementation": "private async processFile(\n    basePath: string,\n    relativePath: string,\n    options: ScanOptions\n  ): Promise<FileInfo | null> {\n    try {\n      // 获取文件扩展名\n      const ext = relativePath.toLowerCase().split(\".\").pop();\n      // 如果文件是二进制文件，则跳过\n      if (ext && BINARY_FILE_TYPES.includes(`.${ext}`)) {\n        return null;\n      }\n\n      /**\n       * @desc 规范化路径\n       * 示例:\n       * relativePath: src/components/Button/index.ts\n       * normalizedPath: src/components/Button/index.ts\n       */\n      const normalizedPath = relativePath\n        .replace(/^[\\/\\\\]+/, \"\") // 移除开头的斜杠\n        .replace(/\\\\/g, \"/\"); // 统一使用正斜杠\n\n      /**\n       * @desc 获取基础路径和文件名部分\n       * 示例:\n       * normalizedPath: src/components/Button/index.ts\n       * pathParts: ['src', 'components', 'Button', 'index.ts']\n       * fileName: 'index.ts'\n       * dirPath: 'src/components/Button'\n       * targetBasePath: ${basePath}/src/components/Button\n       */\n      const pathParts = normalizedPath.split(\"/\");\n      const fileName = pathParts.pop() || \"\";\n      const dirPath = pathParts.join(\"/\");\n      const targetBasePath = join(basePath, dirPath);\n\n      // 可能的文件扩展名\n      const extensions = [\".ts\", \".tsx\", \".js\", \".jsx\", \".vue\"];\n\n      // [核心步骤五]: tryFindFile 尝试查找文件\n      // 如果路径没有扩展名，尝试多种可能性\n      if (!fileName.includes(\".\")) {\n        // 1. 尝试直接添加扩展名\n        for (const ext of extensions) {\n          const fullPath = join(targetBasePath, fileName + ext);\n          const result = await this.tryFindFile(basePath, fullPath, options);\n          if (result) return result;\n        }\n\n        // 2. 尝试作为目录查找 index 文件\n        const dirFullPath = join(targetBasePath, fileName);\n        for (const ext of extensions) {\n          const indexPath = join(dirFullPath, \"index\" + ext);\n          const result = await this.tryFindFile(basePath, indexPath, options);\n          if (result) return result;\n        }\n      } else {\n        // 文件名已有扩展名，尝试所有可能的基础路径\n        const fullPath = join(targetBasePath, fileName);\n        const result = await this.tryFindFile(basePath, fullPath, options);\n        if (result) return result;\n      }\n\n      return null;\n    } catch (error) {\n      console.warn(`Warning: Failed to process file ${relativePath}: ${error}`);\n      return null;\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts#Interface#AnalyzeOptions",
                      "name": "AnalyzeOptions",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                          "line": 1
                      },
                      "implementation": "interface AnalyzeOptions {\n  // 最大文件大小\n  maxFileSize?: number;\n  // 包含的文件模式\n  includePatterns?: string[];\n  // 排除的文件模式\n  excludePatterns?: string[];\n  // 目标文件路径\n  targetPaths?: string[];\n  // 分支\n  branch?: string;\n  // 提交\n  commit?: string;\n  // 最小公共根目录\n  miniCommonRoot?: string;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts#Interface#FileInfo",
                      "name": "FileInfo",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                          "line": 18
                      },
                      "implementation": "interface FileInfo {\n  // 文件路径\n  path: string;\n  // 文件内容\n  content: string;\n  // 文件预估消耗 token 数量\n  token: number;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts#Interface#AnalysisResult",
                      "name": "AnalysisResult",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                          "line": 27
                      },
                      "implementation": "interface AnalysisResult {\n  // 项目概况\n  metadata: {\n    files: number;\n    tokens: number;\n  };\n  // 文件树\n  fileTree: string;\n  // 总代码\n  totalCode: {\n    // 文件路径\n    path: string;\n    // 文件内容\n    content: string;\n    // 文件预估消耗 token 数量\n    token: number;\n  }[];\n  // 文件大小树，表示文件及其子文件夹的大小结构\n  sizeTree: {\n    // 文件或文件夹的名称\n    name: string;\n    // 文件或文件夹预估消耗 token 数量\n    token: number;\n    // 是否为文件\n    isFile: boolean;\n    // 子文件或子文件夹的集合\n    children?: {\n      [key: string]: {\n        // 子文件或子文件夹的名称\n        name: string;\n        // 子文件或子文件夹预估消耗 token 数量\n        token: number;\n        // 子文件或子文件夹的集合\n        children?: any; // 递归定义，允许嵌套\n        // 是否为文件\n        isFile: boolean;\n      };\n    };\n  };\n  // 代码分析\n  codeAnalysis: CodeAnalysis;\n  // 依赖关系图\n  dependencyGraph: any;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts#Interface#CodeAnalysis",
                      "name": "CodeAnalysis",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                          "line": 72
                      },
                      "implementation": "interface CodeAnalysis {\n  codeIndex: Map<string, any[]>;\n  knowledgeGraph: {\n    nodes: any[];\n    edges: any[];\n  };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts#Interface#GitIngestConfig",
                      "name": "GitIngestConfig",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/types/index.ts",
                          "line": 79
                      },
                      "implementation": "interface GitIngestConfig {\n  // 保存克隆仓库的临时目录名\n  tempDir?: string;\n  /* 默认检索的最大的文件 */\n  defaultMaxFileSize?: number;\n  /* 文件模式 */\n  defaultPatterns?: {\n    /* 包含的文件/目录 */\n    include?: string[];\n    /* 不会去检索的文件/目录 */\n    exclude?: string[];\n  };\n  /* 保留克隆的仓库 */\n  keepTempFiles?: boolean;\n  /* 自定义域名 */\n  customDomainMap?: {\n    targetDomain: string;\n    originalDomain: string;\n  };\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#estimateTokens",
                      "name": "estimateTokens",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                          "line": 4
                      },
                      "implementation": "function estimateTokens(text: string): number {\n  // 1. 计算中文字符数量\n  const chineseChars = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;\n\n  // 2. 计算英文单词数量（包括数字和标点）\n  const otherChars = text.length - chineseChars;\n\n  // 3. 计算总 token：\n  // - 中文字符通常是 1:1 或 1:2 的比例，保守起见使用 2\n  // - 其他字符按照 1:0.25 的比例\n  const estimatedTokens = chineseChars * 2 + Math.ceil(otherChars / 4);\n\n  // 4. 添加 10% 的安全余量\n  return Math.ceil(estimatedTokens * 1.1);\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#generateTree",
                      "name": "generateTree",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                          "line": 21
                      },
                      "implementation": "function generateTree(files: FileInfo[]): string {\n  const tree: { [key: string]: any } = {};\n\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = tree;\n\n    for (const part of parts.slice(0, -1)) {\n      if (!current[part]) {\n        current[part] = {};\n      }\n      current = current[part];\n    }\n\n    current[parts[parts.length - 1]] = null;\n  }\n\n  function stringify(node: any, prefix = \"\"): string {\n    let result = \"\";\n    const entries = Object.entries(node);\n\n    for (let i = 0; i < entries.length; i++) {\n      const [key, value] = entries[i];\n      const isLast = i === entries.length - 1;\n      const connector = isLast ? \"└── \" : \"├── \";\n      const childPrefix = isLast ? \"    \" : \"│   \";\n\n      result += prefix + connector + key + \"\\n\";\n\n      if (value !== null) {\n        result += stringify(value, prefix + childPrefix);\n      }\n    }\n\n    return result;\n  }\n\n  return stringify(tree);\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#stringify",
                      "name": "stringify",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                          "line": 38
                      },
                      "implementation": "function stringify(node: any, prefix = \"\"): string {\n    let result = \"\";\n    const entries = Object.entries(node);\n\n    for (let i = 0; i < entries.length; i++) {\n      const [key, value] = entries[i];\n      const isLast = i === entries.length - 1;\n      const connector = isLast ? \"└── \" : \"├── \";\n      const childPrefix = isLast ? \"    \" : \"│   \";\n\n      result += prefix + connector + key + \"\\n\";\n\n      if (value !== null) {\n        result += stringify(value, prefix + childPrefix);\n      }\n    }\n\n    return result;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#Interface#TreeNode",
                      "name": "TreeNode",
                      "type": "interface",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                          "line": 61
                      },
                      "implementation": "interface TreeNode {\n  name: string;\n  token: number;\n  content?: string;\n  children: { [key: string]: TreeNode };\n  isFile: boolean;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#buildSizeTree",
                      "name": "buildSizeTree",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                          "line": 70
                      },
                      "implementation": "function buildSizeTree(files: FileInfo[]): TreeNode {\n  // 创建根节点\n  const root: TreeNode = {\n    name: \"root\",\n    token: 0,\n    children: {},\n    isFile: false,\n  };\n\n  // 构建树结构\n  for (const file of files) {\n    const parts = file.path.split(\"/\");\n    let current = root;\n\n    // 遍历路径的每一部分\n    for (let i = 0; i < parts.length; i++) {\n      const part = parts[i];\n      const isLastPart = i === parts.length - 1;\n\n      if (!current.children[part]) {\n        current.children[part] = {\n          name: part,\n          token: isLastPart ? file.token : 0,\n          ...(isLastPart && file.content ? { content: file.content } : {}),\n          children: {},\n          isFile: isLastPart,\n        };\n      }\n\n      current = current.children[part];\n    }\n  }\n\n  // 计算每个目录的总大小\n  function calculateSize(node: TreeNode): number {\n    if (node.isFile) {\n      return node.token;\n    }\n\n    let totalToken = 0;\n    for (const child of Object.values(node.children)) {\n      totalToken += calculateSize(child);\n    }\n    node.token = totalToken;\n    return totalToken;\n  }\n\n  calculateSize(root);\n  return root;\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#calculateSize",
                      "name": "calculateSize",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts",
                          "line": 104
                      },
                      "implementation": "function calculateSize(node: TreeNode): number {\n    if (node.isFile) {\n      return node.token;\n    }\n\n    let totalToken = 0;\n    for (const child of Object.values(node.children)) {\n      totalToken += calculateSize(child);\n    }\n    node.token = totalToken;\n    return totalToken;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts#GitIngest",
                      "name": "GitIngest",
                      "type": "class",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                          "line": 23
                      },
                      "implementation": "class GitIngest {\n  private git: GitAction;\n  private scanner: FileScanner;\n  private analyzer: CodeAnalyzer;\n  private config: GitIngestConfig;\n\n  constructor(config?: GitIngestConfig) {\n    this.git = new GitAction();\n    this.scanner = new FileScanner();\n    this.analyzer = new CodeAnalyzer();\n    this.config = {\n      tempDir: \"repo\", // 默认保存仓库的目录名(不会暴露到外部)\n      keepTempFiles: false, // 默认不保留临时文件\n      defaultMaxFileSize: 1024 * 1024, // 默认检索不超过 1MB 的文件\n      defaultPatterns: {\n        include: [\"**/*\"],\n        exclude: [\"**/node_modules/**\", \"**/.git/**\"],\n      },\n      ...config,\n    };\n  }\n\n  // 清理临时目录\n  private async cleanupTempDir(dirPath: string): Promise<void> {\n    try {\n      if (existsSync(dirPath)) {\n        await rm(dirPath, { recursive: true, force: true });\n      }\n    } catch (error) {\n      console.warn(\n        `Warning: Failed to cleanup temporary directory ${dirPath}: ${(error as Error).message\n        }`\n      );\n    }\n  }\n\n  // 检查URL是否使用自定义域名，如果是则转换为原始GitHub URL\n  private transformCustomDomainUrl(url: string): string {\n    if (!this.config.customDomainMap) {\n      return url;\n    }\n\n    const { targetDomain, originalDomain } = this.config.customDomainMap;\n    if (url.includes(targetDomain)) {\n      return url.replace(targetDomain, originalDomain);\n    }\n\n    return url;\n  }\n\n  // 检查URL是否匹配自定义域名\n  private isCustomDomainUrl(url: string): boolean {\n    if (!this.config.customDomainMap) {\n      return false;\n    }\n\n    return url.includes(this.config.customDomainMap.targetDomain);\n  }\n\n  // [核心步骤0]: 开端，根据 url 按需获取仓库代码\n  async analyzeFromUrl(\n    url: string,\n    options?: AnalyzeOptions\n  ): Promise<AnalysisResult> {\n    // 检查是否是自定义域名URL\n    const isCustomDomain = this.isCustomDomainUrl(url);\n    // 转换URL\n    const githubUrl = this.transformCustomDomainUrl(url);\n\n    if (!githubUrl) {\n      throw new ValidationError(\"URL is required\");\n    }\n\n    if (!githubUrl.match(/^https?:\\/\\//)) {\n      throw new ValidationError(\"Invalid URL format\");\n    }\n\n    if (!this.config.tempDir) {\n      throw new ValidationError(\"Temporary directory is required\");\n    }\n\n    // 从URL中提取仓库名\n    const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n    const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n    // 生成唯一标识符（使用时间戳的后6位作为唯一值）\n    const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n    const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n\n    let result: AnalysisResult;\n\n    try {\n      // 确保临时目录存在\n      if (!existsSync(this.config.tempDir)) {\n        await mkdir(this.config.tempDir, { recursive: true });\n      }\n\n      // 克隆仓库\n      await this.git.clone(githubUrl, workDir);\n\n      // 如果指定了分支,切换到对应分支\n      if (options?.branch) {\n        await this.git.checkoutBranch(workDir, options.branch);\n      }\n\n      // [核心步骤一]: 调用扫描目录\n      result = await this.analyzeFromDirectory(workDir, options);\n\n      // 如果不保留临时文件，则清理\n      if (!this.config.keepTempFiles) {\n        await this.cleanupTempDir(workDir);\n      }\n\n      // 如果是自定义域名访问，添加额外信息\n      // if (isCustomDomain) {\n      //   result.summary = `通过自定义域名 ${this.config.customDomainMap?.targetDomain} 访问\\n原始仓库: ${githubUrl}\\n\\n${result.summary}`;\n      // }\n\n      return result;\n    } catch (error) {\n      // 发生错误时也尝试清理临时文件\n      if (!this.config.keepTempFiles) {\n        await this.cleanupTempDir(workDir);\n      }\n\n      if (error instanceof GitIngestError) {\n        throw error;\n      }\n      throw new GitIngestError(\n        `Failed to analyze repository: ${(error as Error).message}`\n      );\n    }\n  }\n\n  // 分析扫描目录\n  async analyzeFromDirectory(\n    dirPath: string,\n    options?: AnalyzeOptions\n  ): Promise<AnalysisResult> {\n    if (!dirPath) {\n      throw new ValidationError(\"Path is required\");\n    }\n\n    if (!existsSync(dirPath)) {\n      throw new ValidationError(`Directory not found: ${dirPath}`);\n    }\n\n    try {\n      const files = await this.scanner.scanDirectory(dirPath, {\n        maxFileSize: options?.maxFileSize || this.config.defaultMaxFileSize,\n        includePatterns:\n          options?.includePatterns || this.config.defaultPatterns?.include,\n        excludePatterns:\n          options?.excludePatterns || this.config.defaultPatterns?.exclude,\n        targetPaths: options?.targetPaths,\n        includeDependencies: true,\n      });\n\n      if (files.length === 0) {\n        throw new ValidationError(\"No files found in the specified directory\");\n      }\n\n      // 重置分析器状态\n      this.analyzer = new CodeAnalyzer();\n\n      // 分析代码并构建索引和知识图谱\n      for (const file of files) {\n        try {\n          // 确保是 TypeScript/JavaScript 文件\n          if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n            // 使用 file.content 而不是重新读取文件\n            const content = file.content;\n            // 使用绝对路径\n            const absolutePath = path.resolve(dirPath, file.path);\n\n            // console.log(`Analyzing file: ${absolutePath}`); // 添加日志\n            this.analyzer.analyzeCode(absolutePath, content);\n          }\n        } catch (error) {\n          console.warn(\n            `Warning: Failed to analyze file ${file.path}: ${(error as Error).message}`\n          );\n        }\n      }\n\n      // 获取分析结果\n      const codeIndex = this.analyzer.getCodeIndex();\n      const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n\n      console.log(`Analysis complete. Found ${codeIndex.size} code elements`); // 添加日志\n\n      return {\n        metadata: {\n          files: files.length,\n          tokens: files.reduce((acc, file) => acc + file.token, 0),\n        },\n        totalCode: files,\n        fileTree: generateTree(files),\n        sizeTree: buildSizeTree(files),\n        codeAnalysis: { codeIndex, knowledgeGraph },\n        dependencyGraph: await analyzeDependencies(dirPath + (options?.miniCommonRoot || ''))\n      };\n    } catch (error) {\n      if (error instanceof GitIngestError) {\n        throw error;\n      }\n      throw new GitIngestError(\n        `Failed to analyze directory: ${(error as Error).message}`\n      );\n    }\n  }\n}"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts#constructor",
                      "name": "constructor",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                          "line": 29
                      },
                      "implementation": "constructor(config?: GitIngestConfig) {\n    this.git = new GitAction();\n    this.scanner = new FileScanner();\n    this.analyzer = new CodeAnalyzer();\n    this.config = {\n      tempDir: \"repo\", // 默认保存仓库的目录名(不会暴露到外部)\n      keepTempFiles: false, // 默认不保留临时文件\n      defaultMaxFileSize: 1024 * 1024, // 默认检索不超过 1MB 的文件\n      defaultPatterns: {\n        include: [\"**/*\"],\n        exclude: [\"**/node_modules/**\", \"**/.git/**\"],\n      },\n      ...config,\n    };\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts#cleanupTempDir",
                      "name": "cleanupTempDir",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                          "line": 46
                      },
                      "implementation": "private async cleanupTempDir(dirPath: string): Promise<void> {\n    try {\n      if (existsSync(dirPath)) {\n        await rm(dirPath, { recursive: true, force: true });\n      }\n    } catch (error) {\n      console.warn(\n        `Warning: Failed to cleanup temporary directory ${dirPath}: ${(error as Error).message\n        }`\n      );\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts#transformCustomDomainUrl",
                      "name": "transformCustomDomainUrl",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                          "line": 60
                      },
                      "implementation": "private transformCustomDomainUrl(url: string): string {\n    if (!this.config.customDomainMap) {\n      return url;\n    }\n\n    const { targetDomain, originalDomain } = this.config.customDomainMap;\n    if (url.includes(targetDomain)) {\n      return url.replace(targetDomain, originalDomain);\n    }\n\n    return url;\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts#isCustomDomainUrl",
                      "name": "isCustomDomainUrl",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                          "line": 74
                      },
                      "implementation": "private isCustomDomainUrl(url: string): boolean {\n    if (!this.config.customDomainMap) {\n      return false;\n    }\n\n    return url.includes(this.config.customDomainMap.targetDomain);\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts#analyzeFromUrl",
                      "name": "analyzeFromUrl",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                          "line": 83
                      },
                      "implementation": "async analyzeFromUrl(\n    url: string,\n    options?: AnalyzeOptions\n  ): Promise<AnalysisResult> {\n    // 检查是否是自定义域名URL\n    const isCustomDomain = this.isCustomDomainUrl(url);\n    // 转换URL\n    const githubUrl = this.transformCustomDomainUrl(url);\n\n    if (!githubUrl) {\n      throw new ValidationError(\"URL is required\");\n    }\n\n    if (!githubUrl.match(/^https?:\\/\\//)) {\n      throw new ValidationError(\"Invalid URL format\");\n    }\n\n    if (!this.config.tempDir) {\n      throw new ValidationError(\"Temporary directory is required\");\n    }\n\n    // 从URL中提取仓库名\n    const repoMatch = githubUrl.match(/github\\.com\\/[^\\/]+\\/([^\\/]+)/);\n    const repoName = repoMatch ? repoMatch[1] : \"unknown\";\n    // 生成唯一标识符（使用时间戳的后6位作为唯一值）\n    const uniqueId = crypto.randomBytes(3).toString(\"base64url\").slice(0, 4);\n    const workDir = `${this.config.tempDir}/${repoName}-${uniqueId}`;\n\n    let result: AnalysisResult;\n\n    try {\n      // 确保临时目录存在\n      if (!existsSync(this.config.tempDir)) {\n        await mkdir(this.config.tempDir, { recursive: true });\n      }\n\n      // 克隆仓库\n      await this.git.clone(githubUrl, workDir);\n\n      // 如果指定了分支,切换到对应分支\n      if (options?.branch) {\n        await this.git.checkoutBranch(workDir, options.branch);\n      }\n\n      // [核心步骤一]: 调用扫描目录\n      result = await this.analyzeFromDirectory(workDir, options);\n\n      // 如果不保留临时文件，则清理\n      if (!this.config.keepTempFiles) {\n        await this.cleanupTempDir(workDir);\n      }\n\n      // 如果是自定义域名访问，添加额外信息\n      // if (isCustomDomain) {\n      //   result.summary = `通过自定义域名 ${this.config.customDomainMap?.targetDomain} 访问\\n原始仓库: ${githubUrl}\\n\\n${result.summary}`;\n      // }\n\n      return result;\n    } catch (error) {\n      // 发生错误时也尝试清理临时文件\n      if (!this.config.keepTempFiles) {\n        await this.cleanupTempDir(workDir);\n      }\n\n      if (error instanceof GitIngestError) {\n        throw error;\n      }\n      throw new GitIngestError(\n        `Failed to analyze repository: ${(error as Error).message}`\n      );\n    }\n  }"
                  },
                  {
                      "id": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts#analyzeFromDirectory",
                      "name": "analyzeFromDirectory",
                      "type": "function",
                      "filePath": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                      "location": {
                          "file": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/index.ts",
                          "line": 157
                      },
                      "implementation": "async analyzeFromDirectory(\n    dirPath: string,\n    options?: AnalyzeOptions\n  ): Promise<AnalysisResult> {\n    if (!dirPath) {\n      throw new ValidationError(\"Path is required\");\n    }\n\n    if (!existsSync(dirPath)) {\n      throw new ValidationError(`Directory not found: ${dirPath}`);\n    }\n\n    try {\n      const files = await this.scanner.scanDirectory(dirPath, {\n        maxFileSize: options?.maxFileSize || this.config.defaultMaxFileSize,\n        includePatterns:\n          options?.includePatterns || this.config.defaultPatterns?.include,\n        excludePatterns:\n          options?.excludePatterns || this.config.defaultPatterns?.exclude,\n        targetPaths: options?.targetPaths,\n        includeDependencies: true,\n      });\n\n      if (files.length === 0) {\n        throw new ValidationError(\"No files found in the specified directory\");\n      }\n\n      // 重置分析器状态\n      this.analyzer = new CodeAnalyzer();\n\n      // 分析代码并构建索引和知识图谱\n      for (const file of files) {\n        try {\n          // 确保是 TypeScript/JavaScript 文件\n          if (/\\.(ts|js|tsx|jsx)$/i.test(file.path)) {\n            // 使用 file.content 而不是重新读取文件\n            const content = file.content;\n            // 使用绝对路径\n            const absolutePath = path.resolve(dirPath, file.path);\n\n            // console.log(`Analyzing file: ${absolutePath}`); // 添加日志\n            this.analyzer.analyzeCode(absolutePath, content);\n          }\n        } catch (error) {\n          console.warn(\n            `Warning: Failed to analyze file ${file.path}: ${(error as Error).message}`\n          );\n        }\n      }\n\n      // 获取分析结果\n      const codeIndex = this.analyzer.getCodeIndex();\n      const knowledgeGraph = this.analyzer.getKnowledgeGraph();\n\n      console.log(`Analysis complete. Found ${codeIndex.size} code elements`); // 添加日志\n\n      return {\n        metadata: {\n          files: files.length,\n          tokens: files.reduce((acc, file) => acc + file.token, 0),\n        },\n        totalCode: files,\n        fileTree: generateTree(files),\n        sizeTree: buildSizeTree(files),\n        codeAnalysis: { codeIndex, knowledgeGraph },\n        dependencyGraph: await analyzeDependencies(dirPath + (options?.miniCommonRoot || ''))\n      };\n    } catch (error) {\n      if (error instanceof GitIngestError) {\n        throw error;\n      }\n      throw new GitIngestError(\n        `Failed to analyze directory: ${(error as Error).message}`\n      );\n    }\n  }"
                  }
              ],
              "edges": [
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#processNode",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#processNode",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#searchKnowledgeGraph",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#findRelatedNodes",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#stringify",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#stringify",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#calculateSize",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#calculateSize",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#tryFindFile",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#estimateTokens",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeFromDirectory",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#generateTree",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeFromDirectory",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#buildSizeTree",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeFromDirectory",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/dist/index.js#analyzeDependencies",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#processNode",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#processNode",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#searchKnowledgeGraph",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/graphSearch.ts#findRelatedNodes",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#stringify",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#stringify",
                      "type": "calls",
                      "properties": {}
                  },
                  {
                      "source": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#calculateSize",
                      "target": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server/repo/git-analyze-bZ-r/git-analyze-bZ/src/utils/index.ts#calculateSize",
                      "type": "calls",
                      "properties": {}
                  }
              ]
          }
      },
      "dependencyGraph": {
          "modules": [
              {
                  "source": "repo/git-analyze-bZ-r/dist/index.d.ts",
                  "dependencies": [],
                  "dependents": [],
                  "orphan": true,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/dist/index.js",
                  "dependencies": [
                      {
                          "module": "crypto",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "crypto",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "dependency-cruiser",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "dependency-cruiser",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "fs",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "fs",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "fs/promises",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "fs/promises",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "glob",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "glob",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "path",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "path",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "simple-git",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "simple-git",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "tree-sitter",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "tree-sitter",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "tree-sitter-typescript",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "tree-sitter-typescript",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      }
                  ],
                  "dependents": [],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "crypto",
                  "followable": false,
                  "coreModule": true,
                  "couldNotResolve": false,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "core",
                      "import"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "dependency-cruiser",
                  "followable": false,
                  "coreModule": false,
                  "couldNotResolve": true,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "unknown"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/utils/analyzeDependencies.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "fs",
                  "followable": false,
                  "coreModule": true,
                  "couldNotResolve": false,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "core",
                      "import"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "fs/promises",
                  "followable": false,
                  "coreModule": true,
                  "couldNotResolve": false,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "core",
                      "import"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/core/scanner.ts",
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "glob",
                  "followable": false,
                  "coreModule": false,
                  "couldNotResolve": true,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "unknown"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/core/scanner.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "path",
                  "followable": false,
                  "coreModule": true,
                  "couldNotResolve": false,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "core",
                      "import"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/core/codeAnalyzer.ts",
                      "repo/git-analyze-bZ-r/src/core/scanner.ts",
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "simple-git",
                  "followable": false,
                  "coreModule": false,
                  "couldNotResolve": true,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "unknown"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/core/gitAction.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "tree-sitter",
                  "followable": false,
                  "coreModule": false,
                  "couldNotResolve": true,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "unknown"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/core/codeAnalyzer.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "tree-sitter-typescript",
                  "followable": false,
                  "coreModule": false,
                  "couldNotResolve": true,
                  "matchesDoNotFollow": false,
                  "dependencyTypes": [
                      "unknown"
                  ],
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/dist/index.js",
                      "repo/git-analyze-bZ-r/src/core/codeAnalyzer.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/core/codeAnalyzer.ts",
                  "dependencies": [
                      {
                          "module": "path",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "path",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "tree-sitter",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "tree-sitter",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "tree-sitter-typescript",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "tree-sitter-typescript",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      }
                  ],
                  "dependents": [
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/core/errors.ts",
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/src/core/gitAction.ts",
                      "repo/git-analyze-bZ-r/src/core/scanner.ts",
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/core/gitAction.ts",
                  "dependencies": [
                      {
                          "module": "./errors",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/core/errors.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "simple-git",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "simple-git",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      }
                  ],
                  "dependents": [
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/core/scanner.ts",
                  "dependencies": [
                      {
                          "module": "../utils",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/utils/index.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "./errors",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/core/errors.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "fs/promises",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "fs/promises",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "glob",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "glob",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "path",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "path",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      }
                  ],
                  "dependents": [
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/utils/index.ts",
                  "dependencies": [
                      {
                          "module": "./graphSearch",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "export"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/utils/graphSearch.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      }
                  ],
                  "dependents": [
                      "repo/git-analyze-bZ-r/src/core/scanner.ts",
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/utils/graphSearch.ts",
                  "dependencies": [],
                  "dependents": [
                      "repo/git-analyze-bZ-r/src/utils/index.ts",
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/index.ts",
                  "dependencies": [
                      {
                          "module": "./core/codeAnalyzer",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/core/codeAnalyzer.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "./core/errors",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/core/errors.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "./core/gitAction",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/core/gitAction.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "./core/scanner",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/core/scanner.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "./utils/analyzeDependencies",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/utils/analyzeDependencies.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "./utils/graphSearch",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "export"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/utils/graphSearch.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "./utils/index",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "local",
                              "import"
                          ],
                          "resolved": "repo/git-analyze-bZ-r/src/utils/index.ts",
                          "coreModule": false,
                          "followable": true,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "crypto",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "crypto",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "fs",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "fs",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "fs/promises",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "fs/promises",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      },
                      {
                          "module": "path",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "core",
                              "import"
                          ],
                          "resolved": "path",
                          "coreModule": true,
                          "followable": false,
                          "couldNotResolve": false,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      }
                  ],
                  "dependents": [],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/utils/analyzeDependencies.ts",
                  "dependencies": [
                      {
                          "module": "dependency-cruiser",
                          "moduleSystem": "es6",
                          "dynamic": false,
                          "exoticallyRequired": false,
                          "dependencyTypes": [
                              "unknown"
                          ],
                          "resolved": "dependency-cruiser",
                          "coreModule": false,
                          "followable": false,
                          "couldNotResolve": true,
                          "matchesDoNotFollow": false,
                          "circular": false,
                          "valid": true
                      }
                  ],
                  "dependents": [
                      "repo/git-analyze-bZ-r/src/index.ts"
                  ],
                  "orphan": false,
                  "valid": true
              },
              {
                  "source": "repo/git-analyze-bZ-r/src/types/index.ts",
                  "dependencies": [],
                  "dependents": [],
                  "orphan": true,
                  "valid": true
              }
          ],
          "summary": {
              "violations": [],
              "error": 0,
              "warn": 0,
              "info": 0,
              "ignore": 0,
              "totalCruised": 20,
              "totalDependenciesCruised": 32,
              "optionsUsed": {
                  "baseDir": "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server",
                  "combinedDependencies": false,
                  "detectJSDocImports": false,
                  "exclude": {
                      "path": "node_modules"
                  },
                  "exoticRequireStrings": [],
                  "externalModuleResolutionStrategy": "node_modules",
                  "metrics": false,
                  "moduleSystems": [
                      "es6",
                      "cjs",
                      "tsd",
                      "amd"
                  ],
                  "outputType": "json",
                  "preserveSymlinks": false,
                  "skipAnalysisNotInRules": false,
                  "tsPreCompilationDeps": false,
                  "args": "repo/git-analyze-bZ-r/"
              }
          }
      },
      "searchEntityResults": {
          "nodes": [],
          "edges": [],
          "metadata": {
              "totalNodes": 0,
              "totalEdges": 0,
              "entities": [],
              "relationTypes": [],
              "maxDistance": 2
          }
      }
  }
}
