'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/components/ui/notification';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Trash2, Plus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/restaurant/loyalty/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to fetch loyalty settings',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error: any) {
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to save settings',
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

  const updateTier = (index: number, updates: Partial<TierReward>) => {
    setSettings(prev => ({
      ...prev,
      tieredRewards: {
        ...prev.tieredRewards,
        tiers: prev.tieredRewards.tiers.map((tier, i) => 
          i === index ? { ...tier, ...updates } : tier
        )
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
                        step={0.5}
                        className="flex-1"
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
                Set up milestone rewards for loyal customers
              </p>
            </div>
            <Switch
              checked={settings.tieredRewards.enabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  tieredRewards: { ...prev.tieredRewards, enabled: checked }
                }))
              }
            />
          </div>
          
          <AnimatePresence>
            {settings.tieredRewards.enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  {settings.tieredRewards.tiers.map((tier, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 bg-muted rounded-lg">
                      <div className="flex-1 space-y-4">
                        <div>
                          <Label>Orders Required</Label>
                          <Input
                            type="number"
                            value={tier.ordersRequired}
                            onChange={(e) => updateTier(index, { 
                              ordersRequired: parseInt(e.target.value) 
                            })}
                            min={1}
                          />
                        </div>
                        <div>
                          <Label>Reward Type</Label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={tier.reward.type}
                            onChange={(e) => updateTier(index, { 
                              reward: { ...tier.reward, type: e.target.value as any } 
                            })}
                          >
                            <option value="free_item">Free Item</option>
                            <option value="discount">Discount</option>
                            <option value="cashback">Cashback</option>
                          </select>
                        </div>
                        <div>
                          <Label>Reward Value</Label>
                          <Input
                            value={tier.reward.value}
                            onChange={(e) => updateTier(index, { 
                              reward: { ...tier.reward, value: e.target.value } 
                            })}
                            placeholder={tier.reward.type === 'free_item' ? 'Item name' : 'Amount'}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={tier.reward.description}
                            onChange={(e) => updateTier(index, { 
                              reward: { ...tier.reward, description: e.target.value } 
                            })}
                            placeholder="e.g., Free coffee after 5 orders"
                          />
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeTier(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addTier} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reward Tier
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* One-Click Checkout */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">One-Click Checkout</h2>
              <p className="text-muted-foreground">
                Enable faster checkout for returning customers
              </p>
            </div>
            <Switch
              checked={settings.oneClickCheckout.enabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  oneClickCheckout: { enabled: checked }
                }))
              }
            />
          </div>
        </Card>
      </div>

      {/* Preview Panel */}
      <Card className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
        <h2 className="text-xl font-semibold mb-4">Customer Preview</h2>
        <div className="space-y-4">
          {settings.firstOrderDiscount.enabled && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-lg">🔥</span>
                <p className="font-medium">
                  Get ₹{settings.firstOrderDiscount.amount} OFF on your first order!
                </p>
              </div>
            </div>
          )}
          
          {settings.cashback.enabled && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-lg">💰</span>
                <p className="font-medium">
                  Earn {settings.cashback.percentage}% cashback on every order
                </p>
              </div>
            </div>
          )}
          
          {settings.tieredRewards.enabled && settings.tieredRewards.tiers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-500 text-lg">🎁</span>
                <p className="font-medium">Rewards Program</p>
              </div>
              <div className="space-y-2">
                {settings.tieredRewards.tiers.map((tier, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <p>{tier.reward.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {settings.oneClickCheckout.enabled && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-lg">⚡</span>
                <p className="font-medium">One-Click Checkout Available</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 