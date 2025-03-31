"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexPerformanceTracker = void 0;
class IndexPerformanceTracker {
    constructor() {
        this.metrics = {
            startTime: Date.now(),
            endTime: 0,
            duration: 0,
            filesProcessed: 0,
            bytesProcessed: 0,
            averageFileSize: 0,
            peakMemoryUsage: 0,
            cpuUsage: 0,
            ioOperations: {
                reads: 0,
                writes: 0,
                bytesRead: 0,
                bytesWritten: 0
            }
        };
        this.startMemory = process.memoryUsage().heapUsed;
        this.startCpu = process.cpuUsage().user;
    }
    incrementFilesProcessed(count = 1) {
        this.metrics.filesProcessed += count;
    }
    incrementBytesProcessed(bytes) {
        this.metrics.bytesProcessed += bytes;
    }
    recordIOOperation(type, bytes) {
        if (type === 'read') {
            this.metrics.ioOperations.reads++;
            this.metrics.ioOperations.bytesRead += bytes;
        }
        else {
            this.metrics.ioOperations.writes++;
            this.metrics.ioOperations.bytesWritten += bytes;
        }
    }
    updatePeakMemory() {
        const currentMemory = process.memoryUsage().heapUsed;
        this.metrics.peakMemoryUsage = Math.max(this.metrics.peakMemoryUsage, currentMemory - this.startMemory);
    }
    updateCpuUsage() {
        const currentCpu = process.cpuUsage().user;
        this.metrics.cpuUsage = (currentCpu - this.startCpu) / 1000000; // 转换为秒
    }
    finalize() {
        this.metrics.endTime = Date.now();
        this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
        this.metrics.averageFileSize = this.metrics.filesProcessed > 0
            ? this.metrics.bytesProcessed / this.metrics.filesProcessed
            : 0;
        this.updatePeakMemory();
        this.updateCpuUsage();
        return this.metrics;
    }
    getCurrentMetrics() {
        return { ...this.metrics };
    }
    reset() {
        this.metrics = {
            startTime: Date.now(),
            endTime: 0,
            duration: 0,
            filesProcessed: 0,
            bytesProcessed: 0,
            averageFileSize: 0,
            peakMemoryUsage: 0,
            cpuUsage: 0,
            ioOperations: {
                reads: 0,
                writes: 0,
                bytesRead: 0,
                bytesWritten: 0
            }
        };
        this.startMemory = process.memoryUsage().heapUsed;
        this.startCpu = process.cpuUsage().user;
    }
}
exports.IndexPerformanceTracker = IndexPerformanceTracker;
