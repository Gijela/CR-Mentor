import { TiktokenHandler, TokenHandler } from "./tokenCalculate";
import { EDIT_TYPE, FilePatchInfo, HandleLargeDiffResult } from "./types";
import { generateCompressedDiff, extendPatchAndCalcToken, handleFormatResult } from "./utils";

/**
 * 处理可能很大的 diff，通过检查 Token 限制、进行裁剪，并可选地将 diff 分割成多个块。
 * 这是外部调用者使用的主要入口函数。
 */
export function formatAndGroupDiff(
  modelMaxToken: number,
  diffFiles: FilePatchInfo[],           // 输入的原始 diff 文件列表
  systemPromptText: string,           // 系统提示的源文本
  options?: {                           // 可选配置项
    largePrHandling?: boolean;         // 是否启用大型 PR 处理模式
    returnRemainingFiles?: boolean;    // 是否在结果中返回未处理的文件列表
    maxAiCalls?: number;               // 大型 PR 模式下允许的最大块数
  }
): HandleLargeDiffResult {
  const { largePrHandling = true, returnRemainingFiles = true, maxAiCalls = 150 } = options || {};
  const tokenHandler = new TiktokenHandler(systemPromptText); // 初始化 token 计算器
  const OUTPUT_BUFFER_TOKENS_SOFT_THRESHOLD = 3000; // 输出缓冲区 Token 软阈值，用于判断是否需要裁剪
  const OUTPUT_BUFFER_TOKENS_HARD_THRESHOLD = 500;  // 输出缓冲区 Token 硬阈值，用于裁剪时的绝对上限
  const softTokenLimit = modelMaxToken - OUTPUT_BUFFER_TOKENS_SOFT_THRESHOLD; // 触发裁剪的阈值
  const hardTokenLimit = modelMaxToken - OUTPUT_BUFFER_TOKENS_HARD_THRESHOLD; // 裁剪后的硬性上限

  // --- 步骤 1: 尝试生成完整的、扩展的 diff ---
  const { patchesExtended, totalTokens: totalTokensFull } = extendPatchAndCalcToken(tokenHandler, diffFiles);

  // --- 步骤 2: 检查完整 diff 是否在软限制内 ---
  if (totalTokensFull < softTokenLimit) {
    console.log(`总 tokens (${totalTokensFull}) 低于软限制 (${softTokenLimit})。返回完整 diff。`);
    // 收集所有有 patch 内容的文件和所有被删除的文件
    const allFilesWithPatches = diffFiles
      .filter(f => f.patch !== null) // 过滤有实际 patch 内容的文件
      .map(f => f.filename);
    const allDeletedFiles = diffFiles
      .filter(f => f.edit_type === EDIT_TYPE.DELETED) // 过滤删除的文件
      .map(f => f.filename);

    // 构造结果对象
    const result: HandleLargeDiffResult = {
      patches: patchesExtended.length > 0 ? [patchesExtended.join("\n")] : [], // 将所有扩展 patch 拼成成一个单一的字符串块
      totalTokens: [totalTokensFull], // Token 数列表（只有一个元素）
      filesInPatches: [allFilesWithPatches], // 包含的文件列表（只有一个元素）
      deletedFiles: allDeletedFiles, // 所有删除的文件
      status: patchesExtended.length > 0 ? 'full' : 'empty' // 根据是否有 patch 设置状态
    };
    // 如果需要，添加空的剩余文件列表
    if (returnRemainingFiles) {
      result.remainingFiles = [];
    }

    // 返回完整 diff 的结果
    return result;
  }

  // --- 步骤 3: 如果超过软限制，生成压缩/分块的 diff ---
  const {
    patchesList, // 压缩后的 patch 块列表 (List<List<string>>)
    totalTokensList, // 每个块的 Token 数列表 (List<number>)
    deletedFilesList, // 所有被删除文件的列表 (List<string>)
    remainingFilesList, // 最终未包含在任何块中的文件列表 (List<string>)
    fileDict, // 文件名字典 (Record<string, FilePatchInfo>)
    filesInPatchesList // 每个块包含的文件列表 (List<List<string>>)
  } = generateCompressedDiff(
    modelMaxToken,
    OUTPUT_BUFFER_TOKENS_HARD_THRESHOLD,
    tokenHandler,
    largePrHandling,
    diffFiles,
    maxAiCalls
  );

  // --- 步骤 4: 处理压缩/分块的结果 ---
  const result = handleFormatResult(
    patchesList,
    diffFiles,
    deletedFilesList,
    returnRemainingFiles,
    largePrHandling,
    totalTokensList,
    filesInPatchesList,
    remainingFilesList,
    hardTokenLimit,
    tokenHandler,
    fileDict
  );

  return result;
}
