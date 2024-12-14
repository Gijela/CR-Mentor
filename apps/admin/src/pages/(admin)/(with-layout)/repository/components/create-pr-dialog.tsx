import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/textarea"
import { GitPullRequestIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@repo/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"
import { toast } from "sonner"
import { SearchIcon } from "lucide-react"
import { createToken } from "@/lib/github/createToken"

const knowledgeBases = [
  { label: "通用知识库", value: "general" },
  { label: "产品文档", value: "product" },
  { label: "技术文档", value: "tech" },
  { label: "API 文档", value: "api" },
  { label: "用户指南", value: "user-guide" },
]

export function CreatePRDialog({ githubName, totalCount }: { githubName: string, totalCount: number }) {
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sourceBranch, setSourceBranch] = useState("")
  const [targetBranch, setTargetBranch] = useState("")
  const [selectedKb, setSelectedKb] = useState("")
  const [selectedRepo, setSelectedRepo] = useState("")
  const [searchRepo, setSearchRepo] = useState("")
  const [repositories, setRepositories] = useState<Array<{ name: string }>>([])
  const [branches, setBranches] = useState<{ value: string, label: string }[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [tokenExpiredFlag, setTokenExpiredFlag] = useState(false)

  // 搜索仓库
  const searchRepositories = async (query: string) => {
    setIsLoading(true)

    try {
      let token = accessToken
      if (!token || tokenExpiredFlag) {
        token = await createToken(githubName)
        setAccessToken(token)
        setTokenExpiredFlag(false)
      }

      const response = await fetch(`https://api.github.com/search/repositories?q=${query}+user:${githubName}&sort=updated&per_page=10`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('搜索仓库失败')
      }

      const data = await response.json()
      setRepositories(data.items)
    } catch (error) {
      setTokenExpiredFlag(true)
      toast.error("搜索仓库失败")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // 当搜索输入变化时触发搜索
  useEffect(() => {
    if (searchRepo) {
      const debounce = setTimeout(() => {
        searchRepositories(searchRepo)
      }, 300)
      return () => clearTimeout(debounce)
    } else {
      setRepositories([])
    }
  }, [searchRepo])

  const filteredRepositories = repositories.map(repo => ({
    label: repo.name,
    value: repo.name
  }))

  const handleCreatePR = async () => {
    const response = await fetch(`/api/github/createPullRequest`, {
      method: "POST",
      body: JSON.stringify({ githubName, repoName: selectedRepo, data: { title, description, head: sourceBranch, base: targetBranch } }),
    })
    const { success, msg } = await response.json()
    if (!success) {
      toast.error(msg)
      console.error(msg)
      return
    }
    toast.success(msg)
    setOpen(false)
  }

  const handleRepoBranch = async (repoName: string) => {
    const response = await fetch(`/api/github/fetchRepoBranches`, {
      method: "POST",
      body: JSON.stringify({ githubName, repoName }),
    })
    const { success, data: branches, msg } = await response.json()
    if (!success) {
      toast.error(msg)
      console.error(msg)
      return
    }
    setBranches(branches.map((branch: { name: string }) => ({ value: branch.name, label: branch.name })))
  }

  useEffect(() => {
    if (selectedRepo) {
      handleRepoBranch(selectedRepo)
    }
  }, [selectedRepo])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <GitPullRequestIcon className="mr-2 h-4 w-4" />
          {t('repository.create_pr', '创建 PR')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t('repository.create_pr', '创建 PR')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t('repository.pr.repository', '选择仓库')}</Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="搜索仓库..."
                  value={searchRepo}
                  onChange={(e) => setSearchRepo(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowDropdown(false)
                    }, 200)
                  }}
                  className="pl-8"
                />
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {searchRepo && showDropdown && (
                <div style={{ width: '475px' }} className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
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
                          setSelectedRepo(repo.value);
                          setSearchRepo(repo.label);
                          setShowDropdown(false);
                        }}
                      >
                        {repo.label}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('repository.pr.source_branch', '源分支')}</Label>
              <Select value={sourceBranch} onValueChange={setSourceBranch}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={'请选择源分支'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('repository.pr.target_branch', '目标分支')}</Label>
              <Select value={targetBranch} onValueChange={setTargetBranch}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('repository.pr.target_branch_placeholder', '请选择目标分支')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('repository.pr.knowledge_base', '关联知识库')}</Label>
            <Select value={selectedKb} onValueChange={setSelectedKb}>
              <SelectTrigger>
                <SelectValue placeholder="选择知识库..." />
              </SelectTrigger>
              <SelectContent>
                {knowledgeBases.map((kb) => (
                  <SelectItem key={kb.value} value={kb.value}>
                    {kb.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('repository.pr.title', 'PR 标题')}</Label>
            <Input
              placeholder={t('repository.pr.title_placeholder', '请输入 PR 标题')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('repository.pr.description', 'PR 描述')}</Label>
            <Textarea
              placeholder={t('repository.pr.description_placeholder', '请输入 PR 描述')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">
              {t('common.cancel', '取消')}
            </Button>
          </DialogTrigger>
          <Button onClick={handleCreatePR}>
            {t('repository.pr.submit', '创建')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
