"use client"

import { useEffect, useRef } from "react"

interface OrderBellProps {
  play: boolean
  onComplete?: () => void
}

export function OrderBell({ play, onComplete }: OrderBellProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/restaurant-bell.mp3")
      audioRef.current.volume = 0.5 // Set volume to 50%
    }

    // Play sound when prop changes
    if (play && audioRef.current) {
      const playSound = async () => {
        try {
          await audioRef.current?.play()
          onComplete?.()
        } catch (error) {
          console.error("Error playing sound:", error)
        }
      }
      playSound()
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [play, onComplete])

  return null
} 