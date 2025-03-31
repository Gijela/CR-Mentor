"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSearch = void 0;
const indexer_1 = require("./core/indexer");
const searcher_1 = require("./core/searcher");
const types_1 = require("./core/types");
const file_1 = require("./utils/file");
class CodeSearch {
    constructor(config = types_1.defaultConfig) {
        this.indexer = new indexer_1.CodeIndexer(config);
        this.searcher = new searcher_1.CodeSearcher(this.indexer);
    }
    // 创建索引
    async createIndex(directory, options = { retryIfLastAttemptFailed: false, ignoreExisting: false }) {
        const scopeDir = (0, file_1.createFileURI)(directory);
        await this.indexer.ensureIndex(scopeDir, options);
    }
    // 更新索引
    async updateIndex(directory) {
        const scopeDir = (0, file_1.createFileURI)(directory);
        await this.indexer.ensureIndex(scopeDir, {
            retryIfLastAttemptFailed: true,
            ignoreExisting: true
        });
    }
    // 删除索引
    async deleteIndex(directory) {
        const scopeDir = (0, file_1.createFileURI)(directory);
        await this.indexer.deleteIndex(scopeDir);
    }
    // 搜索代码
    async search(query, directories) {
        const scopeDirs = directories.map(dir => (0, file_1.createFileURI)(dir));
        const results = await this.searcher.getResults(query, scopeDirs);
        return results.flat();
    }
    // 实时搜索
    async liveSearch(query, keywordQuery, files) {
        return this.searcher.getLiveResults(query, keywordQuery, files);
    }
}
exports.CodeSearch = CodeSearch;
// 导出类型
__exportStar(require("./core/types"), exports);
