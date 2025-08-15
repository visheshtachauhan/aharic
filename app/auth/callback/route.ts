// TODO(demo): auth disabled temporarily for demo. Re-enable after backend auth is ready.
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/auth/login', request.url));
} 