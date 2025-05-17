import React, { useState, type Dispatch, type SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

import HideLeftArea from "../icons/HideLeftArea";
import HideRightArea from "../icons/HideRightArea";
import type { Agent, ChatSessionDetail } from "../types";
import ChatBot from "./ChatBot";
import ChatMessagesSkeleton from "./ChatMessagesSkeleton";

type ChatAreaProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  agentList: Agent[];
  currentAgentId: string;
  currentAgentInfo: Agent;
  setCurrentAgentId: Dispatch<SetStateAction<string>>;
  chatSessions: ChatSessionDetail[];
  currentSessionId: string;
  hasNewSession: boolean;
  setHasNewSession: Dispatch<SetStateAction<boolean>>;
  currentSessionMessages: any[];
  isLoadingMessages: boolean;
  isLoadingMessagesFinished: boolean;
  currentSelectedKbDetails: string[];
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: Dispatch<SetStateAction<boolean>>;
  handleUpdateSessionTitle: (sessionId: string, newTitle: string) => void;
};

const ChatArea: React.FC<ChatAreaProps> = React.memo(
  ({
    isSidebarOpen,
    setIsSidebarOpen,
    agentList,
    currentAgentId,
    currentAgentInfo,
    setCurrentAgentId,
    chatSessions,
    currentSessionId,
    hasNewSession,
    setHasNewSession,
    currentSessionMessages,
    isLoadingMessages,
    isLoadingMessagesFinished,
    currentSelectedKbDetails,
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    handleUpdateSessionTitle,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingTitle, setEditingTitle] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleStartEditing = () => {
      const currentTitle =
        chatSessions.find((s) => s.id === currentSessionId)?.title || "";
      setEditingTitle(currentTitle);
      setIsEditing(true);
    };

    const handleSaveEdit = () => {
      handleUpdateSessionTitle(currentSessionId, editingTitle);
      setIsEditing(false);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSaveEdit();
      } else if (e.key === "Escape") {
        handleCancelEdit();
      }
    };

    // // 发送消息。根据是否选择知识库, 自动切换检索知识库接口和普通 openai chat 接口
    // const handleSendMessage = async (messages: Message[]) => {
    //   // 如果选择了知识库，就查询知识库信息作为背景信息增强回答
    //   const kb_chunks = await Promise.all(
    //     currentSelectedKbDetails.map(async (kbName) => {
    //       try {
    //         const response = await fetch(
    //           `${import.meta.env.VITE_SERVER_HOST}/rag/searchDocuments`,
    //           {
    //             method: "POST",
    //             body: JSON.stringify({
    //               knowledgeBaseName: kbName,
    //               query: messages.at(-1)?.content || "",
    //             }),
    //           }
    //         );
    //         const result = await response.json();
    //         if (!result.success) {
    //           throw new Error(result.message);
    //         }
    //         const extra_info: string = (result.data || [])
    //           .map((item: any) => item?.metadata?.text || "")
    //           .join("\n");
    //         return extra_info;
    //       } catch (error) {
    //         console.error("🚀 ~ handleSendMessage ~ error:", error);
    //         return "";
    //       }
    //     })
    //   );
    //   const kb_chunks_text = (kb_chunks || []).filter(Boolean).join("\n");

    //   const response = await fetch(
    //     `${import.meta.env.VITE_SERVER_HOST}/openai/stream`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         messages: messages.map((msg) => ({
    //           role: msg.role,
    //           content:
    //             msg.content +
    //             (kb_chunks_text.length > 0
    //               ? `\n\n背景信息: ${kb_chunks_text}`
    //               : ""),
    //         })),
    //       }),
    //     }
    //   );

    //   if (!response.ok || !response.body) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }

    //   const reader = response.body.getReader();
    //   const decoder = new TextDecoder("utf-8");
    //   const encoder = new TextEncoder();

    //   const readableStream = new ReadableStream({
    //     async start(controller) {
    //       function push() {
    //         reader
    //           .read()
    //           .then(({ done, value }) => {
    //             if (done) {
    //               controller.close();
    //               return;
    //             }

    //             const chunk = decoder.decode(value, { stream: true });
    //             const lines = (chunk.split("\n") || []).filter(
    //               (line) => line.trim() !== ""
    //             );

    //             for (const line of lines) {
    //               try {
    //                 if (line.startsWith("data: ")) {
    //                   const jsonStr = line.replace("data: ", "");
    //                   const parsed = JSON.parse(jsonStr);
    //                   controller.enqueue(
    //                     encoder.encode(parsed.choices[0].delta.content)
    //                   );
    //                 }
    //               } catch {
    //                 console.warn("解析消息时出错:", line);
    //                 continue;
    //               }
    //             }

    //             push();
    //           })
    //           .catch((err) => {
    //             console.error("读取流中的数据时发生错误", err);
    //             controller.error(err);
    //           });
    //       }
    //       push();
    //     },
    //   });
    //   return new Response(readableStream);
    // };

    return (
      <div className="flex-1 flex flex-col relative min-w-[400px]">
        <div className="absolute top-0 left-0 right-0 bg-background z-20 border-b">
          <div className="h-16 px-1 flex items-center justify-between">
            <div className="flex items-center">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="pl-2 hover:bg-accent rounded-lg"
                >
                  <HideRightArea />
                </button>
              )}
              {/* 显示当前选中的 Session/Agent 的头像, Session 的头像优先 */}
              <img
                src={
                  chatSessions.find((s) => s.id === currentSessionId)?.avatar ||
                  currentAgentInfo.avatar
                }
                alt=""
                className="w-9 h-9 rounded-full mx-2"
              />

              {/* 显示当前选中的 agent 的名称 */}
              <div className="flex flex-col">
                <DropdownMenu onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium justify-start h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex items-center gap-1"
                    >
                      {currentAgentInfo?.name}
                      {isDropdownOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[360px]">
                    {agentList.map((agent) => (
                      <DropdownMenuItem
                        key={agent.id}
                        onSelect={() => {
                          setCurrentAgentId(agent.id);
                        }}
                        className="flex flex-col items-start cursor-pointer p-2"
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-2 flex-1 mr-4">
                            <img
                              src={
                                agent.id === currentAgentId
                                  ? chatSessions.find(
                                      (s) => s.id === currentSessionId
                                    )?.avatar || currentAgentInfo.avatar
                                  : agent.avatar
                              }
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="font-medium max-w-[calc(100%-60px)] truncate">
                              {agent.name}
                            </span>
                          </div>
                          {agent.hasMemory && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100 rounded-full whitespace-nowrap">
                              memory
                            </span>
                          )}
                        </div>
                        {agent.description && (
                          <span className="text-xs text-muted-foreground max-w-full truncate">
                            {agent.description}
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 当前选中的会话的名称 */}
                {isEditing ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyDown}
                    className="text-xs bg-transparent border-b border-primary outline-none mt-1 w-[200px]"
                    autoFocus
                  />
                ) : (
                  <span
                    className="text-xs text-muted-foreground max-w-[200px] truncate cursor-pointer hover:text-primary mt-1"
                    onClick={handleStartEditing}
                  >
                    {chatSessions.find((s) => s.id === currentSessionId)
                      ?.title || "New Session"}
                  </span>
                )}
              </div>
            </div>

            {/* 显示当前选中的知识库 */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-4">
                {currentSelectedKbDetails.slice(0, 3).map((kbName) => (
                  <div key={kbName} className="relative group">
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
                      {kbName}
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
                      {currentSelectedKbDetails.slice(3).join(", ")}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                {isRightSidebarOpen ? <HideRightArea /> : <HideLeftArea />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow pt-16 flex flex-col overflow-y-hidden">
          {isLoadingMessages ? (
            <div className="flex justify-center">
              <ChatMessagesSkeleton />
            </div>
          ) : (
            <ChatBot
              currentAgentId={currentAgentId}
              currentAgentInfo={currentAgentInfo}
              currentSessionId={currentSessionId}
              initialMessages={currentSessionMessages}
              setHasNewSession={setHasNewSession}
              isLoadingMessagesFinished={isLoadingMessagesFinished}
            />
          )}
        </div>
      </div>
    );
  }
);

export default ChatArea;
