// Placeholder for exporting tools

// Tool for getting PR details
import { getPullRequestDetails } from './get-pull-request-details';

// Tool for checking PR size (Optional Stage 0)
import { checkPRSize } from './checkPRSize';

// Tool to delegate file review to the sub-agent
import { performComprehensiveFileReview } from './performComprehensiveFileReview';

// Tool for recommending review focus based on aggregated findings
import { recommendReviewFocus } from './recommend-review-focus';

// Tool for posting the final comment
import { postPrComment } from './post-pr-comment';

// Note: Removed old analysis tools like checkLogicConsistency, analyzeChangeImpact, etc.
// Their functionality is now intended to be handled within the github-diff-review agent.

// Combine all tools for the main code review agent (orchestrator)
export const codeReviewTools = {
  // Core workflow tools
  getPullRequestDetails,
  performComprehensiveFileReview,
  recommendReviewFocus,
  postPrComment,
  // Optional tools
  checkPRSize,
};