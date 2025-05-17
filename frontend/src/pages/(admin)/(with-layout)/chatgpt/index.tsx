import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useMemo, useState } from "react";

import ChatArea from "./components/ChatArea";
import KnowledgeBaseList from "./components/KnowledgeBaseList";
import SessionList from "./components/SessionList";
import {
  deleteThread,
  getAgentInfoList,
  getThreadMessages,
  getThreads,
  updateThreadTitle,
} from "./server";
import type { Agent, ChatSessionDetail } from "./types";
import { toast } from "sonner";

export interface KnowledgeBase {
  id: number;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const resourceId = "dbChatAgent";

export function Component() {
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isLoaded, isSignedIn } = useUser();
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingMessagesFinished, setIsLoadingMessagesFinished] =
    useState(false);

  const [agentList, setAgentList] = useState<Agent[]>([]); // 所有 agent 的信息列表
  const [currentAgentId, setCurrentAgentId] = useState(""); // 当前选中的 agent id
  const [currentAgentInfo, setCurrentAgentInfo] = useState<Agent>({} as Agent);

  // 添加会话列表状态
  const [chatSessions, setChatSessions] = useState<ChatSessionDetail[]>([]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // 添加当前选中会话状态
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  // 是否刚刚新建会话, 新建完对话需要重新查询最新的 chatSessions, 并将 currentSessionId 设置为第一条会话的 id
  const [hasNewSession, setHasNewSession] = useState(false);

  // 获取当前 thread 的 messages
  const [currentSessionMessages, setCurrentSessionMessages] = useState<any[]>(
    [] // 类型其实是 UIMessage[], 但是 sdk 没有将这个类型导出
  );
  // 用于触发每次新建会话后 ChatArea 的重新渲染
  const [chatAreaVersion, setChatAreaVersion] = useState(0);

  // 获取当前会话的选中知识库
  const currentSelectedKbs = useMemo(() => {
    return (
      chatSessions.find((s) => s.id === currentSessionId)?.selectedKbs || []
    );
  }, [chatSessions, currentSessionId]);

  // 加载新的会话列表
  const loadNewSessionList = async (curAgentId: string) => {
    const newSessionList = await getThreads(curAgentId, resourceId);
    setChatSessions(newSessionList);
    setCurrentSessionId(newSessionList[0]!.id);
    setIsLoadingSessions(false);
  };

  // 由新会话从 useChat 的 onFinish 触发, 所以需要在这里加载新的会话列表
  useEffect(() => {
    if (hasNewSession && currentAgentInfo?.hasMemory) {
      loadNewSessionList(currentAgentId);
    }
  }, [hasNewSession]);

  // 切换 agent, 加载新的会话列表
  useEffect(() => {
    if (currentAgentId) {
      const currentAgentInfo = agentList.find(
        (agent) => agent.id === currentAgentId
      ) || {
        name: "Select An Agent",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=41",
        hasMemory: false,
      };
      setCurrentAgentInfo(currentAgentInfo as Agent);

      if (currentAgentInfo.hasMemory) {
        setIsLoadingSessions(true);
        setIsLoadingMessages(true);
        loadNewSessionList(currentAgentId);
      } else {
        setChatSessions([]);
        setCurrentSessionId(null);
      }
    }
  }, [currentAgentId]);

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
      currentAgentId,
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
    // 创建新会话由 mastra memory 自动完成, 这里不需要手动调接口创建, 手动调接口无法让大模型自己决定标题
    // const newSession = await createThread(currentAgentId, resourceId);
    // setChatSessions((prev) => [newSession, ...prev]);
    // setCurrentSessionId(newSession.id);

    // 所以新建会话就相当于：取消选中的当前会话，并且将聊天消息清空。 将 hasNewSession 设置为 false, 它会由 useChat 的 onFinish 修改为 true
    setCurrentSessionId(null);
    setCurrentSessionMessages([]);
    setChatAreaVersion((prev) => prev + 1);
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

    const { success, message } = await deleteThread(currentAgentId, sessionId);
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

  // 获取所有 agent 列表, 并且默认选中第一个 agent 的第一个会话
  useEffect(() => {
    const loadInitialSessions = async () => {
      if (isLoaded && isSignedIn) {
        setIsLoadingSessions(true);
        // 获取所有 agent 列表后保存到 agentList 中
        const agentsInfoList = await getAgentInfoList();
        if (agentsInfoList.length === 0) {
          toast.error("No agent found");
          setIsLoadingSessions(false);
          return;
        }
        setAgentList(agentsInfoList);

        // 过滤所有开启了记忆的 agent 列表
        const memoryAgentList = agentsInfoList.filter(
          (agent) => agent.hasMemory
        );
        if (memoryAgentList.length === 0) {
          toast.error("No memory agent found");
          setIsLoadingSessions(false);
          return;
        }
        setCurrentAgentId(memoryAgentList[0]!.id);

        // 获取第一个开启了记忆的 agent 的会话列表, 并将其第一个会话设置为默认会话
        const newSessionList = await getThreads(
          memoryAgentList[0]!.id,
          resourceId
        );
        if (newSessionList.length > 0) {
          setChatSessions(newSessionList);
          setCurrentSessionId(newSessionList[0]!.id);
        } else {
          handleCreateNewChat();
        }
        setIsLoadingSessions(false);
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

  // 获取当前会话的 messages
  useEffect(() => {
    console.log("currentSessionId ===>", currentSessionId);
    if (currentSessionId && hasNewSession) {
      setHasNewSession(false);
      return;
    }

    if (currentSessionId) {
      const loadMessages = async () => {
        setIsLoadingMessages(true);
        setIsLoadingMessagesFinished(false);
        const messages = await getThreadMessages(
          currentAgentId,
          currentSessionId
        );
        setCurrentSessionMessages(messages);
        setIsLoadingMessages(false);
        setIsLoadingMessagesFinished(true);
      };
      loadMessages();
    } else {
      setCurrentSessionMessages([]);
      setIsLoadingMessages(false);
      setIsLoadingMessagesFinished(true);
    }
  }, [currentSessionId]);

  const initialDataLoading = !isLoaded || isLoadingSessions;

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* 左侧会话列表 */}
      <SessionList
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        agentHasMemory={currentAgentInfo?.hasMemory!}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId ?? ""}
        handleCreateNewChat={handleCreateNewChat}
        handleSessionClick={handleSessionClick}
        handleDeleteSession={handleDeleteSession}
        handleUpdateSessionTitle={handleUpdateSessionTitle}
        isLoading={initialDataLoading}
      />

      {/* 中间聊天区域 */}
      <ChatArea
        key={chatAreaVersion}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        agentList={agentList}
        currentAgentId={currentAgentId}
        currentAgentInfo={currentAgentInfo!}
        setCurrentAgentId={setCurrentAgentId}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId ?? ""}
        hasNewSession={hasNewSession}
        setHasNewSession={setHasNewSession}
        currentSessionMessages={currentSessionMessages}
        isLoadingMessages={isLoadingMessages}
        isLoadingMessagesFinished={isLoadingMessagesFinished}
        currentSelectedKbDetails={currentSelectedKbDetails}
        isRightSidebarOpen={isRightSidebarOpen}
        setIsRightSidebarOpen={setIsRightSidebarOpen}
        handleUpdateSessionTitle={handleUpdateSessionTitle}
      />

      {/* 右侧知识库列表 */}
      <KnowledgeBaseList
        knowledgeBases={knowledgeBases}
        currentSelectedKbs={currentSelectedKbs}
        handleKbSelection={handleKbSelection}
        isRightSidebarOpen={isRightSidebarOpen}
        setIsRightSidebarOpen={setIsRightSidebarOpen}
        isLoading={initialDataLoading}
      />
    </div>
  );
}
