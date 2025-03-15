import dotenv from "dotenv"

import {
  addDocuments,
  deleteDocument,
  listDocuments,
  searchDocuments,
  updateDocument,
  uploadFile,
} from "../../../controller/rag/documents"
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBase,
  listKnowledgeBases,
  updateKnowledgeBase,
} from "../../../controller/rag/knowledge-base"

dotenv.config()

export async function runTests() {
  const config = {
    connectionString: process.env.POSTGRES_CONNECTION_STRING!,
    openaiApiKey: process.env.OPENAI_API_KEY!,
    openaiBaseURL: "https://api.gptgod.online/v1",
  }

  try {
    // 1. 测试知识库创建
    console.log("测试1: 创建知识库")
    await createKnowledgeBase(config, "test_kb")

    // 2. 测试更新知识库信息
    console.log("\n测试2: 更新知识库信息")
    await updateKnowledgeBase(config, "test_kb", {
      description: "这是一个测试知识库",
      tags: ["测试", "示例"],
    })

    // 3. 测试获取知识库信息
    console.log("\n测试3: 获取知识库信息")
    const kbInfo = await getKnowledgeBase(config, "test_kb")
    console.log("知识库信息:", kbInfo)

    // 4. 测试文档上传
    console.log("\n测试4: 上传文档")
    await uploadFile(config, "test_kb", "/Users/gijela/Desktop/github-repo/mastra-main/examples/basics/rag/hybrid-vector-search/rag/test/test.md", {
      category: "test",
      author: "测试人员",
    })

    // 5. 测试添加文档
    console.log("\n测试5: 添加文档")
    await addDocuments(config, "test_kb", [{
      content: "这是一个测试文档",
      metadata: {
        category: "test",
        author: "测试人员",
        tags: ["测试", "示例"],
      },
    }])

    // 6. 测试文档列表
    console.log("\n测试6: 获取文档列表")
    const { documents, total } = await listDocuments(config, "test_kb", {
      page: 1,
      pageSize: 10,
      filter: { category: "test" },
    })
    console.log(`找到 ${total} 个文档:`, documents)

    // 7. 测试文档更新
    if (documents.length > 0) {
      console.log("\n测试7: 更新文档")
      await updateDocument(config, "test_kb", documents[0].id, {
        metadata: { status: "已审核" },
      })
    }

    // 8. 测试文档检索
    console.log("\n测试8: 检索文档")
    const results = await searchDocuments(config, "test_kb", "测试", {
      topK: 3,
      filter: { category: "test" },
    })
    console.log("检索结果:", results)

    // 9. 测试文档删除
    console.log("\n测试9: 删除文档")
    if (documents.length > 0) {
      const docId = documents[0].id
      console.log(`准备删除文档: ${docId}`)
      await deleteDocument(config, "test_kb", docId)

      // 验证删除是否成功
      const { documents: afterDelete } = await listDocuments(config, "test_kb", {
        page: 1,
        pageSize: 10,
        filter: { id: docId },
      })

      if (afterDelete.length === 0) {
        console.log("文档删除成功")
      } else {
        console.log("警告：文档可能未被完全删除")
      }
    }

    // 测试获取知识库列表
    console.log("\n测试: 获取知识库列表")
    const kbList = await listKnowledgeBases(config)
    console.log("知识库列表:", kbList)

    // 最后才删除知识库
    console.log("\n测试: 删除知识库")
    await deleteKnowledgeBase(config, "test_kb")

    console.log("\n所有测试完成!")
  } catch (error) {
    console.error("测试失败:", error)
  }
}

runTests().catch(console.error)
