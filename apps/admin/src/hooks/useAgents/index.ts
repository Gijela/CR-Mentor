import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { getDiffInfo } from "@/lib/github"
import { getCommonRoot } from "@/lib/github/utils"
import { filterEntity } from "@/lib/openai"

interface UseAgentsOptions {
  githubName: string
  compareUrl: string
  baseLabel: string
  headLabel: string
}

export interface Diff {
  sha: string
  filename: string
  status: string
  additions: number
  deletions: number
  changes: number
  blob_url: string
  raw_url: string
  contents_url: string
  patch: string
}
/**
 * 将diffs按maxContext分割
 * @param diffs
 * @param maxContext
 * @returns
 */
const dividedDiffBlocks = (diffs: Diff[], maxContext = 2000) => {
  const dividedDiffs: Diff[][] = []
  let currentSum = 0, currentDiffs: Diff[] = []
  diffs.forEach((diff) => {
    if (currentSum + diff.changes >= maxContext) {
      dividedDiffs.push(currentDiffs)
      currentDiffs = []
      currentSum = 0
    }
    currentDiffs.push(diff)
    currentSum += diff.changes
  })

  if (dividedDiffs.length === 0 && currentDiffs.length > 0) {
    dividedDiffs.push(currentDiffs)
  }

  return dividedDiffs
}

const useAgents = (options: UseAgentsOptions) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agents", options],
    queryFn: () => getDiffInfo(options),
  })

  const [diffEntityObj, setDiffEntityObj] = useState<{
    entityList: { file_path: string, entities: string[] }[]
    filteredSummary: string
    miniCommonRoot: string
  }>({
    entityList: [],
    filteredSummary: "",
    miniCommonRoot: "",
  })

  // 分组，防止超出大模型上下文限制
  const filteredDiffs = async (files: Diff[]) => {
    const targetDiffs = dividedDiffBlocks(files)
    if (targetDiffs.length === 0) return

    const results = await Promise.all(targetDiffs.map((diff) => filterEntity(diff)))
    // 获取过滤后的实体列表
    const entityList = results.filter((item) => item.success).flatMap((item) => item.data?.entityList)
    // 获取被过滤的diff内容的总摘要
    const filteredSummary = results.filter((item) => item.success).map((item) => item.data?.filteredSummary).join("\n")

    setDiffEntityObj({
      entityList,
      filteredSummary,
      miniCommonRoot: getCommonRoot(entityList),
    })
  }

  useEffect(() => {
    if (data) {
      filteredDiffs(data?.files || [])
    }
  }, [data])

  return {
    data,
    isLoading,
    error,
    diffEntityObj,
  }
}

export default useAgents
