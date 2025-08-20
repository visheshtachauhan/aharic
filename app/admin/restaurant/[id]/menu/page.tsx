'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
  id: string;
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

// Mock data for demonstration
const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Tender chicken pieces in rich, creamy tomato sauce',
    price: 22.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Biryani',
    description: 'Fragrant basmati rice cooked with aromatic spices',
    price: 19.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in spiced yogurt',
    price: 18.99,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  },
];

const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<NewMenuItem>({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSave = (item: MenuItem) => {
    setItems(items.map(i => i.id === item.id ? item : i));
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    const newId = (Math.max(...items.map(i => parseInt(i.id))) + 1).toString();
    const newMenuItem: MenuItem = {
      id: newId,
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: newItem.image,
    };
    setItems([...items, newMenuItem]);
    setShowAddForm(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
    });
  };

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
            <Button variant="ghost" onClick={() => setShowAddForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
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
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full p-2 border rounded-md"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                placeholder="/images/item.jpg"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAdd}>
              <Save className="mr-2 h-4 w-4" />
              Save Item
            </Button>
          </div>
        </Card>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={item.image}
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
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              {editingItem?.id === item.id ? (
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
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  />
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingItem(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSave(editingItem)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <span className="font-medium">${item.price}</span>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 