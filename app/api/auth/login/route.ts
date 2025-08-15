// TODO(demo): auth disabled temporarily for demo. Re-enable after backend auth is ready.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Authentication API temporarily disabled for demo' },
    { status: 503 }
  );
} 