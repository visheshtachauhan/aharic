'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  price?: number;
  category: string;
  hasVariants: boolean;
  variants?: { size: string; price: number }[];
  allowCustomizations: boolean;
  availableAddOns?: { id: string; name: string; price: number }[];
}

interface OrderItem extends MenuItem {
  quantity: number;
  selectedVariant?: { size: string; price: number };
  selectedAddOns: { name: string; price: number }[];
}

export default function OrderCreationPage() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');

  // Sample menu items (replace with actual data from your database)
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Tandoori Chicken',
      category: 'Main Course',
      hasVariants: true,
      variants: [
        { size: 'Small', price: 250 },
        { size: 'Medium', price: 350 },
        { size: 'Large', price: 450 }
      ],
      allowCustomizations: true,
      availableAddOns: [
        { id: 'extra-masala', name: 'Extra Masala', price: 30 },
        { id: 'extra-chutney', name: 'Extra Chutney', price: 20 }
      ]
    },
    {
      id: '2',
      name: 'Veg Spring Rolls',
      price: 220,
      category: 'Starters',
      hasVariants: false,
      allowCustomizations: true,
      availableAddOns: [
        { id: 'extra-sauce', name: 'Extra Sauce', price: 15 }
      ]
    }
  ];

  const addItemToOrder = (item: MenuItem, variant?: { size: string; price: number }, addOns: { name: string; price: number }[] = []) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(i => 
        i.id === item.id && 
        (!variant || (i.selectedVariant?.size === variant.size))
      );

      if (existingItem) {
        return prev.map(i => 
          i.id === item.id && (!variant || (i.selectedVariant?.size === variant.size))
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, {
        ...item,
        quantity: 1,
        selectedVariant: variant,
        selectedAddOns: addOns
      }];
    });
  };

  const removeItemFromOrder = (itemId: string) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(i => i.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(i => 
          i.id === itemId 
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const itemPrice = item.selectedVariant?.price || item.price || 0;
      const addOnsTotal = item.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
      return total + ((itemPrice + addOnsTotal) * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tableNumber) {
      toast.error('Please enter a table number');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Please add at least one item to the order');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: tableNumber,
          items: selectedItems,
          amount: calculateTotal(),
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order created successfully');
        router.push('/admin/orders');
      } else {
        toast.error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Order</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Table Number</label>
          <Input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Enter table number"
            className="w-full max-w-xs"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <h3 className="font-medium">{item.name}</h3>
                {item.hasVariants ? (
                  <div className="space-y-2 mt-2">
                    {item.variants?.map(variant => (
                      <div key={variant.size} className="flex justify-between items-center">
                        <span>{variant.size}</span>
                        <div className="flex items-center gap-2">
                          <span>₹{variant.price}</span>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addItemToOrder(item, variant)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-between items-center mt-2">
                    <span>₹{item.price}</span>
                    <Button
                      type="button"
                      onClick={() => addItemToOrder(item)}
                    >
                      Add to Order
                    </Button>
                  </div>
                )}
                
                {item.allowCustomizations && item.availableAddOns && (
                  <div className="mt-4 border-t pt-2">
                    <p className="text-sm font-medium mb-2">Available Add-ons:</p>
                    <div className="space-y-1">
                      {item.availableAddOns.map(addon => (
                        <div key={addon.id} className="flex justify-between items-center text-sm">
                          <span>{addon.name}</span>
                          <span>+₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Selected Items</h2>
            <div className="space-y-2">
              {selectedItems.map((item, index) => (
                <div key={`${item.id}-${item.selectedVariant?.size || ''}-${index}`} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium">
                      {item.name}
                      {item.selectedVariant && ` (${item.selectedVariant.size})`}
                    </span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                    {item.selectedAddOns.length > 0 && (
                      <div className="text-sm text-gray-500">
                        Add-ons: {item.selectedAddOns.map(addon => addon.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>₹{(item.selectedVariant?.price || item.price || 0) * item.quantity}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeItemFromOrder(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'upi')}
            className="w-full max-w-xs p-2 border rounded"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Create Order
        </Button>
      </form>
    </div>
  );
} 