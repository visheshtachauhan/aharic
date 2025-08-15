'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the working dashboard
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Dashboard...</h1>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
}
