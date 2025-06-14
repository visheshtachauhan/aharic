import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (typeof body.isAvailable !== 'boolean') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'isAvailable must be a boolean' 
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    // Update the menu item's availability
    const result = await db.collection('menu').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          isAvailable: body.isAvailable,
          lastUnavailableDate: body.isAvailable ? null : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Menu item not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Menu item ${body.isAvailable ? 'enabled' : 'disabled'} successfully` 
    });
  } catch (error) {
    console.error('Error updating menu item availability:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update menu item availability' 
      },
      { status: 500 }
    );
  }
} 