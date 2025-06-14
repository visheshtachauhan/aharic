"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Clock, Info, MapPin, Share2, Star } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface RestaurantHeaderProps {
  restaurant: {
    name: string
    image: string
    cuisine: string
    rating: number
    reviewCount: number
    address: string
    distance: string
    deliveryTime: string
    description: string
  }
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 50)
    })
  }

  return (
    <div className="relative">
      <div className="h-64 md:h-80 relative">
        <Image
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
      </div>

      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glassmorphism py-2 shadow-md" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            {isScrolled && <h2 className="font-bold text-lg truncate">{restaurant.name}</h2>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full text-white">
              <Share2 className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="glassmorphism rounded-xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-muted-foreground">{restaurant.cuisine}</p>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-medium flex items-center">
                    <Star className="h-3 w-3 fill-white mr-0.5" />
                    {restaurant.rating}
                  </div>
                  <span className="text-sm text-muted-foreground">({restaurant.reviewCount})</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {restaurant.address} • {restaurant.distance}
                </span>
              </div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Info className="h-4 w-4" />
                  More Info
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{restaurant.name}</SheetTitle>
                  <SheetDescription>{restaurant.description}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Opening Hours</h3>
                    <p className="text-sm text-muted-foreground">10:00 AM - 11:00 PM</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Contact</h3>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}

