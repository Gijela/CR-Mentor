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

/**
 * 增强版图表面板组件
 * 避免类型错误问题
 */
export function ChartPanel({
  title,
  description,
  data,
  config,
}: ChartPanelProps) {
  const [chartType, setChartType] = useState<ChartType>("area");

  // 获取图表数据的所有系列键
  const seriesKeys = Object.keys(config);

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
          <ResponsiveContainer width="100%" height={300}>
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
              {seriesKeys.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={String(config[key]?.label || key)}
                  fill={config[key]?.color || "#8884d8"}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
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
              {seriesKeys.map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  name={String(config[key]?.label || key)}
                  stroke={config[key]?.color || "#8884d8"}
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
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                {seriesKeys.map((key) => (
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
                      stopColor={config[key]?.color || "#8884d8"}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={config[key]?.color || "#8884d8"}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
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
              {seriesKeys.map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  name={String(config[key]?.label || key)}
                  type="monotone"
                  stroke={config[key]?.color || "#8884d8"}
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
    <Card className="w-full">
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
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
