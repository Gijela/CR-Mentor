import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import type { IssueItem, StrengthItem } from "./DataTable";

// 数据摘要组件的Props接口
interface IssueSummaryProps<T extends IssueItem | StrengthItem> {
  data: T[];
  type: "issues" | "strengths";
}

export function IssueSummary<T extends IssueItem | StrengthItem>({
  data,
  type,
}: IssueSummaryProps<T>) {
  const isIssues = type === "issues";

  // 计算基本统计信息
  const totalCount = data.length;

  // 获取前五个分类及其计数
  const categoryCounts = data.reduce((acc, item) => {
    const category = item.category_or_area;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 转换为数组并排序
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // 创建简单的图表数据
  const chartData = topCategories.map((cat) => ({
    category: cat.name,
    value: cat.count,
  }));

  // 用于微型图表的配置
  const chartConfig: ChartConfig = {
    category: {
      label: "分类",
      color: "hsl(var(--chart-1))",
    },
    value: {
      label: "数量",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle>{isIssues ? "问题模式摘要" : "技术优势摘要"}</CardTitle>
        <CardDescription>
          {isIssues
            ? `共有 ${totalCount} 个问题模式记录，按类别分布如下`
            : `共有 ${totalCount} 个技术优势记录，按领域分布如下`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              主要{isIssues ? "问题" : "优势"}类别
            </h4>
            <div className="flex flex-wrap gap-2">
              {topCategories.map((cat, i) => (
                <Badge
                  key={cat.name}
                  variant={i === 0 ? "default" : "outline"}
                  className="flex items-center gap-1"
                >
                  {cat.name}
                  <span className="ml-1 rounded-full bg-background px-1.5 text-xs font-normal text-foreground">
                    {cat.count}
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="h-auto min-h-[120px] flex items-center">
            {chartData.length > 0 && (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  width={undefined}
                  height={100}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="category" hide />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
