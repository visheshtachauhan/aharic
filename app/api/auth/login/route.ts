import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Check if demo lockdown is enabled
    const demoLockdown = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN === 'true';
    
    if (!demoLockdown) {
      return NextResponse.json(
        { error: 'Demo mode not enabled' },
        { status: 400 }
      );
    }

    // Check if demo credentials match
    if (email === 'demo@aaharic.com' && password === 'Demo@123') {
      // Create response with demo owner cookie
      const response = NextResponse.json(
        { 
          success: true, 
          user: {
            id: 'demo-user-id',
            email: 'demo@aaharic.com',
            role: 'owner'
          },
          message: 'Demo login successful'
        },
        { status: 200 }
      );

      // Set demo owner cookie
      response.cookies.set('demoOwner', '1', {
        path: '/',
        maxAge: 86400, // 24 hours
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      return response;
    }

    // If not demo credentials, return error
    return NextResponse.json(
      { error: 'Invalid demo credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 