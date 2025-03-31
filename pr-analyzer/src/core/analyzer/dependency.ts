import { FileChange } from '../../types/input';
import { CodeSearcher } from 'project-b';
import { AnalyzerConfig } from '../../types/config';

export class DependencyAnalyzer {
    constructor(
        private searcher: CodeSearcher,
        private config: AnalyzerConfig
    ) {}

    async analyzeDependencies(files: FileChange[]): Promise<DependencyAnalysis> {
        // 1. 分析依赖变更
        const affected = await this.analyzeAffectedDependencies(files);
        
        // 2. 检查破坏性变更
        const breaking = await this.checkBreakingChanges(files);
        
        // 3. 检查循环依赖
        const circular = await this.checkCircularDependencies(files);

        return {
            affected,
            breaking,
            circular
        };
    }

    private async analyzeAffectedDependencies(files: FileChange[]) {
        // 使用 Project-B 搜索依赖关系
        const dependencyResults = await this.searcher.search(
            'import|require|dependency',
            { files: files.map(f => f.filename) }
        );

        return this.extractDependencies(dependencyResults);
    }

    private async checkBreakingChanges(files: FileChange[]) {
        // 检查可能导致破坏性变更的代码
        const breakingChanges = await this.searcher.search(
            'breaking change|deprecated|removed',
            { files: files.map(f => f.filename) }
        );

        return this.analyzeBreakingChanges(breakingChanges);
    }

    private async checkCircularDependencies(files: FileChange[]) {
        // 检查循环依赖
        const circularDeps = await this.searcher.search(
            'circular dependency|circular import',
            { files: files.map(f => f.filename) }
        );

        return this.analyzeCircularDependencies(circularDeps);
    }

    private extractDependencies(results: any[]): string[] {
        const dependencies = new Set<string>();

        results.forEach(result => {
            // 提取 import 语句
            const importMatches = result.content.match(/import\s+.*?from\s+['"](.+?)['"]/g);
            if (importMatches) {
                importMatches.forEach(match => {
                    const dep = match.match(/from\s+['"](.+?)['"]/)[1];
                    dependencies.add(dep);
                });
            }

            // 提取 require 语句
            const requireMatches = result.content.match(/require\s*\(\s*['"](.+?)['"]\s*\)/g);
            if (requireMatches) {
                requireMatches.forEach(match => {
                    const dep = match.match(/['"](.+?)['"]/)[1];
                    dependencies.add(dep);
                });
            }
        });

        return Array.from(dependencies);
    }

    private analyzeBreakingChanges(results: any[]): string[] {
        const breakingChanges: string[] = [];

        results.forEach(result => {
            // 检查是否包含破坏性变更的关键词
            if (result.content.includes('breaking change')) {
                breakingChanges.push(result.file);
            }

            // 检查是否包含废弃标记
            if (result.content.includes('@deprecated')) {
                breakingChanges.push(result.file);
            }

            // 检查是否包含移除标记
            if (result.content.includes('removed') || result.content.includes('delete')) {
                breakingChanges.push(result.file);
            }
        });

        return [...new Set(breakingChanges)];
    }

    private analyzeCircularDependencies(results: any[]): string[] {
        const circularDeps: string[] = [];

        results.forEach(result => {
            // 检查是否包含循环依赖的注释
            if (result.content.includes('circular dependency') || 
                result.content.includes('circular import')) {
                circularDeps.push(result.file);
            }

            // 检查导入语句是否形成循环
            const imports = this.extractImports(result.content);
            if (this.hasCircularImport(imports)) {
                circularDeps.push(result.file);
            }
        });

        return [...new Set(circularDeps)];
    }

    private extractImports(content: string): string[] {
        const imports: string[] = [];
        
        // 提取 import 语句
        const importMatches = content.match(/import\s+.*?from\s+['"](.+?)['"]/g);
        if (importMatches) {
            importMatches.forEach(match => {
                const imp = match.match(/from\s+['"](.+?)['"]/)[1];
                imports.push(imp);
            });
        }

        return imports;
    }

    private hasCircularImport(imports: string[]): boolean {
        // 简单的循环依赖检测
        // 这里可以添加更复杂的检测逻辑
        return imports.some(imp => imports.includes(imp));
    }
} 