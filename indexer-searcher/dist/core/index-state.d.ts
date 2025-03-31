import { FileURI, IndexLock, IndexMetadata, IndexState, IndexStats } from './types';
export declare class IndexStateManager {
    private indexRoot;
    private static readonly LOCK_FILE_PREFIX;
    private static readonly METADATA_FILE;
    private static readonly STATS_FILE;
    private static readonly STATE_FILE;
    private static readonly LOCK_TIMEOUT;
    constructor(indexRoot: string);
    private getLockFilePath;
    private getMetadataFilePath;
    private getStatsFilePath;
    private getStateFilePath;
    acquireLock(scopeDir: FileURI): Promise<IndexLock | null>;
    releaseLock(scopeDir: FileURI): Promise<void>;
    getState(scopeDir: FileURI): Promise<IndexState | null>;
    setState(scopeDir: FileURI, state: IndexState): Promise<void>;
    getMetadata(scopeDir: FileURI): Promise<IndexMetadata | null>;
    setMetadata(scopeDir: FileURI, metadata: IndexMetadata): Promise<void>;
    getStats(scopeDir: FileURI): Promise<IndexStats | null>;
    setStats(scopeDir: FileURI, stats: IndexStats): Promise<void>;
    updateProgress(scopeDir: FileURI, progress: IndexState['progress']): Promise<void>;
    markIndexFailed(scopeDir: FileURI, error: string): Promise<void>;
    markIndexCompleted(scopeDir: FileURI): Promise<void>;
}
