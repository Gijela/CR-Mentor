import { Button } from "@repo/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog"
import { Textarea } from "@repo/ui/textarea"
import { BookOpen, ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import type { FileItem } from "@/hooks/query/use-knowledge-chunks"
import { getFileList, updateFile } from "@/hooks/query/use-knowledge-chunks"

import EmptyCard from "../../pullRequest/components/emptyCard"
import ChunkCard from "./ChunkCard"
import UploadArea from "./UploadArea"

export function Component() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const kbId = searchParams.get("id")
  const kbName = searchParams.get("name")

  // 如果没有知识库 ID 或名称，显示引导页面
  if (!kbId || !kbName) {
    return (
      <EmptyCard icon={<BookOpen className="h-12 w-12 text-gray-400 mx-auto" />} title="No knowledge base selected" description="Please select a knowledge base from the knowledge base list to edit" />
    )
  }

  // 验证 kbId 是否为有效数字
  // const numericKbId = Number(kbId)
  // if (isNaN(numericKbId)) {
  //   toast.error("Invalid knowledge base ID")
  //   navigate('/knowledgeBase/kbList')
  //   return null
  // }

  const [fileList, setFileList] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fetchFileList = async () => {
    setIsLoading(true)
    const result = await getFileList({ knowledgeBaseName: kbName, options: { page: 1, pageSize: 10 } })
    setFileList(result)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchFileList()
  }, [])

  const [isChunkModalOpen, setIsChunkModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedChunk, setSelectedChunk] = useState<FileItem>({} as FileItem)
  const [editingContent, setEditingContent] = useState("")

  const handleChunkClick = (chunk: FileItem) => {
    setSelectedChunk(chunk)
    setEditingContent(chunk.text)
    setIsChunkModalOpen(true)
  }

  const handleUpdateDocument = async () => {
    setIsUpdating(true)
    const result = await updateFile(kbName, selectedChunk.id, editingContent)
    if (result.success) {
      toast.success("Document updated successfully")
      setFileList(fileList.map((file) => file.id === selectedChunk.id ? { ...file, text: editingContent } : file))
    } else {
      toast.error("Failed to update document")
    }
    setSelectedChunk({} as FileItem)
    setEditingContent("")
    setIsChunkModalOpen(false)
    setIsUpdating(false)
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center pr-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/knowledgeBase/kbList")}
            className="flex items-center gap-2 px-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to {kbName || "Unnamed knowledge base"} </span>
          </Button>
          <UploadArea kbName={kbName} onUploadSuccess={fetchFileList} />
        </div>
      </div>

      <div className="overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          ) : fileList.length > 0 ?
              (
                fileList.map((file) => (
                  <ChunkCard
                    key={file.id}
                    chunk={file}
                    onEdit={handleChunkClick}
                    onDelete={(docId) => {
                      setFileList(fileList.filter((file) => file.id !== docId))
                    }}
                  />
                ))
              ) :
              (
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
                onClick={handleUpdateDocument}
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
