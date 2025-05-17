import type { ChatSessionDetail, ThreadItem } from "../types";

/**
 * 将 thread 数据格式转换为 sessionItem 数据格式
 * @bg 历史原因，先使用 ChatSessionDetail 这种类型的列表，集成 mastra 框架就直接将 thread 会话数据转换为 ChatSessionDetail 类型省事
 * @param thread - 线程数据
 * @returns 单项会话数据
 */

export const threadToSessionItem = (thread: ThreadItem): ChatSessionDetail => {
  return {
    id: thread.id,
    title: thread.title,
    timestamp: new Date(thread?.updatedAt || thread?.createdAt),
    selectedKbs: [],
    messages: [],
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${thread.id}`,
  };
}
