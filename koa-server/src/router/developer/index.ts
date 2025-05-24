import Router from "@koa/router"
import {
  getKpiSummary,
  getInsightTrends,
  listStrengths,
  listIssues,
  listKnowledgeSnippets
} from "../../controller/developer";
import * as ragController from "../../controller/rag";

const router = new Router({ prefix: "/developers" })

// 1. 顶部 KPI 卡片数据 API
router.post("/dashboard/kpi-summary", getKpiSummary)

// 2. 中间趋势图表数据 API
router.post("/dashboard/insight-trends", getInsightTrends)

// 3.1 "我的优势" 列表 API
router.post("/profile/strengths", listStrengths)

// 3.2 "问题与改进点" 列表 API
router.post("/profile/issues", listIssues)

// 3.3 "知识库" 列表 API
router.post("/knowledge-base/snippets", listKnowledgeSnippets)

// 4.1 知识库语义搜索 API
router.post("/knowledge-base/search", ragController.searchKnowledge)

// 4.2 知识库元数据 API
router.post("/knowledge-base/metadata", ragController.getMetadata)

// 4.3 知识片段关联 API
router.post("/knowledge-base/associate", ragController.associateKnowledge)

export default router
