import { TokenHandler } from "./tokenCalculate";
import { EDIT_TYPE, GeneratePatchAndCalculateTokenResult, HandleLargeDiffResult } from "./types";
import { FileObject } from "@/controller/github/types";

/**
 * 生成扩展后的 diff patches 并计算 Token 数量。
 */
export function extendPatchAndCalcToken(
  tokenHandler: TokenHandler, // 用于计算 Token 的处理器
  diffFiles: FileObject[] // 包含所有文件差异信息的列表
): GeneratePatchAndCalculateTokenResult {
  const patchesExtended: string[] = []; // 存储生成的扩展 patch 字符串
  const patchesExtendedTokens: Record<string, number> = {}; // 记录每个文件 patch 的 Token 数
  let totalTokens = tokenHandler.promptTokens; // 初始化总 Token 数 (包含 prompt 的 Token)

  // 遍历排序后的文件
  for (const file of diffFiles) {
    const patch = file.patch;
    const filename = file.filename || 'unknown_file';

    // 跳过没有 patch 内容的文件，除非它们是被删除的文件
    if (patch === null && file.status !== EDIT_TYPE.DELETED) {
      continue;
    }

    // 处理删除的文件（它们计入文件列表，但不贡献 patch 内容的 Token）
    if (file.status === EDIT_TYPE.DELETED) {
      patchesExtendedTokens[filename] = 0; // 删除文件的 patch Token 成本为 0
      continue; // 处理下一个文件
    }

    // 对于非删除文件，期望有 patch 内容
    // 类型系统有所帮助，但如果需要，可以显式检查 null/undefined
    // 理论上如果上面的检查正确，不应发生
    if (patch === null || patch === undefined) {
      continue;
    }

    // 仅添加一个文件头, 作为扩展 patch 的开始, 后续可以考虑添加 patch 位置上下几行
    let extendedPatch = `## File: '${filename}'\n${patch || ''} \n`;

    // 计算这个扩展 patch 的 Token 数
    const patchTokens = tokenHandler.countTokens(extendedPatch);
    patchesExtended.push(extendedPatch); // 添加到列表
    patchesExtendedTokens[filename] = patchTokens; // 记录 Token 数
    totalTokens += patchTokens; // 累加总 Token 数
  }

  return { patchesExtended, totalTokens, patchesExtendedTokens };
}


/**
 * 根据 Token 限制生成压缩的 diff 块。
 * 当完整的扩展 diff 超出限制时，此函数被调用。
 * 如果 largePrHandling 为 true，则可能生成多个块。
 */
export function generateCompressedDiff(
  modelMaxToken: number, // 模型允许的最大 Token 数
  outputBufferTokensHardThreshold: number, // 输出缓冲区 Token 硬限制
  tokenHandler: TokenHandler,            // Token 处理器
  largePrHandling: boolean,              // 是否启用大型 PR 处理模式（允许多个块）
  diffFiles: FileObject[],            // 所有文件的差异信息
  maxAiCalls: number = 5                 // 允许生成的最大块数 (来自 PRDescription 设置的默认值)
): {
  patchesList: string[][];              // 块列表，每个块是 patch 字符串列表
  totalTokensList: number[];            // 每个块的总 Token 数列表
  deletedFilesList: string[];           // 所有被删除文件的名称列表
  remainingFilesList: string[];         // 未包含在任何块中的（有 patch 的）文件列表
  fileDict: Record<string, FileObject>; // 文件名字典
  filesInPatchesList: string[][];       // 块列表，每个块是其包含的文件名列表
} {
  const patchesList: string[][] = [];       // 初始化块列表
  const totalTokensList: number[] = [];     // 初始化 Token 数列表
  let deletedFilesList: string[] = [];      // 初始化删除文件列表
  let filesInPatchesList: string[][] = []; // 初始化块内文件列表

  // 创建文件名字典以便快速查找，并存储编辑类型
  const fileDict: Record<string, FileObject> = {};
  diffFiles.forEach(f => { fileDict[f.filename] = f; });

  // 需要处理的文件应该是那些有实际 patch 内容的文件, 过滤出有 patch 的文件, 然后获取文件名列表
  const filesToProcessNames = diffFiles.filter(f => f.patch).map(f => f.filename);

  // 在所有块之间全局跟踪剩余文件
  let remainingFilesList = [...filesToProcessNames];

  // 收集所有被删除文件的名称
  deletedFilesList = diffFiles
    .filter(f => f.status === EDIT_TYPE.DELETED)
    .map(f => f.filename);

  // 确定允许的 patch 生成迭代次数
  let numAllowedIterations: number;
  if (largePrHandling) {
    // 假设 maxAiCalls 是生成 patch 块的限制
    numAllowedIterations = maxAiCalls;
  } else {
    numAllowedIterations = 1; // 如果不是 large_pr_handling，只生成一个块
  }

  // 循环生成 patch 块
  for (let i = 0; i < numAllowedIterations; i++) {
    // 如果没有剩余文件需要处理，则停止
    if (remainingFilesList.length === 0) {
      break;
    }

    // 调用 generateFullPatch 生成下一个 patch 块
    const {
      totalTokens: chunkTotalTokens, // 当前块的 Token 数
      patches: chunkPatches, // 当前块的 patch 字符串列表
      remainingFiles: remainingFilesAfterChunk, // 处理完当前块后剩余的文件
      filesInPatch: chunkFilesInPatch // 当前块包含的文件名列表
    } = generateFullPatch(
      fileDict, modelMaxToken, outputBufferTokensHardThreshold, remainingFilesList, tokenHandler
    );

    // 更新全局剩余文件列表
    remainingFilesList = remainingFilesAfterChunk;

    // 如果生成了内容，则添加到结果列表中
    if (chunkPatches.length > 0) {
      patchesList.push(chunkPatches);             // 添加 patch 列表
      totalTokensList.push(chunkTotalTokens);     // 添加 Token 数
      filesInPatchesList.push(chunkFilesInPatch); // 添加包含的文件列表
    } else {
      console.log(`迭代 ${i + 1}: 未生成 patch 内容 (可能是剩余文件过大)。`);
      // 如果本次迭代未生成任何 patch，则停止尝试。
      break;
    }
  }

  // 返回所有生成的信息
  return { patchesList, totalTokensList, deletedFilesList, remainingFilesList, fileDict, filesInPatchesList };
}


/**
 * 生成一个包含来自 filesToProcess 中文件 diff 的 patch 块，
 * 直到接近 maxTokensModel（模型的最大 Token 限制）。
 */
export function generateFullPatch(
  fileDict: Record<string, FileObject>, // 文件名字典，方便查找文件信息
  modelMaxToken: number,                // 模型允许的最大 Token 数
  outputBufferTokensHardThreshold: number, // 输出缓冲区 Token 硬限制
  filesToProcess: string[],              // 需要处理的文件名列表
  tokenHandler: TokenHandler             // Token 处理器
): { totalTokens: number; patches: string[]; remainingFiles: string[]; filesInPatch: string[] } {

  const patches: string[] = [];           // 存储此块中的 patch 字符串
  const filesInPatch: string[] = [];      // 存储此块中包含的文件名
  // 从 prompt tokens + 一个小的缓冲区开始，作为文件间的分隔符/安全边际
  let totalTokens = tokenHandler.promptTokens + 10; // 添加小缓冲区
  let remainingFiles = [...filesToProcess]; // 复制列表，存储此块处理后剩余的文件

  let processedAFile = false; // 标记是否已成功处理至少一个文件
  // 当还有剩余文件需要处理时循环
  while (remainingFiles.length > 0) {
    const filename = remainingFiles[0]; // 按顺序处理第一个文件
    const fileInfo = fileDict[filename]; // 从字典获取文件信息

    // 如果没有文件信息或没有 patch 内容（被删除的文件理论上不应在此处传入 filesToProcess）则跳过
    if (!fileInfo || !fileInfo.patch) {
      remainingFiles.shift(); // 从剩余列表中移除
      continue;
    }

    const patchContent = fileInfo.patch; // 获取 patch 内容
    const patchWithHeader = `## File: '${filename}'\n${patchContent}\n`; // 创建带文件头的 patch 字符串

    // 估算此文件 patch 的 Token 成本 + 一个小的分隔符成本
    const patchTokens = tokenHandler.countTokens(patchWithHeader) + 2; // 添加缓冲区

    // 检查添加此文件是否会超过限制
    // 允许至少添加一个文件，即使它最初略微超过限制
    // 此处使用硬阈值，因为这是生成核心内容的部分
    const currentHardLimit = modelMaxToken - outputBufferTokensHardThreshold;
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
  }

  // 根据实际内容 + prompt 重新计算最终 Token，不包括文件间的缓冲区
  const finalContent = patches.join("\n"); // 使用换行符作为分隔符连接所有 patch
  const finalTokens = tokenHandler.promptTokens + tokenHandler.countTokens(finalContent);

  // 返回计算出的总 Token、patch 字符串列表、剩余文件列表、此块包含的文件列表
  return { totalTokens: finalTokens, patches, remainingFiles, filesInPatch };
}

// 裁剪文本以适应最大 Token 限制的占位符函数
export function clipTokens(
  text: string,
  maxTokens: number,
  options: { deleteLastLine?: boolean; tokenHandler: TokenHandler } // 选项：是否删除最后一行（如果被截断），以及使用的 TokenHandler
): string {
  const { deleteLastLine = false, tokenHandler } = options;

  if (!text) return ""; // 空文本直接返回

  // 简单的基于单词的裁剪
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

/* 处理压缩/分块的结果 */
export function handleFormatResult(
  patchesCompressedListChunks: string[][],
  diffFiles: FileObject[],
  deletedFilesList: string[],
  returnRemainingFiles: boolean,
  largePrHandling: boolean,
  totalTokensList: number[],
  filesInPatchesList: string[][],
  remainingFilesListFinal: string[],
  hardTokenLimit: number,
  tokenHandler: TokenHandler,
  fileDict: Record<string, FileObject>
): HandleLargeDiffResult {
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

  // 情况 B: largePrHandling = true 模式，并且生成了至少一个块
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
  // 情况 C: largePrHandling = false 模式，或 largePrHandling 只生成了一个块
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

      if (fileInfo.status === EDIT_TYPE.ADDED) {
        tempAdded.push(filename);
      } else if (fileInfo.status === EDIT_TYPE.MODIFIED || fileInfo.status === EDIT_TYPE.RENAMED) {
        tempModified.push(filename);
      }
    }

    let summaryAdded = false; // 标记是否成功添加了任何摘要
    // 配置 clipTokens，使其尝试按行裁剪摘要列表
    const clipOptions = { deleteLastLine: true, tokenHandler: tokenHandler };

    // 尝试添加 "其他新增文件" 摘要
    if (tempAdded.length > 0) {
      const addedListStr = `其他新增文件:\n- ${tempAdded.join("\n- ")}`; // 格式化列表字符串
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
      const modifiedListStr = `其他修改文件:\n- ${tempModified.join("\n- ")}`;
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
      const deletedSummaryStr = `其他删除文件:\n- ${sortedDeletedFiles.join("\n- ")}`;
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