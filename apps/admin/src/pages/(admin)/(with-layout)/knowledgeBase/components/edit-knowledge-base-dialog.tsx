import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { Button } from "@repo/ui/button"
import { Edit, Upload, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@repo/ui/utils"

interface EditKnowledgeBaseProps {
  knowledgeBase: {
    id: string
    title: string
    description: string
  }
  onSuccess: () => void
}

interface FileStatus {
  name: string
  status: 'uploading' | 'processing' | 'done' | 'error'
  progress?: number
  error?: string
}

// Mock 文件处理 API
const mockProcessFile = async (file: File, kbId: string, onProgress: (progress: number) => void) => {
  // 模拟文件上传进度
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 200))
    onProgress(i)
  }

  // 模拟向量化处理
  await new Promise(resolve => setTimeout(resolve, 1500))

  // 模拟一些错误情况
  if (file.name.includes('error')) {
    throw new Error('文件处理失败')
  }

  return {
    fileId: Math.random().toString(36).slice(2),
    fileName: file.name,
  }
}

export function EditKnowledgeBaseDialog({ knowledgeBase, onSuccess }: EditKnowledgeBaseProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = async (uploadedFiles: FileList) => {
    const newFiles = Array.from(uploadedFiles).map(file => ({
      name: file.name,
      status: 'uploading' as const,
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    // 处理每个文件
    newFiles.forEach(async (fileStatus, index) => {
      try {
        const file = uploadedFiles[index]
        await mockProcessFile(
          file,
          knowledgeBase.id,
          (progress) => {
            setFiles(prev => prev.map(f =>
              f.name === fileStatus.name
                ? { ...f, progress, status: progress < 100 ? 'uploading' : 'processing' }
                : f
            ))
          }
        )

        // 文件处理成功
        setFiles(prev => prev.map(f =>
          f.name === fileStatus.name
            ? { ...f, status: 'done' }
            : f
        ))

        toast.success(`文件 ${fileStatus.name} 处理成功`)
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.name === fileStatus.name
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : '处理失败' }
            : f
        ))
        toast.error(`文件 ${fileStatus.name} 处理失败`)
      }
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-12 justify-center rounded-none"
        >
          <Edit className="w-4 h-4 mr-1.5" />
          Edit KB
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>编辑知识库 - {knowledgeBase.title}</DialogTitle>
        </DialogHeader>

        {/* 文件上传区域 */}
        <div
          className={cn(
            "mt-4 border-2 border-dashed rounded-lg p-8 text-center",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">点击上传</span> 或拖拽文件到这里
            </div>
            <div className="text-xs text-muted-foreground">
              支持 PDF、Word、TXT 等格式
            </div>
          </label>
        </div>

        {/* 文件列表 */}
        {files.length > 0 && (
          <div className="mt-4 space-y-3">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted"
              >
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {file.status === 'uploading' && `${file.progress}%`}
                      {file.status === 'processing' && '处理中...'}
                      {file.status === 'done' && '完成'}
                      {file.status === 'error' && '失败'}
                    </span>
                  </div>
                  {file.status !== 'error' && file.progress !== undefined && (
                    <div className="w-full h-1 mt-1 rounded-full bg-muted-foreground/20">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  {file.status === 'error' && (
                    <p className="text-xs text-destructive mt-1">{file.error}</p>
                  )}
                </div>
                {(file.status === 'uploading' || file.status === 'processing') && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
