import React, { useEffect, useState } from "react";
// import { redirect } from "react-router-dom"

import { ChartAreaInteractive } from "./components/ChartAreaInteractive";
import type { TransformedChartDataItem } from "./components/ChartAreaInteractive";
import { DataTable } from "./components/DataTable";
import type { IssueItem } from "./components/DataTable";
import { SectionCards } from "./components/SectionCards";
import type { ChartConfig } from "@/components/ui/chart";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useUser } from "@clerk/clerk-react";

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
  const [issuesPagination, setIssuesPagination] = useState<
    PaginationInfo | undefined
  >(undefined);
  // Add loading and error states as needed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

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

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards kpiData={kpiData} />
            <ChartAreaInteractive
              chartData={insightTrends.chartData}
              chartConfig={insightTrends.chartConfig}
              title="Developer Insight Trends"
              description="Tracks identified strengths and issues over time."
            />
            {/* Pass issuesData to DataTable. Pagination info can be passed later */}
            <DataTable data={issuesData} />
          </div>
        </div>
      </div>
    </>
  );
}
