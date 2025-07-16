'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/image-upload';

// Updated interfaces to reflect database structure (_id, etc.)
interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface NewMenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

interface Category {
    name: string;
    count: number;
    isActive: boolean;
}

export default function MenuPage() {
  const params = useParams() || {};
  const restaurantId = params.id;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<NewMenuItem>({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [menuRes, categoriesRes] = await Promise.all([
        fetch(`/api/restaurants/${restaurantId}/menu`),
        fetch('/api/menu/categories')
      ]);

      if (!menuRes.ok) throw new Error('Failed to fetch menu items');
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');

      const menuData = await menuRes.json();
      const categoriesData = await categoriesRes.json();

      setItems(menuData);
      setCategories(categoriesData.categories || []);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId, fetchData]);


  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSave = async (itemToSave: MenuItem) => {
    if (!itemToSave) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/menu`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: itemToSave._id, ...itemToSave }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save menu item');
      }
      
      toast.success('Menu item saved successfully!');
      setEditingItem(null);
      await fetchData(); // Refresh data
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
        const response = await fetch(`/api/restaurants/${restaurantId}/menu`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete menu item');
        }

        toast.success('Menu item deleted successfully!');
        await fetchData(); // Refresh data
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleAdd = async () => {
    if (!newItem.name || !newItem.price || !newItem.category) {
        toast.error('Please fill in all required fields: Name, Price, and Category.');
        return;
    }
    setIsSubmitting(true);
    try {
        const response = await fetch(`/api/restaurants/${restaurantId}/menu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newItem,
                price: parseFloat(newItem.price),
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add menu item');
        }
        
        toast.success('Menu item added successfully!');
        setShowAddForm(false);
        setNewItem({ name: '', description: '', price: '', category: '', image: '' });
        await fetchData(); // Refresh data
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Menu Item</h2>
            <Button variant="ghost" onClick={() => setShowAddForm(false)} disabled={isSubmitting}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name*</label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price*</label>
              <Input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Item description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category*</label>
              <select
                className="w-full p-2 border rounded-md"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Image</label>
              <ImageUpload 
                value={newItem.image}
                onChange={(url) => setNewItem({ ...newItem, image: url })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAdd} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Saving...' : 'Save Item'}
            </Button>
          </div>
        </Card>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={item.image || '/placeholder.png'}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              {editingItem?._id === item._id ? (
                <div className="space-y-4">
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                  <Textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                  <Input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                  />
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  >
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ImageUpload 
                    value={editingItem.image}
                    onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingItem(null)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSave(editingItem)} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="mt-2 text-lg font-semibold">${item.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
       {items.length === 0 && !isLoading && (
          <div className="text-center col-span-full py-12">
              <h3 className="text-xl font-medium">No menu items found.</h3>
              <p className="text-muted-foreground">Click "Add Menu Item" to get started.</p>
          </div>
       )}
    </div>
  );
} 