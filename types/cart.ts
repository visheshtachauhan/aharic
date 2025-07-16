import { MenuItem } from './menu'

export interface CartItem extends Pick<MenuItem, 'id' | 'name' | 'price' | 'image'> {
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
}
