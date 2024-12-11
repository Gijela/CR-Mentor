import { useEffect, useState } from "react";
import UploadArea from "./UploadArea";
import { ChevronLeft } from "lucide-react";
import ChunkCard from "./ChunkCard";
import { Button } from "@repo/ui/button"
import { Textarea } from "@repo/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog"
import { useNavigate, useSearchParams } from "react-router-dom"

// 文档区块接口定义
export type DocumentChunk = {
  id: number;
  kb_id: number;
  content: string;
  embedding: string;
  created_at: string;
  metadata: {
    // 文件完全名(带后缀)
    source: string;
    // 文件名(不带后缀)
    title: string;
  };
};

export function Component() {
  const [searchParams] = useSearchParams();
  const kbId = searchParams.get('id');
  const kbName = searchParams.get('name');

  const [documentChunks, setDocumentChunks] = useState<DocumentChunk[]>([]);

  // 添加新的 state 来控制文档内容弹窗
  const [isChunkModalOpen, setIsChunkModalOpen] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(
    null
  );
  const [editingContent, setEditingContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate()

  // 更新文档区块内容
  const handleSaveContent = async () => {
    if (!selectedChunk) return;

    // setIsSaving(true);
    // try {
    //   // TODO: 替换为实际的 API 调用
    //   // const result = await fetch('/api/updateChunk', {
    //   //   method: 'POST',
    //   //   body: JSON.stringify({
    //   //     id: selectedChunk.id,
    //   //     content: editingContent
    //   //   })
    //   // });

    //   // if (result.ok) {
    //   //   message.success('内容已更新');
    //   //   // 更新本地数据
    //   //   setDocumentChunks(prevChunks =>
    //   //     prevChunks.map(chunk =>
    //   //       chunk.id === selectedChunk.id
    //   //         ? { ...chunk, content: editingContent }
    //   //         : chunk
    //   //     )
    //   //   );
    //   // }

    //   // 模拟 API 调用
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   message.success("内容已更新");
    //   setDocumentChunks((prevChunks) =>
    //     prevChunks.map((chunk) =>
    //       chunk.id === selectedChunk.id
    //         ? { ...chunk, content: editingContent }
    //         : chunk
    //     )
    //   );
    //   setIsChunkModalOpen(false);
    // } catch (error) {
    //   message.error("更新失败");
    // } finally {
    //   setIsSaving(false);
    // }
  };

  // 处理文档区块点击
  const handleChunkClick = (chunk: DocumentChunk) => {
    setSelectedChunk(chunk);
    setEditingContent(chunk.content);
    setIsChunkModalOpen(true);
  };

  // 查询某个知识库的所有向量文档区块
  const fetchDocumentChunks = async () => {
    // const res = await fetch(`/api/supabase/rag/kb_chunks/getOneKBTotalChunks`, {
    //   method: "POST",
    //   body: JSON.stringify({ kb_id: Number(kbId) }),
    // });
    // const { success, data }: { success: boolean; data: DocumentChunk[] } =
    //   await res.json();
    // if (success) {
    //   setDocumentChunks(data);
    // } else {
    //   // message.error("Failed to fetch document chunks");
    // }

    // mock
    // 模拟数据
    const mockData: DocumentChunk[] = [
      {
        id: 1,
        kb_id: Number(kbId),
        content: "这是第一个文档区块的内容。这里可以包含很多文本信息...",
        embedding: "",
        created_at: new Date().toISOString(),
        metadata: {
          source: "document1.md",
          title: "document1"
        }
      },
      {
        id: 2,
        kb_id: Number(kbId),
        content: "这是第二个文档区块的内容。可以包含不同的信息...",
        embedding: "",
        created_at: new Date().toISOString(),
        metadata: {
          source: "document2.md",
          title: "document2"
        }
      },
      {
        id: 3,
        kb_id: Number(kbId),
        content: "第三个文档区块的示例内容...",
        embedding: "",
        created_at: new Date().toISOString(),
        metadata: {
          source: "document3.md",
          title: "document3"
        }
      },
      {
        id: 4,
        kb_id: Number(kbId),
        content: "第四个文档区块的示例内容...",
        embedding: "",
        created_at: new Date().toISOString(),
        metadata: {
          source: "document4.md",
          title: "document4"
        }
      },
      {
        id: 5,
        kb_id: Number(kbId),
        content: "第五个文档区块的示例内容...",
        embedding: "",
        created_at: new Date().toISOString(),
        metadata: {
          source: "document5.md",
          title: "document5"
        }
      }
    ];

    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    setDocumentChunks(mockData);
  };

  // 刷新文档区块列表
  const refreshDocumentChunks = () => {
    fetchDocumentChunks();
  };

  // 示例数据，实际应该通过 API 获取
  useEffect(() => {
    fetchDocumentChunks();
  }, []);

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center pr-2">
          <Button
            variant="ghost"
            onClick={() => {
              navigate(-1)
            }}
            className="flex items-center gap-2 px-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back {kbName || '未命名知识库'} </span>
          </Button>
          <UploadArea kb_id={Number(kbId)} refreshDocumentChunks={refreshDocumentChunks} />
        </div>
      </div>

      <div className="overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4">
          {documentChunks.length > 0 ? (
            documentChunks.map((chunk) => (
              <ChunkCard
                key={chunk.id}
                chunk={chunk}
                documentChunks={documentChunks}
                setDocumentChunks={setDocumentChunks}
                handleChunkClick={handleChunkClick}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
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
              <p className="text-lg mb-2">No document chunks</p>
              <p className="text-sm">
                Please upload Markdown files to add document chunks
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
            <div className="flex items-center gap-4 w-full">
              <span className="text-sm text-muted-foreground">
                Characters: {editingContent.length}
              </span>
              <Button
                onClick={handleSaveContent}
                disabled={isSaving}
              >
                {isSaving ? "Updating..." : "Update"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
