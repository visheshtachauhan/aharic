import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CATEGORIES, type Category } from '@/owner/menu/constants';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const categories = await db.collection('menu')
      .aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
      .toArray() as Array<{ _id: string; count: number }>;

    // Map categories to include predefined settings
    const mappedCategories = categories.map((cat) => ({
      name: cat._id,
      count: cat.count,
      isActive: CATEGORIES.includes(cat._id as Category)
    }));

    return NextResponse.json({
      success: true,
      categories: mappedCategories
    });
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch menu categories',
      categories: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Category name is required'
      }, { status: 400 });
    }

    const categoryName = body.name.trim();

    // Check if category already exists
    const { db } = await connectToDatabase();
    const existingCategory = await db.collection('menu_categories').findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    });

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        message: 'Category already exists'
      }, { status: 409 });
    }

    // Create new category
    const result = await db.collection('menu_categories').insertOne({
      name: categoryName,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      categoryId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating menu category:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create menu category'
    }, { status: 500 });
  }
} 