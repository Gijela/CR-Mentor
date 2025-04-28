import { handleLargeDiff, FilePatchInfo, LanguageInfo, EDIT_TYPE, TiktokenHandler } from './diff_handle';
import { largePrDetails } from './getDiffsDetails';

// 辅助函数：根据文件名猜测语言信息
function guessLanguages(files: FilePatchInfo[]): LanguageInfo[] {
  const languages: Record<string, string[]> = {};
  const extensionMap: Record<string, string> = {
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript',
    '.py': 'Python',
    '.java': 'Java',
    '.go': 'Go',
    '.md': 'Markdown',
    '.vue': 'Vue',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.gitignore': 'Ignore',
    '.cursorrules': 'Rules',
  };

  files.forEach(file => {
    const ext = '.' + file.filename.split('.').pop();
    const lang = extensionMap[ext] || 'Unknown';
    if (!languages[lang]) {
      languages[lang] = [];
    }
    languages[lang].push(file.filename);
  });

  return Object.entries(languages).map(([language, files]) => ({ language, files }));
}


// 主测试函数
const test = async () => {
  console.log("初始化 TiktokenHandler...");
  const tokenHandler = new TiktokenHandler(100); // Prompt 占用 100 tokens
  const model = "gpt-3.5-turbo";

  // 定义测试用例
  const testCases = [
    // {
    //   name: "Small PR Test",
    //   data: smallPrDetails,
    //   options: { largePrHandling: true, returnRemainingFiles: true, maxAiCalls: 150 },
    //   expectedStatus: "full" // 预期结果
    // },
    // {
    //   name: "Medium PR Test (Single Patch)",
    //   data: mediumPrDetails,
    //   options: { largePrHandling: true, returnRemainingFiles: true, maxAiCalls: 150 },
    //   expectedStatus: "pruned_single" // 预期结果
    // },
    {
      name: "Large PR Test (Multiple Patches)",
      data: largePrDetails,
      options: { largePrHandling: true, returnRemainingFiles: true, maxAiCalls: 150 },
      expectedStatus: "pruned_multiple" // 预期结果
    },
  ];

  // 循环执行测试用例
  for (const tc of testCases) {
    console.log(`\n\n--- 开始测试: ${tc.name} ---`);
    console.log(`选项: ${JSON.stringify(tc.options)}`);
    console.log(`预期状态: ${tc.expectedStatus}`);

    const diffFiles = tc.data.data.files.map(file => ({
      ...file,
      patch: file.status === EDIT_TYPE.DELETED ? null : file.patch,
      edit_type: file.status as EDIT_TYPE,
    })) as FilePatchInfo[];
    const prLanguages = guessLanguages(diffFiles); // 基于当前数据猜测语言
    // console.log('prLanguages: ', prLanguages);

    console.log(`调用 handleLargeDiff 处理 ${diffFiles.length} 个文件变更...`);
    const result = handleLargeDiff(
      diffFiles,
      prLanguages,
      tokenHandler,
      model,
      tc.options
    );

    // console.log('result ===> ', result);

    console.log("\n--- 处理结果 ---");
    console.log(`实际状态: ${result.status} (${result.status === tc.expectedStatus ? "符合预期" : "不符合预期!"})`);
    console.log(`生成的 Patch 块数量: ${result.patches.length}`);
    if (result.patches.length > 0) {
      console.log(`每个 Patch 块的 Tokens: ${result.totalTokens.join(', ')}`);
      console.log(`每个 Patch 块包含的文件数量: ${result.filesInPatches.map(f => f.length).join(', ')}`);
      // console.log(`第一个 Patch 内容预览 (前 100 字符):\n${result.patches[0].substring(0, 100)}...`);
    }
    console.log(`检测到的删除文件: ${result.deletedFiles.join(', ') || '无'}`);
    if (tc.options.returnRemainingFiles) {
      console.log(`未包含在 Patch 中的文件: ${result.remainingFiles?.join(', ') || '无'}`);
    }
    // console.log("\n完整结果 (JSON):");
    // console.log(JSON.stringify(result, null, 2));
    console.log(`--- 测试结束: ${tc.name} ---`);
  }
};

// 执行测试
test().catch(console.error);