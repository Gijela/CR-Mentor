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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpDown, Clock, FileText, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import type { ChunkItem } from "@/hooks/query/use-knowledge-chunks";
import { deleteChunk } from "@/hooks/query/use-knowledge-chunks";

interface ChunkCardProps {
  chunk: ChunkItem;
  onEdit: (chunk: ChunkItem) => void;
  onDelete: (docId: string) => void;
}

const ChunkCard = ({ chunk, onEdit, onDelete }: ChunkCardProps) => {
  const [isPending, setIsPending] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const kbName = searchParams.get("name") as string;

  const handleDeleteChunk = async () => {
    setIsPending(true);
    const result = await deleteChunk(kbName, chunk.id);
    if (result.success) {
      toast.success("Document deleted successfully");
      onDelete(chunk.id);
    } else {
      toast.error("Failed to delete document chunk");
    }
    setShowDeleteDialog(false);
    setIsPending(false);
  };

  return (
    <>
      <Card
        key={chunk.id}
        className="hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => onEdit(chunk)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{chunk.fileName}</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(chunk);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {chunk.text}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span className="truncate">{chunk.fileExtension}</span>
              </div>
              <div className="flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <span>{(chunk?.text || "").length} characters</span>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {new Date(
                  chunk.lastUpdated ||
                    chunk.createdAt ||
                    new Date().toISOString()
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document chunk? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteChunk}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChunkCard;
