import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for customer loyalty data
const customerLoyaltySchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  restaurantId: z.string(),
  totalOrders: z.number().default(0),
  totalSpent: z.number().default(0),
  cashbackBalance: z.number().default(0),
  firstOrderDate: z.date().optional(),
  lastOrderDate: z.date().optional(),
  rewardsTier: z.number().default(0),
  favoriteItems: z.array(z.string()).default([]),
  savedPaymentMethods: z.array(z.object({
    type: z.enum(['upi', 'card', 'wallet']),
    token: z.string(),
    lastUsed: z.date()
  })).default([])
});

export async function GET(request: Request) {
  try {
    // In development mode, skip authentication
    if (process.env.NODE_ENV !== 'development') {
      const session = await getServerSession(authOptions);
      if (!session || !['restaurant_owner', 'staff'].includes(session.user.role)) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phone');

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        customerData: {
          isFirstTimeCustomer: phoneNumber.endsWith('0'),
          cashbackBalance: 150,
          totalOrders: 5,
          availableRewards: [
            {
              id: '1',
              type: 'discount',
              value: '100',
              description: '₹100 off on your next order'
            }
          ],
          savedPaymentMethods: [
            {
              type: 'upi',
              token: 'user@upi',
              lastUsed: new Date()
            }
          ]
        }
      });
    }

    const db = await connectToDatabase();
    
    // Fetch customer loyalty data
    const customerData = await db.collection('customer_loyalty').findOne({
      phoneNumber,
      restaurantId: session.user.restaurantId
    });

    if (!customerData) {
      return NextResponse.json({ 
        success: true, 
        isNewCustomer: true,
        customerData: null
      });
    }

    return NextResponse.json({ 
      success: true, 
      isNewCustomer: false,
      customerData 
    });
  } catch (error) {
    console.error('Error fetching customer loyalty data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch customer data' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and authorized
    const session = await getServerSession(authOptions);
    if (!session || !['restaurant_owner', 'staff'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate input
    const validationResult = customerLoyaltySchema.safeParse({
      ...data,
      restaurantId: session.user.restaurantId
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    // Create or update customer loyalty data
    const result = await db.collection('customer_loyalty').updateOne(
      { 
        phoneNumber: validationResult.data.phoneNumber,
        restaurantId: session.user.restaurantId
      },
      { 
        $set: validationResult.data
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Customer loyalty data updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer loyalty data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update customer data' 
      },
      { status: 500 }
    );
  }
} 