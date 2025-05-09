import { FileObject } from "@/controller/github/types";
import { autoGeneratedFiles, badExtensions, languageExtensionMap } from "./config";

/**
 * @description 检查文件是否有效（非坏后缀、非自动生成）
 * @param {string} filename - 文件名
 * @param {string[]} badExtensions - 不良后缀名列表
 * @param {string[]} autoGeneratedFiles - 自动生成的文件名列表
 * @returns {boolean} 如果文件有效则返回 true，否则返回 false
 */
function isValidFile(
  filename: string,
  badExtensions: string[],
  autoGeneratedFiles: string[]
): boolean {
  if (!filename) {
    return false;
  }
  for (const forbiddenFile of autoGeneratedFiles) {
    if (filename.endsWith(forbiddenFile)) {
      return false;
    }
  }
  const extension = "." + filename.split('.').pop();
  return !badExtensions.includes(extension);
}

// 创建后缀名到语言的映射
function createExtensionLanguageMap(map: Record<string, string[]>): Record<string, string> {
  const extensionMap: Record<string, string> = {};
  for (const [language, extensions] of Object.entries(map)) {
    extensions.forEach(ext => {
      // 注意：如果一个后缀名映射到多种语言，这里会以后面的为准
      extensionMap[ext.toLowerCase()] = language; // 存储小写后缀名
    });
  }
  return extensionMap;
}

/**
 * @description 根据文件列表计算每种语言的总变更量
 * @param {FileObject[]} files - 包含文件名和变更数的文件对象列表
 * @returns {Record<string, number>} 语言到总变更数的映射
 */
function calculateLanguageChanges(files: FileObject[]): Record<string, number> {
  const languageChanges: Record<string, number> = {};
  // 确保 languageExtensionMap 的 key (语言名) 是小写的，以匹配 languagesSortedList
  const lowerCaseLanguageExtensionMap = Object.entries(languageExtensionMap).reduce((acc, [lang, exts]) => {
    acc[lang.toLowerCase()] = exts;
    return acc;
  }, {} as Record<string, string[]>);

  const extensionLanguageMap = createExtensionLanguageMap(lowerCaseLanguageExtensionMap);

  files.forEach(file => {
    // 确保 'changes' 属性存在且为数字
    if (typeof file.changes !== 'number' || isNaN(file.changes)) {
      // console.warn(`File ${file.filename} is missing 'changes' property or it's not a number. Skipping.`);
      return; // 跳过此文件
    }

    if (isValidFile(file.filename, badExtensions, autoGeneratedFiles)) {
      const extension = "." + file.filename.split('.').pop()?.toLowerCase(); // 获取小写后缀名
      if (extension && extensionLanguageMap[extension]) {
        const language = extensionLanguageMap[extension]; // 获取映射的语言名称
        languageChanges[language] = (languageChanges[language] || 0) + file.changes;
      }
      // 未知扩展名或不在 languageExtensionMap 中的文件将被忽略
    }
  });

  return languageChanges;
}

/**
 * @description 根据主要语言对文件列表进行排序，输出扁平化的排序后列表
 * @param {FileObject[]} files - 文件对象列表
 * @returns {FileObject[]} 排序后的扁平文件对象列表
 */
export function sortFilesFlat(files: FileObject[]): FileObject[] {
  const languages = calculateLanguageChanges(files); // { "python": 700, "javaScript": 250, "html": 50 };

  // 1. 语言排序 (同前)
  const languagesSortedList = Object.entries(languages)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([language]) => language);

  // 2. 获取后缀名 (同前)
  const mainExtensions: string[][] = languagesSortedList.map(language =>
    languageExtensionMap[language.toLowerCase()] || []
  );
  const mainExtensionsFlat = new Set(mainExtensions.flat()); // 所有主要后缀名的集合

  // 3. 过滤文件 (同前)
  const filesFiltered = files.filter(f =>
    f.filename && isValidFile(f.filename, badExtensions, autoGeneratedFiles)
  );

  // 4. 处理无语言信息 (直接返回过滤后的列表)
  if (languagesSortedList.length === 0) {
    return filesFiltered;
  }

  // 5. 分类文件，但不创建嵌套结构
  const filesByLanguage = new Map<string, FileObject[]>(); // 存储每个主要语言的文件
  const restFiles: FileObject[] = []; // 存储不属于主要语言的文件

  // 初始化主要语言的文件列表
  languagesSortedList.forEach(lang => {
    filesByLanguage.set(lang, []);
  });

  // 遍历过滤后的文件进行分类
  filesFiltered.forEach(file => {
    const extension = "." + file.filename.split('.').pop();
    let foundLanguage = false;

    // 检查文件是否属于某个主要语言
    for (const lang of languagesSortedList) {
      const langExtensions = new Set(languageExtensionMap[lang.toLowerCase()] || []);
      if (langExtensions.has(extension)) {
        filesByLanguage.get(lang)?.push(file); // 添加到对应语言的列表
        foundLanguage = true;
        break; // 一个文件只属于一个主要语言类别
      }
    }

    // 如果不属于任何主要语言，则添加到 restFiles
    if (!foundLanguage) {
      // 严谨点，再确认下后缀名是否真的不在所有main extension里
      // （虽然上面的循环应该保证了，但以防万一 languageExtensionMap 配置不一致）
      if (!mainExtensionsFlat.has(extension)) {
        restFiles.push(file);
      } else {
        // 这种情况理论上不应发生，如果发生了，说明文件后缀在 mainExtensionsFlat
        // 但没在上面循环中被某个具体语言认领，可能是 languageExtensionMap 配置问题
        // 这里也暂且归入 restFiles
        restFiles.push(file);
        console.warn(`File ${file.filename} with extension ${extension} was in mainExtensionsFlat but not assigned to a specific language.`);
      }
    }
  });

  // 6. 拼接结果数组
  const sortedOutputFiles: FileObject[] = [];

  // 按语言排序顺序添加文件
  languagesSortedList.forEach(lang => {
    const langFiles = filesByLanguage.get(lang) || [];
    sortedOutputFiles.push(...langFiles); // 使用 spread syntax 展开数组并添加
  });

  // 最后添加 "Other" 文件
  sortedOutputFiles.push(...restFiles);

  // 7. 返回扁平化的排序结果
  return sortedOutputFiles;
}
