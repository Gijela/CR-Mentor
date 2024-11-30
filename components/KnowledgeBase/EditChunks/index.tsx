import { FC, useEffect, useState } from "react";
import { KnowledgeBase } from "../index";
import { Button, Card, Input, message, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import UploadArea from "./UploadArea";
import BackIcon from "./icons/backIcon";
import ChunkCard from "./ChunkCard";

// 文档区块接口定义
export interface DocumentChunk {
  id: number;
  title: string;
  content: string;
  source: string;
  updated_at: string;
  char_count: number;
}

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

    setIsSaving(true);
    try {
      // TODO: 替换为实际的 API 调用
      // const result = await fetch('/api/updateChunk', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     id: selectedChunk.id,
      //     content: editingContent
      //   })
      // });

      // if (result.ok) {
      //   message.success('内容已更新');
      //   // 更新本地数据
      //   setDocumentChunks(prevChunks =>
      //     prevChunks.map(chunk =>
      //       chunk.id === selectedChunk.id
      //         ? { ...chunk, content: editingContent }
      //         : chunk
      //     )
      //   );
      // }

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));
      message.success("内容已更新");
      setDocumentChunks((prevChunks) =>
        prevChunks.map((chunk) =>
          chunk.id === selectedChunk.id
            ? { ...chunk, content: editingContent }
            : chunk
        )
      );
      setIsChunkModalOpen(false);
    } catch (error) {
      message.error("更新失败");
    } finally {
      setIsSaving(false);
    }
  };

  // 处理文档区块点击
  const handleChunkClick = (chunk: DocumentChunk) => {
    setSelectedChunk(chunk);
    setEditingContent(chunk.content);
    setIsChunkModalOpen(true);
  };

  // 示例数据，实际应该通过 API 获取
  useEffect(() => {
    if (currentEditingKB) {
      // TODO: 替换为实际的 API 调用
      const mockChunks = [
        {
          id: 1,
          title: "介绍部分",
          content: "这是文档的介绍部分...",
          source: "intro.md",
          updated_at: "2024-01-15T10:30:00Z",
          char_count: 1250,
        },
        {
          id: 2,
          title: "产品功能",
          content: "详细介绍产品的主要功能特性...",
          source: "features.md",
          updated_at: "2024-01-14T15:20:00Z",
          char_count: 2300,
        },
        {
          id: 3,
          title: "技术架构",
          content: "系统的技术架构设计说明...",
          source: "architecture.md",
          updated_at: "2024-01-13T09:45:00Z",
          char_count: 3100,
        },
        {
          id: 4,
          title: "使用教程",
          content: "详细的产品使用说明和教程...",
          source: "tutorial.md",
          updated_at: "2024-01-12T16:30:00Z",
          char_count: 4200,
        },
        {
          id: 5,
          title: "常见问题",
          content: "用户常见问题解答和故障排除指南...",
          source: "faq.md",
          updated_at: "2024-01-11T11:15:00Z",
          char_count: 1800,
        },
      ];
      setDocumentChunks(mockChunks);
    }
  }, [currentEditingKB]);

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
          documentChunks={documentChunks}
          setDocumentChunks={setDocumentChunks}
        />
      </div>

      <div className="overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4">
          {documentChunks.map((chunk) => (
            <ChunkCard
              chunk={chunk}
              documentChunks={documentChunks}
              setDocumentChunks={setDocumentChunks}
              handleChunkClick={handleChunkClick}
            />
          ))}
        </div>
      </div>

      <Modal
        title="编辑内容"
        open={isChunkModalOpen}
        onCancel={() => setIsChunkModalOpen(false)}
        footer={[
          <div className="flex items-center justify-end gap-4">
            <div className="text-gray-500">字符数: {editingContent.length}</div>
            <button
              key="save"
              onClick={handleSaveContent}
              disabled={isSaving}
              className="bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,0.7)] text-white px-8 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "更新中..." : "更新"}
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
