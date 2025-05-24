import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, subMonths, isValid } from "date-fns";
import { InfoIcon, TrendingUpIcon } from "lucide-react";
import type { StrengthItem } from "./DataTable";

interface SkillTrendChartProps {
  strengths: StrengthItem[];
  title?: string;
  description?: string;
}

// 明确颜色映射的类型
type SkillColorMap = {
  [key: string]: string;
};

// 使用Record<string, string>明确表示每个key都对应一个string值
const SKILL_COLORS: Record<string, string> = {
  架构设计: "#2563eb", // 蓝色
  功能增强: "#10b981", // 绿色
  文档完善: "#f59e0b", // 橙色
  CI流程优化: "#8b5cf6", // 紫色
  数据流设计: "#ec4899", // 粉色
  API设计: "#06b6d4", // 青色
  数据库性能: "#ef4444", // 红色
};

// 默认颜色数组
const DEFAULT_COLORS = [
  "#2563eb", // 蓝色
  "#10b981", // 绿色
  "#f59e0b", // 橙色
  "#8b5cf6", // 紫色
  "#ec4899", // 粉色
];

// 技能随时间变化的模拟数据生成函数
function generateTrendData(strengths: StrengthItem[], months = 6) {
  const areas = new Set<string>();

  // 提取所有技能领域
  strengths.forEach((strength) => {
    if (strength.category_or_area) {
      areas.add(strength.category_or_area);
    }
  });

  const areasList = Array.from(areas).slice(0, 5); // 最多显示5个领域
  const currentDate = new Date();
  const result = [];

  // 为每个月生成数据点
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(currentDate, i);
    if (!isValid(date)) continue;

    const dataPoint: Record<string, any> = {
      date: format(date, "yyyy-MM"),
    };

    // 为每个领域生成随机的增长曲线
    areasList.forEach((area) => {
      // 使用当前置信度作为最终值，从低值开始
      const currentConfidence =
        strengths.find((s) => s.category_or_area === area)?.confidence || 0.5;

      // 使用更加平滑的S形增长曲线
      const progress = (months - i) / months;
      const growthFactor = 1 / (1 + Math.exp(-10 * (progress - 0.5))); // sigmoid函数

      const baseValue = Math.max(0.2, currentConfidence * 0.5); // 初始值至少为20%

      // 添加-3%到3%的随机波动，保持曲线平滑
      const randomVariance = Math.sin(i * 0.7) * 0.03;

      dataPoint[area] = Math.min(
        1,
        Math.max(
          0,
          baseValue +
            (currentConfidence - baseValue) * growthFactor +
            randomVariance
        )
      );
    });

    result.push(dataPoint);
  }

  return { data: result, areas: areasList };
}

export function SkillTrendChart({
  strengths,
  title = "技能发展趋势",
  description = "显示开发者技能水平随时间的变化",
}: SkillTrendChartProps) {
  const [timeRange, setTimeRange] = useState<string>("6");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const { data, areas } = generateTrendData(strengths, parseInt(timeRange));

  // 首次加载时，自动选择所有区域
  useEffect(() => {
    if (areas.length > 0 && selectedAreas.length === 0) {
      setSelectedAreas(areas);
    }
  }, [areas, selectedAreas]);

  // 切换时间范围时触发图表重新动画
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [timeRange]);

  // 获取颜色函数，保证类型安全
  const getAreaColor = (area: string, index: number): string => {
    // @ts-ignore - TypeScript无法正确推断SKILL_COLORS[area]一定是string类型
    return SKILL_COLORS[area] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  // 处理区域选择变化
  const toggleAreaSelection = (area: string) => {
    setSelectedAreas((prev) => {
      if (prev.includes(area)) {
        return prev.filter((a) => a !== area);
      } else {
        return [...prev, area];
      }
    });
  };

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-card p-3 text-sm shadow-md">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}:</span>
                <span className="font-medium">
                  {(entry.value * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!strengths.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-center text-muted-foreground">暂无技能数据</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">近3个月</SelectItem>
              <SelectItem value="6">近6个月</SelectItem>
              <SelectItem value="12">近1年</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {areas.map((area, i) => (
            <Badge
              key={area}
              variant={selectedAreas.includes(area) ? "default" : "outline"}
              style={{
                backgroundColor: selectedAreas.includes(area)
                  ? getAreaColor(area, i)
                  : "transparent",
                borderColor: getAreaColor(area, i),
                opacity: selectedAreas.includes(area) ? 1 : 0.6,
                cursor: "pointer",
              }}
              onClick={() => toggleAreaSelection(area)}
            >
              {area}
            </Badge>
          ))}
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%" key={animationKey}>
            <LineChart
              data={data}
              margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#888888", fontSize: 12 }}
                tickLine={{ stroke: "#888888" }}
              />
              <YAxis
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                tick={{ fill: "#888888", fontSize: 12 }}
                tickLine={{ stroke: "#888888" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0.75} stroke="#888888" strokeDasharray="3 3" />
              {areas.map(
                (area, i) =>
                  selectedAreas.includes(area) && (
                    <Line
                      key={area}
                      type="monotone"
                      dataKey={area}
                      name={area}
                      stroke={getAreaColor(area, i)}
                      strokeWidth={2}
                      dot={{ r: 4, fill: getAreaColor(area, i) }}
                      activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                  )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground border-t border-muted-foreground/10 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <InfoIcon className="h-3 w-3" />
          <span>点击标签可选择/取消显示对应技能曲线</span>
        </div>
        <div>
          <span>水平线表示75%熟练度标准线</span>
        </div>
      </CardFooter>
    </Card>
  );
}
