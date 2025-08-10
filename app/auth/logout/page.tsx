'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      try {
        // Clear demo cookie if present
        document.cookie = 'demoOwner=; path=/; max-age=0';
        await signOut();
      } finally {
        router.replace('/auth/login');
      }
    };
    void doLogout();
  }, [router, signOut]);

  return null;
} 