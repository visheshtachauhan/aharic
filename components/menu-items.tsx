import { useCart } from '@/contexts/cart-context'
import { MenuItem } from '@/types'
import { MenuItemImage } from './menu-item-image'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'

interface MenuItemsProps {
  items: MenuItem[]
  className?: string
}

export function MenuItems({ items, className }: MenuItemsProps) {
  const { addItem } = useCart()

  if (!items.length) return null;

  const item = items[0]; // Since we're now passing single items

  return (
    <Card className={cn("overflow-hidden group hover:shadow-lg transition-all h-full", className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <MenuItemImage 
          item={item}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {item.isBestSeller && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-100/80 text-yellow-800">
            Best Seller
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-lg leading-tight">{item.name}</h3>
          <span className="font-medium whitespace-nowrap">₹{item.price}</span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {item.isVegetarian && (
              <Badge variant="outline" className="bg-green-50">Veg</Badge>
            )}
            {item.isSpicy && (
              <Badge variant="outline" className="bg-red-50">Spicy</Badge>
            )}
          </div>
          <Button 
            size="sm"
            onClick={() => addItem({
              id: item._id,
              name: item.name,
              price: item.price,
              image: item.image || '/images/placeholder.png'
            })}
            className="hover:scale-105 transition-transform"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  )
}

