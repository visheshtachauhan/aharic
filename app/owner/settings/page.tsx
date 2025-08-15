'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, CreditCard, Globe, Shield } from 'lucide-react';

export default function OwnerSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const [restaurant, setRestaurant] = useState({
    name: 'The Tasty Corner',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@tastycorner.com'
  });

  const [business, setBusiness] = useState({
    autoAcceptOrders: true,
    estimatedDeliveryTime: 30,
    minimumOrderAmount: 15,
    serviceCharge: 5,
    taxes: 8.5
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/owner/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            setRestaurant(data.settings.restaurant || restaurant);
            setBusiness(data.settings.business || business);
            setNotifications(data.settings.notifications || notifications);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save settings function
  const saveSettings = async (section: 'restaurant' | 'business' | 'notifications') => {
    try {
      setIsSaving(true);
      const payload = { [section]: section === 'restaurant' ? restaurant : section === 'business' ? business : notifications };
      
      const response = await fetch('/api/owner/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state with server response
          if (data.settings) {
            setRestaurant(data.settings.restaurant || restaurant);
            setBusiness(data.settings.business || business);
            setNotifications(data.settings.notifications || notifications);
          }
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Restaurant Settings</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Restaurant Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Restaurant Information
            </CardTitle>
            <CardDescription>
              Update your restaurant's basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={restaurant.name}
                onChange={(e) => setRestaurant(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Restaurant Name"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={restaurant.address}
                onChange={(e) => setRestaurant(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full Address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={restaurant.phone}
                  onChange={(e) => setRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={restaurant.email}
                  onChange={(e) => setRestaurant(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email Address"
                />
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => saveSettings('restaurant')}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Business Settings
            </CardTitle>
            <CardDescription>
              Configure your business operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-accept Orders</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically accept incoming orders
                </p>
              </div>
              <Switch
                checked={business.autoAcceptOrders}
                onCheckedChange={(checked) => setBusiness(prev => ({ ...prev, autoAcceptOrders: checked }))}
              />
            </div>
            
            <div>
              <Label htmlFor="deliveryTime">Estimated Delivery Time (minutes)</Label>
              <Input
                id="deliveryTime"
                type="number"
                value={business.estimatedDeliveryTime}
                onChange={(e) => setBusiness(prev => ({ ...prev, estimatedDeliveryTime: parseInt(e.target.value) || 0 }))}
                placeholder="30"
              />
            </div>
            
            <div>
              <Label htmlFor="minOrder">Minimum Order Amount ($)</Label>
              <Input
                id="minOrder"
                type="number"
                value={business.minimumOrderAmount}
                onChange={(e) => setBusiness(prev => ({ ...prev, minimumOrderAmount: parseFloat(e.target.value) || 0 }))}
                placeholder="15.00"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceCharge">Service Charge (%)</Label>
                <Input
                  id="serviceCharge"
                  type="number"
                  value={business.serviceCharge}
                  onChange={(e) => setBusiness(prev => ({ ...prev, serviceCharge: parseFloat(e.target.value) || 0 }))}
                  placeholder="5.0"
                />
              </div>
              <div>
                <Label htmlFor="taxes">Taxes (%)</Label>
                <Input
                  id="taxes"
                  type="number"
                  value={business.taxes}
                  onChange={(e) => setBusiness(prev => ({ ...prev, taxes: parseFloat(e.target.value) || 0 }))}
                  placeholder="8.5"
                />
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => saveSettings('business')}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Update Business Settings'}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => saveSettings('notifications')}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Access
            </CardTitle>
            <CardDescription>
              Manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <Badge variant="outline" className="w-fit">Not Enabled</Badge>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Last Login</Label>
              <p className="text-sm">Today at 2:30 PM</p>
              <p className="text-sm text-muted-foreground">
                From 192.168.1.100
              </p>
            </div>
            
            <Button variant="outline" className="w-full">Change Password</Button>
            <Button variant="outline" className="w-full">View Login History</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
