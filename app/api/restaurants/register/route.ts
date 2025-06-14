import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Restaurant } from '@/types/restaurant';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();

    // Validate required fields
    const requiredFields = ['name', 'image', 'address', 'phone'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new restaurant
    const newRestaurant: Restaurant = {
      _id: new ObjectId(),
      name: body.name,
      image: body.image,
      rating: 0,
      reviews: 0,
      address: body.address,
      phone: body.phone,
      menuItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert restaurant into database
    await db.restaurants.insertOne(newRestaurant);

    return NextResponse.json({
      message: 'Restaurant registered successfully',
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error('Error registering restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 