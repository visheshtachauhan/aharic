'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useAuth } from '@/app/providers'; // DISABLED FOR DEMO
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Search, Clock, Plus, Settings, BarChart3, Table as TableIcon, Menu as MenuIcon, Home } from 'lucide-react';
import { OrderManagement } from '@/components/dashboard/order-management';
import { useOrders } from '@/hooks/useOrders';
import { useNotifications } from '@/components/ui/notification';
import { format, isValid } from 'date-fns';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableManagement } from "@/components/dashboard/table-management";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PendingPayments } from "@/components/dashboard/pending-payments";
import { TopItems } from "@/components/dashboard/top-items";
import AdminMenuPage from "@/app/admin/menu/page";
import AdminTablesPage from "@/app/admin/tables/page";
import AdminSettingsPage from "@/app/admin/settings/page";
import AdminAnalyticsPage from "@/app/admin/analytics/page";

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';
type FilterOption = 'all' | 'pending' | 'in-progress' | 'completed';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Order {
  _id: string;
  table: string;
  items: OrderItem[];
  amount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi';
  createdAt: string;
  updatedAt: string;
  customerName?: string;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'menu', label: 'Menu', icon: MenuIcon },
  { id: 'tables', label: 'Tables', icon: TableIcon },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { user, loading } = useAuth(); // DISABLED FOR DEMO
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const { updateOrder } = useOrders();
  const { addNotification } = useNotifications();

  // Set active tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab') || 'dashboard';
    setActiveTab(tab);
  }, [searchParams]);

  // Redirect if not authenticated - DISABLED FOR DEMO
  // useEffect(() => {
  //   const demoLockdown = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN?.toLowerCase() === 'true';
  //   const hasDemoOwner = typeof document !== 'undefined' && document.cookie.includes('demoOwner=1');
  //   if (!loading && !user && !(demoLockdown && hasDemoOwner)) {
  //     router.push('/auth/login');
  //   }
  // }, [user, loading, router]);

  const fetchOrders = async () => {
    try {
      // For demo purposes, use mock data if API fails
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        // Fallback to demo data
        setOrders([
          {
            _id: 'demo-1',
            table: 'Table 1',
            items: [{ id: '1', name: 'Butter Chicken', price: 250, quantity: 2, category: 'Main Course' }],
            amount: 500,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'cash',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customerName: 'John Doe'
          },
          {
            _id: 'demo-2',
            table: 'Table 3',
            items: [{ id: '2', name: 'Naan', price: 30, quantity: 3, category: 'Bread' }],
            amount: 90,
            status: 'in-progress',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date().toISOString(),
            customerName: 'Jane Smith'
          }
        ]);
      }
    } catch (error: unknown) {
      console.error('Error fetching orders:', error);
      // Use demo data on error
      setOrders([
        {
          _id: 'demo-1',
          table: 'Table 1',
          items: [{ id: '1', name: 'Butter Chicken', price: 250, quantity: 2, category: 'Main Course' }],
          amount: 500,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'cash',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          customerName: 'John Doe'
        },
        {
          _id: 'demo-2',
          table: 'Table 3',
          items: [{ id: '2', name: 'Naan', price: 30, quantity: 3, category: 'Bread' }],
          amount: 90,
          status: 'in-progress',
          paymentStatus: 'paid',
          paymentMethod: 'card',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date().toISOString(),
          customerName: 'Jane Smith'
        }
      ]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      void fetchOrders();
    }
  }, [activeTab]);

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : 'Invalid date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterBy === 'all') return matchesSearch;
    return matchesSearch && order.status === filterBy;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'highest') {
      return b.amount - a.amount;
    }
    return a.amount - b.amount;
  });

  // If showing all orders, sort by status priority (pending -> in-progress -> completed)
  const finalOrders = filterBy === 'all'
    ? [
        ...sortedOrders.filter(o => o.status === 'pending'),
        ...sortedOrders.filter(o => o.status === 'in-progress'),
        ...sortedOrders.filter(o => o.status === 'completed')
      ]
    : sortedOrders;

  const handleStatusUpdate = async (orderId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    try {
      updateOrder(orderId, { status: newStatus });
      addNotification({
        title: 'Order Updated',
        message: `Order status changed to ${newStatus}`,
        type: 'success'
      });
    } catch (error: unknown) {
      addNotification({
        title: 'Error',
        message: 'Failed to update order status',
        type: 'error'
      });
    }
  };

  const handlePaymentUpdate = async (orderId: string, newPaymentStatus: 'paid' | 'pending') => {
    try {
      updateOrder(orderId, { paymentStatus: newPaymentStatus });
      addNotification({
        title: 'Payment Status Updated',
        message: `Payment marked as ${newPaymentStatus}`,
        type: 'success'
      });
    } catch (error: unknown) {
      addNotification({
        title: 'Error',
        message: 'Failed to update payment status',
        type: 'error'
      });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: Order['status']): 'pending' | 'in-progress' | 'completed' => {
    switch (currentStatus) {
      case 'pending':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/owner/dashboard?tab=${tabId}`);
  };

  // Show loading state - DISABLED FOR DEMO
  // if (loading) {
  //   return (
  //   <div className="min-h-screen flex items-center justify-center">
  //     <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF7300]"></div>
  //   </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#FFF6F0]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold text-[#FF7300] mb-8">Owner Dashboard</h1>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#FF7300] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#2D2D2D]">Welcome back, Demo Owner</h1>
              <p className="text-muted-foreground mt-2">Here's what's happening with your restaurant today.</p>
            </div>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFF8E6] rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-[#FFB800]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Orders</p>
                    <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFF0E6] rounded-lg flex items-center justify-center">
                    <TableIcon className="w-6 h-6 text-[#FF7300]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Tables</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">₹{orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.amount : 0), 0)}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Overview Panels (restored) */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <TopItems />
              </div>
            </div>

            <PendingPayments />

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">Table {order.table}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.amount}</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No orders yet</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <OrderManagement />
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (<AdminMenuPage />)}

        {/* Tables Tab */}
        {activeTab === 'tables' && (<AdminTablesPage />)}

        {/* Settings Tab */}
        {activeTab === 'settings' && (<AdminSettingsPage />)}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (<AdminAnalyticsPage />)}
      </div>
    </div>
  );
} 