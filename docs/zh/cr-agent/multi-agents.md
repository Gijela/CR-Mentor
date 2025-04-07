
好的，经过我们详细的探讨和逐步优化，现在我为你梳理一下当前我认为**最优秀**的自动化 Code Review 方案。这个方案充分考虑了 Agent 的动态决策能力、上下文限制、代码库访问、模块化设计以及开发者最佳实践（小 PR）。

**方案核心架构：主 Agent 协调 + 专用文件审查子 Agent (通过 Tool 调用)**

此方案采用分层设计：

1.  **主 Agent (`codeReviewAgent`)**: 担当**协调者 (Orchestrator)** 的角色，负责整个审查流程的高层规划、任务分发和最终结果汇总。它不直接处理大量代码细节。
2.  **中间 Tool (`performComprehensiveFileReview`)**: 作为主 Agent 和子 Agent 之间的**桥梁和 API 调用器**。它的实现非常简单，只负责调用子 Agent。
3.  **子 Agent (`fileReviewerAgent`)**: 担当**文件审查专家 (Worker)** 的角色，专门负责对**单个文件**进行深入、全面的审查，包括获取数据、上下文和执行分析。

**详细流程步骤:**

1.  **阶段零：触发与 PR 规模预检**
    *   **Actor**: 应用层 / 主 `codeReviewAgent`
    *   **输入**: PR 事件信息 (`owner`, `repo`, `pull_number`)。
    *   **动作**:
        *   (应用层或主 Agent 初始步骤) 调用 `checkPRSize` 工具 (需要新建)。
        *   `checkPRSize` 工具内部调用 `getPullRequestDetails` 获取文件数和变更行数。
        *   主 Agent 接收规模信息。
    *   **输出**: PR 规模数据 (文件数、行数)。
    *   **目的**: 快速识别可能过大的 PR，为后续报告提供信息，并设定合理预期。

2.  **阶段一：主 Agent 理解概览与规划**
    *   **Actor**: 主 `codeReviewAgent`
    *   **输入**: PR 基本信息 (`owner`, `repo`, `pull_number`, `description`)。
    *   **动作**:
        *   调用 `getPullRequestDetails` 工具获取 PR 的详细元数据（确认文件列表、作者、关联 Issue 等）。
        *   分析 PR 描述和元数据，理解变更的核心目标。
        *   **动态决策**: 基于 PR 规模、描述、文件类型等信息，规划需要审查的文件列表（可能全部审查，也可能优先关注某些文件）。
    *   **输出 (Agent 内部状态)**: 需要审查的文件路径列表，对 PR 目标的理解。
    *   **目的**: 设定审查范围和策略。

3.  **阶段二：主 Agent 委托文件级审查 (迭代)**
    *   **Actor**: 主 `codeReviewAgent`
    *   **输入 (循环)**: 上一步规划的文件路径列表。
    *   **动作 (对每个文件路径 `filePath`)**:
        *   **调用中间 Tool**: 调用 `performComprehensiveFileReview` 工具，将 `filePath` 和 PR 基本信息 (`owner`, `repo`, `pull_number`, `prDescription`) 作为参数传递。
        *   **中间 Tool (`performComprehensiveFileReview`) 执行**:
            *   接收参数。
            *   **调用子 Agent API**: 调用 `fileReviewerAgent.generate()` 方法，传递必要的输入 (文件路径、PR 信息)。
            *   **等待并返回**: 等待 `fileReviewerAgent` 完成处理并返回结构化的 JSON 审查结果。将此 JSON 结果直接返回给主 Agent。
        *   **主 Agent 记录结果**: 主 Agent 接收并**存储**针对文件 `filePath` 返回的**结构化审查结果**。**注意：主 Agent 的上下文仅包含此结构化结果，不包含文件 Patch 或详细上下文代码。**
    *   **输出 (循环累积)**: 一个包含所有已审查文件及其结构化审查结果的集合（例如，存储在 Agent 的内部状态或传递给下一轮思考的精简上下文中）。
    *   **目的**: 将复杂的文件级审查任务委托给专门的子 Agent，保持主 Agent 上下文简洁，并收集每个文件的结构化分析结果。

4.  **阶段三：子 Agent 执行文件级审查 (在 `generate` 内部)**
    *   **Actor**: 子 Agent (`fileReviewerAgent`)
    *   **输入**: 文件路径 (`filePath`)，PR 基本信息 (`owner`, `repo`, `pull_number`, `prDescription`)。
    *   **动作 (在其 `generate` 方法的多轮 `maxSteps` 内)**:
        *   **a. 获取 Patch**: 调用其配置的 `getFilePatch` 工具获取 `filePath` 的 Patch。
        *   **b. 动态上下文获取**: **自主思考**需要哪些上下文 -> **动态调用**其配置的 `codebaseTools` (`getFileContent`, `getRepositoryCommits` 等) 获取**相关的上下文片段/摘要**。
        *   **c. LLM 综合分析**: 构建包含 Patch、上下文片段、PR 描述片段和详细审查指令的 Prompt -> 调用其 LLM 模型进行多方面评估（一致性、实践、架构、可读性、风险等）。
        *   **d. 生成结构化结果**: 配置 `generate` 使用 `output` 或 `experimental_output`，确保 LLM 返回**标准化的 JSON 格式**的审查结果。
    *   **输出**: 一个包含对该文件详细审查结果的 JSON 对象。
    *   **目的**: 独立、深入地完成单个文件的审查任务，并返回标准化的结果。

5.  **阶段四：主 Agent 全局综合与报告**
    *   **Actor**: 主 `codeReviewAgent`
    *   **输入**: 所有文件级审查返回的**结构化结果集合**，原始 PR 描述，阶段零获取的 PR 规模信息。
    *   **动作**:
        *   分析和汇总所有文件的结构化结果。
        *   **执行全局评估**: 构建**不含代码**的 Prompt，要求 LLM 基于汇总的问题和 PR 目标进行高层次评估（跨文件影响、整体架构、主要风险）。
        *   **整合报告内容**: 结合全局评估、文件级问题详情。
        *   **(如果 PR 规模过大)**: 加入建议拆分 PR 的提示和理由。
        *   调用 `recommendReviewFocus` 工具提炼重点。
        *   生成最终的审查报告。
        *   (可选) 调用 `postPrComment` 工具发布报告。
    *   **输出**: 最终的 Code Review 报告，以及（可选的）已发布的 PR 评论。
    *   **目的**: 从整体视角形成结论，提供 actionable 的反馈。

**总结此方案的优势:**

*   **高度 Agentic**: 主 Agent 驱动整个流程，进行高层动态决策。子 Agent 负责文件级动态决策。
*   **有效管理上下文**: 主 Agent 上下文保持轻量，避免了因处理大量代码而超限。文件级上下文在子 Agent 内部处理，其范围天然受限于单个文件及其相关片段。
*   **模块化与封装**: 职责清晰，文件级审查逻辑内聚在子 Agent 中，易于维护和测试。
*   **利用框架能力**: 充分利用了 Mastra Agent 的自动工具调用、`maxSteps` 和结构化输出能力，简化了复杂逻辑的实现。
*   **处理 PR 规模**: 内置了对大型 PR 的识别和建议机制。

这个方案是在平衡了动态决策需求、上下文限制、实现复杂度和框架能力后，我认为当前最理想、最健壮的设计。
