import { GitBranch, Info, ChevronDown } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const CollectorView = ({ diffsData }: { diffsData: any }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4" />
        <span className="text-sm font-medium">变更概览</span>
      </div>
      <div className="space-y-2 pr-4">
        {diffsData?.files?.map((file: any, index: number) => (
          <Collapsible key={index} className="space-y-2">
            <Alert>
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-left">{file.filename}</AlertTitle>
                </div>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <AlertDescription>
                <div className="text-sm mt-2">
                  <p>状态: {file.status}</p>
                  <p>
                    添加: +{file.additions} 删除: -{file.deletions}
                  </p>
                </div>
              </AlertDescription>
              <CollapsibleContent className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px] bg-muted p-2 rounded-md">
                      {file.patch}
                    </pre>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Alert>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};
