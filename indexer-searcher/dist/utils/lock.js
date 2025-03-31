"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RWLock = void 0;
const async_mutex_1 = require("async-mutex");
class RWLock {
    constructor() {
        this.readers = 0;
        this.mu = new async_mutex_1.Mutex();
    }
    async withRead(fn) {
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
        }
        finally {
            this.readers--;
            if (this.readers === 0) {
                this.mu.release();
            }
        }
    }
    async withWrite(fn) {
        return this.mu.runExclusive(fn);
    }
}
exports.RWLock = RWLock;
