"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { toast } from "sonner"

interface SoundContextType {
  isMuted: boolean
  toggleMute: () => void
  isLoading: boolean
  playSound: (soundUrl: string) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSoundSettings = () => {
      try {
        const stored = localStorage.getItem("sound-muted")
        if (stored !== null) {
          setIsMuted(stored === "true")
        }
      } catch (error) {
        toast.error("Failed to load sound settings. Using default settings.")
      } finally {
        setIsLoading(false)
      }
    }

    loadSoundSettings()
  }, [])

  const toggleMute = useCallback(() => {
    try {
      setIsMuted(prev => {
        const newValue = !prev
        localStorage.setItem("sound-muted", String(newValue))
        toast.info(newValue ? "Sound muted" : "Sound unmuted")
        return newValue
      })
    } catch (error) {
      toast.error("Failed to update sound settings. Please try again.")
    }
  }, [])

  const playSound = useCallback((soundUrl: string) => {
    if (!isMuted) {
      const audio = new Audio(soundUrl)
      audio.play().catch(error => {
        console.error("Error playing sound:", error)
        toast.error("Could not play notification sound.")
      })
    }
  }, [isMuted])

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, isLoading, playSound }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSoundSettings() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSoundSettings must be used within a SoundProvider")
  }
  return context
} 