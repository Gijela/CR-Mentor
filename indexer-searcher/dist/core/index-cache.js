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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexCacheManager = void 0;
const file_1 = require("../utils/file");
const file_2 = require("../utils/file");
const crypto_1 = require("crypto");
const util_1 = require("util");
const fs_1 = require("fs");
const fs = __importStar(require("fs"));
const readFileAsync = (0, util_1.promisify)(fs_1.readFile);
class IndexCacheManager {
    constructor(indexRoot) {
        this.indexRoot = indexRoot;
    }
    getCacheFilePath(scopeDir) {
        return (0, file_1.createFileURI)((0, file_2.joinPath)(this.indexRoot, scopeDir.path, IndexCacheManager.CACHE_FILE));
    }
    async calculateFileHash(filePath) {
        const content = await readFileAsync(filePath);
        return (0, crypto_1.createHash)('sha256').update(content).digest('hex');
    }
    async getCache(scopeDir) {
        try {
            const content = await (0, file_1.readFileContent)(this.getCacheFilePath(scopeDir));
            const cache = JSON.parse(content);
            // 验证缓存版本
            if (cache.version !== IndexCacheManager.CACHE_VERSION) {
                return null;
            }
            return cache;
        }
        catch {
            return null;
        }
    }
    async setCache(scopeDir, cache) {
        const cacheWithVersion = {
            ...cache,
            version: IndexCacheManager.CACHE_VERSION
        };
        await (0, file_1.writeFileContent)(this.getCacheFilePath(scopeDir), JSON.stringify(cacheWithVersion));
    }
    async updateFileHash(scopeDir, fileUri) {
        const cache = await this.getCache(scopeDir) || {
            version: IndexCacheManager.CACHE_VERSION,
            fileHashes: {},
            lastUpdateTime: Date.now(),
            totalFiles: 0,
            totalBytes: 0
        };
        const hash = await this.calculateFileHash(fileUri.fsPath);
        cache.fileHashes[fileUri.path] = hash;
        cache.lastUpdateTime = Date.now();
        await this.setCache(scopeDir, cache);
    }
    async getFileHash(scopeDir, fileUri) {
        const cache = await this.getCache(scopeDir);
        return cache?.fileHashes[fileUri.path] || null;
    }
    async hasFileChanged(scopeDir, fileUri) {
        const oldHash = await this.getFileHash(scopeDir, fileUri);
        if (!oldHash) {
            return true;
        }
        const newHash = await this.calculateFileHash(fileUri.fsPath);
        return oldHash !== newHash;
    }
    async clearCache(scopeDir) {
        const cacheFile = this.getCacheFilePath(scopeDir);
        try {
            await (0, file_1.deleteFile)(cacheFile);
        }
        catch (error) {
            console.error('清除缓存失败:', error);
        }
    }
    async getChangedFiles(scopeDir, files) {
        const changedFiles = [];
        for (const file of files) {
            try {
                const fileUri = (0, file_1.createFileURI)((0, file_2.joinPath)(scopeDir.fsPath, file));
                const stats = await fs.promises.stat(fileUri.fsPath);
                if (stats.isFile() && await this.hasFileChanged(scopeDir, fileUri)) {
                    changedFiles.push(file);
                }
            }
            catch (error) {
                console.error(`检查文件 ${file} 时发生错误:`, error);
            }
        }
        return changedFiles;
    }
}
exports.IndexCacheManager = IndexCacheManager;
IndexCacheManager.CACHE_FILE = 'cache.json';
IndexCacheManager.CACHE_VERSION = '1.0';
