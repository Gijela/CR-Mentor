import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import { RWLock } from '../utils/lock';
import { FileURI, IndexOptions, CorpusDiff, Config, IndexState, IndexUpdateOptions, FileChange } from './types';
import {
    fileExists,
    mkdirp,
    writeFileContent,
    deleteFile,
    moveFile,
    joinPath,
    dirnamePath,
    createFileURI,
    readFileContent
} from '../utils/file';
import { IndexStateManager } from './index-state';
import { IndexCacheManager } from './index-cache';
import { IndexPerformanceTracker } from './index-performance';
import { glob } from 'glob';

const execFileAsync = promisify(execFile);

export class CodeIndexer {
    private indexRoot: FileURI;
    private indexLocks: Map<string, RWLock> = new Map();
    private symfPath: string;
    private stateManager: IndexStateManager;
    private cacheManager: IndexCacheManager;
    private performanceTracker: IndexPerformanceTracker;

    constructor(config: Config) {
        this.indexRoot = createFileURI(config.index.root);
        this.symfPath = config.symf.path;
        this.stateManager = new IndexStateManager(config.index.root);
        this.cacheManager = new IndexCacheManager(config.index.root);
        this.performanceTracker = new IndexPerformanceTracker();
    }

    private async mustSymfPath(): Promise<string> {
        if (!this.symfPath) {
            throw new Error('No symf executable found. Please set symf.path in config.');
        }
        return this.symfPath;
    }

    public getIndexLock(scopeDir: FileURI): RWLock {
        const { indexDir } = this.getIndexDir(scopeDir);
        let lock = this.indexLocks.get(indexDir.toString());
        if (lock) {
            return lock;
        }
        lock = new RWLock();
        this.indexLocks.set(indexDir.toString(), lock);
        return lock;
    }

    public getIndexDir(scopeDir: FileURI): { indexDir: FileURI; tmpDir: FileURI } {
        const indexSubdir = scopeDir.path;
        return {
            indexDir: createFileURI(joinPath(this.indexRoot.path, indexSubdir)),
            tmpDir: createFileURI(joinPath(this.indexRoot.path, '.tmp', indexSubdir))
        };
    }

    public async ensureIndex(scopeDir: FileURI, options: IndexOptions = { retryIfLastAttemptFailed: false, ignoreExisting: false }): Promise<void> {
        console.log(`确保索引存在: ${scopeDir.path}`);
        
        // 检查是否有其他进程正在索引
        const existingLock = await this.stateManager.acquireLock(scopeDir);
        if (existingLock && existingLock.pid !== process.pid) {
            throw new Error(`索引已被进程 ${existingLock.pid} 锁定`);
        }

        try {
            await this.unsafeEnsureIndex(scopeDir, options);
        } catch (error) {
            await this.stateManager.markIndexFailed(scopeDir, error instanceof Error ? error.message : String(error));
            throw error;
        } finally {
            await this.stateManager.releaseLock(scopeDir);
        }
    }

    private async unsafeEnsureIndex(scopeDir: FileURI, options: IndexOptions): Promise<void> {
        // 初始化索引状态
        const initialState: IndexState = {
            status: 'indexing',
            lastUpdateTime: Date.now(),
            progress: {
                totalFiles: 0,
                processedFiles: 0
            }
        };
        await this.stateManager.setState(scopeDir, initialState);

        if (!options.ignoreExisting) {
            const indexExists = await this.unsafeIndexExists(scopeDir);
            if (indexExists) {
                console.log(`索引已存在: ${scopeDir.path}`);
                await this.stateManager.markIndexCompleted(scopeDir);
                return;
            }
        }

        console.log(`开始创建/更新索引: ${scopeDir.path}`);
        const { indexDir, tmpDir } = this.getIndexDir(scopeDir);
        await this.unsafeUpsertIndex(indexDir, tmpDir, scopeDir);
        await this.stateManager.markIndexCompleted(scopeDir);
    }

    public async unsafeIndexExists(scopeDir: FileURI): Promise<boolean> {
        const { indexDir } = this.getIndexDir(scopeDir);
        const indexPath = createFileURI(joinPath(indexDir.path, 'index.json'));
        return fileExists(indexPath);
    }

    public async deleteIndex(scopeDir: FileURI): Promise<void> {
        await this.getIndexLock(scopeDir).withWrite(async () => {
            const { indexDir } = this.getIndexDir(scopeDir);
            await deleteFile(indexDir);
            // 删除状态文件
            await this.stateManager.setState(scopeDir, {
                status: 'idle',
                lastUpdateTime: Date.now(),
                progress: {
                    totalFiles: 0,
                    processedFiles: 0
                }
            });
        });
    }

    private async unsafeUpsertIndex(
        indexDir: FileURI,
        tmpIndexDir: FileURI,
        scopeDir: FileURI
    ): Promise<void> {
        await deleteFile(tmpIndexDir).catch(() => undefined);

        let maxCPUs = 1;
        if (os.cpus().length > 4) {
            maxCPUs = 2;
        }

        const symfPath = await this.mustSymfPath();
        const proc = spawn(symfPath, [
            '--index-root',
            tmpIndexDir.fsPath,
            'add',
            scopeDir.fsPath,
        ], {
            env: {
                ...process.env,
                GOMAXPROCS: `${maxCPUs}`,
            },
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 1000 * 60 * 10,
        });

        // 处理进度输出
        proc.stdout?.on('data', (data) => {
            const output = data.toString();
            if (output.includes('Processing file:')) {
                const match = output.match(/Processing file: (.*)/);
                if (match) {
                    this.stateManager.updateProgress(scopeDir, {
                        totalFiles: 0, // 这个值需要从 symf 的输出中解析
                        processedFiles: 0,
                        currentFile: match[1]
                    });
                }
            }
        });

        // 处理错误输出
        proc.stderr?.on('data', (data) => {
            console.error(`symf stderr: ${data}`);
        });

        await new Promise<void>((resolve, reject) => {
            proc.on('error', reject);
            proc.on('exit', code => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`symf exited with code ${code}`));
                }
            });
        });

        await deleteFile(indexDir).catch(() => undefined);
        await mkdirp(dirnamePath(indexDir.fsPath));
        await moveFile(tmpIndexDir, indexDir);
    }

    private async markIndexFailed(scopeDir: FileURI): Promise<void> {
        const failureRoot = createFileURI(joinPath(this.indexRoot.fsPath, '.failed'));
        await mkdirp(failureRoot.fsPath);
        const failureSentinelFile = createFileURI(
            joinPath(
                failureRoot.fsPath,
                scopeDir.path.replaceAll('/', '__')
            )
        );
        await writeFileContent(failureSentinelFile, '');
    }

    private async clearIndexFailure(scopeDir: FileURI): Promise<void> {
        const failureRoot = createFileURI(joinPath(this.indexRoot.fsPath, '.failed'));
        const failureSentinelFile = createFileURI(
            joinPath(
                failureRoot.fsPath,
                scopeDir.path.replaceAll('/', '__')
            )
        );
        await deleteFile(failureSentinelFile);
    }

    public async statIndex(scopeDir: FileURI): Promise<CorpusDiff | null> {
        const { indexDir } = this.getIndexDir(scopeDir);
        try {
            const symfPath = await this.mustSymfPath();
            const { stdout } = await execFileAsync(symfPath, [
                '--index-root',
                indexDir.fsPath,
                'status',
                scopeDir.fsPath,
            ]);
            return JSON.parse(stdout) as CorpusDiff;
        } catch (error) {
            return null;
        }
    }

    public getSymfPath(): string {
        return this.symfPath;
    }

    public getIndexRoot(): string {
        return this.indexRoot.path;
    }

    public async updateIndex(scopeDir: FileURI, options: IndexUpdateOptions = {}): Promise<void> {
        console.log(`开始更新索引: ${scopeDir.path}`);
        
        const existingLock = await this.stateManager.acquireLock(scopeDir);
        if (existingLock && existingLock.pid !== process.pid) {
            throw new Error(`索引已被进程 ${existingLock.pid} 锁定`);
        }

        try {
            if (options.incremental) {
                await this.incrementalUpdate(scopeDir, options);
            } else {
                await this.fullUpdate(scopeDir, options);
            }
        } catch (error) {
            await this.stateManager.markIndexFailed(scopeDir, error instanceof Error ? error.message : String(error));
            throw error;
        } finally {
            await this.stateManager.releaseLock(scopeDir);
        }
    }

    private async incrementalUpdate(scopeDir: FileURI, options: IndexUpdateOptions): Promise<void> {
        const initialState: IndexState = {
            status: 'indexing',
            lastUpdateTime: Date.now(),
            progress: {
                totalFiles: 0,
                processedFiles: 0
            }
        };
        await this.stateManager.setState(scopeDir, initialState);

        // 获取所有文件
        const files = await glob('**/*', {
            cwd: scopeDir.fsPath,
            ignore: ['**/node_modules/**', '**/.git/**', '**/.index/**']
        });

        // 获取已更改的文件
        const changedFiles = await this.cacheManager.getChangedFiles(scopeDir, files);
        
        if (changedFiles.length === 0) {
            console.log('没有文件需要更新');
            await this.stateManager.markIndexCompleted(scopeDir);
            return;
        }

        console.log(`发现 ${changedFiles.length} 个文件需要更新`);

        // 批量处理文件
        const batchSize = options.batchSize || 100;
        for (let i = 0; i < changedFiles.length; i += batchSize) {
            const batch = changedFiles.slice(i, i + batchSize);
            await this.processBatch(scopeDir, batch, options);
            
            // 更新进度
            await this.stateManager.updateProgress(scopeDir, {
                totalFiles: changedFiles.length,
                processedFiles: Math.min(i + batchSize, changedFiles.length)
            });
        }

        await this.stateManager.markIndexCompleted(scopeDir);
    }

    private async fullUpdate(scopeDir: FileURI, options: IndexUpdateOptions): Promise<void> {
        const { indexDir, tmpDir } = this.getIndexDir(scopeDir);
        await this.unsafeUpsertIndex(indexDir, tmpDir, scopeDir);
    }

    private async processBatch(scopeDir: FileURI, files: string[], options: IndexUpdateOptions): Promise<void> {
        const { indexDir } = this.getIndexDir(scopeDir);
        const symfPath = await this.mustSymfPath();

        try {
            // 直接传递文件列表作为参数
            const proc = spawn(symfPath, [
                '--index-root',
                indexDir.fsPath,
                'add',
                ...files.map(file => joinPath(scopeDir.fsPath, file))
            ], {
                env: {
                    ...process.env,
                    GOMAXPROCS: `${options.maxConcurrent || 1}`,
                },
                stdio: ['ignore', 'pipe', 'pipe'],
                timeout: options.timeout || 1000 * 60 * 10,
            });

            // 处理进度输出
            proc.stdout?.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Processing file:')) {
                    const match = output.match(/Processing file: (.*)/);
                    if (match) {
                        this.performanceTracker.incrementFilesProcessed();
                        this.stateManager.updateProgress(scopeDir, {
                            totalFiles: files.length,
                            processedFiles: this.performanceTracker.getCurrentMetrics().filesProcessed,
                            currentFile: match[1]
                        });
                    }
                }
            });

            // 处理错误输出
            proc.stderr?.on('data', (data) => {
                console.error(`symf stderr: ${data}`);
            });

            await new Promise<void>((resolve, reject) => {
                proc.on('error', reject);
                proc.on('exit', code => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`symf exited with code ${code}`));
                    }
                });
            });

            // 更新文件哈希
            for (const file of files) {
                const fileUri = createFileURI(joinPath(scopeDir.fsPath, file));
                await this.cacheManager.updateFileHash(scopeDir, fileUri);
            }
        } catch (error) {
            console.error('处理批次时发生错误:', error);
            throw error;
        }
    }
}
