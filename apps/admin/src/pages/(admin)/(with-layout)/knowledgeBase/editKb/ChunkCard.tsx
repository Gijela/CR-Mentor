import { Button } from "@repo/ui/button"
import { Card, CardContent, CardHeader } from "@repo/ui/card"
import { Pencil, Trash2, FileText, ArrowUpDown, Clock } from "lucide-react"
import { toast } from "sonner"

const ChunkCard = ({ chunk, documentChunks, setDocumentChunks, handleChunkClick }: any) => {
  const handleDeleteChunk = async (e: React.MouseEvent, chunkId: number) => {
    e.stopPropagation(); // 阻止事件冒泡到卡片点击事件


    // try {
    //   // TODO: 替换为实际的 API 调用
    //   // const result = await fetch('/api/deleteChunk', {
    //   //   method: 'POST',
    //   //   body: JSON.stringify({ id: chunkId })
    //   // });

    //   // 模拟 API 调用
    //   await new Promise((resolve) => setTimeout(resolve, 500));

    //   const newDocumentChunks = documentChunks.filter(
    //     (chunk) => chunk.id !== chunkId
    //   );

    //   // 更新本地状态
    //   setDocumentChunks(newDocumentChunks);
    //   message.success("Chunk deleted");
    // } catch (error) {
    //   message.error("Delete failed");
    // }
  };

  return (
    <Card
      key={chunk.id}
      className="hover:border-primary transition-all duration-200 cursor-pointer"
      onClick={() => handleChunkClick(chunk)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{chunk.metadata.title}</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-destructive"
              onClick={(e) => handleDeleteChunk(e, chunk.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{chunk.content}</p>

        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span className="truncate">{chunk.metadata.source}</span>
            </div>
            <div className="flex items-center">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <span>{chunk.content.length} 字符</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{new Date(chunk.created_at).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChunkCard;
