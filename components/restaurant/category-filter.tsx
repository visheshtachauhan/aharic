"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CategoryFilterProps {
  category: {
    id: string
    name: string
    badge?: string
  }
  isSelected: boolean
  onClick: () => void
}

export function CategoryFilter({ category, isSelected, onClick }: CategoryFilterProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className="relative"
      onClick={onClick}
    >
      {category.name}
      {category.badge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-2 -top-2"
        >
          <Badge variant="default" className="bg-primary px-2 py-0.5 text-[10px]">
            {category.badge}
          </Badge>
        </motion.div>
      )}
    </Button>
  )
} 