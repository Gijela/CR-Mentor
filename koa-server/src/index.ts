import cors from "@koa/cors"
import dotenv from "dotenv"
import Koa from "koa"
import bodyParser from "koa-bodyparser"

import useRouters from "./router/index"
import logger from "./utils/logger/index"

// 创建主应用
const app = new Koa()

// 加载环境变量
dotenv.config()

// 使用中间件
app.use(cors())
app.use(bodyParser())

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
  }
}

// 启动服务器
startServer()
