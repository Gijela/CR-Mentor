export interface DependencyModule {
  source: string
  dependencies: Array<{
    module: string
    resolved: string
    [key: string]: any
  }>
  dependents: string[]
  [key: string]: any
}

export interface DependencyGraph {
  modules: DependencyModule[]
  [key: string]: any
}

/**
 * 根据依赖关系划分模块
 * @param dependencyGraph 依赖关系图
 * @param diffFiles 差异文件
 * @returns {} 模块列表
*/
export const groupModulesByDependency = (dependencyGraph: DependencyGraph, diffFiles: string[]) => {
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
