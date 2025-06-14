import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const format = searchParams.get('format') || 'csv';

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required date parameters' },
        { status: 400 }
      );
    }

    if (format !== 'csv') {
      return NextResponse.json(
        { error: 'Unsupported format' },
        { status: 400 }
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');
    const menuCollection = db.collection('menu');

    // Get orders within date range
    const orders = await ordersCollection
      .find({
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      })
      .toArray();

    // Get menu items for reference
    const menuItems = await menuCollection.find().toArray();
    const menuItemsMap = new Map(menuItems.map(item => [item._id.toString(), item]));

    // Prepare CSV data
    const csvRows = [];

    // Headers
    csvRows.push([
      'Order ID',
      'Date',
      'Time',
      'Table',
      'Items',
      'Subtotal',
      'Tax',
      'Total',
      'Payment Status',
      'Order Status'
    ].join(','));

    // Order data
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const items = order.items
        .map((item: { menuItemId: string; quantity: number }) => {
          const menuItem = menuItemsMap.get(item.menuItemId.toString());
          return `${item.quantity}x ${menuItem?.name || 'Unknown Item'}`;
        })
        .join('; ');

      csvRows.push([
        order._id.toString(),
        date.toISOString().split('T')[0],
        date.toTimeString().split(' ')[0],
        order.table,
        `"${items}"`,
        order.subtotal.toFixed(2),
        order.tax.toFixed(2),
        order.total.toFixed(2),
        order.paymentStatus,
        order.status
      ].join(','));
    });

    // Create CSV content
    const csvContent = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="orders-${fromDate.toISOString().split('T')[0]}-to-${toDate.toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
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