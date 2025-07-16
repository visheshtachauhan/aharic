export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  popular: boolean;
  spicyLevel: 1 | 2 | 3;
  rating: number;
  reviews: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  variants?: {
    name: string;
    price: number;
  }[];
  addons?: {
    name: string;
    price: number;
  }[];
  availability?: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  sales?: {
    total: number;
    lastWeek: number;
  };
  stockQuantity?: number;
  lastUnavailableDate?: string;
  autoDisabled?: boolean;
} 