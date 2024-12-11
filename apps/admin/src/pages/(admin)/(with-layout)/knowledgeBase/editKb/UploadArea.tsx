import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Upload } from "lucide-react";

const UploadArea = ({ kb_id, refreshDocumentChunks }: { kb_id: number, refreshDocumentChunks: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.toLowerCase().endsWith(".md")) {
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
        refreshDocumentChunks();
      }

      // 清空 input 的值，允许重复上传相同文件
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label
      className={`w-fit flex items-center justify-center gap-2 border border-dashed rounded-lg
          hover:bg-accent transition-colors duration-200 cursor-pointer
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
          <Button
            onClick={(e) => {
              e.preventDefault();
              const input = document.querySelector('input[type="file"]') as HTMLInputElement;
              input?.click();
            }}
            className="flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </>
      )}
    </label>
  );
};

export default UploadArea;
