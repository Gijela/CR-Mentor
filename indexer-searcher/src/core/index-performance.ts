import { IndexPerformanceMetrics } from './types';

export class IndexPerformanceTracker {
    private metrics: IndexPerformanceMetrics;
    private startMemory: number;
    private startCpu: number;

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

    incrementFilesProcessed(count: number = 1): void {
        this.metrics.filesProcessed += count;
    }

    incrementBytesProcessed(bytes: number): void {
        this.metrics.bytesProcessed += bytes;
    }

    recordIOOperation(type: 'read' | 'write', bytes: number): void {
        if (type === 'read') {
            this.metrics.ioOperations.reads++;
            this.metrics.ioOperations.bytesRead += bytes;
        } else {
            this.metrics.ioOperations.writes++;
            this.metrics.ioOperations.bytesWritten += bytes;
        }
    }

    updatePeakMemory(): void {
        const currentMemory = process.memoryUsage().heapUsed;
        this.metrics.peakMemoryUsage = Math.max(this.metrics.peakMemoryUsage, currentMemory - this.startMemory);
    }

    updateCpuUsage(): void {
        const currentCpu = process.cpuUsage().user;
        this.metrics.cpuUsage = (currentCpu - this.startCpu) / 1000000; // 转换为秒
    }

    finalize(): IndexPerformanceMetrics {
        this.metrics.endTime = Date.now();
        this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
        this.metrics.averageFileSize = this.metrics.filesProcessed > 0
            ? this.metrics.bytesProcessed / this.metrics.filesProcessed
            : 0;
        this.updatePeakMemory();
        this.updateCpuUsage();
        return this.metrics;
    }

    getCurrentMetrics(): IndexPerformanceMetrics {
        return { ...this.metrics };
    }

    reset(): void {
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