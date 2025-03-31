# Code Review Agent

一个基于 mastra 和 indexer-searcher 的智能代码审查代理。

## 特点

- 自主决策能力：根据上下文自主决定审查策略和行动
- 智能代码搜索：利用 indexer-searcher 进行语义化代码搜索和分析
- 深度代码分析：识别问题和改进机会
- 持续学习能力：从审查经验中优化策略
- 个性化反馈：根据开发者特点提供建议

## 依赖

- Node.js 16+
- mastra
- indexer-searcher
- symf (可选，但推荐)

## 安装

1. 确保 indexer-searcher 和 agent-server 在同一个父目录下：

```
/parent-dir
  /indexer-searcher
  /agent-server
```

2. 运行安装脚本：

```bash
cd agent-server
chmod +x setup-indexer.sh
./setup-indexer.sh
```

3. 设置环境变量：

```bash
export OPENAI_API_KEY=your_openai_api_key
export OPENAI_MODEL=gpt-4o-mini  # 或其他支持的模型
```

## 使用方法

### 启动服务

```bash
npm run dev
```

### 使用 API

```javascript
import { mastra } from "./src/mastra/index.js";

async function main() {
  // 创建对话
  const conversation = await mastra.createConversation({
    agentId: "codeReviewAgent",
    metadata: {
      title: "代码审查",
    },
  });

  // 发送代码审查请求
  const response = await conversation.sendMessage({
    content: `请帮我审查以下代码：\n\`\`\`javascript\n${yourCode}\n\`\`\``,
  });

  console.log(response.content);
}
```

### 示例

运行示例脚本：

```bash
node examples/test-code-review.js
```

## 配置

在 `agent-server/src/mastra/tools/codeSearch/index.ts` 中，你可以配置 indexer-searcher 的参数，如：

- 索引路径
- CPU 使用数量
- 超时时间
- 搜索结果数量限制

## 工具

CodeReviewAgent 包含以下工具：

- **codeSearchTool**: 代码搜索工具，与 indexer-searcher 集成
- **analysisTool**: 代码分析工具，提供代码理解、问题识别和建议生成
- **learningTool**: 学习工具，从审查经验中学习和优化策略
- **feedbackTool**: 反馈工具，生成个性化反馈和最佳实践
- **decisionTool**: 决策工具，自主决定审查策略和行动

## 贡献

欢迎提交 PR 和 Issue。
