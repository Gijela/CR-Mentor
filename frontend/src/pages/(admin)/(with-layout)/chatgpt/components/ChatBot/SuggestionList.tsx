import { motion } from "framer-motion";

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

interface SuggestionListProps {
  messages: any[]; // UIMessage[]
  append: (message: any) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  messages,
  append,
}) => {
  return (
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
  );
};

export default SuggestionList;
