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
  ResponsiveContainer,
  Legend,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChartIcon,
  LineChartIcon,
  AreaChartIcon,
  FilterIcon,
  ZoomInIcon,
  ZoomOutIcon,
  Calendar,
  CheckSquare,
  XSquare,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Interface for individual data points in the chart
export interface TransformedChartDataItem {
  date: string; // Expecting date strings in "YYYY-MM-DD" or compatible format
  [seriesKey: string]: number | string; // Allows for dynamic series keys like 'strengths', 'issues'
}

// 图表类型
type ChartType = "area" | "bar" | "line";

// 时间粒度类型
type TimeGranularity = "daily" | "weekly" | "monthly";

// Props for the ChartAreaInteractive component
export interface ChartAreaInteractiveProps {
  chartData?: TransformedChartDataItem[];
  chartConfig: ChartConfig; // Expecting a ChartConfig object from the parent
  title?: string;
  description?: string;
  defaultChartType?: ChartType;
  defaultGranularity?: TimeGranularity;
}

// Default empty chart data and config if not provided
const DEFAULT_CHART_DATA: TransformedChartDataItem[] = [];
const DEFAULT_CHART_CONFIG: ChartConfig = {};

export function ChartAreaInteractive({
  chartData = DEFAULT_CHART_DATA,
  chartConfig = DEFAULT_CHART_CONFIG,
  title = "Insight Trends", // Generic title
  description = "Visualizing insights over time", // Generic description
  defaultChartType = "area",
  defaultGranularity = "daily",
}: ChartAreaInteractiveProps) {
  // 状态：当前选择的图表类型
  const [chartType, setChartType] = React.useState<ChartType>(defaultChartType);

  // 状态：当前选择的时间粒度
  const [granularity, setGranularity] =
    React.useState<TimeGranularity>(defaultGranularity);

  // 状态：选择显示哪些数据系列
  const [visibleSeries, setVisibleSeries] = React.useState<
    Record<string, boolean>
  >({});

  // 状态：是否显示图例
  const [showLegend, setShowLegend] = React.useState(true);

  // Prepare a list of series keys from chartConfig, excluding any potential 'date' key or others not representing data series.
  const seriesKeys = Object.keys(chartConfig).filter(
    (key) =>
      chartConfig[key] &&
      typeof chartConfig[key].label === "string" &&
      chartConfig[key].color
  );

  // 初始化可见系列
  React.useEffect(() => {
    // 初始默认所有系列可见
    const initialVisibleSeries: Record<string, boolean> = {};
    seriesKeys.forEach((key) => {
      initialVisibleSeries[key] = true;
    });
    setVisibleSeries(initialVisibleSeries);
  }, [seriesKeys]);

  // 根据时间粒度处理数据
  const processedData = React.useMemo(() => {
    if (!chartData.length) return [];

    // 如果是daily，直接返回原始数据
    if (granularity === "daily") return chartData;

    // 聚合数据的辅助函数
    const aggregateData = (
      data: TransformedChartDataItem[],
      periodFormatter: (date: Date) => string
    ) => {
      const aggregated: Record<string, TransformedChartDataItem> = {};

      data.forEach((item) => {
        const date = new Date(item.date);
        const periodKey = periodFormatter(date);

        if (!aggregated[periodKey]) {
          aggregated[periodKey] = {
            date: periodKey,
            ...seriesKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
          };
        }

        // 累加每个系列的值
        seriesKeys.forEach((key) => {
          if (typeof item[key] === "number") {
            aggregated[periodKey][key] =
              (aggregated[periodKey][key] as number) + (item[key] as number);
          }
        });
      });

      // 转换为数组并排序
      return Object.values(aggregated).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    };

    // 根据不同的时间粒度聚合数据
    if (granularity === "weekly") {
      // 按周聚合：使用年份+周数作为键
      return aggregateData(chartData, (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceFirstDay = Math.floor(
          (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)
        );
        const weekNumber = Math.ceil(
          (daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7
        );
        return `${date.getFullYear()}-W${weekNumber}`;
      });
    } else if (granularity === "monthly") {
      // 按月聚合：使用年份+月份作为键
      return aggregateData(chartData, (date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      });
    }

    return chartData;
  }, [chartData, granularity, seriesKeys]);

  // 切换系列可见性的处理函数
  const toggleSeries = (seriesKey: string) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [seriesKey]: !prev[seriesKey],
    }));
  };

  // 全选/取消全选系列
  const toggleAllSeries = (checked: boolean) => {
    const updatedVisibility: Record<string, boolean> = {};
    seriesKeys.forEach((key) => {
      updatedVisibility[key] = checked;
    });
    setVisibleSeries(updatedVisibility);
  };

  // 格式化X轴标签
  const formatXAxisTick = (value: string): string => {
    if (!value) return "";

    try {
      const date = new Date(value);
      return date.toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      return value;
    }
  };

  // 根据图表类型渲染不同的图表组件
  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 5, right: 20, left: -20, bottom: 5 },
    };

    // 获取当前可见的系列
    const visibleSeriesKeys = seriesKeys.filter((key) => visibleSeries[key]);

    // 公共的轴和网格配置
    const commonChartElements = (
      <>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={20}
          tickFormatter={formatXAxisTick}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator={chartType === "bar" ? "item" : "line"}
            />
          }
        />
        {showLegend && (
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingTop: "10px" }}
          />
        )}
      </>
    );

    // 区域图
    if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          <defs>
            {visibleSeriesKeys.map((key) => (
              <linearGradient
                key={`fill${key}`}
                id={`fill${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          {commonChartElements}
          {visibleSeriesKeys.map((key) => (
            <Area
              key={key}
              dataKey={key}
              name={chartConfig[key]?.label || key}
              type="monotone"
              fill={`url(#fill${key})`}
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              isAnimationActive={true}
            />
          ))}
        </AreaChart>
      );
    }

    // 柱状图
    if (chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          {commonChartElements}
          {visibleSeriesKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              name={chartConfig[key]?.label || key}
              fill={`var(--color-${key})`}
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          ))}
        </BarChart>
      );
    }

    // 线图
    return (
      <LineChart {...commonProps}>
        {commonChartElements}
        {visibleSeriesKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            name={chartConfig[key]?.label || key}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={{ r: 3 }}
            type="monotone"
          />
        ))}
      </LineChart>
    );
  };

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex space-x-2">
            {/* 图表类型切换 */}
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

            {/* 时间粒度选择 */}
            <Select
              value={granularity}
              onValueChange={(value) =>
                setGranularity(value as TimeGranularity)
              }
            >
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="时间粒度" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>时间粒度</SelectLabel>
                  <SelectItem value="daily">每日</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                  <SelectItem value="monthly">每月</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* 系列筛选器 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" title="筛选系列">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">显示数据系列</h4>
                    <p className="text-sm text-muted-foreground">
                      选择要在图表中显示的数据系列
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => toggleAllSeries(true)}
                    >
                      <CheckSquare className="mr-1 h-4 w-4" /> 全选
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => toggleAllSeries(false)}
                    >
                      <XSquare className="mr-1 h-4 w-4" /> 取消全选
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    {seriesKeys.map((key) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`series-${key}`}
                          checked={visibleSeries[key]}
                          onCheckedChange={() => toggleSeries(key)}
                        />
                        <Label
                          htmlFor={`series-${key}`}
                          className="flex items-center cursor-pointer"
                        >
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: `var(--color-${key})` }}
                          />
                          {chartConfig[key]?.label || key}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* 显示/隐藏图例 */}
            <Button
              variant="outline"
              size="icon"
              title={showLegend ? "隐藏图例" : "显示图例"}
              onClick={() => setShowLegend(!showLegend)}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {renderChart()}
        </ChartContainer>
      </CardContent>
      {seriesKeys.length > 0 && (
        <CardFooter className="px-6 pt-0 pb-6">
          <div className="text-xs text-muted-foreground">
            当前显示 {Object.values(visibleSeries).filter(Boolean).length}{" "}
            个数据系列，共 {seriesKeys.length} 个
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
