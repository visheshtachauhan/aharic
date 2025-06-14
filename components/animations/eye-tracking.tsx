"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface EyeTrackingIconProps {
  children: React.ReactNode
  intensity?: number
}

export function EyeTrackingIcon({ children, intensity = 20 }: EyeTrackingIconProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 200 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      
      const maxDistance = 100
      const distance = Math.min(
        Math.sqrt(distanceX * distanceX + distanceY * distanceY),
        maxDistance
      )
      
      const scale = (maxDistance - distance) / maxDistance
      if (scale > 0) {
        x.set((distanceX / maxDistance) * intensity * scale)
        y.set((distanceY / maxDistance) * intensity * scale)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [intensity, x, y])

  return (
    <div ref={ref} className="relative inline-block">
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
} 