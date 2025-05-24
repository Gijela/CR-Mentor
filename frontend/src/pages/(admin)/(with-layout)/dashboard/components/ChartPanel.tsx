import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTypeSelector } from "./ChartTypeSelector";
import type { ChartType } from "./ChartTypeSelector";

// 简化的图表数据项接口
interface ChartDataItem {
  date: string;
  [key: string]: string | number;
}

// 简化的图表配置接口
interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ChartPanelProps {
  title: string;
  description: string;
  data: ChartDataItem[];
  config: ChartConfig;
}

// 动态生成颜色的函数
function generateChartColor(key: string, index: number): string {
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

  // 使用预设颜色或生成颜色
  if (index < baseColors.length) {
    return baseColors[index];
  }

  // 如果索引超出范围，基于键和索引生成颜色
  const hue = (index * 137.5) % 360;
  const saturation = 70 + (index % 3) * 10;
  const lightness = 45 + (index % 5) * 5;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function ChartPanel({
  title,
  description,
  data,
  config,
}: ChartPanelProps) {
  const [chartType, setChartType] = useState<ChartType>("area");
  const seriesKeys = Object.keys(config);

  // 获取安全的颜色和标签
  const getColor = (key: string, index: number): string => {
    const conf = config[key];
    if (conf && conf.color) {
      return conf.color;
    }
    return generateChartColor(key, index);
  };

  const getLabel = (key: string): string => {
    const conf = config[key];
    if (conf && conf.label) {
      return conf.label;
    }
    return key;
  };

  // 自定义提示框
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border bg-background p-2 shadow-sm">
          <div className="mb-1 font-medium">{label}</div>
          <div className="grid gap-0.5">
            {payload.map((entry: any, index: number) => (
              <div
                key={`item-${index}`}
                className="flex items-center gap-1 text-sm"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}: </span>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // 渲染图表内容
  const renderChart = () => {
    // 根据图表类型渲染不同图表
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value);
                    return date.toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    });
                  } catch (e) {
                    return value;
                  }
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              {seriesKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={getLabel(key)}
                  fill={getColor(key, index)}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value);
                    return date.toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    });
                  } catch (e) {
                    return value;
                  }
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              {seriesKeys.map((key, index) => (
                <Line
                  key={key}
                  dataKey={key}
                  name={getLabel(key)}
                  stroke={getColor(key, index)}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
      default:
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                {seriesKeys.map((key, index) => {
                  const color = getColor(key, index);
                  return (
                    <linearGradient
                      key={`gradient-${key}`}
                      id={`gradient-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  try {
                    const date = new Date(value);
                    return date.toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    });
                  } catch (e) {
                    return value;
                  }
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              {seriesKeys.map((key, index) => (
                <Area
                  key={key}
                  dataKey={key}
                  name={getLabel(key)}
                  type="monotone"
                  stroke={getColor(key, index)}
                  fill={`url(#gradient-${key})`}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <ChartTypeSelector
          value={chartType}
          onChange={(value) => setChartType(value)}
        />
      </CardHeader>
      <CardContent className="flex-1">{renderChart()}</CardContent>
    </Card>
  );
} 