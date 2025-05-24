import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  FilterIcon,
  XIcon,
  BarChart2Icon,
  HistoryIcon,
  ClockIcon,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useUser } from "@clerk/clerk-react";
import {
  dashboardService,
  type KnowledgeSnippet,
  type KnowledgeMetadata,
} from "../services";
import { SemanticRelevanceVisualizer } from "./SemanticRelevanceVisualizer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 搜索过滤器类型
interface SearchFilters {
  categories: string[];
  tags: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  similarityThreshold: number;
}

// 搜索历史记录项类型
interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  filters?: {
    categories?: string[];
    tags?: string[];
    similarityThreshold?: number;
  };
}

// 搜索组件接口
interface KnowledgeSearchProps {
  onSearchResults?: (results: KnowledgeSnippet[]) => void;
}

// 搜索组件
export function KnowledgeSearch({ onSearchResults }: KnowledgeSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<KnowledgeSnippet[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    tags: [],
    dateRange: { start: null, end: null },
    similarityThreshold: 0.7,
  });
  const [activeTab, setActiveTab] = useState("results");
  const [selectedSnippet, setSelectedSnippet] =
    useState<KnowledgeSnippet | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const { user } = useUser();
  const [associateDialogOpen, setAssociateDialogOpen] = useState(false);
  const [associationType, setAssociationType] = useState<"strength" | "issue">(
    "strength"
  );
  const [isAssociating, setIsAssociating] = useState(false);

  // 搜索历史相关状态
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistoryPopover, setShowHistoryPopover] = useState(false);

  // 加载搜索历史
  useEffect(() => {
    if (user?.username) {
      loadSearchHistory();
    }
  }, [user?.username]);

  // 初始加载知识片段 - 新增
  useEffect(() => {
    // 在组件挂载时自动加载知识片段
    const loadInitialSnippets = async () => {
      if (!user?.username) return;

      setIsSearching(true);
      try {
        // 获取全部知识片段，不带查询词
        const result = await dashboardService.getKnowledgeSnippets(
          user.username
        );

        if (result.success && result.data) {
          // 智能转换数据格式，能够处理不同的API返回格式
          const formattedData = result.data.map((item: any) => {
            // 检查是否已经符合KnowledgeSnippet格式
            if (item.content && item.category !== undefined) {
              // 已经是标准格式，只需确保id是字符串类型
              return {
                ...item,
                id: String(item.id),
                tags: item.tags || [],
                similarity_score: item.similarity_score || 1.0,
              };
            } else {
              // 需要从content_summary/topic/source_pr转换
              return {
                id: String(item.id),
                content: item.content_summary || "",
                summary: item.content_summary || "",
                category: item.topic || "未分类",
                tags: [],
                source: item.source_pr || "",
                created_at: item.created_at,
                updated_at: item.created_at,
                similarity_score: item.similarity_score || 1.0,
              };
            }
          });

          console.log("初始知识片段转换后的数据:", formattedData);
          setSearchResults(formattedData);
          if (onSearchResults) {
            onSearchResults(formattedData);
          }
        } else {
          console.warn("加载初始知识片段失败:", result.message);
          // 使用模拟数据作为备选
          const mockResults = getSampleResults();
          setSearchResults(mockResults);
          if (onSearchResults) {
            onSearchResults(mockResults);
          }
        }
      } catch (error) {
        console.error("加载初始知识片段错误:", error);
        // 使用模拟数据作为备选
        const mockResults = getSampleResults();
        setSearchResults(mockResults);
        if (onSearchResults) {
          onSearchResults(mockResults);
        }
      } finally {
        setIsSearching(false);
      }
    };

    loadInitialSnippets();
  }, [user?.username, onSearchResults]);

  // 从本地存储加载搜索历史
  const loadSearchHistory = () => {
    if (!user?.username) return;

    try {
      const key = `knowledge-search-history-${user.username}`;
      const storedHistory = localStorage.getItem(key);

      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory) as SearchHistoryItem[];
        // 仅保留最近10条记录
        setSearchHistory(parsedHistory.slice(0, 10));
      }
    } catch (error) {
      console.error("加载搜索历史失败:", error);
    }
  };

  // 保存搜索历史
  const saveSearchHistory = (query: string, resultsCount: number) => {
    if (!user?.username || !query.trim()) return;

    try {
      const key = `knowledge-search-history-${user.username}`;
      const newHistoryItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query,
        timestamp: new Date().toISOString(),
        resultsCount,
        filters: {
          categories:
            filters.categories.length > 0 ? [...filters.categories] : undefined,
          tags: filters.tags.length > 0 ? [...filters.tags] : undefined,
          similarityThreshold: filters.similarityThreshold,
        },
      };

      const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem(key, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("保存搜索历史失败:", error);
    }
  };

  // 使用历史搜索
  const useHistorySearch = (historyItem: SearchHistoryItem) => {
    setSearchQuery(historyItem.query);

    // 应用历史过滤器
    if (historyItem.filters) {
      setFilters({
        categories: historyItem.filters.categories || [],
        tags: historyItem.filters.tags || [],
        dateRange: { start: null, end: null },
        similarityThreshold: historyItem.filters.similarityThreshold || 0.7,
      });
    }

    setShowHistoryPopover(false);

    // 自动执行搜索
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    if (!user?.username) return;

    try {
      const key = `knowledge-search-history-${user.username}`;
      localStorage.removeItem(key);
      setSearchHistory([]);
      toast.success("搜索历史已清除");
    } catch (error) {
      console.error("清除搜索历史失败:", error);
    }
  };

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
        setAvailableTags(["hooks", "类型安全", "最佳实践", "性能优化", "架构"]);
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    loadMetadata();
  }, [user?.username]);

  // 处理搜索函数
  const handleSearch = async () => {
    if (!searchQuery.trim() || !user?.username) {
      toast.error("请输入搜索内容");
      return;
    }

    setIsSearching(true);
    setActiveTab("results");

    try {
      // 准备日期过滤器
      let dateRange: { start: string; end?: string } | undefined;
      if (filters.dateRange.start) {
        dateRange = {
          start: filters.dateRange.start.toISOString(),
        };
        if (filters.dateRange.end) {
          dateRange.end = filters.dateRange.end.toISOString();
        }
      }

      // 准备过滤器参数
      const searchFilters = {
        categories:
          filters.categories.length > 0 ? filters.categories : undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        date_range: dateRange,
        similarity_threshold: filters.similarityThreshold,
      };

      // 发送搜索请求
      const result = await dashboardService.searchKnowledge(
        searchQuery,
        user.username,
        searchFilters
      );

      if (result.success && result.data) {
        // 智能转换数据格式，能够处理不同的API返回格式
        const formattedData = result.data.map((item: any) => {
          // 检查是否已经符合KnowledgeSnippet格式
          if (item.content && item.category !== undefined) {
            // 已经是标准格式，只需确保id是字符串类型
            return {
              ...item,
              id: String(item.id),
              tags: item.tags || [],
              similarity_score: item.similarity_score || 1.0,
            };
          } else {
            // 需要从content_summary/topic/source_pr转换
            return {
              id: String(item.id),
              content: item.content_summary || "",
              summary: item.content_summary || "",
              category: item.topic || "未分类",
              tags: [],
              source: item.source_pr || "",
              created_at: item.created_at,
              updated_at: item.created_at,
              similarity_score: item.similarity_score || 1.0,
            };
          }
        });

        console.log("搜索结果转换后的数据:", formattedData);
        setSearchResults(formattedData);
        saveSearchHistory(searchQuery, formattedData.length);
        if (onSearchResults) {
          onSearchResults(formattedData);
        }
      } else {
        toast.error("搜索失败: " + result.message);
        // 使用模拟数据作为备选
        const mockResults = getSampleResults();
        setSearchResults(mockResults);
        if (onSearchResults) {
          onSearchResults(mockResults);
        }
      }
    } catch (error) {
      console.error("搜索失败:", error);
      toast.error("搜索失败，使用模拟数据");
      // 使用模拟数据作为备选
      const mockResults = getSampleResults();
      setSearchResults(mockResults);
      if (onSearchResults) {
        onSearchResults(mockResults);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // 获取示例结果数据
  const getSampleResults = (): KnowledgeSnippet[] => {
    return [
      {
        id: "ks1",
        content:
          "在React组件中，状态管理最佳实践包括：1) 使用局部状态管理简单UI状态；2) 使用Context API管理中等复杂度的应用状态；3) 对于复杂应用考虑使用Redux或MobX；4) 使用React Query或SWR处理服务器状态。避免过度使用全局状态，这会导致性能问题和难以维护的代码。",
        summary: "React状态管理最佳实践",
        category: "React",
        tags: ["状态管理", "性能优化", "架构"],
        created_at: new Date().toISOString(),
        similarity_score: 0.92,
      },
      {
        id: "ks2",
        content:
          "TypeScript中的泛型允许创建可重用的组件，支持多种数据类型。泛型的主要优势是在保持类型安全的同时提供灵活性。常见用例包括：1) 创建通用数据结构如数组、映射；2) 编写通用函数；3) 约束泛型参数；4) 在React组件中使用泛型提高组件的重用性。",
        summary: "TypeScript泛型使用指南",
        category: "TypeScript",
        tags: ["泛型", "类型安全", "高级类型"],
        created_at: new Date().toISOString(),
        similarity_score: 0.85,
      },
      {
        id: "ks3",
        content:
          "构建高性能React组件的关键策略：1) 使用React.memo避免不必要的重新渲染；2) 使用useCallback和useMemo缓存函数和计算值；3) 实现虚拟滚动处理大型列表；4) 懒加载组件和代码分割；5) 使用Web Workers处理CPU密集型任务；6) 优化Context使用，避免过度触发重新渲染。",
        summary: "React性能优化技巧",
        category: "React",
        tags: ["性能优化", "渲染优化", "最佳实践"],
        created_at: new Date().toISOString(),
        similarity_score: 0.78,
      },
    ];
  };

  // 查看知识片段详情
  const viewSnippetDetails = (snippet: KnowledgeSnippet) => {
    setSelectedSnippet(snippet);
    setActiveTab("details");
  };

  // 添加关联方法
  const handleAssociateKnowledge = async () => {
    if (!selectedSnippet || !user?.username) return;

    setIsAssociating(true);
    try {
      const result = await dashboardService.associateKnowledge(
        selectedSnippet.id,
        user.username,
        associationType
      );

      if (result.success) {
        toast.success(
          `成功将知识片段关联到开发者${
            associationType === "strength" ? "优势" : "问题"
          }资料`
        );
        setAssociateDialogOpen(false);
      } else {
        toast.error(`关联失败: ${result.message || "未知错误"}`);
      }
    } catch (error) {
      console.error("关联知识片段错误:", error);
      toast.error("关联过程中发生错误");
    } finally {
      setIsAssociating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="输入关键词或问题进行语义搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 搜索历史弹出框 */}
        <Popover open={showHistoryPopover} onOpenChange={setShowHistoryPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ClockIcon className="h-4 w-4" />
              {searchHistory.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {searchHistory.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">搜索历史</h3>
              {searchHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={clearSearchHistory}
                >
                  清除
                </Button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                暂无搜索历史
              </p>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {searchHistory.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm h-auto py-2"
                    onClick={() => useHistorySearch(item)}
                  >
                    <HistoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex flex-col items-start text-left">
                      <span className="line-clamp-1">{item.query}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()} ·{" "}
                        {item.resultsCount} 结果
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader>
              <SheetTitle>搜索过滤器</SheetTitle>
              <SheetDescription>设置过滤条件提高搜索精确度</SheetDescription>
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
                            id={`category-${category}`}
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
                          <Label htmlFor={`category-${category}`}>
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
                                id={`tag-${tag}`}
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
                              <Label htmlFor={`tag-${tag}`}>{tag}</Label>
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
                <Button onClick={handleSearch} className="w-full">
                  应用过滤器
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button onClick={handleSearch}>搜索</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">搜索结果</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedSnippet}>
            知识详情
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-4 flex-1">
          {isSearching ? (
            <div className="flex h-40 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.some((s) => s.similarity_score !== undefined) && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setShowVisualization(!showVisualization)}
                  >
                    <BarChart2Icon className="h-4 w-4" />
                    {showVisualization ? "隐藏" : "显示"}相关性分析
                  </Button>
                </div>
              )}

              {showVisualization && searchResults.length > 0 && (
                <SemanticRelevanceVisualizer
                  snippets={searchResults}
                  query={searchQuery}
                  onViewDetails={viewSnippetDetails}
                />
              )}

              {/* 添加搜索结果计数提示 */}
              <div className="text-sm text-muted-foreground">
                {searchQuery.trim()
                  ? `找到 ${searchResults.length} 条与"${searchQuery}"相关的知识片段`
                  : `显示全部 ${searchResults.length} 条知识片段`}
              </div>

              {searchResults.map((snippet) => (
                <Card key={snippet.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {snippet.summary}
                      </CardTitle>
                      {snippet.similarity_score && (
                        <Badge variant="outline" className="bg-primary/10">
                          相关度: {(snippet.similarity_score * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      <Badge variant="secondary">{snippet.category}</Badge>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {new Date(snippet.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-3">{snippet.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <div className="flex flex-wrap gap-1">
                      {(snippet.tags ?? []).slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(snippet.tags ?? []).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(snippet.tags ?? []).length - 3}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewSnippetDetails(snippet)}
                    >
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="flex h-40 flex-col items-center justify-center text-center text-muted-foreground">
              <p>未找到相关知识片段</p>
              <p className="text-sm">尝试使用不同的关键词或放宽过滤条件</p>
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center text-muted-foreground">
              <p>正在加载知识片段...</p>
              <p className="text-sm">或者输入关键词进行精确搜索</p>
              <Button
                onClick={() => handleSearch()}
                variant="outline"
                className="mt-2"
              >
                刷新
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="mt-4 flex-1">
          {selectedSnippet && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedSnippet.summary}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">
                          {selectedSnippet.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          创建于:{" "}
                          {new Date(
                            selectedSnippet.created_at
                          ).toLocaleDateString()}
                        </span>
                        {selectedSnippet.similarity_score && (
                          <Badge variant="outline" className="bg-primary/10">
                            相关度:{" "}
                            {(selectedSnippet.similarity_score * 100).toFixed(
                              0
                            )}
                            %
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("results")}
                  >
                    返回结果
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">完整内容</h3>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="whitespace-pre-line">
                        {selectedSnippet.content}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium">标签</h3>
                    <div className="flex flex-wrap gap-1">
                      {(selectedSnippet.tags ?? []).length > 0 ? (
                        (selectedSnippet.tags ?? []).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          无标签
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedSnippet.source && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium">来源</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedSnippet.source}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("results")}
                >
                  返回结果列表
                </Button>
                <Dialog
                  open={associateDialogOpen}
                  onOpenChange={setAssociateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      关联到开发者资料
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>关联知识片段</DialogTitle>
                      <DialogDescription>
                        将此知识片段关联到开发者的优势或问题资料中
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="associate-type">关联类型</Label>
                          <Select
                            value={associationType}
                            onValueChange={(value) =>
                              setAssociationType(value as "strength" | "issue")
                            }
                          >
                            <SelectTrigger id="associate-type">
                              <SelectValue placeholder="选择关联类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>关联类型</SelectLabel>
                                <SelectItem value="strength">
                                  开发者优势
                                </SelectItem>
                                <SelectItem value="issue">
                                  开发者问题
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm text-muted-foreground">
                            知识片段
                          </Label>
                          <div className="mt-1 rounded-md border p-2">
                            <p className="font-medium">
                              {selectedSnippet?.summary}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="secondary">
                                {selectedSnippet?.category}
                              </Badge>
                              {selectedSnippet?.similarity_score && (
                                <Badge
                                  variant="outline"
                                  className="bg-primary/10"
                                >
                                  相关度:{" "}
                                  {(
                                    selectedSnippet.similarity_score * 100
                                  ).toFixed(0)}
                                  %
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setAssociateDialogOpen(false)}
                      >
                        取消
                      </Button>
                      <Button
                        onClick={handleAssociateKnowledge}
                        disabled={isAssociating}
                      >
                        {isAssociating ? "关联中..." : "确认关联"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
