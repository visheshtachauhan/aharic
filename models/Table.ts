import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available',
  },
  qrCode: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
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

// Compound index to ensure unique table numbers per restaurant
tableSchema.index({ restaurantId: 1, number: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
tableSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Table = mongoose.models.Table || mongoose.model('Table', tableSchema); 