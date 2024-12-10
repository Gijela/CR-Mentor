/* 用户基本信息 */
interface UserBase {
  /* 用户登录名 */
  login: string;
  /* 用户 ID */
  id: number;
  /* 用户节点 ID */
  node_id: string;
  /* 用户头像 URL */
  avatar_url: string;
  /* 用户类型 */
  type: string;
  /* 是否为管理员 */
  site_admin: boolean;
}

/* 完整用户信息 */
interface User extends UserBase {
  /* Gravatar ID */
  gravatar_id: string;
  /* 用户 API URL, 示例: https://api.github.com/users/Gijela */
  url: string;
  /* 用户主页 URL, 示例: https://github.com/Gijela */
  html_url: string;
  /* 用户关注者 URL, 示例: https://api.github.com/users/Gijela/followers */
  followers_url: string;
  /* 用户关注 URL, 示例: https://api.github.com/users/Gijela/following{/other_user} */
  following_url: string;
  /* 用户 Gists URL, 示例: https://api.github.com/users/Gijela/gists{/gist_id} */
  gists_url: string;
  /* 用户标星 URL, 示例: https://api.github.com/users/Gijela/starred{/owner}{/repo} */
  starred_url: string;
  /* 用户订阅 URL, 示例: https://api.github.com/users/Gijela/subscriptions */
  subscriptions_url: string;
  /* 用户组织 URL, 示例: https://api.github.com/users/Gijela/orgs */
  organizations_url: string;
  /* 用户仓库 URL, 示例: https://api.github.com/users/Gijela/repos */
  repos_url: string;
  /* 用户事件 URL, 示例: https://api.github.com/users/Gijela/events{/privacy} */
  events_url: string;
  /* 用户接收事件 URL, 示例: https://api.github.com/users/Gijela/received_events */
  received_events_url: string;
  /* 用户视图类型 */
  user_view_type: string;
}

/* 仓库基本信息 */
interface RepoBase {
  /* 仓库 ID */
  id: number;
  /* 仓库节点 ID */
  node_id: string;
  /* 仓库名称 */
  name: string;
  /* 仓库完整名称 */
  full_name: string;
  /* 是否为私有仓库 */
  private: boolean;
  /* 仓库拥有者信息 */
  owner: User;
  /* 仓库 HTML URL */
  html_url: string;
  /* 仓库描述 */
  description: string | null;
  /* 是否为 fork */
  fork: boolean;
  /* 仓库 API URL */
  url: string;
}

/* 完整仓库信息 */
interface Repository extends RepoBase {
  /* fork URL */
  forks_url: string;
  /* 密钥 URL */
  keys_url: string;
  /* 协作者 URL */
  collaborators_url: string;
  /* 团队 URL */
  teams_url: string;
  /* hooks URL */
  hooks_url: string;
  /* issue 事件 URL */
  issue_events_url: string;
  /* 事件 URL */
  events_url: string;
  /* 受理人 URL */
  assignees_url: string;
  /* 分支 URL */
  branches_url: string;
  /* 标签 URL */
  tags_url: string;
  /* blobs URL */
  blobs_url: string;
  /* git 标签 URL */
  git_tags_url: string;
  /* git refs URL */
  git_refs_url: string;
  /* 树 URL */
  trees_url: string;
  /* 状态 URL */
  statuses_url: string;
  /* 语言 URL */
  languages_url: string;
  /* 标星者 URL */
  stargazers_url: string;
  /* 贡献者 URL */
  contributors_url: string;
  /* 订阅者 URL */
  subscribers_url: string;
  /* 订阅 URL */
  subscription_url: string;
  /* 提交 URL */
  commits_url: string;
  /* git 提交 URL */
  git_commits_url: string;
  /* 评论 URL */
  comments_url: string;
  /* issue 评论 URL */
  issue_comment_url: string;
  /* 内容 URL */
  contents_url: string;
  /* 比较 URL demo: https://api.github.com/repos/Gijela/Auth-Github-App/compare/{base}...{head}*/
  compare_url: string;
  /* 合并 URL */
  merges_url: string;
  /* 归档 URL */
  archive_url: string;
  /* 下载 URL */
  downloads_url: string;
  /* issues URL */
  issues_url: string;
  /* pulls URL */
  pulls_url: string;
  /* 里程碑 URL */
  milestones_url: string;
  /* 通知 URL */
  notifications_url: string;
  /* 标签 URL */
  labels_url: string;
  /* 发布 URL */
  releases_url: string;
  /* 部署 URL */
  deployments_url: string;
  /* 创建时间 */
  created_at: string;
  /* 更新时间 */
  updated_at: string;
  /* 推送时间 */
  pushed_at: string;
  /* git URL */
  git_url: string;
  /* ssh URL */
  ssh_url: string;
  /* clone URL */
  clone_url: string;
  /* svn URL */
  svn_url: string;
  /* 主页 */
  homepage: string | null;
  /* 大小 */
  size: number;
  /* 标星数 */
  stargazers_count: number;
  /* 观察者数 */
  watchers_count: number;
  /* 主要语言 */
  language: string;
  /* 是否有 issues */
  has_issues: boolean;
  /* 是否有项目 */
  has_projects: boolean;
  /* 是否有下载 */
  has_downloads: boolean;
  /* 是否有 wiki */
  has_wiki: boolean;
  /* 是否有页面 */
  has_pages: boolean;
  /* 是否有讨论 */
  has_discussions: boolean;
  /* fork 数 */
  forks_count: number;
  /* 镜像 URL */
  mirror_url: string | null;
  /* 是否归档 */
  archived: boolean;
  /* 是否禁用 */
  disabled: boolean;
  /* 开放 issue 数 */
  open_issues_count: number;
  /* 许可证 */
  license: string | null;
  /* 是否允许 fork */
  allow_forking: boolean;
  /* 是否为模板 */
  is_template: boolean;
  /* 是否需要提交签名 */
  web_commit_signoff_required: boolean;
  /* 主题 */
  topics: string[];
  /* 可见性 */
  visibility: string;
  /* fork 数 */
  forks: number;
  /* 开放 issue 数 */
  open_issues: number;
  /* 观察者数 */
  watchers: number;
  /* 默认分支 */
  default_branch: string;
  /* 是否允许压缩合并 */
  allow_squash_merge: boolean;
  /* 是否允许合并提交 */
  allow_merge_commit: boolean;
  /* 是否允许变基合并 */
  allow_rebase_merge: boolean;
  /* 是否允许自动合并 */
  allow_auto_merge: boolean;
  /* 合并后是否删除分支 */
  delete_branch_on_merge: boolean;
  /* 是否允许更新分支 */
  allow_update_branch: boolean;
  /* 是否使用压缩 PR 标题作为默认值 */
  use_squash_pr_title_as_default: boolean;
  /* 压缩合并提交消息 */
  squash_merge_commit_message: string;
  /* 压缩合并提交标题 */
  squash_merge_commit_title: string;
  /* 合并提交消息 */
  merge_commit_message: string;
  /* 合并提交标题 */
  merge_commit_title: string;
}

/* PR 分支信息 */
interface PullRequestBranch {
  /* 分支标签 demo: Gijela:feat/cr */
  label: string;
  /* 分支名称 */
  ref: string;
  /* 提交 SHA */
  sha: string;
  /* 用户信息 */
  user: User;
  /* 仓库信息 */
  repo: Repository;
}

/* PR webhook 事件的 payload 参数 */
export interface PullRequestPayload {
  /* PR 事件的动作类型，例如 "opened"、"closed" 等 */
  action: string;
  /* PR 的编号 */
  number: number;
  /* PR 的详细信息 */
  pull_request: {
    /* PR 的 API URL, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/pulls/8 */
    url: string;
    /* PR 的唯一标识符 */
    id: number;
    /* PR 的节点 ID */
    node_id: string;
    /* PR 的 HTML URL, 示例: https://github.com/Gijela/Auth-Github-App/pull/8 */
    html_url: string;
    /* PR 的差异文件 URL, 示例: https://github.com/Gijela/Auth-Github-App/pull/8.diff */
    diff_url: string;
    /* PR 的补丁文件 URL, 示例: https://github.com/Gijela/Auth-Github-App/pull/8.patch */
    patch_url: string;
    /* PR 对应的 issue URL, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/issues/8 */
    issue_url: string;
    /* PR 的编号, 与上一层的 number 值相同 */
    number: number;
    /* PR 的状态，如 "open"、"closed" */
    state: string;
    /* PR 是否被锁定 */
    locked: boolean;
    /* PR 的标题 */
    title: string;
    /* PR 的创建者信息 */
    user: User;
    /* PR 的描述内容 */
    body: string | null;
    /* PR 的创建时间 */
    created_at: string;
    /* PR 的更新时间 */
    updated_at: string;
    /* PR 的关闭时间 */
    closed_at: string | null;
    /* PR 的合并时间 */
    merged_at: string | null;
    /* PR 的合并提交 SHA */
    merge_commit_sha: string | null;
    /* PR 的受理人 */
    assignee: null;
    /* PR 的受理人列表 */
    assignees: UserBase[];
    /* PR 的审查者列表 */
    requested_reviewers: UserBase[];
    /* PR 的审查团队列表 */
    requested_teams: {
      /* 团队 ID */
      id: number;
      /* 团队节点 ID */
      node_id: string;
      /* 团队 URL */
      url: string;
      /* 团队 HTML URL */
      html_url: string;
      /* 团队名称 */
      name: string;
      /* 团队描述 */
      description: string | null;
      /* 团队权限 */
      permission: string;
    }[];
    /* PR 的标签列表 */
    labels: {
      /* 标签 ID */
      id: number;
      /* 标签节点 ID */
      node_id: string;
      /* 标签 URL */
      url: string;
      /* 标签名称 */
      name: string;
      /* 标签颜色 */
      color: string;
      /* 标签描述 */
      description: string | null;
    }[];
    /* PR 的里程碑信息 */
    milestone: null;
    /* PR 是否为草稿 */
    draft: boolean;
    /* PR 的提交 URL, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/pulls/8/commits */
    commits_url: string;
    /* PR 的代码审查评论 URL, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/pulls/8/comments */
    review_comments_url: string;
    /* PR 的代码审查评论模板 URL, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/pulls/comments{/number} */
    review_comment_url: string;
    /* PR 的评论 URL, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/issues/8/comments */
    comments_url: string;
    /* PR 的状态 URL, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/statuses/ee5c318d70ddedf49d35475ceb2ae6ce3d859621 */
    statuses_url: string;
    /* PR 的来源分支信息 */
    head: PullRequestBranch;
    /* PR 的目标分支信息 */
    base: PullRequestBranch;
    /* PR 相关链接 */
    _links: {
      /* PR 自身链接, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/pulls/8 */
      self: {
        href: string;
      };
      /* PR HTML 链接, 示例: https://github.com/Gijela/Auth-Github-App/pull/8 */
      html: {
        href: string;
      };
      /* PR issue 链接, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/issues/8 */
      issue: {
        href: string;
      };
      /* PR 评论链接, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/issues/8/comments */
      comments: {
        href: string;
      };
      /* PR 代码审查评论链接, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/pulls/8/comments */
      review_comments: {
        href: string;
      };
      /* PR 代码审查评论模板链接, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/pulls/comments{/number} */
      review_comment: {
        href: string;
      };
      /* PR 提交链接, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/pulls/8/commits */
      commits: {
        href: string;
      };
      /* PR 状态链接, 示例: https://api.github.com/repos/Gijela/Auth-Github-App/statuses/ee5c318d70ddedf49d35475ceb2ae6ce3d859621 */
      statuses: {
        href: string;
      };
    };
    /* PR 作者与仓库的关联类型 */
    author_association: string;
    /* PR 是否开启自动合并 */
    auto_merge: boolean | null;
    /* PR 锁定原因 */
    active_lock_reason: string | null;
    /* PR 是否已合并 */
    merged: boolean;
    /* PR 是否可合并 */
    mergeable: boolean | null;
    /* PR 是否可变基 */
    rebaseable: boolean | null;
    /* PR 可合并状态 */
    mergeable_state: string;
    /* PR 合并者信息 */
    merged_by: UserBase | null;
    /* PR 的评论数 */
    comments: number;
    /* PR 的代码审查评论数 */
    review_comments: number;
    /* 维护者是否可以修改 PR */
    maintainer_can_modify: boolean;
    /* PR 的提交数 */
    commits: number;
    /* PR 的新增行数 */
    additions: number;
    /* PR 的删除行数 */
    deletions: number;
    /* PR 的变更文件数 */
    changed_files: number;
  };
  /* 仓库信息 */
  repository: Repository;
  /* 事件触发者信息 */
  sender: User;
}