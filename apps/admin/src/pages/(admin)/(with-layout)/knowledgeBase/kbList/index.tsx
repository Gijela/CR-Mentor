import { useState, useMemo } from 'react'
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
import { useNavigate } from "react-router-dom"
import { useKnowledgeBases, useDeleteKnowledgeBase } from "@/hooks/query/use-knowledge-base"
import { LoadingSpinner } from '@/components/loading-spinner'

interface KnowledgeBase {
  id: number
  title: string
  description: string
  created_at: string
  updated_at: string
}

export function Component() {
  const user_id = "Gijela-123456" // 这里需要从认证上下文中获取
  const { data: knowledgeBases = [], isLoading } = useKnowledgeBases(user_id)
  const { mutate: deleteKB, isPending: isDeleting } = useDeleteKnowledgeBase()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteKbId, setDeleteKbId] = useState<number | null>(null)
  const navigate = useNavigate()

  const handleDelete = async (kbId: number) => {
    try {
      await deleteKB({ id: kbId, user_id })
      toast.success("知识库删除成功")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除知识库失败")
    } finally {
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

  return (
    <div className="container px-0">
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
        <CreateKnowledgeBaseDialog user_id={user_id} onSuccess={() => { }} />
      </div>

      {/* 知识库列表 */}
      {isLoading ? (
        <LoadingSpinner />
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-12 justify-center rounded-none border-r"
                    onClick={() => {
                      navigate(`/knowledgeBase/editKb/?id=${kb.id}&name=${kb.title}`)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    编辑
                  </Button>
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
              您确定要删除吗？此操作无法撤销。
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
