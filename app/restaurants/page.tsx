'use client';

import { useState } from 'react';
import { Star, Clock, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock data - replace with API calls later
const restaurants = [
  {
    id: '1',
    name: 'The Tasty Corner',
    cuisine: 'Indian, Chinese, Continental',
    rating: 4.5,
    reviews: 1200,
    deliveryTime: '30-40 min',
    address: '123 Food Street, Cuisine Lane',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Spice Garden',
    cuisine: 'North Indian, Mughlai',
    rating: 4.8,
    reviews: 850,
    deliveryTime: '40-50 min',
    address: '456 Spice Market, Food District',
    isOpen: true,
  },
  {
    id: '3',
    name: 'Sushi Master',
    cuisine: 'Japanese, Asian',
    rating: 4.6,
    reviews: 650,
    deliveryTime: '35-45 min',
    address: '789 Sushi Street, Asian Quarter',
    isOpen: false,
  },
  {
    id: '4',
    name: 'Pizza Paradise',
    cuisine: 'Italian, Fast Food',
    rating: 4.3,
    reviews: 950,
    deliveryTime: '25-35 min',
    address: '321 Pizza Lane, Italian District',
    isOpen: true,
  },
];

const filters = [
  'All',
  'Pure Veg',
  'Non-Veg',
  'Fast Food',
  'Fine Dining',
  'Cafes',
];

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover Amazing Food</h1>
        <p className="text-muted-foreground">
          Order from your favorite restaurants with just a scan
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="search"
            placeholder="Search for restaurants or cuisines..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              onClick={() => setSelectedFilter(filter)}
              className="whitespace-nowrap"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
              {!restaurant.isOpen && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full">
                    Closed
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <p className="text-muted-foreground mt-1">{restaurant.cuisine}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>2.5 km</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 