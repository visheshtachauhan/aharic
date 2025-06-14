"use client"

import { motion } from "framer-motion"

export function SteamAnimation() {
  return (
    <div className="relative w-6 h-6 opacity-70">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full"
          initial={{ y: 0, opacity: 0, scale: 0.5 }}
          animate={{
            y: -20,
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x: i === 0 ? -5 : i === 2 ? 5 : 0
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
} 