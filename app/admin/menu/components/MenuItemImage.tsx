import Image from 'next/image';
import { useState } from 'react';

const defaultPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='3' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"

interface MenuItemImageProps {
  url?: string;
  name: string;
  category?: string;
  className?: string;
}

export function MenuItemImage({ url, name, category, className = "h-40" }: MenuItemImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = hasError || !url ? defaultPlaceholder : url;

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setHasError(true)}
        priority={false}
        loading="lazy"
        blurDataURL={defaultPlaceholder}
        placeholder="blur"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
} 