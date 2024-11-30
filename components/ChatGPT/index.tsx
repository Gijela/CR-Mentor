import React, { useState, useMemo, useEffect } from "react";
import {
  clientUserId,
  getKnowledgeBases,
  KnowledgeBase,
} from "../KnowledgeBase";
import SessionList from "./SessionList";
import KnowledgeBaseList from "./KnowledgeBaseList";
import ChatArea from "./ChatArea";

// 添加消息类型定义
interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

// 添加会话详情类型定义
export interface ChatSessionDetail {
  id: string;
  title: string;
  timestamp: Date;
  selectedKbs: string[];
  messages: Message[];
  avatar: string;
}

const ChatGPT = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 添加会话列表状态
  const [chatSessions, setChatSessions] = useState<ChatSessionDetail[]>([
    {
      id: "1",
      title: "new Session",
      timestamp: new Date(),
      selectedKbs: [],
      messages: [],
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=1", // 添加默认头像
    },
  ]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // 添加当前选中会话状态
  const [currentSessionId, setCurrentSessionId] = useState<string>("1");

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
        if (session.id === currentSessionId) {
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

  // 添加修改会话标题的处理函数
  const handleUpdateSessionTitle = (sessionId: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              title: newTitle.trim() || `Session ${session.id}`, // 提供默认标题
            }
          : session
      )
    );
  };

  // 修改创建新会话的处理函数
  const handleCreateNewChat = () => {
    const newSession: ChatSessionDetail = {
      id: Date.now().toString(),
      title: `New Session ${chatSessions.length + 1}`,
      timestamp: new Date(),
      selectedKbs: [],
      messages: [],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  // 修改搜索和会话相关的处理函数
  const handleSessionClick = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // 这里可以加载对应会话的消息记录
    // loadSessionMessages(sessionId);
  };

  // 获取当前会话选中的知识库详细信息
  const currentSelectedKbDetails = useMemo(() => {
    const selectedKbs =
      chatSessions.find((s) => s.id === currentSessionId)?.selectedKbs || [];
    return (knowledgeBases || []).filter((kb) =>
      selectedKbs.includes(kb.title)
    );
  }, [chatSessions, currentSessionId]);

  // 添加删除会话的处理函数
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发会话选择

    // 如果删除的是当前选中的会话，需要选择新的当前会话
    if (sessionId === currentSessionId) {
      const remainingSessions = (chatSessions || []).filter(
        (s) => s.id !== sessionId
      );
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        // 如果没有剩余会话，创建一个新会话
        handleCreateNewChat();
      }
    }

    // 删除会话
    setChatSessions((prev) =>
      prev.filter((session) => session.id !== sessionId)
    );
  };

  // 获取知识库列表
  const handleGetKnowledgeBases = async () => {
    const data = await getKnowledgeBases(clientUserId);
    setKnowledgeBases(data);
  };

  useEffect(() => {
    handleGetKnowledgeBases();
  }, []);

  // 添加 URL 参数处理的 useEffect
  useEffect(() => {
    // 获取 URL 参数中的 kb_id
    const urlParams = new URLSearchParams(window.location.search);
    const kbId = urlParams.get("kb_id");

    if (kbId) {
      // 在知识库列表中查找对应的知识库
      const targetKb = knowledgeBases.find((kb) => kb.id === Number(kbId));

      if (targetKb) {
        // 创建新会话并选中该知识库
        const newSession: ChatSessionDetail = {
          id: Date.now().toString(),
          title: `${targetKb.title} 会话`,
          timestamp: new Date(),
          selectedKbs: [targetKb.title], // 默认选中该知识库
          messages: [],
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
        };

        // 更新会话列表和当前会话
        setChatSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
      }
    }
  }, [knowledgeBases]);

  return (
    <div className="flex min-h-screen h-[100dvh]">
      {/* 左侧会话列表 */}
      <SessionList
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId}
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
        currentSessionId={currentSessionId}
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
};

export default ChatGPT;
