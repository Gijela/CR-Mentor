import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartIcon, LineChartIcon, AreaChartIcon } from "lucide-react";

// 数据点接口
export interface ChartDataItem {
  date: string;
  [key: string]: string | number;
}

// 图表类型
type ChartType = "area" | "bar" | "line";

// 组件属性
interface ChartAreaEnhancedProps {
  data: ChartDataItem[];
  config: ChartConfig;
  title?: string;
  description?: string;
}

/**
 * 增强的图表组件，支持图表类型切换
 */
export function ChartAreaEnhanced({
  data = [],
  config = {},
  title = "数据趋势",
  description = "可视化数据变化趋势",
}: ChartAreaEnhancedProps) {
  // 图表类型状态
  const [chartType, setChartType] = React.useState<ChartType>("area");

  // 获取数据系列的键
  const seriesKeys = Object.keys(config).filter(
    (key) => typeof config[key]?.label === "string"
  );

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

  // 渲染图表
  const renderChart = () => {
    // 公共属性
    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 5 },
      width: 500,
      height: 300,
    };

    // 公共组件
    const commonElements = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
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
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
      </>
    );

    // 根据图表类型渲染不同图表
    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {commonElements}
            {seriesKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                name={config[key]?.label || key}
                fill={config[key]?.color || "#8884d8"}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...commonProps}>
            {commonElements}
            {seriesKeys.map((key) => (
              <Line
                key={key}
                dataKey={key}
                name={config[key]?.label || key}
                stroke={config[key]?.color || "#8884d8"}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        );
      case "area":
      default:
        return (
          <AreaChart {...commonProps}>
            {commonElements}
            {seriesKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                name={config[key]?.label || key}
                stroke={config[key]?.color || "#8884d8"}
                fill={config[key]?.color || "#8884d8"}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Tabs
            value={chartType}
            onValueChange={(value) => setChartType(value as ChartType)}
            className="w-auto"
          >
            <TabsList className="bg-muted/50">
              <TabsTrigger value="area" title="区域图">
                <AreaChartIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="bar" title="柱状图">
                <BarChartIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="line" title="折线图">
                <LineChartIcon className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">{renderChart()}</div>
      </CardContent>
      {seriesKeys.length > 0 && (
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            展示 {seriesKeys.length} 个数据系列
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
