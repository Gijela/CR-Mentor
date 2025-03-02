import Router from "@koa/router"
import { GitIngest } from "git-analyze"

const router = new Router({
  prefix: "/git", // 添加路由前缀，避免可能的路由冲突
})

const ingest = new GitIngest({
  // 默认最大文件大小
  defaultMaxFileSize: 1000000,
  // 默认文件模式
  defaultPatterns: {
    include: ["**/*"],
    exclude: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/build/**",
      "*.lock",
      "pnpm-lock.yaml",
    ],
  },
})

// 添加路由
router.post("/analyze", async (ctx) => {
  try {
    const { url, branch, targetPaths, maxFileSize } = ctx.request.body as {
      url: string
      branch: string
      targetPaths: string[]
      maxFileSize: number
    }
    const result = await ingest.analyzeFromUrl(url, {
      branch,
      targetPaths,
      maxFileSize,
    })

    ctx.body = { success: true, data: result }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      success: false,
      error,
    }
  }
})

// 更新搜索API路由
// app.post("/search", async (req, res) => {
//   try {
//     const { knowledgeGraph, ...rest } = req.body;
//     const searchResults = searchKnowledgeGraph(knowledgeGraph, rest);

//     res.json({ success: true, data: searchResults });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

router.post("/test", async (ctx) => {
  ctx.body = { success: true, data: "Hi~" }
})

// 修改默认导出为 module.exports
module.exports = router
