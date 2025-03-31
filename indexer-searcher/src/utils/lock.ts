import { Mutex } from 'async-mutex';

export class RWLock {
    private readers = 0;
    private mu = new Mutex();

    public async withRead<T>(fn: () => Promise<T>): Promise<T> {
        while (this.readers === 0) {
            if (this.mu.isLocked()) {
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
            }
            await this.mu.acquire();
            break;
        }
        this.readers++;
        try {
            return await fn();
        } finally {
            this.readers--;
            if (this.readers === 0) {
                this.mu.release();
            }
        }
    }

    public async withWrite<T>(fn: () => Promise<T>): Promise<T> {
        return this.mu.runExclusive(fn);
    }
}
