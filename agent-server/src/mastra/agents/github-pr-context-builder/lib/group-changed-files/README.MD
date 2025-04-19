## groupChangedFilesBasedOnDeps 原理

`groupChangedFilesBasedOnDeps` 函数的逻辑：

**核心目标：** 这个函数的目标是接收一个包含本次 Pull Request 中所有变更文件信息 (`changedFileList`) 的列表和一个代表整个项目文件依赖关系 (`dependencyGraph`) 的图谱，然后将这些变更文件划分成逻辑上相关的组 (`FileGroup[]`)。这些分组不仅包含本次 PR 中实际变更的文件，还明确区分了与之相关的上下文文件（依赖项和被依赖项），以便后续进行更有针对性的 Code Review。

**主要步骤分解：**

1.  **预处理和分类 (Pre-process and Categorize Files):**

    - **遍历变更文件:** 函数首先会遍历传入的 `changedFileList` 中的每一个文件。
    - **调用 `categorizeFile`:** 对每个文件，它会调用辅助函数 `categorizeFile`。这个辅助函数根据一系列预定义的规则（比如文件后缀名 `.md`, `.lock`, `pnpm-lock.yaml`，特定文件名 `package.json`, `.gitignore`，路径包含 `dist/` 或 `.github/workflows/`，以及文件的 `status` 是否为 `removed`）来判断这个文件是否属于一个"特殊类别"。
    - **处理特殊类别:** 如果 `categorizeFile` 返回了一个类别（如 `'docs'`, `'config_or_dependencies'`, `'workflow'`, `'ignored'`, `'removed'`），这个文件就会被直接放入对应类别的分组 (`groups` 对象) 的 `changedFiles` 数组中。这些分组的 `dependencies` 和 `dependents` 数组会被初始化为空数组。
    - **识别待审查文件:** 如果 `categorizeFile` 返回 `null`，意味着这可能是一个需要进行依赖分析的源代码文件。这时会检查两个条件：
      - 该文件是否存在于 `dependencyGraph` 中（即我们有它的依赖信息）。
      - 该文件的状态不是 `'removed'`。
      - 如果两个条件都满足，该文件名会被加入 `reviewableFiles` 列表，等待下一步的依赖分析。
    - **处理孤立变更:** 如果一个文件不是特殊类别，状态不是 `removed`，但它又**不**存在于 `dependencyGraph` 中（可能是新添加但还没被依赖分析工具扫描到的文件，或者是一些不被追踪的资源文件），它会被归入 `'isolated_change'` 分组的 `changedFiles` 数组中，其 `dependencies` 和 `dependents` 也为空数组。

2.  **构建邻接表 (Build Adjacency List for Reviewable Files Subgraph):**

    - **目标:** 为上一步筛选出的 `reviewableFiles` 创建一个图的表示（邻接表 `adj`），但这个图**只包含这些 `reviewableFiles` 之间**的直接依赖或被依赖关系。这相当于从完整的 `dependencyGraph` 中提取出一个只关于本次变更中相关源文件的"子图"。
    - **遍历待审查文件:** 遍历 `reviewableFiles` 列表中的每个文件 `file`。
    - **查找关联文件:** 从完整的 `dependencyGraph` 中查找 `file` 的 `dependencies` 和 `dependents` 列表。
    - **建立连接 (边):** 对于 `file` 的每一个依赖或被依赖文件 `relatedFile`，**检查 `relatedFile` 是否也存在于 `reviewableFiles` 列表中**。只有当关联文件也是本次 PR 中需要审查的文件时，才在邻接表 `adj` 中为 `file` 和 `relatedFile` 之间添加一条边（因为是无向图，所以是双向添加）。

3.  **查找连通分量与收集上下文 (Find Connected Components & Collect Context):**

    - **目标:** 在上一步构建的"变更子图"（由 `adj` 表示）中，找出所有相互连接的文件组（连通分量）。对于每个连通分量，确定哪些是本次变更的文件，哪些是相关的上下文文件（依赖项/被依赖项）。
    - **深度优先搜索 (DFS):** 使用标准的图遍历算法 DFS。
    - **遍历与标记:** 遍历 `reviewableFiles`。如果一个文件还没有被访问过 (`visited` 集合)，就从这个文件开始执行 DFS。
    - **收集变更文件:** DFS 会沿着邻接表 `adj` 中的边探索所有能到达的文件，并将它们收集到一个 `componentChangedFiles` 数组中。所有在同一次 DFS 中被访问到的文件构成一个连通分量，这些就是该分组中的**变更文件**。
    - **收集上下文文件:** 对于每个找到的连通分量 (`componentChangedFiles`)：
      - 遍历该分量中的每一个 `changedFile`。
      - 在**原始**的 `dependencyGraph` 中查找这个 `changedFile` 的所有 `dependencies`（它依赖的文件）。如果某个依赖文件**不**属于当前的 `componentChangedFiles`，则将其（去重后）加入该分组的 `dependencies` 列表。
      - 在**原始**的 `dependencyGraph` 中查找这个 `changedFile` 的所有 `dependents`（依赖它的文件）。如果某个被依赖文件**不**属于当前的 `componentChangedFiles`，则将其（去重后）加入该分组的 `dependents` 列表。
    - **创建依赖分组:** 每个找到的连通分量连同其收集到的上下文信息，被创建为一个 `'dependency_group'` 类型的 `FileGroup` 对象，并添加到 `dependencyGroups` 列表中。分组的 `reason` 会根据组件大小有所不同。

4.  **合并结果 (Combine Results):**
    - 将第一步中按类别分好的特殊文件组 (`groups` 对象的值) 和第三步中找到的基于依赖关系的组 (`dependencyGroups`) 合并成一个最终的列表 `finalGroups`。
    - 最后，过滤掉 `changedFiles` 数组为空的分组。

**最终输出:**

函数返回一个 `FileGroup[]` 数组。每个 `FileGroup` 对象包含：

- `type`: 分组的类型（如 `'dependency_group'`, `'docs'`, `'config_or_dependencies'` 等）。
- `reason`: 对这个分组类型的简要说明。
- `changedFiles`: 一个数组，包含属于该分组的、在本次 PR 中**实际变更**的文件路径。
- `dependencies`: 一个数组，包含**不属于** `changedFiles` 但被 `changedFiles` 中的文件所**依赖**的文件路径（作为上下文）。
- `dependents`: 一个数组，包含**不属于** `changedFiles` 但**依赖于** `changedFiles` 中文件的文件路径（作为上下文）。

这个输出结构不仅组织了变更文件，还明确提供了每个分组（尤其是依赖分组）的直接上下文信息，极大地帮助后续的 Code Review Agent 理解变更的影响范围。

## test.ts 返回结果

````json
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
  "issueBodies": {
    "1": "## 流程图\r\n```mermaid\r\ngraph TD\r\n    A[加载环境变量] --> B[初始化Git操作]\r\n    B --> C[克隆Git仓库]\r\n    C --> D{克隆成功?}\r\n    D -- 是 --> E[切换Git分支]\r\n    D -- 否 --> F[抛出GitOperationError]\r\n    E --> G{切换成功?}\r\n    G -- 是 --> H[操作完成]\r\n    G -- 否 --> I[抛出GitOperationError]\r\n\r\n    subgraph Error Handling\r\n        F --> J[GitOperationError]\r\n        I --> J\r\n        K[FileProcessError]\r\n        L[ValidationError]\r\n        M[DependencyAnalysisError]\r\n        N[GitAnalysisError]\r\n    end\r\n\r\n    subgraph Env Management\r\n        A --> O[dotenv]\r\n        A --> P[env.ts]\r\n    end\r\n\r\n    subgraph Dependency Management\r\n        B --> Q[simple-git]\r\n        B --> R[path]\r\n        B --> S[errors.ts]\r\n    end\r\n ```\r\n \r\n ## 时序图\r\n ```mermaid\r\n sequenceDiagram\r\n    participant User\r\n    participant GitAction\r\n    participant EnvManager\r\n    participant ErrorHandler\r\n\r\n    User->>GitAction: 初始化Git操作\r\n    GitAction->>EnvManager: 加载环境变量\r\n    EnvManager-->>GitAction: 返回环境变量\r\n    GitAction->>GitAction: 配置Git代理\r\n    GitAction-->>User: 初始化完成\r\n\r\n    User->>GitAction: 克隆仓库\r\n    GitAction->>GitAction: 执行克隆操作\r\n    alt 克隆成功\r\n        GitAction-->>User: 返回成功\r\n    else 克隆失败\r\n        GitAction->>ErrorHandler: 抛出GitOperationError\r\n        ErrorHandler-->>User: 返回错误信息\r\n    end\r\n\r\n    User->>GitAction: 切换分支\r\n    GitAction->>GitAction: 执行切换操作\r\n    alt 切换成功\r\n        GitAction-->>User: 返回成功\r\n    else 切换失败\r\n        GitAction->>ErrorHandler: 抛出GitOperationError\r\n        ErrorHandler-->>User: 返回错误信息\r\n    end\r\n```"
  },
  "reviewGroups": [
    {
      "type": "workflow",
      "reason": "CI/CD workflow file",
      "changedFiles": [".github/workflows/build_dependency_graph.yml"],
      "dependencies": [],
      "dependents": []
    },
    {
      "type": "config_or_dependencies",
      "reason": "Git ignore file",
      "changedFiles": [
        ".gitignore",
        "package.json",
        "pnpm-lock.yaml",
        "tsconfig.json"
      ],
      "dependencies": [],
      "dependents": []
    },
    {
      "type": "docs",
      "reason": "Documentation or license file",
      "changedFiles": ["README-zh.md", "README.md"],
      "dependencies": [],
      "dependents": []
    },
    {
      "type": "ignored",
      "reason": "Filtered out as build artifact",
      "changedFiles": ["dist/index.d.ts", "dist/index.js"],
      "dependencies": [],
      "dependents": []
    },
    {
      "type": "removed",
      "reason": "File removed in this PR",
      "changedFiles": ["example/index.ts"],
      "dependencies": [],
      "dependents": []
    },
    {
      "type": "dependency_group",
      "reason": "Connected component in changed dependency graph",
      "changedFiles": [
        "src/core/codeAnalyzer.ts",
        "src/index.ts",
        "src/utils/analyzeDependencies.ts"
      ],
      "dependencies": [
        "src/core/errors.ts",
        "src/core/gitAction.ts",
        "src/core/scanner.ts",
        "src/utils/graphSearch.ts",
        "src/utils/index.ts"
      ],
      "dependents": []
    },
    {
      "type": "dependency_group",
      "reason": "Changed file with no reviewable dependencies/dependents in this PR",
      "changedFiles": ["src/types/index.ts"],
      "dependencies": [],
      "dependents": []
    }
  ]
}
````
