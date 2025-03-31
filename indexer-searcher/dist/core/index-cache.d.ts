import { FileURI, IndexCache } from './types';
export declare class IndexCacheManager {
    private indexRoot;
    private static readonly CACHE_FILE;
    private static readonly CACHE_VERSION;
    constructor(indexRoot: string);
    private getCacheFilePath;
    private calculateFileHash;
    getCache(scopeDir: FileURI): Promise<IndexCache | null>;
    setCache(scopeDir: FileURI, cache: IndexCache): Promise<void>;
    updateFileHash(scopeDir: FileURI, fileUri: FileURI): Promise<void>;
    getFileHash(scopeDir: FileURI, fileUri: FileURI): Promise<string | null>;
    hasFileChanged(scopeDir: FileURI, fileUri: FileURI): Promise<boolean>;
    clearCache(scopeDir: FileURI): Promise<void>;
    getChangedFiles(scopeDir: FileURI, files: string[]): Promise<string[]>;
}
