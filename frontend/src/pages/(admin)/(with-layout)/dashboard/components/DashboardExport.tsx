import React, { useState } from "react";
import { DownloadIcon, FileJsonIcon, FileSpreadsheetIcon } from "lucide-react";
import type { IssueItem, StrengthItem } from "./DataTable";
import type { KnowledgeSnippet } from "./KnowledgeSearch";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DashboardData {
  issues?: IssueItem[];
  strengths?: StrengthItem[];
  knowledgeSnippets?: KnowledgeSnippet[];
  metadata?: {
    exportedAt: string;
    developerId: string;
    totalIssues: number;
    totalStrengths: number;
    totalKnowledgeSnippets: number;
  };
}

interface DashboardExportProps {
  data: DashboardData;
  filename?: string;
}

export function DashboardExport({
  data,
  filename = "dashboard-export",
}: DashboardExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  // 辅助函数：添加导出元数据
  const prepareExportData = (data: DashboardData): DashboardData => {
    return {
      ...data,
      metadata: {
        exportedAt: new Date().toISOString(),
        developerId: data.metadata?.developerId || "unknown",
        totalIssues: data.issues?.length || 0,
        totalStrengths: data.strengths?.length || 0,
        totalKnowledgeSnippets: data.knowledgeSnippets?.length || 0,
      },
    };
  };

  // 导出为JSON
  const exportAsJson = () => {
    try {
      setIsExporting(true);
      const exportData = prepareExportData(data);
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // 创建下载链接
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.json`;
      document.body.appendChild(a);
      a.click();

      // 清理
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("数据已成功导出为JSON格式");
    } catch (error) {
      console.error("导出JSON失败:", error);
      toast.error("导出失败，请稍后再试");
    } finally {
      setIsExporting(false);
    }
  };

  // 将对象数组转换为CSV格式
  const convertToCSV = <T extends Record<string, any>>(
    objArray: T[],
    header?: string[]
  ): string => {
    if (!objArray || objArray.length === 0) return "";

    // 如果没有提供表头，使用第一个对象的键作为表头
    const headers = header || Object.keys(objArray[0] || {});

    // 创建CSV表头行
    let csv = headers.join(",") + "\n";

    // 添加数据行
    objArray.forEach((obj) => {
      const values = headers.map((key) => {
        const value = obj[key];

        // 处理不同类型的值
        if (value === null || value === undefined) {
          return "";
        } else if (typeof value === "object") {
          // 如果是对象，转换为JSON字符串
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else if (typeof value === "string") {
          // 如果包含逗号、引号或换行符，需要用引号包裹
          return value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        } else {
          return value;
        }
      });

      csv += values.join(",") + "\n";
    });

    return csv;
  };

  // 导出为CSV
  const exportAsCSV = () => {
    try {
      setIsExporting(true);
      const exportData = prepareExportData(data);
      let csvContent = "";

      // 导出问题数据
      if (exportData.issues && exportData.issues.length > 0) {
        csvContent += "# 开发者问题\n";
        csvContent += convertToCSV(exportData.issues);
        csvContent += "\n\n";
      }

      // 导出优势数据
      if (exportData.strengths && exportData.strengths.length > 0) {
        csvContent += "# 开发者优势\n";
        csvContent += convertToCSV(exportData.strengths);
        csvContent += "\n\n";
      }

      // 导出知识片段数据
      if (
        exportData.knowledgeSnippets &&
        exportData.knowledgeSnippets.length > 0
      ) {
        csvContent += "# 相关知识片段\n";
        csvContent += convertToCSV(exportData.knowledgeSnippets);
      }

      // 添加元数据
      csvContent += "\n\n# 导出元数据\n";
      csvContent += `导出时间,${exportData.metadata?.exportedAt}\n`;
      csvContent += `开发者ID,${exportData.metadata?.developerId}\n`;
      csvContent += `问题总数,${exportData.metadata?.totalIssues}\n`;
      csvContent += `优势总数,${exportData.metadata?.totalStrengths}\n`;
      csvContent += `知识片段总数,${exportData.metadata?.totalKnowledgeSnippets}\n`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // 创建下载链接
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.csv`;
      document.body.appendChild(a);
      a.click();

      // 清理
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("数据已成功导出为CSV格式");
    } catch (error) {
      console.error("导出CSV失败:", error);
      toast.error("导出失败，请稍后再试");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={isExporting}
        >
          <DownloadIcon className="h-4 w-4" />
          导出数据
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>选择导出格式</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onClick={exportAsJson}
          disabled={isExporting}
        >
          <FileJsonIcon className="h-4 w-4" />
          <span>导出为JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onClick={exportAsCSV}
          disabled={isExporting}
        >
          <FileSpreadsheetIcon className="h-4 w-4" />
          <span>导出为CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
