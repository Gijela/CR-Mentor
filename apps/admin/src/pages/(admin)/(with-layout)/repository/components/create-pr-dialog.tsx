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
import { useKnowledgeBases } from "@/hooks/query/use-knowledge-base"

// const knowledgeBases = [
//   { label: "General Knowledge Base", value: "general" },
//   { label: "Product Documentation", value: "product" },
//   { label: "Technical Documentation", value: "tech" },
//   { label: "API Documentation", value: "api" },
//   { label: "User Guide", value: "user-guide" },
// ]

const user_id = import.meta.env.VITE_GITHUB_USER_ID
const apiUrl = import.meta.env.VITE_GITHUB_SERVER_API

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
  const [loading, setLoading] = useState(false)
  const { data: knowledgeBases = [] } = useKnowledgeBases(user_id)

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setSourceBranch("")
    setTargetBranch("")
    setSelectedKb("")
    setSelectedRepo("")
    setBranches([])
  }

  const handleCreatePR = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/github/createPullRequest`, {
        method: "POST",
        body: JSON.stringify({ githubName, repoName: selectedRepo, data: { title, body: description, head: sourceBranch, base: targetBranch, kb_id: selectedKb, kb_title: knowledgeBases.find(kb => kb.id === Number(selectedKb))?.title } }),
      })
      const { success, msg, token, data } = await response.json()
      if (!success) {
        toast.error(msg)
        console.error(msg)
        return
      }
      toast.success(msg)

      // if (token) {
      //   try {
      //     await fetch(`${data.comments_url}`, {
      //       method: "POST",
      //       headers: {
      //         "Authorization": `Bearer ${token}`,
      //         "Content-Type": "application/json"
      //       },
      //       body: JSON.stringify({
      //         body: `Created by: [@${githubName}](https://github.com/${githubName})\n\nPowered by [CR-Mentor](https://cr-mentor.top)`
      //       })
      //     })
      //   } catch (error) {
      //     toast.error("Add creator comment failed")
      //     console.error(error)
      //   }
      // }

      // const newWindow = window.open(`https://github.com/${githubName}/${selectedRepo}/pull/${data.number}`, '_blank', 'noopener,noreferrer');
      // if (newWindow) {
      //   newWindow.blur();
      //   window.focus();
      // }
      resetForm()
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }


  const handleRepoBranch = async (repoName: string) => {
    const response = await fetch(`${apiUrl}/api/github/fetchRepoBranches`, {
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <GitPullRequestIcon className="mr-2 h-4 w-4" />
          {t('repository.create_pr', 'Create PR')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t('repository.create_pr', 'Create PR')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t('repository.pr.repository', 'Select Repository')}</Label>
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
              <Label>{t('repository.pr.source_branch', 'Source Branch')}</Label>
              <Select value={sourceBranch} onValueChange={setSourceBranch}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('repository.pr.source_branch_placeholder', 'Select...')}
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
              <Label>{t('repository.pr.target_branch', 'Target Branch')}</Label>
              <Select value={targetBranch} onValueChange={setTargetBranch}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('repository.pr.target_branch_placeholder', 'Select...')}
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
            <Label>{t('repository.pr.knowledge_base', 'Knowledge Base')}</Label>
            <Select value={selectedKb} onValueChange={setSelectedKb}>
              <SelectTrigger>
                <SelectValue placeholder="Select knowledge base..." />
              </SelectTrigger>
              <SelectContent>
                {knowledgeBases.map((kb) => (
                  <SelectItem key={kb.id} value={kb.id.toString()}>
                    {kb.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('repository.pr.title', 'PR Title')}</Label>
            <Input
              placeholder={t('repository.pr.title_placeholder', 'Enter PR title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('repository.pr.description', 'PR Description')}</Label>
            <Textarea
              placeholder={t('repository.pr.description_placeholder', 'Enter PR description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">
              {t('common.cancel', 'Cancel')}
            </Button>
          </DialogTrigger>
          <Button onClick={handleCreatePR} disabled={loading}>
            {loading ? t('common.loading', 'Loading...') : t('repository.pr.submit', 'Submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
