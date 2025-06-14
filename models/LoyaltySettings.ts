import mongoose from 'mongoose';

const loyaltySettingsSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  firstOrderDiscount: {
    enabled: {
      type: Boolean,
      default: true
    },
    amount: {
      type: Number,
      default: 100
    }
  },
  cashback: {
    enabled: {
      type: Boolean,
      default: true
    },
    percentage: {
      type: Number,
      default: 5,
      min: 0,
      max: 20
    }
  },
  tieredRewards: {
    enabled: {
      type: Boolean,
      default: true
    },
    tiers: [{
      orders: {
        type: Number,
        required: true
      },
      reward: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }]
  },
  oneClickCheckout: {
    enabled: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

export interface ILoyaltySettings extends mongoose.Document {
  restaurantId: mongoose.Types.ObjectId;
  firstOrderDiscount: {
    enabled: boolean;
    amount: number;
  };
  cashback: {
    enabled: boolean;
    percentage: number;
  };
  tieredRewards: {
    enabled: boolean;
    tiers: Array<{
      orders: number;
      reward: string;
      description: string;
    }>;
  };
  oneClickCheckout: {
    enabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.models.LoyaltySettings || mongoose.model<ILoyaltySettings>('LoyaltySettings', loyaltySettingsSchema); 