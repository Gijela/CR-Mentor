# 后端开发计划：开发者自我代码回顾与成长分析工具 (Koa 上下文)

**版本：** 1.0
**日期：** 2023-10-27 (以此日期为例，请替换为实际日期)
**负责人：** [您的名字/团队]

## 1. 项目目标

构建后端服务，能够：

1.  使用**全局配置的 GitHub Token** (通过 `process.env.GITHUB_TOKEN` 获取)。
2.  接收用户指定的分析参数，包括：
    - 要分析的 GitHub 仓库列表 (owner, repoName, branchName)。
    - 分析的时间范围 (since, until)。
    - 要分析的目标 GitHub 用户名 (`targetUsername`)。
3.  通过已集成的 Octokit (从 `src/mastra/lib/github.ts` 导入)，从 GitHub 获取指定用户在指定时间段内、指定仓库中的所有 commit 及其引入的代码变更 (diffs/patches)。
4.  将收集到的分析结果**临时保存在内存中**。
5.  **直接将内存中的分析数据作为 API 响应返回给客户端** (同步处理模式)。

**核心目的：** 快速验证核心数据获取流程，为后续功能迭代打下基础。

## 2. 架构与约定

- **项目基础：** `koa-server` (已有的 Koa 项目结构)。
- **GitHub API 交互：** 使用项目已集成的 `Octokit` 实例 (预期从 `src/mastra/lib/github.ts` 导入，并已使用 `process.env.GITHUB_TOKEN` 初始化)。
- **分层架构：**
  - **Router:** `koa-server/src/router/github/index.ts` (在此文件中定义新路由)。
  - **Controller:** `koa-server/src/controller/github.ts` (在此文件中创建新的 Controller 处理函数)。
  - **Service:** 新建 Service 文件，例如 `koa-server/src/service/github/analysisService.ts` (在此文件中实现核心业务逻辑)。
- **数据持久化：** 初期阶段**不涉及数据库存储**，所有数据在请求处理完成后即释放。
- **Token 处理：** 初期阶段**不处理用户动态提供的 Token**，依赖全局配置。

## 3. 开发阶段与任务分解 (后端专注)

### Sprint 1: 核心功能实现 (预计 1-2 周)

#### 任务 1.1: 定义新的 API 路由

- **文件：** `koa-server/src/router/github/index.ts`
- **路由定义：**
  - 方法: `POST`
  - 路径: `/github/analyzeUserActivity`
- **请求体 (Request Body) 结构示例：**
  ```json
  {
    "repositories": [
      { "owner": "string", "repoName": "string", "branchName": "string" },
      { "owner": "string", "repoName": "string", "branchName": "string" }
    ],
    "timeRange": {
      "since": "string (ISO 8601 Format, e.g., YYYY-MM-DDTHH:MM:SSZ)",
      "until": "string (ISO 8601 Format, e.g., YYYY-MM-DDTHH:MM:SSZ)"
    },
    "targetUsername": "string (GitHub Username)"
  }
  ```

#### 任务 1.2: 创建新的 Controller 函数

- **文件：** `koa-server/src/controller/github.ts`
- **函数名示例：** `analyzeUserActivityController`
- **职责：**
  1.  接收 Koa 上下文 `ctx`。
  2.  从 `ctx.request.body` 中获取请求参数 (`repositories`, `timeRange`, `targetUsername`)。
  3.  对参数进行基本的非空和类型校验。
  4.  调用 `analysisService.fetchAndAnalyzeCommits()` (见任务 1.3)，传递必要的参数。
  5.  如果 Service 成功返回数据，将数据设置到 `ctx.body` 并返回 HTTP 200 OK。
  6.  如果 Service 抛出错误，捕获错误，记录日志，并设置 `ctx.status` 和 `ctx.body` 返回适当的错误响应。

#### 任务 1.3: 创建新的 Service 文件及核心逻辑函数

- **文件：** `koa-server/src/service/github/analysisService.ts` (如果目录不存在则创建)
- **函数名示例：** `async function fetchAndAnalyzeCommits(repositories, timeRange, targetUsername)`
- **职责与实现细节：**
  1.  导入并使用全局的 `GithubAPI` 实例 (来自 `src/mastra/lib/github.ts`)。
  2.  初始化一个空数组 `allAnalysisResults` 用于存储所有仓库的分析结果 (其结构如 `RepositoryAnalysis[]`)。
  3.  遍历 `repositories` 参数数组中的每个 `repoConfig` (`{ owner, repoName, branchName }`)：
      a. 初始化一个空数组 `commitsDataForCurrentRepo` 用于存储当前仓库的 commit 详情 (其结构如 `CommitDetail[]`)。
      b. **获取 Commit 历史 (分页处理)：**
      i. 设置初始页码 `page = 1`，`per_page = 100`。
      ii. 使用 `while` 循环进行分页请求。
      iii. 调用 `GithubAPI.repos.listCommits()`。
      iv. 如果响应数据为空，跳出分页循环。
      v. 遍历当前页获取到的每个 `commit` 对象。
      c. **获取每个 Commit 的代码变更 (Diffs)：**
      i. 对于每个 `commit.sha`，调用 `GithubAPI.repos.getCommit()`。
      ii. 从响应 `response.data.files` 中提取文件变更信息。
      iii. 构建 `FileChange` 对象数组。
      d. 构建 `CommitDetail` 对象。
      e. 将 `CommitDetail` 添加到 `commitsDataForCurrentRepo`。
      f. 分页循环结束后，构建 `RepositoryAnalysis` 对象并添加到 `allAnalysisResults`。
      g. 使用 `try...catch` 处理错误，记录日志。
  4.  函数最终返回 `allAnalysisResults` 数组。
- **数据结构定义 (在 Service 文件中或单独的类型文件中)：**

  ```typescript
  interface FileChange {
    filename: string;
    status: "added" | "modified" | "removed" | "renamed" | string;
    patch: string | null;
  }

  interface CommitDetail {
    sha: string;
    message: string;
    date: string;
    files: FileChange[];
  }

  interface RepositoryAnalysis {
    owner: string;
    repoName: string;
    branchName: string;
    commits: CommitDetail[];
  }
  ```

#### 任务 1.4: 初步手动测试

- **工具：** Postman, Insomnia, 或 `curl`。
- **步骤：**
  1.  确保 `process.env.GITHUB_TOKEN` 已正确设置。
  2.  启动 `koa-server`。
  3.  构造符合任务 1.1 定义的请求体。
  4.  向 `POST /github/analyzeUserActivity` 端点发送请求。
- **验证：**
  - API 是否成功返回 HTTP 200？
  - 响应体数据结构是否符合预期？
  - 是否包含正确的 commits 和 diffs？
  - 测试分页逻辑。
  - 测试边界条件。

### Sprint 2: (可选) 优化与清理 (预计 0.5-1 周)

- **任务 2.1: Service 层代码重构与健壮性提升**
  - 将核心逻辑拆分为更小的辅助函数。
  - 改进错误处理逻辑。
  - 细致处理 API 速率限制的日志记录。
- **任务 2.2: Controller 层参数校验强化**
  - 引入轻量级校验库对请求体验证。
- **任务 2.3: 增加基础日志记录**
  - 在关键路径添加日志记录。

## 4. 后续步骤

1.  **Token 处理优化：** 实现用户动态提供 Token 的机制。
2.  **数据持久化：** 集成数据库存储分析结果。
3.  **异步处理与任务队列：** 改进长时间运行任务的处理方式。
4.  **LLM 集成：** 发送 `patch` 数据给 LLM 进行分析。
5.  **前端界面：** 开发用户界面。
6.  **错误处理与用户反馈：** 完善错误提示。
7.  **API 速率限制处理：** 实现更智能的速率限制逻辑。

## 5. 环境与依赖

- Node.js & pnpm/npm/yarn
- Koa.js
- `@octokit/rest` (已通过 `src/mastra/lib/github.ts` 集成)
- `process.env.GITHUB_TOKEN` 需要预先配置好。

---

这份开发计划旨在快速搭建核心数据获取流程。在实际开发过程中，请根据具体情况灵活调整。祝您开发顺利！
