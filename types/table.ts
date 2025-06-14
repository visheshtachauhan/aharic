import { ObjectId } from 'mongodb';

export interface Table {
  _id: ObjectId;
  restaurantId: ObjectId;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  qrCode: string;
  currentOrder?: {
    orderId: ObjectId;
    startTime: Date;
    customerName?: string;
    customerPhone?: string;
  };
  notes?: string;
  location?: {
    floor?: string;
    section?: string;
    description?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TableBooking {
  _id: ObjectId;
  tableId: ObjectId;
  restaurantId: ObjectId;
  customerName: string;
  customerPhone: string;
  bookingDate: Date;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
} 