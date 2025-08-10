'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Search, Clock, Plus } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useNotifications } from '@/components/ui/notification';
import { format, isValid } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const { updateOrder } = useOrders();
  const { addNotification } = useNotifications();

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (error: unknown) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6F0] p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm mb-6">
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
      <div className="bg-white rounded-xl p-4 mb-6">
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
    </div>
  );
}