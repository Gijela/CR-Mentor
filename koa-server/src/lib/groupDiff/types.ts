
// 定义文件编辑类型的枚举
export enum EDIT_TYPE {
  ADDED = "added",       // 新增文件
  DELETED = "removed",     // 删除文件
  MODIFIED = "modified",   // 修改文件
  RENAMED = "renamed",     // 重命名文件 (逻辑上可能视为修改)
}

// 定义 handleLargeDiff 函数返回结果的接口
export interface HandleLargeDiffResult {
  patches: string[]; // 处理后的 patch 块字符串列表 (每个元素是一个完整的 patch 块文本)
  totalTokens: number[]; // 每个 patch 块的 Token 数量列表
  filesInPatches: string[][]; // 每个 patch 块包含的文件名列表
  deletedFiles: string[]; // 所有找到的被删除文件的名称列表
  remainingFiles?: string[]; // 未包含在任何 patch 块中的文件列表 (可选)
  status: 'full' | 'pruned_single' | 'pruned_multiple' | 'empty'; // 处理结果的状态
  // 'full': 完整 diff 未超限
  // 'pruned_single': 超限，已裁剪为单个 patch 块 (可能包含摘要)
  // 'pruned_multiple': 超限，已分割为多个 patch 块 (largePrHandling=true)
  // 'empty': 原始 diff 为空或裁剪后为空
}

// 定义生成扩展 patch 并计算 Token 数量的结果类型
export type GeneratePatchAndCalculateTokenResult = {
  patchesExtended: string[]; // 扩展后的 patch 列表
  totalTokens: number; // 扩展后的总 Token 数量
  patchesExtendedTokens: Record<string, number>; // 每个扩展 patch 的 Token 数量
};