import { CATEGORY_FALLBACKS, DEFAULT_FALLBACK, type Category } from '@/owner/menu/constants';

export const validateImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

export const getImageUrl = (category: Category, customUrl?: string): string => {
  // If a custom URL is provided and valid, use it
  if (customUrl && validateImageUrl(customUrl)) {
    return customUrl;
  }

  // Try category fallback
  if (category in CATEGORY_FALLBACKS) {
    return CATEGORY_FALLBACKS[category];
  }

  // Return default placeholder
  return DEFAULT_FALLBACK;
};

export const preloadCategoryImages = async (category: Category): Promise<void> => {
  try {
    // Preload category fallback
    if (category in CATEGORY_FALLBACKS) {
      const img = new Image();
      img.src = CATEGORY_FALLBACKS[category];
    }
  } catch (error) {
    console.error(`Error preloading images for category ${category}:`, error);
  }
}; 