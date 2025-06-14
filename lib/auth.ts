import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { env } from './env';

// Server-side Supabase client
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

// Server-side auth check
export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Server-side auth redirect
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }
  return session;
}

// Server-side admin check
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }
  if (session.user.user_metadata.role !== 'admin') {
    redirect('/dashboard');
  }
  return session;
}

// Auth actions
export async function signIn(email: string, password: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
}

export async function signUp(email: string, password: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export type AuthResult = {
  success: boolean;
  error?: string;
};

// Client-side session management
export async function getClientSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Client-side auth check
export async function checkAuth() {
  const session = await getClientSession();
  if (!session) {
    window.location.href = '/auth/login';
    return null;
  }
  return session;
}

// Client-side admin check
export async function checkAdmin() {
  const session = await getClientSession();
  if (!session) {
    window.location.href = '/auth/login';
    return null;
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    window.location.href = '/dashboard';
    return null;
  }

  return session;
} 