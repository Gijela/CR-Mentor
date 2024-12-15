import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { ChevronLeft, BookOpen } from "lucide-react"
import { Button } from "@repo/ui/button"
import { Textarea } from "@repo/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import { toast } from "sonner"
import { useKnowledgeChunks, useUpdateChunk, type DocumentChunk } from "@/hooks/query/use-knowledge-chunks"
import ChunkCard from "./ChunkCard"
import UploadArea from "./UploadArea"

export function Component() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const kbId = searchParams.get('id')
  const kbName = searchParams.get('name')

  // 如果没有知识库 ID 或名称，显示引导页面
  if (!kbId || !kbName) {
    return (
      <div className="container max-w-md mx-auto py-24">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-center">No knowledge base selected</CardTitle>
            <CardDescription className="text-center">
              Please select a knowledge base from the knowledge base list to edit
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={() => navigate('/knowledgeBase/kbList')}
              className="w-full"
            >
              Go to knowledge base list
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Back to previous page
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 验证 kbId 是否为有效数字
  const numericKbId = Number(kbId)
  if (isNaN(numericKbId)) {
    toast.error("Invalid knowledge base ID")
    navigate('/knowledgeBase/kbList')
    return null
  }

  const { data: documentChunks = [], isLoading } = useKnowledgeChunks(numericKbId)
  const { mutate: updateChunk, isPending: isUpdating } = useUpdateChunk()

  const [isChunkModalOpen, setIsChunkModalOpen] = useState(false)
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(null)
  const [editingContent, setEditingContent] = useState("")

  const handleChunkClick = (chunk: DocumentChunk) => {
    setSelectedChunk(chunk)
    setEditingContent(chunk.content)
    setIsChunkModalOpen(true)
  }

  const handleSaveContent = async () => {
    // 临时处理：显示开发中提示
    toast.error("Updating feature is under development, please stay tuned")
    setIsChunkModalOpen(false)
    return

    // 实际的更新逻辑暂时注释
    /*
    if (!selectedChunk) return

    try {
      await updateChunk({
        id: selectedChunk.id,
        kb_id: kbId,
        content: editingContent,
      })
      toast.success("Content updated")
      setIsChunkModalOpen(false)
    } catch (error) {
      toast.error("Update failed")
    }
    */
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center pr-2">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to {kbName || 'Unnamed knowledge base'} </span>
          </Button>
          <UploadArea kb_id={Number(kbId)} />
        </div>
      </div>

      <div className="overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          ) : documentChunks.length > 0 ? (
            documentChunks.map((chunk) => (
              <ChunkCard
                key={chunk.id}
                chunk={chunk}
                onEdit={handleChunkClick}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg mb-2">No documents</p>
              <p className="text-sm">
                Please upload a markdown file to add documents
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isChunkModalOpen} onOpenChange={setIsChunkModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit content</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between gap-4 w-full">
              <span className="text-sm text-muted-foreground">
                Characters: {editingContent.length}
              </span>
              <Button
                onClick={handleSaveContent}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
