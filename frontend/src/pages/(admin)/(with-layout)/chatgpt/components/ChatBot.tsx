import { useEffect } from "react";
import Markdown from "react-markdown";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Greeting } from "./Greeting";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";

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

interface ChatBotProps {
  currentSessionId: string;
  initialMessages: any[];
}

const ChatBot: React.FC<ChatBotProps> = ({ currentSessionId, initialMessages }) => {
  const { status, messages, input, append, handleInputChange, handleSubmit } =
    useChat({
      // id: currentSessionId, // todo 保存会话信息到memory, tool 展示设立独立UI
      api: `${import.meta.env.VITE_AGENT_HOST}/api/agents/${agentId}/stream`,
      initialMessages,
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      },
    });

  useEffect(() => {
    console.log("messages ===> ", messages);
  }, [messages]);

  return (
    <>
      <div className="flex h-0 grow flex-col overflow-y-scroll">
        {messages.length === 0 && <Greeting />}
        <div className="space-y-4 py-8">
          {messages.map((message, i) => (
            <div key={i} className="mx-auto flex max-w-3xl">
              {message.role === "user" ? (
                <div className="ml-auto rounded-xl bg-gray-800 px-4 py-2 text-white">
                  <Markdown>{message.content}</Markdown>
                </div>
              ) : (
                <div className="prose">
                  {(message.toolInvocations || []).length > 0 && (
                    <div>
                      展开折叠工具
                    </div>
                  )}
                  <Markdown>{message.content}</Markdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mb-8 hidden w-full max-w-3xl grid-cols-2 gap-4 md:grid">
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
      <div className="mb-4 flex justify-center gap-2">
        <form onSubmit={handleSubmit} className="flex w-full max-w-3xl">
          <fieldset className="relative flex w-full">
            <textarea
              rows={4}
              autoFocus
              placeholder="Send a message..."
              required
              value={input}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-gray-300 bg-gray-100 p-2 pr-12 outline-black"
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
              className="absolute bottom-2 right-2 rounded-full p-2 text-black hover:bg-gray-100 disabled:opacity-50"
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
