'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Coins, Trophy, ChevronDown, ChevronUp, Gift, CreditCard, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardsDisplayProps {
  phoneNumber: string;
  firstOrderDiscount?: number;
  cashbackBalance: number;
  totalOrders: number;
  nextReward?: {
    ordersRequired: number;
    reward: string;
    description: string;
  };
  onUseCashback?: () => void;
  onUseReward: (reward: any) => void;
  className?: string;
}

interface CustomerRewards {
  totalOrders: number;
  cashbackBalance: number;
  rewardsTier: number;
  availableRewards: Array<{
    type: 'free_item' | 'discount' | 'cashback';
    value: string;
    description: string;
  }>;
  nextReward?: {
    ordersRequired: number;
    reward: {
      type: 'free_item' | 'discount' | 'cashback';
      value: string;
      description: string;
    };
  };
}

export default function RewardsDisplay({
  phoneNumber,
  firstOrderDiscount,
  cashbackBalance,
  totalOrders,
  nextReward,
  onUseCashback,
  onUseReward,
  className = ''
}: RewardsDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rewards, setRewards] = useState<CustomerRewards | null>(null);
  const [loading, setLoading] = useState(true);

  const progress = nextReward
    ? ((totalOrders % nextReward.ordersRequired) / nextReward.ordersRequired) * 100
    : 0;

  useEffect(() => {
    fetchRewards();
  }, [phoneNumber]);

  const fetchRewards = async () => {
    try {
      const response = await fetch(`/api/restaurant/loyalty/customers?phone=${phoneNumber}`);
      const data = await response.json();
      if (data.success) {
        setRewards(data.customerData);
      }
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (!rewards) {
    return null;
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : '64px' }}
        className="relative"
      >
        {/* Header - Always visible */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-orange-50 to-orange-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-orange-500" />
            <div>
              <p className="font-medium">Your Rewards</p>
              <p className="text-sm text-muted-foreground">{phoneNumber}</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              {/* First Order Discount */}
              {firstOrderDiscount && firstOrderDiscount > 0 && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 text-orange-800 rounded-lg">
                  <Sparkles className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">First Order Discount</p>
                    <p className="text-sm">Get ₹{firstOrderDiscount} off on your first order!</p>
                  </div>
                </div>
              )}

              {/* Cashback Card */}
              {cashbackBalance > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Available Cashback</p>
                          <p className="text-2xl font-bold">₹{cashbackBalance}</p>
                        </div>
                      </div>
                      {onUseCashback && (
                        <Button onClick={() => onUseCashback()}>
                          Use Now
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Available Rewards */}
              {rewards.availableRewards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Available Rewards</h3>
                    <div className="space-y-3">
                      {rewards.availableRewards.map((reward, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                              <Gift className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <p className="font-medium">{reward.description}</p>
                          </div>
                          <Button variant="outline" onClick={() => onUseReward(reward)}>
                            Redeem
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Next Reward Progress */}
              {nextReward && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Next Reward</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">
                          {nextReward.ordersRequired - (totalOrders % nextReward.ordersRequired)} orders away from{' '}
                          {nextReward.description}
                        </p>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-orange-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(totalOrders / nextReward.ordersRequired) * 100}%`
                          }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  );
} 