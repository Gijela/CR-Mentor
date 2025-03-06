import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { createToken } from "@/lib/github"

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
  html_url: string
}

interface UseRepositoriesOptions {
  githubName: string
  search?: string
  sort?: "created" | "updated" | "pushed" | "full_name" | "stars" | "forks"
  order?: "desc" | "asc"
  pageSize?: number
}

interface RepositoryResponse {
  items: Repository[]
  total_count: number
}

function useGithubToken(githubName: string) {
  return useQuery({
    queryKey: ["githubToken", githubName],
    queryFn: () => createToken(githubName),
    staleTime: 10 * 60 * 1000, // 10分钟的缓存时间
    gcTime: 15 * 60 * 1000, // 15分钟的垃圾回收时间
    retry: 2, // 失败时重试2次
  })
}

export function useRepositories(options: UseRepositoriesOptions) {
  const [page, setPage] = useState(1)
  const { githubName, search = "", sort = "updated", order = "desc", pageSize = 20 } = options

  const tokenQuery = useGithubToken(githubName)

  const query = useQuery<RepositoryResponse>({
    queryKey: ["repositories", { githubName, search, sort, order, page, pageSize }],
    queryFn: async () => {
      const token = tokenQuery.data
      if (!token) {
        throw new Error("Get token failed")
      }

      let url = `https://api.github.com/search/repositories?q=user:${githubName}`
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

      return await response.json()
    },
    enabled: !!tokenQuery.data,
  })

  return {
    data: query.data?.items || [],
    isLoading: tokenQuery.isLoading || query.isLoading,
    page,
    setPage,
    totalCount: query.data?.total_count || 0,
  }
}
