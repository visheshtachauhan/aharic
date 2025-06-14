import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { MenuItem } from '@/types/restaurant';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const restaurant = await db.restaurants.findOne(
      { _id: new ObjectId(params.id) },
      { projection: { menuItems: 1 } }
    );

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant.menuItems || []);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();

    const newMenuItem: MenuItem = {
      ...body,
      _id: new ObjectId(),
    };

    const result = await db.restaurants.updateOne(
      { _id: new ObjectId(params.id) },
      { $push: { menuItems: newMenuItem } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Menu item added successfully' });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { itemId, ...updateData } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.restaurants.updateOne(
      {
        _id: new ObjectId(params.id),
        'menuItems._id': new ObjectId(itemId),
      },
      { $set: { 'menuItems.$': { ...updateData, _id: new ObjectId(itemId) } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { itemId } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.restaurants.updateOne(
      { _id: new ObjectId(params.id) },
      { $pull: { menuItems: { _id: new ObjectId(itemId) } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 