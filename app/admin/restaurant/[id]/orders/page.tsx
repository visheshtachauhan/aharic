'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
}

// Mock data for demonstration
const orders: Order[] = [
  {
    id: '1',
    tableNumber: '5',
    items: [
      {
        id: '1',
        name: 'Butter Chicken',
        quantity: 2,
        price: 22.99,
        notes: 'Extra spicy',
      },
      {
        id: '2',
        name: 'Naan',
        quantity: 4,
        price: 3.99,
      },
    ],
    status: 'preparing',
    totalAmount: 53.94,
    createdAt: '2024-03-20T10:30:00Z',
    customerName: 'John Doe',
    customerPhone: '+1234567890',
  },
  {
    id: '2',
    tableNumber: '2',
    items: [
      {
        id: '3',
        name: 'Paneer Tikka',
        quantity: 1,
        price: 18.99,
      },
      {
        id: '4',
        name: 'Biryani',
        quantity: 1,
        price: 19.99,
      },
    ],
    status: 'ready',
    totalAmount: 38.98,
    createdAt: '2024-03-20T10:25:00Z',
    customerName: 'Jane Smith',
    customerPhone: '+1987654321',
  },
  {
    id: '3',
    tableNumber: '8',
    items: [
      {
        id: '5',
        name: 'Tandoori Chicken',
        quantity: 1,
        price: 24.99,
      },
      {
        id: '6',
        name: 'Roti',
        quantity: 2,
        price: 2.99,
      },
    ],
    status: 'delivered',
    totalAmount: 30.97,
    createdAt: '2024-03-20T10:20:00Z',
    customerName: 'Mike Johnson',
    customerPhone: '+1122334455',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: Clock,
  preparing: AlertCircle,
  ready: CheckCircle2,
  delivered: CheckCircle2,
  cancelled: AlertCircle,
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setFilteredOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusLabel = (status: Order['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage customer orders</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders by table number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">Table {order.tableNumber}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                {order.customerName && (
                  <p className="text-sm text-gray-600 mt-1">
                    {order.customerName} • {order.customerPhone}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {formatTime(order.createdAt)}
                </p>
                <p className="text-lg font-semibold mt-1">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-4 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                    {item.notes && (
                      <span className="text-gray-500 ml-2">({item.notes})</span>
                    )}
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Status Update Buttons */}
            <div className="mt-6 flex space-x-2">
              {order.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(order.id, 'preparing')}
                >
                  Start Preparing
                </Button>
              )}
              {order.status === 'preparing' && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(order.id, 'ready')}
                >
                  Mark as Ready
                </Button>
              )}
              {order.status === 'ready' && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                >
                  Mark as Delivered
                </Button>
              )}
              {(order.status === 'pending' || order.status === 'preparing') && (
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 