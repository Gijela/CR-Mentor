import { FileURI, IndexCache } from './types';
import { createFileURI, readFileContent, writeFileContent, deleteFile } from '../utils/file';
import { joinPath } from '../utils/file';
import { createHash } from 'crypto';
import { promisify } from 'util';
import { readFile } from 'fs';
import * as fs from 'fs';

const readFileAsync = promisify(readFile);

export class IndexCacheManager {
    private static readonly CACHE_FILE = 'cache.json';
    private static readonly CACHE_VERSION = '1.0';

    constructor(private indexRoot: string) {}

    private getCacheFilePath(scopeDir: FileURI): FileURI {
        return createFileURI(joinPath(this.indexRoot, scopeDir.path, IndexCacheManager.CACHE_FILE));
    }

    private async calculateFileHash(filePath: string): Promise<string> {
        const content = await readFileAsync(filePath);
        return createHash('sha256').update(content).digest('hex');
    }

    async getCache(scopeDir: FileURI): Promise<IndexCache | null> {
        try {
            const content = await readFileContent(this.getCacheFilePath(scopeDir));
            const cache: IndexCache = JSON.parse(content);
            
            // 验证缓存版本
            if (cache.version !== IndexCacheManager.CACHE_VERSION) {
                return null;
            }

            return cache;
        } catch {
            return null;
        }
    }

    async setCache(scopeDir: FileURI, cache: IndexCache): Promise<void> {
        const cacheWithVersion = {
            ...cache,
            version: IndexCacheManager.CACHE_VERSION
        };
        await writeFileContent(this.getCacheFilePath(scopeDir), JSON.stringify(cacheWithVersion));
    }

    async updateFileHash(scopeDir: FileURI, fileUri: FileURI): Promise<void> {
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

    async getFileHash(scopeDir: FileURI, fileUri: FileURI): Promise<string | null> {
        const cache = await this.getCache(scopeDir);
        return cache?.fileHashes[fileUri.path] || null;
    }

    async hasFileChanged(scopeDir: FileURI, fileUri: FileURI): Promise<boolean> {
        const oldHash = await this.getFileHash(scopeDir, fileUri);
        if (!oldHash) {
            return true;
        }

        const newHash = await this.calculateFileHash(fileUri.fsPath);
        return oldHash !== newHash;
    }

    async clearCache(scopeDir: FileURI): Promise<void> {
        const cacheFile = this.getCacheFilePath(scopeDir);
        try {
            await deleteFile(cacheFile);
        } catch (error) {
            console.error('清除缓存失败:', error);
        }
    }

    async getChangedFiles(scopeDir: FileURI, files: string[]): Promise<string[]> {
        const changedFiles: string[] = [];
        for (const file of files) {
            try {
                const fileUri = createFileURI(joinPath(scopeDir.fsPath, file));
                const stats = await fs.promises.stat(fileUri.fsPath);
                if (stats.isFile() && await this.hasFileChanged(scopeDir, fileUri)) {
                    changedFiles.push(file);
                }
            } catch (error) {
                console.error(`检查文件 ${file} 时发生错误:`, error);
            }
        }
        return changedFiles;
    }
} 