export interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  isVegetarian?: boolean
  isSpicy?: boolean
  isBestSeller?: boolean
  isAvailable?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id: string
  name: string
  count: number
  isActive?: boolean
} 