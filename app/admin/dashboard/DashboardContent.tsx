'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Users, ShoppingBag, Bell, Search, MenuIcon, CheckCircle } from 'lucide-react';
import { NotificationPanel, useNotifications } from '@/components/ui/notification';
import { useOrders } from '@/hooks/useOrders';
import { CursorEffect } from '@/components/effects/CursorEffect';
import { AnimatedNumber } from '@/components/effects/AnimatedNumber';
import { AIInsightTooltip } from '@/components/effects/AIInsightTooltip';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/providers';
import { Order, OrderStatus } from '@/types/order';

interface Table {
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export default function DashboardContent() {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const { notifications, addNotification, dismissNotification } = useNotifications();
  const { 
    orders, 
    getOrdersByStatus, 
    getOrdersByPaymentStatus,
    calculateDailySales,
    calculateTotalSales
  } = useOrders();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/auth/login');
    }
  }, [session, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF7300]"></div>
      </div>
    );
  }

  // Rest of your dashboard code...
  // ... (keep all the existing dashboard code)
} 