import { Agent } from "@mastra/core/agent";

// TODO: Select an appropriate model provider
import { deepSeekModel } from '../../model-provider/deepseek';

import { codeReviewInstructions } from "./instructions";
import * as tools from "./tools";

export const codeReviewAgent = new Agent({
  name: "github-code-review-agent", // Descriptive name
  model: deepSeekModel, // Use an appropriate LLM
  instructions: codeReviewInstructions,
  // memory: // Add memory if state needs to be preserved across interactions (optional)
  tools: {
    // Phase 1 Tool
    getPullRequestDetails: tools.getPullRequestDetails,
    // Phase 2 Tools
    checkLogicConsistency: tools.checkLogicConsistency,
    integrateKnowledgeBase: tools.integrateKnowledgeBase,
    analyzeChangeImpact: tools.analyzeChangeImpact,
    assessTestRelevance: tools.assessTestRelevance,
    checkArchitectureAdherence: tools.checkArchitectureAdherence,
    checkProjectPractices: tools.checkProjectPractices,
    recommendReviewFocus: tools.recommendReviewFocus,
    // Phase 5 Tool
    postPrComment: tools.postPrComment,
  },
  // description: "An agent that performs AI-assisted code reviews on GitHub Pull Requests.", // Optional but helpful
});
