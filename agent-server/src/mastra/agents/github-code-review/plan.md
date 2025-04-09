## Agent 角色

- **`github-code-review` (Orchestrator):** 负责接收 PR 审查请求，协调整个流程，调用工具获取信息，分发文件级审查任务给 `github-diff-review`，汇总结果并生成最终报告。**它本身不直接分析代码或 diff。**
- **`github-diff-review` (File Review Specialist):** 专注于审查 **单个文件** 的 diff。它接收文件路径和必要的上下文信息，获取文件内容和 diff，进行分析，并以 **结构化的 JSON 格式** 返回审查结果。

## 详细数据流

1.  **启动 (`github-code-review`)**:

    - **输入:** 接收 `owner`, `repo`, `pull_number` 作为初始输入。

2.  **获取 PR 上下文 (`github-code-review`)**:

    - 调用 `getPullRequestDetail` 工具。
    - **输入给工具:** `owner`, `repo`, `pull_number`。
    - **从工具获取:** PR 的元数据，关键信息包括：
      - `files`: 变更的文件列表（包含 `filePath`）。
      - `description`: PR 的描述。
      - `headRef`: PR 的头部分支引用（例如分支名或 commit SHA），用于后续获取文件内容。
      - 其他元数据（标题、作者等）。
    - **内部存储:** Agent 存储这些获取到的 PR 上下文信息。

3.  **（可选）检查 PR 大小 (`github-code-review`)**:

    - 调用 `checkPRSize` 工具。
    - **输入给工具:** (可能隐式使用已获取的 PR 信息或 `files` 列表)。
    - **从工具获取:** PR 的大小指标（如文件数、总行数变化）。
    - **内部存储:** Agent 存储大小信息，可能用于最终报告。

4.  **迭代处理文件并委托审查 (`github-code-review` -> `github-diff-review`)**:

    - `github-code-review` 遍历从 `getPullRequestDetail` 获取的 `files` 列表。
    - **对于列表中的每一个 `filePath`:**
      - 调用 `performComprehensiveFileReview` 工具。**这是两个 agent 协作的核心接口。**
      - **传递给 `performComprehensiveFileReview` 的数据 (即 `github-diff-review` 的输入):**
        - `owner`
        - `repo`
        - `pull_number`
        - 当前的 `filePath`
        - `prDescription` (来自步骤 2)
        - `headRef` (来自步骤 2，`github-diff-review` 需要用它来获取文件的完整内容)
      - **`performComprehensiveFileReview` 内部执行 (调用 `github-diff-review` agent):**
        - **a. 获取文件内容 (`github-diff-review`)**:
          - 调用 `getFileContentFromRepo` 工具。
          - **输入给工具:** `owner`, `repo`, `filePath`, `headRef`。
          - **从工具获取:** 该文件在 `headRef` 状态下的完整内容 (`fullFileContent`)。
        - **b. 获取文件 Diff (`github-diff-review`)**:
          - 调用 `getFilePatch` 工具。
          - **输入给工具:** `owner`, `repo`, `pull_number`, `filePath`。
          - **从工具获取:** 该文件的 diff/patch 内容 (`diffPatch`)。
        - **c. 分析与生成 Findings (`github-diff-review`)**:
          - 根据其 `instructions`，结合 `diffPatch`、`fullFileContent` 和 `prDescription` 进行分析。
          - **特别注意:** 如果 diff 中的代码与 **外部导入** 的符号交互，必须添加 `severity: 'info'` 的 finding，并包含特定免责声明，**不会**尝试获取外部文件内容。
          - 生成符合 `DiffReviewOutputSchema` 的 `findings` 列表。
        - **d. 格式化输出 (`github-diff-review`)**:
          - 将 `filePath` 和生成的 `findings` (以及可选的 `error`) 组装成一个 **严格的 JSON 对象**。
      - **从 `performComprehensiveFileReview` 返回给 `github-code-review` 的数据:**
        - 一个结构化的 JSON 对象，包含 `filePath`, `findings` 数组 (每个 finding 包含 `line`, `severity`, `category`, `comment`), 以及可选的 `error` 字段。
      - **`github-code-review` 存储结果:** agent **只存储** 这个返回的结构化 JSON 对象，**不会** 保留文件内容或 diff。

5.  **聚合 Findings (`github-code-review`)**:

    - 在遍历完所有文件后，`github-code-review` 收集所有从 `performComprehensiveFileReview` 调用中返回的 JSON 结果。
    - **内部数据:** 形成一个 `AggregatedReviews` 数组，每个元素是单个文件的审查结果 JSON 对象。

6.  **综合分析与生成报告 (`github-code-review`)**:

    - **分析输入:** `AggregatedReviews` 数组 (只包含结构化数据)。
    - **分析过程:** 检查跨文件的模式、高严重性问题等，**仅基于聚合的 findings JSON 数据**。 
    - **(可选) 推荐焦点:** 调用 `recommendReviewFocus` 工具。
      - **输入给工具:** 聚合的 `findings` 或其摘要。
      - **从工具获取:** 推荐的审查焦点。
    - **构建报告:** 生成 Markdown 格式的最终报告。
      - **报告内容来源:** PR 描述、可选的 PR 大小信息、可选的推荐焦点、以及 **详细的 findings 列表**（从聚合的 JSON 数据中提取并格式化，按文件分组）。

7.  **发布评论 (`github-code-review`)**:
    - **(可选)** 调用 `postPrComment` 工具。
    - **输入给工具:** 生成的 Markdown 报告，以及 `owner`, `repo`, `pull_number`。
    - **输出:** 在 GitHub PR 上发布评论。

这个流程清晰地展示了 `github-code-review` 作为协调者，如何通过调用 `performComprehensiveFileReview` 工具将文件级审查任务委托给 `github-diff-review`，并精确地定义了两者之间通过结构化 JSON 数据进行信息交换的方式。
