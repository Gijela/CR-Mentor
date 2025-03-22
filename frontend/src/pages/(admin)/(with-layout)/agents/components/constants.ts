// 常量定义
export const extraHeight = 2 * 8 + 64; // 2 * 8px是上下margin, 还有64px的header高度
export const teamHeight = 76 + 36; // 团队成员列表高度

// 定义步骤相关的常量
export const stepTitles = [
  "获取 Diff 信息",
  "处理 Diff 实体",
  "构建代码知识图谱",
  "生成上下文列表",
  "执行代码审查"
];

export const userMessagesForSteps = [
  "请获取 Diff 信息。",
  "请处理 Diff 实体。",
  "请构建代码知识图谱。",
  "请生成上下文列表。",
  "请执行代码审查。"
];

export const agentMessagesForSteps = [
  "好的，正在获取 Diff 信息。这一步将帮助我们了解代码变更的具体内容和范围。",
  "好的，正在处理 Diff 实体。这一步将提取出代码变更中的关键实体，便于后续分析。",
  "好的，正在构建代码知识图谱。这一步将帮助我们可视化代码结构和关系，便于理解代码的整体架构。",
  "好的，正在生成上下文列表。这一步将整合相关信息，为代码审查提供更全面的背景。",
  "好的，正在执行代码审查。这一步将对代码变更进行详细审查，确保代码质量和功能正确性。"
];

export const completionMessagesForSteps = [
  "Diff 信息获取完成。",
  "Diff 实体处理完成。",
  "代码知识图谱构建完成。",
  "上下文列表生成完成。",
  "代码审查完成。"
];
