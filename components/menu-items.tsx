import { useCart } from '@/contexts/cart-context'
import { MenuItem } from '@/types/menu'
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className={cn("overflow-hidden group hover:shadow-lg transition-all h-full", className)}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <MenuItemImage 
              item={item}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              alt={item.name}
            />
            {item.popular && (
              <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-100/80 text-yellow-800">
                Popular
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
                {item.isVeg && (
                  <Badge variant="outline" className="bg-green-50">Veg</Badge>
                )}
                {item.spicyLevel > 0 && (
                  <Badge variant="outline" className="bg-red-50">
                    {item.spicyLevel === 1 ? 'Mild' : item.spicyLevel === 2 ? 'Medium' : 'Hot'}
                  </Badge>
                )}
              </div>
              <Button 
                size="sm"
                onClick={() => addItem({
                  id: item. id,
                  name: item.name,
                  price: item.price,
                  image: item.image
                })}
                className="hover:scale-105 transition-transform"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

