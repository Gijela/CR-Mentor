import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Textarea } from "@repo/ui/textarea"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useCreateKnowledgeBase } from "@/hooks/query/use-knowledge-base"

interface CreateKnowledgeBaseProps {
  user_id: string
  onSuccess?: () => void
}

interface CreateKnowledgeBaseData {
  title: string
  description: string
}

export function CreateKnowledgeBaseDialog({ user_id, onSuccess }: CreateKnowledgeBaseProps) {
  const [open, setOpen] = useState(false)
  const { mutate: createKB, isPending } = useCreateKnowledgeBase()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createKB({
        user_id,
        title: formData.title,
        description: formData.description,
      })

      toast.success("知识库创建成功")
      setOpen(false)
      setFormData({ title: "", description: "" })
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建知识库失败")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          创建知识库
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建新知识库</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              知识库名称
              <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="请输入知识库名称"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">知识库描述</label>
            <Textarea
              placeholder="请输入知识库描述"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isPending}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              取消
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "创建中..." : "创建"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
