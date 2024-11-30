import { FC } from "react";
import { DocumentChunk } from "./index";
import { Button, Card, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ChunkCard: FC<{
  chunk: DocumentChunk;
  documentChunks: DocumentChunk[];
  setDocumentChunks: (chunks: DocumentChunk[]) => void;
  handleChunkClick: (chunk: DocumentChunk) => void;
}> = ({ chunk, documentChunks, setDocumentChunks, handleChunkClick }) => {
  // 处理删除区块
  const handleDeleteChunk = async (e: React.MouseEvent, chunkId: number) => {
    e.stopPropagation(); // 阻止事件冒泡到卡片点击事件

    try {
      // TODO: 替换为实际的 API 调用
      // const result = await fetch('/api/deleteChunk', {
      //   method: 'POST',
      //   body: JSON.stringify({ id: chunkId })
      // });

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newDocumentChunks = documentChunks.filter(
        (chunk) => chunk.id !== chunkId
      );

      // 更新本地状态
      setDocumentChunks(newDocumentChunks);
      message.success("区块已删除");
    } catch (error) {
      message.error("删除失败");
    }
  };

  return (
    <Card
      key={chunk.id}
      className="shadow-sm transition-all duration-200 hover:shadow-md hover:border-[rgba(99,0,255,0.87)] cursor-pointer"
      onClick={() => handleChunkClick(chunk)}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium">{chunk.title}</h3>
          <div className="flex gap-2">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-gray-500 hover:text-[rgba(99,0,255,0.87)]"
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-gray-500 hover:text-red-500"
              onClick={(e) => handleDeleteChunk(e, chunk.id)}
            />
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{chunk.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="truncate">{chunk.source}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span>{chunk.char_count} 字符</span>
            </div>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{new Date(chunk.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChunkCard;
