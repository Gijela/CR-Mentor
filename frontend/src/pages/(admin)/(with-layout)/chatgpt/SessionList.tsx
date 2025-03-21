import React, { useMemo, useState } from "react";
import { ChatSessionDetail } from "./index";
import { SidebarTrigger } from "@/components/ui/sidebar";

const SessionList: React.FC<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  chatSessions: ChatSessionDetail[];
  currentSessionId: string;
  handleCreateNewChat: () => void;
  handleSessionClick: (sessionId: string) => void;
  handleDeleteSession: (sessionId: string, e: React.MouseEvent) => void;
  handleUpdateSessionTitle: (sessionId: string, newTitle: string) => void;
}> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  chatSessions,
  currentSessionId,
  handleCreateNewChat,
  handleSessionClick,
  handleDeleteSession,
  handleUpdateSessionTitle,
}) => {
  // 添加会话搜索状态
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  // 添加编辑状态管理
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // 过滤会话列表
  const filteredChatSessions = useMemo(() => {
    return (chatSessions || []).filter((session) =>
      session.title.toLowerCase().includes(chatSearchQuery.toLowerCase())
    );
  }, [chatSessions, chatSearchQuery]);

  // 添加编辑相关的处理函数
  const handleTitleDoubleClick = (session: ChatSessionDetail) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editingSessionId) {
      handleUpdateSessionTitle(editingSessionId, editingTitle);
      setEditingSessionId(null);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setEditingSessionId(null);
    }
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-[288px] border-x" : "w-0 border-r"
      } flex-shrink-0 transition-all duration-300 relative group`}
    >
      <div
        className={`${
          isSidebarOpen ? "opacity-100" : "opacity-0"
        } absolute inset-0 bg-background flex flex-col`}
      >
        {/* 左侧头部 - LobeChat 标题和新建按钮 */}
        <div className="sticky top-0 bg-background z-10 p-4 space-y-4">
          <div className="flex justify-between items-center h-8">
            {/* <h1 className="text-2xl font-bold">Chat To KBs</h1> */}
            <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" />
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
              placeholder="Search session..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border 
                  focus:outline-none focus:border-primary
                  hover:border-primary transition-colors duration-200"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    }
                    transition-colors duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
                      <img
                        src={session.avatar}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* 可编辑的标题 */}
                    {editingSessionId === session.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        className={`flex-1 bg-transparent border-b border-primary outline-none
                          font-medium ${
                            currentSessionId === session.id
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3
                        onDoubleClick={() => handleTitleDoubleClick(session)}
                        className={`font-medium truncate flex-1 ${
                          currentSessionId === session.id
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {session.title}
                      </h3>
                    )}
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent 
                        rounded transition-opacity duration-200"
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
        className={`absolute -right-4 top-[40%] transform -translate-y-1/2 bg-accent 
            border h-11 w-4 hover:bg-accent/80
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
  );
};

export default SessionList;
