'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone, Share2, Heart, Table } from 'lucide-react';

// Mock data - replace with API calls later
const restaurant = {
  id: '1',
  name: 'The Tasty Corner',
  rating: 4.5,
  reviews: 1200,
  cuisine: 'Indian, Chinese, Continental',
  address: '123 Food Street, Cuisine Lane',
  phone: '+91 98765 43210',
  image: '/images/restaurant-cover.jpg',
  categories: ['All', 'Best Sellers', 'Recommended', 'New Arrivals', 'Combos'],
  menuItems: [
    {
      id: '1',
      name: 'Butter Chicken',
      description: 'Tender chicken in rich, creamy tomato sauce',
      price: 299,
      image: '/images/butter-chicken.jpg',
      category: 'Best Sellers',
    },
    {
      id: '2',
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese marinated in spiced yogurt',
      price: 249,
      image: '/images/paneer-tikka.jpg',
      category: 'Best Sellers',
    },
    {
      id: '3',
      name: 'Biryani',
      description: 'Fragrant basmati rice cooked with aromatic spices',
      price: 199,
      image: '/images/biryani.jpg',
      category: 'Recommended',
    },
  ],
};

interface PageProps {
  params: {
    id: string;
    tableNumber: string;
  };
}

export default function TableMenuPage({ params }: PageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredMenuItems = selectedCategory === 'All'
    ? restaurant.menuItems
    : restaurant.menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Table Info Banner */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            <span>Table {params.tableNumber}</span>
          </div>
          <Button variant="secondary" size="sm">
            Call Waiter
          </Button>
        </div>
      </div>

      {/* Restaurant Header */}
      <div className="relative h-[300px] w-full">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
              <span className="text-gray-300">({restaurant.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>30-40 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Phone className="h-4 w-4" />
              <span>{restaurant.phone}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 overflow-x-auto">
          <div className="flex gap-2">
            {restaurant.categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMenuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">₹{item.price}</span>
                  <Button onClick={() => {
                    // Add to cart logic here
                    setIsCartOpen(true);
                  }}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg" 
          className="rounded-full shadow-lg"
          onClick={() => setIsCartOpen(true)}
        >
          Cart ({cartItems.length})
        </Button>
      </div>

      {/* Cart Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Order</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                <span className="sr-only">Close</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            {/* Cart items will go here */}
            <div className="mt-6">
              <p className="text-center text-gray-500">Your cart is empty</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 