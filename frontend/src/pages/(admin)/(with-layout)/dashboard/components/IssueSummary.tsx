import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
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
  onCategoryClick?: (category: string, count: number) => void;
}

// 定义一个生成颜色的函数
const generateColor = (index: number) => {
  // 预设颜色
  const baseColors = [
    "#4f46e5", // 靛蓝色
    "#f97316", // 橙色
    "#10b981", // 绿色
    "#8b5cf6", // 紫色
    "#ec4899", // 粉色
    "#06b6d4", // 青色
    "#eab308", // 黄色
    "#ef4444", // 红色
    "#64748b", // 蓝灰色
    "#84cc16", // 酸橙色
  ];

  if (index < baseColors.length) {
    return baseColors[index];
  }

  // 如果索引超出预设颜色范围，则动态生成新颜色
  // 使用HSL色彩空间，以确保颜色足够丰富
  const hue = (index * 137.5) % 360; // 使用黄金角分布
  const saturation = 70 + (index % 3) * 10; // 在70%-90%之间变化
  const lightness = 45 + (index % 5) * 5; // 在45%-65%之间变化

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function IssueSummary<T extends IssueItem | StrengthItem>({
  data,
  type,
  onCategoryClick,
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

  // 处理类别点击
  const handleCategoryClick = (category: string, count: number) => {
    if (onCategoryClick) {
      onCategoryClick(category, count);
    }
  };

  return (
    <Card className="mb-0 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{isIssues ? "问题模式摘要" : "技术优势摘要"}</CardTitle>
        <CardDescription>
          {isIssues
            ? `共有 ${totalCount} 个问题模式记录，按类别分布如下`
            : `共有 ${totalCount} 个技术优势记录，按领域分布如下`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-col h-full">
          {/* <div className="mb-3">
            <h4 className="text-sm font-medium mb-1.5">
              主要{isIssues ? "问题" : "优势"}类别
            </h4>
            <div className="flex flex-wrap gap-2">
              {topCategories.map((cat, i) => (
                <Badge
                  key={cat.name}
                  variant={i === 0 ? "default" : "outline"}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleCategoryClick(cat.name, cat.count)}
                  style={
                    i !== 0
                      ? {
                          borderColor: generateColor(i),
                          color: generateColor(i),
                        }
                      : {}
                  }
                >
                  {cat.name}
                  <span className="ml-1 rounded-full bg-background px-1.5 text-xs font-normal text-foreground">
                    {cat.count}
                  </span>
                </Badge>
              ))}
            </div>
          </div> */}

          <div className="flex-1 min-h-[240px] pt-2">
            {chartData.length > 0 && (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
                  width={undefined}
                  // height={240}
                  layout="vertical"
                >
                  <CartesianGrid
                    horizontal={true}
                    vertical={true}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(value) =>
                      Math.floor(value) === value ? value : ""
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fontSize: 11 }}
                    width={75}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    barSize={24}
                    onClick={(data) =>
                      handleCategoryClick(data.category, data.value)
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={generateColor(index)}
                        fillOpacity={0.9}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
