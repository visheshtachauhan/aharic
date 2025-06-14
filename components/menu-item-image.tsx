import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MenuItemImageProps extends Omit<ImageProps, 'src'> {
  item: {
    image?: string
    name: string
  }
}

export function MenuItemImage({ 
  item,
  alt,
  className,
  ...props 
}: MenuItemImageProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const imageUrl = error || !item.image ? '/images/placeholder.png' : item.image

  return (
    <div className="relative aspect-square h-full w-full overflow-hidden rounded-lg bg-muted">
      <Image
        src={imageUrl}
        alt={alt || item.name}
        className={cn(
          "h-full w-full object-cover transition-all duration-300",
          isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
          "hover:scale-105",
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
} 