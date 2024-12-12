import { useEffect, useState } from "react"

interface Repository {
  id: number
  name: string
  visibility: "public" | "private"
  language: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  description?: string
  license?: {
    name: string
  }
}

interface UseRepositoriesOptions {
  githubName: string
  search?: string
  sort?: "created" | "updated" | "pushed" | "full_name" | "stars" | "forks"
  order?: "desc" | "asc"
  pageSize?: number
}

export function useRepositories(options: UseRepositoriesOptions) {
  const {
    githubName,
    search = "",
    sort = "updated",
    order = "desc",
    pageSize = 20,
  } = options
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Repository[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const fetchData = async () => {
    setIsLoading(true)

    try {
      // 1. 获取 githubName 对应用户的 token
      const tokenResponse = await fetch("/api/github/createToken", {
        method: "POST",
        body: JSON.stringify({ githubName }),
      })

      const { token, success } = await tokenResponse.json()
      if (!success) {
        throw new Error("Get token failed")
      }

      // 2. 获取 githubName 对应用户的仓库
      let url = `https://api.github.com/`

      url += `search/repositories?q=user:${githubName}`
      if (search) {
        url += `+${encodeURIComponent(search)}`
      }
      url += `&page=${page}&per_page=${pageSize}`

      url += `&sort=${sort}&order=${order}`

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Get repositories failed")
      }

      const result = await response.json()
      setData(result.items)
      setTotalCount(result.total_count)
    } catch (error) {
      console.error("Get repositories failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, search, sort, order])

  return {
    data,
    isLoading,
    page,
    setPage,
    totalCount,
  }
}
