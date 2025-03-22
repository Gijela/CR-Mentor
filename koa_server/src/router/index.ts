import fs from "node:fs"
import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import type Koa from "koa"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 自动加载路由函数
const useRouters = async function (app: Koa) {
  const routerPromises: Promise<void>[] = []

  // 读取当前目录下的所有文件和文件夹
  fs.readdirSync(__dirname).forEach((dir: string) => {
    if (dir === "index.ts" || dir === "index.js") return

    const fullPath = path.join(__dirname, dir)
    if (!fs.statSync(fullPath).isDirectory()) return

    // 检查文件夹中是否存在 index.ts
    const routerPath = path.join(fullPath, process.env.NODE_ENV === "development" ? "index.ts" : "index.js")
    if (fs.existsSync(routerPath)) {
      const routerPromise = import(routerPath).then((router) => {
        app.use(router.default.routes())
        app.use(router.default.allowedMethods())
      }).catch((err) => {
        console.error(`Error loading router from ${routerPath}:`, err)
        throw new Error(`Failed to load router from ${routerPath}`)
      })
      routerPromises.push(routerPromise)
    }
  })

  // 等待所有路由加载完成
  await Promise.all(routerPromises)
}

export default useRouters
