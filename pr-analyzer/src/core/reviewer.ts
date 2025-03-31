import { CodeReviewInput, CodeReviewOutput } from '../types/input';
import { AnalyzerConfig, defaultConfig } from '../types/config';
import { FileAnalyzer } from './analyzer/file';
import { CommitAnalyzer } from './analyzer/commit';
import { DependencyAnalyzer } from './analyzer/dependency';
import { QualityAnalyzer } from './analyzer/quality';
import { CodeSearcher } from 'project-b';

export class CodeReviewSystem {
    private fileAnalyzer: FileAnalyzer;
    private commitAnalyzer: CommitAnalyzer;
    private dependencyAnalyzer: DependencyAnalyzer;
    private qualityAnalyzer: QualityAnalyzer;
    
    constructor(config: Partial<AnalyzerConfig> = {}) {
        const mergedConfig = this.mergeConfig(config);
        const searcher = new CodeSearcher({
            // Project-B 配置
            index: {
                root: "./.index",
                maxCPUs: 2,
                timeout: 600000,
            },
            search: {
                defaultLimit: 10,
                timeout: 30000,
            }
        });
        
        this.fileAnalyzer = new FileAnalyzer(searcher, mergedConfig);
        this.commitAnalyzer = new CommitAnalyzer(mergedConfig);
        this.dependencyAnalyzer = new DependencyAnalyzer(searcher, mergedConfig);
        this.qualityAnalyzer = new QualityAnalyzer(searcher, mergedConfig);
    }
    
    async performReview(
        input: CodeReviewInput,
        progressCallback?: (progress: {
            stage: string;
            current: number;
            total: number;
            status: string;
        }) => void
    ): Promise<CodeReviewOutput> {
        try {
            // 1. 分析文件变更
            progressCallback?.({
                stage: 'file-analysis',
                current: 0,
                total: input.changes.files.length,
                status: 'started'
            });

            const fileAnalyses = await Promise.all(
                input.changes.files.map(async (file, index) => {
                    const analysis = await this.fileAnalyzer.analyzeFile(file);
                    progressCallback?.({
                        stage: 'file-analysis',
                        current: index + 1,
                        total: input.changes.files.length,
                        status: 'in-progress'
                    });
                    return analysis;
                })
            );

            // 2. 分析提交历史
            progressCallback?.({
                stage: 'commit-analysis',
                current: 0,
                total: 1,
                status: 'started'
            });

            const commitAnalysis = this.commitAnalyzer.analyzeCommits(
                input.changes.commits
            );

            progressCallback?.({
                stage: 'commit-analysis',
                current: 1,
                total: 1,
                status: 'completed'
            });

            // 3. 分析依赖关系
            progressCallback?.({
                stage: 'dependency-analysis',
                current: 0,
                total: 1,
                status: 'started'
            });

            const dependencyAnalysis = await this.dependencyAnalyzer.analyzeDependencies(
                input.changes.files
            );

            progressCallback?.({
                stage: 'dependency-analysis',
                current: 1,
                total: 1,
                status: 'completed'
            });

            // 4. 生成质量报告
            progressCallback?.({
                stage: 'quality-analysis',
                current: 0,
                total: 1,
                status: 'started'
            });

            const qualityReport = await this.qualityAnalyzer.analyzeQuality(
                input.changes.files
            );

            progressCallback?.({
                stage: 'quality-analysis',
                current: 1,
                total: 1,
                status: 'completed'
            });

            // 5. 生成输出报告
            progressCallback?.({
                stage: 'report-generation',
                current: 0,
                total: 1,
                status: 'started'
            });

            const output = this.generateOutput(
                input.changes.files,
                fileAnalyses,
                commitAnalysis,
                dependencyAnalysis,
                qualityReport
            );

            progressCallback?.({
                stage: 'report-generation',
                current: 1,
                total: 1,
                status: 'completed'
            });

            return output;
        } catch (error) {
            progressCallback?.({
                stage: 'error',
                current: 0,
                total: 0,
                status: `Error: ${error.message}`
            });
            throw error;
        }
    }

    private mergeConfig(config: Partial<AnalyzerConfig>): AnalyzerConfig {
        return {
            ...defaultConfig,
            ...config,
            global: {
                ...defaultConfig.global,
                ...config.global
            },
            fileAnalysis: {
                ...defaultConfig.fileAnalysis,
                ...config.fileAnalysis
            },
            commitAnalysis: {
                ...defaultConfig.commitAnalysis,
                ...config.commitAnalysis
            },
            qualityAnalysis: {
                ...defaultConfig.qualityAnalysis,
                ...config.qualityAnalysis
            },
            plugins: {
                ...defaultConfig.plugins,
                ...config.plugins
            }
        };
    }

    private generateOutput(
        files: FileChange[],
        fileAnalyses: any[],
        commitAnalysis: any,
        dependencyAnalysis: any,
        qualityReport: any
    ): CodeReviewOutput {
        // 1. 生成概览信息
        const overview = this.generateOverview(files, fileAnalyses);

        // 2. 组织文件分析结果
        const fileResults = this.organizeFileAnalyses(files, fileAnalyses);

        // 3. 生成建议
        const recommendations = this.generateRecommendations(
            fileAnalyses,
            commitAnalysis,
            dependencyAnalysis,
            qualityReport
        );

        return {
            overview,
            files: fileResults,
            commits: commitAnalysis,
            dependencies: dependencyAnalysis,
            quality: qualityReport,
            recommendations
        };
    }

    private generateOverview(files: FileChange[], fileAnalyses: any[]) {
        const totalChanges = files.reduce((sum, file) => sum + file.changes, 0);
        const addedFiles = files.filter(f => f.status === 'added').length;
        const removedFiles = files.filter(f => f.status === 'removed').length;
        const modifiedFiles = files.filter(f => f.status === 'modified').length;

        // 计算整体风险等级
        const riskLevel = this.calculateOverallRisk(fileAnalyses);

        // 确定审查状态
        const reviewStatus = this.determineReviewStatus(
            fileAnalyses,
            commitAnalysis,
            dependencyAnalysis,
            qualityReport
        );

        return {
            totalFiles: files.length,
            totalChanges,
            addedFiles,
            removedFiles,
            modifiedFiles,
            riskLevel,
            reviewStatus
        };
    }

    private organizeFileAnalyses(files: FileChange[], analyses: any[]) {
        const results: { [key: string]: any } = {};
        files.forEach((file, index) => {
            results[file.filename] = analyses[index];
        });
        return results;
    }

    private calculateOverallRisk(fileAnalyses: any[]): 'LOW' | 'MEDIUM' | 'HIGH' {
        const riskScores = fileAnalyses.map(analysis => {
            const impactRisk = analysis.impact.risk === 'HIGH' ? 1 : 
                             analysis.impact.risk === 'MEDIUM' ? 0.5 : 0;
            const qualityRisk = analysis.quality.issues.length > 0 ? 0.5 : 0;
            return impactRisk + qualityRisk;
        });

        const averageRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;

        if (averageRisk > 0.7) return 'HIGH';
        if (averageRisk > 0.4) return 'MEDIUM';
        return 'LOW';
    }

    private determineReviewStatus(
        fileAnalyses: any[],
        commitAnalysis: any,
        dependencyAnalysis: any,
        qualityReport: any
    ): 'PASS' | 'FAIL' | 'NEEDS_REVIEW' {
        // 检查是否有严重问题
        const hasCriticalIssues = fileAnalyses.some(analysis => 
            analysis.impact.risk === 'HIGH' || 
            analysis.quality.issues.some(i => i.severity === 'high')
        );

        // 检查是否有破坏性变更
        const hasBreakingChanges = dependencyAnalysis.breaking.length > 0;

        // 检查提交质量
        const hasPoorCommitQuality = commitAnalysis.riskLevel === 'HIGH';

        if (hasCriticalIssues || hasBreakingChanges || hasPoorCommitQuality) {
            return 'FAIL';
        }

        // 检查是否需要进一步审查
        const needsReview = fileAnalyses.some(analysis => 
            analysis.impact.risk === 'MEDIUM' || 
            analysis.quality.issues.length > 0
        );

        return needsReview ? 'NEEDS_REVIEW' : 'PASS';
    }

    private generateRecommendations(
        fileAnalyses: any[],
        commitAnalysis: any,
        dependencyAnalysis: any,
        qualityReport: any
    ): { critical: string[]; important: string[]; minor: string[] } {
        const recommendations = {
            critical: [] as string[],
            important: [] as string[],
            minor: [] as string[]
        };

        // 收集所有建议
        fileAnalyses.forEach(analysis => {
            analysis.suggestions.forEach(suggestion => {
                if (suggestion.priority === 'high') {
                    recommendations.critical.push(suggestion.message);
                } else if (suggestion.priority === 'medium') {
                    recommendations.important.push(suggestion.message);
                } else {
                    recommendations.minor.push(suggestion.message);
                }
            });
        });

        // 添加依赖相关建议
        if (dependencyAnalysis.breaking.length > 0) {
            recommendations.critical.push(
                `Found ${dependencyAnalysis.breaking.length} breaking changes`
            );
        }

        // 添加质量相关建议
        qualityReport.suggestions.forEach(suggestion => {
            if (suggestion.priority === 'high') {
                recommendations.critical.push(suggestion.message);
            } else if (suggestion.priority === 'medium') {
                recommendations.important.push(suggestion.message);
            } else {
                recommendations.minor.push(suggestion.message);
            }
        });

        return recommendations;
    }
} 