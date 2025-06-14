import { getServerSession } from "@auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, ownerName, email, password } = await req.json();

    // Validate input
    if (!name || !ownerName || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create restaurant
    const restaurant = await db.collection('restaurants').insertOne({
      name,
      ownerName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create user
    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name: ownerName,
      role: 'restaurant_owner',
      restaurantId: restaurant.insertedId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 