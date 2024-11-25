// interface Repository {
//   name: string; // name
//   description: string; // description
//   isPublic: boolean; // private boolean
//   language: string; // language
//   stars: number; // stargazers_count
//   forks?: number; // forks_count
//   lastUpdated: string; // updated_at
//   license?: string; // license.name
// }

// // 添加模拟数据
export const mockRepositories: any[] = [
  {
    name: "react-awesome-app",
    description: "一个使用 React 和 TypeScript 构建的现代化应用程序",
    isPublic: true,
    language: "TypeScript",
    stars: 128,
    forks: 45,
    lastUpdated: "2024-03-15",
    license: "MIT",
  },
  {
    name: "vue-dashboard",
    description: "基于 Vue.js 的管理后台模板",
    isPublic: true,
    language: "Vue",
    stars: 89,
    forks: 23,
    lastUpdated: "2024-03-10",
  },
  {
    name: "node-api-starter",
    description: "Node.js REST API 启动模板，包含认证和数据库集成",
    isPublic: false,
    language: "JavaScript",
    stars: 256,
    forks: 67,
    lastUpdated: "2024-03-01",
    license: "Apache-2.0",
  },
  {
    name: "python-ml-toolkit",
    description: "机器学习工具集，包含常用算法实现",
    isPublic: true,
    language: "Python",
    stars: 432,
    forks: 89,
    lastUpdated: "2024-03-08",
    license: "MIT",
  },
  {
    name: "go-microservices",
    description: "基于 Go 的微服务架构示例",
    isPublic: true,
    language: "Go",
    stars: 367,
    forks: 78,
    lastUpdated: "2024-03-12",
    license: "MIT",
  },
  {
    name: "react-native-ui-kit",
    description: "React Native UI 组件库",
    isPublic: true,
    language: "TypeScript",
    stars: 892,
    forks: 156,
    lastUpdated: "2024-03-14",
    license: "MIT",
  },
  {
    name: "flutter-shop-app",
    description: "Flutter 电商应用模板",
    isPublic: true,
    language: "Dart",
    stars: 245,
    forks: 67,
    lastUpdated: "2024-03-09",
  },
  {
    name: "rust-blockchain",
    description: "使用 Rust 实现的区块链示例",
    isPublic: true,
    language: "Rust",
    stars: 567,
    forks: 89,
    lastUpdated: "2024-03-11",
    license: "MIT",
  },
  {
    name: "angular-crm",
    description: "企业级 CRM 系统前端实现",
    isPublic: false,
    language: "TypeScript",
    stars: 178,
    forks: 45,
    lastUpdated: "2024-03-07",
  },
  {
    name: "django-blog",
    description: "基于 Django 的博客系统",
    isPublic: true,
    language: "Python",
    stars: 156,
    forks: 34,
    lastUpdated: "2024-03-13",
    license: "MIT",
  },
  {
    name: "swift-weather-app",
    description: "iOS 天气应用",
    isPublic: true,
    language: "Swift",
    stars: 234,
    forks: 56,
    lastUpdated: "2024-03-06",
    license: "MIT",
  },
  {
    name: "kotlin-android-app",
    description: "Kotlin Android 应用模板",
    isPublic: true,
    language: "Kotlin",
    stars: 345,
    forks: 78,
    lastUpdated: "2024-03-05",
  },
  {
    name: "express-auth-service",
    description: "Express.js 认证服务",
    isPublic: false,
    language: "JavaScript",
    stars: 123,
    forks: 34,
    lastUpdated: "2024-03-04",
    license: "MIT",
  },
  {
    name: "spring-boot-starter",
    description: "Spring Boot 项目启动模板",
    isPublic: true,
    language: "Java",
    stars: 789,
    forks: 234,
    lastUpdated: "2024-03-03",
    license: "Apache-2.0",
  },
  {
    name: "php-cms",
    description: "PHP 内容管理系统",
    isPublic: true,
    language: "PHP",
    stars: 167,
    forks: 45,
    lastUpdated: "2024-03-02",
  },
  {
    name: "docker-compose-templates",
    description: "常用 Docker Compose 配置模板",
    isPublic: true,
    language: "Dockerfile",
    stars: 892,
    forks: 245,
    lastUpdated: "2024-03-01",
    license: "MIT",
  },
  {
    name: "nextjs-portfolio",
    description: "使用 Next.js 构建的个人作品集网站",
    isPublic: true,
    language: "TypeScript",
    stars: 234,
    forks: 67,
    lastUpdated: "2024-02-29",
  },
  {
    name: "unity-game-demo",
    description: "Unity 3D 游戏演示项目",
    isPublic: true,
    language: "C#",
    stars: 456,
    forks: 89,
    lastUpdated: "2024-02-28",
    license: "MIT",
  },
  {
    name: "laravel-ecommerce",
    description: "基于 Laravel 的电商平台",
    isPublic: false,
    language: "PHP",
    stars: 345,
    forks: 78,
    lastUpdated: "2024-02-27",
    license: "MIT",
  },
  {
    name: "tensorflow-examples",
    description: "TensorFlow 深度学习示例集",
    isPublic: true,
    language: "Python",
    stars: 1234,
    forks: 345,
    lastUpdated: "2024-02-26",
    license: "Apache-2.0",
  },
];

// 仓库所有者类型定义
interface Owner {
  // 用户登录名
  login: string;
  // 用户ID
  id: number;
  // 节点ID
  node_id: string;
  // 头像URL
  avatar_url: string;
  // Gravatar ID
  gravatar_id: string;
  // API URL
  url: string;
  // GitHub主页URL
  html_url: string;
  // 关注者URL
  followers_url: string;
  // 正在关注URL
  following_url: string;
  // Gists URL
  gists_url: string;
  // Star URL
  starred_url: string;
  // 订阅URL
  subscriptions_url: string;
  // 组织URL
  organizations_url: string;
  // 仓库URL
  repos_url: string;
  // 事件URL
  events_url: string;
  // 接收事件URL
  received_events_url: string;
  // 用户类型
  type: string;
  // 用户视图类型
  user_view_type: string;
  // 是否是管理员
  site_admin: boolean;
}

// 许可证类型定义
interface License {
  // 许可证key
  key: string;
  // 许可证名称
  name: string;
  // SPDX ID
  spdx_id: string;
  // 许可证URL
  url: string;
  // 节点ID
  node_id: string;
}

// 权限类型定义
interface Permissions {
  // 管理权限
  admin: boolean;
  // 维护权限
  maintain: boolean;
  // 推送权限
  push: boolean;
  // 分类权限
  triage: boolean;
  // 拉取权限
  pull: boolean;
}

// 仓库类型定义
export interface Repository {
  // 仓库ID
  id: number;
  // 节点ID
  node_id: string;
  // 仓库名称
  name: string;
  // 完整仓库名称
  full_name: string;
  // 是否私有
  private: boolean;
  // 仓库所有者信息
  owner: Owner;
  // GitHub页面URL
  html_url: string;
  // 仓库描述
  description: string;
  // 是否是fork的仓库
  fork: boolean;
  // API URL
  url: string;
  // forks URL
  forks_url: string;
  // keys URL
  keys_url: string;
  // 协作者URL
  collaborators_url: string;
  // 团队URL
  teams_url: string;
  // hooks URL
  hooks_url: string;
  // issue事件URL
  issue_events_url: string;
  // 事件URL
  events_url: string;
  // 指派人URL
  assignees_url: string;
  // 分支URL
  branches_url: string;
  // 标签URL
  tags_url: string;
  // blobs URL
  blobs_url: string;
  // git标签URL
  git_tags_url: string;
  // git引用URL
  git_refs_url: string;
  // 树URL
  trees_url: string;
  // 状态URL
  statuses_url: string;
  // 语言URL
  languages_url: string;
  // star URL
  stargazers_url: string;
  // 贡献者URL
  contributors_url: string;
  // 订阅者URL
  subscribers_url: string;
  // 订阅URL
  subscription_url: string;
  // 提交URL
  commits_url: string;
  // git提交URL
  git_commits_url: string;
  // 评论URL
  comments_url: string;
  // issue评论URL
  issue_comment_url: string;
  // 内容URL
  contents_url: string;
  // 比较URL
  compare_url: string;
  // 合并URL
  merges_url: string;
  // 归档URL
  archive_url: string;
  // 下载URL
  downloads_url: string;
  // issues URL
  issues_url: string;
  // pulls URL
  pulls_url: string;
  // 里程碑URL
  milestones_url: string;
  // 通知URL
  notifications_url: string;
  // 标签URL
  labels_url: string;
  // 发布URL
  releases_url: string;
  // 部署URL
  deployments_url: string;
  // 创建时间
  created_at: string;
  // 更新时间
  updated_at: string;
  // 推送时间
  pushed_at: string;
  // git URL
  git_url: string;
  // ssh URL
  ssh_url: string;
  // clone URL
  clone_url: string;
  // svn URL
  svn_url: string;
  // 主页
  homepage: string;
  // 仓库大小
  size: number;
  // star数量
  stargazers_count: number;
  // 观察者数量
  watchers_count: number;
  // 主要语言
  language: string | null;
  // 是否有issues
  has_issues: boolean;
  // 是否有项目
  has_projects: boolean;
  // 是否可下载
  has_downloads: boolean;
  // 是否有wiki
  has_wiki: boolean;
  // 是否有页面
  has_pages: boolean;
  // 是否有讨论
  has_discussions: boolean;
  // fork数量
  forks_count: number;
  // 镜像URL
  mirror_url: string | null;
  // 是否归档
  archived: boolean;
  // 是否禁用
  disabled: boolean;
  // 开放issue数量
  open_issues_count: number;
  // 许可证信息
  license: License | null;
  // 是否允许fork
  allow_forking: boolean;
  // 是否是模板
  is_template: boolean;
  // 是否需要web提交签名
  web_commit_signoff_required: boolean;
  // 主题
  topics: string[];
  // 可见性
  visibility: string;
  // fork数
  forks: number;
  // 开放issue数
  open_issues: number;
  // 观察者数
  watchers: number;
  // 默认分支
  default_branch: string;
  // 权限
  permissions: Permissions;
}
