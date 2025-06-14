'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, IndianRupee, User, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/types/order';
import { useNotifications } from '@/components/ui/notification';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

export default function OrderDetailsModal({ 
  order, 
  isOpen, 
  onClose,
  onStatusChange 
}: OrderDetailsModalProps) {
  const { addNotification } = useNotifications();

  if (!order) return null;

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      try {
        onStatusChange(order.id, newStatus);
        addNotification({
          title: 'Order Updated',
          message: `Order status changed to ${newStatus}`,
          type: 'success'
        });
      } catch (error) {
        addNotification({
          title: 'Error',
          message: 'Failed to update order status',
          type: 'error'
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#FFF8E6] text-[#FFB800]';
      case 'in-progress':
        return 'bg-[#FFF0E6] text-[#FF7300]';
      case 'completed':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Order Details
            <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-[#666666]">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#666666]">Table</p>
              <p className="font-medium">{order.table}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#666666]">Created</p>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#666666]" />
                <p className="font-medium">
                  {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#666666]">Amount</p>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-[#666666]" />
                <p className="font-medium">{order.amount}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {order.customerName && (
            <div className="bg-[#FFF6F0] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#FF7300]" />
                <p className="font-medium">Customer Information</p>
              </div>
              <p className="text-sm text-[#666666]">{order.customerName}</p>
            </div>
          )}

          {/* Order Items */}
          <div>
            <p className="font-medium mb-3">Order Items</p>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF7300]"></span>
                    <p className="text-sm">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-[#666666]">x{item.quantity}</p>
                    <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#666666]" />
                <p className="font-medium">Special Instructions</p>
              </div>
              <p className="text-sm text-[#666666]">{order.specialInstructions}</p>
            </div>
          )}

          {/* Payment Status */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {order.paymentStatus === 'paid' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              <p className="font-medium">Payment Status</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              order.paymentStatus === 'paid'
                ? 'bg-green-50 text-green-600'
                : 'bg-yellow-50 text-yellow-600'
            }`}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
            </span>
          </div>

          {/* Action Buttons */}
          {order.status !== 'completed' && (
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                className="primary-gradient"
                onClick={() => handleStatusChange(
                  order.status === 'pending' ? 'in-progress' : 'completed'
                )}
              >
                {order.status === 'pending' ? 'Start Preparing' : 'Complete Order'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 