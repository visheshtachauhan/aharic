import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { addDays, format, subDays } from 'date-fns';

const generateDummyData = (fromDate: Date, toDate: Date) => {
  const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  const dailyRevenue = Array.from({ length: days }, (_, i) => {
    const date = addDays(fromDate, i);
    const amount = Math.floor(5000 + Math.random() * 15000);
    return { date: date.toISOString(), amount };
  });

  const dailyOrders = dailyRevenue.map(({ date }) => ({
    date,
    count: Math.floor(10 + Math.random() * 40),
  }));

  const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.amount, 0);
  const totalOrders = dailyOrders.reduce((sum, day) => sum + day.count, 0);
  const prevPeriodRevenue = totalRevenue * 0.85;
  const prevPeriodOrders = totalOrders * 0.9;

  return {
    revenue: {
      total: totalRevenue,
      growth: ((totalRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100,
      daily: dailyRevenue,
    },
    orders: {
      total: totalOrders,
      growth: ((totalOrders - prevPeriodOrders) / prevPeriodOrders) * 100,
      daily: dailyOrders,
    },
    customers: {
      total: Math.floor(totalOrders * 0.7),
      new: Math.floor(totalOrders * 0.2),
      returning: Math.floor(totalOrders * 0.5),
    },
    items: {
      topSelling: [
        { name: 'Butter Chicken', quantity: 145, revenue: 43500 },
        { name: 'Paneer Tikka', quantity: 120, revenue: 30000 },
        { name: 'Dal Makhani', quantity: 98, revenue: 19600 },
        { name: 'Chicken Biryani', quantity: 89, revenue: 26700 },
      ],
      lowStock: [
        { name: 'Gulab Jamun', quantity: 5 },
        { name: 'Mango Lassi', quantity: 8 },
      ],
    },
    averageOrderValue: Math.floor(totalRevenue / totalOrders),
    peakHours: [
      { hour: '12 PM', orders: 45 },
      { hour: '1 PM', orders: 52 },
      { hour: '2 PM', orders: 38 },
      { hour: '3 PM', orders: 25 },
      { hour: '4 PM', orders: 18 },
      { hour: '5 PM', orders: 22 },
      { hour: '6 PM', orders: 35 },
      { hour: '7 PM', orders: 48 },
      { hour: '8 PM', orders: 62 },
      { hour: '9 PM', orders: 55 },
      { hour: '10 PM', orders: 42 },
    ],
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required date parameters' },
        { status: 400 }
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    try {
      const db = await connectToDatabase();
      const ordersCollection = db.collection('orders');

      // Try to get real data
      const orders = await ordersCollection
        .find({
          createdAt: {
            $gte: fromDate,
            $lte: toDate,
          },
        })
        .toArray();

      if (orders.length === 0) {
        // If no real data, return dummy data
        return NextResponse.json(generateDummyData(fromDate, toDate));
      }

      // Process real data here if needed
      // For now, return dummy data
      return NextResponse.json(generateDummyData(fromDate, toDate));
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return dummy data if database is not available
      return NextResponse.json(generateDummyData(fromDate, toDate));
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 