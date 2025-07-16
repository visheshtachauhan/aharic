import Image from "next/image"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarIcon, PlusIcon, Flame } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating?: number
  reviews?: number
  isVeg?: boolean
  spicyLevel?: 1 | 2 | 3
  popular?: boolean
}

interface MenuItemCardProps {
  item: MenuItem
  className?: string
}

export function MenuItemCard({ item, className }: MenuItemCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
    })
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("h-full", className)}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[4/3]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {item.popular && (
              <Badge variant="secondary" className="bg-yellow-100/80 text-yellow-800">
                Popular
              </Badge>
            )}
            {item.isVeg && (
              <div className="h-5 w-5 rounded-full border-2 border-green-500 bg-white p-0.5">
                <div className="h-full w-full rounded-full bg-green-500" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-1">{item.name}</h3>
              <span className="font-semibold whitespace-nowrap">₹{item.price}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {item.rating && (
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{item.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({item.reviews})
                </span>
              </div>
            )}
            {item.spicyLevel && (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: item.spicyLevel }).map((_, i) => (
                  <Flame
                    key={i}
                    className="h-4 w-4 text-red-500"
                    fill="currentColor"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}