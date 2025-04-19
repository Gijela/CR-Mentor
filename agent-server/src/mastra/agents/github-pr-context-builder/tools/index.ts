// Get pull request detail
import { getPrDetail } from "./get-pr-detail";

// Get Github Action artifact content
import { getGithubActionArtifactContent } from "./get-action-artifact";

// Group changed files
import { groupChangedFiles } from "./group-changed-files";

// Get issue details
import { getIssueDetail } from "./get-issues-detail";

export const contextBuilderTools = {
  getPrDetail,
  getGithubActionArtifactContent,
  groupChangedFiles,
  getIssueDetail,
};
