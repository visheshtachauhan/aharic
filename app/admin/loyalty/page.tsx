'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/components/ui/notification';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Trash2, Plus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TierReward {
  ordersRequired: number;
  reward: {
    type: 'free_item' | 'discount' | 'cashback';
    value: string;
    description: string;
  };
}

interface LoyaltySettings {
  firstOrderDiscount: {
    enabled: boolean;
    amount: number;
  };
  cashback: {
    enabled: boolean;
    percentage: number;
  };
  tieredRewards: {
    enabled: boolean;
    tiers: TierReward[];
  };
  oneClickCheckout: {
    enabled: boolean;
  };
}

export default function LoyaltySettingsPage() {
  const [settings, setSettings] = useState<LoyaltySettings>({
    firstOrderDiscount: { enabled: false, amount: 0 },
    cashback: { enabled: false, percentage: 0 },
    tieredRewards: { enabled: false, tiers: [] },
    oneClickCheckout: { enabled: false }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addNotification } = useNotifications();

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/restaurant/loyalty/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      } else {
        throw new Error(data.message);
      }
    } catch (error: unknown) {
      addNotification({
        title: 'Error',
        message: 'Failed to fetch loyalty settings',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/restaurant/loyalty/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      addNotification({
        title: 'Success',
        message: 'Loyalty settings saved successfully',
        type: 'success'
      });
    } catch (error: unknown) {
      addNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to save settings',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const addTier = () => {
    setSettings(prev => ({
      ...prev,
      tieredRewards: {
        ...prev.tieredRewards,
        tiers: [
          ...prev.tieredRewards.tiers,
          {
            ordersRequired: prev.tieredRewards.tiers.length + 3,
            reward: {
              type: 'free_item',
              value: '',
              description: ''
            }
          }
        ]
      }
    }));
  };

  const removeTier = (index: number) => {
    setSettings(prev => ({
      ...prev,
      tieredRewards: {
        ...prev.tieredRewards,
        tiers: prev.tieredRewards.tiers.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTier = (
    index: number,
    updates: Partial<TierReward> | { reward: Partial<TierReward['reward']> }
  ) => {
    setSettings(prev => ({
      ...prev,
      tieredRewards: {
        ...prev.tieredRewards,
        tiers: prev.tieredRewards.tiers.map((tier, i) => {
          if (i !== index) return tier;

          if ('reward' in updates) {
            return {
              ...tier,
              reward: { ...tier.reward, ...updates.reward }
            };
          }
          return { ...tier, ...updates };
        })
      }
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Loyalty & Rewards Settings</h1>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* First Order Discount */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">First Order Discount</h2>
              <p className="text-muted-foreground">
                Offer a one-time discount to first-time customers
              </p>
            </div>
            <Switch
              checked={settings.firstOrderDiscount.enabled}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  firstOrderDiscount: { ...prev.firstOrderDiscount, enabled: checked }
                }))
              }
            />
          </div>

          <AnimatePresence>
            {settings.firstOrderDiscount.enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  <div>
                    <Label>Discount Amount (₹)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[settings.firstOrderDiscount.amount]}
                        onValueChange={([value]) =>
                          setSettings(prev => ({
                            ...prev,
                            firstOrderDiscount: { ...prev.firstOrderDiscount, amount: value }
                          }))
                        }
                        max={500}
                        step={10}
                        className="flex-1"
                      />
                      <span className="font-medium">₹{settings.firstOrderDiscount.amount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Cashback Settings */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Cashback Rewards</h2>
              <p className="text-muted-foreground">
                Give customers cashback on their orders
              </p>
            </div>
            <Switch
              checked={settings.cashback.enabled}
              onCheckedChange={(checked) =>
                setSettings(prev => ({
                  ...prev,
                  cashback: { ...prev.cashback, enabled: checked }
                }))
              }
            />
          </div>

          <AnimatePresence>
            {settings.cashback.enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  <div>
                    <Label>Cashback Percentage (%)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[settings.cashback.percentage]}
                        onValueChange={([value]) =>
                          setSettings(prev => ({
                            ...prev,
                            cashback: { ...prev.cashback, percentage: value }
                          }))
                        }
                        max={20}
                        step={1}
                      />
                      <span className="font-medium">{settings.cashback.percentage}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Tiered Rewards */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Tiered Rewards</h2>
              <p className="text-muted-foreground">
                Reward customers based on their order count
              </p>
            </div>
            <Button onClick={addTier}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tier
            </Button>
          </div>

          <div className="space-y-4">
            {settings.tieredRewards.tiers.map((tier, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <Label>Tier {index + 1}</Label>
                  <p className="text-muted-foreground">Orders Required: {tier.ordersRequired}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Label>Reward Type</Label>
                  <Select
                    value={tier.reward.type}
                    onValueChange={(value) =>
                      updateTier(index, {
                        reward: {
                          type: value as TierReward['reward']['type']
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free_item">Free Item</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="cashback">Cashback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Label>Reward Value</Label>
                  <Input
                    value={tier.reward.value}
                    onChange={(e) =>
                      updateTier(index, {
                        reward: {
                          ...tier.reward,
                          value: e.target.value
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label>Reward Description</Label>
                  <Input
                    value={tier.reward.description}
                    onChange={(e) =>
                      updateTier(index, {
                        reward: {
                          ...tier.reward,
                          description: e.target.value
                        },
                      })
                    }
                  />
                </div>
                <Button onClick={() => removeTier(index)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Tier
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}