import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpenIcon, InfoIcon, FilterIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { dashboardService } from "../services";
import type { TopicDistributionItem, KnowledgeMetadata } from "../services";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Pie, PieChart, Cell, Sector } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// 热图项接口
interface HeatmapItem {
  topic: string;
  count: number;
  percentage: number;
}

// 过滤器类型
interface TopicFilters {
  categories: string[];
  tags: string[];
  similarityThreshold: number;
}

// 知识热图属性接口
interface KnowledgeHeatmapProps {
  title?: string;
  description?: string;
  onTopicClick?: (topic: string) => void;
  onFilterChange?: (filters: TopicFilters) => void;
}

// 知识热图句柄接口
export interface KnowledgeHeatmapHandle {
  applyFilters: (filters: TopicFilters) => void;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
];

// 创建饼图配置
const chartConfig: ChartConfig = {
  count: {
    label: "数量",
  },
  topic1: {
    label: "主题1",
    color: "hsl(var(--chart-1))",
  },
  topic2: {
    label: "主题2",
    color: "hsl(var(--chart-2))",
  },
  topic3: {
    label: "主题3",
    color: "hsl(var(--chart-3))",
  },
  topic4: {
    label: "主题4",
    color: "hsl(var(--chart-4))",
  },
  topic5: {
    label: "主题5",
    color: "hsl(var(--chart-5))",
  },
  topic6: {
    label: "主题6",
    color: "hsl(var(--chart-6))",
  },
  topic7: {
    label: "主题7",
    color: "hsl(var(--chart-7))",
  },
  topic8: {
    label: "主题8",
    color: "hsl(var(--chart-8))",
  },
  topic9: {
    label: "主题9",
    color: "hsl(var(--chart-9))",
  },
  topic10: {
    label: "主题10",
    color: "hsl(var(--chart-10))",
  },
};

// 自定义活动扇区渲染
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
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy - 5}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="text-sm font-medium"
      >
        {payload.topic}
      </text>
      <text
        x={cx}
        y={cy + 15}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="text-xs"
      >
        {payload.count} ({payload.percentage.toFixed(1)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

/**
 * 知识库覆盖热图组件
 * 展示不同知识主题的覆盖程度和分布情况
 */
export const KnowledgeHeatmap = forwardRef<
  KnowledgeHeatmapHandle,
  KnowledgeHeatmapProps
>(
  (
    {
      title = "知识库覆盖分布",
      description = "显示不同主题知识点的分布情况",
      onTopicClick,
      onFilterChange,
    },
    ref
  ) => {
    const [topics, setTopics] = useState<HeatmapItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { user } = useUser();

    // 过滤器相关状态
    const [filters, setFilters] = useState<TopicFilters>({
      categories: [],
      tags: [],
      similarityThreshold: 0.7,
    });
    const [availableCategories, setAvailableCategories] = useState<string[]>(
      []
    );
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

    // 公开方法给父组件
    useImperativeHandle(ref, () => ({
      applyFilters: (newFilters: TopicFilters) => {
        setFilters(newFilters);
      },
    }));

    useEffect(() => {
      // 加载知识库主题分布数据
      const fetchTopicDistribution = async () => {
        if (!user?.username) return;

        setLoading(true);
        setError(null);

        try {
          // 获取知识主题分布数据
          const topicsData =
            await dashboardService.getKnowledgeTopicDistribution(user.username);

          if (topicsData && topicsData.length > 0) {
            // 按数量排序
            const sortedTopics = topicsData.sort(
              (a: HeatmapItem, b: HeatmapItem) => b.count - a.count
            );
            setTopics(sortedTopics);
          } else {
            console.warn("获取知识主题分布失败: 无数据");
            // 使用模拟数据作为备选
            setTopics(getSampleTopics());
          }
        } catch (err) {
          console.error("加载知识主题分布错误:", err);
          setError("无法加载知识主题分布数据");
          // 使用模拟数据作为备选
          setTopics(getSampleTopics());
        } finally {
          setLoading(false);
        }
      };

      fetchTopicDistribution();
    }, [user?.username]);

    // 加载可用的分类和标签
    useEffect(() => {
      const loadMetadata = async () => {
        if (!user?.username) return;

        setIsLoadingMetadata(true);
        try {
          const result = await dashboardService.getKnowledgeMetadata(
            user.username
          );
          if (result.success && result.data) {
            setAvailableCategories(result.data.categories);
            setAvailableTags(result.data.tags);
          } else {
            console.warn("无法加载知识元数据:", result.message);
            // 使用默认分类
            setAvailableCategories([
              "React",
              "TypeScript",
              "组件设计",
              "状态管理",
              "性能优化",
            ]);
            setAvailableTags([
              "hooks",
              "类型安全",
              "最佳实践",
              "性能优化",
              "架构",
            ]);
          }
        } catch (error) {
          console.error("加载元数据错误:", error);
          // 使用默认分类
          setAvailableCategories([
            "React",
            "TypeScript",
            "组件设计",
            "状态管理",
            "性能优化",
          ]);
          setAvailableTags([
            "hooks",
            "类型安全",
            "最佳实践",
            "性能优化",
            "架构",
          ]);
        } finally {
          setIsLoadingMetadata(false);
        }
      };

      loadMetadata();
    }, [user?.username]);

    // 当过滤器更改时通知父组件
    useEffect(() => {
      if (onFilterChange) {
        onFilterChange(filters);
      }
    }, [filters, onFilterChange]);

    // 模拟主题分布数据
    const getSampleTopics = (): HeatmapItem[] => {
      return [
        { topic: "React", count: 24, percentage: 28.2 },
        { topic: "TypeScript", count: 18, percentage: 21.2 },
        { topic: "状态管理", count: 12, percentage: 14.1 },
        { topic: "性能优化", count: 10, percentage: 11.8 },
        { topic: "组件设计", count: 8, percentage: 9.4 },
        { topic: "API集成", count: 5, percentage: 5.9 },
        { topic: "测试策略", count: 4, percentage: 4.7 },
        { topic: "CSS技巧", count: 3, percentage: 3.5 },
        { topic: "安全实践", count: 1, percentage: 1.2 },
      ];
    };

    // 处理应用过滤器
    const handleApplyFilters = () => {
      if (onFilterChange) {
        onFilterChange(filters);
      }
      toast.success("已应用过滤器");
    };

    // 处理饼图扇区点击
    const handlePieClick = (data: any, index: number) => {
      setActiveIndex(activeIndex === index ? null : index);
      if (onTopicClick) {
        onTopicClick(data.topic);
      }
    };

    // 处理饼图扇区鼠标进入
    const handlePieEnter = (_: any, index: number) => {
      setActiveIndex(index);
    };

    if (loading) {
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
      );
    }

    if (error || !topics.length) {
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            <p className="text-center text-muted-foreground">
              {error || "暂无知识库数据"}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>

            {/* 添加过滤器按钮 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <FilterIcon className="h-4 w-4" />
                  过滤器
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>知识库过滤器</SheetTitle>
                  <SheetDescription>
                    设置过滤条件查看不同主题分布
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-4">
                  {isLoadingMetadata ? (
                    <div className="flex h-40 items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">技术领域</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {availableCategories.map((category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`filter-category-${category}`}
                                checked={filters.categories.includes(category)}
                                onCheckedChange={(checked) => {
                                  setFilters((prev) => ({
                                    ...prev,
                                    categories: checked
                                      ? [...prev.categories, category]
                                      : prev.categories.filter(
                                          (c) => c !== category
                                        ),
                                  }));
                                }}
                              />
                              <Label htmlFor={`filter-category-${category}`}>
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {availableTags.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">标签</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {availableTags.slice(0, 10).map((tag) => (
                                <div
                                  key={tag}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`filter-tag-${tag}`}
                                    checked={filters.tags.includes(tag)}
                                    onCheckedChange={(checked) => {
                                      setFilters((prev) => ({
                                        ...prev,
                                        tags: checked
                                          ? [...prev.tags, tag]
                                          : prev.tags.filter((t) => t !== tag),
                                      }));
                                    }}
                                  />
                                  <Label htmlFor={`filter-tag-${tag}`}>
                                    {tag}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <Separator />
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">相似度阈值</h3>
                        <div className="px-1">
                          <Slider
                            value={[filters.similarityThreshold * 100]}
                            min={50}
                            max={95}
                            step={5}
                            onValueChange={(value) => {
                              if (value && value.length > 0) {
                                const newValue = value[0] || 70;
                                setFilters((prev) => ({
                                  ...prev,
                                  similarityThreshold: newValue / 100,
                                }));
                              }
                            }}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>50%</span>
                            <span>{filters.similarityThreshold * 100}%</span>
                            <span>95%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <SheetFooter className="mt-auto pt-4">
                  <SheetClose asChild>
                    <Button onClick={handleApplyFilters} className="w-full">
                      应用过滤器
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[320px]"
          >
            <PieChart>
              <Pie
                data={topics}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
                nameKey="topic"
                onMouseEnter={handlePieEnter}
                onClick={handlePieClick}
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
              >
                {topics.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <Badge
                key={topic.topic}
                variant="outline"
                className="cursor-pointer"
                style={{ borderColor: COLORS[index % COLORS.length] }}
                onClick={() => {
                  setActiveIndex(index);
                  if (onTopicClick) onTopicClick(topic.topic);
                }}
              >
                {topic.topic} ({topic.percentage.toFixed(1)}%)
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              点击主题可以筛选相关知识片段
            </span>
          </div>

          {/* 显示当前过滤条件 */}
          {(filters.categories.length > 0 || filters.tags.length > 0) && (
            <div className="mt-4 rounded-md border border-dashed border-muted-foreground/30 p-3">
              <h4 className="mb-2 text-sm font-medium">当前过滤条件</h4>
              {filters.categories.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">
                    技术领域:{" "}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {filters.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {filters.tags.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">标签: </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {filters.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-2 text-xs text-muted-foreground">
                相似度阈值: {filters.similarityThreshold * 100}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

KnowledgeHeatmap.displayName = "KnowledgeHeatmap";
