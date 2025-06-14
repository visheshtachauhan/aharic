"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BackpackIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "./cart-drawer"

export function FloatingCart() {
  const { state } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)

  if (itemCount === 0) return null

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-40 w-full max-w-[90%] -translate-x-1/2 px-4 md:max-w-[500px]"
        >
          <Button
            className="w-full gap-4 rounded-full py-6 shadow-lg"
            size="lg"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="flex items-center gap-2">
              <BackpackIcon className="h-5 w-5" />
              <span>{itemCount} items</span>
            </div>
            <span>₹{state.total}</span>
            <span className="ml-auto">View Cart →</span>
          </Button>
        </motion.div>
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
} 