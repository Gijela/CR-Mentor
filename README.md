<div align="center">
  <img alt="landing_page" src="https://pub-dddb5f1064884f6498b3ec0a1c031c0d.r2.dev/landing_cr_mentor.png" width="600">
</div>

<h1 align="center">CR-Mentor: Growth is Personal, but AI Can Help</h1>

## Our Mission

<div>
   <a href="README.md"><strong>English</strong></a> ·
   <a href="README-zh_CN.md"><strong>Chinese</strong></a>
</div>

In daily development, code review is often seen as a "necessary process," but we believe it should be a "golden moment" for team growth, knowledge accumulation, and personal improvement.
CR-Mentor was born from the idea of leveraging AI and knowledge bases to make every code review truly inspiring and valuable.

## What Are We Doing?

CR-Mentor is not just an intelligent code review tool, but a developer growth platform. Through the following innovative features, we help you and your team continuously improve:

### 1. Deep Code Understanding: Powered by Deepwiki

- We integrate deepwiki technology, which can automatically track and analyze all files related to code changes, understanding cross-file and cross-module reference chains, truly achieving "global perspective" code analysis.
- No longer limited to git diff, LLMs can now "understand the entire project."

### 2. Building Developer Profiles: Insights into Your Growth Trajectory

- We not only analyze individual PRs but can also automatically analyze all commits and PRs in a GitHub user's history.
- With this data, CR-Mentor builds a unique "user profile" for each developer: technical strengths, common issues, and growth curves at a glance.
- This helps individuals review their growth and provides data support for team management and talent development.

### 3. Knowledge Base: Preventing Experience Loss

- Highlights, pitfalls, and best practices discovered during reviews can be saved to the knowledge base with one click.
- We provide MCP (knowledge management capability), supporting structured storage, retrieval, and reuse of personal or team knowledge points.
- Every thought and inspiration you have can become a valuable asset for your team.

### 4. Custom Rules and Risk Identification

- Supports uploading team-specific code standards and dependency documentation, so LLMs no longer "make things up."
- Agents can automatically identify potential risks and proactively provide professional advice to help you avoid pitfalls.

## What You Will Get

- A code review assistant that truly "understands you"
- Personal growth profiles and team knowledge base
- A more efficient, professional, and supportive development experience

- Developer Profile
  ![developer](https://pub-d5e0d3c6480d4602a6c19db77e050e13.r2.dev/developer.png)

- Knowledge Base Accumulation
  ![knowledgeBase](https://pub-d5e0d3c6480d4602a6c19db77e050e13.r2.dev/knowledge_base.png)

- Visualized Skills
  ![skill](https://pub-d5e0d3c6480d4602a6c19db77e050e13.r2.dev/graph.png)

## Quick Start

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Gijela/CR-Mentor)

1. Clone the repository

   ```bash
   git clone https://github.com/Gijela/CR-Mentor.git
   cd CR-Mentor
   ```

2. Start each module (open a separate terminal window for each):

   - Frontend
     ```bash
     cd frontend
     pnpm install
     pnpm dev
     ```
   - Intelligent Agent
     ```bash
     cd agent-server
     pnpm install
     pnpm dev
     ```
   - Koa Backend
     ```bash
     cd koa-server
     pnpm install
     pnpm dev
     ```

3. Visit the frontend page to experience intelligent code review and knowledge accumulation!

## Our Vision

We hope CR-Mentor is not just a tool, but a companion on every developer's growth journey.
Let code review become a bridge for team knowledge flow, and let everyone continuously improve through reflection and sharing.
If you share this vision, feel free to Star, try, open issues, or even join us in building together!

![Star History Chart](https://api.star-history.com/svg?repos=Gijela/CR-Mentor&type=Date)

## Support
[![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")

## License

This project follows the CR-Mentor Open Source License. Commercial use as a backend service is allowed, but SaaS services are not permitted.
For commercial licensing or other cooperation, please contact frontendgijela@gmail.com.
See the full agreement at [Apache License 2.0](./LICENSE)
