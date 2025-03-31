// declare module 'indexer-searcher' {
//   export interface FileURI {
//     scheme: string;
//     path: string;
//     fsPath: string;
//   }

//   export interface SearchResult {
//     fqname: string;
//     name: string;
//     type: string;
//     doc: string;
//     exported: boolean;
//     lang: string;
//     file: FileURI;
//     summary: string;
//     range: {
//       startByte: number;
//       endByte: number;
//       startPoint: {
//         row: number;
//         col: number;
//       };
//       endPoint: {
//         row: number;
//         col: number;
//       };
//     };
//     blugeScore: number;
//     heuristicBoostID: string;
//     content?: string;
//   }

//   export interface Config {
//     index: {
//       root: string;
//       maxCPUs: number;
//       timeout: number;
//     };
//     search: {
//       defaultLimit: number;
//       timeout: number;
//     };
//     symf: {
//       path: string;
//     };
//   }

//   export class CodeSearch {
//     constructor(config?: Config);
//     createIndex(directory: string, options?: { retryIfLastAttemptFailed: boolean; ignoreExisting: boolean }): Promise<void>;
//     updateIndex(directory: string): Promise<void>;
//     deleteIndex(directory: string): Promise<void>;
//     search(query: string, directories: string[]): Promise<SearchResult[]>;
//     liveSearch(query: string, keywordQuery: string, files: string[]): Promise<SearchResult[]>;
//   }
// }

// declare module 'indexer-searcher/dist/core/types' {
//   export * from 'indexer-searcher';
// } 