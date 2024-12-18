// 获取 githubName 对应用户的 token
export const createToken = async (githubName: string) => {
  try {
    const apiUrl = import.meta.env.VITE_GITHUB_SERVER_API
    const tokenResponse = await fetch(`${apiUrl}/api/github/createToken`, {
      method: "POST",
      body: JSON.stringify({ githubName }),
    })

    const { token, success } = await tokenResponse.json()
    if (!success) {
      throw new Error("Get token failed")
    }

    return token
  } catch (error) {
    console.error("Get token failed:", error)
    return null
  }
}