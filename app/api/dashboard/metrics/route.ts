import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const tablesCollection = await getCollection('tables');
    const ordersCollection = await getCollection('orders');
    const bookingsCollection = await getCollection('bookings');

    const [totalTables, activeOrders, todaySales, todayBookings] = await Promise.all([
      tablesCollection.countDocuments(),
      ordersCollection.countDocuments({ status: 'active' }),
      ordersCollection.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]).toArray(),
      bookingsCollection.countDocuments({
        date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    const yesterdaySales = await ordersCollection.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
            $lt: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]).toArray();

    const todayTotal = todaySales[0]?.total || 0;
    const yesterdayTotal = yesterdaySales[0]?.total || 0;
    const salesGrowth = yesterdayTotal === 0 ? 100 : ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;

    return NextResponse.json({
      totalTables,
      activeOrders,
      todaySales: todayTotal,
      todayBookings,
      salesGrowth
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
