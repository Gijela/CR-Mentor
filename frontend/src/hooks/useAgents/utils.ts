import type { DiffInfo } from "@/lib/github"
import type { KnowledgeGraph, SearchResult } from "@/lib/repo/codeKnowledgeGraphSearch"
import { searchKnowledgeGraph } from "@/lib/repo/codeKnowledgeGraphSearch"

import type { Diff, Entity } from "."

const ANALYZE_FILE_EXTENSIONS = new Set(["ts", "tsx", "js", "jsx", "vue"])

/**
 * 将 diffs 按 maxContext 分组
 * @param diffs
 * @param maxContext
 * @returns
 */
export const dividedDiffGroups = (diffs: Diff[], maxContext = 30000) => {
  const dividedDiffs: Diff[][] = []
  let currentSum = 0, currentDiffs: Diff[] = []
  diffs.forEach((diff) => {
    // 非目标文件直接跳过
    if (!ANALYZE_FILE_EXTENSIONS.has(diff.filename.split(".").pop() || "")) {
      return
    }

    if (currentSum + diff.patch.length >= maxContext) {
      dividedDiffs.push(currentDiffs)
      currentDiffs = []
      currentSum = 0
    }
    currentDiffs.push(diff)
    currentSum += diff.patch.length
  })

  if (dividedDiffs.length === 0 && currentDiffs.length > 0) {
    dividedDiffs.push(currentDiffs)
  }

  return dividedDiffs
}

/**
 * 构建单个模块的上下文
 * @param codeKnowledgeGraph 代码知识图谱
 * @param diffsData  diff 信息
 * @param entityList 实体列表
 * @param diffPathList 模块内的 diff 文件路径列表
 * @returns {allDiffPatch: {filePath: string, diffPatch: string}[], searchedEntityContext: string[]}
 */
export const buildModuleContext = (codeKnowledgeGraph: KnowledgeGraph, diffsData: DiffInfo | undefined, entityList: Entity[], diffPathList: string[]) => {
  if (!diffsData) return { allDiffPatch: [], searchedEntityContext: [] }

  // 获取所有原始的 diff patch
  const allDiffPatch: { filePath: string, diffPatch: string }[] = (diffsData?.files || [])
    .filter((item) => diffPathList.includes(item.filename))
    .map((item) => {
      return { filePath: item.filename, diffPatch: item.patch }
    })

  // 获取一个模块内所有的实体
  const currentModuleEntities = entityList
    .filter((item) => diffPathList.includes(item.file_path))
    .flatMap((item) => item.entities)

  // 根据实体数组从图谱中检索所有相关上下文
  const searchedEntity: SearchResult = searchKnowledgeGraph(codeKnowledgeGraph, {
    entities: [...new Set(currentModuleEntities)],
  })

  // 提取所有相关实体上下文
  const searchedEntityContext: string[] = searchedEntity.nodes.map((item) => item.implementation) as string[]

  // 将所有 diff patch 和 相关实体上下文整合成一个字符串

  return { allDiffPatch, searchedEntityContext }
}
