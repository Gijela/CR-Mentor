"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexStateManager = void 0;
const file_1 = require("../utils/file");
const file_2 = require("../utils/file");
class IndexStateManager {
    constructor(indexRoot) {
        this.indexRoot = indexRoot;
    }
    getLockFilePath(scopeDir) {
        const lockFileName = `${IndexStateManager.LOCK_FILE_PREFIX}${Buffer.from(scopeDir.path).toString('base64')}`;
        return (0, file_1.createFileURI)((0, file_2.joinPath)(this.indexRoot, lockFileName));
    }
    getMetadataFilePath(scopeDir) {
        return (0, file_1.createFileURI)((0, file_2.joinPath)(this.indexRoot, scopeDir.path, IndexStateManager.METADATA_FILE));
    }
    getStatsFilePath(scopeDir) {
        return (0, file_1.createFileURI)((0, file_2.joinPath)(this.indexRoot, scopeDir.path, IndexStateManager.STATS_FILE));
    }
    getStateFilePath(scopeDir) {
        return (0, file_1.createFileURI)((0, file_2.joinPath)(this.indexRoot, scopeDir.path, IndexStateManager.STATE_FILE));
    }
    async acquireLock(scopeDir) {
        const lockFile = this.getLockFilePath(scopeDir);
        try {
            // 确保锁文件目录存在
            await (0, file_2.mkdirp)((0, file_2.dirnamePath)(lockFile.fsPath));
            const content = await (0, file_1.readFileContent)(lockFile);
            const lock = JSON.parse(content);
            // 检查锁是否过期
            if (Date.now() - lock.timestamp > IndexStateManager.LOCK_TIMEOUT) {
                await this.releaseLock(scopeDir);
                return null;
            }
            return lock;
        }
        catch (error) {
            // 如果锁文件不存在，创建新的锁
            const lock = {
                scopeDir,
                lockFile,
                pid: process.pid,
                timestamp: Date.now()
            };
            await (0, file_1.writeFileContent)(lockFile, JSON.stringify(lock));
            return lock;
        }
    }
    async releaseLock(scopeDir) {
        const lockFile = this.getLockFilePath(scopeDir);
        try {
            await (0, file_1.deleteFile)(lockFile);
        }
        catch (error) {
            console.error('释放锁失败:', error);
        }
    }
    async getState(scopeDir) {
        try {
            const stateFile = this.getStateFilePath(scopeDir);
            await (0, file_2.mkdirp)((0, file_2.dirnamePath)(stateFile.fsPath));
            const content = await (0, file_1.readFileContent)(stateFile);
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    async setState(scopeDir, state) {
        const stateFile = this.getStateFilePath(scopeDir);
        await (0, file_2.mkdirp)((0, file_2.dirnamePath)(stateFile.fsPath));
        await (0, file_1.writeFileContent)(stateFile, JSON.stringify(state));
    }
    async getMetadata(scopeDir) {
        try {
            const metadataFile = this.getMetadataFilePath(scopeDir);
            await (0, file_2.mkdirp)((0, file_2.dirnamePath)(metadataFile.fsPath));
            const content = await (0, file_1.readFileContent)(metadataFile);
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    async setMetadata(scopeDir, metadata) {
        const metadataFile = this.getMetadataFilePath(scopeDir);
        await (0, file_2.mkdirp)((0, file_2.dirnamePath)(metadataFile.fsPath));
        await (0, file_1.writeFileContent)(metadataFile, JSON.stringify(metadata));
    }
    async getStats(scopeDir) {
        try {
            const statsFile = this.getStatsFilePath(scopeDir);
            await (0, file_2.mkdirp)((0, file_2.dirnamePath)(statsFile.fsPath));
            const content = await (0, file_1.readFileContent)(statsFile);
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    async setStats(scopeDir, stats) {
        const statsFile = this.getStatsFilePath(scopeDir);
        await (0, file_2.mkdirp)((0, file_2.dirnamePath)(statsFile.fsPath));
        await (0, file_1.writeFileContent)(statsFile, JSON.stringify(stats));
    }
    async updateProgress(scopeDir, progress) {
        const state = await this.getState(scopeDir);
        if (state) {
            state.progress = progress;
            state.lastUpdateTime = Date.now();
            await this.setState(scopeDir, state);
        }
    }
    async markIndexFailed(scopeDir, error) {
        const state = await this.getState(scopeDir);
        if (state) {
            state.status = 'failed';
            state.lastError = error;
            state.lastUpdateTime = Date.now();
            await this.setState(scopeDir, state);
        }
    }
    async markIndexCompleted(scopeDir) {
        const state = await this.getState(scopeDir);
        if (state) {
            state.status = 'completed';
            state.lastUpdateTime = Date.now();
            await this.setState(scopeDir, state);
        }
    }
}
exports.IndexStateManager = IndexStateManager;
IndexStateManager.LOCK_FILE_PREFIX = '.lock_';
IndexStateManager.METADATA_FILE = 'metadata.json';
IndexStateManager.STATS_FILE = 'stats.json';
IndexStateManager.STATE_FILE = 'state.json';
IndexStateManager.LOCK_TIMEOUT = 5 * 60 * 1000; // 5分钟超时
