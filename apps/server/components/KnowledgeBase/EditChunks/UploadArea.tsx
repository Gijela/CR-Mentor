import { message } from "antd";
import { FC, useState } from "react";

const UploadArea: FC<{
  kb_id: number;
  refreshDocumentChunks: () => void;
}> = ({ kb_id, refreshDocumentChunks }) => {
  const [isUploading, setIsUploading] = useState(false);

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.toLowerCase().endsWith(".md")) {
      message.error("Only support markdown files");
      return;
    }

    setIsUploading(true);
    try {
      // 读取文件内容
      const content = await file.text();

      const res = await fetch("/api/supabase/rag/kb_chunks/insertChunk", {
        method: "POST",
        body: JSON.stringify({
          kb_id,
          content,
          metadata: {
            source: file.name,
            title: file.name.replace(".md", ""),
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        message.success("File uploaded successfully");
        refreshDocumentChunks();
      } else {
        message.error("File uploaded failed");
      }

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
          <span>Uploading...</span>
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
          <span>Upload file (only support Markdown)</span>
        </>
      )}
    </label>
  );
};

export default UploadArea;
