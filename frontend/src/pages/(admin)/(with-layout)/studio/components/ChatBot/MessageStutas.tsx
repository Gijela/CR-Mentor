import { motion } from "framer-motion";

interface MessageStatusProps {
  status: string;
  messages: any[]; // UIMessage[]
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status, messages }) => {
  return (
    <div className="flex justify-start w-full max-w-3xl mx-auto">
      {status === "submitted" && (
        <div className="rounded-lg px-1 py-2 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {"Thinking...".split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                delay: index * 0.12,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ display: "inline-block" }} // Ensures consistent rendering of characters
            >
              {char}
            </motion.span>
          ))}
        </div>
      )}
      {status === "streaming" &&
        messages.length > 0 &&
        messages[messages.length - 1]?.role === "user" && (
          <div className="rounded-lg px-1 py-2 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            AI is preparing to reply...
          </div>
        )}
      {status === "error" && (
        <div className="rounded-lg border border-red-400 bg-red-50 px-1 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600">
          Sorry, the reply failed. You can try to send the message again.
        </div>
      )}
    </div>
  );
};

export default MessageStatus;
