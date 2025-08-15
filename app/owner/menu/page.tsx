'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  preparationTime: number;
}

export default function OwnerMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: ''
  });

  const categories = [
    'Appetizers',
    'Main Course',
    'Desserts',
    'Beverages',
    'Breads',
    'Sides'
  ];

  // Mock data for demo
  useEffect(() => {
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken',
        price: 15.99,
        category: 'Main Course',
        image: '/images/placeholders/main-course.png',
        available: true,
        preparationTime: 20
      },
      {
        id: '2',
        name: 'Chicken Biryani',
        description: 'Fragrant rice dish with aromatic spices',
        price: 18.99,
        category: 'Main Course',
        image: '/images/placeholders/main-course.png',
        available: true,
        preparationTime: 25
      },
      {
        id: '3',
        name: 'Naan Bread',
        description: 'Soft and fluffy Indian bread',
        price: 2.99,
        category: 'Breads',
        image: '/images/placeholders/main-course.png',
        available: true,
        preparationTime: 5
      }
    ];
    
    setTimeout(() => {
      setMenuItems(mockMenuItems);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category) {
      return;
    }

    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: '/images/placeholders/main-course.png',
      available: true,
      preparationTime: parseInt(newItem.preparationTime) || 15
    };

    setMenuItems(prev => [...prev, newMenuItem]);
    setNewItem({ name: '', description: '', price: '', category: '', preparationTime: '' });
    setIsAddDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Menu...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Menu Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Add a new item to your menu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter item description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="prepTime">Prep Time (min)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={newItem.preparationTime}
                    onChange={(e) => setNewItem(prev => ({ ...prev, preparationTime: e.target.value }))}
                    placeholder="15"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addMenuItem}>
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge 
                className={`absolute top-2 right-2 ${
                  item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{item.name}</span>
                <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <div className="flex gap-2">
                <Badge variant="outline">{item.category}</Badge>
                <Badge variant="outline">{item.preparationTime} min</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={item.available ? "destructive" : "default"}
                  onClick={() => toggleAvailability(item.id)}
                  className="flex-1"
                >
                  {item.available ? 'Mark Unavailable' : 'Mark Available'}
                </Button>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No menu items found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
