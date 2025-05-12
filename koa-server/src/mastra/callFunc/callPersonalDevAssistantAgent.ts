import { mastra } from ".."

export const callPrAnalyzeAgent = async (message: string, developer_id: string): Promise<any> => {
  const resourceId = developer_id.toLowerCase()
  const threadId = `thread_${resourceId}_${Math.random().toString(36).substring(2, 15)}`
  try {
    const agent = await mastra.getAgent("prAnalyzeAgent")
    const result = await agent.generate(message, {
      resourceId,
      threadId,
      maxSteps: 20
    })
    return result
  } catch (error) {
    console.error("🚀 ~ callprAnalyzeAgent ~ error:", error)
  }
}