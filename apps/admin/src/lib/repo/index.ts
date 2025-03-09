export interface GetRepoInfoOptions {
  url: string
  branch: string
  targetPaths: string[]
  miniCommonRoot: string
  maxFileSize?: number
  exclude?: string[]
  analyzeDependencies?: boolean
}

/**
 * 构建知识图谱
 * @param options
 * @returns
 */
export const getRepoCodeGraph = async (options: GetRepoInfoOptions) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_HOST}/repo/analyzeRepo`, {
      method: "POST",
      body: JSON.stringify(options),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
