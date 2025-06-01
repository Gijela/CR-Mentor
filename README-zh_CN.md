<div align="center">
  <img alt="landing_page" src="https://pub-dddb5f1064884f6498b3ec0a1c031c0d.r2.dev/landing_cr_mentor.png" width="600">
</div>

<h1 align="center">CR-Mentor：成长是自己的事, 但 AI 能帮你</h1>

## 我们的初心

<div>
   <a href="README.md"><strong>English</strong></a> ·
   <a href="README-zh_CN.md"><strong>简体中文</strong></a>
</div>

在日常开发中，代码审查（Code Review）常常被视为流程的"必经之路"，但我们相信，它本应是团队成长、知识沉淀和个人进步的"黄金时刻"。  
CR-Mentor 诞生的初衷，就是希望用 AI 和知识库的力量，让每一次代码审查都能真正带来启发和提升。

## 我们在做什么？

CR-Mentor 不只是一个智能代码审查工具，更是一个开发者成长平台。我们通过以下创新能力，帮助你和你的团队持续进步：

### 1. 深度代码理解：Deepwiki 驱动

- 我们集成了 deepwiki 技术，能够自动追踪和分析代码变更涉及的所有相关文件，理解跨文件、跨模块的引用链路，真正做到"全局视角"下的代码分析。
- 不再局限于 git diff，而是让 LLM 具备"读懂整个项目"的能力。

### 2. 构建开发者画像：洞察你的成长轨迹

- 我们不仅分析单次 PR，还能自动分析 GitHub 用户历史上的所有 commits、PRs。
- 通过这些数据，CR-Mentor 能够为每一位开发者构建独特的"用户画像"：技术优势、常见问题、成长曲线一目了然。
- 这不仅帮助个人复盘成长，也为团队管理和人才培养提供了数据支持。

### 3. 知识库：让经验不再流失

- 审查过程中发现的亮点、坑点、最佳实践，都可以一键存入知识库。
- 我们提供了 MCP（知识管理能力），支持将个人或团队的知识点结构化存储、检索和复用。
- 你的每一次思考、每一个灵感，都能沉淀为团队的宝贵财富。

### 4. 自定义规范与风险识别

- 支持上传团队专属的代码规范和依赖说明，LLM 不再"胡说八道"。
- Agent 能自动识别潜在风险，主动给出专业建议，助你规避隐患。

## 你将获得

- 真正"懂你"的代码审查助手
- 个人成长画像与团队知识库
- 更高效、更专业、更温暖的开发体验

- 开发者画像
  ![developer](https://pub-d5e0d3c6480d4602a6c19db77e050e13.r2.dev/developer.png)

- 知识库沉淀
  ![knowledgeBase](https://pub-d5e0d3c6480d4602a6c19db77e050e13.r2.dev/knowledge_base.png)

- 可视化技能
  ![skill](https://pub-d5e0d3c6480d4602a6c19db77e050e13.r2.dev/graph.png)

## 快速上手

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Gijela/CR-Mentor)

1. 克隆仓库

   ```bash
   git clone https://github.com/Gijela/CR-Mentor.git
   cd CR-Mentor
   ```

2. 启动各模块（需分别打开终端窗口）：

   - 前端
     ```bash
     cd frontend
     pnpm install
     pnpm dev
     ```
   - 智能 Agent
     ```bash
     cd agent-server
     pnpm install
     pnpm dev
     ```
   - Koa 后端
     ```bash
     cd koa-server
     pnpm install
     pnpm dev
     ```

3. 访问前端页面，体验智能代码审查与知识沉淀！

## 我们的愿景

我们希望，CR-Mentor 不只是一个工具，更是每个开发者成长路上的伙伴。  
让代码审查成为团队知识流动的桥梁，让每个人都能在复盘与分享中不断进步。  
如果你也认同这样的理念，欢迎 Star、试用、提 Issue，甚至加入共建！

![Star History Chart](https://api.star-history.com/svg?repos=Gijela/CR-Mentor&type=Date)

## 许可证

本项目遵循 CR-Mentor Open Source License。允许作为后台服务直接商用，但不允许提供 SaaS 服务。  
如需商业授权或有其他合作需求，请联系 frontendgijela@gmail.com。  
完整协议请查看 [Apache License 2.0](./LICENSE)
