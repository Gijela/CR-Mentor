import Router from "@koa/router"

import {
  addDocuments,
  deleteDocument,
  listDocuments,
  searchDocuments,
  updateDocument,
} from "@/controller/rag/documents"
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBase,
  listKnowledgeBases,
  updateKnowledgeBase,
} from "@/controller/rag/knowledge-base"

const router = new Router({ prefix: "/rag" })

// 设置配置
router.use(async (ctx, next) => {
  ctx.state.config = {
    connectionString: process.env.POSTGRES_CONNECTION_STRING!,
    openaiApiKey: process.env.OPENAI_API_KEY!,
    openaiBaseURL: process.env.OPENAI_BASE_URL!,
  }
  await next()
})

// ----------------- 知识库管理 -----------------
// 创建知识库
router.post("/createKnowledgeBase", createKnowledgeBase)

// 删除知识库
router.post("/deleteKnowledgeBase", deleteKnowledgeBase)

// 获取知识库列表
router.post("/listKnowledgeBases", listKnowledgeBases)

// 更新知识库
router.post("/updateKnowledgeBase", updateKnowledgeBase)

// 获取单个知识库详情
router.post("/getKnowledgeBase", getKnowledgeBase)

// ----------------- 文档管理 -----------------
// 添加文档
router.post("/addDocuments", addDocuments)

// 获取文档列表
router.post("/listDocuments", listDocuments)

// 删除文档
router.post("/deleteDocument", deleteDocument)

// 更新文档
router.post("/updateDocument", updateDocument)

// 检索文档
router.post("/searchDocuments", searchDocuments)

// // 上传文件
// router.post("/uploadFile", uploadFile)

export default router
