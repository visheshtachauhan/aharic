import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/components/ui/notification';
import { Sparkles, Coins, Trophy, Phone, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoyaltyData {
  points: number;
  tier: string;
  nextTierPoints: number;
  rewards: Array<{
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
  }>;
}

interface LoyaltyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function LoyaltyPopup({ isOpen, onClose, customerData }: LoyaltyPopupProps) {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setLoading(true);
    try {
      const response = await fetch('/api/loyalty/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      addNotification({
        title: 'Verification Code Sent',
        message: 'Please check your phone for the verification code',
        type: 'success'
      });

      setStep('verify');
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to send verification code',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) return;

    setLoading(true);
    try {
      const response = await fetch('/api/loyalty/customer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, verificationCode })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      onSuccess({
        phoneNumber,
        firstOrderDiscount: data.firstOrderDiscount,
        cashbackBalance: data.customer.cashbackBalance,
        availableRewards: data.customer.availableRewards
      });

      onClose();
    } catch (error: any) {
      console.error('Error verifying code:', error);
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to verify code',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-orange-500" />
            Unlock Special Rewards
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Enter your phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 text-orange-800 rounded-lg">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <span>Get instant discount on your first order!</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-lg">
                    <Coins className="w-5 h-5 text-green-500" />
                    <span>Earn cashback on every order</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 text-purple-800 rounded-lg">
                    <Trophy className="w-5 h-5 text-purple-500" />
                    <span>Unlock exclusive rewards as you order more</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePhoneSubmit}
                  disabled={!phoneNumber || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Get Verification Code
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Enter verification code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="text-lg tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    A 6-digit code has been sent to {phoneNumber}
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={handleVerifySubmit}
                    disabled={!verificationCode || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>
                  <Button
                    variant="link"
                    className="w-full"
                    onClick={() => setStep('phone')}
                    disabled={loading}
                  >
                    Change Phone Number
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 