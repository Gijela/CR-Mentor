import { mastra } from ".."
import { generateUUID } from "@/lib/generateUUID";

export const callCommitsAnalyzeAgent = async (userPrompt: string): Promise<any> => {
  const resourceId = generateUUID()
  const HELLO_WORLD = '下面是按照代码提交时间先后顺序分析出来的代码回顾与成长分析报告，可能会提供一个报告，也可能提供多个报告，请根据报告内容，按照要求处理这些报告。\n\n'

  // 聊天记录不做向量存储, resourceId、threadId 随意填写
  try {
    const agent = await mastra.getAgent("commitsAnalyzeAgent")
    const result = await agent.generate(HELLO_WORLD + userPrompt, {
      resourceId,
      threadId: `thread_${resourceId}`,
      maxSteps: 20
    })
    return result
  } catch (error) {
    console.error("🚀 ~ callCommitsAnalyzeAgent ~ error:", error)
  }
}