import { FileURI, IndexLock, IndexMetadata, IndexState, IndexStats } from './types';
import { createFileURI, readFileContent, writeFileContent, deleteFile } from '../utils/file';
import { joinPath, mkdirp, dirnamePath } from '../utils/file';

export class IndexStateManager {
    private static readonly LOCK_FILE_PREFIX = '.lock_';
    private static readonly METADATA_FILE = 'metadata.json';
    private static readonly STATS_FILE = 'stats.json';
    private static readonly STATE_FILE = 'state.json';
    private static readonly LOCK_TIMEOUT = 5 * 60 * 1000; // 5分钟超时

    constructor(private indexRoot: string) {}

    private getLockFilePath(scopeDir: FileURI): FileURI {
        const lockFileName = `${IndexStateManager.LOCK_FILE_PREFIX}${Buffer.from(scopeDir.path).toString('base64')}`;
        return createFileURI(joinPath(this.indexRoot, lockFileName));
    }

    private getMetadataFilePath(scopeDir: FileURI): FileURI {
        return createFileURI(joinPath(this.indexRoot, scopeDir.path, IndexStateManager.METADATA_FILE));
    }

    private getStatsFilePath(scopeDir: FileURI): FileURI {
        return createFileURI(joinPath(this.indexRoot, scopeDir.path, IndexStateManager.STATS_FILE));
    }

    private getStateFilePath(scopeDir: FileURI): FileURI {
        return createFileURI(joinPath(this.indexRoot, scopeDir.path, IndexStateManager.STATE_FILE));
    }

    async acquireLock(scopeDir: FileURI): Promise<IndexLock | null> {
        const lockFile = this.getLockFilePath(scopeDir);
        
        try {
            // 确保锁文件目录存在
            await mkdirp(dirnamePath(lockFile.fsPath));
            
            const content = await readFileContent(lockFile);
            const lock: IndexLock = JSON.parse(content);
            
            // 检查锁是否过期
            if (Date.now() - lock.timestamp > IndexStateManager.LOCK_TIMEOUT) {
                await this.releaseLock(scopeDir);
                return null;
            }

            return lock;
        } catch (error) {
            // 如果锁文件不存在，创建新的锁
            const lock: IndexLock = {
                scopeDir,
                lockFile,
                pid: process.pid,
                timestamp: Date.now()
            };
            await writeFileContent(lockFile, JSON.stringify(lock));
            return lock;
        }
    }

    async releaseLock(scopeDir: FileURI): Promise<void> {
        const lockFile = this.getLockFilePath(scopeDir);
        try {
            await deleteFile(lockFile);
        } catch (error) {
            console.error('释放锁失败:', error);
        }
    }

    async getState(scopeDir: FileURI): Promise<IndexState | null> {
        try {
            const stateFile = this.getStateFilePath(scopeDir);
            await mkdirp(dirnamePath(stateFile.fsPath));
            const content = await readFileContent(stateFile);
            return JSON.parse(content);
        } catch {
            return null;
        }
    }

    async setState(scopeDir: FileURI, state: IndexState): Promise<void> {
        const stateFile = this.getStateFilePath(scopeDir);
        await mkdirp(dirnamePath(stateFile.fsPath));
        await writeFileContent(stateFile, JSON.stringify(state));
    }

    async getMetadata(scopeDir: FileURI): Promise<IndexMetadata | null> {
        try {
            const metadataFile = this.getMetadataFilePath(scopeDir);
            await mkdirp(dirnamePath(metadataFile.fsPath));
            const content = await readFileContent(metadataFile);
            return JSON.parse(content);
        } catch {
            return null;
        }
    }

    async setMetadata(scopeDir: FileURI, metadata: IndexMetadata): Promise<void> {
        const metadataFile = this.getMetadataFilePath(scopeDir);
        await mkdirp(dirnamePath(metadataFile.fsPath));
        await writeFileContent(metadataFile, JSON.stringify(metadata));
    }

    async getStats(scopeDir: FileURI): Promise<IndexStats | null> {
        try {
            const statsFile = this.getStatsFilePath(scopeDir);
            await mkdirp(dirnamePath(statsFile.fsPath));
            const content = await readFileContent(statsFile);
            return JSON.parse(content);
        } catch {
            return null;
        }
    }

    async setStats(scopeDir: FileURI, stats: IndexStats): Promise<void> {
        const statsFile = this.getStatsFilePath(scopeDir);
        await mkdirp(dirnamePath(statsFile.fsPath));
        await writeFileContent(statsFile, JSON.stringify(stats));
    }

    async updateProgress(scopeDir: FileURI, progress: IndexState['progress']): Promise<void> {
        const state = await this.getState(scopeDir);
        if (state) {
            state.progress = progress;
            state.lastUpdateTime = Date.now();
            await this.setState(scopeDir, state);
        }
    }

    async markIndexFailed(scopeDir: FileURI, error: string): Promise<void> {
        const state = await this.getState(scopeDir);
        if (state) {
            state.status = 'failed';
            state.lastError = error;
            state.lastUpdateTime = Date.now();
            await this.setState(scopeDir, state);
        }
    }

    async markIndexCompleted(scopeDir: FileURI): Promise<void> {
        const state = await this.getState(scopeDir);
        if (state) {
            state.status = 'completed';
            state.lastUpdateTime = Date.now();
            await this.setState(scopeDir, state);
        }
    }
} 