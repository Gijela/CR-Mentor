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

      toast.success("Knowledge base created successfully")
      setOpen(false)
      setFormData({ title: "", description: "" })
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create knowledge base")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create knowledge base
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new knowledge base</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Knowledge base name
              <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Enter knowledge base name"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Knowledge base description</label>
            <Textarea
              placeholder="Enter knowledge base description"
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
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
