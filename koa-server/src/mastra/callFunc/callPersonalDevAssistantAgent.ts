import { mastra } from ".."

export const callDevAssistantGenerate = async (message: string, developer_id: string): Promise<any> => {
  const resourceId = developer_id.toLowerCase()
  const threadId = `thread_${resourceId}_${Math.random().toString(36).substring(2, 15)}`
  try {
    const agent = await mastra.getAgent("personalDevAssistantAgent")
    const result = await agent.generate(message, {
      resourceId,
      threadId,
      maxSteps: 20
    })
    return result
  } catch (error) {
    console.error("🚀 ~ callPersonalDevAssistantAgent ~ error:", error)
  }
}