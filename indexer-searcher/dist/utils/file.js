"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExists = fileExists;
exports.mkdirp = mkdirp;
exports.readFileContent = readFileContent;
exports.writeFileContent = writeFileContent;
exports.moveFile = moveFile;
exports.deleteFile = deleteFile;
exports.joinPath = joinPath;
exports.dirnamePath = dirnamePath;
exports.createFileURI = createFileURI;
exports.getCodeSnippet = getCodeSnippet;
const promises_1 = require("fs/promises");
const path_1 = require("path");
async function fileExists(file) {
    try {
        await (0, promises_1.access)(file.fsPath);
        return true;
    }
    catch {
        return false;
    }
}
async function mkdirp(path) {
    try {
        await (0, promises_1.mkdir)(path, { recursive: true });
    }
    catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}
async function readFileContent(file) {
    return (0, promises_1.readFile)(file.fsPath, 'utf-8');
}
async function writeFileContent(file, content) {
    await (0, promises_1.writeFile)(file.fsPath, content, 'utf-8');
}
async function moveFile(from, to) {
    await (0, promises_1.rename)(from.fsPath, to.fsPath);
}
async function deleteFile(file) {
    await (0, promises_1.rm)(file.fsPath, { recursive: true, force: true });
}
function joinPath(...paths) {
    return (0, path_1.join)(...paths);
}
function dirnamePath(path) {
    return (0, path_1.dirname)(path);
}
function createFileURI(path) {
    return {
        scheme: 'file',
        path,
        fsPath: path
    };
}
async function getCodeSnippet(filePath, range) {
    try {
        const content = await (0, promises_1.readFile)(filePath, 'utf-8');
        const start = Math.max(0, range.startByte);
        const end = Math.min(content.length, range.endByte);
        if (start >= end) {
            return null;
        }
        return content.slice(start, end);
    }
    catch (error) {
        console.error(`Error reading file snippet for ${filePath}:`, error);
        return null;
    }
}
