'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from 'lucide-react';

// You might need to adjust this type based on your actual MenuItem schema
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/menu/items');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuItems(data.items);
    } catch (error: any) {
      toast.error(error.message || 'Could not fetch menu items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/menu/items/${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete item');
      }
      toast.success("Item deleted successfully.");
      setMenuItems(prev => prev.filter(i => i._id !== itemId));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item.");
    }
  }, []);

  if (loading) {
    return <div>Loading menu...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* This is a simplified placeholder.
            You can add a form here to create/edit items.
            For now, it just lists items.
        */}
        <div className="mb-4 text-right">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
            </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>{item.isAvailable ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}