import { mastra } from ".."
import { generateUUID } from "@/lib/generateUUID";

export const callPrAnalyzeAgent = async (message: string): Promise<any> => {
  const resourceId = generateUUID()

  // 聊天记录不做向量存储, resourceId、threadId 随意填写
  try {
    const agent = await mastra.getAgent("prAnalyzeAgent")
    const result = await agent.generate(message, {
      resourceId,
      threadId: `thread_${resourceId}`,
      maxSteps: 20
    })
    return result
  } catch (error) {
    console.error("🚀 ~ callprAnalyzeAgent ~ error:", error)
  }
}