"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { useSocket, Order as SocketOrder, OrderStatus } from "@/contexts/SocketContext";

type PaymentStatus = "paid" | "pending" | "failed";

interface Order extends SocketOrder {
  paymentStatus: PaymentStatus;
}

export function LiveOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { socket, isConnected, orders: liveOrders } = useSocket();
  
  useEffect(() => {
    if (liveOrders.length > 0) {
      const updatedOrders = liveOrders.map((order: SocketOrder) => {
        const paymentStatus: PaymentStatus = Math.random() > 0.3 ? "paid" : "pending";
        
        return {
          ...order,
          paymentStatus
        };
      });
      
      setOrders(updatedOrders);
    }
  }, [liveOrders]);
  
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join-restaurant", "restaurant-123");
    }
  }, [socket, isConnected]);
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Pending</Badge>;
      case "preparing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">Preparing</Badge>;
      case "ready":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Ready</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Live Orders</CardTitle>
          {isConnected ? (
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> 
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span> 
              <span className="text-xs text-muted-foreground">Connecting...</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto max-h-[350px]">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div 
                key={order.id}
                className={`border-b last:border-0 p-3 hover:bg-slate-50 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      order.status === "preparing" ? "bg-blue-100 text-blue-700" :
                      order.status === "ready" ? "bg-green-100 text-green-700" :
                      order.status === "delivered" ? "bg-gray-100 text-gray-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Table #{order.tableNumber}</div>
                        <div className="text-xs text-muted-foreground">{formatTimeAgo(order.timestamp)}</div>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    
                    <div className="mt-1 text-xs text-muted-foreground truncate">
                      {order.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}
                    </div>
                    <div className="text-sm font-medium mt-1">
                      ₹{order.total}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}