import { useState, useMemo, useCallback, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { MessageSquare, Edit, Plus, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
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
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { CreateKnowledgeBaseDialog } from "./components/create-knowledge-base-dialog"
import { EditKnowledgeBaseDialog } from "./components/edit-knowledge-base-dialog"

interface KnowledgeBase {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

// Mock API 函数
const mockApi = {
  // 获取知识库列表
  getKnowledgeBases: async (): Promise<KnowledgeBase[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    return [
      {
        id: "1",
        title: "产品知识库",
        description: "包含产品相关的所有文档、规范和指南",
        createdAt: "2024-03-15T10:00:00Z",
        updatedAt: "2024-03-20T15:30:00Z"
      },
      {
        id: "2",
        title: "这是一个超长的标题用来测试文本截断效果这是一个超长的标题用来测试文本截断效果",
        description: "这是一个很长的描述文本，用来测试多行文本截断的效果。这是一个很长的描述文本，用来测试多行文本截断的效果。这是一个很长的描述文本，用来测试多行文本截断的效果。",
        createdAt: "2024-03-10T08:00:00Z",
        updatedAt: "2024-03-19T11:20:00Z"
      },
      {
        id: "3",
        title: "",  // 测试空标题
        description: "",  // 测试空描述
        createdAt: "2024-03-18T09:00:00Z",
        updatedAt: "2024-03-18T09:00:00Z"
      }
    ]
  },

  // 删除知识库
  deleteKnowledgeBase: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟一些错误情况
    if (id === "1") {
      throw new Error("无法删除默认知识库")
    }

    return true
  }
}

export function Component() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteKbId, setDeleteKbId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 加载知识库列表
  const loadKnowledgeBases = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await mockApi.getKnowledgeBases()
      setKnowledgeBases(data)
    } catch (error) {
      toast.error("加载知识库列表失败")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 处理删除
  const handleDelete = async (kbId: string) => {
    try {
      setIsDeleting(true)
      await mockApi.deleteKnowledgeBase(kbId)
      setKnowledgeBases(prev => prev.filter(kb => kb.id !== kbId))
      toast.success("知识库删除成功")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除知识库失败")
    } finally {
      setIsDeleting(false)
      setDeleteKbId(null)
    }
  }

  const filteredKnowledgeBases = useMemo(() => {
    if (!searchQuery.trim()) return knowledgeBases

    const query = searchQuery.toLowerCase()
    return knowledgeBases.filter(kb =>
      kb.title.toLowerCase().includes(query) ||
      kb.description.toLowerCase().includes(query)
    )
  }, [searchQuery, knowledgeBases])

  // 加载初始数据
  useEffect(() => {
    loadKnowledgeBases()
  }, [loadKnowledgeBases])

  return (
    <div className="container mx-auto py-6">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索知识库..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CreateKnowledgeBaseDialog onSuccess={loadKnowledgeBases} />
      </div>

      {/* 知识库列表 */}
      {isLoading ? (
        <div className="col-span-full text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <div className="mt-4 text-muted-foreground">加载中...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKnowledgeBases.length > 0 ? (
            filteredKnowledgeBases.map((kb) => (
              <Card
                key={kb.id}
                className="group hover:shadow-lg transition-all duration-300 flex flex-col h-[180px]"
              >
                <CardHeader className="pb-3 flex-1" style={{ height: 'calc(100% - 48px)' }}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg shrink-0">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-lg font-medium tracking-tight truncate max-w-[200px]">
                          {kb.title || '(未命名知识库)'}
                        </CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteKbId(kb.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            删除知识库
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {kb.description || '暂无描述'}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardFooter className="flex border-t mt-auto h-12 p-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-12 justify-center rounded-none border-r"
                  >
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Chat KB
                  </Button>
                  <EditKnowledgeBaseDialog
                    knowledgeBase={kb}
                    onSuccess={loadKnowledgeBases}
                  />
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              未找到匹配的知识库
            </div>
          )}
        </div>
      )}

      {/* 确认删除对话框 */}
      <AlertDialog open={!!deleteKbId} onOpenChange={() => !isDeleting && setDeleteKbId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个知识库吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteKbId && handleDelete(deleteKbId)}
              disabled={isDeleting}
            >
              {isDeleting ? "删除中..." : "删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
