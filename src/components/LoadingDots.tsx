
import { motion } from "framer-motion";

export const LoadingDots = () => {
  return (
    <div className="flex space-x-2 p-4">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-primary/60 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: dot * 0.2,
          }}
        />
      ))}
    </div>
  );
};
