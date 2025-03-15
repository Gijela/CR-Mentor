import { Button } from "@repo/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { Input } from "@repo/ui/input"
import { Textarea } from "@repo/ui/textarea"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { createKnowledgeBase } from "@/hooks/query/use-knowledge-base"

interface CreateKnowledgeBaseProps {
  user_id: string
  onSuccess?: () => void
}

export function CreateKnowledgeBaseDialog({ user_id, onSuccess }: CreateKnowledgeBaseProps) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "" })

  console.log("user_id ==>", user_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    try {
      await createKnowledgeBase({ name: formData.name })

      toast.success("Knowledge base created successfully")
      setOpen(false)
      setFormData({ name: "", description: "" })
      setIsPending(false)
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create knowledge base")
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-1" />
          Create
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
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Knowledge base description</label>
            <Textarea
              placeholder="Enter knowledge base description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
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
