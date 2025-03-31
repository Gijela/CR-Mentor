import { Config, SearchResult } from './core/types';
export declare class CodeSearch {
    private indexer;
    private searcher;
    constructor(config?: Config);
    createIndex(directory: string, options?: {
        retryIfLastAttemptFailed: boolean;
        ignoreExisting: boolean;
    }): Promise<void>;
    updateIndex(directory: string): Promise<void>;
    deleteIndex(directory: string): Promise<void>;
    search(query: string, directories: string[]): Promise<SearchResult[]>;
    liveSearch(query: string, keywordQuery: string, files: string[]): Promise<SearchResult[]>;
}
export * from './core/types';
