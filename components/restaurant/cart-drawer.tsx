"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { MinusIcon, PlusIcon, Cross2Icon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, updateQuantity, removeItem } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md bg-background shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-4">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <Cross2Icon className="h-4 w-4" />
                </Button>
              </div>

              {/* Cart Items */}
              <ScrollArea className="flex-1 px-4 py-6">
                {state.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={onClose}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <div className="relative h-20 w-20 overflow-hidden rounded-md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <PlusIcon className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-red-500 hover:text-red-600"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="border-t p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-base font-medium">Subtotal</span>
                    <span className="text-lg font-bold">₹{state.total}</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 