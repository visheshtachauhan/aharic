import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { z } from 'zod';

// Validation schema for orders
const orderSchema = z.object({
  table: z.string(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    category: z.string()
  })),
  amount: z.number(),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
  paymentMethod: z.enum(['cash', 'card', 'upi'])
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    // Create the order
    const result = await db.collection('orders').insertOne({
      ...validationResult.data,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Order created successfully',
      orderId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create order' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    // Fetch all orders, sorted by newest first
    const orders = await db.collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch orders' 
      },
      { status: 500 }
    );
  }
} 