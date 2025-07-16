"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

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
  socket: Socket | null;
  isConnected: boolean;
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
  joinRestaurantRoom: (restaurantId: string) => void;
  leaveRestaurantRoom: (restaurantId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

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

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('error', (error: Error) => {
      toast.error(`Socket Error: ${error.message}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinOrderRoom = (orderId: string) => {
    if (!socket || !isConnected) {
      toast.error("Connection Error: Not connected to real-time updates.");
      return;
    }

    try {
      socket.emit('join:order', orderId);
    } catch (error: any) {
      toast.error(error.message || "Failed to join order room. Please try again.");
    }
  };

  const leaveOrderRoom = (orderId: string) => {
    if (!socket || !isConnected) return;

    try {
      socket.emit('leave:order', orderId);
    } catch (error: any) {
      toast.error(error.message || "Failed to leave order room. Please try again.");
    }
  };

  const joinRestaurantRoom = (restaurantId: string) => {
    if (!socket || !isConnected) {
      toast.error("Connection Error: Not connected to real-time updates.");
      return;
    }

    try {
      socket.emit('join:restaurant', restaurantId);
    } catch (error: any) {
      toast.error(error.message || "Failed to join restaurant room. Please try again.");
    }
  };

  const leaveRestaurantRoom = (restaurantId: string) => {
    if (!socket || !isConnected) return;

    try {
      socket.emit('leave:restaurant', restaurantId);
    } catch (error: any) {
      toast.error(error.message || "Failed to leave restaurant room. Please try again.");
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinOrderRoom,
        leaveOrderRoom,
        joinRestaurantRoom,
        leaveRestaurantRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
} 