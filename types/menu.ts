export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  popular: boolean;
  spicyLevel: number;
  rating: number;
  reviews: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
} 