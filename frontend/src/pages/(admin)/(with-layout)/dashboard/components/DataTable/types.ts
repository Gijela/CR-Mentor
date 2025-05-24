import { z } from "zod";

// 问题项目的数据模型
export const issueSchema = z.object({
  id: z.string(),
  description: z.string(),
  category_or_area: z.string(),
  status: z.string(),
  frequency: z.number().optional(),
  related_prs: z.array(z.string()).nullable().optional(),
  last_seen_at: z.string().datetime({ offset: true }).optional(),
  first_seen_at: z.string().datetime({ offset: true }).optional(),
});

export type IssueItem = z.infer<typeof issueSchema>;

// 技术优势项目的数据模型
export const strengthSchema = z.object({
  id: z.string(),
  description: z.string(),
  category_or_area: z.string(),
  confidence: z.number().optional(),
  related_prs: z.array(z.string()).nullable().optional(),
  last_seen_at: z.string().datetime({ offset: true }).optional(),
  first_seen_at: z.string().datetime({ offset: true }).optional(),
});

export type StrengthItem = z.infer<typeof strengthSchema>;

// 通用类型定义，用于处理表格数据项
export type TableItemType = IssueItem | StrengthItem; 