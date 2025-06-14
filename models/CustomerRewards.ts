import mongoose from 'mongoose';

const customerRewardsSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  cashbackBalance: {
    type: Number,
    default: 0
  },
  orderHistory: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    amount: Number,
    cashbackEarned: Number,
    rewardsClaimed: [{
      tier: Number,
      reward: String,
      claimedAt: Date
    }],
    orderDate: Date
  }],
  favoriteOrders: [{
    items: [{
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
      },
      quantity: Number,
      customizations: Object
    }],
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastOrderDate: Date,
  isFirstTimeCustomer: {
    type: Boolean,
    default: true
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified'],
    default: 'unverified'
  },
  verificationCode: String,
  verificationExpiry: Date
}, {
  timestamps: true
});

// Create a compound index for restaurantId and phoneNumber
customerRewardsSchema.index({ restaurantId: 1, phoneNumber: 1 }, { unique: true });

export interface ICustomerRewards extends mongoose.Document {
  restaurantId: mongoose.Types.ObjectId;
  phoneNumber: string;
  totalOrders: number;
  cashbackBalance: number;
  orderHistory: Array<{
    orderId: mongoose.Types.ObjectId;
    amount: number;
    cashbackEarned: number;
    rewardsClaimed: Array<{
      tier: number;
      reward: string;
      claimedAt: Date;
    }>;
    orderDate: Date;
  }>;
  favoriteOrders: Array<{
    items: Array<{
      menuItemId: mongoose.Types.ObjectId;
      quantity: number;
      customizations: any;
    }>;
    savedAt: Date;
  }>;
  lastOrderDate: Date;
  isFirstTimeCustomer: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  verificationCode?: string;
  verificationExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.models.CustomerRewards || mongoose.model<ICustomerRewards>('CustomerRewards', customerRewardsSchema); 