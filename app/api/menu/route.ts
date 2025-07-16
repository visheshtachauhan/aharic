import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { CATEGORIES, CATEGORY_IMAGES, DEFAULT_IMAGE, CATEGORY_SETTINGS, type Category } from '@/app/admin/menu/constants';

interface Variant {
  size: string;
  price: number;
}

interface Addon {
  id: string;
  name: string;
  price: number;
}

export async function GET() {
  let db;
  try {
    db = await connectToDatabase();
    const items = await db.collection('menu')
      .find({})
      .sort({ category: 1, name: 1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      items: items || [] 
    });
  } catch (error: unknown) {
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
        message: 'Name is required' 
      }, { status: 400 });
    }

    if (!body.category || !CATEGORIES.includes(body.category)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid category is required' 
      }, { status: 400 });
    }

    const categorySettings = CATEGORY_SETTINGS[body.category as Category];

    // Clean and validate the data
    const menuItemData = {
      name: body.name.trim(),
      category: body.category,
      description: body.description?.trim() || '',
      image: body.image || CATEGORY_IMAGES[body.category as Category] || DEFAULT_IMAGE,
      isAvailable: body.isAvailable !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Handle variants
      hasVariants: categorySettings.hasVariants,
      variants: categorySettings.hasVariants 
        ? (body.variants || categorySettings.defaultVariants || []).map((variant: Variant) => ({
            size: variant.size,
            price: Math.max(0, parseFloat(variant.price?.toString() || '0') || 0)
          }))
        : [],
      // Default price for non-variant items
      price: !categorySettings.hasVariants 
        ? Math.max(0, parseFloat(body.price?.toString() || '0') || categorySettings.defaultPrice || 0)
        : undefined,
      // Handle add-ons
      allowCustomizations: categorySettings.allowCustomizations,
      availableAddOns: categorySettings.allowCustomizations
        ? (body.availableAddOns || categorySettings.availableAddOns || []).map((addon: Addon) => ({
            id: addon.id,
            name: addon.name,
            price: Math.max(0, parseFloat(addon.price?.toString() || '0') || 0)
          }))
        : []
    };

    db = await connectToDatabase();
    const result = await db.collection('menu').insertOne(menuItemData);

    return NextResponse.json({ 
      success: true, 
      message: 'Menu item created successfully',
      itemId: result.insertedId
    });
  } catch (error: unknown) {
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Item ID is required' 
      }, { status: 400 });
    }

    // Validate required fields
    if (!updateData.name?.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Name is required' 
      }, { status: 400 });
    }

    if (!updateData.category || !CATEGORIES.includes(updateData.category)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid category is required' 
      }, { status: 400 });
    }

    db = await connectToDatabase();

    // Get existing item
    const existingItem = await db.collection('menu').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!existingItem) {
      return NextResponse.json({ 
        success: false, 
        message: 'Item not found' 
      }, { status: 404 });
    }

    const categorySettings = CATEGORY_SETTINGS[updateData.category as Category];

    // Clean and prepare update data
    const cleanedData = {
      name: updateData.name.trim(),
      category: updateData.category,
      description: updateData.description?.trim() || '',
      image: updateData.image || existingItem.image,
      isAvailable: updateData.isAvailable !== false,
      updatedAt: new Date().toISOString(),
      // Handle variants
      hasVariants: categorySettings.hasVariants,
      variants: categorySettings.hasVariants 
        ? (updateData.variants || existingItem.variants || categorySettings.defaultVariants || []).map((variant: Variant) => ({
            size: variant.size,
            price: Math.max(0, parseFloat(variant.price?.toString() || '0') || 0)
          }))
        : [],
      // Default price for non-variant items
      price: !categorySettings.hasVariants 
        ? Math.max(0, parseFloat(updateData.price?.toString() || '0') || existingItem.price || categorySettings.defaultPrice || 0)
        : undefined,
      // Handle add-ons
      allowCustomizations: categorySettings.allowCustomizations,
      availableAddOns: categorySettings.allowCustomizations
        ? (updateData.availableAddOns || existingItem.availableAddOns || categorySettings.availableAddOns || []).map((addon: Addon) => ({
            id: addon.id,
            name: addon.name,
            price: Math.max(0, parseFloat(addon.price?.toString() || '0') || 0)
          }))
        : []
    };

    const result = await db.collection('menu').updateOne(
      { _id: new ObjectId(id) },
      { $set: cleanedData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Item not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item updated successfully'
    });
  } catch (error: unknown) {
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
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Item ID is required' 
      }, { status: 400 });
    }

    db = await connectToDatabase();
    const result = await db.collection('menu').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Item not found' 
      }, { status: 404 });
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