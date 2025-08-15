'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  tableNumber?: number;
  createdAt: string;
}

export default function OwnerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data for demo
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        customerName: 'John Doe',
        items: [
          { name: 'Butter Chicken', quantity: 2, price: 15.99 },
          { name: 'Naan Bread', quantity: 3, price: 2.99 }
        ],
        total: 38.95,
        status: 'pending',
        tableNumber: 5,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        items: [
          { name: 'Chicken Biryani', quantity: 1, price: 18.99 },
          { name: 'Raita', quantity: 1, price: 3.99 }
        ],
        total: 22.98,
        status: 'preparing',
        tableNumber: 3,
        createdAt: new Date().toISOString()
      }
    ];
    
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Orders...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Order #{order.id}
                    {order.tableNumber && (
                      <Badge variant="outline">Table {order.tableNumber}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {order.customerName} • {new Date(order.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-4">
                {order.status === 'pending' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                  >
                    Start Preparing
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                  >
                    Mark Ready
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button 
                    size="sm" 
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                  >
                    Mark Delivered
                  </Button>
                )}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No orders found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
