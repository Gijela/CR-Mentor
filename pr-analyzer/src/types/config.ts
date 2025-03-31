export interface AnalyzerConfig {
    // 全局配置
    global: {
        timeout: number;
        maxRetries: number;
        parallel: boolean;
    };
    
    // 文件分析配置
    fileAnalysis: {
        maxFileSize: number;
        timeout: number;
        excludedPatterns: string[];
    };
    
    // 提交分析配置
    commitAnalysis: {
        maxCommits: number;
        riskThresholds: {
            low: number;
            medium: number;
            high: number;
        };
    };
    
    // 质量分析配置
    qualityAnalysis: {
        rules: QualityRule[];
        thresholds: QualityThresholds;
        metrics: QualityMetrics;
    };
    
    // 插件配置
    plugins: {
        enabled: string[];
        config: Record<string, any>;
    };
}

export interface QualityRule {
    name: string;
    threshold: number;
    severity: 'high' | 'medium' | 'low';
}

export interface QualityThresholds {
    complexity: number;
    maintainability: number;
    readability: number;
}

export interface QualityMetrics {
    complexity: number;
    maintainability: number;
    readability: number;
}

export const defaultConfig: AnalyzerConfig = {
    global: {
        timeout: 30000,
        maxRetries: 3,
        parallel: true
    },
    fileAnalysis: {
        maxFileSize: 1024 * 1024, // 1MB
        timeout: 5000,
        excludedPatterns: [
            '*.min.js',
            '*.map',
            'node_modules/**'
        ]
    },
    commitAnalysis: {
        maxCommits: 100,
        riskThresholds: {
            low: 0.3,
            medium: 0.6,
            high: 0.8
        }
    },
    qualityAnalysis: {
        rules: [
            {
                name: 'complexity',
                threshold: 10,
                severity: 'high'
            }
        ],
        thresholds: {
            complexity: 10,
            maintainability: 0.7,
            readability: 0.8
        },
        metrics: {
            complexity: 0,
            maintainability: 0,
            readability: 0
        }
    },
    plugins: {
        enabled: [],
        config: {}
    }
}; 