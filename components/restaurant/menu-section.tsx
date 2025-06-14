"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { menuItems } from "@/data/menu-items"
import { MenuItemCard } from "@/components/menu-item-card"

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

interface MenuSectionProps {
  title: string
  subtitle?: string
  category: string
}

export function MenuSection({ title, subtitle, category }: MenuSectionProps) {
  const items = menuItems.filter((item) => item.category === category)

  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <MenuItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  )
} 