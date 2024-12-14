import { useState } from "react"
import { Button } from "@repo/ui/button"
import { Card, CardContent, CardHeader } from "@repo/ui/card"
import { Pencil, Trash2, FileText, ArrowUpDown, Clock } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/alert-dialog"
import { useDeleteChunk } from "@/hooks/query/use-knowledge-chunks"
import type { DocumentChunk } from "@/hooks/query/use-knowledge-chunks"

interface ChunkCardProps {
  chunk: DocumentChunk
  onEdit: (chunk: DocumentChunk) => void
}

const ChunkCard = ({ chunk, onEdit }: ChunkCardProps) => {
  const { mutate: deleteChunk, isPending } = useDeleteChunk()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteChunk = async () => {
    toast.error("删除功能正在开发中，敬请期待")
    setShowDeleteDialog(false)
    return

    /*
    try {
      await deleteChunk({ id: chunk.id, kb_id: chunk.kb_id })
      toast.success("文档块删除成功")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除失败")
    } finally {
      setShowDeleteDialog(false)
    }
    */
  }

  return (
    <>
      <Card
        key={chunk.id}
        className="hover:border-primary transition-all duration-200 cursor-pointer"
        onClick={() => onEdit(chunk)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{chunk.metadata.title}</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(chunk)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4 line-clamp-2">{chunk.content}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span className="truncate">{chunk.metadata.source}</span>
              </div>
              <div className="flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <span>{chunk.content.length} 字符</span>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{new Date(chunk.created_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个文档块吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteChunk}
              disabled={isPending}
            >
              {isPending ? "删除中..." : "删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ChunkCard
