import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CustomerRewards from '@/models/CustomerRewards';
import LoyaltySettings from '@/models/LoyaltySettings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, phoneNumber, orderAmount, items } = body;

    if (!orderId || !phoneNumber || !orderAmount) {
      return NextResponse.json(
        { success: false, message: 'Order ID, phone number, and amount are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get loyalty settings
    const loyaltySettings = await LoyaltySettings.findOne({
      restaurantId: session.user.restaurantId
    });

    if (!loyaltySettings) {
      return NextResponse.json(
        { success: false, message: 'Loyalty settings not found' },
        { status: 404 }
      );
    }

    // Find or create customer rewards record
    let customer = await CustomerRewards.findOne({
      restaurantId: session.user.restaurantId,
      phoneNumber
    });

    if (!customer) {
      customer = await CustomerRewards.create({
        restaurantId: session.user.restaurantId,
        phoneNumber,
        isFirstTimeCustomer: true,
        verificationStatus: 'unverified'
      });
    }

    // Calculate cashback if enabled
    let cashbackEarned = 0;
    if (loyaltySettings.cashback.enabled) {
      cashbackEarned = Math.floor((orderAmount * loyaltySettings.cashback.percentage) / 100);
    }

    // Check for tier rewards
    const rewardsClaimed = [];
    if (loyaltySettings.tieredRewards.enabled) {
      const totalOrders = customer.totalOrders + 1;
      for (const tier of loyaltySettings.tieredRewards.tiers) {
        if (totalOrders === tier.orders) {
          rewardsClaimed.push({
            tier: tier.orders,
            reward: tier.reward,
            claimedAt: new Date()
          });
        }
      }
    }

    // Update customer record
    const updatedCustomer = await CustomerRewards.findOneAndUpdate(
      {
        restaurantId: session.user.restaurantId,
        phoneNumber
      },
      {
        $inc: {
          totalOrders: 1,
          cashbackBalance: cashbackEarned
        },
        $set: {
          lastOrderDate: new Date(),
          isFirstTimeCustomer: false
        },
        $push: {
          orderHistory: {
            orderId,
            amount: orderAmount,
            cashbackEarned,
            rewardsClaimed,
            orderDate: new Date()
          }
        }
      },
      { new: true }
    );

    // If this is a favorite order, save it
    if (items && body.saveAsFavorite) {
      await CustomerRewards.findOneAndUpdate(
        {
          restaurantId: session.user.restaurantId,
          phoneNumber
        },
        {
          $push: {
            favoriteOrders: {
              items,
              savedAt: new Date()
            }
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order processed successfully',
      customer: updatedCustomer,
      rewards: {
        cashbackEarned,
        rewardsClaimed
      }
    });
  } catch (error: any) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process order' },
      { status: 500 }
    );
  }
} 