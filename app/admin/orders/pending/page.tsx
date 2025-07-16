'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, ChevronDown } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types';

export default function PendingOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'amount'>('time');
  const { getOrdersByStatus } = useOrders();

  // Get orders by status
  const pendingOrders = getOrdersByStatus('pending');
  const inProgressOrders = getOrdersByStatus('in-progress');

  // Filter orders based on search query
  const filterOrders = (orders: Order[]) => {
    if (!searchQuery) return orders;
    return orders.filter(order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredPending = filterOrders(pendingOrders);

  return (
    <div className="min-h-screen bg-[#FFF6F0] p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-[#FF7300]" />
          <h1 className="text-xl font-semibold text-[#2D2D2D]">Order Management</h1>
          <span className="bg-[#FFF0E6] text-[#FF7300] px-3 py-1 rounded-full text-sm font-medium">
            {pendingOrders.length + inProgressOrders.length} active
          </span>
        </div>
        <Button
          className="primary-gradient"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666]" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-[#FF7300]/20 focus:border-[#FF7300] focus:ring-[#FF7300]/20"
            />
          </div>
          <Button
            variant="outline"
            className="border-[#FF7300] text-[#FF7300] hover:bg-[#FF7300] hover:text-white"
            onClick={() => setSortBy(sortBy === 'time' ? 'amount' : 'time')}
          >
            Sort by {sortBy}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Standard orders list */}
      <div className="space-y-4">
        {filteredPending.map((order) => (
          <Card key={order.id} className="p-6">
            {/* Order card content */}
            <p>Order: {order.id}</p>
          </Card>
        ))}
        {filteredPending.length === 0 && (
          <div className="text-center py-8 text-[#666666]">
            No pending orders found
          </div>
        )}
      </div>
    </div>
  );
}