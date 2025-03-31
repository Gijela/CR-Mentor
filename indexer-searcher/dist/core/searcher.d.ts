import { CodeIndexer } from './indexer';
import { FileURI, SearchResult } from './types';
export declare class CodeSearcher {
    private indexer;
    constructor(indexer: CodeIndexer);
    getResults(userQuery: string, scopeDirs: FileURI[]): Promise<SearchResult[][]>;
    private getResultsForScopeDir;
    getLiveResults(userQuery: string, keywordQuery: string, files: string[]): Promise<SearchResult[]>;
    private parseAndEnhanceResults;
}
