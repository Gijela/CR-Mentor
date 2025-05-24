import * as React from "react";
import { AlertTriangleIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IssuesTable } from "./IssuesTable";
import { StrengthsTable } from "./StrengthsTable";
import { type IssueItem, type StrengthItem } from "./types";

// 数据表格主组件
export function DataTable({
  data: initialData,
  activeTab = "outline",
  onTabChange,
  id,
}: {
  data: IssueItem[] | StrengthItem[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  id?: string;
}) {
  const [activeTabState, setActiveTabState] = React.useState(activeTab);

  const handleTabChange = (value: string) => {
    setActiveTabState(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // 类型判断辅助函数
  const isIssueData = (data: any[]): data is IssueItem[] => {
    return data.length > 0 && "status" in data[0];
  };

  const isStrengthData = (data: any[]): data is StrengthItem[] => {
    return data.length > 0 && "confidence" in data[0];
  };

  return (
    <div id={id}>
      <Tabs
        defaultValue={activeTab}
        value={activeTabState}
        onValueChange={handleTabChange}
        className="flex w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="view-selector" className="sr-only">
            View mode
          </Label>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="outline">问题</TabsTrigger>
            <TabsTrigger value="tech-radar">技术优势</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="outline" className="mt-0">
          {isIssueData(initialData) ? (
            <IssuesTable data={initialData} />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <AlertTriangleIcon className="h-6 w-6 text-muted-foreground" />
                <h3 className="text-base font-medium">未找到问题数据</h3>
                <p className="text-sm text-muted-foreground">
                  请检查API返回的数据格式或网络连接。
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tech-radar" className="mt-0">
          {isStrengthData(initialData) ? (
            <StrengthsTable data={initialData} />
          ) : (
            <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 重新导出类型，方便使用
export * from "./types";
