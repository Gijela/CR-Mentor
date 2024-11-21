# 问题总结

## 1. 工具输入类型
问题：langchain 输出如下：在 \[tool/start\] 阶段输入为 undefined， 但是在 \[agent/action\] 阶段输出是有值的，且为对象
相关Issue ：https://github.com/langchain-ai/langchainjs/issues/1115

```bash
[chain/end] [1:chain:AgentExecutor > 2:chain:LLMChain] [28.38s] Exiting Chain run with output: {
  "text": "Question: 请为这个 PR 创建一个总结评论。\nThought: 我需要先分析代码变更，然后总结出主要的变更内容和概述。\n\nAction:\n```json\n{\n  \"action\": \"create_pr_summary\",\n  \"action_input\": {\n    \"user_name\": \"用户名\",\n    \"repo_name\": \"仓库名\",\n    \"pull_number\": \"PR编号\",\n    \"summary\": {\n      \"walkthrough\": \"这个 PR 主要对代码进行了调整，优化了获取 GitHub 安装信息和仓库信息的流程。主要变更包括移除了不再使用的函数，并优化了获取安装信息和仓库信息的逻辑。\",\n      \"changes\": [\n        \"移除了 `getInstallationToken` 和 `getRepositories` 函数。\",\n        \"优化了 `main` 函数，直接获取指定 GitHub ID 的安装信息和仓库信息。\",\n        \"新增了 `githubId` 变量，并在 `main` 函数中使用。\",\n        \"使用 `fetch` API 替代了 `axios` 进行 HTTP 请求。\"\n      ]\n    }\n  }\n}\n```"
}
[agent/action] [1:chain:AgentExecutor] Agent selected action: {
  "tool": "create_pr_summary",
  "toolInput": {
    "user_name": "用户名",
    "repo_name": "仓库名",
    "pull_number": "PR编号",
    "summary": {
      "walkthrough": "这个 PR 主要对代码进行了调整，优化了获取 GitHub 安装信息和仓库信息的流程。主要变更包括移除了不再使用的函数，并优化了获取安装信息和仓库信息的逻辑。",
      "changes": [
        "移除了 `getInstallationToken` 和 `getRepositories` 函数。",
        "优化了 `main` 函数，直接获取指定 GitHub ID 的安装信息和仓库信息。",
        "新增了 `githubId` 变量，并在 `main` 函数中使用。",
        "使用 `fetch` API 替代了 `axios` 进行 HTTP 请求。"
      ]
    }
  },
  "log": "Question: 请为这个 PR 创建一个总结评论。\nThought: 我需要先分析代码变更，然后总结出主要的变更内容和概述。\n\nAction:\n```json\n{\n  \"action\": \"create_pr_summary\",\n  \"action_input\": {\n    \"user_name\": \"用户名\",\n    \"repo_name\": \"仓库名\",\n    \"pull_number\": \"PR编号\",\n    \"summary\": {\n      \"walkthrough\": \"这个 PR 主要对代码进行了调整，优化了获取 GitHub 安装信息和仓库信息的流程。主要变更包括移除了不再使用的函数，并优化了获取安装信息和仓库信息的逻辑。\",\n      \"changes\": [\n        \"移除了 `getInstallationToken` 和 `getRepositories` 函数。\",\n        \"优化了 `main` 函数，直接获取指定 GitHub ID 的安装信息和仓库信息。\",\n        \"新增了 `githubId` 变量，并在 `main` 函数中使用。\",\n        \"使用 `fetch` API 替代了 `axios` 进行 HTTP 请求。\"\n      ]\n    }\n  }\n}\n```"
}
[tool/start] [1:chain:AgentExecutor > 4:tool:CreatePRSummaryTool] Entering Tool run with input: "undefined"
工具输入类型: undefined
工具输入内容: undefined
[tool/end] [1:chain:AgentExecutor > 4:tool:CreatePRSummaryTool] [0ms] Exiting Tool run with output: "创建 PR 总结失败: 输入不能为空"
```