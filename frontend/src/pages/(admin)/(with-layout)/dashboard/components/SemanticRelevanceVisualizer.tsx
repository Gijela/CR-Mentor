import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  PieChart,
  Pie,
  Legend,
  Sector,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoIcon, BarChart2Icon, PieChartIcon } from "lucide-react";
import type { KnowledgeSnippet } from "../services";

interface SemanticRelevanceVisualizerProps {
  snippets: KnowledgeSnippet[];
  query: string;
  onViewDetails?: (snippet: KnowledgeSnippet) => void;
}

export function SemanticRelevanceVisualizer({
  snippets,
  query,
  onViewDetails,
}: SemanticRelevanceVisualizerProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activePieIndex, setActivePieIndex] = useState<number | undefined>(
    undefined
  );

  if (!snippets || snippets.length === 0) {
    return null;
  }

  // 为每个知识片段准备数据
  const chartData = snippets
    .filter((snippet) => snippet.similarity_score !== undefined)
    .map((snippet) => ({
      id: snippet.id,
      name: getShortName(snippet.summary),
      fullName: snippet.summary,
      score: snippet.similarity_score || 0,
      category: snippet.category,
      tags: snippet.tags || [],
      originalSnippet: snippet, // 保存原始数据用于点击时传递
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // 仅显示前10个最相关的结果

  // 为条形图生成渐变颜色
  const getBarColor = (score: number, isHovered: boolean) => {
    const baseColor =
      score >= 0.9
        ? "#10b981" // 绿色 - 高相关性
        : score >= 0.75
        ? "#2563eb" // 蓝色 - 中高相关性
        : score >= 0.6
        ? "#f59e0b" // 橙色 - 中等相关性
        : "#6b7280"; // 灰色 - 低相关性

    // 如果悬停，返回更亮的颜色
    return isHovered ? adjustColorBrightness(baseColor, 20) : baseColor;
  };

  // 调整颜色亮度的辅助函数
  function adjustColorBrightness(hex: string, percent: number) {
    // 将十六进制转换为RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // 增加亮度
    r = Math.min(255, Math.floor((r * (100 + percent)) / 100));
    g = Math.min(255, Math.floor((g * (100 + percent)) / 100));
    b = Math.min(255, Math.floor((b * (100 + percent)) / 100));

    // 转回十六进制
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // 获取摘要的简短名称
  function getShortName(summary: string): string {
    if (summary.length <= 20) return summary;
    return summary.substring(0, 18) + "...";
  }

  // 处理条形图点击事件
  const handleBarClick = (data: any) => {
    if (onViewDetails && data.originalSnippet) {
      onViewDetails(data.originalSnippet);
    }
  };

  // 处理饼图扇形点击
  const handlePieClick = (data: any, index: number) => {
    if (onViewDetails && data.payload.originalSnippet) {
      onViewDetails(data.payload.originalSnippet);
    }
  };

  // 处理鼠标悬停
  const handleMouseEnter = (data: any) => {
    setHoveredItem(data.id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // 处理饼图扇形悬停
  const onPieEnter = (_: any, index: number) => {
    setActivePieIndex(index);
  };

  const onPieLeave = () => {
    setActivePieIndex(undefined);
  };

  // 自定义工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-card p-3 text-sm shadow-md">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-muted-foreground my-1">
            相关度:{" "}
            <span className="font-semibold">
              {(data.score * 100).toFixed(0)}%
            </span>
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {data.category}
            </Badge>
            {data.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {onViewDetails && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              点击{chartType === "bar" ? "条形图" : "扇形"}查看详情
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // 饼图自定义活动扇形
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy - 5}
          dy={8}
          textAnchor="middle"
          fill="#888888"
          fontSize={12}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          fill="#666666"
          fontSize={14}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <Card className="border-muted-foreground/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2Icon className="h-5 w-5 text-primary" />
              查询结果相关性分析
            </CardTitle>
            <CardDescription>
              显示与查询 "
              <span className="font-medium">{query || "全部知识片段"}</span>"
              最相关的知识片段及其相关度
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-8 px-2"
            >
              <BarChart2Icon className="h-4 w-4 mr-1" />
              条形图
            </Button>
            <Button
              variant={chartType === "pie" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("pie")}
              className="h-8 px-2"
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              饼图
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onClick={handleBarClick}
              >
                <XAxis
                  type="number"
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  tick={{ fill: "#888888" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12, fill: "#888888" }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Bar
                  dataKey="score"
                  name="相关度"
                  barSize={20}
                  radius={[0, 4, 4, 0]}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: onViewDetails ? "pointer" : "default" }}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={getBarColor(entry.score, hoveredItem === entry.id)}
                    />
                  ))}
                  <LabelList
                    dataKey="score"
                    position="right"
                    formatter={(value: number) =>
                      `${(value * 100).toFixed(0)}%`
                    }
                    style={{ fill: "#666666", fontSize: 12 }}
                  />
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  activeIndex={activePieIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="score"
                  nameKey="name"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  onClick={handlePieClick}
                  style={{ cursor: onViewDetails ? "pointer" : "default" }}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={getBarColor(entry.score, false)}
                    />
                  ))}
                  <LabelList
                    dataKey="name"
                    position="outside"
                    style={{ fontSize: 11, fill: "#666666" }}
                  />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value, entry, index) => {
                    const item = chartData[index || 0];
                    return item ? (
                      <span className="text-xs">
                        {item.name}: {(item.score * 100).toFixed(0)}%
                      </span>
                    ) : null;
                  }}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground border-t border-muted-foreground/10 flex justify-between items-center">
        <div className="flex gap-3">
          <span className="flex items-center">
            <span
              className="inline-block w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: "#10b981" }}
            ></span>
            高相关 (≥90%)
          </span>
          <span className="flex items-center">
            <span
              className="inline-block w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: "#2563eb" }}
            ></span>
            中高相关 (≥75%)
          </span>
          <span className="flex items-center">
            <span
              className="inline-block w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: "#f59e0b" }}
            ></span>
            中等相关 (≥60%)
          </span>
        </div>
        <div className="flex items-center gap-1">
          <InfoIcon className="h-3 w-3" />
          <span>共 {chartData.length} 条结果</span>
        </div>
      </CardFooter>
    </Card>
  );
}
