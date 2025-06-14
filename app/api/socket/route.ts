import { NextRequest, NextResponse } from 'next/server';
import { initSocketServer, NextApiResponseWithSocket } from '@/lib/socket';

// This route needs to be updated to work with App Router
export async function GET(req: NextRequest, res: any) {
  // For App Router, we should use a different approach
  // This is a temporary workaround
  return new Response("Socket server is configured elsewhere", {
    status: 200,
  });
} 