"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFF6F0] flex items-center justify-center px-4">
      <div className="text-center space-y-4 animate-pulse">
        <div className="w-16 h-16 mx-auto mb-6 primary-gradient rounded-full flex items-center justify-center">
          <span className="text-2xl">🚀</span>
        </div>
        <h2 className="text-2xl font-bold gradient-text">Taking You to Your Dashboard</h2>
        <p className="text-[#666666] text-lg">
          Please wait while we prepare your experience ✨
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full primary-gradient animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full primary-gradient animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full primary-gradient animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}