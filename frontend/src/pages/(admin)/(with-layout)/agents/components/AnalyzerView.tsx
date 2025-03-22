import { FileCode } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AnalyzerView = ({
  diffsData,
  diffEntityObj,
}: {
  diffsData: any;
  diffEntityObj: any;
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>实体分析结果</AlertTitle>
        <AlertDescription>
          <div className="text-sm mt-2">
            <p>分析的文件数: {diffsData?.files?.length || 0}</p>
            <p>
              总变更行数:{" "}
              {diffsData?.files?.reduce(
                (acc: number, file: any) => acc + file.changes,
                0
              ) || 0}
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-2 pr-4">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4" />
          <span className="text-sm font-medium">提取的实体</span>
        </div>
        {diffEntityObj?.entityList?.map((entity: any, index: number) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-2">{entity.file_path}</h4>
              <div className="flex flex-wrap gap-2">
                {entity.entities.map((item: string, i: number) => (
                  <Badge key={i} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {diffEntityObj?.filteredSummary && (
        <Alert>
          <AlertTitle>变更摘要</AlertTitle>
          <AlertDescription>
            <p className="text-sm mt-2 whitespace-pre-wrap">
              {diffEntityObj.filteredSummary}
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
