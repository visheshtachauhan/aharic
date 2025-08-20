import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { CATEGORIES, type Category } from '@/app/admin/menu/constants';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase();
    const category = await db.collection('menu_categories').findOne({
      _id: new ObjectId(params.id)
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !['admin', 'restaurant_owner'].includes(session.user?.role as string)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { availableAddOns, ...categorySettings } = data;

    // Validate availableAddOns if provided
    if (availableAddOns && !Array.isArray(availableAddOns)) {
      return NextResponse.json(
        { success: false, message: 'availableAddOns must be an array' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    // Update category settings
    const result = await db.collection('menu_categories').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          ...categorySettings,
          updatedAt: new Date(),
          updatedBy: session.user.id
        }
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // If availableAddOns is provided, update all menu items in this category
    if (availableAddOns) {
      await db.collection('menu_items').updateMany(
        { category: params.id },
        { 
          $set: { 
            availableAddOns,
            updatedAt: new Date(),
            updatedBy: session.user.id
          }
        }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update category' },
      { status: 500 }
    );
  }
}