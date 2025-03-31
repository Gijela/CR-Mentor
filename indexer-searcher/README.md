# Project B - Code Indexing and Search

这是一个基于 symf 的代码索引和检索工具，完全复制了 Cody 的索引和检索功能。

## 功能特点

- 代码索引创建和管理
- 支持语义搜索和关键词搜索
- 实时搜索支持
- 智能的索引更新策略
- 并发安全的实现
- 完整的错误处理

## 安装

```bash
npm install project-b
```

## 使用方法

```typescript
import { CodeSearch } from "project-b";

// 创建实例
const codeSearch = new CodeSearch({
  index: {
    root: "./.index",
    maxCPUs: 2,
    timeout: 600000,
  },
  search: {
    defaultLimit: 10,
    timeout: 30000,
  },
  symf: {
    path: "symf", // symf 工具路径
  },
});

// 创建索引
await codeSearch.createIndex("./src");

// 搜索代码
const results = await codeSearch.search("function example", ["./src"]);

// 实时搜索
const liveResults = await codeSearch.liveSearch("function example", "example", [
  "./src/example.ts",
]);
```

## 配置选项

```typescript
interface Config {
  index: {
    root: string; // 索引根目录
    maxCPUs: number; // 最大 CPU 使用数
    timeout: number; // 超时时间（毫秒）
  };
  search: {
    defaultLimit: number; // 默认结果数量限制
    timeout: number; // 搜索超时时间（毫秒）
  };
  symf: {
    path: string; // symf 工具路径
  };
}
```

## 依赖要求

- Node.js >= 14
- symf 工具（需要单独安装）

## 许可证

MIT
