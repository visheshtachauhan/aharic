import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for restaurants
const restaurants = new Map<string, Restaurant>();

// GET /api/restaurants/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase();
    const restaurant = await db
      .collection('restaurants')
      .findOne({ _id: new ObjectId(params.id) });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/restaurants/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const restaurant = restaurants.get(params.id);
    
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const updatedRestaurant = {
      ...restaurant,
      ...data,
      updatedAt: new Date()
    };

    restaurants.set(params.id, updatedRestaurant);
    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json({ error: 'Error updating restaurant' }, { status: 500 });
  }
}

// DELETE /api/restaurants/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!restaurants.has(params.id)) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    restaurants.delete(params.id);
    return NextResponse.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json({ error: 'Error deleting restaurant' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = await connectToDatabase();
    
    const result = await db
      .collection('restaurants')
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: body }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 