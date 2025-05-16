import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  useRef,
} from "react";
import { Markdown } from "@lobehub/ui";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Greeting } from "../Greeting";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import ToolInvocationDisplay from "../../artifacts/Normal";
import type { ChatSessionDetail } from "../../Type";
import { getThreads } from "../../server";
import LoadingIcon from "../../icons/LoadingIcon";
import MessageStatus from "./MessageStutas";
import SuggestionList from "./SuggestionList";
import FormInput from "./FormInput";
const agentId = "dbChatAgent";
const resourceId = "dbChatAgent";

interface ChatBotProps {
  currentSessionId: string;
  initialMessages: any[];
  setChatSessions: Dispatch<SetStateAction<ChatSessionDetail[]>>;
}

const ChatBot: React.FC<ChatBotProps> = ({
  currentSessionId,
  initialMessages,
  setChatSessions,
}) => {
  const [manualStop, setManualStop] = useState(false);
  const manualStopRef = useRef(manualStop);
  useEffect(() => {
    manualStopRef.current = manualStop;
  }, [manualStop]);

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
    api: `${import.meta.env.VITE_AGENT_HOST}/api/agents/${agentId}/stream`,
    initialMessages,
    experimental_prepareRequestBody({ messages }) {
      return {
        messages: [messages.at(-1)],
        threadId: currentSessionId,
        resourceId,
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
      if (message.id !== currentSessionId) {
        const newSessionList = await getThreads(agentId, resourceId);
        setChatSessions(newSessionList);
      }
    },
  });

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (input.trim() === "") return;
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
    console.log("messages ===> ", messages);
  }, [messages]);

  return (
    <>
      <div className="flex h-0 grow flex-col overflow-y-scroll px-4">
        {/* 问候语 hi there */}
        {messages.length === 0 && <Greeting />}
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
      <SuggestionList messages={messages} append={append} />

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
