"use client"

import { motion } from "framer-motion"

export function DeliveryScooter() {
  return (
    <motion.div
      className="fixed top-16 -left-16 z-50"
      animate={{
        x: ["0vw", "120vw"],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
      }}
    >
      <div className="relative w-12 h-12">
        {/* Scooter SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#FF7300]"
        >
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M23 17H7l3-9h9l4 9Z" />
          <path d="M3 17h4v-6H3v6Z" />
          <path d="m5 11 1.5-9h5.5l2 6" />
        </svg>
        
        {/* Motion Trail */}
        <motion.div
          className="absolute bottom-0 right-0 w-8 h-0.5 bg-gradient-to-r from-[#FF7300]/50 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: 32 }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
    </motion.div>
  )
} 