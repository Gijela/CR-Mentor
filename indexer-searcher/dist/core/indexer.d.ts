import { RWLock } from '../utils/lock';
import { FileURI, IndexOptions, CorpusDiff, Config, IndexUpdateOptions } from './types';
export declare class CodeIndexer {
    private indexRoot;
    private indexLocks;
    private symfPath;
    private stateManager;
    private cacheManager;
    private performanceTracker;
    constructor(config: Config);
    private mustSymfPath;
    getIndexLock(scopeDir: FileURI): RWLock;
    getIndexDir(scopeDir: FileURI): {
        indexDir: FileURI;
        tmpDir: FileURI;
    };
    ensureIndex(scopeDir: FileURI, options?: IndexOptions): Promise<void>;
    private unsafeEnsureIndex;
    unsafeIndexExists(scopeDir: FileURI): Promise<boolean>;
    deleteIndex(scopeDir: FileURI): Promise<void>;
    private unsafeUpsertIndex;
    private markIndexFailed;
    private clearIndexFailure;
    statIndex(scopeDir: FileURI): Promise<CorpusDiff | null>;
    getSymfPath(): string;
    getIndexRoot(): string;
    updateIndex(scopeDir: FileURI, options?: IndexUpdateOptions): Promise<void>;
    private incrementalUpdate;
    private fullUpdate;
    private processBatch;
}
