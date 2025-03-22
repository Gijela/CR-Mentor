import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  createKnowledgeBase,
  updateClerkUserMetadata,
} from "@/hooks/query/use-knowledge-base";

interface CreateKnowledgeBaseProps {
  kbList: string[];
  onSuccess?: (name: string) => void;
}

export function CreateKnowledgeBaseDialog({
  kbList,
  onSuccess,
}: CreateKnowledgeBaseProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [nameError, setNameError] = useState("");
  const { getToken } = useAuth();
  const validateName = (name: string) => {
    if (!name) {
      setNameError("Name cannot be empty");
      return false;
    }

    const nameRegex = /^[a-z_]\w*$/i;
    if (!nameRegex.test(name)) {
      setNameError(
        "Name must start with a letter or underscore and can only contain letters, numbers, and underscores. eg: my_kb"
      );
      return false;
    }

    setNameError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(formData.name)) {
      return;
    }

    if (kbList.includes(formData.name)) {
      toast.error("Knowledge base already exists");
      return;
    }

    setIsPending(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Failed to get token");
        return;
      }
      // 创建知识库
      await createKnowledgeBase({ name: formData.name });

      // 更新clerk用户元数据的 knowledgeBaseList 值
      await updateClerkUserMetadata({
        token,
        knowledgeBaseList: [formData.name, ...kbList],
      });

      toast.success("Knowledge base created successfully");
      setOpen(false);
      setFormData({ name: "", description: "" });
      setIsPending(false);
      onSuccess?.(formData.name);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create knowledge base"
      );
      setIsPending(false);
    }
  };

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
              onChange={(e) => {
                const newName = e.target.value;
                setFormData((prev) => ({ ...prev, name: newName }));
                validateName(newName);
              }}
              disabled={isPending}
              required
            />
            {nameError && (
              <p className="text-sm text-destructive mt-1">{nameError}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Knowledge base description
            </label>
            <Textarea
              placeholder="Enter knowledge base description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              disabled={true}
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
  );
}
