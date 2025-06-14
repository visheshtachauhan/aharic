'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notification';
import { motion } from 'framer-motion';
import { PhoneVerification } from '@/components/loyalty/PhoneVerification';
import { RewardsDisplay } from '@/components/loyalty/RewardsDisplay';
import { OneClickCheckout } from '@/components/loyalty/OneClickCheckout';

interface CheckoutProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  onCheckoutComplete: () => void;
}

export default function Checkout({ items, onCheckoutComplete }: CheckoutProps) {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [loyaltySettings, setLoyaltySettings] = useState<any>(null);
  const [appliedCashback, setAppliedCashback] = useState(0);
  const [appliedReward, setAppliedReward] = useState<any>(null);
  const { addNotification } = useNotifications();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - appliedCashback - (appliedReward?.value || 0));

  useEffect(() => {
    fetchLoyaltySettings();
  }, []);

  const fetchLoyaltySettings = async () => {
    try {
      const response = await fetch('/api/restaurant/loyalty/settings');
      const data = await response.json();
      if (data.success) {
        setLoyaltySettings(data.settings);
        
        // Show phone verification dialog if first order discount is enabled
        if (data.settings.firstOrderDiscount.enabled) {
          setShowPhoneVerification(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch loyalty settings:', error);
    }
  };

  const handlePhoneVerified = async (phone: string) => {
    setPhoneNumber(phone);
    setShowPhoneVerification(false);

    try {
      // Check if this is a first-time customer
      const response = await fetch(`/api/restaurant/loyalty/customers?phone=${phone}`);
      const data = await response.json();
      
      if (data.success && data.isNewCustomer && loyaltySettings?.firstOrderDiscount?.enabled) {
        // Apply first order discount
        const discount = loyaltySettings.firstOrderDiscount.amount;
        setAppliedCashback(discount);
        addNotification({
          title: 'Discount Applied!',
          message: `₹${discount} first order discount has been applied to your order.`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error checking customer status:', error);
    }
  };

  const handleUseCashback = (amount: number) => {
    const maxCashback = Math.min(amount, subtotal);
    setAppliedCashback(maxCashback);
    addNotification({
      title: 'Cashback Applied',
      message: `₹${maxCashback} cashback has been applied to your order.`,
      type: 'success'
    });
  };

  const handleUseReward = (reward: any) => {
    setAppliedReward(reward);
    addNotification({
      title: 'Reward Applied',
      message: `${reward.description} has been applied to your order.`,
      type: 'success'
    });
  };

  const handleQuickCheckout = async (paymentMethod: any) => {
    try {
      // Process payment using saved payment method
      // Update order with loyalty information
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          total,
          phoneNumber,
          appliedCashback,
          appliedReward,
          paymentMethod
        })
      });

      onCheckoutComplete();
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">Subtotal</p>
                <p className="font-medium">₹{subtotal}</p>
              </div>
              {appliedCashback > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <p>Cashback Applied</p>
                  <p>-₹{appliedCashback}</p>
                </div>
              )}
              {appliedReward && (
                <div className="flex justify-between items-center text-orange-600">
                  <p>{appliedReward.description}</p>
                  <p>-₹{appliedReward.value}</p>
                </div>
              )}
              <div className="flex justify-between items-center font-bold text-lg mt-2">
                <p>Total</p>
                <p>₹{total}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Loyalty Section */}
        {!phoneNumber ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Unlock Rewards & Cashback</h3>
                  <p className="text-muted-foreground">
                    Sign in with your phone number to access exclusive benefits
                  </p>
                </div>
                <Button onClick={() => setShowPhoneVerification(true)}>
                  Sign In
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Rewards Display */}
            <RewardsDisplay
              phoneNumber={phoneNumber}
              onUseCashback={handleUseCashback}
              onUseReward={handleUseReward}
            />

            {/* One-Click Checkout */}
            {loyaltySettings?.oneClickCheckout?.enabled && (
              <OneClickCheckout
                phoneNumber={phoneNumber}
                totalAmount={total}
                onCheckout={handleQuickCheckout}
              />
            )}
          </>
        )}

        {/* Regular Checkout Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            // Handle regular checkout process
          }}
        >
          Proceed to Payment
        </Button>
      </div>

      {/* Phone Verification Dialog */}
      <PhoneVerification
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        onVerified={handlePhoneVerified}
        firstOrderDiscount={loyaltySettings?.firstOrderDiscount?.enabled ? loyaltySettings.firstOrderDiscount.amount : 0}
      />
    </div>
  );
} 