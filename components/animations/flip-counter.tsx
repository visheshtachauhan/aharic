"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FlipCounterProps {
  value: number
  prefix?: string
}

export function FlipCounter({ value, prefix = "₹" }: FlipCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true)
      const timeout = setTimeout(() => {
        setDisplayValue(value)
        setIsFlipping(false)
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [value, displayValue])

  const digits = displayValue.toString().split("")

  return (
    <div className="flex items-center font-mono text-2xl font-bold">
      <span className="mr-1">{prefix}</span>
      {digits.map((digit, index) => (
        <div key={`${index}-${digit}`} className="relative h-8 w-6 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={digit}
              initial={isFlipping ? { y: -40 } : { y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
} 