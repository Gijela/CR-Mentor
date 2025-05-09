<div style="width: 100%; height: 420px; display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
  <img alt="landing_page" src="https://pub-dddb5f1064884f6498b3ec0a1c031c0d.r2.dev/landing_cr_mentor.png">
</div>

<h1 align="center">Knowledge Base + LLM Based Code Review Mentor</h1>

<div align="center">
  <a href="README.md"><strong>[English]</strong></a> ·
  <a href="README-zh_CN.md"><strong>[Chinese]</strong></a>
</div>

<div align="center" style="margin-top: 10px;">
  <strong>A project leveraging Knowledge Base + LLM to improve development efficiency in Code Review</strong>
</div>

## Online Demo

- Homepage: [CR-Mentor](https://cr-mentor.top/)
- Docs: [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Gijela/CR-Mentor)
- Code Review Demo: [Code Review Demo](https://github.com/Gijela/Auth-Github-App/pull/46)

## Highlights

1. **Comprehensive Code Context Understanding**  
   Breaking through the limitations of traditional git diff CR, using [github100](https://github.com/gijela/github100) to automatically track all related files involved in code changes, including cross-file/module reference paths, achieving comprehensive understanding of code context and business logic

2. **Customizable Code Standards**  
   Based on best practices accumulated in the knowledge base, supports repository-level custom code review standards. Through uploading code standard files and closed-source dependency documentation, effectively solves LLM's hallucination issues when dealing with closed-source dependencies/code

3. **Global Code Analysis**  
   Using LLM based on complete chain code context and changes to generate comprehensive review reports including **Code Walkthrough**, **Change Description** and **Sequence Diagrams**

4. **Risk Code Identification**  
   Customized Agent Tools to identify potentially risky changes, provide improvement suggestions and separate comment feedback

## Feature Preview

1. Automatic Knowledge Base Integration
   ![knowledgeBase](https://pub-dddb5f1064884f6498b3ec0a1c031c0d.r2.dev/knowledgeBase.png)

2. Code Review
   ![summary](./apps/admin/public/cr/summary.png)
   ![comment](./apps/admin/public/cr/comment.png)

## Local Development

```bash
cd apps/admin

pnpm install
pnpm admin:dev
```

## 未来计划

- [ ] Establish human intervention mechanisms, collect feedback, and optimize code review processes
- [ ] Focus on developer growth, analyze strengths and weaknesses, create growth plans
- [ ] Support for Gitlab and other platforms
- [ ] Support for more LLMs

## Star History

![Star History Chart](https://api.star-history.com/svg?repos=Gijela/CR-Mentor&type=Date)

## License

This repository follows the CR-Mentor Open Source License.

Commercial use as a backend service is allowed, but providing SaaS services is not permitted.  
Without commercial authorization, copyright information must be retained for any form of commercial service.  
For complete details, please see [Apache License 2.0](./LICENSE)  
Contact: frontendgijela@gmail.com
