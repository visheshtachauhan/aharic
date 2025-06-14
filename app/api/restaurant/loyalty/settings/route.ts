import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for loyalty settings
const loyaltySettingsSchema = z.object({
  firstOrderDiscount: z.object({
    enabled: z.boolean(),
    amount: z.number().min(0).max(500)
  }),
  cashback: z.object({
    enabled: z.boolean(),
    percentage: z.number().min(0).max(20)
  }),
  tieredRewards: z.object({
    enabled: z.boolean(),
    tiers: z.array(z.object({
      ordersRequired: z.number().min(1),
      reward: z.object({
        type: z.enum(['free_item', 'discount', 'cashback']),
        value: z.string(),
        description: z.string()
      })
    }))
  }),
  oneClickCheckout: z.object({
    enabled: z.boolean()
  }),
  updatedAt: z.date().optional()
});

export async function GET() {
  try {
    // Check if user is authenticated and is a restaurant owner
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'restaurant_owner') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    
    // Fetch loyalty settings for this restaurant
    const settings = await db.collection('loyalty_settings').findOne({
      restaurantId: session.user.restaurantId
    });

    return NextResponse.json({ 
      success: true, 
      settings: settings || {
        firstOrderDiscount: { enabled: false, amount: 0 },
        cashback: { enabled: false, percentage: 0 },
        tieredRewards: { enabled: false, tiers: [] },
        oneClickCheckout: { enabled: false }
      }
    });
  } catch (error) {
    console.error('Error fetching loyalty settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch loyalty settings' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is a restaurant owner
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'restaurant_owner') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();
    
    // Validate input
    const validationResult = loyaltySettingsSchema.safeParse({
      ...updates,
      updatedAt: new Date()
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
    
    // Update loyalty settings
    const result = await db.collection('loyalty_settings').updateOne(
      { restaurantId: session.user.restaurantId },
      { 
        $set: validationResult.data
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Loyalty settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating loyalty settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update loyalty settings' 
      },
      { status: 500 }
    );
  }
} 