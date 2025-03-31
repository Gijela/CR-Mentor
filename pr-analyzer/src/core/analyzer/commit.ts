import { Commit } from '../../types/input';
import { AnalyzerConfig } from '../../types/config';

export class CommitAnalyzer {
    constructor(private config: AnalyzerConfig) {}

    analyzeCommits(commits: Commit[]): CommitAnalysis {
        // 1. 分析提交信息
        const messages = this.analyzeCommitMessages(commits);
        
        // 2. 分析提交作者
        const authors = this.analyzeAuthors(commits);
        
        // 3. 分析提交时间
        const dates = this.analyzeCommitDates(commits);
        
        // 4. 评估风险等级
        const riskLevel = this.assessRiskLevel(commits);

        return {
            messages,
            authors,
            dates,
            riskLevel
        };
    }

    private analyzeCommitMessages(commits: Commit[]) {
        return commits.map(commit => {
            const message = commit.commit.message;
            return {
                content: message,
                format: this.checkCommitMessageFormat(message),
                quality: this.checkCommitMessageQuality(message)
            };
        });
    }

    private analyzeAuthors(commits: Commit[]) {
        return [...new Set(commits.map(c => c.commit.author.name))];
    }

    private analyzeCommitDates(commits: Commit[]) {
        return commits.map(c => c.commit.author.date);
    }

    private checkCommitMessageFormat(message: string): boolean {
        // 检查提交信息格式是否符合规范
        const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+$/;
        return conventionalCommitRegex.test(message);
    }

    private checkCommitMessageQuality(message: string): number {
        let quality = 1.0;

        // 检查长度
        if (message.length < 10) {
            quality *= 0.8;
        }

        // 检查是否包含问题描述
        if (!message.includes('what') && !message.includes('why')) {
            quality *= 0.9;
        }

        // 检查是否包含技术细节
        if (!message.includes('how')) {
            quality *= 0.9;
        }

        return quality;
    }

    private assessRiskLevel(commits: Commit[]): 'LOW' | 'MEDIUM' | 'HIGH' {
        const riskFactors = {
            messageQuality: this.calculateMessageQualityRisk(commits),
            commitSize: this.calculateCommitSizeRisk(commits),
            authorExperience: this.calculateAuthorExperienceRisk(commits)
        };

        const riskScore = Object.values(riskFactors).reduce((a, b) => a + b, 0) / Object.keys(riskFactors).length;

        if (riskScore > this.config.commitAnalysis.riskThresholds.high) return 'HIGH';
        if (riskScore > this.config.commitAnalysis.riskThresholds.medium) return 'MEDIUM';
        return 'LOW';
    }

    private calculateMessageQualityRisk(commits: Commit[]): number {
        const qualities = commits.map(c => this.checkCommitMessageQuality(c.commit.message));
        const averageQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
        return 1 - averageQuality;
    }

    private calculateCommitSizeRisk(commits: Commit[]): number {
        const maxCommits = this.config.commitAnalysis.maxCommits;
        return Math.min(commits.length / maxCommits, 1);
    }

    private calculateAuthorExperienceRisk(commits: Commit[]): number {
        // 这里可以添加更复杂的作者经验评估逻辑
        // 目前简单返回一个固定值
        return 0.5;
    }
} 