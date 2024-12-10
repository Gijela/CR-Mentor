/* 一个 PR 的类型 */
export interface PullRequestItem {
  /* PR 的 API 接口地址 */
  url: string;
  /* PR 的仓库名称 */
  repositoryName?: string;
  /* 仓库的 API 接口地址 */
  repository_url: string;
  /* PR 标签的 API 接口地址 */
  labels_url: string;
  /* PR 评论的 API 接口地址 */
  comments_url: string;
  /* PR 事件的 API 接口地址 */
  events_url: string;
  /* PR 的 HTML 页面地址 */
  html_url: string;
  /* PR 的唯一标识符 */
  id: number;
  /* PR 的节点 ID */
  node_id: string;
  /* PR 的编号 */
  number: number;
  /* PR 的标题 */
  title: string;
  /* PR 的创建者信息 */
  user: {
    /* 用户名 */
    login: string;
    /* 用户 ID */
    id: number;
    /* 用户节点 ID */
    node_id: string;
    /* 用户头像地址 */
    avatar_url: string;
    /* Gravatar ID */
    gravatar_id: string;
    /* 用户的 API 接口地址 */
    url: string;
    /* 用户的 HTML 页面地址 */
    html_url: string;
    /* 用户关注者的 API 接口地址 */
    followers_url: string;
    /* 用户关注的人的 API 接口地址 */
    following_url: string;
    /* 用户 Gists 的 API 接口地址 */
    gists_url: string;
    /* 用户标星项目的 API 接口地址 */
    starred_url: string;
    /* 用户订阅的 API 接口地址 */
    subscriptions_url: string;
    /* 用户组织的 API 接口地址 */
    organizations_url: string;
    /* 用户仓库的 API 接口地址 */
    repos_url: string;
    /* 用户事件的 API 接口地址 */
    events_url: string;
    /* 用户接收到的事件的 API 接口地址 */
    received_events_url: string;
    /* 用户类型 */
    type: string;
    /* 用户视图类型 */
    user_view_type: string;
    /* 是否是网站管理员 */
    site_admin: boolean;
  };
  /* PR 的标签数组 */
  labels: any[];
  /* PR 的状态 */
  state: string;
  /* PR 是否被锁定 */
  locked: boolean;
  /* PR 的指派者 */
  assignee: null | any;
  /* PR 的指派者数组 */
  assignees: any[];
  /* PR 的里程碑 */
  milestone: null | any;
  /* PR 的评论数 */
  comments: number;
  /* PR 的创建时间 */
  created_at: string;
  /* PR 的更新时间 */
  updated_at: string;
  /* PR 的关闭时间 */
  closed_at: string;
  /* 作者与仓库的关联关系 */
  author_association: string;
  /* PR 锁定的原因 */
  active_lock_reason: null | string;
  /* 是否是草稿 PR */
  draft: boolean;
  /* PR 的详细信息 */
  pull_request: {
    /* PR 的 API 接口地址 */
    url: string;
    /* PR 的 HTML 页面地址 */
    html_url: string;
    /* PR 的 diff 文件地址 */
    diff_url: string;
    /* PR 的 patch 文件地址 */
    patch_url: string;
    /* PR 的合并时间 */
    merged_at: null | string;
  };
  /* PR 的描述 */
  body: null | string;
  /* PR 的反应信息 */
  reactions: {
    /* 反应的 API 接口地址 */
    url: string;
    /* 反应总数 */
    total_count: number;
    /* 点赞数 */
    "+1": number;
    /* 踩数 */
    "-1": number;
    /* 笑脸数 */
    laugh: number;
    /* 欢呼数 */
    hooray: number;
    /* 困惑数 */
    confused: number;
    /* 心形数 */
    heart: number;
    /* 火箭数 */
    rocket: number;
    /* 眼睛数 */
    eyes: number;
  };
  /* PR 时间线的 API 接口地址 */
  timeline_url: string;
  /* PR 是否通过 GitHub App 执行 */
  performed_via_github_app: null | any;
  /* PR 状态的原因 */
  state_reason: null | string;
  /* PR 的得分 */
  score: number;
}
