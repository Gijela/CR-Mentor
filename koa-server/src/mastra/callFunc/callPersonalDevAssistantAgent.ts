import { mastra } from ".."

export const callDevAssistantGenerate = async (message: string, developer_id: string): Promise<any> => {
  try {
    const agent = await mastra.getAgent("personalDevAssistantAgent")
    const result = await agent.generate(message, {
      resourceId: developer_id,
      threadId: `thread_${developer_id}`,
      maxSteps: 20
    })
    return result
  } catch (error) {
    console.error("🚀 ~ callPersonalDevAssistantAgent ~ error:", error)
  }
}