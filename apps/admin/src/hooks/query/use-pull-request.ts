import { useQuery } from "@tanstack/react-query"

import { createToken } from "@/lib/github"

export interface PullRequest {
  id: string
  title: string
  status: "open" | "closed" | "merged"
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  sourceBranch: string
  targetBranch: string
  repository: {
    name: string
    url: string
  }
  prUrl: string
}

interface UsePullRequestsOptions {
  owner: string
  repo: string
  state?: "open" | "closed" | "merged" | "all"
  sort?: "created" | "updated" | "popularity" | "long-running"
  direction?: "asc" | "desc"
  per_page?: number
  page?: number
  query?: string
}

interface GitHubPullRequest {
  number: number
  title: string
  state: string
  user: {
    login: string
    avatar_url: string
  } | null
  created_at: string
  head: {
    ref: string
    repo: {
      name: string
      full_name: string
      html_url: string
    } | null
  } | null
  base: {
    ref: string
  } | null
  html_url: string
  merged_at: string | null
}

interface GitHubSearchResponse {
  total_count: number
  items: any[]
}

const GITHUB_API_BASE_URL = "https://api.github.com"

interface TokenData {
  token: string
  expiresAt: number
}

// 使用单个tokenRef即可
let tokenCache: TokenData | null = null

const fetchPullRequests = async ({
  owner,
  repo,
  state = "all",
  sort = "created",
  direction = "desc",
  per_page = 10,
  page = 1,
  query = "",
}: UsePullRequestsOptions) => {
  // 获取或创建token的逻辑
  let currentToken = tokenCache?.token

  // 如果需要新token，先获取并等待
  if (!tokenCache || tokenCache.expiresAt < Date.now() + 30000) {
    const newToken = await createToken(owner)
    currentToken = newToken
    tokenCache = {
      token: newToken,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10分钟过期
    }
  }

  if (!currentToken) {
    throw new Error("Failed to get GitHub token")
  }

  let url: string
  let queryString: string

  if (repo) {
    // 单仓库搜索：使用 search API 而不是 pulls API 来支持标题搜索
    if (query) {
      // 如果有搜索词，使用 search API
      url = `${GITHUB_API_BASE_URL}/search/issues`
      const stateQuery = state !== "all" ? `+state:${state}` : ""
      const searchQuery = `+in:title+${query}`
      queryString = `?q=is:pr+repo:${owner}/${repo}${stateQuery}${searchQuery}&sort=${sort}&order=${direction}&per_page=${per_page}&page=${page}`
    } else {
      // 如果没有搜索词，使用普通的 pulls API
      url = `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/pulls`
      const apiState = state === "merged" ? "closed" : state
      queryString = `?state=${apiState}&sort=${sort}&direction=${direction}&per_page=${per_page}&page=${page}`
    }
  } else {
    // 全局搜索：使用 search API
    url = `${GITHUB_API_BASE_URL}/search/issues`
    const stateQuery = state !== "all" ? `+state:${state}` : ""
    const searchQuery = query ? `+in:title+${query}` : ""
    queryString = `?q=is:pr+author:${owner}${stateQuery}${searchQuery}&sort=${sort}&order=${direction}&per_page=${per_page}&page=${page}`
  }

  try {
    const response = await fetch(url + queryString, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    // 处理token过期的情况
    if (response.status === 401) {
      const newToken = await createToken(owner)
      tokenCache = {
        token: newToken,
        expiresAt: Date.now() + 10 * 60 * 1000,
      }
      fetchPullRequests({ owner, repo, state, sort, direction, per_page, page, query })
      return
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    let data: GitHubPullRequest[]
    let totalCount = 0

    if (repo && !query) {
      // 只有在使用 pulls API 时才需要这个处理
      data = await response.json()
      // 从响应头获取总数
      const linkHeader = response.headers.get("Link")
      if (linkHeader) {
        const lastLink = linkHeader.split(",").find((link) => link.includes('rel="last"'))
        if (lastLink) {
          const match = /&page=(\d+)/.exec(lastLink as string)
          totalCount = match ? Number.parseInt(match[1] as string, 10) * per_page : per_page
        } else {
          totalCount = per_page
        }
      } else {
        totalCount = data.length
      }
    } else {
      // 使用 search API 的情况
      const searchResult: GitHubSearchResponse = await response.json()
      totalCount = searchResult.total_count
      data = searchResult.items.map((item) => {
        const urlParts = item.html_url.split("/")
        const repoName = urlParts[4]
        const prNumber = Number.parseInt(urlParts[6], 10)

        return {
          number: prNumber,
          title: item.title,
          state: item.state,
          user: item.user,
          created_at: item.created_at,
          html_url: item.html_url,
          merged_at: item.merged_at,
          head: {
            ref: item.head?.ref || "unknown",
            repo: {
              name: repoName,
              full_name: `${owner}/${repoName}`,
              html_url: `https://github.com/${owner}/${repoName}`,
            },
          },
          base: {
            ref: item.base?.ref || "unknown",
          },
        }
      })
    }

    return {
      items: data.map((pr): PullRequest => ({
        id: repo ? pr.number.toString() : `${pr.head?.repo?.name}-${pr.number}`,
        title: pr.title || "",
        status: pr.merged_at ? "merged" : (pr.state as "open" | "closed"),
        author: {
          name: pr.user?.login || "Unknown",
          avatar: pr.user?.avatar_url || "",
        },
        createdAt: new Date(pr.created_at).toISOString().replace("T", " ").slice(0, 19),
        sourceBranch: pr.head?.ref ?? "unknown",
        targetBranch: pr.base?.ref ?? "unknown",
        repository: {
          name: repo || (pr.head?.repo?.name ?? "unknown"),
          url: repo ?
            `https://github.com/${owner}/${repo}` :
              (pr.head?.repo?.html_url ?? "#"),
        },
        prUrl: pr.html_url,
      })),
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching pull requests:", error)
    return {
      items: [],
      totalCount: 0,
    }
  }
}

export const usePullRequests = (options: UsePullRequestsOptions) => {
  return useQuery({
    queryKey: ["pullRequests", options],
    queryFn: () => fetchPullRequests(options),
    retry: 1,
    retryDelay: 1000,
  })
}
