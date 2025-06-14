'use client';

import { useState } from 'react';
import { Search, Clock, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const orders = [
  {
    id: '1',
    restaurant: 'The Tasty Corner',
    items: [
      {
        name: 'Butter Chicken',
        quantity: 1,
        variant: { size: 'Large', price: 450 },
        addOns: [
          { name: 'Extra Butter', price: 30 }
        ],
        price: 450
      },
      {
        name: 'Naan',
        quantity: 2,
        price: 40
      },
    ],
    status: 'Delivered',
    date: '2024-03-08',
    total: 510,
  },
  {
    id: '2',
    restaurant: 'Sushi Master',
    items: [
      { name: 'California Roll', quantity: 2, price: 12.99 },
      { name: 'Miso Soup', quantity: 1, price: 4.99 },
    ],
    status: 'In Progress',
    date: '2024-03-08',
    total: 30.97,
  },
  {
    id: '3',
    restaurant: 'Pizza Paradise',
    items: [
      { name: 'Pepperoni Pizza', quantity: 1, price: 16.99 },
      { name: 'Garlic Bread', quantity: 1, price: 5.99 },
    ],
    status: 'Cancelled',
    date: '2024-03-07',
    total: 22.98,
  },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{order.restaurant}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className={`text-sm px-2 py-1 rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date: {order.date}</p>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                        {item.variant && ` (${item.variant.size})`}
                        {item.addOns && item.addOns.length > 0 && (
                          <span className="text-gray-500 text-xs block ml-4">
                            + {item.addOns.map(addon => addon.name).join(', ')}
                          </span>
                        )}
                      </span>
                      <span>₹{(
                        (item.variant?.price || item.price) +
                        (item.addOns?.reduce((sum, addon) => sum + addon.price, 0) || 0)
                      ) * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                  {order.status === 'In Progress' && (
                    <Button variant="destructive" className="w-full">
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 