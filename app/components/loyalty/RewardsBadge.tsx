import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Trophy, LucideIcon } from 'lucide-react';

interface RewardsBadgeProps {
  firstOrderDiscount?: number;
  cashbackBalance?: number;
  nextReward?: {
    ordersRequired: number;
    reward: string;
  };
  onClick: () => void;
  className?: string;
}

interface MessageData {
  text: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function RewardsBadge({
  firstOrderDiscount,
  cashbackBalance,
  nextReward,
  onClick,
  className = ''
}: RewardsBadgeProps) {
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages: MessageData[] = [
    firstOrderDiscount && {
      text: `₹${firstOrderDiscount} OFF for First-Time Users! Tap to Claim`,
      icon: Sparkles,
      color: 'text-orange-500',
      bg: 'bg-orange-100'
    },
    cashbackBalance && {
      text: `You have ₹${cashbackBalance} Cashback! Want to use it?`,
      icon: Coins,
      color: 'text-green-500',
      bg: 'bg-green-100'
    },
    nextReward && {
      text: `You're ${nextReward.ordersRequired} orders away from ${nextReward.reward}!`,
      icon: Trophy,
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    }
  ].filter((message): message is MessageData => Boolean(message));

  // Rotate through available messages
  useEffect(() => {
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [messages.length]);

  if (!messages.length) return null;

  const currentMessageData = messages[currentMessage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 z-50 ${className}`}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg ${currentMessageData.bg} border border-white/20 backdrop-blur-sm`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <currentMessageData.icon className={`w-5 h-5 ${currentMessageData.color}`} />
            <span className="text-sm font-medium">{currentMessageData.text}</span>
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
} 