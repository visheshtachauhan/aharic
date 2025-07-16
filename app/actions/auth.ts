'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function signIn(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Partial<ResponseCookie>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Partial<ResponseCookie>) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error signing in:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  return session;
} 