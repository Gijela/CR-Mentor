import { FileURI } from '../core/types';
export declare function fileExists(file: FileURI): Promise<boolean>;
export declare function mkdirp(path: string): Promise<void>;
export declare function readFileContent(file: FileURI): Promise<string>;
export declare function writeFileContent(file: FileURI, content: string): Promise<void>;
export declare function moveFile(from: FileURI, to: FileURI): Promise<void>;
export declare function deleteFile(file: FileURI): Promise<void>;
export declare function joinPath(...paths: string[]): string;
export declare function dirnamePath(path: string): string;
export declare function createFileURI(path: string): FileURI;
export declare function getCodeSnippet(filePath: string, range: {
    startByte: number;
    endByte: number;
}): Promise<string | null>;
