export interface FileURI {
    scheme: string;
    path: string;
    fsPath: string;
}

export interface IndexOptions {
    retryIfLastAttemptFailed: boolean;
    ignoreExisting: boolean;
    force?: boolean;
    incremental?: boolean;
    maxConcurrent?: number;
    timeout?: number;
}

export interface SearchResult {
    fqname: string;
    name: string;
    type: string;
    doc: string;
    exported: boolean;
    lang: string;
    file: FileURI;
    summary: string;
    range: {
        startByte: number;
        endByte: number;
        startPoint: {
            row: number;
            col: number;
        };
        endPoint: {
            row: number;
            col: number;
        };
    };
    blugeScore: number;
    heuristicBoostID: string;
    content?: string;
}

export interface CorpusDiff {
    maybeChangedFiles?: boolean;
    changedFiles?: string[];
    millisElapsed?: number;
    lastTimeToIndexMillis?: number;
}

export interface Config {
    index: {
        root: string;
        maxCPUs: number;
        timeout: number;
    };
    search: {
        defaultLimit: number;
        timeout: number;
    };
    symf: {
        path: string;
    };
}

export const defaultConfig: Config = {
    index: {
        root: './.index',
        maxCPUs: 2,
        timeout: 600000 // 10 minutes
    },
    search: {
        defaultLimit: 10,
        timeout: 30000 // 30 seconds
    },
    symf: {
        path: process.env.SYMF_PATH || 'symf' // 优先使用环境变量中的路径
    }
};

export interface IndexState {
    status: 'idle' | 'indexing' | 'failed' | 'completed';
    lastUpdateTime: number;
    lastError?: string;
    progress: {
        totalFiles: number;
        processedFiles: number;
        currentFile?: string;
    };
}

export interface IndexLock {
    scopeDir: FileURI;
    lockFile: FileURI;
    pid: number;
    timestamp: number;
}

export interface IndexMetadata {
    version: string;
    created: number;
    lastUpdated: number;
    totalFiles: number;
    totalSymbols: number;
    lastCommit?: string;
    lastCommitTime?: number;
    lastIndexTime?: number;
    lastIndexDuration?: number;
    lastError?: string;
}

export interface IndexStats {
    totalFiles: number;
    totalSymbols: number;
    totalBytes: number;
    averageFileSize: number;
    largestFile: {
        path: string;
        size: number;
    };
    smallestFile: {
        path: string;
        size: number;
    };
    fileTypes: Record<string, number>;
    lastUpdateTime: number;
}

export interface FileChange {
    path: string;
    type: 'added' | 'modified' | 'deleted';
    timestamp: number;
}

export interface IndexUpdateOptions {
    incremental?: boolean;
    force?: boolean;
    maxConcurrent?: number;
    timeout?: number;
    batchSize?: number;
    cacheEnabled?: boolean;
}

export interface IndexCache {
    version: string;
    fileHashes: Record<string, string>;
    lastUpdateTime: number;
    totalFiles: number;
    totalBytes: number;
}

export interface IndexPerformanceMetrics {
    startTime: number;
    endTime: number;
    duration: number;
    filesProcessed: number;
    bytesProcessed: number;
    averageFileSize: number;
    peakMemoryUsage: number;
    cpuUsage: number;
    ioOperations: {
        reads: number;
        writes: number;
        bytesRead: number;
        bytesWritten: number;
    };
}
