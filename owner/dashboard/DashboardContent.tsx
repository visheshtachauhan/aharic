'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';

export default function DashboardContent() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    const demoLockdown = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN?.toLowerCase() === 'true';
    const hasDemoOwner = typeof document !== 'undefined' && document.cookie.includes('demoOwner=1');
    if (!loading && !user && !(demoLockdown && hasDemoOwner)) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF7300]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
      <p className="text-muted-foreground">Welcome back{user ? `, ${user.email}` : ''}.</p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Today's Orders</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Revenue</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Pending Payments</div>
          <div className="text-2xl font-bold">—</div>
        </div>
      </div>
    </div>
  );
} 