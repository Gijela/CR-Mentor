import { type ChangeEvent } from "react";
// import Together from "together-ai";
// import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";
import Markdown from "react-markdown";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Greeting } from "./Greeting";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";

const suggestions = [
  {
    title: "How can I build an app that parses PDFs",
    subtitle: "and can extract key things from them?",
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

const ChatBot = () => {
  const { status, messages, input, handleInputChange, handleSubmit } = useChat({
    api: `${import.meta.env.VITE_AGENT_HOST}/api/agents/${agentId}/stream`,
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });

  return (
    <>
      <div className="flex h-0 grow flex-col overflow-y-scroll">
        {messages.length === 0 && <Greeting />}
        <div className="space-y-4 py-8">
          {messages.map((message, i) => (
            <div key={i} className="mx-auto flex max-w-3xl">
              {message.role === "user" ? (
                <div className="ml-auto rounded-full bg-gray-800 px-4 py-2 text-white">
                  <Markdown>{message.content}</Markdown>
                </div>
              ) : (
                <div className="prose">
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
                handleInputChange({
                  target: {
                    value: suggestion.title + " " + suggestion.subtitle,
                  },
                } as ChangeEvent<HTMLInputElement>)
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
