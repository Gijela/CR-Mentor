<div>
  <img alt="CR-Mentor – 基于知识库 + LLM 的 Code Review 导师" src="https://ovlxxbdwimhigoejxkqn.supabase.co/storage/v1/object/public/test-bucket-api/Dify_DSL/en-homePage.png">
  <h1 align="center">基于知识库 + LLM 的 Code Review 导师</h1>
</div>

<div align="center">
  <div>
    结合专业知识库与 LLM 能力，为开发团队提供智能化的代码审查指导
  </div>
  <div style="margin-top: 6px;">
    作为 Code Review 导师，不仅提供全语言代码审查，更能基于知识库积累的最佳实践，为团队定制专属审查标准和重点关注领域
  </div>
  <div style="margin-top: 6px;">
    通过知识库的持续积累和 LLM 的深度学习，CR-Mentor 能有效提升团队代码质量，显著降低约 50% 的审查时间和错误率
  </div>
</div>

<div align="center" style="margin-top: 12px;">
  <a href="https://cr-mentor.top/"><strong>在线体验</strong></a> ·
  <a href="https://github.com/Gijela/CR-Mentor/pull/35"><strong>Code Review 演示</strong></a> ·
  <a href="https://ovlxxbdwimhigoejxkqn.supabase.co/storage/v1/object/public/test-bucket-api/Dify_DSL/CR-Mentor.yml"><strong>工作流文件下载</strong></a>
</div>

<div align="center" style="margin-top: 6px;">
  <a href="README.md"><strong>[English]</strong></a> ·
  <a href="README-zh.md"><strong>[简体中文]</strong></a> ·
  <a href="#核心功能"><strong>核心功能</strong></a> ·
  <a href="#技术栈"><strong>技术栈</strong></a> ·
  <a href="#部署指南"><strong>部署指南</strong></a> ·
  <a href="#未来计划"><strong>未来计划</strong></a>
</div>
<br/>

## 核心功能

- 📋 【**知识库驱动的规范化审查**】: 基于知识库沉淀的最佳实践，支持自定义仓库级别的代码审查规范
- 🤖 【**智能单文件审查**】: 结合知识库经验与 LLM 分析，对单文件代码变更提供专业评分和改进建议
- 🚀 【**全局代码分析**】: 基于所有文件代码变更，通过 LLM 提供包含**代码演练**、**变更说明**和**时序图**的综合审查报告
- 🌍 【**全语言覆盖**】: 支持所有主流编程语言的智能 Code Review
- 🔄 【**GitHub 深度集成**】: 无缝对接 GitHub 工作流，实现自动化 Code Review
- 🌐 【**多语言响应**】: 支持自定义 Code Review 反馈的语言

## 技术栈

- 🔥 使用 Next.js [App Router](https://nextjs.org/docs/app) 构建现代化 Web 应用
- 🎨 使用 [Tailwind CSS](https://tailwindcss.com/) 实现优雅的响应式设计
- 🔐 使用 [Clerk](https://clerk.dev/) 提供安全可靠的用户认证
- 📦 使用 [Supabase](https://supabase.com/) 实现高性能数据存储
- 🔗 使用 [Github App](https://github.com/apps/cr-mentor) 实现 GitHub 深度集成
- 🧠 使用 [Dify](https://dify.ai/) 构建智能 LLM 工作流

## 部署指南
你可以通过设置以下服务并添加相应的环境变量来部署此模板：

1. 运行 `npm install` 安装依赖，然后运行 `npm run dev` 启动开发服务器。

2. 系统会要求你提供 `CLERK_SECRET_KEY`。具体步骤如下：
   - 注册一个 [Clerk](https://clerk.dev) 账号。
   - 从 [API keys](https://dashboard.clerk.com/last-active?path=api-keys) 复制 `CLERK_SECRET_KEY` 和 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 到 `.env.local` 文件中。

3. 现在你的前端和后端应该已经运行，你可以登录但还不能进行代码审查。

4. 创建一个 [Supabase](https://supabase.com) 账号来获取 [API key](https://supabase.com/dashboard/project/_/settings/api)。
   1. 创建一个 Supabase 项目，在 `Project Settings` 中复制:
      - `SUPABASE_URL`
      - `SUPABASE_KEY`
      
      执行以下 SQL 语句创建 `githubId_clerkId` 表:
      ```sql
      CREATE TABLE "public"."githubId_clerkId" (
        "github_id" text NOT NULL,
        "clerk_id" text NOT NULL,
        PRIMARY KEY ("github_id")
      );
      ```
      执行以下 SQL 语句创建 `repoName_file` 表:
      ```sql
      CREATE TABLE "public"."repoName_file" (
        "repo_fullName" text NOT NULL,
        "file_name" text NOT NULL,
        "folder_name" text NOT NULL,
        PRIMARY KEY ("repo_fullName", "file_name", "folder_name")
      );
      ```

   
   2. 在 `Storage` 的 `S3 Connection` 中复制:
      - `SUPABASE_S3_ENDPOINT`  
      - `SUPABASE_S3_REGION`
   
   3. 在 `Storage` 的 `S3 Access Keys` 中新建:
      - `SUPABASE_STORE_ID`
      - `SUPABASE_STORE_SECRET_KEY`
   
   4. 在 `Storage` 中使用 `New bucket` 新建 Bucket:
      - 将 Bucket 名称填入 `SUPABASE_BUCKET_NAME`

   ```
   SUPABASE_URL=
   SUPABASE_KEY=
   SUPABASE_S3_ENDPOINT=
   SUPABASE_S3_REGION=
   SUPABASE_STORE_ID=
   SUPABASE_STORE_SECRET_KEY=
   SUPABASE_BUCKET_NAME=
   ```

5. 创建一个 [Github](https://github.com) 账号，然后创建一个 [Github App](https://github.com/settings/applications/new)。
   - 在 `Settings` -> `Developer settings` -> `GitHub Apps` 中点击 `New GitHub App`。
   - 填写 `GitHub App name`、`Homepage URL`、`Webhook URL` 等信息。
   - 生成 `Private key` 并下载，复制 `App ID`、`Client ID`、`Client secret` 到 `.env.local` 文件中。
   ```
   GITHUB_APP_ID=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=

   # 只填写 -----BEGIN RSA PRIVATE KEY----- 和 -----END RSA PRIVATE KEY----- 之间的内容
   GITHUB_PRIVATE_KEY= 
   ```
   
6. 创建一个 [Dify](https://dify.ai/) 账号并配置 LLM 工作流:
   1. 注册 [Dify](https://dify.ai/) 账号并在模型供应商处配置 LLM 模型
   2. 在 [Dify 工作室](https://cloud.dify.ai/apps?category=workflow) 导入工作流:
      - 点击「创建应用」选择「导入 DSL」
      - 切换到 URL 模式，填入工作流文件的 URL: `https://ovlxxbdwimhigoejxkqn.supabase.co/storage/v1/object/public/test-bucket-api/Dify_DSL/CR-Mentor.yml`
      - 点击创建完成导入
   3. 发布工作流:
      - 在「编排」页面点击「发布」按钮
   4. 获取 API Key:
      - 在左侧导航栏点击「API Access」
      - 切换到「Workflow App API」页面
      - 点击右上角「API Key」新建 Secret key
      - 复制 Secret key 到 `.env.local` 文件:
      ```
      DIFY_APIKEY=
      DIFY_BASE_URL=https://api.dify.ai/v1  # 固定值
      ```


## 未来计划

- [ ] 构建专业的代码审查知识库，沉淀团队最佳实践
- [ ] 基于知识库优化代码审查建议的展示方式
- [ ] 开发智能代码审查模板系统，支持多场景定制
- [ ] 实现基于知识图谱的代码审查任务分配
- [ ] 打造协同审查平台，支持多人实时评论与讨论
- [ ] 集成智能代码质量分析，自动识别潜在问题
- [ ] 持续优化 LLM 模型，提升建议质量和响应速度
- [ ] 深度整合主流代码托管平台(如 GitHub、GitLab)
- [ ] 构建审查数据分析系统，生成深度洞察报告
- [ ] 完善知识库管理功能，实现经验智能复用
- [ ] 支持多语言知识库和文档体系
