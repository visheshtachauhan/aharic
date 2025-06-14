'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Coins, Trophy, ChevronDown, ChevronUp, Gift, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerRewards {
  cashbackBalance: number;
  totalOrders: number;
  availableRewards: Array<{
    id: string;
    name: string;
    description: string;
    value: number;
    expiresAt: string;
  }>;
  nextReward?: {
    ordersRequired: number;
    reward: string;
    description: string;
  };
}

interface RewardsDisplayProps {
  phoneNumber: string;
  onUseCashback: (amount: number) => void;
  onUseReward: (reward: any) => void;
  className?: string;
}

export function RewardsDisplay({
  phoneNumber,
  onUseCashback,
  onUseReward,
  className = ''
}: RewardsDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rewards, setRewards] = useState<CustomerRewards | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (!rewards) return null;

  const progress = rewards.nextReward
    ? ((rewards.totalOrders % rewards.nextReward.ordersRequired) / rewards.nextReward.ordersRequired) * 100
    : 0;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : '64px' }}
        className="relative"
      >
        {/* Header - Always visible */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-red-950"
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
        <div className="p-4 space-y-4">
          {/* Cashback Balance */}
          {rewards.cashbackBalance > 0 && (
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
                      <p className="text-2xl font-bold">₹{rewards.cashbackBalance}</p>
                    </div>
                  </div>
                  <Button onClick={() => onUseCashback(rewards.cashbackBalance)}>
                    Use Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Progress to Next Reward */}
          {rewards.nextReward && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Next Reward</span>
                <span>{rewards.totalOrders} / {rewards.nextReward.ordersRequired} orders</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {rewards.nextReward.description}
              </p>
            </div>
          )}

          {/* Available Rewards */}
          {rewards.availableRewards.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Available Rewards
              </h4>
              <div className="space-y-2">
                {rewards.availableRewards.map((reward) => (
                  <Card key={reward.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onUseReward(reward)}
                      >
                        Use
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Card>
  );
} 