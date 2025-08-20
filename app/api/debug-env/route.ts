import { NextResponse } from 'next/server';

export async function GET() {
  // Only expose non-sensitive environment variables
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_DEMO_AUTH_DISABLED: process.env.NEXT_PUBLIC_DEMO_AUTH_DISABLED,
    DEMO_AUTH_DISABLED: process.env.DEMO_AUTH_DISABLED,
    NEXT_PUBLIC_DEMO_LOCKDOWN: process.env.NEXT_PUBLIC_DEMO_LOCKDOWN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'NOT_SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(envVars);
} 