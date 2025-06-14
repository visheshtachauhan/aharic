import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, ShoppingBag, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface FavoriteOrder {
  items: Array<{
    menuItemId: MenuItem;
    quantity: number;
    customizations?: Record<string, any>;
  }>;
  savedAt: string;
}

interface FavoriteOrdersProps {
  orders: FavoriteOrder[];
  onReorder: (items: FavoriteOrder['items']) => void;
  className?: string;
}

export function FavoriteOrders({ orders, onReorder, className = '' }: FavoriteOrdersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!orders.length) return null;

  const calculateTotal = (items: FavoriteOrder['items']) => {
    return items.reduce((total, item) => total + (item.menuItemId.price * item.quantity), 0);
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : '64px' }}
        className="relative"
      >
        {/* Header - Always visible */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-pink-50 to-pink-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <div>
              <p className="font-medium">Your Favorite Orders</p>
              <p className="text-sm text-muted-foreground">Quick reorder your usual</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScrollArea className="h-[300px] p-4">
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white border rounded-lg space-y-3 hover:border-pink-200 transition-colors"
                    >
                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                              <Image
                                src={item.menuItemId.image}
                                alt={item.menuItemId.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.menuItemId.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ₹{item.menuItemId.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            Saved {new Date(order.savedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium">₹{calculateTotal(order.items)}</p>
                      </div>

                      {/* Reorder Button */}
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorder(order.items);
                        }}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  );
} 