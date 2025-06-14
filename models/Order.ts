import { Schema, model, models, type Document, type Model } from 'mongoose';

interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: {
    size: string;
    price: number;
  };
  addOns?: Array<{
    name: string;
    price: number;
  }>;
  notes?: string;
}

interface IOrder extends Document {
  restaurantId: Schema.Types.ObjectId;
  tableNumber: string;
  items: IOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  customerPhone?: string;
  customerName?: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  variant: {
    size: String,
    price: Number
  },
  addOns: [{
    name: String,
    price: Number
  }],
  notes: String,
});

const orderSchema = new Schema<IOrder>({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  tableNumber: {
    type: String,
    required: true,
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  customerPhone: String,
  customerName: String,
  specialInstructions: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function(this: IOrder, next: () => void) {
  this.updatedAt = new Date();
  next();
});

export const Order: Model<IOrder> = models.Order || model<IOrder>('Order', orderSchema); 