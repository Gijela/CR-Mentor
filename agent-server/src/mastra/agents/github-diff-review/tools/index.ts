import { getFilePatch } from "./get-file-patch";
import { getFileContentFromRepo } from './get-file-content-from-repo';

// Combine all tools for the diff review agent
export const diffReviewTools = {
  getFilePatch,
  getFileContentFromRepo,
};

// Optional: Export types if needed elsewhere
export type DiffReviewTools = typeof diffReviewTools;
