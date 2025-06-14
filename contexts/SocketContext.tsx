"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

// Mock socket implementation since we don't have a real backend yet
interface MockSocket {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}

// Order status types
export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";

// Order interface
export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  timestamp: string;
}

// Order item interface
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SocketContextType {
  socket: MockSocket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  orders: Order[];
  liveOrders: Order[];
}

// Initial context value
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  orders: [],
  liveOrders: [],
});

interface SocketProviderProps {
  children: ReactNode;
}

// Sample data for mock orders
const mockOrders: Order[] = [
  {
    id: "order-1",
    tableNumber: 5,
    items: [
      { id: "item-1", name: "Butter Chicken", price: 350, quantity: 2 },
      { id: "item-2", name: "Naan", price: 50, quantity: 4 },
    ],
    status: "pending",
    total: 900,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "order-2",
    tableNumber: 3,
    items: [
      { id: "item-3", name: "Paneer Tikka", price: 280, quantity: 1 },
      { id: "item-4", name: "Jeera Rice", price: 150, quantity: 2 },
    ],
    status: "preparing",
    total: 580,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "order-3",
    tableNumber: 8,
    items: [
      { id: "item-5", name: "Chicken Biryani", price: 320, quantity: 3 },
      { id: "item-6", name: "Raita", price: 60, quantity: 2 },
    ],
    status: "ready",
    total: 1080,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "order-4",
    tableNumber: 2,
    items: [
      { id: "item-7", name: "Tandoori Chicken", price: 450, quantity: 1 },
      { id: "item-8", name: "Garlic Naan", price: 70, quantity: 3 },
    ],
    status: "delivered",
    total: 660,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  }
];

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Create a mock socket on mount
    const mockSocket: MockSocket = {
      connected: false,
      connect: () => {
        mockSocket.connected = true;
        const event = new CustomEvent("connect");
        window.dispatchEvent(event);
      },
      disconnect: () => {
        mockSocket.connected = false;
        const event = new CustomEvent("disconnect");
        window.dispatchEvent(event);
      },
      on: (event, callback) => {
        window.addEventListener(event, callback as EventListener);
      },
      off: (event, callback) => {
        window.removeEventListener(event, callback as EventListener);
      },
      emit: (event, ...args) => {
        // Special handling for join-room event
        if (event === "join-order") {
          const orderId = args[0];
          console.log(`Joined order room: ${orderId}`);
          
          // Simulate server pushing order updates
          setTimeout(() => {
            const updatedOrder = mockOrders.find(o => o.id === orderId);
            if (updatedOrder) {
              const statusEvent = new CustomEvent("order-status-update", { 
                detail: { 
                  orderId, 
                  status: updatedOrder.status,
                  progress: getOrderProgress(updatedOrder.status)
                } 
              });
              window.dispatchEvent(statusEvent);
            }
          }, 2000);
        }
        
        if (event === "join-restaurant") {
          const restaurantId = args[0];
          console.log(`Joined restaurant room: ${restaurantId}`);
          
          // Simulate server pushing orders
          setTimeout(() => {
            const ordersEvent = new CustomEvent("orders-updated", { 
              detail: { orders: mockOrders } 
            });
            window.dispatchEvent(ordersEvent);
            
            // Simulate a new order coming in after a delay
            setTimeout(() => {
              const newOrder: Order = {
                id: `order-${Date.now()}`,
                tableNumber: Math.floor(Math.random() * 10) + 1,
                items: [
                  { 
                    id: `item-${Date.now()}-1`, 
                    name: "Dal Makhani", 
                    price: 250, 
                    quantity: 1 
                  },
                  { 
                    id: `item-${Date.now()}-2`, 
                    name: "Butter Naan", 
                    price: 60, 
                    quantity: 2 
                  }
                ],
                status: "pending",
                total: 370,
                timestamp: new Date().toISOString(),
              };
              
              const newOrderEvent = new CustomEvent("new-order", { 
                detail: { order: newOrder } 
              });
              window.dispatchEvent(newOrderEvent);
              
              // Add to orders
              setOrders(prev => [newOrder, ...prev]);
              setLiveOrders(prev => [newOrder, ...prev]);
            }, 15000);
          }, 1000);
        }
        
        // Dispatch regular custom event for other events
        const customEvent = new CustomEvent(event, { detail: args });
        window.dispatchEvent(customEvent);
      },
    };

    setSocket(mockSocket);

    // Clean up event listeners
    return () => {
      if (mockSocket) {
        mockSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const handleOrdersUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { orders } = customEvent.detail;
      setOrders(orders);
      
      // Filter for live orders (pending, preparing, ready)
      const live = orders.filter(
        (order: Order) => 
          order.status === "pending" || 
          order.status === "preparing" || 
          order.status === "ready"
      );
      setLiveOrders(live);
    };
    
    const handleNewOrder = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { order } = customEvent.detail;
      
      setOrders(prev => [order, ...prev]);
      
      // Add to live orders if applicable
      if (["pending", "preparing", "ready"].includes(order.status)) {
        setLiveOrders(prev => [order, ...prev]);
      }
    };
    
    const handleOrderStatusChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { orderId, status } = customEvent.detail;
      
      // Update orders
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status } 
            : order
        )
      );
      
      // Update live orders - remove if delivered/cancelled
      if (status === "delivered" || status === "cancelled") {
        setLiveOrders(prev => prev.filter(order => order.id !== orderId));
      } else {
        setLiveOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status } 
              : order
          )
        );
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("orders-updated", handleOrdersUpdated);
    socket.on("new-order", handleNewOrder);
    socket.on("order-status-changed", handleOrderStatusChanged);

    // Auto connect after a short delay to simulate real connection behavior
    const connectTimeout = setTimeout(() => {
      connect();
    }, 1500);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("orders-updated", handleOrdersUpdated);
      socket.off("new-order", handleNewOrder);
      socket.off("order-status-changed", handleOrderStatusChanged);
      clearTimeout(connectTimeout);
    };
  }, [socket]);

  const connect = () => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  };
  
  // Helper function to get order progress percentage
  const getOrderProgress = (status: OrderStatus): number => {
    switch (status) {
      case "pending": return 25;
      case "preparing": return 50;
      case "ready": return 75;
      case "delivered": return 100;
      case "cancelled": return 0;
      default: return 0;
    }
  };

  return (
    <SocketContext.Provider 
      value={{ 
        socket, 
        isConnected, 
        connect, 
        disconnect,
        orders,
        liveOrders
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}; 