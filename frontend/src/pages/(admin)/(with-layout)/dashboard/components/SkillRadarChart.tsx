import React, { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
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
import { ActivityIcon, InfoIcon, ChevronsUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StrengthItem } from "./DataTable";

interface SkillRadarChartProps {
  strengths: StrengthItem[];
  title?: string;
  description?: string;
}

interface SkillData {
  area: string;
  value: number;
  count: number;
  strengthIds: string[];
  fullMark: number; // 满分值
}

/**
 * 技能雷达图组件
 * 显示开发者在不同技术领域的技能水平
 */
export function SkillRadarChart({
  strengths,
  title = "技术领域覆盖",
  description = "显示开发者在各技术领域的专长水平",
}: SkillRadarChartProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  // 组件挂载或数据变化时触发动画效果
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [strengths]);

  // 聚合不同领域的优势数据
  const processedData = React.useMemo(() => {
    const skillMap: Record<string, SkillData> = {};

    // 聚合每个领域的优势
    strengths.forEach((strength) => {
      const area = strength.category_or_area || "未分类";
      const confidence = strength.confidence || 0.5; // 默认值0.5

      if (!skillMap[area]) {
        skillMap[area] = {
          area,
          value: confidence,
          count: 1,
          strengthIds: [strength.id],
          fullMark: 1, // 满分为1
        };
      } else {
        skillMap[area].value += confidence;
        skillMap[area].count += 1;
        skillMap[area].strengthIds.push(strength.id);
      }
    });

    // 计算每个领域的平均置信度
    return Object.values(skillMap)
      .map((skill) => ({
        ...skill,
        value: Math.min(1, skill.value / skill.count), // 确保不超过1
      }))
      .sort((a, b) => b.value - a.value); // 按技能值从高到低排序
  }, [strengths]);

  // 自定义工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-card p-3 text-sm shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getSkillColor(data.value) }}
            />
            <p className="font-medium">{data.area}</p>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <p className="text-sm text-muted-foreground">
              熟练度:{" "}
              <span className="font-semibold">
                {(data.value * 100).toFixed(0)}%
              </span>
            </p>
            <Badge variant="outline" className="text-xs">
              {getSkillLevel(data.value)}
            </Badge>
          </div>

          <div className="h-1.5 w-full bg-muted mt-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${data.value * 100}%`,
                backgroundColor: getSkillColor(data.value),
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            相关优势: {data.count}项
          </p>
        </div>
      );
    }
    return null;
  };

  // 技能等级定义
  const getSkillLevel = (value: number): string => {
    if (value >= 0.9) return "专家";
    if (value >= 0.75) return "熟练";
    if (value >= 0.6) return "中级";
    if (value >= 0.4) return "入门";
    return "了解";
  };

  // 获取技能颜色
  const getSkillColor = (value: number): string => {
    if (value >= 0.9) return "#10b981"; // 绿色 - 专家
    if (value >= 0.75) return "#2563eb"; // 蓝色 - 熟练
    if (value >= 0.6) return "#f59e0b"; // 橙色 - 中级
    if (value >= 0.4) return "#8b5cf6"; // 紫色 - 入门
    return "#6b7280"; // 灰色 - 了解
  };

  // 处理技能标签点击
  const handleSkillClick = (area: string) => {
    setSelectedArea(selectedArea === area ? null : area);
  };

  // 高亮显示或常规显示
  const isHighlighted = (area: string) => {
    return selectedArea === area || (hoveredArea === area && !selectedArea);
  };

  // 如果没有数据，显示提示信息
  if (!processedData.length) {
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
      <CardHeader className="pb-[18px]">
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="pt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {processedData.map((skill) => (
            <Badge
              key={skill.area}
              variant={isHighlighted(skill.area) ? "default" : "outline"}
              style={{
                borderColor: getSkillColor(skill.value),
                backgroundColor: isHighlighted(skill.area)
                  ? getSkillColor(skill.value)
                  : "transparent",
                cursor: "pointer",
              }}
              className={cn(
                "transition-all",
                isHighlighted(skill.area) ? "shadow-sm scale-105" : "opacity-80"
              )}
              onMouseEnter={() => setHoveredArea(skill.area)}
              onMouseLeave={() => setHoveredArea(null)}
              onClick={() => handleSkillClick(skill.area)}
            >
              {skill.area}: {getSkillLevel(skill.value)}
              {skill.value >= 0.9 && (
                <ChevronsUpIcon className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%" key={animationKey}>
            <RadarChart data={processedData} outerRadius="70%">
              <PolarGrid
                strokeDasharray="0"
                gridType="polygon"
                strokeOpacity={0.8}
                strokeWidth={1}
                radialLines={true}
                polarRadius={[0, 20, 40, 60, 80, 100]}
              />
              <PolarAngleAxis
                dataKey="area"
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 1]}
                tick={false}
                axisLine={false}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="技能水平"
                dataKey="value"
                stroke={
                  selectedArea ? "rgba(var(--primary), 0.5)" : "var(--primary)"
                }
                fill="var(--primary)"
                fillOpacity={0.3}
                activeDot={{
                  r: 6,
                  strokeWidth: 1,
                  stroke: "#fff",
                  className: "animate-pulse",
                }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
              {/* 如果有选中的技能，添加额外的雷达图层高亮显示 */}
              {selectedArea && (
                <Radar
                  name="高亮技能"
                  dataKey={(entry) =>
                    entry.area === selectedArea ? entry.value : 0
                  }
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.6}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 添加技能统计概览 */}
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center rounded-lg border p-2">
            <span className="text-xs text-muted-foreground">领域总数</span>
            <span className="font-semibold text-lg">
              {processedData.length}
            </span>
          </div>
          <div className="flex flex-col items-center rounded-lg border p-2">
            <span className="text-xs text-muted-foreground">最高熟练度</span>
            <span className="font-semibold text-lg">
              {processedData.length > 0 && processedData[0]
                ? `${(processedData[0].value * 100).toFixed(0)}%`
                : "0%"}
            </span>
          </div>
          <div className="flex flex-col items-center rounded-lg border p-2">
            <span className="text-xs text-muted-foreground">专家领域</span>
            <span className="font-semibold text-lg">
              {processedData.filter((s) => s.value >= 0.9).length}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1">
          <InfoIcon className="h-3 w-3" />
          <span>从内到外：了解 → 入门 → 中级 → 熟练 → 专家</span>
        </div>
        <div>
          <span>点击标签可选择特定技能领域</span>
        </div>
      </CardFooter>
    </Card>
  );
}
