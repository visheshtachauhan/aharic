'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, ChevronDown, Clock } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useNotifications } from '@/components/ui/notification';
import { format } from 'date-fns';

export default function CompletedOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'amount'>('time');
  const { getOrdersByStatus } = useOrders();
  const { addNotification } = useNotifications();

  // Get completed orders
  const completedOrders = getOrdersByStatus('completed');

  // Filter orders based on search query
  const filteredOrders = completedOrders.filter(order =>
    order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'time') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.amount - a.amount;
  });

  return (
    <div className="min-h-screen bg-[#FFF6F0] p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-semibold text-[#2D2D2D]">Completed Orders</h1>
          <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            {completedOrders.length} completed
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
              placeholder="Search completed orders..." 
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

      {/* Completed Orders List */}
      <Card className="bg-white rounded-xl p-6">
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-[#FFF6F0] rounded-xl p-6 transition-all duration-300 hover:shadow-md cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#2D2D2D] group-hover:text-[#FF7300] transition-colors">
                    {order.table}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-[#666666]" />
                    <p className="text-sm text-[#666666]">
                      Completed {format(new Date(order.updatedAt), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#2D2D2D]">₹{order.amount}</p>
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                    Completed
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

              {order.specialInstructions && (
                <div className="mb-4 p-3 bg-white rounded-lg">
                  <p className="text-sm text-[#666666]">
                    <span className="font-medium">Special Instructions:</span> {order.specialInstructions}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#FF7300]/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-[#666666]">
                    Total Time: {format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-50 text-green-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {sortedOrders.length === 0 && (
            <div className="text-center py-8 text-[#666666]">
              No completed orders yet
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 