// 接口返回的 agent 列表子项数据类型
export type Agent = {
  /** 原始信息: agent 名字 */
  name: string;
  /** 原始信息: agent 指令 */
  instructions: string;
  /** 原始信息: agent 工具集 */
  tools: Record<string, {
    /** 原始信息: 工具 id */
    id: string;
    /** 原始信息: 工具描述 */
    description: string;
    /** 原始信息: 工具输入 */
    inputSchema: string;
    /** 原始信息: 工具输出 */
    outputSchema: string;
  }>;
  /** 原始信息: 工作流 */
  workflows: Record<string, unknown>;
  /** 原始信息: 模型提供商 */
  provider: string;
  /** 原始信息: 模型 id */
  modelId: string;
  /** 补充额外信息后得到的: agent id */
  id: string;
  /** 补充额外信息后得到的: 是否开启记忆 */
  hasMemory: boolean;
  /** 补充额外信息后得到的: 描述 */
  description: string;
  /** 补充额外信息后得到的: 头像 */
  avatar: string;
};

// 接口返回的 thread 会话列表子项数据类型
export type ThreadItem = {
  id: string;
  resourceId: string;
  title: string;
  metadata: null;
  createdAt: string;
  updatedAt: string;
};

// 添加消息类型定义
interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

// 会话列表单项数据类型
export interface ChatSessionDetail {
  id: string;
  title: string;
  timestamp: Date;
  selectedKbs: string[];
  messages: Message[];
  avatar: string;
}