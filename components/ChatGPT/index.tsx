import React, { useState, useMemo } from "react";
import { knowledgeBase } from "./config";
import { ProChat } from "@ant-design/pro-chat";

// 添加消息类型定义
interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

const ChatGPT = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 添加消息列表状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  // 基于搜索词过滤知识库列表
  const filteredList = useMemo(() => {
    return knowledgeBase.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

  return (
    <div className="flex h-screen">
      {/* 左侧边栏 */}
      <div
        className={`${
          isSidebarOpen ? "w-80 border-x" : "w-0 border-r"
        } flex-shrink-0 transition-all duration-300 relative group`}
      >
        <div
          className={`${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          } absolute inset-0 bg-white dark:bg-gray-800 flex flex-col`}
        >
          {/* 固定的搜索框 */}
          <div className="p-4 border-b sticky top-0 bg-white dark:bg-gray-800 z-10 h-16 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索..."
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 
                focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                hover:border-violet-500/50 transition-colors duration-150"
            />
          </div>

          {/* 可滚动的知识库列表 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-4 py-2">
              <div className="space-y-2">
                {filteredList.map((item) => (
                  <div
                    key={item.title}
                    className={`flex gap-3 p-3 rounded-xl cursor-pointer ${
                      selectedUsers.includes(item.title)
                        ? "bg-violet-50 dark:bg-violet-500/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => {
                      setSelectedUsers((prev) =>
                        prev.includes(item.title)
                          ? prev.filter((user) => user !== item.title)
                          : [...prev, item.title]
                      );
                    }}
                  >
                    <img
                      src={item.avatar}
                      alt={item.title}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 切换侧边栏的按钮 */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute -right-4 top-[40%] transform -translate-y-1/2 bg-gray-100 dark:bg-gray-800 
            border h-11 w-4 hover:bg-gray-200 dark:hover:bg-gray-700 z-50 flex items-center justify-center
            rounded-r-md
            ${
              isSidebarOpen
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-100"
            }
            transition-opacity duration-200`}
        >
          <svg
            className={`w-8 h-8 text-gray-500 transform transition-transform duration-300 ${
              isSidebarOpen ? "rotate-0" : "rotate-180"
            }`}
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

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* 添加头部 */}
        <div className="h-16 p-4 border-b dark:border-gray-700 flex items-center">
          {selectedUsers.length > 0 ? (
            <div className="flex space-x-1">
              {selectedUsers.map((user) => {
                const userInfo = knowledgeBase.find(
                  (item) => item.title === user
                );
                return (
                  <div key={user} className="relative group">
                    <img
                      src={userInfo?.avatar}
                      alt={user}
                      onClick={() => {
                        // 这里添加跳转到具体知识库的逻辑
                        console.log(`Navigate to ${user}'s knowledge base`);
                      }}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 
                        cursor-pointer transition-transform hover:scale-110 
                        hover:border-violet-500 hover:shadow-lg"
                    />
                    {/* 悬浮提示 */}
                    <div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      whitespace-nowrap bg-gray-800 text-white text-sm py-1 px-2 rounded"
                    >
                      {userInfo?.title}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <h2 className="font-medium text-gray-900 dark:text-white">
              请选择知识库
            </h2>
          )}
        </div>

        {/* 聊天记录 */}
        <ProChat
          helloMessage={
            "欢迎使用 ProChat ，我是你的专属机器人，这是我们的 Github：[ProChat](https://github.com/ant-design/pro-chat)"
          }
          request={
            (async (messages): Promise<Response> => {
              const mockedData: string = `这是一段模拟的对话数据。本次会话传入了${messages.length}条消息`;
              return new Response(mockedData);
            }) as any
          }
          styles={{
            chatSendButton: {
              backgroundColor: "rgb(139, 92, 246)",
              color: "#fff",
            },
          }}
          // request={async (messages) => {
          //   const mockedData: string = `这是一段模拟的对话数据。本次会话传入了${messages.length}条消息`;
          //   return new Response(mockedData);
          // }}
        />
      </div>
    </div>
  );
};

export default ChatGPT;
