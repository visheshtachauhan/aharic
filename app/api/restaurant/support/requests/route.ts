import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    
    // Fetch support requests for this specific restaurant
    const requests = await db.collection('support_requests')
      .find({ 
        restaurantId: session.user.restaurantId,
        source: 'restaurant'
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      requests
    });
  } catch (error) {
    console.error('Error fetching support requests:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch support requests' 
      },
      { status: 500 }
    );
  }
} 