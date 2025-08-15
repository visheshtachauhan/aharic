// TODO(demo): auth disabled temporarily for demo. Re-enable after backend auth is ready.
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/owner/dashboard');
    }, 1000);
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/auth/login');
    }, 1000);
  };

  const signOut = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/auth/login');
    }, 500);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading,
    error,
  };
} 