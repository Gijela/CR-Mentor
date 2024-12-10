import { FC, useEffect, useState } from "react";
import { KnowledgeBase } from "../index";
import { Input, message, Modal } from "antd";
import UploadArea from "./UploadArea";
import BackIcon from "./icons/BackIcon";
import ChunkCard from "./ChunkCard";

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

const EditChunks: FC<{
  currentEditingKB: KnowledgeBase;
  handleBackToList: () => void;
}> = ({ currentEditingKB, handleBackToList }) => {
  const [documentChunks, setDocumentChunks] = useState<DocumentChunk[]>([]);

  // 添加新的 state 来控制文档内容弹窗
  const [isChunkModalOpen, setIsChunkModalOpen] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(
    null
  );
  const [editingContent, setEditingContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 更新文档区块内容
  const handleSaveContent = async () => {
    if (!selectedChunk) return;
    message.warning("Under development, please wait...");

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
    const res = await fetch(`/api/supabase/rag/kb_chunks/getOneKBTotalChunks`, {
      method: "POST",
      body: JSON.stringify({
        kb_id: currentEditingKB.id,
      }),
    });
    const { success, data }: { success: boolean; data: DocumentChunk[] } =
      await res.json();
    if (success) {
      setDocumentChunks(data);
    } else {
      message.error("Failed to fetch document chunks");
    }
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="flex items-center text-gray-600 hover:text-[rgba(99,0,255,0.87)]"
            >
              <BackIcon />
              <span className="ml-2">Back</span>
            </button>
            <h1 className="text-2xl font-bold m-0">
              Edit: {currentEditingKB?.title}
            </h1>
          </div>
        </div>

        <UploadArea
          kb_id={currentEditingKB.id}
          refreshDocumentChunks={refreshDocumentChunks}
        />
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

      <Modal
        title="Edit content"
        open={isChunkModalOpen}
        onCancel={() => setIsChunkModalOpen(false)}
        footer={[
          <div
            key="footer-content"
            className="flex items-center justify-end gap-4"
          >
            <div className="text-gray-500">
              Characters: {editingContent.length}
            </div>
            <button
              key="save"
              onClick={handleSaveContent}
              disabled={isSaving}
              className="bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,0.7)] text-white px-8 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Updating..." : "Update"}
            </button>
          </div>,
        ]}
        width={800}
      >
        <div>
          <Input.TextArea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            autoSize={{ minRows: 10, maxRows: 20 }}
            className="mt-4 focus:border-[rgba(99,0,255,0.87)] hover:border-[rgba(99,0,255,0.87)]"
          />
        </div>
      </Modal>
    </>
  );
};

export default EditChunks;
