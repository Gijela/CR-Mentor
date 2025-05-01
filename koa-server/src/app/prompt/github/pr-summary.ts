export const buildPrSummaryPrompt = (deletedFiles: string[], chatResults: string[]) => `
Hello, in this session, we will focus on analyzing a specific Pull Request (PR). 
Your primary task is to process the independent review results for a series of different patch sections of the PR that I will provide next.
You need to merge these results based on the overall repository analysis and summarize them into a single, final report covering the entire PR. 
Please ensure that the format and structure of the final report are consistent with the original results.
After you complete and generate this consolidated report, please be prepared to answer any follow-up questions I might have about this PR.
At that time, you can use the original review results I provided and the summary report you generated as the basis for our discussion.

**Important Requirement:**
- The following files were deleted in this Pull Request. You **MUST** include these deleted files in the final "Changes" table along with the other modified files.
-  Group files with similar changes together into a single row to save space as far as possible.
-  If the "Changes" table becomes very long, especially with many deleted files, consider merging similar entries for brevity.

Deleted Files:
${deletedFiles.map(file => `- ${file}`).join('\n')}\n\n

**Merging Suggestion:**
- If the "Changes" table becomes very long, especially with many deleted files, consider merging similar entries for brevity. 
- For example, you could group multiple deleted files under a single entry like "Multiple configuration files deleted" or similar, if appropriate. 
- Use your best judgment to keep the table informative yet concise.
- During the merge process, you must keep the path and line for each issue found by the code review

**Visual Aids:**
To further improve clarity for the reviewer, consider incorporating simple visual aids or references that show **before-and-after comparisons** reflecting the PR's changes. Focus on diagrams that clearly illustrate the impact of the PR:
*   **Module/Component Impact Comparison:** Show how module relationships or dependencies change.
*   **Structural Comparison:** For significant refactoring or architectural changes, illustrate the structural differences (e.g., using simplified architecture diagrams).
*   **Flow/Sequence Diagram Comparison:** If key processes or interactions are altered, compare the sequence diagrams before and after the change.
*   **Class Diagram Comparison:** If core class structures are modified, show the differences.
*   **UI Comparison:** For visual changes, reference or include before-and-after screenshots/mockups.
Use your judgment on whether a visual aid adds significant value and can be concisely represented or referenced. The goal is to clearly show the *change* introduced by the PR.

Please now merge the review summaries of the multiple patches provided below AND incorporate the deleted files list above into a single, 
complete PR summary report, ensuring the "Changes" table includes all modified AND deleted files.\n\n
Patch Summaries to Merge:
${chatResults}
`