'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useAuth } from '@/app/providers'; // DISABLED FOR DEMO
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Search, Clock, Plus, Settings, BarChart3, Table as TableIcon, Menu as MenuIcon, Home } from 'lucide-react';
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
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#FF7300]" />
                <h1 className="text-xl font-semibold text-[#2D2D2D]">Orders</h1>
                <div className="flex gap-2">
                  <span className="bg-[#FFF8E6] text-[#FFB800] px-3 py-1 rounded-full text-sm font-medium">
                    {orders.filter(o => o.status === 'pending').length} pending
                  </span>
                  <span className="bg-[#FFF0E6] text-[#FF7300] px-3 py-1 rounded-full text-sm font-medium">
                    {orders.filter(o => o.status === 'in-progress').length} in progress
                  </span>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {orders.filter(o => o.status === 'completed').length} completed
                  </span>
                </div>
              </div>
              <Button
                onClick={() => router.push('/owner/orders/new')}
                className="bg-[#FF7300] text-white hover:bg-[#FF7300]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666]" />
                  <Input
                    placeholder="Search orders by table or customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-[#FF7300]/20 focus:border-[#FF7300] focus:ring-[#FF7300]/20"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sort by</label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="highest">Highest Amount</SelectItem>
                        <SelectItem value="lowest">Lowest Amount</SelectItem>
                      </SelectContent>
                    </Select>
        </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Filter by</label>
                    <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
        </div>
        </div>
              </div>
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7300]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {finalOrders.map((order) => (
                  <Card
                    key={order._id}
                    className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2D2D2D]">
                          Table {order.table}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-[#666666]" />
                          <p className="text-sm text-[#666666]">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#2D2D2D]">₹{order.amount}</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-[#666666] flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#FF7300]"></span>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#FF7300]/10">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handlePaymentUpdate(order._id, 'paid')}
                          disabled={order.paymentStatus === 'paid'}
                          className={`px-3 py-1 text-xs rounded-full ${
                            order.paymentStatus === 'paid' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Mark as Paid'}
                        </Button>
                        <span className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                          ({order.paymentMethod})
                        </span>
                      </div>
                      <Button
                        onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                        disabled={order.status === 'completed'}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Next: {getNextStatus(order.status)}
                      </Button>
                    </div>
                  </Card>
                ))}

                {finalOrders.length === 0 && (
                  <div className="text-center py-8 text-[#666666]">
                    No orders found for the current filter.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Menu Management</h1>
                <p className="text-muted-foreground">
                  Manage your restaurant's menu items and categories
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FFF8E6] rounded-lg flex items-center justify-center">
                      <MenuIcon className="w-5 h-5 text-[#FFB800]" />
                    </div>
                    <h3 className="text-lg font-semibold">Categories</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create and organize your menu categories
                  </p>
                  <Button variant="outline" className="w-full">Manage Categories</Button>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FFF0E6] rounded-lg flex items-center justify-center">
                      <MenuIcon className="w-5 h-5 text-[#FF7300]" />
                    </div>
                    <h3 className="text-lg font-semibold">Menu Items</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add, edit, and remove menu items
                  </p>
                  <Button variant="outline" className="w-full">Manage Items</Button>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Special Offers</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create and manage special offers and promotions
                  </p>
                  <Button variant="outline" className="w-full">Manage Offers</Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold">Table Management</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your restaurant tables and track their status
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <TableIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-xl font-semibold text-green-600">4 Tables</p>
                  </div>
                </Card>
                
                <Card className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 text-orange-600">👥</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupied</p>
                    <p className="text-xl font-semibold text-orange-600">3 Tables</p>
                  </div>
                </Card>
              </div>
            </div>
            
            <TableManagement />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Configure your restaurant settings and preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF8E6] rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[#FFB800]" />
                  </div>
                  <h3 className="text-lg font-semibold">Restaurant Info</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your restaurant name, address, and contact information
                </p>
                <Button variant="outline" className="w-full">Edit Info</Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF0E6] rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#FF7300]" />
                  </div>
                  <h3 className="text-lg font-semibold">Operating Hours</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Set your restaurant's opening and closing hours
                </p>
                <Button variant="outline" className="w-full">Set Hours</Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure order and payment notifications
                </p>
                <Button variant="outline" className="w-full">Configure</Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 text-blue-600">🔒</div>
                  </div>
                  <h3 className="text-lg font-semibold">Security</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage passwords and security settings
                </p>
                <Button variant="outline" className="w-full">Security</Button>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Analytics & Finance</h1>
              <p className="text-muted-foreground">Track your restaurant's performance and financial metrics</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF8E6] rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#FFB800]" />
                  </div>
                  <h3 className="text-lg font-semibold">Sales Overview</h3>
                </div>
                <div className="h-40 flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
                  [Sales Chart]
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FFF0E6] rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[#FF7300]" />
                  </div>
                  <h3 className="text-lg font-semibold">Order Trends</h3>
                </div>
                <div className="h-40 flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
                  [Order Chart]
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <TableIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Table Utilization</h3>
                </div>
                <div className="h-40 flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
                  [Table Chart]
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 text-blue-600">💰</div>
                  </div>
                  <h3 className="text-lg font-semibold">Revenue Metrics</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Today's Revenue</span>
                    <span className="font-semibold">₹{orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.amount : 0), 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Orders</span>
                    <span className="font-semibold">{orders.filter(o => o.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Completed Orders</span>
                    <span className="font-semibold">{orders.filter(o => o.status === 'completed').length}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 text-purple-600">📊</div>
                  </div>
                  <h3 className="text-lg font-semibold">Top Items</h3>
                </div>
                <div className="h-40 flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
                  [Top Items Chart]
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 text-orange-600">⏰</div>
                  </div>
                  <h3 className="text-lg font-semibold">Peak Hours</h3>
                </div>
                <div className="h-40 flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
                  [Peak Hours Chart]
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 