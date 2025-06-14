import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Order, OrderItem, OrderStatus } from '@/types/order';

// Initial dummy orders
const INITIAL_ORDERS: Order[] = [
  // Pending Orders
  {
    id: 'ORD001',
    table: 'Table 1',
    items: [
      { 
        id: '1', 
        name: 'Butter Chicken', 
        quantity: 2, 
        price: 450,
        category: 'Main Course',
        description: 'Creamy butter chicken curry'
      },
      { 
        id: '2', 
        name: 'Naan', 
        quantity: 4, 
        price: 40,
        category: 'Breads',
        description: 'Traditional Indian bread'
      }
    ],
    amount: 1060,
    status: 'pending',
    specialInstructions: 'Extra spicy please',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'ORD002',
    table: 'Table 2',
    items: [
      { 
        id: '3', 
        name: 'Paneer Tikka', 
        quantity: 1, 
        price: 350,
        category: 'Starters',
        description: 'Grilled cottage cheese with spices'
      },
      { 
        id: '4', 
        name: 'Garlic Naan', 
        quantity: 2, 
        price: 50,
        category: 'Breads',
        description: 'Naan bread with garlic'
      }
    ],
    amount: 450,
    status: 'pending',
    specialInstructions: 'No onions',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString()
  },
  {
    id: 'ORD003',
    table: 'Table 3',
    items: [
      { 
        id: '5', 
        name: 'Chicken Biryani', 
        quantity: 2, 
        price: 400,
        category: 'Rice',
        description: 'Fragrant rice with chicken and spices'
      },
      { 
        id: '6', 
        name: 'Raita', 
        quantity: 1, 
        price: 50,
        category: 'Accompaniments',
        description: 'Yogurt with mild spices'
      }
    ],
    amount: 850,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString()
  },

  // In Progress Orders
  {
    id: 'ORD004',
    table: 'Table 4',
    items: [
      { 
        id: '7', 
        name: 'Dal Makhani', 
        quantity: 1, 
        price: 250,
        category: 'Main Course',
        description: 'Creamy black lentils'
      },
      { 
        id: '8', 
        name: 'Butter Naan', 
        quantity: 3, 
        price: 45,
        category: 'Breads',
        description: 'Buttered naan bread'
      }
    ],
    amount: 385,
    status: 'in-progress',
    specialInstructions: 'Less spicy',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 'ORD005',
    table: 'Table 5',
    items: [
      { 
        id: '9', 
        name: 'Malai Kofta', 
        quantity: 1, 
        price: 300,
        category: 'Main Course',
        description: 'Cottage cheese dumplings in creamy sauce'
      },
      { 
        id: '10', 
        name: 'Jeera Rice', 
        quantity: 1, 
        price: 150,
        category: 'Rice',
        description: 'Cumin flavored rice'
      }
    ],
    amount: 450,
    status: 'in-progress',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60000).toISOString()
  },
  {
    id: 'ORD006',
    table: 'Table 6',
    items: [
      { 
        id: '11', 
        name: 'Tandoori Chicken', 
        quantity: 1, 
        price: 450,
        category: 'Starters',
        description: 'Clay oven roasted chicken'
      },
      { 
        id: '12', 
        name: 'Mint Chutney', 
        quantity: 1, 
        price: 30,
        category: 'Accompaniments',
        description: 'Fresh mint sauce'
      }
    ],
    amount: 480,
    status: 'in-progress',
    specialInstructions: 'Well done',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString()
  },

  // Completed Orders
  {
    id: 'ORD007',
    table: 'Table 7',
    items: [
      { 
        id: '13', 
        name: 'Palak Paneer', 
        quantity: 1, 
        price: 280,
        category: 'Main Course',
        description: 'Cottage cheese in spinach gravy'
      },
      { 
        id: '14', 
        name: 'Roti', 
        quantity: 4, 
        price: 20,
        category: 'Breads',
        description: 'Whole wheat bread'
      }
    ],
    amount: 360,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'ORD008',
    table: 'Table 8',
    items: [
      { 
        id: '15', 
        name: 'Chilli Chicken', 
        quantity: 1, 
        price: 350,
        category: 'Starters',
        description: 'Spicy Indo-Chinese chicken'
      },
      { 
        id: '16', 
        name: 'Fried Rice', 
        quantity: 1, 
        price: 200,
        category: 'Rice',
        description: 'Chinese style fried rice'
      }
    ],
    amount: 550,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: 'ORD009',
    table: 'Table 9',
    items: [
      { 
        id: '17', 
        name: 'Gulab Jamun', 
        quantity: 2, 
        price: 80,
        category: 'Desserts',
        description: 'Sweet milk dumplings'
      },
      { 
        id: '18', 
        name: 'Mango Lassi', 
        quantity: 2, 
        price: 100,
        category: 'Beverages',
        description: 'Mango yogurt smoothie'
      }
    ],
    amount: 360,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60000).toISOString()
  }
];

// Valid status transitions
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['in-progress', 'cancelled'],
  'in-progress': ['completed', 'cancelled'],
  completed: [],
  cancelled: []
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  const formatTime = (date: string) => {
    return format(new Date(date), 'PPp');
  };

  const isValidStatusTransition = (currentStatus: OrderStatus, newStatus: OrderStatus) => {
    return STATUS_TRANSITIONS[currentStatus]?.includes(newStatus);
  };

  const addOrder = (newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const order: Order = {
      ...newOrder,
      id: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
    };

    setOrders(prev => [order, ...prev]);
    return order;
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      // Validate status transition if status is being updated
      if (updates.status && !isValidStatusTransition(order.status, updates.status)) {
        console.warn(`Invalid status transition from ${order.status} to ${updates.status}`);
        return order;
      }

      const now = new Date().toISOString();
      return {
        ...order,
        ...updates,
        updatedAt: now
      };
    }));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Get orders by status
  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  };

  // Get orders by payment status
  const getOrdersByPaymentStatus = (paymentStatus: Order['paymentStatus']) => {
    return orders.filter(order => order.paymentStatus === paymentStatus);
  };

  // Get orders for a specific date
  const getOrdersByDate = (date: string) => {
    return orders.filter(order => order.createdAt.startsWith(date));
  };

  // Calculate total sales for a specific date
  const calculateDailySales = (date: string) => {
    return orders
      .filter(order => order.createdAt && typeof order.createdAt === 'string' && order.createdAt.startsWith(date) && order.paymentStatus === 'paid')
      .reduce((total, order) => total + order.amount, 0);
  };

  // Calculate total sales
  const calculateTotalSales = () => {
    return orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((total, order) => total + order.amount, 0);
  };

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrdersByStatus,
    getOrdersByPaymentStatus,
    getOrdersByDate,
    calculateDailySales,
    calculateTotalSales,
  };
}