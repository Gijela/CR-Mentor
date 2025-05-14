import { mastra } from ".."
import { generateUUID } from "@/lib/generateUUID";

export const callDbChatAgent = async (userPrompt: string, developerId: string): Promise<any> => {
  try {
    const agent = await mastra.getAgent("dbChatAgent")
    const result = await agent.generate(userPrompt, {
      resourceId: developerId,
      threadId: `thread_${developerId}`,
      maxSteps: 20
    })
    return result
  } catch (error) {
    console.error("🚀 ~ callDbChatAgent ~ error:", error)
  }
}