import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Upload } from "lucide-react";
import { useCreateChunk } from "@/hooks/query/use-knowledge-chunks";
import { toast } from "sonner";

interface UploadAreaProps {
  kb_id: number;
}

const UploadArea = ({ kb_id }: UploadAreaProps) => {
  const { mutate: createChunk, isPending } = useCreateChunk();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".md")) {
      toast.error("只支持上传 Markdown 文件");
      return;
    }

    try {
      const content = await file.text();
      await createChunk({
        kb_id,
        content,
        metadata: {
          source: file.name,
          title: file.name.replace(".md", ""),
        },
      });

      toast.success("文档上传成功");
      e.target.value = "";
    } catch (error) {
      toast.error("上传失败");
      console.error("Upload error:", error);
    }
  };

  return (
    <label
      className={`w-fit flex items-center justify-center gap-2 border border-dashed rounded-lg
          hover:bg-accent transition-colors duration-200 cursor-pointer
          ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="file"
        accept=".md"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isPending}
      />
      {isPending ? (
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
          <span>上传中...</span>
        </div>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            input?.click();
          }}
          className="flex items-center justify-center gap-2"
        >
          <Upload className="h-4 w-4" />
          <span>上传</span>
        </Button>
      )}
    </label>
  );
};

export default UploadArea;
