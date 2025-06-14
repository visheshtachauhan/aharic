"use client"

import { useState, useRef, useEffect } from "react"
import { MenuSection } from "@/components/restaurant/menu-section"
import { menuItems } from "@/data/menu-items"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronRight, Menu as MenuIcon, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// Get unique categories from menu items
const categories = Array.from(new Set(menuItems.map(item => item.category)))

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  const filteredCategories = selectedCategory ? [selectedCategory] : categories

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setShowScrollTop(mainRef.current.scrollTop > 500)
      }
    }

    const mainElement = mainRef.current
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll)
      return () => mainElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`)
    if (element) {
      const headerOffset = 120 // Height of header + category navigation
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

    return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center mb-2">Our Menu</h1>
          <p className="text-muted-foreground text-center">
            Explore our delicious selection of dishes
          </p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 bg-white border-b z-20">
        <ScrollArea className="w-full">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="whitespace-nowrap"
              >
                <MenuIcon className="w-4 h-4 mr-2" />
                All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category)
                    scrollToCategory(category)
                  }}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
                </div>

      {/* Menu Sections */}
      <div 
        ref={mainRef}
        className="flex-1 overflow-y-auto"
      >
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-12">
            {filteredCategories.map((category) => (
              <div key={category} id={`category-${category}`}>
                <MenuSection
                  title={category}
                  subtitle={`Explore our ${category.toLowerCase()} selection`}
                  category={category}
                />
              </div>
            ))}
          </div>
        </main>
        </div>

      {/* Quick Navigation */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
        {/* Scroll to Top Button */}
              <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full bg-white shadow-lg transition-all duration-200",
            showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          )}
          onClick={scrollToTop}
        >
          <ChevronUp className="h-4 w-4" />
              </Button>

        {/* Category Quick Nav */}
        <div className="bg-white rounded-lg shadow-lg">
          <ScrollArea className="h-[min(400px,70vh)] p-2">
            <div className="space-y-1 pr-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => {
                    setSelectedCategory(category)
                    scrollToCategory(category)
                  }}
                >
                  <span className="truncate">{category}</span>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                </Button>
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
} 