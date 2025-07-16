import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  tables: [{
    number: String,
    capacity: Number,
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
  }],
  menuItems: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    available: {
      type: Boolean,
      default: true,
    },
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free',
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
  },
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
restaurantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

export interface OpeningHours {
  open: string;
  close: string;
}

export interface DeliverySettings {
  isDeliveryAvailable: boolean;
  minimumOrder: number;
  deliveryFee: number;
  deliveryRadius: number;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  coverImage?: string;
  logo?: string;
  openingHours: {
    monday: OpeningHours;
    tuesday: OpeningHours;
    wednesday: OpeningHours;
    thursday: OpeningHours;
    friday: OpeningHours;
    saturday: OpeningHours;
    sunday: OpeningHours;
  };
  deliverySettings: DeliverySettings;
  socialMedia: SocialMedia;
  createdAt: Date;
  updatedAt: Date;
} 