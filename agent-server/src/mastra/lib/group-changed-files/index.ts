export interface ChangedFile {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  // other properties like changes, additions, deletions are not needed for grouping
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
  files: string[];
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
 * @returns An array of FileGroup objects.
 */
export function groupChangedFilesBasedOnDeps(
  changedFileList: ChangedFile[],
  dependencyGraph: DependencyGraph
): FileGroup[] {

  const groups: { [type: string]: FileGroup } = {};
  const reviewableFiles: string[] = [];

  // 1. Pre-process and Categorize Files
  for (const file of changedFileList) {
    const category = categorizeFile(file.filename, file.status);
    if (category) {
      if (!groups[category.type]) {
        // Initialize group if it doesn't exist
        groups[category.type] = { type: category.type, reason: category.reason, files: [] };
      } else if (groups[category.type].files.length === 0) {
        // Update reason if the group was pre-initialized but empty (less likely now)
        groups[category.type].reason = category.reason;
      }
      groups[category.type].files.push(file.filename);
    } else {
      // Only consider files for dependency analysis if they exist in the graph and weren't removed
      if (dependencyGraph[file.filename] !== undefined && file.status !== 'removed') {
        reviewableFiles.push(file.filename);
      } else if (file.status !== 'removed') {
        // File changed, not special, but not in dependency graph (e.g., new untracked file, asset)
        const isolatedType = 'isolated_change';
        if (!groups[isolatedType]) {
          groups[isolatedType] = { type: isolatedType, reason: 'Changed file not in dependency graph or unrelated', files: [] };
        }
        groups[isolatedType].files.push(file.filename);
      }
    }
  }

  // 2. Build Adjacency List for Reviewable Files Subgraph
  const adj: Map<string, Set<string>> = new Map();
  for (const file of reviewableFiles) {
    if (!adj.has(file)) {
      adj.set(file, new Set()); // Initialize node
    }

    // Get dependencies and dependents from the graph, handle cases where file might be missing (though filtered above)
    const dependencies = dependencyGraph[file]?.dependencies || [];
    const dependents = dependencyGraph[file]?.dependents || [];

    // Combine both lists to check for connections within the reviewable set
    const relatedFiles = [...dependencies, ...dependents];

    for (const relatedFile of relatedFiles) {
      // Crucial check: Is the related file also in our set of reviewable files for this PR?
      if (reviewableFiles.includes(relatedFile)) {
        if (!adj.has(relatedFile)) {
          adj.set(relatedFile, new Set()); // Initialize neighbor node if not present
        }
        // Add edges in both directions for an undirected graph representation
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
    const neighbors = adj.get(node) || new Set(); // Get neighbors or empty set if node has no connections
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, currentComponent);
      }
    }
  }

  for (const file of reviewableFiles) {
    if (!visited.has(file)) {
      const component: string[] = [];
      dfs(file, component);
      if (component.length > 0) {
        dependencyGroups.push({
          type: 'dependency_group',
          // Provide a more informative reason based on component size
          reason: component.length > 1
            ? 'Connected component in changed dependency graph'
            : 'Changed file with no reviewable dependencies/dependents in this PR',
          files: component
        });
      }
    }
  }

  // 4. Combine Results: Start with categorized groups, then add dependency groups
  const finalGroups = [...Object.values(groups), ...dependencyGroups];

  // Remove any potentially empty groups (e.g., if a category had no files)
  return finalGroups.filter(group => group.files.length > 0);
}
