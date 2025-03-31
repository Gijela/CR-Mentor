export interface CodeReviewOutput {
    overview: {
        totalFiles: number;
        totalChanges: number;
        addedFiles: number;
        removedFiles: number;
        modifiedFiles: number;
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
        reviewStatus: 'PASS' | 'FAIL' | 'NEEDS_REVIEW';
    };
    files: {
        [filename: string]: FileAnalysis;
    };
    commits: {
        messages: string[];
        authors: string[];
        dates: string[];
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    dependencies: {
        affected: string[];
        breaking: string[];
        circular: string[];
    };
    quality: {
        metrics: QualityMetrics;
        issues: QualityIssue[];
        suggestions: Suggestion[];
    };
    recommendations: {
        critical: string[];
        important: string[];
        minor: string[];
    };
}

export interface FileAnalysis {
    changes: {
        additions: number;
        deletions: number;
        total: number;
        type: 'added' | 'removed' | 'modified' | 'renamed';
    };
    impact: {
        scope: string[];
        risk: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    quality: {
        complexity: number;
        maintainability: number;
        readability: number;
    };
    issues: Issue[];
    suggestions: Suggestion[];
}

export interface Issue {
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
    column?: number;
    code?: string;
}

export interface Suggestion {
    type: 'improvement' | 'fix' | 'optimization';
    message: string;
    priority: 'high' | 'medium' | 'low';
}

export interface QualityMetrics {
    complexity: number;
    maintainability: number;
    readability: number;
    testCoverage?: number;
}

export interface QualityIssue {
    type: 'complexity' | 'maintainability' | 'readability' | 'test-coverage';
    severity: 'high' | 'medium' | 'low';
    message: string;
    location?: string;
    suggestion?: string;
} 