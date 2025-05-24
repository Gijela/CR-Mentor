import React, { useState } from "react";
import {
  BriefcaseIcon,
  AlertTriangleIcon,
  BookOpenTextIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 定义卡片主题颜色
const cardThemes = {
  strengths: {
    main: "#4f46e5", // 靛蓝色
    positive: "#10b981", // 绿色
    negative: "#ef4444", // 红色
  },
  issues: {
    main: "#f97316", // 橙色
    positive: "#10b981", // 绿色
    negative: "#ef4444", // 红色
  },
  knowledge: {
    main: "#8b5cf6", // 紫色
    positive: "#10b981", // 绿色
    negative: "#ef4444", // 红色
  },
};

// Define the KpiSummary interface based on the backend service
interface KpiSummary {
  strengthsOverview: {
    totalCount: number;
    topCategory: { name: string; count: number };
  };
  issuesOverview: {
    activeCount: number;
    topCategory: { name: string; count: number };
  };
  knowledgeBaseStats: {
    totalSnippets: number;
    topTopic: { name: string; count: number };
  };
  recentActivity: {
    latestInsight: {
      description: string | null;
      category: string | null;
      timestamp: string | null;
    };
    latestKnowledge: { summary: string | null; timestamp: string | null };
  };
}

// 趋势数据模拟
interface TrendData {
  name: string;
  value: number;
}

// 生成模拟的趋势数据
const generateTrendData = (
  count: number,
  isPositive: boolean = true
): TrendData[] => {
  const data: TrendData[] = [];
  let lastValue = Math.floor(Math.random() * 20) + 10;

  for (let i = 0; i < count; i++) {
    const change = Math.floor(Math.random() * 5) * (isPositive ? 1 : -1);
    lastValue = Math.max(5, lastValue + change);
    data.push({ name: `${i}`, value: lastValue });
  }

  return data;
};

interface SectionCardsProps {
  kpiData?: KpiSummary; // Make kpiData optional to handle loading state
}

export function SectionCards({ kpiData }: SectionCardsProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // 为各卡片生成模拟趋势数据
  const strengthsTrendData = generateTrendData(10, true);
  const issuesTrendData = generateTrendData(10, false);
  const knowledgeTrendData = generateTrendData(10, true);

  // 计算趋势百分比变化
  const calculateTrendPercentage = (data: TrendData[]): number => {
    if (data.length < 2) return 0;
    const first = data[0].value;
    const last = data[data.length - 1].value;
    return Math.round(((last - first) / first) * 100);
  };

  const strengthsTrend = calculateTrendPercentage(strengthsTrendData);
  const issuesTrend = calculateTrendPercentage(issuesTrendData);
  const knowledgeTrend = calculateTrendPercentage(knowledgeTrendData);

  const cardCommonClasses =
    "@container/card flex-1 cursor-pointer transition-all duration-200";
  const cardHeaderCommonClasses = "relative";
  const cardTitleCommonClasses =
    "@[250px]/card:text-3xl text-2xl font-semibold tabular-nums";
  const cardFooterCommonClasses = "flex-col items-start gap-1 text-sm";
  const cardFooterLine1Classes =
    "line-clamp-2 flex gap-2 font-medium items-center"; // Allow two lines for longer category names
  const cardFooterLine2Classes = "text-muted-foreground line-clamp-1";

  // Default values for when kpiData is not available
  const defaultStrengths = {
    totalCount: 0,
    topCategory: { name: "N/A", count: 0 },
  };
  const defaultIssues = {
    activeCount: 0,
    topCategory: { name: "N/A", count: 0 },
  };
  const defaultKnowledge = {
    totalSnippets: 0,
    topTopic: { name: "N/A", count: 0 },
  };

  const strengths = kpiData?.strengthsOverview || defaultStrengths;
  const issues = kpiData?.issuesOverview || defaultIssues;
  const knowledge = kpiData?.knowledgeBaseStats || defaultKnowledge;

  // 处理卡片点击
  const handleCardClick = (cardId: string) => {
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  // 安全获取百分比趋势颜色
  const getTrendColor = (
    cardType: "strengths" | "issues" | "knowledge",
    trend: number,
    isIssue = false
  ) => {
    const themes = cardThemes[cardType];
    // 对于问题卡片，趋势下降是好的；对于其他卡片，趋势上升是好的
    const isPositive = isIssue ? trend <= 0 : trend >= 0;
    return {
      color: isPositive ? themes.positive : themes.negative,
      borderColor: isPositive ? themes.positive : themes.negative,
    };
  };

  return (
    <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <Card
        className={`${cardCommonClasses} ${
          activeCard === "strengths" ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => handleCardClick("strengths")}
      >
        <CardHeader className={cardHeaderCommonClasses}>
          <CardDescription>技术优势概览</CardDescription>
          <CardTitle className={cardTitleCommonClasses}>
            {strengths.totalCount}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className="flex gap-1 rounded-lg text-xs"
              style={getTrendColor("strengths", strengthsTrend)}
            >
              {strengthsTrend >= 0 ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
              {strengthsTrend >= 0 ? "+" : ""}
              {strengthsTrend}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-6 pt-0">
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={strengthsTrendData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="strengthsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={cardThemes.strengths.main}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={cardThemes.strengths.main}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={cardThemes.strengths.main}
                  fill="url(#strengthsGradient)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className={cardFooterCommonClasses}>
          <div className={cardFooterLine1Classes}>
            <BriefcaseIcon
              className="size-4"
              style={{ color: cardThemes.strengths.main }}
            />{" "}
            主要领域: {strengths.topCategory?.name || "未知"}
          </div>
          <div className={cardFooterLine2Classes}>
            数量: {strengths.topCategory?.count || 0}
          </div>
        </CardFooter>
      </Card>

      <Card
        className={`${cardCommonClasses} ${
          activeCard === "issues" ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => handleCardClick("issues")}
      >
        <CardHeader className={cardHeaderCommonClasses}>
          <CardDescription>活跃问题</CardDescription>
          <CardTitle className={cardTitleCommonClasses}>
            {issues.activeCount}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className="flex gap-1 rounded-lg text-xs"
              style={getTrendColor("issues", issuesTrend, true)}
            >
              {issuesTrend <= 0 ? (
                <TrendingDownIcon className="size-3" />
              ) : (
                <TrendingUpIcon className="size-3" />
              )}
              {issuesTrend >= 0 ? "+" : ""}
              {issuesTrend}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-6 pt-0">
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={issuesTrendData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="issuesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={cardThemes.issues.main}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={cardThemes.issues.main}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={cardThemes.issues.main}
                  fill="url(#issuesGradient)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className={cardFooterCommonClasses}>
          <div className={cardFooterLine1Classes}>
            <AlertTriangleIcon
              className="size-4"
              style={{ color: cardThemes.issues.main }}
            />{" "}
            主要问题: {issues.topCategory?.name || "未知"}
          </div>
          <div className={cardFooterLine2Classes}>
            数量: {issues.topCategory?.count || 0}
          </div>
        </CardFooter>
      </Card>

      <Card
        className={`${cardCommonClasses} ${
          activeCard === "knowledge" ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => handleCardClick("knowledge")}
      >
        <CardHeader className={cardHeaderCommonClasses}>
          <CardDescription>知识片段</CardDescription>
          <CardTitle className={cardTitleCommonClasses}>
            {knowledge.totalSnippets}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className="flex gap-1 rounded-lg text-xs"
              style={getTrendColor("knowledge", knowledgeTrend)}
            >
              {knowledgeTrend >= 0 ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
              {knowledgeTrend >= 0 ? "+" : ""}
              {knowledgeTrend}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-6 pt-0">
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={knowledgeTrendData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="knowledgeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={cardThemes.knowledge.main}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={cardThemes.knowledge.main}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={cardThemes.knowledge.main}
                  fill="url(#knowledgeGradient)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className={cardFooterCommonClasses}>
          <div className={cardFooterLine1Classes}>
            <BookOpenTextIcon
              className="size-4"
              style={{ color: cardThemes.knowledge.main }}
            />{" "}
            主要主题: {knowledge.topTopic?.name || "未知"}
          </div>
          <div className={cardFooterLine2Classes}>
            数量: {knowledge.topTopic?.count || 0}
          </div>
        </CardFooter>
      </Card>

      {activeCard && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-4 right-4">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCard(null);
                  }}
                >
                  查看更多详情
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                点击查看
                {activeCard === "strengths"
                  ? "技术优势"
                  : activeCard === "issues"
                  ? "问题模式"
                  : "知识库"}
                详情
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
