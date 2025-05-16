import { toast } from "sonner";
import type { ChatSessionDetail, ThreadItem } from "../Type";

// 获取指定 agent 的所有会话
export const getThreads = async (
  agentId: string,
  resourceId: string,
): Promise<ChatSessionDetail[]> => {
  try {
    const threadResponse = await fetch(
      `${import.meta.env.VITE_AGENT_HOST
      }/api/memory/threads?resourceid=${resourceId}&agentId=${agentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const threadList: ThreadItem[] = await threadResponse.json();
    const formattedSessionList = threadList.map((thread) => ({
      id: thread.id,
      title: thread.title,
      timestamp: new Date(thread.updatedAt),
      selectedKbs: [],
      messages: [],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${thread.id}`,
    }));

    return formattedSessionList.reverse();
  } catch (error) {
    console.error("Failed to load chat sessions:", error);
    toast.error("Could not load chat sessions.");
    return [];
  }
};

// 为指定 agent 创建新会话
export const createThread = async (
  agentId: string,
  resourceId: string,
  title: string = "new Session"
): Promise<ChatSessionDetail> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_AGENT_HOST
      }/api/memory/threads?agentId=${agentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, resourceId }),
      }
    );
    const thread: ThreadItem = await response.json();
    const formattedSession: ChatSessionDetail = {
      id: thread.id,
      title: thread.title,
      timestamp: new Date(thread.updatedAt),
      selectedKbs: [],
      messages: [],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${thread.id}`,
    };
    return formattedSession;
  } catch (error) {
    console.error(error);
    return {} as ChatSessionDetail;
  }
};

// 删除指定 agent 的指定会话
export const deleteThread = async (
  agentId: string,
  threadId: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_AGENT_HOST
      }/api/memory/threads/${threadId}?agentId=${agentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete thread");
    }

    return { success: true, message: "Thread deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete thread" };
  }
};

// 更新指定 agent 的指定会话的标题
export const updateThreadTitle = async (
  agentId: string,
  threadId: string,
  title: string
): Promise<{ success: boolean; message: string; newSession: ChatSessionDetail }> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_AGENT_HOST
      }/api/memory/threads/${threadId}?agentId=${agentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update thread title");
    }
    const thread: ThreadItem = await response.json();
    const formattedSession: ChatSessionDetail = {
      id: thread.id,
      title: thread.title,
      timestamp: new Date(thread.updatedAt),
      selectedKbs: [],
      messages: [],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${thread.id}`,
    };

    return { success: true, message: "Thread title updated successfully", newSession: formattedSession };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update thread title", newSession: {} as ChatSessionDetail };
  }
};

// 获取指定会话的对话信息
export const getThreadMessages = async (
  agentId: string,
  threadId: string,
): Promise<any[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_AGENT_HOST
      }/api/memory/threads/${threadId}/messages?agentId=${agentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data?.uiMessages || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
