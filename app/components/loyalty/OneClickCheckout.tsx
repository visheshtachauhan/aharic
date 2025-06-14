'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notification';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, CreditCard, Smartphone } from 'lucide-react';

interface SavedPaymentMethod {
  type: 'upi' | 'card' | 'wallet';
  token: string;
  lastUsed: string;
  displayInfo: string;
}

interface OneClickCheckoutProps {
  phoneNumber: string;
  totalAmount: number;
  onCheckout: (paymentMethod: SavedPaymentMethod) => Promise<void>;
}

export default function OneClickCheckout({
  phoneNumber,
  totalAmount,
  onCheckout
}: OneClickCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([]);
  const { addNotification } = useNotifications();

  const fetchSavedPaymentMethods = async () => {
    try {
      const response = await fetch(`/api/restaurant/loyalty/customers?phone=${phoneNumber}`);
      const data = await response.json();
      if (data.success && data.customerData?.savedPaymentMethods) {
        setSavedMethods(data.customerData.savedPaymentMethods);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const handleQuickCheckout = async (method: SavedPaymentMethod) => {
    setLoading(true);
    try {
      await onCheckout(method);
      addNotification({
        title: 'Success',
        message: 'Payment processed successfully',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to process payment',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'upi':
        return <Smartphone className="w-5 h-5" />;
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {savedMethods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Checkout
                </h3>
                <span className="text-sm text-muted-foreground">
                  Total: ₹{totalAmount}
                </span>
              </div>

              <div className="space-y-2">
                {savedMethods.map((method, index) => (
                  <motion.div
                    key={method.token}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between hover:bg-white/50 dark:hover:bg-white/10"
                      onClick={() => handleQuickCheckout(method)}
                      disabled={loading}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                          {getPaymentIcon(method.type)}
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{method.displayInfo}</p>
                          <p className="text-xs text-muted-foreground">
                            Last used: {new Date(method.lastUsed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 