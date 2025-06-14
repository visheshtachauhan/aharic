import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    db = await connectToDatabase();
    const skip = (page - 1) * limit;

    // Build query based on filters
    const query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await db.collection('menu').countDocuments(query);

    // Fetch menu items with pagination
    const items = await db.collection('menu')
      .find(query)
      .sort({ category: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch menu items',
      items: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let db;
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Item name is required'
      }, { status: 400 });
    }

    if (!body.category?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Category is required'
      }, { status: 400 });
    }

    if (!body.price || typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json({
        success: false,
        message: 'Valid price is required'
      }, { status: 400 });
    }

    db = await connectToDatabase();

    // Check if item with same name exists in the same category
    const existingItem = await db.collection('menu').findOne({
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') },
      category: body.category
    });

    if (existingItem) {
      return NextResponse.json({
        success: false,
        message: 'Item already exists in this category'
      }, { status: 409 });
    }

    // Create new menu item
    const result = await db.collection('menu').insertOne({
      name: body.name.trim(),
      description: body.description?.trim() || '',
      category: body.category,
      price: body.price,
      image: body.image || '',
      isAvailable: body.isAvailable ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Menu item created successfully',
      itemId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create menu item'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  let db;
  try {
    const body = await request.json();

    if (!body._id) {
      return NextResponse.json({
        success: false,
        message: 'Item ID is required'
      }, { status: 400 });
    }

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Item name is required'
      }, { status: 400 });
    }

    if (!body.category?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Category is required'
      }, { status: 400 });
    }

    if (!body.price || typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json({
        success: false,
        message: 'Valid price is required'
      }, { status: 400 });
    }

    db = await connectToDatabase();

    // Check if item exists
    const existingItem = await db.collection('menu').findOne({
      _id: new ObjectId(body._id)
    });

    if (!existingItem) {
      return NextResponse.json({
        success: false,
        message: 'Item not found'
      }, { status: 404 });
    }

    // Check if updated name conflicts with another item in the same category
    const duplicateItem = await db.collection('menu').findOne({
      _id: { $ne: new ObjectId(body._id) },
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') },
      category: body.category
    });

    if (duplicateItem) {
      return NextResponse.json({
        success: false,
        message: 'Another item with this name already exists in this category'
      }, { status: 409 });
    }

    // Update menu item
    const result = await db.collection('menu').updateOne(
      { _id: new ObjectId(body._id) },
      {
        $set: {
          name: body.name.trim(),
          description: body.description?.trim() || '',
          category: body.category,
          price: body.price,
          image: body.image || '',
          isAvailable: body.isAvailable ?? true,
          updatedAt: new Date().toISOString()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'No changes were made to the item'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update menu item'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Item ID is required'
      }, { status: 400 });
    }

    db = await connectToDatabase();

    // Check if item exists
    const existingItem = await db.collection('menu').findOne({
      _id: new ObjectId(id)
    });

    if (!existingItem) {
      return NextResponse.json({
        success: false,
        message: 'Item not found'
      }, { status: 404 });
    }

    // Delete menu item
    const result = await db.collection('menu').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Failed to delete item'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete menu item'
    }, { status: 500 });
  }
} 