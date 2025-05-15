import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useMemo, useState } from "react";

import ChatArea from "./components/ChatArea";
import KnowledgeBaseList from "./components/KnowledgeBaseList";
import SessionList from "./components/SessionList";
import {
  createThread,
  deleteThread,
  getThreads,
  updateThreadTitle,
} from "./server";
import type { ChatSessionDetail } from "./Type";
import { toast } from "sonner";

export interface KnowledgeBase {
  id: number;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const agentId = "dbChatAgent",
  resourceId = "dbChatAgent";

export function Component() {
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isLoaded, isSignedIn } = useUser();
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // 添加会话列表状态
  const [chatSessions, setChatSessions] = useState<ChatSessionDetail[]>([]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // 添加当前选中会话状态
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // 获取当前会话的选中知识库
  const currentSelectedKbs = useMemo(() => {
    return (
      chatSessions.find((s) => s.id === currentSessionId)?.selectedKbs || []
    );
  }, [chatSessions, currentSessionId]);

  // 修改知识库选择处理函数
  const handleKbSelection = (kbTitle: string) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (currentSessionId && session.id === currentSessionId) {
          const newSelectedKbs = session.selectedKbs.includes(kbTitle)
            ? (session.selectedKbs || []).filter((kb) => kb !== kbTitle)
            : [...session.selectedKbs, kbTitle];
          return {
            ...session,
            selectedKbs: newSelectedKbs,
          };
        }
        return session;
      })
    );
  };

  // 修改会话标题
  const handleUpdateSessionTitle = async (
    sessionId: string,
    newTitle: string
  ) => {
    const { success, message, newSession } = await updateThreadTitle(
      agentId,
      sessionId,
      newTitle
    );
    if (!success) {
      toast.error(message);
      return;
    }

    setChatSessions((prev) => [
      newSession,
      ...prev.filter((session) => session.id !== newSession.id),
    ]);
  };

  // 创建新会话
  const handleCreateNewChat = async () => {
    const newSession = await createThread(agentId, resourceId);
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  // 修改搜索和会话相关的处理函数
  const handleSessionClick = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // 这里可以加载对应会话的消息记录
    // loadSessionMessages(sessionId);
  };

  // 获取当前话选中的知识库详细信息
  const currentSelectedKbDetails: string[] = useMemo(() => {
    if (!currentSessionId) return [];
    const selectedKbs =
      chatSessions.find((s) => s.id === currentSessionId)?.selectedKbs || [];
    return (knowledgeBases || []).filter((kbName) =>
      selectedKbs.includes(kbName)
    );
  }, [chatSessions, currentSessionId, knowledgeBases]);

  // 删除会话
  const handleDeleteSession = async (
    sessionId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发会话选择

    const { success, message } = await deleteThread(agentId, sessionId);
    if (!success) {
      toast.error(message);
      return;
    }

    toast.success("Session deleted successfully");

    // 如果删除的是当前选中的会话，需要选择新的当前会话
    if (sessionId === currentSessionId) {
      const remainingSessions = (chatSessions || []).filter(
        (s) => s.id !== sessionId
      );
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0]!.id);
      } else {
        // 如果没有剩余会话，创建一个新会话
        handleCreateNewChat();
      }
    }

    // 删除会话
    setChatSessions((prev) =>
      (prev || []).filter((session) => session.id !== sessionId)
    );
  };

  // 获取当前 agent 所有会话, 并且默认选中第一个
  useEffect(() => {
    const loadInitialSessions = async () => {
      if (isLoaded && isSignedIn) {
        setIsLoadingSessions(true);
        const threadList = await getThreads(agentId, resourceId);

        setChatSessions(threadList);
        setIsLoadingSessions(false);
        if (threadList.length > 0) {
          setCurrentSessionId(threadList[0]!.id);
        } else {
          handleCreateNewChat();
        }
      }
    };
    loadInitialSessions();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setKnowledgeBases(user?.publicMetadata?.knowledgeBaseList as string[]);
    }
  }, [isLoaded, isSignedIn]);

  // 添加 URL 参数理的 useEffect
  useEffect(() => {
    // 获取 URL 参数中的 kb_id
    const urlParams = new URLSearchParams(window.location.search);
    const kbName = urlParams.get("kb_name");

    if (kbName) {
      // This effect should ideally run after initial sessions are loaded
      // and knowledgeBases are available.
      // For now, it might conflict if it creates a local session that's then overwritten.
      // A robust solution would integrate this with the API-based session creation.
      const targetKb = knowledgeBases.find((kb) => kb === kbName);

      if (targetKb) {
        // 创建新会话并选中该知识库
        const newSession: ChatSessionDetail = {
          id: Date.now().toString(),
          title: `Chat with ${kbName}`,
          timestamp: new Date(),
          selectedKbs: [kbName], // 默认选中该知识库
          messages: [],
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
        };

        // 更新会话列表和当前会话
        setChatSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        // Consider removing the URL parameter after processing
        // window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [knowledgeBases, isLoaded, isSignedIn]); // Runs when KBs are loaded and user is signed in

  if (isLoadingSessions && isLoaded) {
    // Show loading spinner only after clerk is loaded
    // You can use your LoadingSpinner component here if you have one
    return (
      <div className="flex justify-center items-center h-full w-full">
        Loading sessions...
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* 左侧会话列表 */}
      <SessionList
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId ?? ""}
        handleCreateNewChat={handleCreateNewChat}
        handleSessionClick={handleSessionClick}
        handleDeleteSession={handleDeleteSession}
        handleUpdateSessionTitle={handleUpdateSessionTitle}
      />

      {/* 中间聊天区域 */}
      <ChatArea
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId ?? ""}
        currentSelectedKbDetails={currentSelectedKbDetails}
        isRightSidebarOpen={isRightSidebarOpen}
        setIsRightSidebarOpen={setIsRightSidebarOpen}
        handleUpdateSessionTitle={handleUpdateSessionTitle}
      />

      {/* 右侧知识库列表 */}
      <KnowledgeBaseList
        isRightSidebarOpen={isRightSidebarOpen}
        setIsRightSidebarOpen={setIsRightSidebarOpen}
        currentSelectedKbs={currentSelectedKbs}
        handleKbSelection={handleKbSelection}
        knowledgeBases={knowledgeBases}
      />
    </div>
  );
}
