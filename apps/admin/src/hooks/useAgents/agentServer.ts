/**
 * 调用 agent server 的 codeReviewAgent 生成代码审查结果
 * @param userPrompt 用户输入的 prompt
 * @returns 代码审查结果
 */
export const callCodeReviewAgent = async (userPrompt: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_AGENT_SERVER_HOST}/api/agents/codeReviewAgent/generate`, {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: userPrompt }] }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.json()
  } catch (error) {
    console.error("code review 失败", error)
    return null
  }
}
