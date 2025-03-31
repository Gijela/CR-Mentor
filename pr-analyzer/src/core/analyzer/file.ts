import { FileChange, FileAnalysis, Issue, Suggestion } from '../../types/input';
import { CodeSearcher } from 'project-b';
import { AnalyzerConfig } from '../../types/config';

export class FileAnalyzer {
    constructor(
        private searcher: CodeSearcher,
        private config: AnalyzerConfig
    ) {}

    async analyzeFile(file: FileChange): Promise<FileAnalysis> {
        // 1. 获取文件内容
        const content = await this.getFileContent(file.raw_url);
        
        // 2. 分析变更
        const changes = this.analyzeChanges(file);
        
        // 3. 分析影响范围
        const impact = await this.analyzeImpact(file, content);
        
        // 4. 检查代码质量
        const quality = await this.checkQuality(file, content);
        
        // 5. 生成建议
        const suggestions = this.generateSuggestions(changes, impact, quality);

        return {
            changes,
            impact,
            quality,
            suggestions
        };
    }

    private async getFileContent(url: string): Promise<string> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch file content: ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            throw new Error(`Error fetching file content: ${error.message}`);
        }
    }

    private analyzeChanges(file: FileChange) {
        return {
            additions: file.additions,
            deletions: file.deletions,
            total: file.changes,
            type: file.status
        };
    }

    private async analyzeImpact(file: FileChange, content: string) {
        // 使用 Project-B 的搜索功能分析影响范围
        const searchResults = await this.searcher.search(
            this.extractKeyTerms(content),
            { scopeDir: file.filename }
        );

        return {
            scope: this.determineScope(searchResults),
            risk: this.assessRisk(file, searchResults)
        };
    }

    private async checkQuality(file: FileChange, content: string) {
        // 使用 Project-B 分析代码质量
        const metrics = await this.searcher.analyzeQuality(content);
        
        return {
            complexity: metrics.complexity,
            maintainability: metrics.maintainability,
            readability: metrics.readability,
            issues: this.findQualityIssues(metrics)
        };
    }

    private extractKeyTerms(content: string): string[] {
        // 提取代码中的关键术语
        const terms: string[] = [];
        
        // 提取函数名
        const functionMatches = content.match(/function\s+(\w+)/g);
        if (functionMatches) {
            terms.push(...functionMatches.map(m => m.replace('function ', '')));
        }
        
        // 提取类名
        const classMatches = content.match(/class\s+(\w+)/g);
        if (classMatches) {
            terms.push(...classMatches.map(m => m.replace('class ', '')));
        }
        
        // 提取变量名
        const varMatches = content.match(/const|let|var\s+(\w+)/g);
        if (varMatches) {
            terms.push(...varMatches.map(m => m.replace(/const|let|var\s+/, '')));
        }
        
        return [...new Set(terms)];
    }

    private determineScope(searchResults: any[]): string[] {
        // 根据搜索结果确定影响范围
        return searchResults.map(result => result.file);
    }

    private assessRisk(file: FileChange, searchResults: any[]): 'LOW' | 'MEDIUM' | 'HIGH' {
        const riskFactors = {
            fileSize: file.changes > 1000 ? 0.8 : 0.2,
            impactScope: searchResults.length > 5 ? 0.7 : 0.3,
            fileType: this.isHighRiskFileType(file.filename) ? 0.9 : 0.1
        };

        const riskScore = Object.values(riskFactors).reduce((a, b) => a + b, 0) / Object.keys(riskFactors).length;

        if (riskScore > 0.7) return 'HIGH';
        if (riskScore > 0.4) return 'MEDIUM';
        return 'LOW';
    }

    private isHighRiskFileType(filename: string): boolean {
        const highRiskExtensions = ['.ts', '.js', '.json', '.yaml', '.yml'];
        return highRiskExtensions.some(ext => filename.endsWith(ext));
    }

    private findQualityIssues(metrics: any): Issue[] {
        const issues: Issue[] = [];

        // 检查复杂度
        if (metrics.complexity > this.config.qualityAnalysis.thresholds.complexity) {
            issues.push({
                type: 'warning',
                message: `High complexity detected: ${metrics.complexity}`,
                code: 'HIGH_COMPLEXITY'
            });
        }

        // 检查可维护性
        if (metrics.maintainability < this.config.qualityAnalysis.thresholds.maintainability) {
            issues.push({
                type: 'warning',
                message: `Low maintainability score: ${metrics.maintainability}`,
                code: 'LOW_MAINTAINABILITY'
            });
        }

        // 检查可读性
        if (metrics.readability < this.config.qualityAnalysis.thresholds.readability) {
            issues.push({
                type: 'warning',
                message: `Low readability score: ${metrics.readability}`,
                code: 'LOW_READABILITY'
            });
        }

        return issues;
    }

    private generateSuggestions(
        changes: any,
        impact: any,
        quality: any
    ): Suggestion[] {
        const suggestions: Suggestion[] = [];

        // 基于变更生成建议
        if (changes.total > 1000) {
            suggestions.push({
                type: 'improvement',
                message: 'Consider splitting this large change into smaller commits',
                priority: 'high'
            });
        }

        // 基于影响范围生成建议
        if (impact.scope.length > 5) {
            suggestions.push({
                type: 'improvement',
                message: 'This change affects multiple files. Consider adding tests',
                priority: 'medium'
            });
        }

        // 基于质量问题生成建议
        if (quality.issues.length > 0) {
            suggestions.push({
                type: 'fix',
                message: 'Address the quality issues before merging',
                priority: 'high'
            });
        }

        return suggestions;
    }
} 