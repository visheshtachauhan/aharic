"use client"

import { useState } from "react"
import { ShoppingBag, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface FloatingCartProps {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  placeOrder: () => void
}

export function FloatingCart({ cartItems, addToCart, removeFromCart, placeOrder }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 2.99
  const total = subtotal + deliveryFee

  const handlePlaceOrder = () => {
    placeOrder()
    setIsOpen(false)
  }

  if (totalItems === 0) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="rounded-full h-14 w-14 shadow-lg animate-float">
            <ShoppingBag className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="flex flex-col h-full p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Your Order</SheetTitle>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 py-2">
                    <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => removeFromCart(item.id)}
                      >
                        {item.quantity === 1 ? <X className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      </Button>

                      <span className="w-5 text-center">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {cartItems.length > 0 && (
            <div className="border-t">
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="px-4 pb-6">
                <Button className="w-full" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

