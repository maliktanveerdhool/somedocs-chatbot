
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`message-bubble ${isUser ? 'message-bubble-user' : 'message-bubble-bot'}`}
    >
      {message}
    </motion.div>
  );
};
