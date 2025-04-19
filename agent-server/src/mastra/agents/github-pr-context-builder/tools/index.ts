// Get pull request detail
import { getPullRequestDetail } from "./get-pull-request-detail";

// Get Github Action artifact content
import { getGithubActionArtifactContent } from "./get-action-artifact";

// Group changed files
import { groupChangedFiles } from "./group-changed-files";

// Get issue details
import { getIssueDetail } from "./get-issues-detail";

export const contextBuilderTools = {
  getPullRequestDetail,
  getGithubActionArtifactContent,
  groupChangedFiles,
  getIssueDetail,
};
