import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(
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

    const { note } = await request.json();
    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note text is required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    // Add the note to the support request
    const result = await db.collection('support_requests').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $push: {
          notes: {
            text: note,
            createdAt: new Date(),
            createdBy: session.user.name || session.user.email
          }
        },
        $set: {
          updatedAt: new Date()
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
      message: 'Note added successfully'
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add note' 
      },
      { status: 500 }
    );
  }
} 