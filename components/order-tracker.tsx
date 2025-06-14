"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSocket, OrderStatus } from "@/contexts/SocketContext"

interface OrderTrackerProps {
  orderId: string
  initialStatus: OrderStatus
  onClose: () => void
}

export function OrderTracker({ orderId, initialStatus, onClose }: OrderTrackerProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus)
  const [progress, setProgress] = useState(0)
  const { socket, isConnected } = useSocket()
  
  useEffect(() => {
    // Join order-specific room for updates
    if (isConnected && socket && orderId) {
      socket.emit('join-order', orderId)
    }
  }, [isConnected, orderId, socket])
  
  useEffect(() => {
    if (socket) {
      // Handle status updates
      const handleStatusUpdate = (e: Event) => {
        const customEvent = e as CustomEvent;
        const { orderId: updatedOrderId, status: newStatus, progress: newProgress } = customEvent.detail;
        
        if (updatedOrderId === orderId) {
          setStatus(newStatus);
          setProgress(newProgress);
        }
      };
      
      // Listen for order status updates
      socket.on("order-status-update", handleStatusUpdate);
      
      return () => {
        socket.off("order-status-update", handleStatusUpdate);
      };
    }
  }, [socket, orderId]);

  useEffect(() => {
    // Set initial progress based on status
    const progressMap = {
      pending: 25,
      preparing: 50,
      ready: 75,
      delivered: 100,
      cancelled: 0,
    };

    setProgress(progressMap[status]);
  }, [status]);

  return (
    <div className="fixed bottom-24 left-0 right-0 mx-auto w-[90%] max-w-md z-40">
      <div className="glassmorphism rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Order Status</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Progress value={progress} className="h-2 mb-4" />

        <div className="grid grid-cols-4 gap-2 text-center">
          <div
            className={`flex flex-col items-center ${
              status === "pending" ? "text-primary" : 
              (status === "preparing" || status === "ready" || status === "delivered") ? "text-green-600" : 
              status === "cancelled" ? "text-red-600" : ""
            }`}
          >
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mb-1 ${
              status === "cancelled" ? "border-red-500" : ""
            }`}>
              {status === "pending" ? (
                <Clock className="h-4 w-4" />
              ) : (status === "preparing" || status === "ready" || status === "delivered") ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : status === "cancelled" ? (
                <X className="h-4 w-4 text-red-500" />
              ) : null}
            </div>
            <span className="text-xs">Received</span>
          </div>

          <div
            className={`flex flex-col items-center ${
              status === "preparing" ? "text-primary" : 
              (status === "ready" || status === "delivered") ? "text-green-600" : 
              status === "cancelled" ? "text-gray-400" : ""
            }`}
          >
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mb-1 ${
              status === "cancelled" ? "border-gray-300" : ""
            }`}>
              {status === "preparing" ? (
                <Clock className="h-4 w-4" />
              ) : (status === "ready" || status === "delivered") ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : status === "cancelled" ? (
                <X className="h-4 w-4 text-gray-400" />
              ) : null}
            </div>
            <span className="text-xs">Preparing</span>
          </div>

          <div
            className={`flex flex-col items-center ${
              status === "ready" ? "text-primary" : 
              status === "delivered" ? "text-green-600" : 
              status === "cancelled" ? "text-gray-400" : ""
            }`}
          >
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mb-1 ${
              status === "cancelled" ? "border-gray-300" : ""
            }`}>
              {status === "ready" ? (
                <Clock className="h-4 w-4" />
              ) : status === "delivered" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : status === "cancelled" ? (
                <X className="h-4 w-4 text-gray-400" />
              ) : null}
            </div>
            <span className="text-xs">Ready</span>
          </div>

          <div className={`flex flex-col items-center ${
            status === "delivered" ? "text-green-600" : 
            status === "cancelled" ? "text-gray-400" : ""
          }`}>
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mb-1 ${
              status === "cancelled" ? "border-gray-300" : ""
            }`}>
              {status === "delivered" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : status === "cancelled" ? (
                <X className="h-4 w-4 text-gray-400" />
              ) : null}
            </div>
            <span className="text-xs">Delivered</span>
          </div>
        </div>

        <div className="mt-3 text-center text-sm">
          {status === "pending" && "Your order has been received and is being processed."}
          {status === "preparing" && "The chef is preparing your delicious meal."}
          {status === "ready" && "Your order is ready! It will be served shortly."}
          {status === "delivered" && "Enjoy your meal! Thank you for ordering with us."}
          {status === "cancelled" && "We're sorry, your order has been cancelled."}
        </div>
        
        <div className="text-center text-xs mt-2 text-muted-foreground">
          {isConnected ? (
            <span className="flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Real-time updates active
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span> Connecting to updates...
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

