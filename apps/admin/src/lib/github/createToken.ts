// 获取 githubName 对应用户的 token
export const createToken = async (githubName: string) => {
  try {
    const apiUrl = import.meta.env.VITE_SERVER_HOST
    const tokenResponse = await fetch(`${apiUrl}/github/createToken`, {
      method: "POST",
      body: JSON.stringify({ githubName }),
      headers: {
        "Content-Type": "application/json",
      },
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
