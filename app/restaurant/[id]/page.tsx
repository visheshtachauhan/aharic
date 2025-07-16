"use client"

import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { RestaurantHeader } from "@/components/restaurant/header"
import { CategoryFilter } from "@/components/restaurant/category-filter"
import { MenuSection } from "@/components/restaurant/menu-section"
import { FloatingCart } from "@/components/restaurant/floating-cart"

const categories = [
  { id: "all", name: "All" },
  { id: "bestsellers", name: "Best Sellers", badge: "Popular" },
  { id: "recommended", name: "Recommended", badge: "New" },
  { id: "starters", name: "Starters" },
  { id: "mains", name: "Main Course" },
  { id: "desserts", name: "Desserts" },
  { id: "beverages", name: "Beverages" },
]

export default function RestaurantPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <RestaurantHeader />
      
      {/* Categories */}
      <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
        <ScrollArea className="w-full whitespace-nowrap pb-4 pt-4">
          <div className="flex w-max space-x-4 px-4">
            {categories.map((category) => (
              <CategoryFilter
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Menu Sections */}
      <main className="flex-1 space-y-6 p-4 pt-6">
        <MenuSection
          title="Popular Dishes"
          subtitle="Most loved dishes by our customers"
          items={[]}
        />
        <MenuSection
          title="Recommended for You"
          subtitle="Handpicked dishes we think you'll love"
          items={[]}
        />
        <MenuSection
          title="Main Menu"
          subtitle="Explore our full menu"
          items={[]}
        />
      </main>

      {/* Floating Cart */}
      <FloatingCart />
    </div>
  )
} 