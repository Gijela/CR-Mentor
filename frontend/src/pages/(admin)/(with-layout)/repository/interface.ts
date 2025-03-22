export interface Repository {
  id: number
  name: string
  html_url?: string
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
