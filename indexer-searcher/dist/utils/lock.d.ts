export declare class RWLock {
    private readers;
    private mu;
    withRead<T>(fn: () => Promise<T>): Promise<T>;
    withWrite<T>(fn: () => Promise<T>): Promise<T>;
}
