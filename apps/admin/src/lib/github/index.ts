// 获取 githubName 对应用户的 token
export const createToken = async (githubName: string) => {
  try {
    const tokenResponse = await fetch(`${import.meta.env.VITE_SERVER_HOST}/github/createToken`, {
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

interface GetDiffInfoParams {
  githubName: string // 用户名 => Gijela
  compareUrl: string // 对比的 URL => https://api.github.com/repos/Gijela/git-analyze/compare/{base}...{head}
  baseLabel: string // 基础标签 => Gijela:faeture/v1
  headLabel: string // 头部标签 => Gijela:main
}

export interface Diff {
  sha: string
  filename: string
  status: string
  additions: number
  deletions: number
  changes: number
  blob_url: string
  raw_url: string
  contents_url: string
  patch: string
}

export interface DiffInfo {
  files: Diff[]
  commits: any[]
}

// 获取 diff 信息
export const getDiffInfo = async (params: GetDiffInfoParams): Promise<DiffInfo> => {
  try {
    const diffInfoResponse = await fetch(`${import.meta.env.VITE_SERVER_HOST}/github/getDiffsDetails`, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const { data, success } = await diffInfoResponse.json()
    if (!success) {
      throw new Error("Get diff info failed")
    }

    // {files: any[], commits: any[]}
    return data
  } catch (error) {
    console.error("Get diff info failed:", error)
    return {
      files: [],
      commits: [],
    }
  }
}
