import React, { useState, useMemo, useEffect } from "react";
import { ProChat } from "@ant-design/pro-chat";
import HideRightArea from "./icons/HideRightArea";
import HideLeftArea from "./icons/HideLeftArea";
import {
  clientUserId,
  getKnowledgeBases,
  KnowledgeBase,
} from "../KnowledgeBase";

// 添加消息类型定义
interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

// 添加会话详情类型定义
interface ChatSessionDetail {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  selectedKbs: string[]; // 该会话选中的知识库
  messages: Message[]; // 该会话的聊天记录
  avatar: string; // 添加头像字段
}

const ChatGPT = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 添加消息列表状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  // 添加会话列表状态
  const [chatSessions, setChatSessions] = useState<ChatSessionDetail[]>([
    {
      id: "1",
      title: "新会话",
      lastMessage: "上次对话内容...",
      timestamp: new Date(),
      selectedKbs: [],
      messages: [],
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=1", // 添加默认头像
    },
  ]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // 添加会话搜索状态
  const [chatSearchQuery, setChatSearchQuery] = useState("");

  // 添加当前选中会话状态
  const [currentSessionId, setCurrentSessionId] = useState<string>("1");

  // 基于搜索词过滤知识库列表
  const filteredList = useMemo(() => {
    return knowledgeBases.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, knowledgeBases]);

  // 过滤会话列表
  const filteredChatSessions = useMemo(() => {
    return chatSessions.filter((session) =>
      session.title.toLowerCase().includes(chatSearchQuery.toLowerCase())
    );
  }, [chatSessions, chatSearchQuery]);

  // 添加发送消息的处理函数
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
  };

  const [isSearching, setIsSearching] = useState(false);

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
            ? session.selectedKbs.filter((kb) => kb !== kbTitle)
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

  // 添加创建新会话的处理函数
  const handleCreateNewChat = () => {
    const newSession: ChatSessionDetail = {
      id: Date.now().toString(),
      title: `新会话 ${chatSessions.length + 1}`,
      timestamp: new Date(),
      selectedKbs: [],
      messages: [],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  // 添加消息处理函数
  const handleNewMessage = (message: Message) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, message],
            lastMessage: message.content,
          };
        }
        return session;
      })
    );
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
    return knowledgeBases.filter((kb) => selectedKbs.includes(kb.title));
  }, [chatSessions, currentSessionId]);

  // 添加删除会话的处理函数
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发会话选择

    // 如果删除的是当前选中的会话，需要选择新的当前会话
    if (sessionId === currentSessionId) {
      const remainingSessions = chatSessions.filter((s) => s.id !== sessionId);
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
    console.log("🚀 ~ handleGetKnowledgeBases ~ data:", data);
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
      <div
        className={`${
          isSidebarOpen ? "w-[288px] border-x" : "w-0 border-r"
        } flex-shrink-0 transition-all duration-300 relative group`}
      >
        <div
          className={`${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          } absolute inset-0 bg-white dark:bg-gray-800 flex flex-col`}
        >
          {/* 左侧头部 - LobeChat 标题和新建按钮 */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 space-y-4">
            <div className="flex justify-between items-center h-8">
              <h1 className="text-2xl font-bold">Chat To KBs</h1>
              <button
                onClick={handleCreateNewChat}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg -mr-2 pt-[0.7rem]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <path d="M12 7v6"></path>
                  <path d="M9 10h6"></path>
                </svg>
              </button>
            </div>
            {/* 搜索框 */}
            <div className="relative">
              <input
                type="text"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                placeholder="搜索会话..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 
                  focus:outline-none focus:border-violet-500
                  hover:border-violet-500 transition-colors duration-200
                  dark:focus:border-violet-500
                  dark:hover:border-violet-500"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* 会话列表 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-4 py-2 space-y-2">
              {filteredChatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session.id)}
                  className={`flex flex-col p-3 rounded-xl cursor-pointer group
                    ${
                      currentSessionId === session.id
                        ? "bg-violet-50 dark:bg-violet-500/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }
                    transition-colors duration-200`}
                >
                  <div className="flex justify-between items-start">
                    {/* 添加头像和标题容器 */}
                    <div className="flex items-center gap-3">
                      {/* 修改会话头像样式 - 从 w-10 h-10 改为 w-8 h-8 */}
                      <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
                        <img
                          src={session.avatar}
                          alt={session.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 标题和最后消息 */}
                      <div className="flex flex-col min-w-0">
                        <h3
                          className={`font-medium ${
                            currentSessionId === session.id
                              ? "text-violet-600 dark:text-violet-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {session.title}
                        </h3>
                        {session.lastMessage && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {session.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 删除按钮 */}
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 
                        dark:hover:bg-gray-600 rounded transition-opacity duration-200"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 左侧切换按钮 */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute -right-4 top-[40%] transform -translate-y-1/2 bg-gray-100 
            dark:bg-gray-800 border h-11 w-4 hover:bg-gray-200 dark:hover:bg-gray-700 
            z-50 flex items-center justify-center rounded-r-md
            ${
              isSidebarOpen
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-100"
            }
            transition-opacity duration-200`}
        >
          <svg
            className={`w-8 h-8 text-gray-500 transform transition-transform duration-300 
              ${isSidebarOpen ? "rotate-0" : "rotate-180"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 7L8 12L14 17"
            />
          </svg>
        </button>
      </div>

      {/* 中间聊天区域 */}
      <div className="flex-1 flex flex-col relative min-w-[400px]">
        {/* 聊天区域头部 - 横穿到右边屏幕边缘 */}
        <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 z-20 border-b">
          <div className="h-16 px-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {isSidebarOpen ? <HideLeftArea /> : <HideRightArea />}
              </button>

              <img
                src={
                  chatSessions.find((s) => s.id === currentSessionId)?.avatar ||
                  "https://api.dicebear.com/7.x/bottts/svg?seed=default"
                }
                alt="assistant avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-medium">
                  {chatSessions.find((s) => s.id === currentSessionId)?.title ||
                    "随便聊聊"}
                </span>
                <span className="text-xs text-gray-500">@gpt-4o-mini</span>
              </div>
            </div>

            {/* 恢复知识库头像显示 */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-4">
                {currentSelectedKbDetails.slice(0, 3).map((kb) => (
                  <div key={kb.title} className="relative group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgb(245,248,255)] border-2 border-white dark:border-gray-800">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 5C3 3.89543 3.89543 3 5 3H9.58579C9.851 3 10.1054 3.10536 10.2929 3.29289L12 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                          stroke="rgba(99, 0, 255, 0.87)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {kb.title}
                    </div>
                  </div>
                ))}
                {currentSelectedKbDetails.length > 3 && (
                  <div className="relative group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        +{currentSelectedKbDetails.length - 3}
                      </span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentSelectedKbDetails
                        .slice(3)
                        .map((kb) => kb.title)
                        .join(", ")}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {isRightSidebarOpen ? <HideRightArea /> : <HideLeftArea />}
              </button>
            </div>
          </div>
        </div>

        {/* ProChat 聊天记录部分 */}
        <div className="flex-1 mt-16 min-w-0">
          <ProChat
            key={currentSessionId}
            helloMessage={
              "欢迎用 ProChat，我是你的专属机器人，这是我们的 Github：[ProChat](https://github.com/ant-design/pro-chat)"
            }
            request={async (messages) => {
              // 获取当前会话的消息和选中的知识库
              const currentSession = chatSessions.find(
                (s) => s.id === currentSessionId
              );
              const selectedKbs = currentSession?.selectedKbs || [];

              // 这里可以根据选中的知识库来处理请求
              const mockedData: string = `这是会话 ${currentSessionId} 的对数据。
                已选择的知识库: ${selectedKbs.join(", ")}
                本次会话传入了 ${messages.length} 条消息`;

              // 保存新消息
              const newMessage: Message = {
                id: Date.now().toString(),
                content: mockedData,
                sender: "assistant",
                timestamp: new Date(),
              };
              handleNewMessage(newMessage);

              return new Response(mockedData);
            }}
            styles={{
              chatSendButton: {
                backgroundColor: "rgb(139, 92, 246)",
                color: "#fff",
              },
            }}
          />
        </div>
      </div>

      {/* 右侧知识库列表 */}
      <div
        className={`${
          isRightSidebarOpen ? "w-[288px] border-x" : "w-0 border-l"
        } flex-shrink-0 transition-all duration-300 relative group`}
      >
        {/* 左侧切换按钮 */}
        <button
          onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          className={`absolute -left-4 top-[40%] transform -translate-y-1/2 bg-gray-100 
            dark:bg-gray-800 border h-11 w-4 hover:bg-gray-200 dark:hover:bg-gray-700 
            z-50 flex items-center justify-center rounded-l-md
            ${
              isRightSidebarOpen
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-100"
            }
            transition-opacity duration-200`}
        >
          <svg
            className={`w-8 h-8 text-gray-500 transform transition-transform duration-300 
              ${isRightSidebarOpen ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 7L8 12L14 17"
            />
          </svg>
        </button>

        <div
          className={`${
            isRightSidebarOpen ? "opacity-100" : "opacity-0"
          } bg-white dark:bg-gray-800 flex flex-col h-full relative`}
        >
          {/* 右侧头部 */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div className="h-16 px-4 flex items-center justify-between">
              <span className="text-base font-medium">知识库</span>
              <div className="flex items-center gap-2">
                {/* 搜索按钮 - 点击时显示搜索输入框 */}
                {isSearching ? (
                  <div className="flex items-center gap-2 absolute inset-x-0 top-0 h-full bg-white dark:bg-gray-800 px-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索知识库..."
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                      autoFocus
                      onBlur={() => setIsSearching(false)}
                    />
                    <button
                      onClick={() => setIsSearching(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearching(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 知识库列表 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-3 py-2">
              <div className="space-y-1">
                {filteredList.map((item) => (
                  <div
                    key={item.title}
                    className={`p-2 rounded-lg cursor-pointer flex items-center gap-3 ${
                      currentSelectedKbs.includes(item.title)
                        ? "bg-violet-50 dark:bg-violet-500/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => handleKbSelection(item.title)}
                  >
                    {/* 头像 */}
                    <div
                      className={`flex-shrink-0 rounded-full ${
                        currentSelectedKbs.includes(item.title)
                          ? "bg-[rgb(245,248,255)]"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <div className={`flex items-center justify-center`}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3 5C3 3.89543 3.89543 3 5 3H9.58579C9.851 3 10.1054 3.10536 10.2929 3.29289L12 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                              stroke={
                                currentSelectedKbs.includes(item.title)
                                  ? "rgba(99, 0, 255, 0.87)"
                                  : "currentColor"
                              }
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* 文本内容 */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPT;
