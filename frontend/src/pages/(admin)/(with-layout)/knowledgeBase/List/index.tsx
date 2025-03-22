import { useAuth, useUser } from "@clerk/clerk-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Edit,
  MessageSquare,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/loading-spinner";
import {
  deleteKnowledgeBase,
  updateClerkUserMetadata,
} from "@/hooks/query/use-knowledge-base";

import EmptyCard from "../../pullRequest/components/emptyCard";
import { CreateKnowledgeBaseDialog } from "./components/create-knowledge-base-dialog";

export function Component() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteKbName, setDeleteKbName] = useState("");
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setKnowledgeBases(
        (user?.publicMetadata?.knowledgeBaseList as string[]) || []
      );
    }
  }, [isLoaded, isSignedIn]);

  const handleDelete = async (kbId: string) => {
    setIsDeleting(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Failed to get token");
        return;
      }
      // 先确保从pg知识库列表中删除
      await deleteKnowledgeBase({ name: kbId });

      // 再更新clerk用户元数据的 knowledgeBaseList 值
      await updateClerkUserMetadata({
        token,
        knowledgeBaseList: knowledgeBases.filter((kb) => kb !== kbId),
      });

      toast.success("Knowledge base deleted successfully");
      setDeleteKbName("");
      setIsDeleting(false);
      setKnowledgeBases(knowledgeBases.filter((kb) => kb !== kbId));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete knowledge base"
      );
      setDeleteKbName("");
      setIsDeleting(false);
    }
  };

  const filteredKnowledgeBases = useMemo(() => {
    if (!searchQuery.trim()) return knowledgeBases;

    const query = searchQuery.toLowerCase();
    return knowledgeBases.filter(
      (kb) => kb.toLowerCase().includes(query)
      // (kb?.description || "").toLowerCase().includes(query),
    );
  }, [searchQuery, knowledgeBases]);

  return (
    <div className="container px-0">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              className="pl-10 ml-[2px] mt-[2px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CreateKnowledgeBaseDialog
          kbList={knowledgeBases}
          onSuccess={(newKbName) =>
            setKnowledgeBases([newKbName, ...knowledgeBases])
          }
        />
      </div>

      {/* 知识库列表 */}
      {!isLoaded && !isSignedIn ? (
        <LoadingSpinner />
      ) : (
        <>
          {filteredKnowledgeBases.length === 0 ? (
            <EmptyCard
              icon={
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
              }
              title="No Knowledge Base"
              description="Please create a knowledge base to start managing your documents and knowledge"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKnowledgeBases.map((kbName, idx) => (
                <Card
                  key={idx}
                  className="group hover:shadow-lg transition-all duration-300 flex flex-col h-[180px]"
                >
                  <CardHeader
                    className="pb-3 flex-1"
                    style={{ height: "calc(100% - 48px)" }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg shrink-0">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <CardTitle className="text-lg font-medium tracking-tight truncate max-w-[200px]">
                            {kbName || "(Unnamed knowledge base)"}
                          </CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="focus:text-blue-500"
                              onClick={() => setDeleteKbName(kbName)}
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              className="focus:text-blue-500"
                              onClick={() => alert("Setting")}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Setting
                            </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="text-sm line-clamp-2">
                        No description
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardFooter className="flex border-t mt-auto h-12 p-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-12 justify-center rounded-none border-r"
                      onClick={() => {
                        navigate(`/chatgpt/?kb_id=${kbName}`);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      Chat
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-12 justify-center rounded-none border-r"
                      onClick={() => {
                        navigate(`/knowledgeBase/edit/?name=${kbName}`);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      Upload
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* 确认删除对话框 */}
      <AlertDialog
        open={!!deleteKbName}
        onOpenChange={() => !isDeleting && setDeleteKbName("")}
      >
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
              onClick={() => deleteKbName && handleDelete(deleteKbName)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
