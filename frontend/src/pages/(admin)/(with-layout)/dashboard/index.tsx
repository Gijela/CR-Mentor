import React, { useEffect, useState } from "react";
// import { redirect } from "react-router-dom"

import { ChartAreaInteractive } from "./components/ChartAreaInteractive";
import type { TransformedChartDataItem } from "./components/ChartAreaInteractive";
import { DataTable } from "./components/DataTable";
import type { IssueItem, StrengthItem } from "./components/DataTable";
import { KnowledgeSearch } from "./components/KnowledgeSearch";
import type { KnowledgeSnippet } from "./components/KnowledgeSearch";
import { SkillRadarChart } from "./components/SkillRadarChart";
import { SkillTrendChart } from "./components/SkillTrendChart";
import { SkillNetworkGraph } from "./components/SkillNetworkGraph";
import { SectionCards } from "./components/SectionCards";
import { DashboardExport } from "./components/DashboardExport";
import type { ChartConfig } from "@/components/ui/chart";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useUser } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// export const loader = () => redirect(`/repository`)

// Define KpiSummary interface (can be moved to a shared types file)
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

interface KpiSummaryResponse {
  success: boolean;
  data?: KpiSummary;
  message?: string;
}

// Define InsightTrendsData interface (can be moved to a shared types file)
interface InsightTrendsData {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
}

interface InsightTrendsApiResponseData extends InsightTrendsData {
  period: string;
  granularity: string;
}

interface InsightTrendsResponse {
  success: boolean;
  data?: InsightTrendsApiResponseData;
  message?: string;
}

// Define PaginatedResult for issues (can be moved to a shared types file)
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface PaginatedIssuesResponse {
  success: boolean;
  data?: IssueItem[];
  pagination?: PaginationInfo;
  message?: string;
}

// Define PaginatedStrengthsResponse
interface PaginatedStrengthsResponse {
  success: boolean;
  data?: StrengthItem[];
  pagination?: PaginationInfo;
  message?: string;
}

// Helper function to transform InsightTrendsData for the chart component
const transformInsightTrends = (
  apiData: InsightTrendsData
): { chartData: TransformedChartDataItem[]; chartConfig: ChartConfig } => {
  if (!apiData || !apiData.labels || !apiData.datasets) {
    return { chartData: [], chartConfig: {} };
  }

  const transformedData: TransformedChartDataItem[] = apiData.labels.map(
    (label, index) => {
      const dataPoint: TransformedChartDataItem = { date: label };
      apiData.datasets.forEach((dataset) => {
        // Sanitize label to be a valid JS identifier for seriesKey
        const seriesKey = dataset.label.toLowerCase().replace(/\s+/g, "_");
        dataPoint[seriesKey] = dataset.data[index] || 0;
      });
      return dataPoint;
    }
  );

  const config: ChartConfig = {};
  apiData.datasets.forEach((dataset, index) => {
    const seriesKey = dataset.label.toLowerCase().replace(/\s+/g, "_");
    config[seriesKey] = {
      label: dataset.label,
      color: `hsl(var(--chart-${index + 1}))`, // Cycle through chart colors
    };
  });

  return { chartData: transformedData, chartConfig: config };
};

export function Component() {
  const [kpiData, setKpiData] = useState<KpiSummary | undefined>(undefined);
  const [insightTrends, setInsightTrends] = useState<{
    chartData: TransformedChartDataItem[];
    chartConfig: ChartConfig;
  }>({ chartData: [], chartConfig: {} });
  const [issuesData, setIssuesData] = useState<IssueItem[]>([]);
  const [strengthsData, setStrengthsData] = useState<StrengthItem[]>([]);
  const [issuesPagination, setIssuesPagination] = useState<
    PaginationInfo | undefined
  >(undefined);
  const [strengthsPagination, setStrengthsPagination] = useState<
    PaginationInfo | undefined
  >(undefined);
  const [activeTab, setActiveTab] = useState("outline");
  const [dashboardTab, setDashboardTab] = useState("insights");
  // Add loading and error states as needed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [searchResults, setSearchResults] = useState<KnowledgeSnippet[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Fetch KPI Summary
        const kpiRes = await fetch(
          `${
            import.meta.env.VITE_SERVER_HOST
          }/developers/dashboard/kpi-summary`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ developer_id: user?.username }),
          }
        );
        const kpiResult: KpiSummaryResponse = await kpiRes.json();
        if (!kpiRes.ok || !kpiResult.success || !kpiResult.data) {
          // Added kpiRes.ok check
          throw new Error(
            kpiResult.message ||
              `Failed to fetch KPI summary (HTTP ${kpiRes.status})`
          );
        }
        setKpiData(kpiResult?.data || {});

        // Fetch Insight Trends
        const trendsPayload = {
          developer_id: user?.username,
          period: "90d",
          granularity: "daily",
        };
        const trendsRes = await fetch(
          `${
            import.meta.env.VITE_SERVER_HOST
          }/developers/dashboard/insight-trends`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trendsPayload),
          }
        );
        const trendsResult: InsightTrendsResponse = await trendsRes.json();
        if (!trendsRes.ok || !trendsResult.success || !trendsResult.data) {
          // Added trendsRes.ok check
          throw new Error(
            trendsResult.message ||
              `Failed to fetch insight trends (HTTP ${trendsRes.status})`
          );
        }
        const { labels, datasets } = trendsResult.data;
        setInsightTrends(transformInsightTrends({ labels, datasets }) || {});

        // Fetch Issues Data
        const issuesPayload = {
          developer_id: user?.username,
          page: 1,
          limit: 10,
          sortBy: "last_seen_at",
          sortOrder: "desc",
        };
        const issuesRes = await fetch(
          `${import.meta.env.VITE_SERVER_HOST}/developers/profile/issues`,
          {
            // Updated URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(issuesPayload),
          }
        );
        const issuesResult: PaginatedIssuesResponse = await issuesRes.json();
        if (
          !issuesRes.ok ||
          !issuesResult.success ||
          !issuesResult.data ||
          !issuesResult.pagination
        ) {
          // Added issuesRes.ok check
          throw new Error(
            issuesResult.message ||
              `Failed to fetch issues (HTTP ${issuesRes.status})`
          );
        }
        setIssuesData(issuesResult?.data || []);
        setIssuesPagination(issuesResult?.pagination || {});

        // Fetch Strengths Data
        try {
          const strengthsPayload = {
            developer_id: user?.username,
            page: 1,
            limit: 10,
            sortBy: "confidence", // 或其他适合的排序
            sortOrder: "desc",
          };

          // 注意：这个API是我们假设将来会实现的，实际上可能还不存在
          const strengthsRes = await fetch(
            `${import.meta.env.VITE_SERVER_HOST}/developers/profile/strengths`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(strengthsPayload),
            }
          );

          if (strengthsRes.ok) {
            const strengthsResult: PaginatedStrengthsResponse =
              await strengthsRes.json();
            if (strengthsResult.success && strengthsResult.data) {
              setStrengthsData(strengthsResult.data);
              setStrengthsPagination(strengthsResult.pagination);
            } else {
              console.warn(
                "Strengths API returned error:",
                strengthsResult.message
              );
              // 使用样例数据作为备用
              setStrengthsData(getSampleStrengthsData(user.username));
            }
          } else {
            console.warn(
              "Strengths API failed with status:",
              strengthsRes.status
            );
            // 使用样例数据作为备用
            setStrengthsData(getSampleStrengthsData(user.username));
          }
        } catch (e) {
          console.warn("Error fetching strengths:", e);
          // 使用样例数据作为备用
          setStrengthsData(getSampleStrengthsData(user.username));
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Failed to fetch dashboard data:", errorMessage, e);
      }
      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]);
  // When page, limit, sortBy, etc., for issues/trends become dynamic state variables, add them to the dependency array.

  // 创建示例 strengths 数据的辅助函数
  function getSampleStrengthsData(developerId: string): StrengthItem[] {
    const now = new Date().toISOString();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return [
      {
        id: "s1",
        description: "深入掌握 React 状态管理和优化技巧",
        category_or_area: "React",
        confidence: 0.95,
        related_prs: [`github.com/${developerId}/project-a/pull/123`],
        first_seen_at: oneMonthAgo.toISOString(),
        last_seen_at: now,
      },
      {
        id: "s2",
        description: "构建可复用、高性能的组件",
        category_or_area: "组件设计",
        confidence: 0.88,
        related_prs: [`github.com/${developerId}/project-b/pull/45`],
        first_seen_at: oneMonthAgo.toISOString(),
        last_seen_at: now,
      },
      {
        id: "s3",
        description: "TypeScript 类型定义和泛型使用",
        category_or_area: "TypeScript",
        confidence: 0.85,
        related_prs: [`github.com/${developerId}/project-c/pull/67`],
        first_seen_at: oneMonthAgo.toISOString(),
        last_seen_at: now,
      },
    ];
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  // 根据激活的标签页决定传递哪种数据
  const tableData = activeTab === "outline" ? issuesData : strengthsData;

  // 处理标签页变更
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <Tabs
                value={dashboardTab}
                onValueChange={setDashboardTab}
                className="w-full"
              >
                <div className="flex items-center justify-between border-b">
                  <TabsList className="w-fit justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="insights"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                    >
                      开发者洞察
                    </TabsTrigger>
                    <TabsTrigger
                      value="knowledge"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                    >
                      知识库搜索
                    </TabsTrigger>
                    <TabsTrigger
                      value="visualization"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                    >
                      技能可视化
                    </TabsTrigger>
                  </TabsList>

                  <div className="pr-4">
                    <DashboardExport
                      data={{
                        issues: issuesData,
                        strengths: strengthsData,
                        knowledgeSnippets: searchResults,
                        metadata: {
                          exportedAt: new Date().toISOString(),
                          developerId: user?.username || "unknown",
                          totalIssues: issuesData.length,
                          totalStrengths: strengthsData.length,
                          totalKnowledgeSnippets: searchResults.length,
                        },
                      }}
                      filename={`cr-mentor-${user?.username}-dashboard`}
                    />
                  </div>
                </div>

                <TabsContent value="insights" className="mt-0 pt-4">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <SectionCards kpiData={kpiData} />
                    <ChartAreaInteractive
                      chartData={insightTrends.chartData}
                      chartConfig={insightTrends.chartConfig}
                      title="开发者洞察趋势"
                      description="追踪开发者的优势和问题变化趋势。"
                    />
                    <DataTable
                      data={tableData}
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="knowledge" className="mt-0 pt-4">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                      <div className="col-span-1">
                        <h2 className="mb-4 text-2xl font-bold">
                          知识库语义搜索
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                          使用自然语言搜索开发者相关的知识片段，发现编程技巧和解决方案。
                        </p>
                        <KnowledgeSearch onSearchResults={setSearchResults} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="visualization" className="mt-0 pt-4">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                      <div className="col-span-1 lg:col-span-2">
                        <h2 className="mb-4 text-2xl font-bold">
                          技能可视化分析
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                          以可视化方式分析开发者的技能分布和专长领域。
                        </p>
                      </div>

                      <div className="col-span-1">
                        <SkillRadarChart
                          strengths={strengthsData}
                          title="技术领域覆盖"
                          description="显示开发者在各技术领域的专长水平"
                        />
                      </div>

                      <div className="col-span-1">
                        <SkillTrendChart
                          strengths={strengthsData}
                          title="技能发展趋势"
                          description="显示开发者技能水平随时间的变化"
                        />
                      </div>

                      <div className="col-span-1 lg:col-span-2">
                        <SkillNetworkGraph
                          strengths={strengthsData}
                          title="技能关联网络"
                          description="显示不同技能领域之间的关联关系"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
