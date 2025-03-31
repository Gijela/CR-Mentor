import { access, mkdir, readFile, rename, rm, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { FileURI } from '../core/types';

export async function fileExists(file: FileURI): Promise<boolean> {
    try {
        await access(file.fsPath);
        return true;
    } catch {
        return false;
    }
}

export async function mkdirp(path: string): Promise<void> {
    try {
        await mkdir(path, { recursive: true });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
            throw error;
        }
    }
}

export async function readFileContent(file: FileURI): Promise<string> {
    return readFile(file.fsPath, 'utf-8');
}

export async function writeFileContent(file: FileURI, content: string): Promise<void> {
    await writeFile(file.fsPath, content, 'utf-8');
}

export async function moveFile(from: FileURI, to: FileURI): Promise<void> {
    await rename(from.fsPath, to.fsPath);
}

export async function deleteFile(file: FileURI): Promise<void> {
    await rm(file.fsPath, { recursive: true, force: true });
}

export function joinPath(...paths: string[]): string {
    return join(...paths);
}

export function dirnamePath(path: string): string {
    return dirname(path);
}

export function createFileURI(path: string): FileURI {
    return {
        scheme: 'file',
        path,
        fsPath: path
    };
}

export async function getCodeSnippet(filePath: string, range: { startByte: number, endByte: number }): Promise<string | null> {
    try {
        const content = await readFile(filePath, 'utf-8');
        const start = Math.max(0, range.startByte);
        const end = Math.min(content.length, range.endByte);
        if (start >= end) {
            return null;
        }
        return content.slice(start, end);
    } catch (error) {
        console.error(`Error reading file snippet for ${filePath}:`, error);
        return null;
    }
}
