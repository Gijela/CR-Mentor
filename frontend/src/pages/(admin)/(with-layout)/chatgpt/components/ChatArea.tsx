import type { Message } from "@ant-design/pro-chat";
import { ProChat } from "@ant-design/pro-chat";
import React, { useState } from "react";

import HideLeftArea from "../icons/HideLeftArea";
import HideRightArea from "../icons/HideRightArea";
import type { ChatSessionDetail } from "../Type";
import ChatBot from "./ChatBot";

const ChatArea: React.FC<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  chatSessions: ChatSessionDetail[];
  currentSessionId: string;
  currentSessionMessages: any[];
  currentSelectedKbDetails: string[];
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: (value: boolean) => void;
  handleUpdateSessionTitle: (sessionId: string, newTitle: string) => void;
}> = React.memo(
  ({
    isSidebarOpen,
    setIsSidebarOpen,
    chatSessions,
    currentSessionId,
    currentSessionMessages,
    currentSelectedKbDetails,
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    handleUpdateSessionTitle,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingTitle, setEditingTitle] = useState("");

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

    // 发送消息。根据是否选择知识库, 自动切换检索知识库接口和普通 openai chat 接口
    const handleSendMessage = async (messages: Message[]) => {
      // 如果选择了知识库，就查询知识库信息作为背景信息增强回答
      const kb_chunks = await Promise.all(
        currentSelectedKbDetails.map(async (kbName) => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_SERVER_HOST}/rag/searchDocuments`,
              {
                method: "POST",
                body: JSON.stringify({
                  knowledgeBaseName: kbName,
                  query: messages.at(-1)?.content || "",
                }),
              }
            );
            const result = await response.json();
            if (!result.success) {
              throw new Error(result.message);
            }
            const extra_info: string = (result.data || [])
              .map((item: any) => item?.metadata?.text || "")
              .join("\n");
            return extra_info;
          } catch (error) {
            console.error("🚀 ~ handleSendMessage ~ error:", error);
            return "";
          }
        })
      );
      const kb_chunks_text = (kb_chunks || []).filter(Boolean).join("\n");

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_HOST}/openai/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messages.map((msg) => ({
              role: msg.role,
              content:
                msg.content +
                (kb_chunks_text.length > 0
                  ? `\n\n背景信息: ${kb_chunks_text}`
                  : ""),
            })),
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          function push() {
            reader
              .read()
              .then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }

                const chunk = decoder.decode(value, { stream: true });
                const lines = (chunk.split("\n") || []).filter(
                  (line) => line.trim() !== ""
                );

                for (const line of lines) {
                  try {
                    if (line.startsWith("data: ")) {
                      const jsonStr = line.replace("data: ", "");
                      const parsed = JSON.parse(jsonStr);
                      controller.enqueue(
                        encoder.encode(parsed.choices[0].delta.content)
                      );
                    }
                  } catch {
                    console.warn("解析消息时出错:", line);
                    continue;
                  }
                }

                push();
              })
              .catch((err) => {
                console.error("读取流中的数据时发生错误", err);
                controller.error(err);
              });
          }
          push();
        },
      });
      return new Response(readableStream);
    };

    return (
      <div className="flex-1 flex flex-col relative min-w-[400px]">
        <div className="absolute top-0 left-0 right-0 bg-background z-20 border-b">
          <div className="h-16 px-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-accent rounded-lg"
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
                {isEditing ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyDown}
                    className="font-medium bg-transparent border-b border-primary outline-none"
                    autoFocus
                  />
                ) : (
                  <span
                    className="font-medium cursor-pointer hover:text-primary"
                    onClick={handleStartEditing}
                  >
                    {chatSessions.find((s) => s.id === currentSessionId)
                      ?.title || "随便聊聊"}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  @gpt-4o-mini
                </span>
              </div>
            </div>

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

        <div className="flex-1 mt-16 min-w-0 overflow-hidden">
          {/* {chatSessions.map((session) => ( */}
            <div
              key={currentSessionId}
              className={'h-full flex grow flex-col block'}
            >
              <ChatBot currentSessionId={currentSessionId} initialMessages={currentSessionMessages} />
              {/* <ProChat
                key="chat-area"
                sendMessageRequest={handleSendMessage}
                styles={{
                  chatListItemContent: {
                    width: "fit-content",
                    backgroundColor: "hsl(var(--accent))",
                  },
                  chatSendButton: {
                    color: "hsl(var(--primary-foreground))",
                    backgroundColor: "hsl(var(--primary))",
                  },
                  chatInputArea: {
                    height: "160px",
                    borderTop: "1px solid hsl(var(--border))",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  },
                  chatInputAction: {
                    display: "none",
                  },
                }}
                helloMessage="Hello, how can I assist you today?"
                placeholder="Type a message..."
              /> */}
            </div>
          {/* ))} */}
        </div>
      </div>
    );
  }
);

export default ChatArea;
