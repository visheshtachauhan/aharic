import type { MenuItem } from '@/types/menu';

export const menuItems: MenuItem[] = [
  {
    _id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'Pizza & Pasta',
    image: '/images/menu/margherita.jpg',
    isVeg: true,
    popular: true,
    spicyLevel: 1,
    rating: 4.5,
    reviews: 120,
    available: true
  },
  {
    _id: '2',
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in a rich, creamy tomato sauce',
    price: 15.99,
    category: 'Main Course',
    image: '/images/menu/chicken-tikka.jpg',
    isVeg: false,
    popular: true,
    spicyLevel: 2,
    rating: 4.8,
    reviews: 85,
    available: true
  },
  {
    _id: '3',
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice with mixed vegetables and spices',
    price: 13.99,
    category: 'Rice & Biryani',
    image: '/images/menu/veg-biryani.jpg',
    isVeg: true,
    popular: false,
    spicyLevel: 2,
    rating: 4.3,
    reviews: 65,
    available: true
  },
  {
    _id: '4',
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce, mozzarella, and spicy pepperoni',
    price: 14.99,
    category: 'Pizza',
    image: '/images/menu/pizza-pepperoni.jpg',
    isVeg: false,
    popular: true,
    available: true,
    rating: 4.7,
    reviews: 150
  },
  {
    _id: '5',
    name: 'Veggie Supreme',
    description: 'Loaded with bell peppers, mushrooms, onions, and olives',
    price: 15.99,
    category: 'Pizza',
    image: '/images/menu/pizza-veggie.jpg',
    isVeg: true,
    popular: false,
    available: true,
    rating: 4.3,
    reviews: 80
  },
  {
    _id: '6',
    name: 'BBQ Chicken',
    description: 'Grilled chicken with BBQ sauce and mozzarella',
    price: 16.99,
    category: 'Pizza',
    image: '/images/menu/pizza-bbq.jpg',
    isVeg: false,
    popular: true,
    available: true,
    rating: 4.6,
    reviews: 95
  },
  {
    _id: '7',
    name: 'Hawaiian',
    description: 'Ham, pineapple, and mozzarella',
    price: 15.99,
    category: 'Pizza',
    image: '/images/menu/pizza-hawaiian.jpg',
    isVeg: false,
    popular: false,
    available: true,
    rating: 4.2,
    reviews: 65
  }
]; 