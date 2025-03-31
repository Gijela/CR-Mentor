"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeIndexer = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const os_1 = __importDefault(require("os"));
const lock_1 = require("../utils/lock");
const file_1 = require("../utils/file");
const index_state_1 = require("./index-state");
const index_cache_1 = require("./index-cache");
const index_performance_1 = require("./index-performance");
const glob_1 = require("glob");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class CodeIndexer {
    constructor(config) {
        this.indexLocks = new Map();
        this.indexRoot = (0, file_1.createFileURI)(config.index.root);
        this.symfPath = config.symf.path;
        this.stateManager = new index_state_1.IndexStateManager(config.index.root);
        this.cacheManager = new index_cache_1.IndexCacheManager(config.index.root);
        this.performanceTracker = new index_performance_1.IndexPerformanceTracker();
    }
    async mustSymfPath() {
        if (!this.symfPath) {
            throw new Error('No symf executable found. Please set symf.path in config.');
        }
        return this.symfPath;
    }
    getIndexLock(scopeDir) {
        const { indexDir } = this.getIndexDir(scopeDir);
        let lock = this.indexLocks.get(indexDir.toString());
        if (lock) {
            return lock;
        }
        lock = new lock_1.RWLock();
        this.indexLocks.set(indexDir.toString(), lock);
        return lock;
    }
    getIndexDir(scopeDir) {
        const indexSubdir = scopeDir.path;
        return {
            indexDir: (0, file_1.createFileURI)((0, file_1.joinPath)(this.indexRoot.path, indexSubdir)),
            tmpDir: (0, file_1.createFileURI)((0, file_1.joinPath)(this.indexRoot.path, '.tmp', indexSubdir))
        };
    }
    async ensureIndex(scopeDir, options = { retryIfLastAttemptFailed: false, ignoreExisting: false }) {
        console.log(`确保索引存在: ${scopeDir.path}`);
        // 检查是否有其他进程正在索引
        const existingLock = await this.stateManager.acquireLock(scopeDir);
        if (existingLock && existingLock.pid !== process.pid) {
            throw new Error(`索引已被进程 ${existingLock.pid} 锁定`);
        }
        try {
            await this.unsafeEnsureIndex(scopeDir, options);
        }
        catch (error) {
            await this.stateManager.markIndexFailed(scopeDir, error instanceof Error ? error.message : String(error));
            throw error;
        }
        finally {
            await this.stateManager.releaseLock(scopeDir);
        }
    }
    async unsafeEnsureIndex(scopeDir, options) {
        // 初始化索引状态
        const initialState = {
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
    async unsafeIndexExists(scopeDir) {
        const { indexDir } = this.getIndexDir(scopeDir);
        const indexPath = (0, file_1.createFileURI)((0, file_1.joinPath)(indexDir.path, 'index.json'));
        return (0, file_1.fileExists)(indexPath);
    }
    async deleteIndex(scopeDir) {
        await this.getIndexLock(scopeDir).withWrite(async () => {
            const { indexDir } = this.getIndexDir(scopeDir);
            await (0, file_1.deleteFile)(indexDir);
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
    async unsafeUpsertIndex(indexDir, tmpIndexDir, scopeDir) {
        await (0, file_1.deleteFile)(tmpIndexDir).catch(() => undefined);
        let maxCPUs = 1;
        if (os_1.default.cpus().length > 4) {
            maxCPUs = 2;
        }
        const symfPath = await this.mustSymfPath();
        const proc = (0, child_process_1.spawn)(symfPath, [
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
        await new Promise((resolve, reject) => {
            proc.on('error', reject);
            proc.on('exit', code => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`symf exited with code ${code}`));
                }
            });
        });
        await (0, file_1.deleteFile)(indexDir).catch(() => undefined);
        await (0, file_1.mkdirp)((0, file_1.dirnamePath)(indexDir.fsPath));
        await (0, file_1.moveFile)(tmpIndexDir, indexDir);
    }
    async markIndexFailed(scopeDir) {
        const failureRoot = (0, file_1.createFileURI)((0, file_1.joinPath)(this.indexRoot.fsPath, '.failed'));
        await (0, file_1.mkdirp)(failureRoot.fsPath);
        const failureSentinelFile = (0, file_1.createFileURI)((0, file_1.joinPath)(failureRoot.fsPath, scopeDir.path.replaceAll('/', '__')));
        await (0, file_1.writeFileContent)(failureSentinelFile, '');
    }
    async clearIndexFailure(scopeDir) {
        const failureRoot = (0, file_1.createFileURI)((0, file_1.joinPath)(this.indexRoot.fsPath, '.failed'));
        const failureSentinelFile = (0, file_1.createFileURI)((0, file_1.joinPath)(failureRoot.fsPath, scopeDir.path.replaceAll('/', '__')));
        await (0, file_1.deleteFile)(failureSentinelFile);
    }
    async statIndex(scopeDir) {
        const { indexDir } = this.getIndexDir(scopeDir);
        try {
            const symfPath = await this.mustSymfPath();
            const { stdout } = await execFileAsync(symfPath, [
                '--index-root',
                indexDir.fsPath,
                'status',
                scopeDir.fsPath,
            ]);
            return JSON.parse(stdout);
        }
        catch (error) {
            return null;
        }
    }
    getSymfPath() {
        return this.symfPath;
    }
    getIndexRoot() {
        return this.indexRoot.path;
    }
    async updateIndex(scopeDir, options = {}) {
        console.log(`开始更新索引: ${scopeDir.path}`);
        const existingLock = await this.stateManager.acquireLock(scopeDir);
        if (existingLock && existingLock.pid !== process.pid) {
            throw new Error(`索引已被进程 ${existingLock.pid} 锁定`);
        }
        try {
            if (options.incremental) {
                await this.incrementalUpdate(scopeDir, options);
            }
            else {
                await this.fullUpdate(scopeDir, options);
            }
        }
        catch (error) {
            await this.stateManager.markIndexFailed(scopeDir, error instanceof Error ? error.message : String(error));
            throw error;
        }
        finally {
            await this.stateManager.releaseLock(scopeDir);
        }
    }
    async incrementalUpdate(scopeDir, options) {
        const initialState = {
            status: 'indexing',
            lastUpdateTime: Date.now(),
            progress: {
                totalFiles: 0,
                processedFiles: 0
            }
        };
        await this.stateManager.setState(scopeDir, initialState);
        // 获取所有文件
        const files = await (0, glob_1.glob)('**/*', {
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
    async fullUpdate(scopeDir, options) {
        const { indexDir, tmpDir } = this.getIndexDir(scopeDir);
        await this.unsafeUpsertIndex(indexDir, tmpDir, scopeDir);
    }
    async processBatch(scopeDir, files, options) {
        const { indexDir } = this.getIndexDir(scopeDir);
        const symfPath = await this.mustSymfPath();
        try {
            // 直接传递文件列表作为参数
            const proc = (0, child_process_1.spawn)(symfPath, [
                '--index-root',
                indexDir.fsPath,
                'add',
                ...files.map(file => (0, file_1.joinPath)(scopeDir.fsPath, file))
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
            await new Promise((resolve, reject) => {
                proc.on('error', reject);
                proc.on('exit', code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`symf exited with code ${code}`));
                    }
                });
            });
            // 更新文件哈希
            for (const file of files) {
                const fileUri = (0, file_1.createFileURI)((0, file_1.joinPath)(scopeDir.fsPath, file));
                await this.cacheManager.updateFileHash(scopeDir, fileUri);
            }
        }
        catch (error) {
            console.error('处理批次时发生错误:', error);
            throw error;
        }
    }
}
exports.CodeIndexer = CodeIndexer;
