"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/contexts/SocketContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Clock, X, ChevronRight, AlertCircle, Filter, Volume2, VolumeX } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeliveryScooter } from "@/components/animations/delivery-scooter"
import { EyeTrackingIcon } from "@/components/animations/eye-tracking"
import { SteamAnimation } from "@/components/animations/steam"
import { FlipCounter } from "@/components/animations/flip-counter"
import { SteamBackgroundEffect, SparkleEffect } from "@/components/animations/background-textures"
import { OrderBell } from "@/components/animations/order-bell"
import { useSoundSettings } from "@/contexts/SoundContext"
import { FoodMoodIndicator } from "@/components/dashboard/food-mood-indicator"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  specialInstructions?: string
}

interface Order {
  id: string
  tableNumber: string
  items: OrderItem[]
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  total: number
  timestamp: string
  customerName?: string
  specialRequests?: string
}

// Add mock ratings data (in a real app, this would come from your backend)
const mockRatings = [
  { value: 5, timestamp: new Date().toISOString() },
  { value: 4, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() }, // 30 mins ago
  { value: 5, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() }, // 1 hour ago
  { value: 3, timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() }, // 1.5 hours ago
];

export function OrderManagement() {
  const { socket, isConnected } = useSocket()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [filterStatus, setFilterStatus] = useState<Order["status"] | "all">("all")
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showDeliveryAnimation, setShowDeliveryAnimation] = useState(false)
  const [totalProfit, setTotalProfit] = useState(0)
  const [playBell, setPlayBell] = useState(false)
  const { isMuted, toggleMute } = useSoundSettings()

  useEffect(() => {
    if (socket && isConnected) {
      // Join restaurant room
      socket.emit("join-restaurant", "restaurant-123")
    }
  }, [socket, isConnected])

  useEffect(() => {
    if (!socket) return

    const handleNewOrder = (order: Order) => {
      setOrders(prev => [order, ...prev])
      if (!isMuted) {
        setPlayBell(true)
      }
    }

    const handleOrderUpdate = (updatedOrder: Partial<Order> & { id: string }) => {
      setOrders(prev =>
        prev.map(order =>
          order.id === updatedOrder.id
            ? { ...order, ...updatedOrder }
            : order
        )
      )
    }

    socket.on("new-order", handleNewOrder)
    socket.on("order-update", handleOrderUpdate)

    return () => {
      socket.off("new-order", handleNewOrder)
      socket.off("order-update", handleOrderUpdate)
    }
  }, [socket, isMuted])

  // Update profit when orders change
  useEffect(() => {
    const profit = orders.reduce((sum, order) => {
      if (order.status === "completed") {
        return sum + (order.total * 0.2) // 20% profit margin
      }
      return sum
    }, 0)
    setTotalProfit(Math.round(profit))
  }, [orders])

  // Show delivery animation when order status changes to "ready"
  useEffect(() => {
    if (showDeliveryAnimation) {
      const timer = setTimeout(() => setShowDeliveryAnimation(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [showDeliveryAnimation])

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <Clock className="h-3 w-3 mr-1" />,
        text: "Pending"
      },
      preparing: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Clock className="h-3 w-3 mr-1" />,
        text: "Preparing"
      },
      ready: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: <Check className="h-3 w-3 mr-1" />,
        text: "Ready"
      },
      completed: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <Check className="h-3 w-3 mr-1" />,
        text: "Completed"
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: <X className="h-3 w-3 mr-1" />,
        text: "Cancelled"
      }
    }

    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={`${config.color} flex items-center`}>
        {config.icon}
        {config.text}
      </Badge>
    )
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error("Failed to update order status")

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      )

      // Trigger delivery animation when order is ready
      if (newStatus === "ready") {
        setShowDeliveryAnimation(true)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const filteredOrders = orders.filter(order => 
    filterStatus === "all" ? true : order.status === filterStatus
  )

  // Handle swipe gestures for mobile
  const handleSwipe = (order: Order, direction: "left" | "right") => {
    if (direction === "left") {
      // Show quick actions
      setSelectedOrder(order)
      setShowOrderDetails(true)
    } else if (direction === "right") {
      // Mark as next status
      const statusFlow = {
        pending: "preparing",
        preparing: "ready",
        ready: "completed"
      } as const
      
      if (order.status in statusFlow) {
        handleStatusChange(order.id, statusFlow[order.status as keyof typeof statusFlow])
      }
    }
  }

  const renderMobileOrderCard = (order: Order) => (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white rounded-lg shadow-sm border p-4 space-y-3"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = Math.abs(offset.x) * velocity.x
        if (swipe < -100) handleSwipe(order, "left")
        if (swipe > 100) handleSwipe(order, "right")
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">Table #{order.tableNumber}</div>
          <div className="text-sm text-muted-foreground">
            {formatTimeAgo(order.timestamp)}
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>
      
      <div className="text-sm">
        {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t">
        <div className="font-medium">₹{order.total}</div>
        <div className="flex gap-2">
          {order.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange(order.id, "preparing")}
              className="h-8"
            >
              Accept
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedOrder(order)
              setShowOrderDetails(true)
            }}
            className="h-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-4 relative min-h-screen">
      {/* Add FoodMoodIndicator at the top */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-2 mb-4 relative">
          <span className="text-sm font-medium text-muted-foreground">Today's Profit:</span>
          <div className="relative">
            <FlipCounter value={totalProfit} />
            <SparkleEffect />
          </div>
        </div>
        <FoodMoodIndicator ratings={mockRatings} />
      </div>

      {/* Bell Sound Effect */}
      <OrderBell 
        play={playBell} 
        onComplete={() => setPlayBell(false)} 
      />
      
      {/* Background Effects */}
      <SteamBackgroundEffect />
      
      {/* Delivery Animation */}
      {showDeliveryAnimation && <DeliveryScooter />}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-base font-medium">Orders</CardTitle>
          <div className="flex items-center gap-4">
            {/* Sound Toggle */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="relative"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMuted ? "muted" : "unmuted"}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-[#FF7300]" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <span className="sr-only">
                  {isMuted ? "Unmute notifications" : "Mute notifications"}
                </span>
              </Button>
            </motion.div>

            {/* Connection Status */}
            {isConnected ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Live Updates Active
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                Connecting...
              </div>
            )}

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterStatus === "all" ? "All Orders" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("preparing")}>
                  Preparing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("ready")}>
                  Ready
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          {isMobile ? (
            // Mobile Layout
            <div className="space-y-3 p-4">
              <AnimatePresence>
                {filteredOrders.map(order => renderMobileOrderCard(order))}
              </AnimatePresence>
            </div>
          ) : (
            // Desktop Table Layout
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Details</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={index % 2 === 0 ? "bg-muted/50" : ""}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              <EyeTrackingIcon>
                                Table #{order.tableNumber}
                              </EyeTrackingIcon>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatTimeAgo(order.timestamp)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm flex items-center gap-2">
                            {order.items.map(item => (
                              <span key={item.id} className="relative">
                                {`${item.quantity}x ${item.name}`}
                                {item.quantity > 2 && (
                                  <div className="absolute -top-3 -right-3">
                                    <SteamAnimation />
                                  </div>
                                )}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">₹{order.total}</div>
                        </TableCell>
                        <TableCell>
                          <EyeTrackingIcon intensity={10}>
                            {getStatusBadge(order.status)}
                          </EyeTrackingIcon>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {order.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(order.id, "preparing")}
                                className="h-8"
                              >
                                Accept
                              </Button>
                            )}
                            {order.status === "preparing" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(order.id, "ready")}
                                className="h-8"
                              >
                                Mark Ready
                              </Button>
                            )}
                            {order.status === "ready" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(order.id, "completed")}
                                className="h-8"
                              >
                                Complete
                              </Button>
                            )}
                            {(order.status === "pending" || order.status === "preparing") && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleStatusChange(order.id, "cancelled")}
                                className="h-8"
                              >
                                Cancel
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowOrderDetails(true)
                              }}
                              className="h-8"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Table #{selectedOrder.tableNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedOrder.timestamp).toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.specialInstructions && (
                            <p className="text-sm text-muted-foreground">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p>₹{item.price} × {item.quantity}</p>
                          <p className="font-medium">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Amount</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>

                {selectedOrder.specialRequests && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <AlertCircle className="h-4 w-4" />
                      Special Requests
                    </div>
                    <p className="text-sm">{selectedOrder.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile Quick Actions Menu */}
      {isMobile && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50"
        >
          <Card>
            <CardContent className="p-2">
              <div className="flex justify-around">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                  className={`flex-1 ${filterStatus === "pending" ? "bg-muted" : ""}`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterStatus("preparing")}
                  className={`flex-1 ${filterStatus === "preparing" ? "bg-muted" : ""}`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Preparing
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterStatus("ready")}
                  className={`flex-1 ${filterStatus === "ready" ? "bg-muted" : ""}`}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Ready
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
} 