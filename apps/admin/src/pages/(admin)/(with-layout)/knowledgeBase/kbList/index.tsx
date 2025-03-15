import { useUser } from "@clerk/clerk-react"
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
import { Button } from "@repo/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { Input } from "@repo/ui/input"
import { Edit, MessageSquare, MoreHorizontal, Search, Trash } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { LoadingSpinner } from "@/components/loading-spinner"
import type { KnowledgeBase } from "@/hooks/query/use-knowledge-base"
import { deleteKnowledgeBase, getKnowledgeBases } from "@/hooks/query/use-knowledge-base"

import EmptyCard from "../../pullRequest/components/emptyCard"
import { CreateKnowledgeBaseDialog } from "./components/create-knowledge-base-dialog"

export function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteKbId, setDeleteKbId] = useState("")
  const navigate = useNavigate()
  const { user } = useUser()
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchKnowledgeBases = async () => {
    setIsLoading(true)
    const knowledgeBases = await getKnowledgeBases(user?.id as string)
    setKnowledgeBases(knowledgeBases)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchKnowledgeBases()
  }, [])

  const handleDelete = async (kbId: string) => {
    setIsDeleting(true)
    try {
      await deleteKnowledgeBase({ name: kbId, user_id: user?.id as string })
      toast.success("Knowledge base deleted successfully")
      setDeleteKbId("")
      setIsDeleting(false)
      fetchKnowledgeBases()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete knowledge base")
      setDeleteKbId("")
      setIsDeleting(false)
    }
  }

  const filteredKnowledgeBases = useMemo(() => {
    if (!searchQuery.trim()) return knowledgeBases

    const query = searchQuery.toLowerCase()
    return knowledgeBases.filter((kb) =>
      (kb?.name || "").toLowerCase().includes(query) ||
      (kb?.description || "").toLowerCase().includes(query),
    )
  }, [searchQuery, knowledgeBases])

  return (
    <div className="container px-0">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between mb-8 pt-[2px]">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CreateKnowledgeBaseDialog user_id={user?.id as string} onSuccess={fetchKnowledgeBases} />
      </div>

      {/* 知识库列表 */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {filteredKnowledgeBases.length === 0 ? (
            <EmptyCard icon={<MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />} title="No Knowledge Base" description="Please create a knowledge base to start managing your documents and knowledge" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKnowledgeBases.map((kb) => (
                <Card
                  key={kb.id}
                  className="group hover:shadow-lg transition-all duration-300 flex flex-col h-[180px]"
                >
                  <CardHeader className="pb-3 flex-1" style={{ height: "calc(100% - 48px)" }}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg shrink-0">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <CardTitle className="text-lg font-medium tracking-tight truncate max-w-[200px]">
                            {kb.name || "(Unnamed knowledge base)"}
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
                              onClick={() => setDeleteKbId(kb.name)}
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="text-sm line-clamp-2">
                        {kb.description || "No description"}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardFooter className="flex border-t mt-auto h-12 p-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-12 justify-center rounded-none border-r"
                      onClick={() => {
                        navigate(`/chatgpt/?kb_id=${kb.id}`)
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      Chat KB
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-12 justify-center rounded-none border-r"
                      onClick={() => {
                        navigate(`/knowledgeBase/editKb/?id=${kb.id}&name=${kb.name}`)
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      Edit KB
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* 确认删除对话框 */}
      <AlertDialog open={!!deleteKbId} onOpenChange={() => !isDeleting && setDeleteKbId("")}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteKbId && handleDelete(deleteKbId)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
