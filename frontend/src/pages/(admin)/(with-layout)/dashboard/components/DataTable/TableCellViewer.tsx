import * as React from "react";
import { TrendingUpIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { chartConfig, chartData } from "./constants";
import { type IssueItem } from "./types";

// 问题详情查看组件
export function TableCellViewer({ item }: { item: IssueItem }) {
  const [activeTab, setActiveTab] = React.useState("summary");
  const isMobile = useIsMobile();

  // 使用描述作为标题
  const title = item.description;
  const summaryDetails = [
    { label: "Category", value: item.category_or_area },
    { label: "Status", value: item.status },
    { label: "Frequency", value: item.frequency?.toString() ?? "N/A" },
    {
      label: "First Seen",
      value: item.first_seen_at
        ? new Date(item.first_seen_at).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Last Seen",
      value: item.last_seen_at
        ? new Date(item.last_seen_at).toLocaleDateString()
        : "N/A",
    },
  ];

  const prs =
    item.related_prs && item.related_prs.length > 0
      ? item.related_prs.join(", ")
      : "None";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {title}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Showing total visitors for the last 6 months
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2 grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <SheetDescription className="space-y-2">
                {summaryDetails.map((detail) => (
                  <div key={detail.label} className="flex justify-between">
                    <span className="font-medium text-foreground/80">
                      {detail.label}:
                    </span>
                    <span>{detail.value}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="font-medium text-foreground/80">
                    Related PRs:
                  </span>
                  <span className="truncate">{prs}</span>
                </div>
              </SheetDescription>
            </TabsContent>
            <TabsContent value="details">
              <SheetDescription>
                Detailed information about the issue. (Content TBD) <br />
                Full Description: {item.description}
              </SheetDescription>
            </TabsContent>
            <TabsContent value="activity">
              <SheetDescription>
                Activity log for this issue. (Content TBD)
              </SheetDescription>
            </TabsContent>
          </Tabs>
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">Submit</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
