import { User } from '@supabase/supabase-js';

declare global {
  interface Session {
    user: User;
  }
}

// Global type declarations
declare global {
  interface Order {
    id: string;
    tableNumber: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    status: 'pending' | 'in-progress' | 'completed';
    totalAmount: number;
    createdAt: Date;
    specialInstructions?: string;
  }
} 