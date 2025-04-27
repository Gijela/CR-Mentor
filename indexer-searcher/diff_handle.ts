import { Tiktoken, get_encoding } from "@dqbd/tiktoken";

// ==========================================================================
// 常量定义 (Constants Definition)
// ==========================================================================

const OUTPUT_BUFFER_TOKENS_SOFT_THRESHOLD = 1000; // 示例值：输出缓冲区 Token 软阈值，用于判断是否需要裁剪
const OUTPUT_BUFFER_TOKENS_HARD_THRESHOLD = 500;  // 示例值：输出缓冲区 Token 硬阈值，用于裁剪时的绝对上限
const MAX_EXTRA_FILES_TO_PROMPT = 5; // 示例值 - 注意：此常量未在提供的核心逻辑中直接使用，但为了完整性保留，以备他处需要。

// 定义文件编辑类型的枚举
export enum EDIT_TYPE {
  ADDED = "ADDED",       // 新增文件
  DELETED = "DELETED",     // 删除文件
  MODIFIED = "MODIFIED",   // 修改文件
  RENAMED = "RENAMED",     // 重命名文件 (逻辑上可能视为修改)
}

// 用于在裁剪后生成文件列表摘要的字符串前缀
const ADDED_FILES_ = "其他新增文件:";
const MORE_MODIFIED_FILES_ = "其他修改文件:";
const DELETED_FILES_ = "其他删除文件:";

// ==========================================================================
// 接口和类型定义 (Interfaces and Types Definition)
// ==========================================================================

// 定义单个文件的差异信息结构
export interface FilePatchInfo {
  filename: string;      // 文件名
  patch: string | null; // Patch 内容，对于没有具体 Patch 信息的删除文件，此值为 null
  edit_type: EDIT_TYPE;  // 编辑类型
  // 如果原始结构中有其他相关字段，在此添加
  [key: string]: any; // 允许包含其他任意属性
}

// 定义语言及其相关文件列表的结构
export interface LanguageInfo {
  language: string; // 编程语言名称
  files: string[];  // 属于该语言的文件列表
}

// 定义 TokenHandler 功能的接口
export interface TokenHandler {
  promptTokens: number; // Prompt (例如，系统消息) 本身占用的 Token 数
  countTokens(text: string): number; // 计算给定文本的 Token 数量的方法
  // getEncoder(): any; // 如果高级裁剪需要编码器实例，则需要此方法 (需要具体的编码器类型)
}

// 基于 Tiktoken 的 TokenHandler 实现
export class TiktokenHandler implements TokenHandler {
  promptTokens: number;
  private encoder: Tiktoken; // Tiktoken 编码器实例

  constructor(promptTokens = 50, modelName: "gpt-3.5-turbo" | "gpt-4" | string = "gpt-3.5-turbo") { // 默认为 gpt-3.5 的编码
    this.promptTokens = promptTokens;
    // 根据模型选择编码，或使用像 'cl100k_base' 这样的默认编码（适用于许多较新模型）
    // 为简单起见，这里直接使用 cl100k_base，因为它很常用。
    // 你可能需要根据确切的模型字符串进行更复杂的逻辑判断。
    try {
      this.encoder = get_encoding("cl100k_base"); // 获取 cl100k_base 编码器
    } catch (e) {
      console.error("获取 Tiktoken 编码 'cl100k_base' 失败。请确保 @dqbd/tiktoken 已正确安装。", e);
      // 可以选择回退到其他方案或抛出错误
      throw new Error("Tiktoken 初始化失败。");
    }
  }

  // 计算文本的 Token 数
  countTokens(text: string): number {
    if (!text) return 0;
    try {
      // 注意：Tiktoken 的 encode 方法返回 Uint32Array，其长度即为 Token 数量。
      return this.encoder.encode(text).length;
    } catch (e) {
      console.error(`编码文本时出错: "${text.substring(0, 50)}..."`, e);
      // 在某些情况下，可能希望回退到近似计算，这里我们返回 0
      return 0;
    }
  }

  // 如果需要，可以在完成后清理编码器（可选，取决于环境）
  // free(): void {
  //     this.encoder.free();
  // }
}

// ==========================================================================
// 辅助函数 (Helper Functions)
// ==========================================================================

// 获取模型最大 Token 数的占位符函数
export function getMaxTokens(model: string): number {
  // 示例值，如果需要，用实际逻辑替换
  if (model.includes("gpt-4")) {
    return 8192; // gpt-4 示例值
  } else {
    // 假设默认值类似于 gpt-3.5
    return 4096; // gpt-3.5 示例值
  }
}

// 裁剪文本以适应最大 Token 限制的占位符函数
// 注意：这是一个简化的翻译版本。真正的 Token 裁剪非常复杂。
export function clipTokens(
  text: string,
  maxTokens: number,
  options: { deleteLastLine?: boolean; tokenHandler: TokenHandler } // 选项：是否删除最后一行（如果被截断），以及使用的 TokenHandler
): string {
  const { deleteLastLine = false, tokenHandler } = options;

  if (!text) return ""; // 空文本直接返回

  // 简单的基于单词的裁剪，类似于 Python 示例
  const words = text.split(/\s+/).filter(Boolean);
  const initialTokens = tokenHandler.countTokens(text); // 获取原始 Token 数

  // 如果未超限，直接返回原文
  if (initialTokens <= maxTokens) {
    return text;
  }

  // --- 模式一：按行裁剪 (deleteLastLine = true) ---
  if (deleteLastLine) {
    const lines = text.split('\n'); // 按行分割
    const clippedLines: string[] = []; // 存储裁剪后的行
    let currentTokens = 0; // 当前累积的 Token 数

    for (const line of lines) {
      const lineTokens = tokenHandler.countTokens(line); // 估算当前行的 Token 数
      // 如果加上当前行不超过限制
      if (currentTokens + lineTokens <= maxTokens) {
        clippedLines.push(line); // 添加该行
        currentTokens += lineTokens; // 更新 Token 数
      } else {
        // 如果超过限制，尝试添加部分行（非常基础）
        const remainingTokens = maxTokens - currentTokens; // 计算剩余可用 Token
        if (remainingTokens > 0) {
          const lineWords = line.split(/\s+/).filter(Boolean); // 获取行的单词
          // 截取剩余 Token 数允许的单词（粗略近似）
          const partialLine = lineWords.slice(0, remainingTokens).join(" ");
          if (partialLine) clippedLines.push(partialLine); // 如果有内容，添加部分行
        }
        break; // 停止添加行
      }
    }

    // 避免在所有内容都被裁剪或只剩下前缀时返回空或无意义的前缀
    // 启发式规则：如果只剩下一个短的、以冒号结尾的前缀行，则返回省略号
    if (!clippedLines.length || (clippedLines.length === 1 && clippedLines[0].endsWith(':') && clippedLines[0].split(/\s+/).filter(Boolean).length < 5)) {
      return "..."; // 表示裁剪移除了有意义的内容
    }

    const result = clippedLines.join("\n"); // 将裁剪后的行合并
    // 仅当内容确实被移除时才添加省略号
    return result.length < text.length ? result + "\n..." : result;

    // --- 模式二：简单按词裁剪 (deleteLastLine = false) ---
  } else {
    const clippedWords = words.slice(0, maxTokens); // 直接截取允许的最大单词数
    return clippedWords.join(" ") + "..."; // 合并单词并添加省略号
  }
}

// 按主要语言对文件进行排序的占位符函数
// 简化版：仅为了演示返回原始文件数组。
export function sortFilesByMainLanguages(
  languages: LanguageInfo[], // 虽然在简化版本中未使用，但为保持签名一致性而保留
  diffFiles: FilePatchInfo[]
): FilePatchInfo[] {
  console.warn("警告：正在使用简化的文件排序逻辑。");
  // 创建副本以避免修改原始列表
  return [...diffFiles]; // 如果需要，替换为实际的排序逻辑 (例如，将 `languages` 中列出的主要语言文件排在前面)
}


// ==========================================================================
// 核心逻辑函数 (Core Logic Functions)
// ==========================================================================

/**
 * 生成"扩展"的 diff patches 并计算 Token 数量。
 * 这是基于 pr_processing.py 中结构的简化占位符。
 * "扩展"可能意味着（在未来实现中）在 hunk 周围添加额外的上下文行。
 */
export function prGenerateExtendedDiff(
  prLanguages: LanguageInfo[],          // PR 中的语言信息
  tokenHandler: TokenHandler,           // 用于计算 Token 的处理器
  addLinenumbersToHunks: boolean,     // 是否在 Hunk 中添加行号 (简化版中未使用)
  patchExtraLinesBefore: number,        // 在 hunk 前添加的额外上下文行数 (简化版中未使用)
  patchExtraLinesAfter: number,         // 在 hunk 后添加的额外上下文行数 (简化版中未使用)
  diffFiles: FilePatchInfo[]            // 包含所有文件差异信息的列表
): { patchesExtended: string[]; totalTokens: number; patchesExtendedTokens: Record<string, number> } {
  const patchesExtended: string[] = []; // 存储生成的扩展 patch 字符串
  const patchesExtendedTokens: Record<string, number> = {}; // 记录每个文件 patch 的 Token 数
  let totalTokens = tokenHandler.promptTokens; // 初始化总 Token 数 (包含 prompt 的 Token)

  // 对文件进行排序，以确保处理顺序一致
  const sortedFiles = sortFilesByMainLanguages(prLanguages, diffFiles);

  // 遍历排序后的文件
  for (const file of sortedFiles) {
    const patch = file.patch; // 获取 patch 内容 (可能为 null)
    const filename = file.filename || 'unknown_file'; // 获取文件名

    // 跳过没有 patch 内容的文件，除非它们是被删除的文件
    if (patch === null && file.edit_type !== EDIT_TYPE.DELETED) {
      console.log(`跳过文件 '${filename}'，因为它没有 patch 内容且不是删除状态。`);
      continue;
    }

    // 处理删除的文件（它们计入文件列表，但不贡献 patch 内容的 Token）
    if (file.edit_type === EDIT_TYPE.DELETED) {
      patchesExtendedTokens[filename] = 0; // 删除文件的 patch Token 成本为 0
      continue; // 处理下一个文件
    }

    // 对于非删除文件，期望有 patch 内容
    // 类型系统有所帮助，但如果需要，可以显式检查 null/undefined
    if (patch === null || patch === undefined) { // 理论上如果上面的检查正确，不应发生
      console.warn(`警告：文件 '${filename}' (类型 ${file.edit_type}) 的 patch 内容为 null/undefined。正在跳过。`);
      continue;
    }

    // --- 开始：实际逻辑模拟 ---
    // 在实际代码中：根据 before/after 设置在 hunk 周围添加额外的上下文行
    // 在实际代码中：如果 addLinenumbersToHunks 为 True，则添加行号
    // 简化版本：仅添加一个文件头
    let extendedPatch = `## File: '${filename}'\n`; // 文件头
    if (patch) { // 如果 patch 内容存在，则添加
      extendedPatch += patch + "\n";
    }
    // --- 结束：实际逻辑模拟 ---

    // 计算这个扩展 patch 的 Token 数
    const patchTokens = tokenHandler.countTokens(extendedPatch);
    patchesExtended.push(extendedPatch); // 添加到列表
    patchesExtendedTokens[filename] = patchTokens; // 记录 Token 数
    totalTokens += patchTokens; // 累加总 Token 数
  }

  console.log(`生成了 ${patchesExtended.length} 个文件的扩展 diff，总 Token 数为 ${totalTokens} (包含 prompt)。`);
  // 返回生成的 patch 列表、总 Token 数、以及每个文件 patch 的 Token 记录
  return { patchesExtended, totalTokens, patchesExtendedTokens };
}


/**
 * 生成一个包含来自 filesToProcess 中文件 diff 的 patch 块，
 * 直到接近 maxTokensModel（模型的最大 Token 限制）。
 */
export function generateFullPatch(
  convertHunksToLineNumbers: boolean, // 是否将 Hunk 转换为行号 (简化版中未使用)
  fileDict: Record<string, FilePatchInfo>, // 文件名字典，方便查找文件信息
  maxTokensModel: number,                // 模型允许的最大 Token 数
  filesToProcess: string[],              // 需要处理的文件名列表
  tokenHandler: TokenHandler             // Token 处理器
): { totalTokens: number; patches: string[]; remainingFiles: string[]; filesInPatch: string[] } {

  const patches: string[] = [];           // 存储此块中的 patch 字符串
  const filesInPatch: string[] = [];      // 存储此块中包含的文件名
  // 从 prompt tokens + 一个小的缓冲区开始，作为文件间的分隔符/安全边际
  let totalTokens = tokenHandler.promptTokens + 10; // 添加小缓冲区
  let remainingFiles = [...filesToProcess]; // 复制列表，存储此块处理后剩余的文件

  console.log(`开始生成 patch 块，待处理文件数: ${remainingFiles.length}, Token 限制: ${maxTokensModel}, 当前 Token: ${totalTokens}`);

  let processedAFile = false; // 标记是否已成功处理至少一个文件
  // 当还有剩余文件需要处理时循环
  while (remainingFiles.length > 0) {
    const filename = remainingFiles[0]; // 按顺序处理第一个文件
    const fileInfo = fileDict[filename]; // 从字典获取文件信息

    // 如果没有文件信息或没有 patch 内容（被删除的文件理论上不应在此处传入 filesToProcess）则跳过
    if (!fileInfo || !fileInfo.patch) {
      console.log(`在 generateFullPatch 中跳过文件 '${filename}' (无信息或无 patch)。`);
      remainingFiles.shift(); // 从剩余列表中移除
      continue;
    }

    const patchContent = fileInfo.patch; // 获取 patch 内容
    // --- 开始：实际逻辑模拟 ---
    // 在实际代码中：如果 convertHunksToLineNumbers 为 True，则添加行号
    const patchWithHeader = `## File: '${filename}'\n${patchContent}\n`; // 创建带文件头的 patch 字符串
    // --- 结束：实际逻辑模拟 ---

    // 估算此文件 patch 的 Token 成本 + 一个小的分隔符成本
    const patchTokens = tokenHandler.countTokens(patchWithHeader) + 2; // 添加缓冲区

    // 检查添加此文件是否会超过限制
    // 允许至少添加一个文件，即使它最初略微超过限制
    // 此处使用硬阈值，因为这是生成核心内容的部分
    const currentHardLimit = maxTokensModel - OUTPUT_BUFFER_TOKENS_HARD_THRESHOLD;
    // 如果已经处理过文件，并且（当前总 Token + 新文件 Token）> 硬限制
    if (processedAFile && (totalTokens + patchTokens > currentHardLimit)) {
      console.log(`文件 '${filename}' (${patchTokens} tokens) 将超过限制 (${currentHardLimit})，停止当前块。当前 Tokens: ${totalTokens}`);
      break; // 停止向此块添加文件
    }

    // 添加文件
    patches.push(patchWithHeader); // 添加 patch 字符串
    filesInPatch.push(filename);   // 添加文件名
    totalTokens += patchTokens;    // 累加 Token
    remainingFiles.shift();        // 从剩余列表中移除已处理的文件
    processedAFile = true;         // 标记已处理过文件
    console.log(`已添加文件 '${filename}' (${patchTokens} tokens), 总 tokens: ${totalTokens}`);
  }

  // 根据实际内容 + prompt 重新计算最终 Token，不包括文件间的缓冲区
  const finalContent = patches.join("\n"); // 使用换行符作为分隔符连接所有 patch
  const finalTokens = tokenHandler.promptTokens + tokenHandler.countTokens(finalContent);
  console.log(`生成 patch 块完成，包含 ${filesInPatch.length} 个文件, 最终 tokens: ${finalTokens}。剩余 ${remainingFiles.length} 个文件待处理。`);

  // 返回计算出的总 Token、patch 字符串列表、剩余文件列表、此块包含的文件列表
  return { totalTokens: finalTokens, patches, remainingFiles, filesInPatch };
}


/**
 * 根据 Token 限制生成压缩的 diff 块。
 * 当完整的扩展 diff 超出限制时，此函数被调用。
 * 如果 largePrHandling 为 true，则可能生成多个块。
 */
export function prGenerateCompressedDiff(
  prLanguages: LanguageInfo[],           // PR 语言信息
  tokenHandler: TokenHandler,            // Token 处理器
  model: string,                         // 模型名称
  addLinenumbersToHunks: boolean,      // 是否添加行号 (传递给 generateFullPatch)
  largePrHandling: boolean,              // 是否启用大型 PR 处理模式（允许多个块）
  diffFiles: FilePatchInfo[],            // 所有文件的差异信息
  maxAiCalls: number = 5                 // 允许生成的最大块数 (来自 PRDescription 设置的默认值)
): {
  patchesList: string[][];              // 块列表，每个块是 patch 字符串列表
  totalTokensList: number[];            // 每个块的总 Token 数列表
  deletedFilesList: string[];           // 所有被删除文件的名称列表
  remainingFilesList: string[];         // 未包含在任何块中的（有 patch 的）文件列表
  fileDict: Record<string, FilePatchInfo>; // 文件名字典
  filesInPatchesList: string[][];       // 块列表，每个块是其包含的文件名列表
} {
  const patchesList: string[][] = [];       // 初始化块列表
  const totalTokensList: number[] = [];     // 初始化 Token 数列表
  let deletedFilesList: string[] = [];      // 初始化删除文件列表
  let filesInPatchesList: string[][] = []; // 初始化块内文件列表

  // 创建文件名字典以便快速查找，并存储编辑类型
  const fileDict: Record<string, FilePatchInfo> = {};
  diffFiles.forEach(f => { fileDict[f.filename] = f; });

  // 需要处理的文件应该是那些有实际 patch 内容的文件，并进行排序
  const filesWithPatchContent = diffFiles.filter(f => f.patch); // 过滤出有 patch 的文件
  const sortedFilesToProcess = sortFilesByMainLanguages(prLanguages, filesWithPatchContent); // 排序
  const filesToProcessNames = sortedFilesToProcess.map(f => f.filename); // 获取文件名列表

  // 在所有块之间全局跟踪剩余文件
  let remainingFilesList = [...filesToProcessNames];

  // 收集所有被删除文件的名称
  deletedFilesList = diffFiles
    .filter(f => f.edit_type === EDIT_TYPE.DELETED)
    .map(f => f.filename);

  const maxTokensModel = getMaxTokens(model); // 获取模型最大 Token 数

  // 确定允许的 patch 生成迭代次数
  let numAllowedIterations: number;
  if (largePrHandling) {
    // 假设 maxAiCalls 是生成 patch 块的限制
    numAllowedIterations = maxAiCalls;
  } else {
    numAllowedIterations = 1; // 如果不是 large_pr_handling，只生成一个块
  }

  console.log(`开始生成压缩 diff。允许的迭代次数: ${numAllowedIterations}`);

  // 循环生成 patch 块
  for (let i = 0; i < numAllowedIterations; i++) {
    // 如果没有剩余文件需要处理，则停止
    if (remainingFilesList.length === 0) {
      console.log(`迭代 ${i + 1}: 没有剩余文件需要处理。`);
      break;
    }

    console.log(`迭代 ${i + 1}/${numAllowedIterations}, 处理 ${remainingFilesList.length} 个文件。`);
    // 调用 generateFullPatch 生成下一个 patch 块
    const {
      totalTokens: chunkTotalTokens,        // 当前块的 Token 数
      patches: chunkPatches,              // 当前块的 patch 字符串列表
      remainingFiles: remainingFilesAfterChunk, // 处理完当前块后剩余的文件
      filesInPatch: chunkFilesInPatch       // 当前块包含的文件名列表
    } = generateFullPatch(
      addLinenumbersToHunks, fileDict, maxTokensModel, remainingFilesList, tokenHandler
    );

    // 更新全局剩余文件列表
    remainingFilesList = remainingFilesAfterChunk;

    // 如果生成了内容，则添加到结果列表中
    if (chunkPatches.length > 0) {
      patchesList.push(chunkPatches);             // 添加 patch 列表
      totalTokensList.push(chunkTotalTokens);     // 添加 Token 数
      filesInPatchesList.push(chunkFilesInPatch); // 添加包含的文件列表
      console.log(`迭代 ${i + 1}: 生成了包含 ${chunkFilesInPatch.length} 个文件的块, ${chunkTotalTokens} tokens。`);
    } else {
      console.log(`迭代 ${i + 1}: 未生成 patch 内容 (可能是剩余文件过大)。`);
      // 如果本次迭代未生成任何 patch，则停止尝试。
      break;
    }
  }

  console.log(`压缩 diff 生成完成。创建了 ${patchesList.length} 个块。`);
  // 返回所有生成的信息
  return { patchesList, totalTokensList, deletedFilesList, remainingFilesList, fileDict, filesInPatchesList };
}

// ==========================================================================
// 主处理函数 (Main Handler Function)
// ==========================================================================

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

/**
 * 处理可能很大的 diff，通过检查 Token 限制、进行裁剪，并可选地将 diff 分割成多个块。
 * 这是外部调用者使用的主要入口函数。
 */
export function handleLargeDiff(
  diffFiles: FilePatchInfo[],           // 输入的原始 diff 文件列表
  prLanguages: LanguageInfo[],          // PR 语言信息
  tokenHandler: TokenHandler,           // Token 处理器
  model: string,                        // 目标 AI 模型名称
  options: {                           // 可选配置项
    addLinenumbersToHunks?: boolean;   // 是否添加行号
    disableExtraLines?: boolean;       // 是否禁用添加额外上下文行 (如果实现了该功能)
    patchExtraLinesBefore?: number;    // Hunk 前添加的额外行数
    patchExtraLinesAfter?: number;     // Hunk 后添加的额外行数
    largePrHandling?: boolean;         // 是否启用大型 PR 处理模式
    returnRemainingFiles?: boolean;    // 是否在结果中返回未处理的文件列表
    maxAiCalls?: number;               // 大型 PR 模式下允许的最大块数
  } = {} // 提供默认空对象作为选项
): HandleLargeDiffResult {
  // 解构选项，提供默认值
  const {
    addLinenumbersToHunks = false,
    disableExtraLines = false,
    patchExtraLinesBefore = 0,
    patchExtraLinesAfter = 0,
    largePrHandling = false,
    returnRemainingFiles = false,
    maxAiCalls = 5
  } = options;

  // 根据 disableExtraLines 确定有效的额外行数
  let effectivePatchExtraLinesBefore = disableExtraLines ? 0 : patchExtraLinesBefore;
  let effectivePatchExtraLinesAfter = disableExtraLines ? 0 : patchExtraLinesAfter;
  // 如果需要，可以在此处添加对额外行数的限制逻辑 (例如 cap_and_log_extra_lines)

  // --- 步骤 1: 尝试生成完整的、扩展的 diff ---
  console.log("步骤 1: 生成扩展 diff...");
  const { patchesExtended, totalTokens: totalTokensFull } = prGenerateExtendedDiff(
    prLanguages, tokenHandler, addLinenumbersToHunks,
    effectivePatchExtraLinesBefore, effectivePatchExtraLinesAfter, diffFiles
  );

  // 获取模型的 Token 限制和计算软/硬限制
  const maxTokensLimit = getMaxTokens(model);
  const softTokenLimit = maxTokensLimit - OUTPUT_BUFFER_TOKENS_SOFT_THRESHOLD; // 触发裁剪的阈值
  const hardTokenLimit = maxTokensLimit - OUTPUT_BUFFER_TOKENS_HARD_THRESHOLD; // 裁剪后的硬性上限

  console.log(`模型: ${model}, 最大 Tokens: ${maxTokensLimit}, 软限制: ${softTokenLimit}, 硬限制: ${hardTokenLimit}`);

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
      // 将所有扩展 patch 连接成一个单一的字符串块
      patches: patchesExtended.length > 0 ? [patchesExtended.join("\n")] : [],
      totalTokens: [totalTokensFull],                 // Token 数列表（只有一个元素）
      filesInPatches: [allFilesWithPatches],          // 包含的文件列表（只有一个元素）
      deletedFiles: allDeletedFiles,                  // 所有删除的文件
      status: patchesExtended.length > 0 ? 'full' : 'empty' // 根据是否有 patch 设置状态
    };
    // 如果需要，添加空的剩余文件列表
    if (returnRemainingFiles) {
      result.remainingFiles = [];
    }
    return result; // 返回完整 diff 的结果
  }

  // --- 步骤 3: 如果超过软限制，生成压缩/分块的 diff ---
  console.log(`总 tokens (${totalTokensFull}) >= 软限制 (${softTokenLimit})。开始裁剪 diff (largePrHandling=${largePrHandling})。`);
  // 调用 prGenerateCompressedDiff 进行处理
  const {
    patchesList: patchesCompressedListChunks, // 压缩后的 patch 块列表 (List<List<string>>)
    totalTokensList,                         // 每个块的 Token 数列表 (List<number>)
    deletedFilesList,                        // 所有被删除文件的列表 (List<string>)
    remainingFilesList: remainingFilesListFinal, // 最终未包含在任何块中的文件列表 (List<string>)
    fileDict,                                // 文件名字典 (Record<string, FilePatchInfo>)
    filesInPatchesList                       // 每个块包含的文件列表 (List<List<string>>)
  } = prGenerateCompressedDiff(
    prLanguages, tokenHandler, model, addLinenumbersToHunks,
    largePrHandling, diffFiles, maxAiCalls
  );

  // 初始化最终结果存储变量
  const finalPatchesStrings: string[] = []; // 最终的 patch 字符串列表
  const finalTokenCounts: number[] = [];    // 最终的 Token 数列表
  const finalFilesInPatches: string[][] = [];// 最终的包含文件列表

  // --- 处理压缩/分块的结果 ---

  // 情况 A: 裁剪后没有生成任何 patch 块
  if (patchesCompressedListChunks.length === 0) {
    console.log("裁剪后未生成任何 patches。");
    // 即使没有 patch，也报告删除的文件。剩余文件是所有最初有 patch 的文件。
    const allFilesWithPatches = diffFiles
      .filter(f => f.patch !== null)
      .map(f => f.filename);
    const result: HandleLargeDiffResult = {
      patches: [], totalTokens: [], filesInPatches: [], // 空列表
      deletedFiles: deletedFilesList,                   // 报告删除的文件
      status: 'empty'                                 // 状态为 empty
    };
    if (returnRemainingFiles) {
      result.remainingFiles = allFilesWithPatches;    // 剩余文件是所有带 patch 的文件
    }
    return result;
  }

  // 情况 B: largePrHandling 模式，并且生成了至少一个块
  if (largePrHandling && patchesCompressedListChunks.length > 0) {
    console.log(`大型 PR 处理模式生成了 ${patchesCompressedListChunks.length} 个 patch 块。`);
    // 遍历每个生成的块
    patchesCompressedListChunks.forEach((chunk, i) => {
      finalPatchesStrings.push(chunk.join("\n")); // 将块内的 patch 字符串连接成一个大字符串
      finalTokenCounts.push(totalTokensList[i]);      // 添加该块的 Token 数
      finalFilesInPatches.push(filesInPatchesList[i]);// 添加该块包含的文件列表
    });

    // 构造结果
    const result: HandleLargeDiffResult = {
      patches: finalPatchesStrings,      // 包含多个 patch 块字符串
      totalTokens: finalTokenCounts,     // 每个块的 Token
      filesInPatches: finalFilesInPatches, // 每个块的文件
      deletedFiles: deletedFilesList,      // 所有删除的文件
      status: 'pruned_multiple'        // 状态为多块裁剪
    };
    if (returnRemainingFiles) {
      result.remainingFiles = remainingFilesListFinal; // 添加最终剩余的文件列表
    }
    return result; // 返回多块结果
  }
  // 情况 C: 非 largePrHandling 模式，或 largePrHandling 只生成了一个块
  else {
    console.log("作为单个裁剪后的 patch 处理 (或者 large_pr_handling 只生成了一个块)。");
    // 获取第一个（也是唯一一个，或被当作唯一一个处理的）块的信息
    const firstChunkPatches = patchesCompressedListChunks[0]; // 第一个块的 patch 列表
    let currentTokens = totalTokensList[0];                   // 第一个块的基础 Token 数
    const firstChunkFiles = filesInPatchesList[0];          // 第一个块包含的文件列表

    // 从第一个块的内容开始
    let finalDiffStr = firstChunkPatches.join("\n");

    // 计算未包含在此第一个块中的文件 = 所有带 patch 的文件 - 第一个块中的文件
    const allFilesWithPatchesSet = new Set(diffFiles.filter(f => f.patch !== null).map(f => f.filename));
    const filesInFirstChunkSet = new Set(firstChunkFiles);
    // 获取差集，得到未包含的文件名
    const filesNotInChunk = [...allFilesWithPatchesSet].filter(filename => !filesInFirstChunkSet.has(filename));

    // --- 尝试在剩余空间添加文件摘要 ---
    // 检查相对于硬限制的可用 Token
    let availableTokens = hardTokenLimit - currentTokens;
    console.log(`第一个块使用的 Tokens: ${currentTokens}。可用于摘要的 Tokens: ${availableTokens}`);

    // 准备临时列表存储未包含的已添加/已修改文件
    const tempAdded: string[] = [];
    const tempModified: string[] = [];

    // 对未包含的文件进行排序以确保输出一致性
    filesNotInChunk.sort();

    // 分类未包含的文件
    for (const filename of filesNotInChunk) {
      const fileInfo = fileDict[filename];
      if (!fileInfo) continue; // 跳过没有信息的

      if (fileInfo.edit_type === EDIT_TYPE.ADDED) {
        tempAdded.push(filename);
      } else if (fileInfo.edit_type === EDIT_TYPE.MODIFIED || fileInfo.edit_type === EDIT_TYPE.RENAMED) {
        tempModified.push(filename);
      }
    }

    let summaryAdded = false; // 标记是否成功添加了任何摘要
    // 配置 clipTokens，使其尝试按行裁剪摘要列表
    const clipOptions = { deleteLastLine: true, tokenHandler: tokenHandler };

    // 尝试添加 "其他新增文件" 摘要
    if (tempAdded.length > 0) {
      const addedListStr = `${ADDED_FILES_}\n- ${tempAdded.join("\n- ")}`; // 格式化列表字符串
      // 裁剪摘要字符串以适应可用 Token
      const addedListStrClipped = clipTokens(addedListStr, availableTokens, clipOptions);
      // 如果裁剪后仍有内容且不是省略号
      if (addedListStrClipped && addedListStrClipped !== "...") {
        const summaryStrToAppend = "\n\n" + addedListStrClipped; // 添加分隔符
        const tokensAdded = tokenHandler.countTokens(summaryStrToAppend); // 计算摘要的 Token
        // 再次检查添加后是否仍在可用 Token 内
        if (availableTokens - tokensAdded >= 0) {
          finalDiffStr += summaryStrToAppend; // 添加摘要
          currentTokens += tokensAdded;        // 更新当前 Token
          availableTokens -= tokensAdded;       // 更新可用 Token
          summaryAdded = true;                 // 标记成功添加
          console.log(`添加了 '新增文件' 摘要 (${tokensAdded} tokens)。当前 tokens: ${currentTokens}`);
        } else {
          console.log("空间不足以添加 '新增文件' 摘要 (裁剪后检查失败)。");
        }
      } else {
        console.log("空间不足以添加 '新增文件' 摘要 (裁剪前或裁剪结果为 '...')。");
      }
    }


    // 尝试添加 "其他修改文件" 摘要 (如果还有可用 Token)
    if (tempModified.length > 0 && availableTokens > 0) {
      const modifiedListStr = `${MORE_MODIFIED_FILES_}\n- ${tempModified.join("\n- ")}`;
      const modifiedListStrClipped = clipTokens(modifiedListStr, availableTokens, clipOptions);
      if (modifiedListStrClipped && modifiedListStrClipped !== "...") {
        const summaryStrToAppend = "\n\n" + modifiedListStrClipped;
        const tokensAdded = tokenHandler.countTokens(summaryStrToAppend);
        if (availableTokens - tokensAdded >= 0) {
          finalDiffStr += summaryStrToAppend;
          currentTokens += tokensAdded;
          availableTokens -= tokensAdded;
          summaryAdded = true;
          console.log(`添加了 '修改文件' 摘要 (${tokensAdded} tokens)。当前 tokens: ${currentTokens}`);
        } else {
          console.log("空间不足以添加 '修改文件' 摘要 (裁剪后检查失败)。");
        }
      } else {
        console.log("空间不足以添加 '修改文件' 摘要 (裁剪前或裁剪结果为 '...')。");
      }
    }

    // 尝试添加 *所有* 被删除文件的摘要 (如果还有可用 Token)
    if (deletedFilesList.length > 0 && availableTokens > 0) {
      const sortedDeletedFiles = [...deletedFilesList].sort(); // 排序删除文件列表
      const deletedSummaryStr = `${DELETED_FILES_}\n- ${sortedDeletedFiles.join("\n- ")}`;
      const deletedSummaryClipped = clipTokens(deletedSummaryStr, availableTokens, clipOptions);
      if (deletedSummaryClipped && deletedSummaryClipped !== "...") {
        const summaryStrToAppend = "\n\n" + deletedSummaryClipped;
        const tokensAdded = tokenHandler.countTokens(summaryStrToAppend);
        if (availableTokens - tokensAdded >= 0) {
          finalDiffStr += summaryStrToAppend;
          currentTokens += tokensAdded;
          // availableTokens -= tokensAdded; // 不再需要更新可用 Token，因为这是最后一步
          summaryAdded = true;
          console.log(`添加了 '删除文件' 摘要 (${tokensAdded} tokens)。当前 tokens: ${currentTokens}`);
        } else {
          console.log("空间不足以添加 '删除文件' 摘要 (裁剪后检查失败)。");
        }
      } else {
        console.log("空间不足以添加 '删除文件' 摘要 (裁剪前或裁剪结果为 '...')。");
      }
    }

    // 记录最终 Token（如果添加了摘要，则为更新后的 Token）
    if (summaryAdded) {
      console.log(`包含摘要的单个裁剪 patch 的最终 tokens: ${currentTokens}`);
    } else {
      console.log(`单个裁剪 patch 的最终 tokens (未添加摘要): ${currentTokens}`);
    }

    // 将最终的 patch 字符串和 Token 数添加到结果列表
    finalPatchesStrings.push(finalDiffStr);
    finalTokenCounts.push(currentTokens); // 使用更新后的 Token 数
    finalFilesInPatches.push(firstChunkFiles); // 包含的文件是第一个块的文件

    // 构造结果
    const result: HandleLargeDiffResult = {
      patches: finalPatchesStrings,      // 单个 patch 块字符串
      totalTokens: finalTokenCounts,     // 最终 Token 数
      filesInPatches: finalFilesInPatches, // 第一个块的文件
      deletedFiles: deletedFilesList,      // 报告所有删除的文件
      status: 'pruned_single'        // 状态为单块裁剪
    };
    // 如果需要，添加未包含的文件列表（即 filesNotInChunk）
    if (returnRemainingFiles) {
      result.remainingFiles = filesNotInChunk;
    }
    return result; // 返回单块裁剪的结果
  }
}


// ==========================================================================
// 示例用法 (Example Usage)
// ==========================================================================

// 这个块替换了 Python 中的 `if __name__ == '__main__':` 结构
function runExampleUsage() {
  console.log("\n--- 开始运行示例用法 ---");

  // --- 创建模拟数据 ---
  const mockDiffFiles: FilePatchInfo[] = [
    { filename: 'file1.py', patch: '+'.repeat(500), edit_type: EDIT_TYPE.ADDED },
    { filename: 'file2.py', patch: '-'.repeat(100) + '\n' + '+'.repeat(600), edit_type: EDIT_TYPE.MODIFIED },
    { filename: 'file3.txt', patch: '+'.repeat(700), edit_type: EDIT_TYPE.ADDED },
    { filename: 'deleted_file.js', patch: null, edit_type: EDIT_TYPE.DELETED }, // 删除的文件没有 patch 内容
    { filename: 'file4_long.py', patch: '+'.repeat(2000), edit_type: EDIT_TYPE.ADDED }, // 一个可能导致超限的长文件
    { filename: 'file5.py', patch: '+'.repeat(300), edit_type: EDIT_TYPE.ADDED },
  ];

  const mockPrLanguages: LanguageInfo[] = [
    { language: 'Python', files: ['file1.py', 'file2.py', 'file4_long.py', 'file5.py'] },
    { language: 'JavaScript', files: ['deleted_file.js'] },
    { language: 'Text', files: ['file3.txt'] },
  ];

  // 使用 TiktokenHandler。请确保已安装 @dqbd/tiktoken。
  console.log("使用 TiktokenHandler (cl100k_base 编码)。");
  const tokenHandler = new TiktokenHandler(100); // 假设 prompt 本身占用 100 tokens

  // 示例模型名称，这将决定 getMaxTokens 返回 4096
  const mockModel = "gpt-3.5-turbo";

  // --- 场景 1: 标准处理 (不启用 largePrHandling) ---
  // 预期行为：如果 Token 超限，会裁剪为单个 patch (pruned_single)；否则返回完整 patch (full)。
  console.log("\n--- 运行场景 1: 标准处理 (预期 pruned_single 或 full) ---");
  const result1 = handleLargeDiff(
    mockDiffFiles,
    mockPrLanguages,
    tokenHandler, // 使用 Tiktoken 处理器
    mockModel,
    {
      largePrHandling: false,       // 不启用大型 PR 模式
      returnRemainingFiles: true // 要求返回剩余文件列表
    }
  );
  console.log("\n结果 1:");
  console.log(`状态: ${result1.status}`);
  console.log(`生成的 patch 数量: ${result1.patches.length}`);
  if (result1.patches.length > 0) {
    // console.log(`第一个 patch 内容预览:\n${result1.patches[0].substring(0, 500)}...`); // 取消注释以查看内容
    pass; // 相当于 Python 的 pass，此处无操作
  }
  console.log(`每个 patch 的 Tokens: ${result1.totalTokens}`);
  console.log(`每个 patch 包含的文件: ${JSON.stringify(result1.filesInPatches)}`);
  console.log(`删除的文件: ${result1.deletedFiles}`);
  console.log(`剩余的文件: ${result1.remainingFiles}`);


  // --- 场景 2: 大型 PR 处理 (启用 largePrHandling) ---
  // 预期行为：如果 Token 超限，可能会分割成多个 patch (pruned_multiple)；否则返回完整 patch (full)。
  console.log("\n--- 运行场景 2: 大型 PR 处理 (预期 pruned_multiple 或 full) ---");
  const result2 = handleLargeDiff(
    mockDiffFiles,
    mockPrLanguages,
    tokenHandler, // 使用 Tiktoken 处理器
    mockModel,
    {
      largePrHandling: true,        // 启用大型 PR 模式
      returnRemainingFiles: true, // 要求返回剩余文件列表
      maxAiCalls: 3               // 限制最多生成 3 个 patch 块
    }
  );
  console.log("\n结果 2:");
  console.log(`状态: ${result2.status}`);
  console.log(`生成的 patch 数量: ${result2.patches.length}`);
  // 遍历打印每个 patch 的信息
  result2.patches.forEach((patchStr, i) => {
    console.log(`  Patch ${i + 1} Tokens: ${result2.totalTokens[i]}`);
    // console.log(`  Patch ${i + 1} 内容预览:\n${patchStr.substring(0, 300)}...`); // 取消注释以查看内容
    console.log(`  Patch ${i + 1} 包含的文件: ${JSON.stringify(result2.filesInPatches[i])}`);
  });
  console.log(`删除的文件: ${result2.deletedFiles}`);
  console.log(`剩余的文件: ${result2.remainingFiles}`);

  // --- 场景 3: 小型 diff (标准处理) ---
  // 预期行为：Token 不会超限，应返回完整 patch (full)。
  console.log("\n--- 运行场景 3: 小型 diff (预期 full) ---");
  const smallDiffFiles: FilePatchInfo[] = [ // 使用一个小的 diff 数据集
    { filename: 'small1.py', patch: '+'.repeat(50), edit_type: EDIT_TYPE.ADDED },
    { filename: 'small2.py', patch: '-'.repeat(10) + '\n' + '+'.repeat(60), edit_type: EDIT_TYPE.MODIFIED },
  ];
  const result3 = handleLargeDiff(
    smallDiffFiles,
    mockPrLanguages, // 为简单起见，使用相同的语言信息
    tokenHandler, // 使用 Tiktoken 处理器
    mockModel,
    {
      largePrHandling: false,       // 不启用大型 PR 模式
      returnRemainingFiles: true // 要求返回剩余文件列表
    }
  );
  console.log("\n结果 3:");
  console.log(`状态: ${result3.status}`);
  console.log(`生成的 patch 数量: ${result3.patches.length}`);
  console.log(`每个 patch 的 Tokens: ${result3.totalTokens}`);
  console.log(`每个 patch 包含的文件: ${JSON.stringify(result3.filesInPatches)}`);
  console.log(`删除的文件: ${result3.deletedFiles}`); // 应为空
  console.log(`剩余的文件: ${result3.remainingFiles}`); // 应为空

  // 辅助函数 'pass'，用于在未使用的分支或日志中占位
  function pass() { }
}

// ==========================================================================
// 模块执行入口 (Module Execution Entry Point)
// ==========================================================================

// 如果此脚本是直接执行的（例如，使用 ts-node），则运行示例用法函数
// 这种检查在 TS 模块中不如在 Python 中常见/直接，但此处用于示例目的。
if (typeof require !== 'undefined' && require.main === module) {
  runExampleUsage();
}

// 如果作为模块使用，则导出必要的组件
// 注意：所有需要导出的组件（如 handleLargeDiff, FilePatchInfo 等）都已在它们定义的地方单独使用 `export` 关键字导出。
// 因此，此处的批量导出注释可以保持注释状态或移除。
// export { handleLargeDiff, FilePatchInfo, LanguageInfo, TokenHandler, MockTokenHandler, EDIT_TYPE }; // 已在上方单独导出