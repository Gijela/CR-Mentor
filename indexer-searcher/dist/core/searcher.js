"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSearcher = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const file_1 = require("../utils/file");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class CodeSearcher {
    constructor(indexer) {
        this.indexer = indexer;
    }
    async getResults(userQuery, scopeDirs) {
        return Promise.all(scopeDirs.map(scopeDir => this.getResultsForScopeDir(userQuery, scopeDir)));
    }
    async getResultsForScopeDir(userQuery, scopeDir) {
        console.log('处理目录:', scopeDir.path);
        // 尝试创建/更新索引
        let retryCount = 0;
        const maxRetries = 10;
        while (retryCount < maxRetries) {
            retryCount++;
            console.log(`尝试创建/更新索引 (尝试 ${retryCount}/${maxRetries})`);
            try {
                await this.indexer.ensureIndex(scopeDir, {
                    retryIfLastAttemptFailed: retryCount === 1,
                    ignoreExisting: false,
                });
                break;
            }
            catch (error) {
                console.error(`索引创建失败 (尝试 ${retryCount}/${maxRetries}):`, error);
                if (retryCount === maxRetries) {
                    throw error;
                }
            }
        }
        // 执行搜索
        const symf = this.indexer.getSymfPath();
        const { indexDir } = this.indexer.getIndexDir(scopeDir);
        console.log('执行搜索命令...');
        console.log('- symf 路径:', symf);
        console.log('- 索引目录:', indexDir.path);
        console.log('- 搜索范围:', scopeDir.path);
        console.log('- 搜索关键词:', userQuery);
        try {
            const { stdout } = await execFileAsync(symf, [
                '--index-root', indexDir.path,
                'query',
                '--scopes', scopeDir.path,
                '--fmt', 'json',
                '--boosted-keywords', userQuery,
                userQuery
            ], {
                env: { HOME: process.env.HOME },
                maxBuffer: 1024 * 1024 * 1024,
                timeout: 1000 * 30,
            });
            console.log('搜索命令输出:', stdout);
            return await this.parseAndEnhanceResults(stdout);
        }
        catch (error) {
            console.error('搜索执行失败:', error);
            throw error;
        }
    }
    async getLiveResults(userQuery, keywordQuery, files) {
        const symf = this.indexer.getSymfPath();
        const args = [
            'live-query',
            ...files.flatMap(f => ['-f', f]),
            '--limit',
            files.length < 5 ? `${files.length}` : '5',
            '--fmt',
            'json',
            '--boosted-keywords',
            `${userQuery}`,
            `${keywordQuery}`,
        ];
        console.log('执行实时搜索...');
        console.log('- symf 路径:', symf);
        console.log('- 参数:', args.join(' '));
        try {
            const { stdout } = await execFileAsync(symf, args, {
                env: { HOME: process.env.HOME },
                maxBuffer: 1024 * 1024 * 1024,
                timeout: 1000 * 30,
            });
            console.log('实时搜索原始输出:', stdout);
            return await this.parseAndEnhanceResults(stdout);
        }
        catch (error) {
            console.error('实时搜索失败:', error);
            throw error;
        }
    }
    async parseAndEnhanceResults(stdout) {
        try {
            const rawResults = JSON.parse(stdout);
            const enhancedResults = await Promise.all(rawResults.map(async (result) => {
                const fileUri = (0, file_1.createFileURI)(result.file);
                const content = await (0, file_1.getCodeSnippet)(fileUri.fsPath, result.range);
                return {
                    ...result,
                    file: fileUri,
                    content: content ?? undefined,
                };
            }));
            console.log('解析和增强后的结果数量:', enhancedResults.length);
            return enhancedResults;
        }
        catch (error) {
            console.error('解析 Symf 输出失败:', error, '原始输出:', stdout);
            return [];
        }
    }
}
exports.CodeSearcher = CodeSearcher;
