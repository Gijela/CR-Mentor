import { CodeIndexer } from './core/indexer';
import { CodeSearcher } from './core/searcher';
import path from 'path';
import { createFileURI } from './utils/file';
import { IndexStateManager } from './core/index-state';
import { IndexUpdateOptions } from './core/types';

async function main() {
  // 假设 CodeIndexer 和 CodeSearcher 的构造函数现在接受 Config 类型
  // (我们可能需要稍后调整 Config 和构造函数)
  const indexer = new CodeIndexer({
    index: { root: path.join(__dirname, '.index'), maxCPUs: 4, timeout: 600000 },
    search: { defaultLimit: 10, timeout: 30000 },
    symf: { path: path.join(__dirname, '../node_modules/.bin/symf') },
  });
  const searcher = new CodeSearcher(indexer);
  const stateManager = new IndexStateManager(path.join(__dirname, '.index'));

  try {
    const searchRoot = path.join(__dirname, '../'); // 搜索 project-B 自身的代码
    console.log(`搜索范围: ${searchRoot}`);
    const scopeDir = createFileURI(searchRoot); // 这是 FileURI

    // 检查索引状态
    const initialState = await stateManager.getState(scopeDir);
    console.log('\n当前索引状态:', initialState ? JSON.stringify(initialState, null, 2) : '无');

    // 1. 初始索引
    console.log('\n开始创建索引...');
    await indexer.ensureIndex(scopeDir);
    console.log('索引创建完成！');

    // 2. 增量更新
    console.log('\n开始增量更新索引...');
    const updateOptions: IndexUpdateOptions = {
      incremental: true,
      batchSize: 50,
      maxConcurrent: 2,
      cacheEnabled: true
    };
    await indexer.updateIndex(scopeDir, updateOptions);
    console.log('增量更新完成！');

    // 检查最终状态
    const finalState = await stateManager.getState(scopeDir);
    console.log('\n索引完成状态:', finalState ? JSON.stringify(finalState, null, 2) : '无');

    // 获取索引元数据
    const metadata = await stateManager.getMetadata(scopeDir);
    console.log('\n索引元数据:', metadata ? JSON.stringify(metadata, null, 2) : '无');

    // 获取索引统计信息
    const stats = await stateManager.getStats(scopeDir);
    console.log('\n索引统计信息:', stats ? JSON.stringify(stats, null, 2) : '无');

    // 3. 搜索测试
    const query = 'CodeSearcher';
    console.log(`\n搜索包含 "${query}" 的代码：`);
    const searchResults = await searcher.getResults(query, [scopeDir]);
    const flatResults = searchResults.flat();
    console.log(`找到 ${flatResults.length} 个结果：`);
    flatResults.forEach((result, i) => {
      console.log(`--- 结果 ${i + 1} ---`);
      console.log(`  文件: ${result.file.path}`);
      console.log(`  行号: ${result.range.startPoint.row + 1}`);
      console.log(`  评分: ${result.blugeScore}`);
      console.log(`  名称: ${result.name}`);
      console.log(`  类型: ${result.type}`);
      console.log('  代码片段:');
      if (result.content) {
        const indentedContent = result.content.split('\n').map(line => `    ${line}`).join('\n');
        console.log(indentedContent);
      } else {
        console.log('    [无法获取代码片段]');
      }
      console.log('------------------');
    });

    // 4. 实时搜索测试
    console.log('\n开始实时搜索...');
    const liveQuery = 'function example';
    const liveFile = path.join(__dirname, 'example.ts');
    console.log(`实时搜索:
    - 查询: "${liveQuery}"
    - 文件: ${liveFile}`);
    const liveStartTime = Date.now();
    const liveResults = await searcher.getLiveResults(
      liveQuery,
      'example',
      [liveFile]
    );
    const liveEndTime = Date.now();
    console.log(`实时搜索完成:
    - 耗时: ${(liveEndTime - liveStartTime) / 1000}秒
    - 结果数量: ${liveResults.length}`);
    console.log('实时搜索结果:', JSON.stringify(liveResults, null, 2));

    // 暂时注释掉更新和删除，聚焦搜索结果
    /*
    console.log('\n开始更新索引...');
    await indexer.updateIndex(scopeDir); // 确保 updateIndex 接受 FileURI
    console.log('索引更新完成');

    console.log('\n开始删除索引...');
    await indexer.deleteIndex(scopeDir); // 确保 deleteIndex 接受 FileURI
    console.log('索引删除完成');
    */

  } catch (error) {
    console.error('发生错误:', error);
  } finally {
    // 清理索引部分保持注释
    // const scopeDir = createFileURI(path.join(__dirname, '../'));
    // await indexer.deleteIndex(scopeDir);
    // console.log('\n索引已清理');
  }
}

// 运行示例
main().catch(console.error);
