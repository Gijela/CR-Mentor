import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileExists, createFileURI } from './file';

type SymfVersionString = `v${string}`;
const symfVersion: SymfVersionString = 'v0.0.16';

type Platform = 'linux' | 'windows' | 'darwin';
type Arch = 'x86_64' | 'arm64';

function getOSArch(): { platform: Platform; arch: Arch } {
    const platform = os.platform() as Platform;
    const arch = os.machine() as Arch;
    return { platform, arch };
}

function getNamesForPlatform(
    platform: Platform,
    arch: Arch
): { symfFilename: string; symfUnzippedFilename: string; zigPlatform: string } {
    const zigPlatform =
        platform === 'linux'
            ? 'linux-musl'
            : platform === 'windows'
            ? 'windows-gnu'
            : 'macos';

    const symfFilename = platform === 'windows' ? 'symf.exe' : 'symf';
    const symfUnzippedFilename = platform === 'windows' ? 'symf.exe' : 'symf';

    return { symfFilename, symfUnzippedFilename, zigPlatform };
}

export async function getSymfPath(): Promise<string | null> {
    const { platform, arch } = getOSArch();
    if (!platform || !arch) {
        throw new Error(`No symf binary available for ${os.platform()}/${os.machine()}`);
    }

    const { symfFilename, symfUnzippedFilename, zigPlatform } = getNamesForPlatform(platform, arch);
    const symfPath = path.join(process.cwd(), 'node_modules', '.bin', symfFilename);

    if (await fileExists(createFileURI(symfPath))) {
        return symfPath;
    }

    // 如果 symf 不存在，尝试从环境变量获取
    const envSymfPath = process.env.SYMF_PATH;
    if (envSymfPath && await fileExists(createFileURI(envSymfPath))) {
        return envSymfPath;
    }

    throw new Error('symf binary not found. Please install symf or set SYMF_PATH environment variable.');
}
