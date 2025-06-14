"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface SoundContextType {
  isMuted: boolean
  toggleMute: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available, default to unmuted
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("sound-muted")
    if (stored !== null) {
      setIsMuted(stored === "true")
    }
  }, [])

  const toggleMute = () => {
    setIsMuted(prev => {
      const newValue = !prev
      localStorage.setItem("sound-muted", String(newValue))
      return newValue
    })
  }

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute }}>
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