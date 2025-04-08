import { getFilePatch } from "./get-file-patch";
import { getFileContentFromRepo } from './get-file-content-from-repo';
import { getPullRequestDetails } from './get-pull-request-details';

// Combine all tools for the diff review agent
export const diffReviewTools = {
  getFilePatch,
  getFileContentFromRepo,
  getPullRequestDetails,
};

// Optional: Export types if needed elsewhere
export type DiffReviewTools = typeof diffReviewTools;
