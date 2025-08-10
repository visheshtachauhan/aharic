import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Check if demo lockdown is enabled (case-insensitive)
    const demoLockdown = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN?.toLowerCase() === 'true';
    
    console.log('🔐 Demo login attempt:', { 
      email, 
      demoLockdown, 
      envValue: process.env.NEXT_PUBLIC_DEMO_LOCKDOWN 
    });
    
    if (!demoLockdown) {
      console.log('❌ Demo mode not enabled');
      return NextResponse.json(
        { error: 'Demo mode not enabled', envValue: process.env.NEXT_PUBLIC_DEMO_LOCKDOWN },
        { status: 400 }
      );
    }

    // Check if demo credentials match
    if (email === 'demo@aaharic.com' && password === 'Demo@123') {
      console.log('✅ Demo credentials valid, setting cookie');
      
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

      console.log('🍪 Demo owner cookie set successfully');
      return response;
    }

    console.log('❌ Invalid demo credentials');
    // If not demo credentials, return error
    return NextResponse.json(
      { error: 'Invalid demo credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('💥 Demo login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 