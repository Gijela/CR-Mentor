"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    index: {
        root: './.index',
        maxCPUs: 2,
        timeout: 600000 // 10 minutes
    },
    search: {
        defaultLimit: 10,
        timeout: 30000 // 30 seconds
    },
    symf: {
        path: process.env.SYMF_PATH || 'symf' // 优先使用环境变量中的路径
    }
};
