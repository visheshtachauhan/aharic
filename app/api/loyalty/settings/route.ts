import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import LoyaltySettings from '@/models/LoyaltySettings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get loyalty settings for a restaurant
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const settings = await LoyaltySettings.findOne({
      restaurantId: session.user.restaurantId
    });

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await LoyaltySettings.create({
        restaurantId: session.user.restaurantId,
        firstOrderDiscount: {
          enabled: true,
          amount: 100
        },
        cashback: {
          enabled: true,
          percentage: 5
        },
        tieredRewards: {
          enabled: true,
          tiers: [
            { orders: 3, reward: 'Free Drink', description: 'Get a free drink of your choice' },
            { orders: 5, reward: '₹200 Off', description: '₹200 off on your next order' },
            { orders: 10, reward: 'Free Dessert', description: 'Complimentary dessert of your choice' }
          ]
        },
        oneClickCheckout: {
          enabled: true
        }
      });

      return NextResponse.json({ success: true, settings: defaultSettings });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error fetching loyalty settings:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch loyalty settings' },
      { status: 500 }
    );
  }
}

// Update loyalty settings
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await connectDB();

    const settings = await LoyaltySettings.findOneAndUpdate(
      { restaurantId: session.user.restaurantId },
      {
        $set: {
          firstOrderDiscount: body.firstOrderDiscount,
          cashback: body.cashback,
          tieredRewards: body.tieredRewards,
          oneClickCheckout: body.oneClickCheckout
        }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Loyalty settings updated successfully',
      settings
    });
  } catch (error: any) {
    console.error('Error updating loyalty settings:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update loyalty settings' },
      { status: 500 }
    );
  }
} 