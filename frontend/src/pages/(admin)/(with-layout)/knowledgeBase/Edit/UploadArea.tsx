import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { uploadFile } from "@/hooks/query/use-knowledge-chunks";

interface UploadAreaProps {
  kbName: string;
  onUploadSuccess: () => void;
}

const UploadArea = ({ kbName, onUploadSuccess }: UploadAreaProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".md")) {
      toast.error("Only markdown files are supported");
      return;
    }

    try {
      const content = await file.text();
      const fileExtension = (file.name || "").split(".").pop() || "md";
      const params = {
        knowledgeBaseName: kbName,
        documents: [
          {
            content,
            fileName: file.name.replace(`.${fileExtension}`, ""),
            fileExtension,
          },
        ],
      };

      const { success } = await uploadFile(params);
      if (!success) {
        toast.error("Upload failed");
        throw new Error("Upload failed");
      }
      setIsUploading(false);

      onUploadSuccess();
      toast.success("Document uploaded successfully");
      e.target.value = "";
    } catch (error) {
      setIsUploading(false);
      toast.error("Upload failed");
      console.error("Upload error:", error);
    }
  };

  return (
    <label
      className={`w-fit flex items-center justify-center gap-2 rounded-lg
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
        <div className="flex items-center gap-2 px-2 py-1">
          <svg
            className="animate-spin h-4 w-4 text-primary"
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
          <span className="text-sm font-medium">Uploading...</span>
        </div>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            const input = document.querySelector(
              'input[type="file"]'
            ) as HTMLInputElement;
            input?.click();
          }}
          className="flex items-center justify-center gap-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </Button>
      )}
    </label>
  );
};

export default UploadArea;
