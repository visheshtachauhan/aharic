"use client"

import React, { createContext, useContext, useReducer, useEffect, useState } from "react"
import { toast } from "sonner"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState }

const initialState: CartState = {
  items: [],
  total: 0,
}

interface CartContextType {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      }
    }
    case "REMOVE_ITEM": {
      const item = state.items.find((item) => item.id === action.payload)
      if (!item) return state

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: state.total - item.price * item.quantity,
      }
    }
    case "UPDATE_QUANTITY": {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (!item) return state

      if (action.payload.quantity < 1) {
        return state
      }

      const quantityDiff = action.payload.quantity - item.quantity

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + item.price * quantityDiff,
      }
    }
    case "CLEAR_CART":
      return initialState
    case "SET_CART":
      return action.payload
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const { items, total } = JSON.parse(savedCart)
          dispatch({ type: "SET_CART", payload: { items, total } })
        }
      } catch (error) {
        toast.error("Failed to load cart from storage. Starting with an empty cart.")
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state))
    } catch (error) {
      toast.error("Failed to save cart to storage. Your changes may not persist.")
    }
  }, [state])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    try {
      dispatch({ type: "ADD_ITEM", payload: item })
      toast.success(`${item.name} added to cart!`)
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.")
    }
  }

  const removeItem = (id: string) => {
    try {
      const item = state.items.find((item) => item.id === id)
      if (!item) return

      dispatch({ type: "REMOVE_ITEM", payload: id })
      toast.info(`${item.name} removed from cart.`)
    } catch (error) {
      toast.error("Failed to remove item from cart. Please try again.")
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    try {
      if (quantity < 1) {
        toast.error("Quantity must be at least 1.")
        return
      }

      const item = state.items.find((item) => item.id === id)
      if (!item) return

      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
      toast.success(`Updated ${item.name} quantity to ${quantity}.`)
    } catch (error) {
      toast.error("Failed to update item quantity. Please try again.")
    }
  }

  const clearCart = () => {
    try {
      dispatch({ type: "CLEAR_CART" })
      toast.info("Cart cleared.")
    } catch (error) {
      toast.error("Failed to clear cart. Please try again.")
    }
  }

  return (
    <CartContext.Provider
      value={{ state, dispatch, addItem, removeItem, updateQuantity, clearCart, isLoading }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 