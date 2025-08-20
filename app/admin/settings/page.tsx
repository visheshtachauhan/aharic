'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Store, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  Table, 
  MenuIcon,
  BarChart,
  Calendar,
  Printer,
  DollarSign,
  Percent,
  Users,
  Gift,
  Sparkles,
  Coins,
  Trophy
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNotifications } from '@/components/ui/notification';

export default function SettingsPage() {
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'The Tasty Corner',
    email: 'contact@tastycorner.com',
    phone: '+1 234 567 890',
    address: '123 Food Street, Cuisine City',
    website: 'www.tastycorner.com',
    openingTime: '09:00',
    closingTime: '22:00',
    currency: '₹',
    timezone: 'Asia/Kolkata',
    taxRate: '18',
    serviceCharge: '5'
  });

  const [notifications, setNotifications] = useState({
    orderNotifications: true,
    reservationNotifications: true,
    reviewNotifications: true,
    marketingEmails: false,
    lowStockAlerts: true,
    staffNotifications: true
  });

  const [userPreferences, setUserPreferences] = useState({
    darkMode: false,
    compactView: false,
    autoRefresh: true,
    soundEnabled: true
  });

  const [businessSettings, setBusinessSettings] = useState({
    autoAcceptOrders: true,
    requirePaymentUpfront: false,
    allowTableReservations: true,
    maxReservationDays: 30,
    reservationTimeSlots: 60,
    allowSplitBills: true,
    enableLoyaltyProgram: true,
    autoGratuity: false,
    autoGratuitySize: 6,
    autoGratuityPercent: 18
  });

  const [tableSettings, setTableSettings] = useState({
    enableQROrdering: true,
    autoAssignTables: true,
    showTableMap: true,
    requireServerPin: true,
    allowTableMerging: true,
    tableTimeout: 120,
    reservationBuffer: 15,
    maxPartySize: 20
  });

  const [menuSettings, setMenuSettings] = useState({
    showCalories: true,
    showAllergens: true,
    enableSpecials: true,
    allowCustomizations: true,
    showPreparationTime: true,
    autoHideOutOfStock: true,
    enableMenuScheduling: true,
    showPopularItems: true,
    enableItemPhotos: true,
    showSpiceLevels: true
  });

  const [analyticsSettings, setAnalyticsSettings] = useState({
    enableSalesTracking: true,
    trackInventory: true,
    enableStaffReports: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true,
    enableCustomerAnalytics: true,
    trackPopularItems: true,
    enablePeakHourAlerts: true,
    saveReports: true
  });

  const [loyaltySettings, setLoyaltySettings] = useState({
    firstOrderDiscount: {
      enabled: true,
      amount: 100
    },
    cashback: {
      enabled: true,
      percentage: 5
    },
    tieredRewards: {
      enabled: true,
      tiers: [
        { orders: 3, reward: 'Free Drink', description: 'Get a free drink of your choice' },
        { orders: 5, reward: '₹200 Off', description: '₹200 off on your next order' },
        { orders: 10, reward: 'Free Dessert', description: 'Complimentary dessert of your choice' }
      ]
    },
    oneClickCheckout: {
      enabled: true
    }
  });

  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchLoyaltySettings = async () => {
      try {
        const response = await fetch('/api/loyalty/settings');
        const data = await response.json();
        if (data.success) {
          setLoyaltySettings(data.settings);
        } else {
          throw new Error(data.message);
        }
      } catch (error: any) {
        console.error('Error fetching loyalty settings:', error);
        addNotification({
          title: 'Error',
          message: error.message || 'Failed to fetch loyalty settings',
          type: 'error'
        });
      }
    };

    fetchLoyaltySettings();
  }, []);

  const handleSaveLoyaltySettings = async () => {
    try {
      const response = await fetch('/api/loyalty/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loyaltySettings)
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      addNotification({
        title: 'Success',
        message: 'Loyalty settings saved successfully',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Error saving loyalty settings:', error);
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to save loyalty settings',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your restaurant settings and preferences
        </p>
      </div>

      <Tabs defaultValue="restaurant" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4 bg-muted p-1">
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Store className="w-5 h-5" />
              Restaurant Information
            </h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={restaurantSettings.name}
                  onChange={(e) =>
                    setRestaurantSettings({ ...restaurantSettings, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) =>
                      setRestaurantSettings({ ...restaurantSettings, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={restaurantSettings.phone}
                    onChange={(e) =>
                      setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={restaurantSettings.address}
                  onChange={(e) =>
                    setRestaurantSettings({ ...restaurantSettings, address: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={restaurantSettings.website}
                  onChange={(e) =>
                    setRestaurantSettings({ ...restaurantSettings, website: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="openingTime">Opening Time</Label>
                  <Input
                    id="openingTime"
                    type="time"
                    value={restaurantSettings.openingTime}
                    onChange={(e) =>
                      setRestaurantSettings({
                        ...restaurantSettings,
                        openingTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="closingTime">Closing Time</Label>
                  <Input
                    id="closingTime"
                    type="time"
                    value={restaurantSettings.closingTime}
                    onChange={(e) =>
                      setRestaurantSettings({
                        ...restaurantSettings,
                        closingTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={restaurantSettings.currency}
                  onValueChange={(value) =>
                    setRestaurantSettings({ ...restaurantSettings, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₹">₹ (INR)</SelectItem>
                    <SelectItem value="$">$ (USD)</SelectItem>
                    <SelectItem value="€">€ (EUR)</SelectItem>
                    <SelectItem value="£">£ (GBP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={restaurantSettings.timezone}
                  onValueChange={(value) =>
                    setRestaurantSettings({ ...restaurantSettings, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                    <SelectItem value="America/New_York">New York (EST)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={restaurantSettings.taxRate}
                  onChange={(e) =>
                    setRestaurantSettings({ ...restaurantSettings, taxRate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serviceCharge">Service Charge (%)</Label>
                <Input
                  id="serviceCharge"
                  type="number"
                  value={restaurantSettings.serviceCharge}
                  onChange={(e) =>
                    setRestaurantSettings({ ...restaurantSettings, serviceCharge: e.target.value })
                  }
                />
              </div>
            </div>
            <Button className="mt-6">Save Changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Business Operations
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Accept Orders</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically accept incoming orders
                  </p>
                </div>
                <Switch
                  checked={businessSettings.autoAcceptOrders}
                  onCheckedChange={(checked) =>
                    setBusinessSettings({ ...businessSettings, autoAcceptOrders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Payment Upfront</Label>
                  <p className="text-sm text-muted-foreground">
                    Customers must pay when placing orders
                  </p>
                </div>
                <Switch
                  checked={businessSettings.requirePaymentUpfront}
                  onCheckedChange={(checked) =>
                    setBusinessSettings({ ...businessSettings, requirePaymentUpfront: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Split Bills</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable bill splitting for customers
                  </p>
                </div>
                <Switch
                  checked={businessSettings.allowSplitBills}
                  onCheckedChange={(checked) =>
                    setBusinessSettings({ ...businessSettings, allowSplitBills: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Loyalty Program</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable customer loyalty rewards
                  </p>
                </div>
                <Switch
                  checked={businessSettings.enableLoyaltyProgram}
                  onCheckedChange={(checked) =>
                    setBusinessSettings({ ...businessSettings, enableLoyaltyProgram: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Gratuity</Label>
                  <p className="text-sm text-muted-foreground">
                    Add automatic gratuity for large parties
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={businessSettings.autoGratuity}
                    onCheckedChange={(checked) =>
                      setBusinessSettings({ ...businessSettings, autoGratuity: checked })
                    }
                  />
                  {businessSettings.autoGratuity && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="w-16"
                        value={businessSettings.autoGratuitySize}
                        onChange={(e) =>
                          setBusinessSettings({
                            ...businessSettings,
                            autoGratuitySize: parseInt(e.target.value)
                          })
                        }
                      />
                      <span className="text-sm">guests</span>
                      <Input
                        type="number"
                        className="w-16"
                        value={businessSettings.autoGratuityPercent}
                        onChange={(e) =>
                          setBusinessSettings({
                            ...businessSettings,
                            autoGratuityPercent: parseInt(e.target.value)
                          })
                        }
                      />
                      <span className="text-sm">%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Loyalty & Rewards
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>First Order Discount</Label>
                    <p className="text-sm text-muted-foreground">
                      Offer a discount for first-time customers
                    </p>
                  </div>
                  <Switch
                    checked={loyaltySettings.firstOrderDiscount.enabled}
                    onCheckedChange={(checked) =>
                      setLoyaltySettings({
                        ...loyaltySettings,
                        firstOrderDiscount: {
                          ...loyaltySettings.firstOrderDiscount,
                          enabled: checked
                        }
                      })
                    }
                  />
                </div>
                {loyaltySettings.firstOrderDiscount.enabled && (
                  <div className="pl-6">
                    <Label>Discount Amount (₹)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[loyaltySettings.firstOrderDiscount.amount]}
                        onValueChange={([value]) =>
                          setLoyaltySettings({
                            ...loyaltySettings,
                            firstOrderDiscount: {
                              ...loyaltySettings.firstOrderDiscount,
                              amount: value
                            }
                          })
                        }
                        max={500}
                        step={10}
                        className="w-[60%]"
                      />
                      <Input
                        type="number"
                        value={loyaltySettings.firstOrderDiscount.amount}
                        onChange={(e) =>
                          setLoyaltySettings({
                            ...loyaltySettings,
                            firstOrderDiscount: {
                              ...loyaltySettings.firstOrderDiscount,
                              amount: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Cashback</Label>
                    <p className="text-sm text-muted-foreground">
                      Give customers cashback on their orders
                    </p>
                  </div>
                  <Switch
                    checked={loyaltySettings.cashback.enabled}
                    onCheckedChange={(checked) =>
                      setLoyaltySettings({
                        ...loyaltySettings,
                        cashback: {
                          ...loyaltySettings.cashback,
                          enabled: checked
                        }
                      })
                    }
                  />
                </div>
                {loyaltySettings.cashback.enabled && (
                  <div className="pl-6">
                    <Label>Cashback Percentage (%)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[loyaltySettings.cashback.percentage]}
                        onValueChange={([value]) =>
                          setLoyaltySettings({
                            ...loyaltySettings,
                            cashback: {
                              ...loyaltySettings.cashback,
                              percentage: value
                            }
                          })
                        }
                        max={20}
                        step={1}
                        className="w-[60%]"
                      />
                      <Input
                        type="number"
                        value={loyaltySettings.cashback.percentage}
                        onChange={(e) =>
                          setLoyaltySettings({
                            ...loyaltySettings,
                            cashback: {
                              ...loyaltySettings.cashback,
                              percentage: parseInt(e.target.value) || 0
                            }
                          })
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tiered Rewards</Label>
                    <p className="text-sm text-muted-foreground">
                      Set up a tiered reward system for loyal customers
                    </p>
                  </div>
                  <Switch
                    checked={loyaltySettings.tieredRewards.enabled}
                    onCheckedChange={(checked) =>
                      setLoyaltySettings({
                        ...loyaltySettings,
                        tieredRewards: {
                          ...loyaltySettings.tieredRewards,
                          enabled: checked
                        }
                      })
                    }
                  />
                </div>
                {loyaltySettings.tieredRewards.enabled && (
                  <div className="pl-6 space-y-4">
                    {loyaltySettings.tieredRewards.tiers.map((tier, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 items-start">
                        <div>
                          <Label>Orders Required</Label>
                          <Input
                            type="number"
                            value={tier.orders}
                            onChange={(e) => {
                              const newTiers = [...loyaltySettings.tieredRewards.tiers];
                              newTiers[index] = {
                                ...tier,
                                orders: parseInt(e.target.value) || 0
                              };
                              setLoyaltySettings({
                                ...loyaltySettings,
                                tieredRewards: {
                                  ...loyaltySettings.tieredRewards,
                                  tiers: newTiers
                                }
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Reward</Label>
                          <Input
                            value={tier.reward}
                            onChange={(e) => {
                              const newTiers = [...loyaltySettings.tieredRewards.tiers];
                              newTiers[index] = {
                                ...tier,
                                reward: e.target.value
                              };
                              setLoyaltySettings({
                                ...loyaltySettings,
                                tieredRewards: {
                                  ...loyaltySettings.tieredRewards,
                                  tiers: newTiers
                                }
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={tier.description}
                            onChange={(e) => {
                              const newTiers = [...loyaltySettings.tieredRewards.tiers];
                              newTiers[index] = {
                                ...tier,
                                description: e.target.value
                              };
                              setLoyaltySettings({
                                ...loyaltySettings,
                                tieredRewards: {
                                  ...loyaltySettings.tieredRewards,
                                  tiers: newTiers
                                }
                              });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setLoyaltySettings({
                          ...loyaltySettings,
                          tieredRewards: {
                            ...loyaltySettings.tieredRewards,
                            tiers: [
                              ...loyaltySettings.tieredRewards.tiers,
                              { orders: 0, reward: '', description: '' }
                            ]
                          }
                        });
                      }}
                    >
                      Add Tier
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>One-Click Checkout</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable quick checkout for returning customers
                  </p>
                </div>
                <Switch
                  checked={loyaltySettings.oneClickCheckout.enabled}
                  onCheckedChange={(checked) =>
                    setLoyaltySettings({
                      ...loyaltySettings,
                      oneClickCheckout: {
                        enabled: checked
                      }
                    })
                  }
                />
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-medium mb-4">Customer Preview</h3>
                <div className="space-y-4">
                  {loyaltySettings.firstOrderDiscount.enabled && (
                    <div className="bg-orange-100 text-orange-800 p-3 rounded-md flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Get ₹{loyaltySettings.firstOrderDiscount.amount} OFF on your first order!</span>
                    </div>
                  )}
                  {loyaltySettings.cashback.enabled && (
                    <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      <span>Earn {loyaltySettings.cashback.percentage}% cashback on every order</span>
                    </div>
                  )}
                  {loyaltySettings.tieredRewards.enabled && loyaltySettings.tieredRewards.tiers[0] && (
                    <div className="bg-purple-100 text-purple-800 p-3 rounded-md flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>Order {loyaltySettings.tieredRewards.tiers[0].orders} times to get {loyaltySettings.tieredRewards.tiers[0].reward}!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button onClick={handleSaveLoyaltySettings} className="mt-6">
              Save Loyalty Settings
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Reservation Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Table Reservations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable online table reservations
                  </p>
                </div>
                <Switch
                  checked={businessSettings.allowTableReservations}
                  onCheckedChange={(checked) =>
                    setBusinessSettings({ ...businessSettings, allowTableReservations: checked })
                  }
                />
              </div>

              {businessSettings.allowTableReservations && (
                <>
                  <div className="grid gap-2">
                    <Label>Maximum Advance Booking (Days)</Label>
                    <Input
                      type="number"
                      value={businessSettings.maxReservationDays}
                      onChange={(e) =>
                        setBusinessSettings({
                          ...businessSettings,
                          maxReservationDays: parseInt(e.target.value)
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Reservation Time Slots (Minutes)</Label>
                    <Select
                      value={businessSettings.reservationTimeSlots.toString()}
                      onValueChange={(value) =>
                        setBusinessSettings({
                          ...businessSettings,
                          reservationTimeSlots: parseInt(value)
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Table className="w-5 h-5" />
              Table Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>QR Code Ordering</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable QR code-based ordering at tables
                  </p>
                </div>
                <Switch
                  checked={tableSettings.enableQROrdering}
                  onCheckedChange={(checked) =>
                    setTableSettings({ ...tableSettings, enableQROrdering: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Assign Tables</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign tables to incoming orders
                  </p>
                </div>
                <Switch
                  checked={tableSettings.autoAssignTables}
                  onCheckedChange={(checked) =>
                    setTableSettings({ ...tableSettings, autoAssignTables: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Table Merging</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow tables to be merged for larger groups
                  </p>
                </div>
                <Switch
                  checked={tableSettings.allowTableMerging}
                  onCheckedChange={(checked) =>
                    setTableSettings({ ...tableSettings, allowTableMerging: checked })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Table Timeout (Minutes)</Label>
                <Input
                  type="number"
                  value={tableSettings.tableTimeout}
                  onChange={(e) =>
                    setTableSettings({
                      ...tableSettings,
                      tableTimeout: parseInt(e.target.value)
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Time before marking an inactive table as available
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Maximum Party Size</Label>
                <Input
                  type="number"
                  value={tableSettings.maxPartySize}
                  onChange={(e) =>
                    setTableSettings({
                      ...tableSettings,
                      maxPartySize: parseInt(e.target.value)
                    })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MenuIcon className="w-5 h-5" />
              Menu Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Calories</Label>
                  <p className="text-sm text-muted-foreground">
                    Display calorie information for menu items
                  </p>
                </div>
                <Switch
                  checked={menuSettings.showCalories}
                  onCheckedChange={(checked) =>
                    setMenuSettings({ ...menuSettings, showCalories: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Allergens</Label>
                  <p className="text-sm text-muted-foreground">
                    Display allergen information for menu items
                  </p>
                </div>
                <Switch
                  checked={menuSettings.showAllergens}
                  onCheckedChange={(checked) =>
                    setMenuSettings({ ...menuSettings, showAllergens: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Specials</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable daily special menu items
                  </p>
                </div>
                <Switch
                  checked={menuSettings.enableSpecials}
                  onCheckedChange={(checked) =>
                    setMenuSettings({ ...menuSettings, enableSpecials: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Hide Out of Stock</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically hide items when out of stock
                  </p>
                </div>
                <Switch
                  checked={menuSettings.autoHideOutOfStock}
                  onCheckedChange={(checked) =>
                    setMenuSettings({ ...menuSettings, autoHideOutOfStock: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Preparation Time</Label>
                  <p className="text-sm text-muted-foreground">
                    Display estimated preparation time for items
                  </p>
                </div>
                <Switch
                  checked={menuSettings.showPreparationTime}
                  onCheckedChange={(checked) =>
                    setMenuSettings({ ...menuSettings, showPreparationTime: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Analytics & Reports
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sales Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track and analyze sales data
                  </p>
                </div>
                <Switch
                  checked={analyticsSettings.enableSalesTracking}
                  onCheckedChange={(checked) =>
                    setAnalyticsSettings({ ...analyticsSettings, enableSalesTracking: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inventory Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitor and track inventory levels
                  </p>
                </div>
                <Switch
                  checked={analyticsSettings.trackInventory}
                  onCheckedChange={(checked) =>
                    setAnalyticsSettings({ ...analyticsSettings, trackInventory: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Staff Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate staff performance reports
                  </p>
                </div>
                <Switch
                  checked={analyticsSettings.enableStaffReports}
                  onCheckedChange={(checked) =>
                    setAnalyticsSettings({ ...analyticsSettings, enableStaffReports: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Peak Hour Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notifications during peak business hours
                  </p>
                </div>
                <Switch
                  checked={analyticsSettings.enablePeakHourAlerts}
                  onCheckedChange={(checked) =>
                    setAnalyticsSettings({ ...analyticsSettings, enablePeakHourAlerts: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Automated Reports</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={analyticsSettings.dailyReports}
                      onCheckedChange={(checked) =>
                        setAnalyticsSettings({ ...analyticsSettings, dailyReports: checked })
                      }
                    />
                    <Label>Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={analyticsSettings.weeklyReports}
                      onCheckedChange={(checked) =>
                        setAnalyticsSettings({ ...analyticsSettings, weeklyReports: checked })
                      }
                    />
                    <Label>Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={analyticsSettings.monthlyReports}
                      onCheckedChange={(checked) =>
                        setAnalyticsSettings({ ...analyticsSettings, monthlyReports: checked })
                      }
                    />
                    <Label>Monthly</Label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Additional Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when inventory is running low
                  </p>
                </div>
                <Switch
                  checked={notifications.lowStockAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, lowStockAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Staff Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to staff members
                  </p>
                </div>
                <Switch
                  checked={notifications.staffNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, staffNotifications: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 