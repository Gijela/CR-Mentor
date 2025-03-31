import { FileChange } from '../../types/input';
import { CodeSearcher } from 'project-b';
import { AnalyzerConfig } from '../../types/config';
import { QualityReport, QualityMetrics, QualityIssue, Suggestion } from '../../types/output';

export class QualityAnalyzer {
    constructor(
        private searcher: CodeSearcher,
        private config: AnalyzerConfig
    ) {}

    async analyzeQuality(files: FileChange[]): Promise<QualityReport> {
        // 1. 分析代码指标
        const metrics = await this.analyzeMetrics(files);
        
        // 2. 检查代码问题
        const issues = await this.checkIssues(files);
        
        // 3. 生成改进建议
        const suggestions = this.generateSuggestions(metrics, issues);

        return {
            metrics,
            issues,
            suggestions
        };
    }

    private async analyzeMetrics(files: FileChange[]): Promise<QualityMetrics> {
        // 使用 Project-B 分析代码指标
        const results = await Promise.all(
            files.map(file => this.searcher.analyzeMetrics(file.filename))
        );

        return {
            complexity: this.calculateAverageComplexity(results),
            maintainability: this.calculateMaintainabilityIndex(results),
            readability: this.calculateReadabilityIndex(results)
        };
    }

    private async checkIssues(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = [];

        // 1. 检查代码规范问题
        const styleIssues = await this.checkStyleIssues(files);
        issues.push(...styleIssues);

        // 2. 检查性能问题
        const performanceIssues = await this.checkPerformanceIssues(files);
        issues.push(...performanceIssues);

        // 3. 检查安全问题
        const securityIssues = await this.checkSecurityIssues(files);
        issues.push(...securityIssues);

        // 4. 检查测试覆盖
        const testIssues = await this.checkTestCoverage(files);
        issues.push(...testIssues);

        return issues;
    }

    private async checkStyleIssues(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = [];
        const results = await this.searcher.search(
            'TODO|FIXME|XXX|console.log|debugger',
            { files: files.map(f => f.filename) }
        );

        results.forEach(result => {
            if (result.content.includes('TODO')) {
                issues.push({
                    type: 'maintainability',
                    severity: 'low',
                    message: 'TODO comment found',
                    location: result.file,
                    suggestion: 'Consider addressing the TODO comment or creating an issue'
                });
            }

            if (result.content.includes('console.log')) {
                issues.push({
                    type: 'maintainability',
                    severity: 'low',
                    message: 'Console.log statement found',
                    location: result.file,
                    suggestion: 'Remove console.log statements before merging'
                });
            }
        });

        return issues;
    }

    private async checkPerformanceIssues(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = [];
        const results = await this.searcher.search(
            'for.*length|while.*true|setTimeout|setInterval',
            { files: files.map(f => f.filename) }
        );

        results.forEach(result => {
            if (result.content.includes('for.*length')) {
                issues.push({
                    type: 'performance',
                    severity: 'medium',
                    message: 'Potential performance issue: using array.length in loop condition',
                    location: result.file,
                    suggestion: 'Consider caching array.length before the loop'
                });
            }
        });

        return issues;
    }

    private async checkSecurityIssues(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = [];
        const results = await this.searcher.search(
            'eval|Function|innerHTML|document.write',
            { files: files.map(f => f.filename) }
        );

        results.forEach(result => {
            if (result.content.includes('eval')) {
                issues.push({
                    type: 'security',
                    severity: 'high',
                    message: 'Security risk: eval() usage detected',
                    location: result.file,
                    suggestion: 'Avoid using eval() as it can lead to security vulnerabilities'
                });
            }
        });

        return issues;
    }

    private async checkTestCoverage(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = [];
        const results = await this.searcher.search(
            'test|spec|__tests__',
            { files: files.map(f => f.filename) }
        );

        // 检查是否有对应的测试文件
        files.forEach(file => {
            const hasTest = results.some(r => r.file.includes('test') || r.file.includes('spec'));
            if (!hasTest) {
                issues.push({
                    type: 'test-coverage',
                    severity: 'medium',
                    message: 'No test file found for the changed file',
                    location: file.filename,
                    suggestion: 'Consider adding tests for the changes'
                });
            }
        });

        return issues;
    }

    private calculateAverageComplexity(results: any[]): number {
        if (results.length === 0) return 0;
        const total = results.reduce((sum, r) => sum + (r.complexity || 0), 0);
        return total / results.length;
    }

    private calculateMaintainabilityIndex(results: any[]): number {
        if (results.length === 0) return 0;
        const total = results.reduce((sum, r) => sum + (r.maintainability || 0), 0);
        return total / results.length;
    }

    private calculateReadabilityIndex(results: any[]): number {
        if (results.length === 0) return 0;
        const total = results.reduce((sum, r) => sum + (r.readability || 0), 0);
        return total / results.length;
    }

    private generateSuggestions(metrics: QualityMetrics, issues: QualityIssue[]): Suggestion[] {
        const suggestions: Suggestion[] = [];

        // 基于指标生成建议
        if (metrics.complexity > this.config.qualityAnalysis.thresholds.complexity) {
            suggestions.push({
                type: 'improvement',
                message: 'Consider reducing code complexity',
                priority: 'high'
            });
        }

        if (metrics.maintainability < this.config.qualityAnalysis.thresholds.maintainability) {
            suggestions.push({
                type: 'improvement',
                message: 'Consider improving code maintainability',
                priority: 'medium'
            });
        }

        // 基于问题生成建议
        const criticalIssues = issues.filter(i => i.severity === 'high');
        if (criticalIssues.length > 0) {
            suggestions.push({
                type: 'fix',
                message: `Address ${criticalIssues.length} critical issues`,
                priority: 'high'
            });
        }

        return suggestions;
    }
} 