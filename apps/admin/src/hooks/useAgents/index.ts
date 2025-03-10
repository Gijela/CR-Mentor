import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { getDiffInfo } from "@/lib/github"
import { getCommonRoot } from "@/lib/github/utils"
import { filterEntity, summaryCommitMsg } from "@/lib/openai"
import { getRepoCodeGraph } from "@/lib/repo"
import type { KnowledgeGraph } from "@/lib/repo/codeKnowledgeGraphSearch"
import { groupModulesByDependency } from "@/lib/repo/groupModulesByDependency"

import { buildModuleContext, dividedDiffGroups } from "./utils"

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

export interface Entity {
  file_path: string
  entities: string[]
}

export interface DiffEntity {
  // 所有实体列表
  entityList: Entity[]
  // 所有实体的摘要
  filteredSummary: string
  // 最小公共根
  miniCommonRoot: string
  // 所有实体的文件路径
  targetPaths: string[]
  // 所有 commits message 信息
  commitsMsg: string
  // 是否被赋值
  hasValuation: boolean
}

enum Step {
  Diff = 0, // 获取 diff 信息
  DiffEntity = 1, // 处理 diff 信息(过滤小变更、大变更提取实体)
  CodeKnowledgeGraph = 2, // 获取代码知识图谱, 并且基于依赖关系图划分功能模块
  CombinedContextList = 3, // 构建每一个模块的上下文, 得到可用于直接提供给大模型的 prompt
  CodeReview = 4, // code review
}

const useAgents = (options: UseAgentsOptions) => {
  const [step, setStep] = useState<Step>(Step.Diff)

  // 1. 获取 diff 信息 {files: any[], commits: any[]}
  const { data: diffsData } = useQuery({
    queryKey: ["agents", options],
    queryFn: () => getDiffInfo(options),
  })

  // 保存处理后的 diff 信息(过滤小变更、大变更提取实体)
  const [diffEntityObj, setDiffEntityObj] = useState<DiffEntity>({
    hasValuation: false, // 是否被赋值
    entityList: [],
    filteredSummary: "",
    miniCommonRoot: "",
    targetPaths: [],
    commitsMsg: "",
  })
  // 2. 处理 diff 信息
  useEffect(() => {
    if (diffsData) {
      setStep(Step.DiffEntity)
      // 分组，防止超出大模型上下文限制
      const filteredDiffs = async (files: Diff[]) => {
        const blocksDiffs = dividedDiffGroups(files)
        if (blocksDiffs.length === 0) return

        // 获取所有 commits 的 message 信息
        const commitsMsgList: string[] = (diffsData?.commits || []).map((item) => item.commit.message)

        // 使用大模型处理每一组的内容, 小变更变更直接过滤, 复杂变更提取实体
        const results = await Promise.all([
          ...blocksDiffs.map((diff) => filterEntity(diff)),
          summaryCommitMsg(commitsMsgList),
        ])

        const entityListResult = results.slice(0, -1)
        const summaryResult = results.at(-1)

        // 获取过滤后的实体列表, 并且拍平，因为不需要再去分组
        const entityList: { file_path: string, entities: string[] }[] = entityListResult
          .filter((item) => item.success)
          .flatMap((item) => item.data?.entityList)

        // 获取被过滤的diff内容的总摘要
        const filteredSummary = entityListResult
          .filter((item: any) => item.success)
          .map((item: any) => item.data?.filteredSummary)
          .join("\n")

        setDiffEntityObj({
          hasValuation: true,
          entityList,
          filteredSummary,
          miniCommonRoot: `/${getCommonRoot(entityList)}`,
          targetPaths: entityList.map((item) => item.file_path),
          commitsMsg: summaryResult?.data?.summary || "",
        })
      }

      filteredDiffs(diffsData?.files || [])
    }
  }, [diffsData])

  const [codeKnowledgeGraph, setCodeKnowledgeGraph] = useState<KnowledgeGraph>({} as KnowledgeGraph) // 代码知识图谱
  const [moduleList, setModuleList] = useState<string[][]>([]) // 模块列表 [['/src/components/Button.tsx'], ['/src/components/Input.tsx', '/src/components/Textarea.tsx']]
  const [combinedContextList, setCombinedContextList] = useState<string[]>([]) // 处理后可以直接提供给大模型的 prompt
  // 3. 获取代码知识图谱, 并且基于依赖关系图划分功能模块
  useEffect(() => {
    if (diffEntityObj && diffEntityObj.hasValuation) {
      setStep(Step.CodeKnowledgeGraph)
      // 获取代码图谱 & 依赖关系图
      const fetchCodeGraph = async (diffEntityObj: DiffEntity) => {
        const result = await getRepoCodeGraph({
          url: "https://github.com/Gijela/git-analyze",
          branch: "main",
          targetPaths: diffEntityObj.targetPaths,
          miniCommonRoot: diffEntityObj.miniCommonRoot,
        })
        if (!result.success) return

        // 代码知识图谱
        setCodeKnowledgeGraph(result?.data?.codeAnalysis?.knowledgeGraph || {})

        // 基于依赖关系图, 对过滤后的 diff 文件进行按依赖关系划分模块
        const moduleList = groupModulesByDependency(result?.data?.dependencyGraph, diffEntityObj.targetPaths)
        setModuleList(moduleList)
      }
      fetchCodeGraph(diffEntityObj)
    }
  }, [diffEntityObj])

  // 4. 构建每一个模块的上下文, 得到可用于直接提供给大模型的 prompt
  useEffect(() => {
    if (moduleList.length > 0) {
      setStep(Step.CombinedContextList)
      // 基于实体列表, 从代码知识图谱中检索相关上下文
      const moduleContextList = moduleList.map((diffPathList) => buildModuleContext(
        codeKnowledgeGraph,
        diffsData,
        diffEntityObj.entityList,
        diffPathList,
      ))

      // 将diff patch 和 相关实体上下文整合成一个字符串, 作为用户 prompt 提供大模型
      const combinedContextList: string[] = moduleContextList.map((item, index) => `
## 所有 commits message 信息
可用于理解代码的变更历史、变更原因、变更动机、变更目的等, 是代码评审的重要参考信息。后续的 diff patch 可以基于这些信息进行更准确的评审, 
但是需要注意的是, diff patch 是基于当前的代码, 而 commits message 是基于历史提交, 所以 commits messages 可能说明了一些功能，但是 diff patch 中不存在, 这些是合理的。
${diffEntityObj.commitsMsg}

## diff patch 信息
${(item.allDiffPatch || [])
          .map((diffItem) => `## [diff ${index + 1}] \n filepath: ${diffItem.filePath} \n patch content: \n ${diffItem.diffPatch}`)
          .join("\n\n")}

## Some additional information to help understand the patch code
${item.searchedEntityContext.join("\n\n")}
`)

      setCombinedContextList(combinedContextList)
    }
  }, [moduleList])

  // 5. code review
  useEffect(() => {
    if (combinedContextList.length > 0) {
      setStep(Step.CodeReview)

      // const codeReview = async (combinedContextList: string[]) => {
      //   // const codeReviewResults = await Promise.all(combinedContextList.map((userPrompt) => codeReview(userPrompt)))

      // }
      // // 使用大模型进行 code review
      // codeReview(combinedContextList)
    }
  }, [combinedContextList])

  return {
    diffsData,
    combinedContextList,
    step,
  }
}

export default useAgents

// 评论

// 发布总结
// token 是 github 的 token
// _links.comments.href 是发布评论的接口

// 发布行级评论
// token 是 github 的 token
// _links.review_comments.href 是发布行级评论的接口
// 最后一个 commit 的 sha 作为统一 commit_id
// 文件路径 file_path
// 行号 position: patch ? patch.split('\n').length - 1 : 1,
