export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { headers } from 'next/headers';

type RestaurantQuery = {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  'menuItems.category'?: string;
};

export async function GET() {
  try {
    const headersList = headers();
    const searchParams = new URLSearchParams(headersList.get('x-search-params') || '');
    const restaurantsCollection = await getCollection('restaurants');

    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Build query
    const query: RestaurantQuery = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'menuItems.name': { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query['menuItems.category'] = category;
    }

    // Get total count for pagination
    const total = await restaurantsCollection.countDocuments(query);

    // Get restaurants with pagination
    const restaurants = await restaurantsCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      restaurants,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 