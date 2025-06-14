"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { StarIcon, ClockIcon, ShareIcon, HeartIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function RestaurantHeader() {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[300px] w-full">
        <Image
          src="/restaurant-cover.jpg"
          alt="Restaurant Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Restaurant Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Restaurant Name</h1>
            <div className="flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full">
                <ShareIcon className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full">
                <HeartIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-gray-200">Italian • Continental • Chinese</p>

          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>4.5</span>
              <span className="text-gray-300">(2.1k reviews)</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>30-40 min</span>
            </Badge>
            <Badge variant="secondary">₹200 for two</Badge>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 