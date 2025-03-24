import logger from "./logger"

interface DependencyModule {
  source: string
  dependencies: Array<{
    module: string
    resolved: string
    [key: string]: any
  }>
  dependents: string[]
  [key: string]: any
}

interface DependencyGraph {
  modules: DependencyModule[]
  [key: string]: any
}

// 测试数据
const mockDependencyGraph: DependencyGraph = {
  modules: [
    {
      source: "repo/github101-J7tz/src/core/codeAnalyzer.ts",
      dependencies: [
        {
          module: "path",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "core",
            "import",
          ],
          resolved: "path",
          coreModule: true,
          followable: false,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "tree-sitter",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "unknown",
          ],
          resolved: "tree-sitter",
          coreModule: false,
          followable: false,
          couldNotResolve: true,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "tree-sitter-typescript",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "unknown",
          ],
          resolved: "tree-sitter-typescript",
          coreModule: false,
          followable: false,
          couldNotResolve: true,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "path",
      followable: false,
      coreModule: true,
      couldNotResolve: false,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "core",
        "import",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/core/codeAnalyzer.ts",
        "repo/github101-J7tz/src/core/scanner.ts",
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "tree-sitter",
      followable: false,
      coreModule: false,
      couldNotResolve: true,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "unknown",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/core/codeAnalyzer.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "tree-sitter-typescript",
      followable: false,
      coreModule: false,
      couldNotResolve: true,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "unknown",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/core/codeAnalyzer.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "repo/github101-J7tz/src/core/errors.ts",
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/core/gitAction.ts",
        "repo/github101-J7tz/src/core/scanner.ts",
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "repo/github101-J7tz/src/core/gitAction.ts",
      dependencies: [
        {
          module: "./errors",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/core/errors.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "simple-git",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "unknown",
          ],
          resolved: "simple-git",
          coreModule: false,
          followable: false,
          couldNotResolve: true,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "simple-git",
      followable: false,
      coreModule: false,
      couldNotResolve: true,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "unknown",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/core/gitAction.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "repo/github101-J7tz/src/core/scanner.ts",
      dependencies: [
        {
          module: "../utils",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/utils/index.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "./errors",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/core/errors.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "fs/promises",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "core",
            "import",
          ],
          resolved: "fs/promises",
          coreModule: true,
          followable: false,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "glob",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "unknown",
          ],
          resolved: "glob",
          coreModule: false,
          followable: false,
          couldNotResolve: true,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "path",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "core",
            "import",
          ],
          resolved: "path",
          coreModule: true,
          followable: false,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "fs/promises",
      followable: false,
      coreModule: true,
      couldNotResolve: false,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "core",
        "import",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/core/scanner.ts",
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "glob",
      followable: false,
      coreModule: false,
      couldNotResolve: true,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "unknown",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/core/scanner.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "repo/github101-J7tz/src/utils/index.ts",
      dependencies: [
        {
          module: "./graphSearch",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "export",
          ],
          resolved: "repo/github101-J7tz/src/utils/graphSearch.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        "repo/github101-J7tz/src/core/scanner.ts",
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "repo/github101-J7tz/src/utils/graphSearch.ts",
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/utils/index.ts",
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "repo/github101-J7tz/src/index.ts",
      dependencies: [
        {
          module: "./core/codeAnalyzer",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/core/codeAnalyzer.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "./core/errors",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/core/errors.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "./core/gitAction",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/core/gitAction.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "./core/scanner",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/core/scanner.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "./utils/analyzeDependencies",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/utils/analyzeDependencies.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "./utils/graphSearch",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "export",
          ],
          resolved: "repo/github101-J7tz/src/utils/graphSearch.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "./utils/index",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "local",
            "import",
          ],
          resolved: "repo/github101-J7tz/src/utils/index.ts",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "crypto",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "core",
            "import",
          ],
          resolved: "crypto",
          coreModule: true,
          followable: false,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "fs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "core",
            "import",
          ],
          resolved: "fs",
          coreModule: true,
          followable: false,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "fs/promises",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "core",
            "import",
          ],
          resolved: "fs/promises",
          coreModule: true,
          followable: false,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          module: "path",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "core",
            "import",
          ],
          resolved: "path",
          coreModule: true,
          followable: false,
          couldNotResolve: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [],
      orphan: false,
      valid: true,
    },
    {
      source: "crypto",
      followable: false,
      coreModule: true,
      couldNotResolve: false,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "core",
        "import",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "fs",
      followable: false,
      coreModule: true,
      couldNotResolve: false,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "core",
        "import",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "repo/github101-J7tz/src/utils/analyzeDependencies.ts",
      dependencies: [
        {
          module: "dependency-cruiser",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "unknown",
          ],
          resolved: "dependency-cruiser",
          coreModule: false,
          followable: false,
          couldNotResolve: true,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        "repo/github101-J7tz/src/index.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "dependency-cruiser",
      followable: false,
      coreModule: false,
      couldNotResolve: true,
      matchesDoNotFollow: false,
      dependencyTypes: [
        "unknown",
      ],
      dependencies: [],
      dependents: [
        "repo/github101-J7tz/src/utils/analyzeDependencies.ts",
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "repo/github101-J7tz/src/types/index.ts",
      dependencies: [],
      dependents: [],
      orphan: true,
      valid: true,
    },
  ],
  summary: {
    violations: [],
    error: 0,
    warn: 0,
    info: 0,
    ignore: 0,
    totalCruised: 18,
    totalDependenciesCruised: 23,
    optionsUsed: {
      baseDir: "/Users/gijela/Desktop/github-repo/CR-Mentor/apps/koa_server",
      combinedDependencies: false,
      detectJSDocImports: false,
      exclude: {
        path: "node_modules",
      },
      exoticRequireStrings: [],
      externalModuleResolutionStrategy: "node_modules",
      metrics: false,
      moduleSystems: [
        "es6",
        "cjs",
        "tsd",
        "amd",
      ],
      outputType: "json",
      preserveSymlinks: false,
      skipAnalysisNotInRules: false,
      tsPreCompilationDeps: false,
      args: "repo/github101-J7tz/src",
    },
  },
}

// 模拟的 diff 文件列表
const mockDiffFiles = [
  "repo/github101-J7tz/src/core/scanner.ts",
  "repo/github101-J7tz/src/core/errors.ts",
  "repo/github101-J7tz/src/utils/graphSearch.ts",
  "repo/github101-J7tz/src/core/gitAction.ts",
]

// 根据依赖关系划分模块
function groupModulesByDependency(dependencyGraph: DependencyGraph, diffFiles: string[]) {
  const modules: string[][] = []
  const processed = new Set<string>()

  // 构建完整的依赖关系图（包括正向和反向依赖）
  const dependencyMap = new Map<string, Set<string>>()

  function addDependency(from: string, to: string) {
    if (!dependencyMap.has(from)) {
      dependencyMap.set(from, new Set())
    }
    if (!dependencyMap.has(to)) {
      dependencyMap.set(to, new Set())
    }
    dependencyMap.get(from)!.add(to)
    dependencyMap.get(to)!.add(from)
  }

  // 构建依赖关系图
  for (const module of dependencyGraph.modules) {
    if (!module.source.startsWith("repo/")) continue

    // 添加正向依赖
    for (const dep of module.dependencies || []) {
      if (dep.resolved && dep.resolved.startsWith("repo/")) {
        addDependency(module.source, dep.resolved)
      }
    }

    // 添加反向依赖
    for (const dependent of module.dependents || []) {
      if (dependent.startsWith("repo/")) {
        addDependency(module.source, dependent)
      }
    }
  }

  // 使用 DFS 查找相关文件
  function findRelatedFiles(file: string, currentModule: Set<string>) {
    if (processed.has(file)) return

    processed.add(file)
    currentModule.add(file)

    // 遍历所有相关依赖
    const relatedFiles = dependencyMap.get(file) || new Set()
    for (const relatedFile of relatedFiles) {
      if (diffFiles.includes(relatedFile) && !processed.has(relatedFile)) {
        findRelatedFiles(relatedFile, currentModule)
      }
    }
  }

  // 处理每个 diff 文件
  for (const file of diffFiles) {
    if (processed.has(file)) continue

    const currentModule = new Set<string>()
    findRelatedFiles(file, currentModule)

    if (currentModule.size > 0) {
      modules.push(Array.from(currentModule))
    }
  }

  return modules
}

// 执行测试
function runTest() {
  logger.info("开始模块划分测试\n")
  logger.info("输入 diff 文件:")
  logger.info(mockDiffFiles)
  logger.info("\n依赖图结构:")
  mockDependencyGraph.modules.forEach((module) => {
    logger.info(`\n文件: ${module.source}`)
    if (module.dependencies.length > 0) {
      logger.info("依赖:")
      module.dependencies.forEach((dep) => logger.info(`  - ${dep.resolved}`))
    }
    if (module.dependents.length > 0) {
      logger.info("被依赖:")
      module.dependents.forEach((dep) => logger.info(`  - ${dep}`))
    }
  })

  logger.info("\n执行模块划分...")
  const moduleGroups = groupModulesByDependency(mockDependencyGraph, mockDiffFiles)

  logger.info("\n划分结果:")
  moduleGroups.forEach((module, index) => {
    logger.info(`\n模块 ${index + 1}:`)
    module.forEach((file) => {
      logger.info(`- ${file}`)
    })
  })
}

// 运行测试
runTest()
