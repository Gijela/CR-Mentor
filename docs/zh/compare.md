**核心目标：** 不再孤立地审查单个文件变更，而是结合其完整的**本地上下文**（文件全文）和**结构化关系上下文**（直接依赖与被依赖文件的路径），理解变更在代码库中的**联系**和**潜在影响**，并通过**按需获取**相关文件内容进行深入分析，从而提供更深入、更准确的审查意见。

**完整流程：**

1.  **触发 (Trigger):**

    - 开发者向代码仓库提交 Pull Request (PR) 或更新现有 PR。
    - GitHub (或类似平台) 触发一个事件 (如 `pull_request.opened`, `pull_request.synchronize`)。

2.  **准备阶段 (Preparation - 由 GitHub Actions 自动化):**

    - 与 PR 事件关联的 **GitHub Action** 自动运行。
    - Action **检出** PR 分支的最新代码。
    - Action 运行**静态分析工具** (例如 `dependency-cruiser` for JS/TS, `pydeps` for Python)。
    - 该工具分析代码，生成**文件级别的代码依赖图** (精简后的 JSON 格式，包含各文件 `dependencies` 和 `dependents` 路径列表)，描述文件之间的直接导入/依赖关系。
    - Action 将生成的依赖图 JSON 文件作为**产物 (Artifact)** 上传。

3.  **启动与数据获取 (Initiation & Data Fetching - 由入口服务/协调者 Agent 处理):**

    - Code Review 系统的**入口服务**或**协调者 Agent** (`github-code-review`) 接收到来自 GitHub 的 Webhook 事件。
    - 调用 GitHub API (`getPullRequestDetail` Tool) 获取 PR 的详细信息，关键信息包括：
      - **变更文件列表** (`changedFiles`) 及其 Diffs (`diffs`)。
      - PR 的头提交 SHA (`headSha`)。
      - PR 描述等元数据。
    - 调用特定工具 (`getGithubActionArtifactContent` Tool) **下载并获取**之前 GitHub Action 生成的**精简依赖图 JSON 数据** (`dependencyGraph`)。
    - (按需) 调用 GitHub API 获取 `changedFiles` 列表中每个文件的**完整内容** (`fullFileContents`)。

4.  **任务准备与分发 (Task Preparation & Distribution - 由协调者 Agent 处理):**

    - **遍历 `changedFiles` 列表中的每一个 `changedFile`。**
    - 为每个 `changedFile` 创建一个独立的审查任务。
    - **准备任务上下文:**
      - 该文件的 `diff`。
      - 该文件的**完整内容** (`fullFileContent`)。
      - 从 `dependencyGraph` 中查询 `changedFile` 对应的条目，提取其直接的**依赖文件路径列表** (`dependencies`) 和**被依赖文件路径列表** (`dependents`)，组合成 `dependencyInfo`。
    - 将任务 (包含 `filePath`, `diff`, `fullFileContent`, `dependencyInfo`) 分发给审查 Agent (`github-diff-review`) (通常通过消息队列或直接调用)。

5.  **上下文感知与按需探索的文件审查 (Context-Aware & On-Demand Exploration File Review - 由审查 Agent 执行):**

    - 审查 Agent (`github-diff-review`) 接收任务。
    - **核心分析:** Agent 在分析 `diff` 时，会同时利用：
      - `fullFileContent` 作为强大的**本地上下文**。
      - `dependencyInfo` (依赖和被依赖的文件路径列表) 作为**结构化关系上下文**，了解该文件与哪些其他文件直接相关。
    - **按需获取外部内容 (关键能力):**
      - 如果 Agent 在分析过程中，判断需要查看 `dependencyInfo` 中列出的某个相关文件（无论是依赖项还是被依赖项）的**具体内容**才能准确理解 `diff` 的影响或正确性，它将**发起一个精确的请求** (例如，调用一个新的 `getFileContent` Tool) 来获取该文件的内容。
      - Agent 将获取到的外部文件内容整合进当前的分析过程。
    - 执行代码分析，识别潜在问题 (逻辑错误、风格问题、安全隐患等)，生成初步的 Findings。
    - Agent 可以根据 `dependencyInfo` 和按需获取的内容，对那些涉及跨文件交互的 Findings 进行**特殊标记**或提高优先级。
    - **输出:** 针对当前 `changedFile` 的结构化的 Findings 列表 (包含文件、行号、描述、严重性、类别，以及可能的上下文相关标记)。

6.  **跨文件综合与风险评估 (Cross-File Synthesis & Risk Assessment - 由协调者 Agent/聚合服务处理):**

    - **输入:** 所有审查 Agent 返回的 Findings 列表，以及完整的 `dependencyGraph`。
    - **核心处理:**
      - 聚合所有 Findings。
      - **利用依赖图进行全局分析:**
        - 检查一个文件的变更 Findings 是否与 `dependencyInfo` 中列出的依赖文件或被依赖文件中的 Findings (或被 Agent 标记的潜在问题) 相关联。
        - 例如，识别出"文件 A 修改了 API (有 Finding)，依赖 A 的文件 B 在审查中被标记需要关注此 API (或 Agent 请求查看了 B)"这类模式。
        - 尝试基于文件依赖关系**链接或合并**看似独立但根源相同的 Findings。
        - 结合文件在依赖图中的重要性 (如被多少文件依赖) 和 Findings 的严重性，进行更准确的**风险评估**。
    - **输出:** 经过整理、去重、关联、并带有风险评估的最终 Findings 列表。

7.  **报告生成与交付 (Report Generation & Delivery - 由报告生成服务处理):**
    - 将最终的 Findings 列表格式化成易于阅读的报告 (例如 Markdown 格式)。
    - 报告中应清晰地区分**文件内问题**和**基于依赖关系推断出的潜在跨文件关联问题**。
    - (可选) 调用平台 API (如 GitHub API) 将报告作为评论发布到 PR 上。

**总结这个思路的关键优势：**

- **强本地上下文:** 提供文件全文，极大增强对 diff 内部逻辑的理解。
- **明确的依赖感知:** 预先告知 Agent 直接相关的依赖和被依赖文件路径，使其具备结构化上下文意识。
- **按需深度探索:** 允许 Agent 在必要时精确请求相关文件的内容，进行深入分析，避免信息过载。
- **风险意识:** 通过提供被依赖文件列表，使 Agent 能主动考虑变更对下游的影响。
- **平衡与效率:** 在预提供信息量和按需获取之间取得平衡，提高了分析效率和准确性。

这个流程虽然仍然需要健壮的 Agent 和工具支持，但它通过结合文件全文、依赖路径信息和按需内容获取，为实现更准确、更深入的自动化代码审查提供了一个非常实用和强大的框架。
