<div>
  <img alt="CR-Mentor - Knowledge Base + LLM Powered Code Review Mentor" src="https://ovlxxbdwimhigoejxkqn.supabase.co/storage/v1/object/public/test-bucket-api/Dify_DSL/en-homePage.png">
  <h1 align="center">Knowledge Base + LLM Powered Code Review Mentor</h1>
</div>

<div align="center">
  <div>
    Combining professional knowledge base with LLM capabilities to provide intelligent code review guidance for development teams
  </div>
  <div style="margin-top: 6px;">
    As a Code Review mentor, it not only provides code review for all programming languages, but also customizes review standards and focus areas based on best practices accumulated in the knowledge base
  </div>
  <div style="margin-top: 6px;">
    Through continuous accumulation of knowledge base and deep learning of LLM, CR-Mentor can effectively improve team code quality, significantly reducing review time and error rates by about 50%
  </div>
</div>

<div align="center" style="margin-top: 12px;">
  <a href="https://cr-mentor.top/"><strong>Live Demo</strong></a> ·
  <a href="https://github.com/Gijela/CR-Mentor/pull/1"><strong>Code Review Demo</strong></a> ·
  <a href="https://ovlxxbdwimhigoejxkqn.supabase.co/storage/v1/object/public/test-bucket-api/Dify_DSL/CR-Mentor.yml"><strong>Workflow File Download</strong></a>
</div>

<div align="center" style="margin-top: 6px;">
  <a href="README.md"><strong>[English]</strong></a> ·
  <a href="README-zh.md"><strong>[简体中文]</strong></a> ·
  <a href="#core-features"><strong>Core Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#deployment-guide"><strong>Deployment Guide</strong></a> ·
  <a href="#roadmap"><strong>Roadmap</strong></a>
</div>
<br/>

## Core Features

- 📋 【**Knowledge Base Driven Review**】: Support customized repository-level code review standards based on best practices accumulated in knowledge base
- 🤖 【**Smart Single File Review**】: Provide professional scoring and improvement suggestions for single file code changes by combining knowledge base experience with LLM analysis
- 🚀 【**Global Code Analysis**】: Provide comprehensive review reports including **code walkthrough**, **change description** and **sequence diagrams** based on all file changes through LLM
- 🌍 【**All Language Support**】: Support intelligent Code Review for all mainstream programming languages
- 🔄 【**GitHub Deep Integration**】: Seamlessly integrate with GitHub workflow for automated Code Review
- 🌐 【**Multi-language Response**】: Support customized language for Code Review feedback

## Tech Stack

- 🔥 Build modern web applications using Next.js [App Router](https://nextjs.org/docs/app)
- 🎨 Implement elegant responsive design with [Tailwind CSS](https://tailwindcss.com/)
- 🔐 Provide secure and reliable user authentication with [Clerk](https://clerk.dev/)
- 📦 Implement high-performance data storage with [Supabase](https://supabase.com/)
- 🔗 Achieve GitHub deep integration using [Github App](https://github.com/apps/cr-mentor)
- 🧠 Build intelligent LLM workflows with [Dify](https://dify.ai/)

## Deployment Guide
You can deploy this template by setting up the following services and adding their corresponding environment variables:

1. Run `npm install` to install dependencies, then run `npm run dev` to start the development server.

2. The system will require you to provide `CLERK_SECRET_KEY`. Follow these steps:
   - Register a [Clerk](https://clerk.dev) account.
   - Copy `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from [API keys](https://dashboard.clerk.com/last-active?path=api-keys) to your `.env.local` file.

3. Now your frontend and backend should be running, you can log in but won't be able to perform code reviews yet.

4. Create a [Supabase](https://supabase.com) account to get your [API key](https://supabase.com/dashboard/project/_/settings/api).
   1. Create a Supabase project, copy from `Project Settings`:
      - `SUPABASE_URL`
      - `SUPABASE_KEY`
      
      Execute the following SQL statement to create `githubId_clerkId` table:
      ```sql
      CREATE TABLE "public"."githubId_clerkId" (
        "github_id" text NOT NULL,
        "clerk_id" text NOT NULL,
        PRIMARY KEY ("github_id")
      );
      ```
      Execute the following SQL statement to create `repoName_file` table:
      ```sql
      CREATE TABLE "public"."repoName_file" (
        "repo_fullName" text NOT NULL,
        "file_name" text NOT NULL,
        "folder_name" text NOT NULL,
        PRIMARY KEY ("repo_fullName", "file_name", "folder_name")
      );
      ```
   
   2. Copy from `Storage` > `S3 Connection`:
      - `SUPABASE_S3_ENDPOINT`  
      - `SUPABASE_S3_REGION`
   
   3. Create new in `Storage` > `S3 Access Keys`:
      - `SUPABASE_STORE_ID`
      - `SUPABASE_STORE_SECRET_KEY`
   
   4. Create new bucket in `Storage` using `New bucket`:
      - Fill bucket name in `SUPABASE_BUCKET_NAME`

   ```
   SUPABASE_URL=
   SUPABASE_KEY=
   SUPABASE_S3_ENDPOINT=
   SUPABASE_S3_REGION=
   SUPABASE_STORE_ID=
   SUPABASE_STORE_SECRET_KEY=
   SUPABASE_BUCKET_NAME=
   ```

5. Create a [Github](https://github.com) account, then create a [Github App](https://github.com/settings/applications/new).
   - Click `New GitHub App` in `Settings` -> `Developer settings` -> `GitHub Apps`.
   - Fill in `GitHub App name`, `Homepage URL`, `Webhook URL` and other information.
   - Generate `Private key` and download it, copy `App ID`, `Client ID`, `Client secret` to your `.env.local` file.
   ```
   GITHUB_APP_ID=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=

   # Only fill in the content between -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY-----
   GITHUB_PRIVATE_KEY= 
   ```
   
6. Create a [Dify](https://dify.ai/) account and configure LLM workflow:
   1. Register a [Dify](https://dify.ai/) account and configure LLM model in model providers
   2. Import workflow in [Dify Studio](https://cloud.dify.ai/apps?category=workflow):
      - Click "Create Application" and select "Import DSL"
      - Switch to URL mode, enter workflow file URL: `https://ovlxxbdwimhigoejxkqn.supabase.co/storage/v1/object/public/test-bucket-api/Dify_DSL/CR-Mentor.yml`
      - Click create to complete import
   3. Publish workflow:
      - Click "Publish" button on "Orchestration" page
   4. Get API Key:
      - Click "API Access" in left navigation
      - Switch to "Workflow App API" page
      - Click "API Key" in top right to create new Secret key
      - Copy Secret key to `.env.local` file:
      ```
      DIFY_APIKEY=
      DIFY_BASE_URL=https://api.dify.ai/v1  # Fixed value
      ```


## Roadmap

- [ ] Build professional code review knowledge base to accumulate team best practices
- [ ] Optimize code review suggestion display based on knowledge base
- [ ] Develop intelligent code review template system supporting multiple scenarios
- [ ] Implement knowledge graph based code review task assignment
- [ ] Build collaborative review platform supporting real-time comments and discussions
- [ ] Integrate intelligent code quality analysis for automatic issue detection
- [ ] Continuously optimize LLM model to improve suggestion quality and response speed
- [ ] Deep integration with mainstream code hosting platforms (like GitHub, GitLab)
- [ ] Build review data analysis system generating in-depth insight reports
- [ ] Improve knowledge base management for intelligent experience reuse
- [ ] Support multi-language knowledge base and documentation system
