import * as React from "react";
import { TrendingUpIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
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

import { type StrengthItem } from "./types";

// 技术优势详情查看组件
export function StrengthCellViewer({ item }: { item: StrengthItem }) {
  const [activeTab, setActiveTab] = React.useState("summary");
  const isMobile = useIsMobile();

  // 技术优势特定信息
  const title = item.description;
  const summaryDetails = [
    { label: "Area", value: item.category_or_area },
    {
      label: "Confidence",
      value: item.confidence ? `${Math.round(item.confidence * 100)}%` : "N/A",
    },
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
            Developer strength and expertise details
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          {!isMobile && (
            <>
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  <TrendingUpIcon className="size-4 text-green-500" />
                  {item.category_or_area} expertise
                </div>
                <div className="text-muted-foreground">
                  This strength has been consistently demonstrated in the
                  developer's code contributions.
                </div>
              </div>
              <Separator />
            </>
          )}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2 grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
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
                Detailed information about this strength. (Content TBD) <br />
                Full Description: {item.description}
              </SheetDescription>
            </TabsContent>
            <TabsContent value="related">
              <SheetDescription>
                Related knowledge snippets and code examples. (Content TBD)
              </SheetDescription>
            </TabsContent>
          </Tabs>
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">View All Strengths</Button>
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
