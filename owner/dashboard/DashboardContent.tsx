'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';

export default function DashboardContent() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    const demoLockdown = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN === 'true';
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

  // Rest of your dashboard code...
  // ... (keep all the existing dashboard code)
} 