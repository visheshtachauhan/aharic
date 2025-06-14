import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Table } from '@/models/Table';

// GET /api/admin/tables
export async function GET() {
  try {
    await connectToDatabase();
    const tables = await Table.find({}).sort({ number: 1 });
    return NextResponse.json({ success: true, tables });
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
    await connectToDatabase();
    
    const table = new Table({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await table.save();
    return NextResponse.json({ success: true, table });
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
    const { id, ...data } = await req.json();
    await connectToDatabase();
    
    const table = await Table.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
    
    if (!table) {
      return NextResponse.json(
        { success: false, message: 'Table not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, table });
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
    
    await connectToDatabase();
    const table = await Table.findByIdAndDelete(id);
    
    if (!table) {
      return NextResponse.json(
        { success: false, message: 'Table not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete table' },
      { status: 500 }
    );
  }
} 