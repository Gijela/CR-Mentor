import { useState, useEffect, useRef } from "react"
import { Input } from "@repo/ui/input"
import { Search } from "lucide-react"
import { createToken } from "@/lib/github/createToken"
import { toast } from "sonner"

interface Repository {
  name: string
  id: number
}

interface RepositorySearchProps {
  owner: string
  value: string
  onChange: (value: string) => void
  onSelect: (repo: { value: string; label: string }) => void
  className?: string
}

interface TokenData {
  token: string;
  expiresAt: number;
}

export function RepositorySearch({
  owner,
  value,
  onChange,
  onSelect,
  className = "",
}: RepositorySearchProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const tokenRef = useRef<TokenData | null>(null)

  // 搜索仓库
  const searchRepositories = async (query: string) => {
    setIsLoading(true)
    try {
      let currentToken = tokenRef.current?.token

      // 如果需要新 token，先获取并等待
      if (!tokenRef.current || tokenRef.current.expiresAt < Date.now() + 30000) {
        console.log("需要新 token")
        const newToken = await createToken(owner)
        currentToken = newToken
        tokenRef.current = {
          token: newToken,
          expiresAt: Date.now() + 10 * 60 * 1000
        }
      }

      const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}+user:${owner}&sort=updated&per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${currentToken}`
          }
        }
      )

      if (response.status === 401) {
        const newToken = await createToken(owner)
        currentToken = newToken
        tokenRef.current = {
          token: newToken,
          expiresAt: Date.now() + 10 * 60 * 1000
        }
        searchRepositories(query)
        return
      }

      if (!response.ok) {
        throw new Error('搜索仓库失败')
      }

      const data = await response.json()
      setRepositories(data.items)
    } catch (error) {
      console.error(error)
      toast.error("搜索仓库失败")
    } finally {
      setIsLoading(false)
    }
  }

  // 当搜索输入变化时触发搜索
  useEffect(() => {
    if (value) {
      const debounce = setTimeout(() => {
        searchRepositories(value)
      }, 300)
      return () => clearTimeout(debounce)
    } else {
      setRepositories([])
    }
  }, [value, owner])

  const filteredRepositories = repositories.map(repo => ({
    label: repo.name,
    value: repo.name
  }))

  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder="搜索仓库..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          setTimeout(() => {
            setShowDropdown(false)
          }, 200)
        }}
        className="pl-8"
      />
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      {value && showDropdown && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {isLoading ? (
            <div className="px-2 py-1 text-sm text-muted-foreground">加载中...</div>
          ) : filteredRepositories.length === 0 ? (
            <div className="px-2 py-1 text-sm text-muted-foreground">未找到匹配的仓库</div>
          ) : (
            filteredRepositories.map((repo) => (
              <div
                key={repo.value}
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onSelect(repo)
                  setShowDropdown(false)
                }}
              >
                {repo.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
} 