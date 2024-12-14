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
import { RepositorySearch } from "@/components/repository-search"

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
  const [branches, setBranches] = useState<{ value: string, label: string }[]>([])
  const [open, setOpen] = useState(false)

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
            <RepositorySearch
              owner={githubName}
              value={selectedRepo}
              onChange={(value) => setSelectedRepo(value)}
              onSelect={(repo) => {
                setSelectedRepo(repo.value)
                handleRepoBranch(repo.value)
              }}
            />
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
