import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    
    // Get all unique categories from menu items
    const categories = await restaurantsCollection.distinct('menuItems.category');

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 