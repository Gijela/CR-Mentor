import { FileCode, ChevronDown } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const ReviewerView = ({ reviewData }: { reviewData: any }) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>代码审查完成</AlertTitle>
        <AlertDescription>
          <div className="text-sm mt-2">
            <p>代码审查已完成，评论已发布到 GitHub</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* 展示被评论的文件及评论内容 */}
      {reviewData?.comments?.map((comment: any, index: number) => (
        <Collapsible key={index} className="space-y-2">
          <Alert>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                <AlertTitle className="text-left">
                  {comment.filePath}
                </AlertTitle>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <AlertDescription>
              <div className="text-sm mt-2">
                <p>评论内容:</p>
                <p className="text-sm text-muted-foreground">
                  {comment.content}
                </p>
              </div>
            </AlertDescription>
            <CollapsibleContent className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px] bg-muted p-2 rounded-md">
                    {comment.details}
                  </pre>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Alert>
        </Collapsible>
      ))}

      {/* 展示整个 PR 的总体总结 */}
      {reviewData?.summary && (
        <Alert>
          <AlertTitle>PR 总结</AlertTitle>
          <AlertDescription>
            <p className="text-sm mt-2 whitespace-pre-wrap">
              {reviewData.summary}
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
