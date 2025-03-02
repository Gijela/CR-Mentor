import fs from "node:fs"
import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import cors from "@koa/cors"
import Koa from "koa"
import bodyParser from "koa-bodyparser"

import { logger } from "./utils/logger"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 创建主应用
const app = new Koa()

// 使用中间件
app.use(cors())
app.use(bodyParser())

// 自定义错误类
class ServerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ServerError"
  }
}

// 自动加载路由函数
const useRouters = async function (app: Koa) {
  const routerPromises: Promise<void>[] = []

  // 读取当前目录下的所有文件和文件夹
  fs.readdirSync(__dirname).forEach((dir: string) => {
    if (dir === "index.ts") return

    const fullPath = path.join(__dirname, dir)
    if (!fs.statSync(fullPath).isDirectory()) return

    // 检查文件夹中是否存在 index.ts
    const routerPath = path.join(fullPath, "index.ts")
    if (fs.existsSync(routerPath)) {
      const routerPromise = import(routerPath).then((router) => {
        app.use(router.default.routes())
        app.use(router.default.allowedMethods())
      }).catch((err) => {
        logger.error(`Error loading router from ${routerPath}:`, err)
        throw new ServerError(`Failed to load router from ${routerPath}`)
      })
      routerPromises.push(routerPromise)
    }
  })

  // 等待所有路由加载完成
  await Promise.all(routerPromises)
}

// 加载所有路由并启动服务器
const startServer = async () => {
  try {
    await useRouters(app)

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    throw error // 让错误继续向上传播，而不是直接退出进程
  }
}

// 启动服务器并处理错误
startServer().catch((err) => {
  logger.error("Fatal error occurred:", err)
  // 在生产环境中，我们可能想要通知监控系统或进行其他处理
  throw err // 让错误处理由进程管理器（如 PM2）或容器运行时处理
})

export default app
