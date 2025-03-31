export { CodeReviewSystem } from './core/reviewer';
export type { CodeReviewInput, CodeReviewOutput } from './types/input';
export type { AnalyzerConfig } from './types/config';

// 使用示例
async function main() {
    const input: CodeReviewInput = {
        project: {
            url: 'https://github.com/username/repo.git'
        },
        changes: {
            files: [],
            commits: []
        }
    };
    
    const reviewer = new CodeReviewSystem({
        global: {
            timeout: 30000,
            maxRetries: 3,
            parallel: true
        }
    });
    
    const output = await reviewer.performReview(input, {
        onProgress: (progress) => {
            console.log(`分析进度: ${progress.stage} - ${progress.current}/${progress.total}`);
        }
    });
    
    console.log('审查报告:', output);
} 