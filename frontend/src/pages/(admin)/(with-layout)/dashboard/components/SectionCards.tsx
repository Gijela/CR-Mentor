import { BriefcaseIcon, AlertTriangleIcon, BookOpenTextIcon, TrendingUpIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the KpiSummary interface based on the backend service
interface KpiSummary {
  strengthsOverview: { totalCount: number; topCategory: { name: string; count: number } };
  issuesOverview: { activeCount: number; topCategory: { name: string; count: number } };
  knowledgeBaseStats: { totalSnippets: number; topTopic: { name: string; count: number } };
  recentActivity: {
    latestInsight: { description: string | null; category: string | null; timestamp: string | null };
    latestKnowledge: { summary: string | null; timestamp: string | null };
  };
}

interface SectionCardsProps {
  kpiData?: KpiSummary; // Make kpiData optional to handle loading state
}

export function SectionCards({ kpiData }: SectionCardsProps) {
  const cardCommonClasses = "@container/card flex-1";
  const cardHeaderCommonClasses = "relative";
  const cardTitleCommonClasses = "@[250px]/card:text-3xl text-2xl font-semibold tabular-nums";
  const cardFooterCommonClasses = "flex-col items-start gap-1 text-sm";
  const cardFooterLine1Classes = "line-clamp-2 flex gap-2 font-medium items-center"; // Allow two lines for longer category names
  const cardFooterLine2Classes = "text-muted-foreground line-clamp-1";

  // Default values for when kpiData is not available
  const defaultStrengths = { totalCount: 0, topCategory: { name: "N/A", count: 0 } };
  const defaultIssues = { activeCount: 0, topCategory: { name: "N/A", count: 0 } };
  const defaultKnowledge = { totalSnippets: 0, topTopic: { name: "N/A", count: 0 } };

  const strengths = kpiData?.strengthsOverview || defaultStrengths;
  const issues = kpiData?.issuesOverview || defaultIssues;
  const knowledge = kpiData?.knowledgeBaseStats || defaultKnowledge;

  return (
    <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <Card className={cardCommonClasses}>
        <CardHeader className={cardHeaderCommonClasses}>
          <CardDescription>Strengths Overview</CardDescription>
          <CardTitle className={cardTitleCommonClasses}>
            {strengths.totalCount}
          </CardTitle>
          {/* Optional: Placeholder for badge if needed later
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
          */}
        </CardHeader>
        <CardFooter className={cardFooterCommonClasses}>
          <div className={cardFooterLine1Classes}>
            <BriefcaseIcon className="size-4" /> Top: {strengths.topCategory.name}
          </div>
          <div className={cardFooterLine2Classes}>
            Count: {strengths.topCategory.count}
          </div>
        </CardFooter>
      </Card>

      <Card className={cardCommonClasses}>
        <CardHeader className={cardHeaderCommonClasses}>
          <CardDescription>Active Issues</CardDescription>
          <CardTitle className={cardTitleCommonClasses}>
            {issues.activeCount}
          </CardTitle>
          {/* Optional: Placeholder for badge
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <AlertTriangleIcon className="size-3" />
              -5%
            </Badge>
          </div>
          */}
        </CardHeader>
        <CardFooter className={cardFooterCommonClasses}>
          <div className={cardFooterLine1Classes}>
            <AlertTriangleIcon className="size-4" /> Top: {issues.topCategory.name}
          </div>
          <div className={cardFooterLine2Classes}>
            Count: {issues.topCategory.count}
          </div>
        </CardFooter>
      </Card>

      <Card className={cardCommonClasses}>
        <CardHeader className={cardHeaderCommonClasses}>
          <CardDescription>Knowledge Snippets</CardDescription>
          <CardTitle className={cardTitleCommonClasses}>
            {knowledge.totalSnippets}
          </CardTitle>
          {/* Optional: Placeholder for badge
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +8%
            </Badge>
          </div>
          */}
        </CardHeader>
        <CardFooter className={cardFooterCommonClasses}>
          <div className={cardFooterLine1Classes}>
            <BookOpenTextIcon className="size-4" /> Top: {knowledge.topTopic.name}
          </div>
          <div className={cardFooterLine2Classes}>
            Count: {knowledge.topTopic.count}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
