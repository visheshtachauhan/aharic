import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CustomerRewards from '@/models/CustomerRewards';
import LoyaltySettings from '@/models/LoyaltySettings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Get customer rewards by phone number
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phoneNumber');

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await CustomerRewards.findOne({
      restaurantId: session.user.restaurantId,
      phoneNumber
    });

    if (!customer) {
      return NextResponse.json({
        success: true,
        customer: {
          isFirstTimeCustomer: true,
          cashbackBalance: 0,
          totalOrders: 0
        }
      });
    }

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    console.error('Error fetching customer rewards:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch customer rewards' },
      { status: 500 }
    );
  }
}

// Create or update customer rewards
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const customer = await CustomerRewards.findOneAndUpdate(
      {
        restaurantId: session.user.restaurantId,
        phoneNumber
      },
      {
        $set: {
          verificationCode,
          verificationExpiry,
          verificationStatus: 'pending'
        }
      },
      { upsert: true, new: true }
    );

    // Send verification code via SMS
    try {
      await twilioClient.messages.create({
        body: `Your verification code for The Tasty Corner is: ${verificationCode}. Valid for 10 minutes.`,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      // Don't fail the request if SMS fails
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error: any) {
    console.error('Error creating/updating customer:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process customer' },
      { status: 500 }
    );
  }
}

// Verify phone number
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumber, verificationCode } = body;

    if (!phoneNumber || !verificationCode) {
      return NextResponse.json(
        { success: false, message: 'Phone number and verification code are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await CustomerRewards.findOne({
      restaurantId: session.user.restaurantId,
      phoneNumber
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    if (customer.verificationStatus === 'verified') {
      return NextResponse.json({ success: true, customer });
    }

    if (
      customer.verificationCode !== verificationCode ||
      new Date() > new Date(customer.verificationExpiry!)
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Get loyalty settings for first-time customer discount
    const loyaltySettings = await LoyaltySettings.findOne({
      restaurantId: session.user.restaurantId
    });

    // Apply first-time customer discount if eligible
    let firstOrderDiscount = 0;
    if (
      customer.isFirstTimeCustomer &&
      loyaltySettings?.firstOrderDiscount.enabled
    ) {
      firstOrderDiscount = loyaltySettings.firstOrderDiscount.amount;
    }

    const verifiedCustomer = await CustomerRewards.findOneAndUpdate(
      {
        restaurantId: session.user.restaurantId,
        phoneNumber
      },
      {
        $set: {
          verificationStatus: 'verified',
          verificationCode: undefined,
          verificationExpiry: undefined
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      customer: verifiedCustomer,
      firstOrderDiscount
    });
  } catch (error: any) {
    console.error('Error verifying customer:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to verify customer' },
      { status: 500 }
    );
  }
} 