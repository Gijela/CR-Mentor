import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  useRef,
} from "react";
import { Markdown } from "@lobehub/ui";
import { Greeting } from "./Greeting";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import ToolInvocationDisplay from "../../artifacts/Normal";
import MessageStatus from "./MessageStutas";
import SuggestionList from "./SuggestionList";
import FormInput from "./FormInput";
import type { Agent } from "../../types";
import { useUser } from "@clerk/clerk-react";

interface ChatBotProps {
  currentAgentId: string;
  currentAgentInfo: Agent;
  currentSessionId: string;
  initialMessages: any[];
  setHasNewSession: Dispatch<SetStateAction<boolean>>;
  isLoadingMessagesFinished: boolean;
}

const ChatBot: React.FC<ChatBotProps> = ({
  currentAgentId,
  currentAgentInfo,
  currentSessionId,
  initialMessages,
  setHasNewSession,
  isLoadingMessagesFinished,
}) => {
  const [manualStop, setManualStop] = useState(false);
  const manualStopRef = useRef(manualStop);
  const { user } = useUser();

  useEffect(() => {
    manualStopRef.current = manualStop;
  }, [manualStop]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingUpRef = useRef<boolean>(false);

  const {
    status,
    messages,
    input,
    append,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    stop,
    setMessages,
  } = useChat({
    api: `${
      import.meta.env.VITE_AGENT_HOST
    }/api/agents/${currentAgentId}/stream`,
    initialMessages,
    experimental_prepareRequestBody({ messages }) {
      // 携带上开发者id
      const addExtraContent =
        messages.at(-1)?.content +
        `
        <extra_content>
          <developer_id>${user?.username || currentAgentId}</developer_id>
        </extra_content>
      `;

      return {
        messages: [
          {
            ...messages.at(-1),
            content: addExtraContent,
            parts: [
              {
                type: "text",
                text: addExtraContent,
              },
            ],
          },
        ],
        threadId: currentSessionId,
        resourceId: user?.username || currentAgentId,
      };
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
      setManualStop(false);
    },
    onToolCall: (toolCall) => {
      console.log("toolCall ===> ", toolCall);
    },
    onFinish: async (message) => {
      console.log("finish message ===> ", message);
      console.log("messages length ===> ", messages.length);
      // 如果当前没有会话 id 则认为是新会话, 刷新一下 sessionList, 第二轮对话结束也刷新一次
      if (!currentSessionId) {
        setHasNewSession(true);
        return;
      }
      if (manualStopRef.current) {
        setMessages((prevMessages) =>
          prevMessages.map((m, index) =>
            index === prevMessages.length - 1 && m.role === "assistant"
              ? { ...m, content: m.content + "\n\n手动停止" }
              : m
          )
        );
        setManualStop(false);
      }
    },
  });

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (input.trim() === "") return;
    isUserScrollingUpRef.current = false; // Reset scroll lock for next response
    setManualStop(false);
    originalHandleSubmit(e);
  };

  const [expandedToolCalls, setExpandedToolCalls] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleToolCallExpansion = (messageIndex: number, toolIndex: number) => {
    const key = `${messageIndex}-${toolIndex}`;
    setExpandedToolCalls((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (chatContainerRef.current && !isUserScrollingUpRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      // A threshold of 10px to consider "not at bottom"
      if (scrollTop + clientHeight < scrollHeight - 10) {
        isUserScrollingUpRef.current = true;
      } else {
        isUserScrollingUpRef.current = false;
      }
    }
  };

  return (
    <>
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex h-0 grow flex-col overflow-y-scroll px-4"
      >
        {/* 问候语 hi there */}
        {isLoadingMessagesFinished && messages.length === 0 && <Greeting />}
        {/* 聊天消息 */}
        <div className="space-y-4 py-8">
          {messages.map((message: any, i: number) => (
            <div key={i} className="mx-auto flex max-w-3xl">
              {message.role === "user" ? (
                <div className="ml-auto rounded-xl bg-gray-800 px-4 py-2 text-white">
                  <Markdown variant={"chat"}>{message.content}</Markdown>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {message.role === "assistant" &&
                    message.toolInvocations &&
                    message.toolInvocations.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {message.toolInvocations.map(
                          (invocation: any, toolIndex: number) => {
                            const toolCallKey = `${i}-${toolIndex}`;
                            const isExpanded = !!expandedToolCalls[toolCallKey];
                            return (
                              <ToolInvocationDisplay
                                key={toolCallKey}
                                invocation={invocation}
                                isExpanded={isExpanded}
                                onToggleExpand={() =>
                                  toggleToolCallExpansion(i, toolIndex)
                                }
                              />
                            );
                          }
                        )}
                      </div>
                    )}
                  <Markdown variant={"chat"}>{message.content}</Markdown>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* 思考中 */}
        <MessageStatus status={status} messages={messages} />
      </div>

      {/* 快捷问题 */}
      <SuggestionList
        messages={messages}
        suggestions={currentAgentInfo.suggestions}
        append={append}
      />

      {/* 输入框 */}
      <FormInput
        status={status}
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        setManualStop={setManualStop}
        stop={stop}
      />
    </>
  );
};

export default ChatBot;
