import { CodeIndexer } from './core/indexer';
import { CodeSearcher } from './core/searcher';
import { Config, defaultConfig, FileURI, SearchResult } from './core/types';
import { createFileURI } from './utils/file';

export class CodeSearch {
    private indexer: CodeIndexer;
    private searcher: CodeSearcher;

    constructor(config: Config = defaultConfig) {
        this.indexer = new CodeIndexer(config);
        this.searcher = new CodeSearcher(this.indexer);
    }

    // 创建索引
    async createIndex(directory: string, options = { retryIfLastAttemptFailed: false, ignoreExisting: false }): Promise<void> {
        const scopeDir = createFileURI(directory);
        await this.indexer.ensureIndex(scopeDir, options);
    }

    // 更新索引
    async updateIndex(directory: string): Promise<void> {
        const scopeDir = createFileURI(directory);
        await this.indexer.ensureIndex(scopeDir, {
            retryIfLastAttemptFailed: true,
            ignoreExisting: true
        });
    }

    // 删除索引
    async deleteIndex(directory: string): Promise<void> {
        const scopeDir = createFileURI(directory);
        await this.indexer.deleteIndex(scopeDir);
    }

    // 搜索代码
    async search(query: string, directories: string[]): Promise<SearchResult[]> {
        const scopeDirs = directories.map(dir => createFileURI(dir));
        const results = await this.searcher.getResults(query, scopeDirs);
        return results.flat();
    } 

    // 实时搜索
    async liveSearch(query: string, keywordQuery: string, files: string[]): Promise<SearchResult[]> {
        return this.searcher.getLiveResults(query, keywordQuery, files);
    }
}

// 导出类型
export * from './core/types';
