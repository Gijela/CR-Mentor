import { message } from "antd";
import { FC, useState } from "react";
import { DocumentChunk } from "./index";

const UploadArea: FC<{
  documentChunks: DocumentChunk[];
  setDocumentChunks: (chunks: DocumentChunk[]) => void;
}> = ({ documentChunks, setDocumentChunks }) => {
  const [isUploading, setIsUploading] = useState(false);

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.toLowerCase().endsWith(".md")) {
      message.error("只支持上传 Markdown (.md) 格式的文件");
      return;
    }

    setIsUploading(true);
    try {
      // 读取文件内容
      const content = await file.text();

      // TODO: 替换为实际的 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 添加新的文档区块到列表最前面
      const newChunk: DocumentChunk = {
        id: Date.now(),
        title: file.name.replace(".md", ""),
        content: content,
        source: file.name,
        updated_at: new Date().toISOString(),
        char_count: content.length,
      };

      const newChunks = [newChunk, ...documentChunks];

      setDocumentChunks(newChunks);
      message.success("文件上传成功");

      // 清空 input 的值，允许重复上传相同文件
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      message.error("文件上传失败");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <label
      className={`w-full h-12 flex items-center justify-center gap-2 border border-dashed rounded-lg
          border-[rgba(99,0,255,0.87)] text-[rgba(99,0,255,0.87)]
          hover:border-[rgba(99,0,255,0.87)] hover:text-[rgba(99,0,255,0.87)]
          transition-colors duration-200 cursor-pointer
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="file"
        accept=".md"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isUploading}
      />
      {isUploading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>正在上传...</span>
        </div>
      ) : (
        <>
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="plus"
            width="1em"
            height="1em"
            fill="currentColor"
          >
            <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
            <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path>
          </svg>
          <span>上传文件（仅支持 Markdown）</span>
        </>
      )}
    </label>
  );
};

export default UploadArea;
