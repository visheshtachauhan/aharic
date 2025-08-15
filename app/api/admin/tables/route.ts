import { NextResponse } from 'next/server';

// In-memory store for demo (replace with database later)
let tablesStore = [
  {
    _id: '1',
    number: 'T1',
    capacity: 4,
    status: 'available',
    location: {
      floor: 'Ground',
      section: 'Main Floor',
      description: 'Window seat'
    },
    notes: 'Great view of the street',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    number: 'T2',
    capacity: 6,
    status: 'occupied',
    location: {
      floor: 'Ground',
      section: 'Main Floor',
      description: 'Center table'
    },
    notes: 'Popular table',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    number: 'T3',
    capacity: 2,
    status: 'reserved',
    location: {
      floor: 'Ground',
      section: 'Patio',
      description: 'Outdoor seating'
    },
    notes: 'Romantic setting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    number: 'T4',
    capacity: 8,
    status: 'available',
    location: {
      floor: 'First',
      section: 'Private',
      description: 'Private dining room'
    },
    notes: 'Perfect for groups',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/admin/tables
export async function GET() {
  try {
    return NextResponse.json({ success: true, tables: tablesStore });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}

// POST /api/admin/tables
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const newTable = {
      _id: (tablesStore.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tablesStore.push(newTable);
    return NextResponse.json({ success: true, table: newTable });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create table' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tables
export async function PUT(req: Request) {
  try {
    const { _id, ...data } = await req.json();
    
    const tableIndex = tablesStore.findIndex(table => table._id === _id);
    if (tableIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Table not found' },
        { status: 404 }
      );
    }
    
    const updatedTable = {
      ...tablesStore[tableIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    tablesStore[tableIndex] = updatedTable;
    return NextResponse.json({ success: true, table: updatedTable });
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update table' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tables
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Table ID is required' },
        { status: 400 }
      );
    }
    
    const tableIndex = tablesStore.findIndex(table => table._id === id);
    if (tableIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Table not found' },
        { status: 404 }
      );
    }
    
    tablesStore.splice(tableIndex, 1);
    return NextResponse.json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete table' },
      { status: 500 }
    );
  }
} 