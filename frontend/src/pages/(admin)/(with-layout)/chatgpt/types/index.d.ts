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