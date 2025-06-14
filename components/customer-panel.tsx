"use client"

import { useState, useEffect } from "react"
import { RestaurantHeader } from "@/components/restaurant-header"
import { MenuCategories } from "@/components/menu-categories"
import { MenuItems } from "@/components/menu-items"
import { FloatingCart } from "@/components/floating-cart"
import { OrderTracker } from "@/components/order-tracker"
import { restaurantData, menuItems } from "@/data/restaurant-data"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { OrderBell } from "@/components/animations/order-bell"
import { useSoundSettings } from "@/contexts/SoundContext"

export function CustomerPanel() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showOrderTracker, setShowOrderTracker] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"pending" | "preparing" | "ready" | "delivered" | "cancelled">("pending")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [playBell, setPlayBell] = useState(false)
  const { isMuted } = useSoundSettings()
  const [estimatedTime, setEstimatedTime] = useState(15) // minutes

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === selectedCategory || (selectedCategory === "bestseller" && item.isBestSeller),
        )

  const addToCart = (item: any) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      )
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: string) => {
    const existingItem = cartItems.find((item) => item.id === itemId)

    if (existingItem && existingItem.quantity > 1) {
      setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)))
    } else {
      setCartItems(cartItems.filter((item) => item.id !== itemId))
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return { icon: "⏳", text: "Order Received", time: "Just now" };
      case "preparing":
        return { icon: "👨‍🍳", text: "Preparing Your Food", time: "~10 mins" };
      case "ready":
        return { icon: "✅", text: "Ready for Pickup", time: "~2 mins" };
      case "delivered":
        return { icon: "🎉", text: "Order Delivered", time: "Complete!" };
      case "cancelled":
        return { icon: "❌", text: "Order Cancelled", time: "N/A" };
      default:
        return { icon: "❓", text: "Unknown Status", time: "Unknown" };
    }
  };

  // Update estimated time based on status
  useEffect(() => {
    switch (orderStatus) {
      case "pending":
        setEstimatedTime(15);
        break;
      case "preparing":
        setEstimatedTime(10);
        break;
      case "ready":
        setEstimatedTime(2);
        break;
      case "delivered":
        setEstimatedTime(0);
        break;
    }
  }, [orderStatus]);

  const placeOrder = async () => {
    try {
      const newOrderId = 'order-' + Math.random().toString(36).substring(2, 15);
      setOrderId(newOrderId);
      setShowOrderTracker(true);
      setOrderStatus("pending");
      if (!isMuted) setPlayBell(true);

      setTimeout(async () => {
        await updateOrderStatus(newOrderId, "preparing");
        setOrderStatus("preparing");
        if (!isMuted) setPlayBell(true);
      }, 3000);
      
      setTimeout(async () => {
        await updateOrderStatus(newOrderId, "ready");
        setOrderStatus("ready");
        if (!isMuted) setPlayBell(true);
      }, 6000);
      
      setTimeout(async () => {
        await updateOrderStatus(newOrderId, "delivered");
        setOrderStatus("delivered");
        if (!isMuted) setPlayBell(true);
      }, 9000);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const updateOrderStatus = async (id: string, status: "pending" | "preparing" | "ready" | "delivered" | "cancelled") => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <RestaurantHeader restaurant={restaurantData} />

      <div className="container mx-auto px-4 mt-4">
        <MenuCategories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        <MenuItems items={filteredItems} addToCart={addToCart} />
      </div>

      <FloatingCart
        cartItems={cartItems}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
      />

      <OrderBell 
        play={playBell} 
        onComplete={() => setPlayBell(false)} 
      />

      {showOrderTracker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Status</h3>
              {estimatedTime > 0 && (
                <span className="text-sm text-orange-600 font-medium">
                  Est. {estimatedTime} mins remaining
                </span>
              )}
            </div>
            <div className="space-y-4">
              {["pending", "preparing", "ready", "delivered"].map((status) => {
                const { icon, text, time } = getStatusDisplay(status);
                const isCompleted = ["delivered", "cancelled"].includes(orderStatus) || 
                  ["pending", "preparing", "ready", "delivered"].indexOf(orderStatus) >= 
                  ["pending", "preparing", "ready", "delivered"].indexOf(status);
                
                return (
                  <div
                    key={status}
                    className={`flex items-center gap-3 ${
                      isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="flex-1">{text}</span>
                    <span className="text-sm">{time}</span>
                    {isCompleted && <span className="text-xl">✓</span>}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setShowOrderTracker(false)}
                disabled={!["delivered", "cancelled"].includes(orderStatus)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

