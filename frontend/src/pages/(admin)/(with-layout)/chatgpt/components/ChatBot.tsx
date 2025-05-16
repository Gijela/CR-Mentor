import { useEffect, useState } from "react";
import { Markdown } from "@lobehub/ui";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Greeting } from "./Greeting";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import ToolInvocationDisplay from "../artifacts/Normal";

const suggestions = [
  {
    title: "developer_id: 'test_id2' ",
    subtitle: "这个人怎么样",
  },
  {
    title: "I want to build a voice agent",
    subtitle: "that my customers can call for support",
  },
  {
    title: "How do I build a workflow that can summarize",
    subtitle: "my emails and send me a daily digest?",
  },
  {
    title: "How do I build an open source Perplexity",
    subtitle: "clone with a search API?",
  },
];

const agentId = "dbChatAgent";
const resourceId = "dbChatAgent";
interface ChatBotProps {
  currentSessionId: string;
  initialMessages: any[];
}

const ChatBot: React.FC<ChatBotProps> = ({
  currentSessionId,
  initialMessages,
}) => {
  const { status, messages, input, append, handleInputChange, handleSubmit } =
    useChat({
      api: `${import.meta.env.VITE_AGENT_HOST}/api/agents/${agentId}/stream`,
      initialMessages,
      // 传入 threadId、resourceId，如果agent开启了 memory，则会自动保存聊天记录
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
      },
      onToolCall: (toolCall) => {
        console.log("toolCall ===> ", toolCall);
      },
      onFinish: (message) => {
        console.log("finish message ===> ", message);
      },
    });

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
        {messages.length === 0 && <Greeting />}
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
      </div>

      <div className="mx-auto mb-4 hidden w-full max-w-3xl grid-cols-2 gap-4 md:grid px-4">
        {messages.length === 0 &&
          suggestions.map((suggestion, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              className="rounded-xl border p-4 text-left hover:bg-gray-50"
              onClick={() =>
                append({
                  role: "user",
                  content: suggestion.title + " " + suggestion.subtitle,
                })
              }
            >
              <div className="font-medium">{suggestion.title}</div>
              <div className="text-gray-600">{suggestion.subtitle}</div>
            </motion.button>
          ))}
      </div>

      {/* 输入框 */}
      <div className="mb-4 flex justify-center gap-2 px-4">
        <form onSubmit={handleSubmit} className="flex w-full max-w-3xl">
          <fieldset className="relative flex w-full">
            <textarea
              rows={4}
              autoFocus
              placeholder="Send a message..."
              required
              value={input}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 bg-gray-100 p-2 pr-12 outline-black dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              type="submit"
              disabled={status !== "ready"}
              className="absolute bottom-2 right-2 rounded-full p-2 text-black hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
