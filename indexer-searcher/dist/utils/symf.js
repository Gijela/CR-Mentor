"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymfPath = getSymfPath;
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const file_1 = require("./file");
const symfVersion = 'v0.0.16';
function getOSArch() {
    const platform = node_os_1.default.platform();
    const arch = node_os_1.default.machine();
    return { platform, arch };
}
function getNamesForPlatform(platform, arch) {
    const zigPlatform = platform === 'linux'
        ? 'linux-musl'
        : platform === 'windows'
            ? 'windows-gnu'
            : 'macos';
    const symfFilename = platform === 'windows' ? 'symf.exe' : 'symf';
    const symfUnzippedFilename = platform === 'windows' ? 'symf.exe' : 'symf';
    return { symfFilename, symfUnzippedFilename, zigPlatform };
}
async function getSymfPath() {
    const { platform, arch } = getOSArch();
    if (!platform || !arch) {
        throw new Error(`No symf binary available for ${node_os_1.default.platform()}/${node_os_1.default.machine()}`);
    }
    const { symfFilename, symfUnzippedFilename, zigPlatform } = getNamesForPlatform(platform, arch);
    const symfPath = node_path_1.default.join(process.cwd(), 'node_modules', '.bin', symfFilename);
    if (await (0, file_1.fileExists)((0, file_1.createFileURI)(symfPath))) {
        return symfPath;
    }
    // 如果 symf 不存在，尝试从环境变量获取
    const envSymfPath = process.env.SYMF_PATH;
    if (envSymfPath && await (0, file_1.fileExists)((0, file_1.createFileURI)(envSymfPath))) {
        return envSymfPath;
    }
    throw new Error('symf binary not found. Please install symf or set SYMF_PATH environment variable.');
}
