import { IndexPerformanceMetrics } from './types';
export declare class IndexPerformanceTracker {
    private metrics;
    private startMemory;
    private startCpu;
    constructor();
    incrementFilesProcessed(count?: number): void;
    incrementBytesProcessed(bytes: number): void;
    recordIOOperation(type: 'read' | 'write', bytes: number): void;
    updatePeakMemory(): void;
    updateCpuUsage(): void;
    finalize(): IndexPerformanceMetrics;
    getCurrentMetrics(): IndexPerformanceMetrics;
    reset(): void;
}
