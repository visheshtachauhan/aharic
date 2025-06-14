import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Check if user is authenticated and is a super admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    
    // Fetch all support requests, sorted by newest first
    const requests = await db.collection('support_requests')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch all restaurants for reference
    const restaurants = await db.collection('restaurants')
      .find({}, { projection: { name: 1 } })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      requests,
      restaurants
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is a super admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();
    const db = await connectToDatabase();
    
    // Update the support request
    const result = await db.collection('support_requests').updateOne(
      { _id: params.id },
      { 
        $set: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: session.user.id
        }
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { success: false, message: 'Support request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Support request updated successfully'
    });
  } catch (error) {
    console.error('Error updating support request:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update support request' 
      },
      { status: 500 }
    );
  }
} 