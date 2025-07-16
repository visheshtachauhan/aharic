import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

interface Table {
  _id: string;
  restaurantId: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  location: {
    floor?: string;
    section?: string;
  };
  notes: string;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
const tables = new Map<string, Table>();

// Helper function to generate QR code
async function generateQRCode(restaurantId: string, tableId: string) {
  try {
    // Create a shorter URL format
    const url = `/r/${restaurantId}/t/${tableId}`;
    
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'L',
      margin: 1,
      width: 256,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return qrCode;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}

// GET /api/restaurants/[id]/tables
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const restaurantId = params.id;
    let restaurantTables = Array.from(tables.values()).filter(table => table.restaurantId === restaurantId);

    // If no tables exist, create sample tables with notes
    if (restaurantTables.length === 0) {
      const sampleTables = await Promise.all([
        {
          number: 'T1',
          capacity: 4,
          status: 'available',
          location: { floor: '1', section: 'Main Hall' },
          notes: 'Near window with city view'
        },
        {
          number: 'T2',
          capacity: 2,
          status: 'occupied',
          location: { floor: '1', section: 'Outdoor' },
          notes: 'Romantic corner table with garden view'
        },
        {
          number: 'T3',
          capacity: 6,
          status: 'reserved',
          location: { floor: '1', section: 'Private' },
          notes: 'Private dining area, suitable for business meetings'
        },
        {
          number: 'T4',
          capacity: 8,
          status: 'available',
          location: { floor: '2', section: 'Family' },
          notes: 'Large family table with high chairs available'
        }
      ].map(async (tableData, index) => {
        const tableId = `${Date.now()}-${index + 1}`;
        const table = {
          _id: tableId,
          restaurantId,
          ...tableData,
          qrCode: await generateQRCode(restaurantId, tableId),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        tables.set(tableId, table);
        return table;
      }));
      restaurantTables = await Promise.all(sampleTables);
    }

    return NextResponse.json(restaurantTables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Error fetching tables' }, { status: 500 });
  }
}

// POST /api/restaurants/[id]/tables
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const restaurantId = params.id;
    const data = await req.json();
    
    const tableId = `${Date.now()}`;
    const table = {
      _id: tableId,
      restaurantId,
      number: data.number,
      capacity: data.capacity,
      status: 'available',
      location: data.location || {},
      notes: data.notes || '',
      qrCode: await generateQRCode(restaurantId, tableId),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    tables.set(tableId, table);
    return NextResponse.json(table);
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json({ error: 'Error creating table' }, { status: 500 });
  }
}

// PUT /api/restaurants/[id]/tables
export async function PUT(req: Request) {
  try {
    const { tableId, status } = await req.json();
    
    const existingTable = tables.get(tableId);
    if (!existingTable) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    const updatedTable = {
      ...existingTable,
      status,
      updatedAt: new Date()
    };

    tables.set(tableId, updatedTable);
    return NextResponse.json(updatedTable);
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json({ error: 'Error updating table' }, { status: 500 });
  }
}

// DELETE /api/restaurants/[id]/tables/[tableId]
export async function DELETE(req: Request, { params }: { params: { tableId: string } }) {
  try {
    const { tableId } = params;
    
    if (!tables.has(tableId)) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    tables.delete(tableId);
    return NextResponse.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json({ error: 'Error deleting table' }, { status: 500 });
  }
} 