"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const rippleId = useRef(0)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleClick = (e: MouseEvent) => {
      setClicked(true)
      setTimeout(() => setClicked(false), 150)
      
      // Add ripple
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: rippleId.current++
      }
      setRipples(prev => [...prev, newRipple])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 1000)
    }

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <>
      <motion.div
        className="cursor-ripple"
        animate={{
          scale: clicked ? 0.8 : 1,
          x: position.x - 10,
          y: position.y - 10
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 400
        }}
      />
      
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ 
              x: ripple.x - 25,
              y: ripple.y - 25,
              scale: 0,
              opacity: 0.6 
            }}
            animate={{ 
              scale: 2,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed w-12 h-12 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,140,66,0.3) 0%, rgba(255,140,66,0) 70%)"
            }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}