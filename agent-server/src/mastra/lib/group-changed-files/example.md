## pr diff 内容(changedFiles)

```json
{
  "metadata": {
    "title": "2a",
    "description": "x\r\n\r\n#1 \r\n\r\nCreated by: [@Gijela](https://github.com/Gijela)",
    "author": "cr-mentor[bot]",
    "url": "https://github.com/Gijela/git-analyze/pull/10",
    "state": "open",
    "number": 10,
    "baseRef": "faeture/deploy_vercel",
    "headRef": "main",
    "headSha": "e7d53572eddb7dcc34b69a818b4f11f0a75740d1"
  },
  "associatedIssues": [
    {
      "number": 1,
      "title": "1",
      "url": "https://github.com/Gijela/git-analyze/issues/1",
      "state": "open"
    }
  ],
  "comments": [
    {
      "id": 2790354520,
      "user": "Gijela",
      "body": "test1\r\n",
      "createdAt": "2025-04-09T16:41:19Z",
      "url": "https://github.com/Gijela/git-analyze/pull/10#issuecomment-2790354520"
    }
  ],
  "files": [
    {
      "filename": ".github/workflows/build_dependency_graph.yml",
      "status": "added",
      "changes": 100,
      "additions": 100,
      "deletions": 0
    },
    {
      "filename": ".gitignore",
      "status": "modified",
      "changes": 4,
      "additions": 2,
      "deletions": 2
    },
    {
      "filename": "README-zh.md",
      "status": "added",
      "changes": 304,
      "additions": 304,
      "deletions": 0
    },
    {
      "filename": "README.md",
      "status": "modified",
      "changes": 285,
      "additions": 234,
      "deletions": 51
    },
    {
      "filename": "dist/index.d.ts",
      "status": "added",
      "changes": 134,
      "additions": 134,
      "deletions": 0
    },
    {
      "filename": "dist/index.js",
      "status": "added",
      "changes": 1205,
      "additions": 1205,
      "deletions": 0
    },
    {
      "filename": "example/index.ts",
      "status": "removed",
      "changes": 58,
      "additions": 0,
      "deletions": 58
    },
    {
      "filename": "package.json",
      "status": "modified",
      "changes": 21,
      "additions": 12,
      "deletions": 9
    },
    {
      "filename": "pnpm-lock.yaml",
      "status": "modified",
      "changes": 839,
      "additions": 305,
      "deletions": 534
    },
    {
      "filename": "src/core/codeAnalyzer.ts",
      "status": "modified",
      "changes": 48,
      "additions": 24,
      "deletions": 24
    },
    {
      "filename": "src/index.ts",
      "status": "modified",
      "changes": 16,
      "additions": 8,
      "deletions": 8
    },
    {
      "filename": "src/types/index.ts",
      "status": "modified",
      "changes": 4,
      "additions": 4,
      "deletions": 0
    },
    {
      "filename": "src/utils/analyzeDependencies.ts",
      "status": "added",
      "changes": 20,
      "additions": 20,
      "deletions": 0
    },
    {
      "filename": "tsconfig.json",
      "status": "modified",
      "changes": 6,
      "additions": 3,
      "deletions": 3
    }
  ]
}
```

## 文件依赖图数据(dependencyGraph)

```json
{
  "src/core/codeAnalyzer.ts": {
    "dependencies": [],
    "dependents": ["src/index.ts"]
  },
  "src/core/errors.ts": {
    "dependencies": [],
    "dependents": [
      "src/core/gitAction.ts",
      "src/core/scanner.ts",
      "src/index.ts"
    ]
  },
  "src/core/gitAction.ts": {
    "dependencies": ["src/core/errors.ts"],
    "dependents": ["src/index.ts"]
  },
  "src/core/scanner.ts": {
    "dependencies": ["src/utils/index.ts", "src/core/errors.ts"],
    "dependents": ["src/index.ts"]
  },
  "src/utils/index.ts": {
    "dependencies": ["src/utils/graphSearch.ts"],
    "dependents": ["src/core/scanner.ts", "src/index.ts"]
  },
  "src/utils/graphSearch.ts": {
    "dependencies": [],
    "dependents": ["src/utils/index.ts", "src/index.ts"]
  },
  "src/index.ts": {
    "dependencies": [
      "src/core/codeAnalyzer.ts",
      "src/core/errors.ts",
      "src/core/gitAction.ts",
      "src/core/scanner.ts",
      "src/utils/analyzeDependencies.ts",
      "src/utils/graphSearch.ts",
      "src/utils/index.ts"
    ],
    "dependents": []
  },
  "src/utils/analyzeDependencies.ts": {
    "dependencies": [],
    "dependents": ["src/index.ts"]
  },
  "src/types/index.ts": {
    "dependencies": [],
    "dependents": []
  }
}
```

## 输出结果

```js
console.log(groupChangedFilesBasedOnDeps(changedFiles.files as ChangedFile[], dependencyGraph));
```

```js
[
  {
    type: "workflow",
    reason: "CI/CD workflow file",
    files: [".github/workflows/build_dependency_graph.yml"],
  },
  {
    type: "config_or_dependencies",
    reason: "Git ignore file",
    files: [".gitignore", "package.json", "pnpm-lock.yaml", "tsconfig.json"],
  },
  {
    type: "docs",
    reason: "Documentation or license file",
    files: ["README-zh.md", "README.md"],
  },
  {
    type: "ignored",
    reason: "Filtered out as build artifact",
    files: ["dist/index.d.ts", "dist/index.js"],
  },
  {
    type: "removed",
    reason: "File removed in this PR",
    files: ["example/index.ts"],
  },
  {
    type: "dependency_group",
    reason: "Connected component in changed dependency graph",
    files: [
      "src/core/codeAnalyzer.ts",
      "src/index.ts",
      "src/utils/analyzeDependencies.ts",
    ],
  },
  {
    type: "dependency_group",
    reason:
      "Changed file with no reviewable dependencies/dependents in this PR",
    files: ["src/types/index.ts"],
  },
];
```

## groupChangedFilesBasedOnDeps 原理

`groupChangedFilesBasedOnDeps` 函数的逻辑：

**核心目标：** 这个函数的目标是接收一个包含本次 Pull Request 中所有变更文件信息 (`changedFileList`) 的列表和一个代表整个项目文件依赖关系 (`dependencyGraph`) 的图谱，然后将这些变更文件划分成逻辑上相关的组 (`FileGroup[]`)，以便后续进行更有针对性的 Code Review。

**主要步骤分解：**

1.  **预处理和分类 (Pre-process and Categorize Files):**

    - **遍历变更文件:** 函数首先会遍历传入的 `changedFileList` 中的每一个文件。
    - **调用 `categorizeFile`:** 对每个文件，它会调用辅助函数 `categorizeFile`。这个辅助函数根据一系列预定义的规则（比如文件后缀名 `.md`, `.lock`, `pnpm-lock.yaml`，特定文件名 `package.json`, `.gitignore`，路径包含 `dist/` 或 `.github/workflows/`，以及文件的 `status` 是否为 `removed`）来判断这个文件是否属于一个“特殊类别”。
    - **处理特殊类别:** 如果 `categorizeFile` 返回了一个类别（如 `'docs'`, `'config_or_dependencies'`, `'workflow'`, `'ignored'`, `'removed'`），这个文件就会被直接放入对应类别的分组 (`groups` 对象) 中。例如，所有 `.md` 文件会进入 `'docs'` 分组。
    - **识别待审查文件:** 如果 `categorizeFile` 返回 `null`，意味着这可能是一个需要进行依赖分析的源代码文件。这时会检查两个条件：
      - 该文件是否存在于 `dependencyGraph` 中（即我们有它的依赖信息）。
      - 该文件的状态不是 `'removed'`。
      - 如果两个条件都满足，该文件名会被加入 `reviewableFiles` 列表，等待下一步的依赖分析。
    - **处理孤立变更:** 如果一个文件不是特殊类别，状态不是 `removed`，但它又**不**存在于 `dependencyGraph` 中（可能是新添加但还没被依赖分析工具扫描到的文件，或者是一些不被追踪的资源文件），它会被归入 `'isolated_change'` 分组。

2.  **构建邻接表 (Build Adjacency List for Reviewable Files Subgraph):**

    - **目标:** 为上一步筛选出的 `reviewableFiles` 创建一个图的表示（邻接表 `adj`），但这个图**只包含这些 `reviewableFiles` 之间**的直接依赖或被依赖关系。这相当于从完整的 `dependencyGraph` 中提取出一个只关于本次变更中相关源文件的“子图”。
    - **遍历待审查文件:** 遍历 `reviewableFiles` 列表中的每个文件 `file`。
    - **查找关联文件:** 从完整的 `dependencyGraph` 中查找 `file` 的 `dependencies` 和 `dependents` 列表。
    - **建立连接 (边):** 对于 `file` 的每一个依赖或被依赖文件 `relatedFile`，**检查 `relatedFile` 是否也存在于 `reviewableFiles` 列表中**。只有当关联文件也是本次 PR 中需要审查的文件时，才在邻接表 `adj` 中为 `file` 和 `relatedFile` 之间添加一条边（因为是无向图，所以是双向添加）。

3.  **查找连通分量 (Find Connected Components using DFS):**

    - **目标:** 在上一步构建的“变更子图”（由 `adj` 表示）中，找出所有相互连接的文件组。一个连通分量里的所有文件，意味着它们在本次 PR 的变更中，通过直接或间接的依赖关系联系在了一起。
    - **深度优先搜索 (DFS):** 使用标准的图遍历算法 DFS。
    - **遍历与标记:** 遍历 `reviewableFiles`。如果一个文件还没有被访问过 (`visited` 集合)，就从这个文件开始执行 DFS。
    - **收集组件:** DFS 会沿着邻接表 `adj` 中的边探索所有能到达的文件，并将它们收集到一个 `component` 数组中。所有在同一次 DFS 中被访问到的文件构成一个连通分量。
    - **创建依赖分组:** 每个找到的 `component` 都被认为是一个 `'dependency_group'`，并添加到 `dependencyGroups` 列表中。分组的 `reason` 会根据组件大小有所不同（是多个文件连接而成，还是单个文件在本次变更中没有与其他变更文件关联）。

4.  **合并结果 (Combine Results):**
    - 将第一步中按类别分好的特殊文件组 (`groups` 对象的值) 和第三步中找到的基于依赖关系的组 (`dependencyGroups`) 合并成一个最终的列表 `finalGroups`。
    - 最后，过滤掉可能因为某些类别没有任何文件而产生的空分组。

**最终输出:**

函数返回一个 `FileGroup[]` 数组。每个 `FileGroup` 对象包含：

- `type`: 分组的类型（如 `'dependency_group'`, `'docs'`, `'config_or_dependencies'` 等）。
- `reason`: 对这个分组类型的简要说明。
- `files`: 一个包含属于该分组的所有文件名的数组。

这个输出结构清晰地展示了哪些文件应该一起审查（`'dependency_group'`），哪些文件可以按类别处理，哪些可以忽略，为后续的 Code Review 流程提供了重要的输入。
