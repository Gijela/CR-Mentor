import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Interface for individual data points in the chart
export interface TransformedChartDataItem {
  date: string; // Expecting date strings in "YYYY-MM-DD" or compatible format
  [seriesKey: string]: number | string; // Allows for dynamic series keys like 'strengths', 'issues'
}

// Props for the ChartAreaInteractive component
export interface ChartAreaInteractiveProps {
  chartData?: TransformedChartDataItem[];
  chartConfig: ChartConfig; // Expecting a ChartConfig object from the parent
  title?: string;
  description?: string;
}

// Default empty chart data and config if not provided
const DEFAULT_CHART_DATA: TransformedChartDataItem[] = [];
const DEFAULT_CHART_CONFIG: ChartConfig = {};

export function ChartAreaInteractive({
  chartData = DEFAULT_CHART_DATA,
  chartConfig = DEFAULT_CHART_CONFIG,
  title = "Insight Trends", // Generic title
  description = "Visualizing insights over time", // Generic description
}: ChartAreaInteractiveProps) {
  // Prepare a list of series keys from chartConfig, excluding any potential 'date' key or others not representing data series.
  const seriesKeys = Object.keys(chartConfig).filter(
    key => chartConfig[key] && typeof chartConfig[key].label === 'string' && chartConfig[key].color
  );

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
         {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig} // Use the passed-in chartConfig
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}> {/* Adjusted margins */}
            <defs>
              {seriesKeys.map((key) => (
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
                    stopColor={`var(--color-${key})`} // Use CSS variable from ChartConfig
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
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20} // Adjusted for potentially more ticks
              tickFormatter={(value) => {
                const date = new Date(value);
                // Basic date formatting, can be improved for different granularities
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8}
              // You might want to format Y-axis ticks if they are large numbers
              // tickFormatter={(value) => `${value / 1000}k`} 
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {seriesKeys.map((key) => (
            <Area
                key={key}
                dataKey={key}
              type="natural"
                fill={`url(#fill${key})`}
                stroke={`var(--color-${key})`}
                stackId="a" // Ensure areas are stacked if that's the desired behavior, or remove for overlap
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
