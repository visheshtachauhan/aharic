import { NextResponse } from 'next/server';
import { getSupabaseSession } from '@/lib/supabase';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Validation schema for menu item updates
const menuItemUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  image: z.string().url('Invalid image URL').optional(),
  isAvailable: z.boolean().optional()
});

const updateMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  category: z.string().min(1, 'Category is required').optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getSupabaseSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    const menu = await db.collection('menus').findOne({ _id: new ObjectId(params.id) });
    
    if (!menu) {
      return new NextResponse('Menu not found', { status: 404 });
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Add more robust error handling for JSON parsing
    let body;
    try {
      // Check if the request body is empty first
      const text = await request.text();
      if (!text || text.trim() === '') {
        return NextResponse.json(
          { success: false, message: 'Empty request body' },
          { status: 400 }
        );
      }
      // Parse the text to JSON
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing JSON body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    console.log('Updating menu item:', id, 'with data:', body);
    
    const db = await connectToDatabase();
    const collection = db.collection('menu');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const db = await connectToDatabase();
    const collection = db.collection('menu');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
} 