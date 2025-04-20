export interface ChangedFile {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  changes: number;
  additions: number;
  deletions: number;
}

interface DependencyInfo {
  dependencies: string[];
  dependents: string[];
}

interface DependencyGraph {
  [filePath: string]: DependencyInfo;
}

export interface FileGroup {
  type: string; // e.g., 'dependency_group', 'config', 'docs', 'workflow', 'ignored', 'removed', 'isolated_change'
  reason: string;
  changedFiles: string[]; // Files changed in this PR belonging to the group
  dependencies: string[]; // Files that changedFiles in this group depend on (context)
  dependents: string[];   // Files that depend on changedFiles in this group (context)
  changes: number;
  additions: number;
  deletions: number;
}

// --- Helper Function: Define Filters/Categorizers ---

function categorizeFile(filename: string, status: ChangedFile['status']): { type: string; reason: string } | null {
  if (status === 'removed') {
    return { type: 'removed', reason: 'File removed in this PR' };
  }
  // Basic build artifact check (can be made more robust)
  if (filename.startsWith('dist/') || filename.includes('/dist/') || filename.startsWith('build/') || filename.includes('/build/')) {
    return { type: 'ignored', reason: 'Filtered out as build artifact' };
  }
  // Lock files
  if (filename.endsWith('.lock') || filename.endsWith('lock.yaml') || filename === 'pnpm-lock.yaml') {
    return { type: 'config_or_dependencies', reason: 'Dependency lock file' };
  }
  // Common config files
  if (filename === 'package.json') {
    return { type: 'config_or_dependencies', reason: 'Package manager configuration' };
  }
  if (filename === '.gitignore') {
    return { type: 'config_or_dependencies', reason: 'Git ignore file' };
  }
  if (filename.endsWith('tsconfig.json') || filename.startsWith('.eslintrc') || filename.startsWith('prettier.config')) {
    return { type: 'config_or_dependencies', reason: 'Project configuration file' };
  }
  // Documentation
  if (filename.endsWith('.md') || filename.toUpperCase().startsWith('LICENSE')) {
    return { type: 'docs', reason: 'Documentation or license file' };
  }
  // CI/CD
  if (filename.includes('.github/workflows/') || filename.includes('.gitlab-ci')) {
    return { type: 'workflow', reason: 'CI/CD workflow file' };
  }
  // Add more specific rules based on project conventions (e.g., test files)
  // if (filename.includes('.test.') || filename.includes('.spec.')) {
  //   return { type: 'test', reason: 'Test file' };
  // }

  // If none of the above, assume it's a reviewable source file
  return null;
}

/**
 * Groups changed files based on their dependencies and predefined categories.
 *
 * @param changedFileList - An array of objects representing changed files.
 * @param dependencyGraph - An object representing the project's dependency graph.
 * @returns An array of FileGroup objects, distinguishing changed files and context files (dependencies/dependents).
 */
export function groupChangedFilesBasedOnDeps(
  changedFileList: ChangedFile[],
  dependencyGraph: DependencyGraph
): FileGroup[] {
  // Create a map for quick lookup of file stats
  const fileStatsMap = new Map<string, ChangedFile>();
  changedFileList.forEach(file => fileStatsMap.set(file.filename, file));

  const groups: { [type: string]: FileGroup } = {};
  const reviewableFiles: string[] = [];
  const changedFileSet = new Set(changedFileList.map(f => f.filename)); // Keep track of all originally changed files

  // 1. Pre-process and Categorize Files
  for (const file of changedFileList) {
    const category = categorizeFile(file.filename, file.status);
    if (category) {
      if (!groups[category.type]) {
        // Initialize group with new structure (empty context arrays and zero stats)
        groups[category.type] = { type: category.type, reason: category.reason, changedFiles: [], dependencies: [], dependents: [], changes: 0, additions: 0, deletions: 0 };
      } else if (groups[category.type].changedFiles.length === 0) {
        // Update reason if the group was pre-initialized but empty
        groups[category.type].reason = category.reason;
      }
      groups[category.type].changedFiles.push(file.filename);
      // Accumulate stats
      groups[category.type].changes += file.changes;
      groups[category.type].additions += file.additions;
      groups[category.type].deletions += file.deletions;
    } else {
      // Only consider files for dependency analysis if they exist in the graph and weren't removed
      if (dependencyGraph[file.filename] !== undefined && file.status !== 'removed') {
        reviewableFiles.push(file.filename);
      } else if (file.status !== 'removed') {
        // File changed, not special, but not in dependency graph (e.g., new untracked file, asset)
        const isolatedType = 'isolated_change';
        if (!groups[isolatedType]) {
          // Initialize group with new structure (empty context arrays and zero stats)
          groups[isolatedType] = { type: isolatedType, reason: 'Changed file not in dependency graph or unrelated', changedFiles: [], dependencies: [], dependents: [], changes: 0, additions: 0, deletions: 0 };
        }
        groups[isolatedType].changedFiles.push(file.filename);
        // Accumulate stats
        groups[isolatedType].changes += file.changes;
        groups[isolatedType].additions += file.additions;
        groups[isolatedType].deletions += file.deletions;
      }
    }
  }

  // 2. Build Adjacency List for Reviewable Files Subgraph
  const adj: Map<string, Set<string>> = new Map();
  for (const file of reviewableFiles) {
    if (!adj.has(file)) {
      adj.set(file, new Set()); // Initialize node
    }

    // Get dependencies and dependents from the graph
    const dependencies = dependencyGraph[file]?.dependencies || [];
    const dependents = dependencyGraph[file]?.dependents || [];
    const relatedFiles = [...dependencies, ...dependents];

    for (const relatedFile of relatedFiles) {
      // Connect if related file is also in the reviewable set for this PR
      if (reviewableFiles.includes(relatedFile)) {
        if (!adj.has(relatedFile)) {
          adj.set(relatedFile, new Set());
        }
        adj.get(file)?.add(relatedFile);
        adj.get(relatedFile)?.add(file);
      }
    }
  }

  // 3. Find Connected Components (Dependency Groups) using DFS
  const visited: Set<string> = new Set();
  const dependencyGroups: FileGroup[] = [];

  function dfs(node: string, currentComponent: string[]) {
    visited.add(node);
    currentComponent.push(node);
    const neighbors = adj.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, currentComponent);
      }
    }
  }

  for (const file of reviewableFiles) {
    if (!visited.has(file)) {
      const componentChangedFiles: string[] = []; // Changed files in this component
      dfs(file, componentChangedFiles);

      if (componentChangedFiles.length > 0) {
        // Find context files (dependencies and dependents) for this component
        const componentDependencies = new Set<string>();
        const componentDependents = new Set<string>();
        const componentFileSet = new Set(componentChangedFiles); // Faster lookups
        let componentChanges = 0;
        let componentAdditions = 0;
        let componentDeletions = 0;

        for (const changedFile of componentChangedFiles) {
          const stats = fileStatsMap.get(changedFile);
          if (stats) {
            componentChanges += stats.changes;
            componentAdditions += stats.additions;
            componentDeletions += stats.deletions;
          }

          // Get dependencies of this changed file
          (dependencyGraph[changedFile]?.dependencies || []).forEach(dep => {
            // Add if it's NOT part of the component itself
            if (!componentFileSet.has(dep)) {
              componentDependencies.add(dep);
            }
          });

          // Get dependents of this changed file
          (dependencyGraph[changedFile]?.dependents || []).forEach(dep => {
            // Add if it's NOT part of the component itself
            if (!componentFileSet.has(dep)) {
              componentDependents.add(dep);
            }
          });
        }

        dependencyGroups.push({
          type: 'dependency_group',
          reason: componentChangedFiles.length > 1
            ? 'Connected component in changed dependency graph'
            : 'Changed file with no reviewable dependencies/dependents in this PR',
          changedFiles: componentChangedFiles,
          dependencies: Array.from(componentDependencies), // Convert Set to Array
          dependents: Array.from(componentDependents),   // Convert Set to Array
          changes: componentChanges,
          additions: componentAdditions,
          deletions: componentDeletions
        });
      }
    }
  }

  // 4. Combine Results: Start with categorized groups, then add dependency groups
  const finalGroups = [...Object.values(groups), ...dependencyGroups];

  // Remove any potentially empty groups (where changedFiles is empty)
  return finalGroups.filter(group => group.changedFiles.length > 0);
}
