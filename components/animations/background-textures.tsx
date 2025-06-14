import { motion } from "framer-motion";

export function SteamBackgroundEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-24 h-24 opacity-[0.03]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{
            scale: [0.2, 1],
            opacity: [0, 0.03, 0],
            y: [-20, -60],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-t from-black/5 to-transparent rounded-full blur-xl" />
        </motion.div>
      ))}
    </div>
  );
}

export function SparkleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#FF7300] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
} 