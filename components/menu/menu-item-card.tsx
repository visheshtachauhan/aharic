import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Flame, Utensils, Settings, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import type { MenuItem } from '@/types/menu';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function MenuItemCard({ item, onEdit, onDelete, className }: MenuItemCardProps) {
  // Ensure item and its properties are not null or undefined
  const price = typeof item?.price === 'number' ? item.price.toFixed(2) : '0.00';
  const imageUrl = item?.image || null; // Use null if image is undefined or null
  const itemName = item?.name || 'Unnamed Item';
  const itemDescription = item?.description || 'No description available';
  const itemCategory = item?.category || 'Uncategorized';
  const isVeg = item?.isVeg ?? false; // Default to false if undefined or null
  const popular = item?.popular ?? false; // Default to false
  const spicyLevel = item?.spicyLevel ?? 0; // Default to 0
  const available = item?.available ?? true; // Default to true

  return (
    <Card className={cn("h-full flex flex-col overflow-hidden", className, "w-[300px] min-h-[400px]")}>
      {/* Ensure item object exists before accessing properties */}
      {item && (
        <>
          <div className="relative aspect-[4/3] w-full flex-none">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={itemName}
                fill
                className="object-cover"
                sizes="300px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Utensils className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              {onEdit && item._id && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              {onDelete && item._id && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(item._id)}
                  className="h-8 w-8"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="absolute top-2 left-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isVeg ? "bg-green-500" : "bg-red-500"
              )} />
            </div>
          </div>
          <CardHeader className="p-4 flex-grow flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <CardTitle className="text-lg truncate">{itemName}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {itemDescription}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-none">
                <span className="font-semibold">${price}</span>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {popular && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {spicyLevel > 0 && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      <Flame className="h-3 w-3 mr-1" />
                      Spicy
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {itemCategory}
                </span>
              </div>
              <Switch
                checked={available}
                onCheckedChange={(checked) => {
                  if (onEdit && item._id) {
                    onEdit({ ...item, available: checked });
                  }
                }}
              />
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
} 