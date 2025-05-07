# 个人开发者助手仪表盘 - 后端 API 实现思路与计划

本文档旨在规划为个人开发者助手仪表盘 (V4.2 ASCII 设计稿) 提供数据支持的后端 API。
数据主要来源于 `public.developer_profile_data` 和 `public.knowledge_snippets` 表。

**总体原则:**

- API 使用 POST 请求方法。
- 所有 API 都需要通过请求体 (JSON 格式) 接收 `developer_id`，以确保数据隔离。
- API 返回的数据结构应尽可能直接对应前端展示需求，减少前端处理负担。
- 对于需要聚合计算的数据 (如 KPI 中的统计、图表数据点)，应在后端完成。
- 分页和排序参数也通过请求体传递。

---

## 1. 顶部 KPI 卡片数据 API

**目标**: 提供仪表盘顶部四个 KPI 卡片所需的核心统计数据。

**API 端点**: `POST /developers/dashboard/kpi-summary`

**请求体 (JSON)**:

```json
{
  "developer_id": "dev_gijela_test_001"
}
```

**返回数据结构 (示例)**:

```json
{
  "developerId": "dev_gijela_test_001",
  "kpiSummary": {
    "strengthsOverview": {
      "totalCount": 5, // SELECT COUNT(*) FROM developer_profile_data WHERE insight_type = 'strength' AND developer_id = ?
      "topCategory": {
        // SELECT category_or_area, COUNT(*) ... GROUP BY ... ORDER BY ... LIMIT 1
        "name": "TypeScript",
        "count": 3
      }
    },
    "issuesOverview": {
      "activeCount": 2, // SELECT COUNT(*) FROM developer_profile_data WHERE insight_type = 'issue' AND status = 'active' AND developer_id = ?
      "topCategory": {
        // SELECT category_or_area, COUNT(*) ... WHERE insight_type = 'issue' ... GROUP BY ... ORDER BY ... LIMIT 1
        "name": "错误处理",
        "count": 2
      }
    },
    "knowledgeBaseStats": {
      "totalSnippets": 8, // SELECT COUNT(*) FROM knowledge_snippets WHERE developer_id = ?
      "topTopic": {
        // SELECT topic, COUNT(*) ... GROUP BY ... ORDER BY ... LIMIT 1
        "name": "性能优化",
        "count": 3
      }
    },
    "recentActivity": {
      "latestInsight": {
        // SELECT description, category_or_area, last_seen_at ... ORDER BY last_seen_at DESC LIMIT 1
        "description": "异步函数中await缺少try/catch",
        "category": "错误处理",
        "timestamp": "2024-07-29T10:00:00Z"
      },
      "latestKnowledge": {
        // SELECT content_summary, created_at ... ORDER BY created_at DESC LIMIT 1
        "summary": "HNSW索引加速pgvector搜索",
        "timestamp": "2024-07-20T14:30:00Z"
      }
    }
  }
}
```

**实现思路**:

- 从请求体中获取 `developer_id`。
- 在一个请求内，执行多次数据库查询（或通过 JOIN 和子查询优化），分别获取四个卡片所需的数据。
- `topCategory` 和 `topTopic` 的获取需要 GROUP BY 和 COUNT 操作。
- `recentActivity` 需要 ORDER BY 时间戳并 LIMIT 1。

---

## 2. 中间趋势图表数据 API

**目标**: 提供洞察趋势图（优势识别数、问题识别数随时间变化）的数据点。

**API 端点**: `POST /developers/dashboard/insight-trends`

**请求体 (JSON)**:

```json
{
  "developer_id": "dev_gijela_test_001",
  "period": "30d", // 可选, 默认为 "30d" (可选值: "7d", "30d", "90d")
  "granularity": "daily" // 可选, 默认为 "daily" (可选值: "daily", "weekly", "monthly")
}
```

**返回数据结构 (示例 for `period=30d`, `granularity=daily`)**:

```json
{
  "developerId": "dev_gijela_test_001",
  "trends": {
    "period": "30d",
    "granularity": "daily",
    "labels": ["2024-07-01", "2024-07-02", ..., "2024-07-30"], // 日期标签
    "datasets": [
      {
        "label": "Identified Strengths",
        "data": [0, 1, 0, ..., 2] // 每日新增或识别的优势数量
      },
      {
        "label": "Identified Issues",
        "data": [1, 0, 1, ..., 1] // 每日新增或识别的问题数量
      }
    ]
  }
}
```

**实现思路**:

- 从请求体中获取 `developer_id`、`period` 和 `granularity`。
- 根据 `period` 和 `granularity` 确定查询的时间范围和分组方式。
- **[重要] 粒度映射**: 将传入的 `granularity` 参数 (如 `"daily"`, `"weekly"`, `"monthly"`) 映射到 PostgreSQL `DATE_TRUNC` 函数可接受的单位 (如 `'day'`, `'week'`, `'month'`)。如果传入不支持的粒度，应有默认处理（例如，默认为 `'day'`）。
- 使用 `developer_profile_data` 表，基于 `first_seen_at` (或 `last_seen_at`) 进行时间序列聚合。
- 示例 SQL: `SELECT DATE_TRUNC($3, first_seen_at) AS time_bucket, insight_type, COUNT(*) FROM developer_profile_data WHERE developer_id = $1 AND first_seen_at >= NOW() - $2::interval GROUP BY time_bucket, insight_type ORDER BY time_bucket;` (其中 `$3` 是映射后的粒度参数，如 `'day'`)。
- 后端将查询结果处理成前端图表库所需的格式，包含日期标签和对应的数据集。

---

## 3. 底部 Tab 列表数据 API

由于每个 Tab 展示的数据结构和来源不同，可以为每个 Tab 设计独立的 API，或者一个带参数的通用 API。这里倾向于为每个 Tab 设计独立 API 以保持清晰。

### 3.1 "我的优势" 列表 API

**API 端点**: `POST /developers/profile/strengths`

**请求体 (JSON)**:

```json
{
  "developer_id": "dev_gijela_test_001",
  "page": 1, // 可选, 默认为 1
  "limit": 10, // 可选, 默认为 10
  "sortBy": "last_seen_at", // 可选, 默认为 "last_seen_at"
  "sortOrder": "desc" // 可选, 默认为 "desc" (可选值: "asc", "desc")
}
```

**返回数据结构 (示例)**:

```json
{
  "developerId": "dev_gijela_test_001",
  "strengths": [
    {
      "id": 1,
      "categoryOrArea": "TypeScript 类型系统",
      "description": "熟练运用泛型与条件类型",
      "confidence": 0.85,
      "frequency": 1,
      "relatedPrs": ["PR-TEST-103"],
      "lastSeenAt": "2024-07-28T10:00:00Z",
      "firstSeenAt": "2024-07-28T09:00:00Z"
    }
    // ... more strength items
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "limit": 10
  }
}
```

**实现思路**:

- 从请求体获取参数。
- `SELECT id, category_or_area, description, confidence, frequency, related_prs, last_seen_at, first_seen_at FROM developer_profile_data WHERE developer_id = ? AND insight_type = 'strength' ORDER BY {sortBy} {sortOrder} LIMIT {limit} OFFSET {(page-1)*limit};`
- 同时执行一个 `COUNT(*)` 查询以获取总数用于分页。

### 3.2 "问题与改进点" 列表 API

**API 端点**: `POST /developers/profile/issues`

**请求体 (JSON)**:

```json
{
  "developer_id": "dev_gijela_test_001",
  "page": 1, // 可选, 默认为 1
  "limit": 10, // 可选, 默认为 10
  "sortBy": "last_seen_at", // 可选, 默认为 "last_seen_at"
  "sortOrder": "desc", // 可选, 默认为 "desc"
  "status": "active" // 可选, 用于按状态筛选
}
```

**返回数据结构 (示例)**:

```json
{
  "developerId": "dev_gijela_test_001",
  "issues": [
    {
      "id": 2,
      "categoryOrArea": "错误处理",
      "description": "异步函数中await缺少try/catch",
      "status": "active",
      "frequency": 2,
      "relatedPrs": ["PR-TEST-101", "PR-TEST-102"],
      "lastSeenAt": "2024-07-29T11:00:00Z",
      "firstSeenAt": "2024-07-27T15:00:00Z"
    }
    // ... more issue items
  ],
  "pagination": {
    /* ... */
  }
}
```

**实现思路**:

- 从请求体获取参数。
- `SELECT id, category_or_area, description, status, frequency, related_prs, last_seen_at, first_seen_at FROM developer_profile_data WHERE developer_id = ? AND insight_type = 'issue' [AND status = ?] ORDER BY {sortBy} {sortOrder} LIMIT {limit} OFFSET {(page-1)*limit};`

### 3.3 "知识库" 列表 API

**API 端点**: `POST /developers/knowledge-base/snippets`

**请求体 (JSON)**:

```json
{
  "developer_id": "dev_gijela_test_001",
  "page": 1, // 可选, 默认为 1
  "limit": 10, // 可选, 默认为 10
  "sortBy": "created_at", // 可选, 默认为 "created_at"
  "sortOrder": "desc", // 可选, 默认为 "desc"
  "topic": "数据库性能", // 可选, 用于按主题筛选
  "q": "HNSW" // 可选, 用于关键词搜索
}
```
