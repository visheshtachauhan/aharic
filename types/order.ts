import { CartItem } from './restaurant';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  isAvailable: boolean;
  lastUnavailableDate?: string;
  autoDisabled?: boolean;
  stockQuantity?: number;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  table: string;
  items: OrderItem[];
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  paymentMethod?: 'cash' | 'card' | 'upi';
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  estimatedTime?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSales: number;
  dailySales: number;
  averageOrderValue: number;
  growthPercentage: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  sortBy?: 'time' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  createdAt: string;
  read: boolean;
}

// Valid status transitions
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['in-progress', 'cancelled'],
  'in-progress': ['completed', 'cancelled'],
  completed: [],
  cancelled: []
};

// Status colors for consistent styling
export const STATUS_COLORS = {
  pending: {
    bg: 'bg-[#FFF8E6]',
    text: 'text-[#FFB800]',
    border: 'border-[#FFB800]'
  },
  'in-progress': {
    bg: 'bg-[#FFF0E6]',
    text: 'text-[#FF7300]',
    border: 'border-[#FF7300]'
  },
  completed: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-600'
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-600'
  }
} as const;

// Payment status colors
export const PAYMENT_STATUS_COLORS = {
  pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-600'
  },
  paid: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-600'
  },
  failed: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-600'
  },
  refunded: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-600'
  }
} as const;

// Add availability status colors
export const AVAILABILITY_COLORS = {
  available: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-600'
  },
  unavailable: {
    bg: 'bg-gray-50',
    text: 'text-gray-400',
    border: 'border-gray-300'
  }
} as const; 