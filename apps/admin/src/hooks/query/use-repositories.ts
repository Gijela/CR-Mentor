import { useState, useEffect } from 'react'

interface Repository {
  id: number
  name: string
  visibility: "Public" | "Private"
  language: string
  stars: number
  forks: number
  updatedAt: string
  description?: string
  license?: string
}

interface UseRepositoriesOptions {
  page?: number
  search?: string
  sort?: 'updated' | 'stars' | 'forks'
}

const mockRepositories: Repository[] = [
  {
    id: 1,
    name: "Auth-Github-App",
    visibility: "Public",
    language: "JavaScript",
    stars: 120,
    forks: 35,
    updatedAt: "2024-03-15",
    description: "GitHub OAuth 应用程序的认证服务",
    license: "MIT License"
  },
  {
    id: 2,
    name: "bit-animation",
    visibility: "Public",
    language: "Vue",
    stars: 89,
    forks: 12,
    updatedAt: "2024-03-10",
    description: "基于 vue2 实现的 h5 移动端领取豆子动画，类似于支付宝会员中心领取积分动画。"
  },
  {
    id: 3,
    name: "react-starter",
    visibility: "Public",
    language: "TypeScript",
    stars: 245,
    forks: 67,
    updatedAt: "2024-03-08",
    description: "一个现代化的 React 启动模板",
    license: "MIT License"
  },
  {
    id: 4,
    name: "vue3-components",
    visibility: "Public",
    language: "Vue",
    stars: 156,
    forks: 45,
    updatedAt: "2024-03-07",
    description: "基于 Vue3 + TypeScript 的组件库",
    license: "MIT License"
  },
  {
    id: 5,
    name: "node-cli-tool",
    visibility: "Public",
    language: "JavaScript",
    stars: 78,
    forks: 23,
    updatedAt: "2024-03-06",
    description: "命令行工具集合",
    license: "MIT License"
  },
  {
    id: 6,
    name: "react-hooks",
    visibility: "Public",
    language: "TypeScript",
    stars: 189,
    forks: 56,
    updatedAt: "2024-03-05",
    description: "常用 React Hooks 集合",
    license: "MIT License"
  },
  {
    id: 7,
    name: "mini-webpack",
    visibility: "Public",
    language: "JavaScript",
    stars: 312,
    forks: 89,
    updatedAt: "2024-03-04",
    description: "简化版 Webpack 实现，用于学习打包原理",
    license: "MIT License"
  },
  {
    id: 8,
    name: "docker-compose-examples",
    visibility: "Public",
    language: "Docker",
    stars: 167,
    forks: 78,
    updatedAt: "2024-03-03",
    description: "常用服务的 Docker Compose 配置例",
    license: "MIT License"
  },
  {
    id: 9,
    name: "rust-web-server",
    visibility: "Public",
    language: "Rust",
    stars: 234,
    forks: 45,
    updatedAt: "2024-03-02",
    description: "使用 Rust 实现的高性能 Web 服务器",
    license: "MIT License"
  },
  {
    id: 10,
    name: "go-microservices",
    visibility: "Public",
    language: "Go",
    stars: 445,
    forks: 123,
    updatedAt: "2024-03-01",
    description: "Go 微服务架构示例",
    license: "MIT License"
  },
  // 第二页数据
  {
    id: 11,
    name: "python-data-analysis",
    visibility: "Public",
    language: "Python",
    stars: 267,
    forks: 89,
    updatedAt: "2024-02-28",
    description: "数据分析工具集",
    license: "MIT License"
  },
  {
    id: 12,
    name: "flutter-ui-components",
    visibility: "Public",
    language: "Dart",
    stars: 178,
    forks: 45,
    updatedAt: "2024-02-27",
    description: "Flutter UI 组件库",
    license: "MIT License"
  },
  {
    id: 13,
    name: "electron-desktop-app",
    visibility: "Public",
    language: "JavaScript",
    stars: 156,
    forks: 34,
    updatedAt: "2024-02-26",
    description: "基于 Electron 的桌面应用模板",
    license: "MIT License"
  },
  {
    id: 14,
    name: "nestjs-api-server",
    visibility: "Public",
    language: "TypeScript",
    stars: 289,
    forks: 67,
    updatedAt: "2024-02-25",
    description: "NestJS API 服务器模板",
    license: "MIT License"
  },
  {
    id: 15,
    name: "svelte-todo-app",
    visibility: "Public",
    language: "Svelte",
    stars: 134,
    forks: 23,
    updatedAt: "2024-02-24",
    description: "使用 Svelte 构建的 Todo 应用",
    license: "MIT License"
  }
]

export function useRepositories(options: UseRepositoriesOptions = {}) {
  const { page = 1, search = '', sort = 'updated' } = options
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<Repository[]>([])
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 800))

        let filteredData = [...mockRepositories]

        // 搜索过滤
        if (search) {
          filteredData = filteredData.filter(repo =>
            repo.name.toLowerCase().includes(search.toLowerCase()) ||
            repo.description?.toLowerCase().includes(search.toLowerCase())
          )
        }

        // 排序
        filteredData.sort((a, b) => {
          switch (sort) {
            case 'stars':
              return b.stars - a.stars
            case 'forks':
              return b.forks - a.forks
            case 'updated':
            default:
              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          }
        })

        setTotal(filteredData.length)

        // 分页
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const paginatedData = filteredData.slice(start, end)
        setData(paginatedData)

      } catch (error) {
        console.error('获取仓库列表失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [page, search, sort])

  return {
    data,
    isLoading,
    total,
    pageSize
  }
} 