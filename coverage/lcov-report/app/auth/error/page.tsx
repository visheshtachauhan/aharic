'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const errorMessage = searchParams.get('error_description') || 'An unknown authentication error occurred.';
    toast.error(errorMessage.replace(/\+/g, ' '));
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-destructive">Authentication Error</h1>
        <p className="text-muted-foreground">
          There was a problem authenticating your account. Please try again.
        </p>
        <Button onClick={() => router.push('/auth/login')}>
          Return to Login
        </Button>
      </div>
    </div>
  );
}