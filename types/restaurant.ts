import { ObjectId } from 'mongodb';

export interface Variant {
  name: string;
  price: number;
  available: boolean;
}

export interface Addon {
  name: string;
  price: number;
  available: boolean;
}

export interface Availability {
  enabled: boolean;
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  isVeg: boolean;
  popular: boolean;
  rating?: number;
  reviews?: number;
  variants?: Variant[];
  addons?: Addon[];
  availability?: Availability;
  spicyLevel?: 1 | 2 | 3;
  sales?: {
    total: number;
    lastWeek: number;
  };
}

export interface VariantManagerProps {
  item: MenuItem;
  onUpdate: (updates: Partial<MenuItem>) => void;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  coverImage?: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  rating?: number;
  reviews?: number;
  categories: string[];
  features: string[];
  paymentMethods: string[];
}

export interface RestaurantStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularItems: {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  peakHours: {
    hour: string;
    orders: number;
  }[];
  customerSatisfaction: number;
}

export interface RestaurantSettings {
  id: string;
  autoAcceptOrders: boolean;
  estimatedDeliveryTime: number;
  minimumOrderAmount: number;
  serviceCharge: number;
  taxes: {
    name: string;
    percentage: number;
  }[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  orderCancellationTime: number;
  tableReservationEnabled: boolean;
  onlineOrderingEnabled: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  description?: string;
} 