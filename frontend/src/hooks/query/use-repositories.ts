import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { createToken } from "@/lib/github"
import { usePlatform } from "../use-platform"

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
  githubName?: string
  search?: string
  sort?: "created" | "updated" | "pushed" | "full_name" | "stars" | "forks"
  order?: "desc" | "asc"
  pageSize?: number
}

interface RepositoryResponse {
  items: Repository[]
  total_count: number
}

export function useRepositories(options: UseRepositoriesOptions) {
  const [page, setPage] = useState(1)
  const { githubName = '', search = "", sort = "updated", order = "desc", pageSize = 20 } = options
  const { isGithub, isGitlab } = usePlatform();

  const githubTokenQuery = useQuery({
    queryKey: ["githubToken", githubName],
    queryFn: () => createToken(githubName),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
    enabled: isGithub
  })

  const query = useQuery<RepositoryResponse>({
    queryKey: ["repositories", { githubName, search, sort, order, page, pageSize }],
    queryFn: async () => {
      if (isGithub) {
        const token = githubTokenQuery.data
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
      } else if (isGitlab) {
        console.warn('gitlab', import.meta.env.VITE_SERVER_HOST)
        const response = await fetch(`${import.meta.env.VITE_SERVER_HOST}/gitlab/getProjectList`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search,
            page,
            per_page: pageSize,
          }),
        })

        console.log('response', response)

        if (!response.ok) {
          throw new Error("Get GitLab repositories failed")
        }

        const responseData = await response.json()

        if (!responseData.success) {
          throw new Error(responseData.message || "Get GitLab repositories failed")
        }

        return {
          items: responseData.data.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            visibility: repo.visibility,
            language: repo.language || "",
            stargazers_count: repo.star_count,
            forks_count: repo.forks_count,
            updated_at: repo.last_activity_at,
            description: repo.description,
            license: repo.license,
            html_url: repo.web_url,
          })),
          total_count: responseData.total || responseData.data.length,
        }
      } else {
        throw new Error("Unsupported platform")
      }
    },
    enabled: isGithub ? !!githubTokenQuery.data : isGitlab,
  })

  return {
    data: query.data?.items || [],
    isLoading: isGithub ? githubTokenQuery.isLoading || query.isLoading : query.isLoading,
    page,
    setPage,
    totalCount: query.data?.total_count || 0,
  }
}
