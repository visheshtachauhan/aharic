'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/components/ui/notification';
import { motion, AnimatePresence } from 'framer-motion';

interface PhoneVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (phoneNumber: string) => void;
  firstOrderDiscount?: number;
}

export default function PhoneVerification({
  isOpen,
  onClose,
  onVerified,
  firstOrderDiscount = 0
}: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      addNotification({
        title: 'Error',
        message: 'Please enter a valid phone number',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }

      setStep('otp');
      addNotification({
        title: 'Success',
        message: 'OTP sent successfully',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send OTP',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      addNotification({
        title: 'Error',
        message: 'Please enter a valid OTP',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/otp', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify OTP');
      }

      onVerified(phoneNumber);
      onClose();
      addNotification({
        title: 'Success',
        message: 'Phone number verified successfully',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to verify OTP',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Verify Your Phone Number</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {firstOrderDiscount > 0 && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <p className="font-semibold">First Order Special!</p>
                        <p className="text-sm">Get ₹{firstOrderDiscount} off instantly</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={loading || phoneNumber.length !== 10}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter OTP</label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    OTP sent to {phoneNumber}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>

                <Button
                  variant="link"
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
} 