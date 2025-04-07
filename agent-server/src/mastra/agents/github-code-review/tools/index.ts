// Placeholder for exporting tools

// Phase 1 Tool
import { getPullRequestDetails } from './get-pull-request-details';

// Phase 2 Tools
import { checkLogicConsistency } from './check-logic-consistency';
import { integrateKnowledgeBase } from './integrate-knowledge-base';
import { analyzeChangeImpact } from './analyze-change-impact';
import { assessTestRelevance } from './assess-test-relevance';
import { checkArchitectureAdherence } from './check-architecture-adherence';
import { checkProjectPractices } from './check-project-practices';
import { recommendReviewFocus } from './recommend-review-focus';

// Phase 5 Tool
import { postPrComment } from './post-pr-comment';

// 封装所有工具为单个对象统一导出
export const codeReviewTools = {
  getPullRequestDetails,
  checkLogicConsistency,
  integrateKnowledgeBase,
  analyzeChangeImpact,
  assessTestRelevance,
  checkArchitectureAdherence,
  checkProjectPractices,
  recommendReviewFocus,
  postPrComment,
};