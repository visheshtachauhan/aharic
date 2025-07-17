import {
  UtensilsCrossed,
  Coffee,
  IceCream,
  Wine,
  Soup,
  Tag,
  Pizza,
  type LucideIcon
} from 'lucide-react';

export const CATEGORIES = [
  'Appetizers',
  'Main Course',
  'Pizza & Pasta',
  'Desserts',
  'Beverages',
  'Sides',
  'Specials'
] as const;

export type Category = typeof CATEGORIES[number];

export const SIZE_VARIANTS = ['Small', 'Medium', 'Large'] as const;
export type SizeVariant = typeof SIZE_VARIANTS[number];

export interface PriceVariant {
  size: SizeVariant;
  price: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface CategorySettings {
  icon: LucideIcon;
  color: string;
  description: string;
  defaultPrice?: number;
  sortOrder: number;
  allowCustomizations: boolean;
  hasVariants: boolean;
  defaultVariants?: PriceVariant[];
  availableAddOns?: AddOn[];
}

// Common add-ons that can be used across categories
export const COMMON_ADD_ONS: AddOn[] = [
  { id: 'extra-cheese', name: 'Extra Cheese', price: 30 },
  { id: 'extra-sauce', name: 'Extra Sauce', price: 20 },
  { id: 'extra-toppings', name: 'Extra Toppings', price: 40 },
  { id: 'make-spicy', name: 'Make it Spicy', price: 15 },
];

export const CATEGORY_SETTINGS: Record<Category, CategorySettings> = {
  'Appetizers': {
    icon: UtensilsCrossed,
    color: 'text-orange-500',
    description: 'Start your meal with these delicious starters',
    defaultPrice: 199,
    sortOrder: 1,
    allowCustomizations: true,
    hasVariants: true,
    defaultVariants: [
      { size: 'Small', price: 149 },
      { size: 'Medium', price: 199 },
      { size: 'Large', price: 249 }
    ],
    availableAddOns: [
      { id: 'extra-sauce', name: 'Extra Sauce', price: 20 },
      { id: 'make-spicy', name: 'Make it Spicy', price: 15 }
    ]
  },
  'Main Course': {
    icon: Soup,
    color: 'text-red-600',
    description: 'Hearty main dishes to satisfy your hunger',
    defaultPrice: 299,
    sortOrder: 2,
    allowCustomizations: true,
    hasVariants: true,
    defaultVariants: [
      { size: 'Small', price: 249 },
      { size: 'Medium', price: 299 },
      { size: 'Large', price: 349 }
    ],
    availableAddOns: COMMON_ADD_ONS
  },
  'Pizza & Pasta': {
    icon: Pizza,
    color: 'text-blue-500',
    description: 'Classic Italian pizzas and pasta dishes',
    defaultPrice: 349,
    sortOrder: 2.5,
    allowCustomizations: true,
    hasVariants: true,
    defaultVariants: [
      { size: 'Small', price: 299 },
      { size: 'Medium', price: 349 },
      { size: 'Large', price: 399 }
    ],
    availableAddOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 30 },
      { id: 'extra-toppings', name: 'Extra Toppings', price: 40 },
      { id: 'make-spicy', name: 'Make it Spicy', price: 15 }
    ]
  },
  'Desserts': {
    icon: IceCream,
    color: 'text-pink-500',
    description: 'Sweet treats to end your meal',
    defaultPrice: 149,
    sortOrder: 4,
    allowCustomizations: false,
    hasVariants: false
  },
  'Beverages': {
    icon: Coffee,
    color: 'text-brown-500',
    description: 'Refreshing drinks and beverages',
    defaultPrice: 99,
    sortOrder: 5,
    allowCustomizations: false,
    hasVariants: true,
    defaultVariants: [
      { size: 'Small', price: 79 },
      { size: 'Medium', price: 99 },
      { size: 'Large', price: 119 }
    ]
  },
  'Sides': {
    icon: Wine,
    color: 'text-green-500',
    description: 'Perfect accompaniments to your main course',
    defaultPrice: 149,
    sortOrder: 3,
    allowCustomizations: true,
    hasVariants: true,
    defaultVariants: [
      { size: 'Small', price: 129 },
      { size: 'Medium', price: 149 },
      { size: 'Large', price: 179 }
    ],
    availableAddOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 30 },
      { id: 'extra-sauce', name: 'Extra Sauce', price: 20 }
    ]
  },
  'Specials': {
    icon: Tag,
    color: 'text-purple-500',
    description: 'Limited time offers and chef recommendations',
    defaultPrice: 0,
    sortOrder: 6,
    allowCustomizations: true,
    hasVariants: false,
    defaultVariants: [],
    availableAddOns: COMMON_ADD_ONS
  }
};

// Using stable, high-quality images from a reliable CDN
export const CATEGORY_IMAGES: Record<Category, string> = {
  'Appetizers': 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=800&q=80',
  'Main Course': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  'Pizza & Pasta': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
  'Desserts': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
  'Sides': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  'Specials': 'https://images.unsplash.com/photo-1504754524776-abf3858f941f?w=800&q=80'
};

export const CATEGORY_FALLBACKS = CATEGORY_IMAGES;
export const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';
export const DEFAULT_IMAGE = DEFAULT_FALLBACK; 