import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

const DEFAULT_PLACEHOLDER = '/images/placeholder.png';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallback?: string;
}

export function SafeImage({
  src,
  fallback = DEFAULT_PLACEHOLDER,
  alt,
  className,
  ...props
}: SafeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageUrl = error ? fallback : src;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-300",
          isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
} 