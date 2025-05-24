import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartIcon, LineChartIcon, AreaChartIcon } from "lucide-react";

// 图表类型
export type ChartType = "area" | "bar" | "line";

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (value: ChartType) => void;
}

/**
 * 图表类型选择器组件
 */
export function ChartTypeSelector({
  value = "area",
  onChange,
}: ChartTypeSelectorProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(newValue) => onChange(newValue as ChartType)}
      className="w-auto"
    >
      <TabsList className="bg-muted/50">
        <TabsTrigger value="area" title="区域图">
          <AreaChartIcon className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="bar" title="柱状图">
          <BarChartIcon className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="line" title="折线图">
          <LineChartIcon className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
