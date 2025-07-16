'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { useParams } from "next/navigation";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  isRecommended?: boolean;
}

interface MockRestaurant {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    coverImage: string;
    logo: string;
    openingHours: {
        [key: string]: { open: string; close: string };
    };
    deliverySettings: {
        isDeliveryAvailable: boolean;
        minimumOrder: number;
        deliveryFee: number;
        deliveryRadius: number;
    };
    socialMedia: {
        facebook: string;
        instagram: string;
        twitter: string;
    };
}

export default function RestaurantManagement() {
  const params = useParams() || {};
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Mock data for development
  const mockRestaurant: MockRestaurant = {
    id: params.id as string,
    name: "Spice Garden",
    description: "Authentic Indian cuisine in a modern setting",
    address: "123 Main Street, City",
    phone: "+1 234 567 8900",
    email: "contact@spicegarden.com",
    coverImage: "https://placehold.co/600x400/png",
    logo: "https://placehold.co/400x400/png",
    openingHours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "12:00", close: "22:00" }
    },
    deliverySettings: {
      isDeliveryAvailable: true,
      minimumOrder: 500,
      deliveryFee: 50,
      deliveryRadius: 5
    },
    socialMedia: {
      facebook: "https://facebook.com/spicegarden",
      instagram: "https://instagram.com/spicegarden",
      twitter: "https://twitter.com/spicegarden"
    }
  };

  const [coverImage, setCoverImage] = useState(mockRestaurant.coverImage || "");
  const [logo, setLogo] = useState(mockRestaurant.logo || "");

  const handleSaveBasicInfo = () => {
    // TODO: Implement save functionality
  };

  const handleSaveMenu = () => {
    // TODO: Implement save functionality
  };

  const handleSaveTables = () => {
    // TODO: Implement save functionality
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Management</h1>
      
      <Tabs defaultValue="basic-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic-info" className="space-y-4">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input id="name" defaultValue={mockRestaurant.name} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue={mockRestaurant.description} />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={mockRestaurant.address} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={mockRestaurant.phone} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={mockRestaurant.email} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Cover Image</Label>
                  <ImageUpload
                    value={coverImage}
                    onChange={setCoverImage}
                  />
                </div>
                <div>
                  <Label>Logo</Label>
                  <ImageUpload
                    value={logo}
                    onChange={setLogo}
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleSaveBasicInfo} className="mt-6">
              Save Changes
            </Button>
          </Card>
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Menu Items</h2>
              <Button>Add New Item</Button>
            </div>
            <div className="space-y-4">
              {/* Menu Items List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="relative h-40 mb-4">
                      <ImageUpload
                        value={item.image}
                        onChange={(newUrl) => {
                          const newMenuItems = menuItems.map(mi => 
                            mi.id === item.id ? { ...mi, image: newUrl } : mi
                          );
                          setMenuItems(newMenuItems);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Item Name" defaultValue={item.name} />
                      <Textarea placeholder="Description" defaultValue={item.description} />
                      <Input type="number" placeholder="Price" defaultValue={item.price} />
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch id={`veg-${item.id}`} />
                          <Label htmlFor={`veg-${item.id}`}>Vegetarian</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id={`spicy-${item.id}`} />
                          <Label htmlFor={`spicy-${item.id}`}>Spicy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id={`available-${item.id}`} />
                          <Label htmlFor={`available-${item.id}`}>Available</Label>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <Button onClick={handleSaveMenu} className="mt-6">
              Save Menu Changes
            </Button>
          </Card>
        </TabsContent>

        {/* Tables Tab */}
        <TabsContent value="tables" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Table Management</h2>
              <Button>Add New Table</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* You can map over real table data here */}
            </div>
            <Button onClick={handleSaveTables} className="mt-6">
              Save Table Changes
            </Button>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Restaurant Settings</h2>
            <div className="space-y-6">
              {/* Opening Hours */}
              <div>
                <h3 className="text-lg font-medium mb-4">Opening Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(mockRestaurant.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <Label className="capitalize w-24">{day}</Label>
                      <Input type="time" defaultValue={hours.open} className="w-32" />
                      <span>to</span>
                      <Input type="time" defaultValue={hours.close} className="w-32" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Delivery Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="delivery-available" defaultChecked={mockRestaurant.deliverySettings.isDeliveryAvailable} />
                    <Label htmlFor="delivery-available">Delivery Available</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="min-order">Minimum Order</Label>
                      <Input id="min-order" type="number" defaultValue={mockRestaurant.deliverySettings.minimumOrder} />
                    </div>
                    <div>
                      <Label htmlFor="delivery-fee">Delivery Fee</Label>
                      <Input id="delivery-fee" type="number" defaultValue={mockRestaurant.deliverySettings.deliveryFee} />
                    </div>
                    <div>
                      <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                      <Input id="delivery-radius" type="number" defaultValue={mockRestaurant.deliverySettings.deliveryRadius} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}