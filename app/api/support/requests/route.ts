import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    // Fetch all support requests, sorted by newest first
    const requests = await db.collection('support_requests')
      .find({})
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