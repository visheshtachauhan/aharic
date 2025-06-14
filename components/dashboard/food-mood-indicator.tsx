"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Moon, Sparkles, PartyPopper, AlertTriangle } from "lucide-react"

interface Rating {
  value: number
  timestamp: string
}

interface FoodMoodIndicatorProps {
  ratings: Rating[]
}

export function FoodMoodIndicator({ ratings }: FoodMoodIndicatorProps) {
  const [moodScore, setMoodScore] = useState(0)
  const [isBoostActive, setIsBoostActive] = useState(false)
  
  // Calculate mood score (0-100) based on recent ratings
  useEffect(() => {
    const recentRatings = ratings.filter(rating => {
      const ratingDate = new Date(rating.timestamp)
      const now = new Date()
      // Only consider ratings from the last 24 hours
      return (now.getTime() - ratingDate.getTime()) < 24 * 60 * 60 * 1000
    })
    
    if (recentRatings.length === 0) {
      setMoodScore(50) // Neutral mood if no recent ratings
      return
    }
    
    const averageRating = recentRatings.reduce((sum, rating) => sum + rating.value, 0) / recentRatings.length
    setMoodScore(Math.round((averageRating / 5) * 100))
  }, [ratings])

  const getMoodStatus = () => {
    if (moodScore >= 80) return "excellent"
    if (moodScore >= 60) return "good"
    if (moodScore >= 40) return "neutral"
    return "concerning"
  }

  const handleBoostMood = () => {
    setIsBoostActive(true)
    // Auto-disable boost after 2 hours
    setTimeout(() => setIsBoostActive(false), 2 * 60 * 60 * 1000)
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Mood-based background effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: moodScore >= 80 
            ? "radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0) 70%)"
            : moodScore <= 40
            ? "radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%)"
            : "none"
        }}
      />

      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Food Mood Indicator</CardTitle>
        <AnimatePresence mode="wait">
          <motion.div
            key={getMoodStatus()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {getMoodStatus() === "excellent" && <PartyPopper className="h-5 w-5 text-yellow-500" />}
            {getMoodStatus() === "good" && <Sun className="h-5 w-5 text-orange-500" />}
            {getMoodStatus() === "neutral" && <Moon className="h-5 w-5 text-blue-500" />}
            {getMoodStatus() === "concerning" && <AlertTriangle className="h-5 w-5 text-red-500" />}
          </motion.div>
        </AnimatePresence>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Mood Score Indicator */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: moodScore >= 80 
                  ? "linear-gradient(90deg, #FFD700, #FFA500)" 
                  : moodScore >= 60
                  ? "linear-gradient(90deg, #22C55E, #16A34A)"
                  : moodScore >= 40
                  ? "linear-gradient(90deg, #3B82F6, #2563EB)"
                  : "linear-gradient(90deg, #EF4444, #DC2626)"
              }}
              animate={{ width: `${moodScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Mood Description */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                {getMoodStatus() === "excellent" && "Customers are loving it! 🎉"}
                {getMoodStatus() === "good" && "Positive vibes all around ☀️"}
                {getMoodStatus() === "neutral" && "Average satisfaction levels 🌙"}
                {getMoodStatus() === "concerning" && "Attention needed ⚠️"}
              </p>
              <p className="text-sm text-muted-foreground">
                Based on {ratings.length} recent ratings
              </p>
            </div>
            <Button
              variant={isBoostActive ? "secondary" : "default"}
              size="sm"
              onClick={handleBoostMood}
              disabled={isBoostActive || moodScore >= 80}
              className="relative"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isBoostActive ? "Boost Active" : "Boost Mood"}
              {isBoostActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20"
                  animate={{
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              )}
            </Button>
          </div>

          {/* Active Boost Effects */}
          {isBoostActive && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-orange-800 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                20% discount active for the next 2 hours!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 