import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';

type AuthError = {
  message: string;
  status?: number;
  name?: string;
};

type AuthResult = {
  success: boolean;
  error: string | null;
  isNewUser?: boolean;
  needsPasswordReset?: boolean;
  action: 'login' | 'signup' | 'reset' | 'error';
};

type DebugOptions = {
  deleteUser?: boolean;
  resetPassword?: boolean;
  forceConfirm?: boolean;
};

export function useSmartSupabaseAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      router.push('/admin/dashboard');
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  // Debug: Environment check
  useEffect(() => {
    console.log('=== Environment Check ===');
    console.log('1. Environment:', process.env.NODE_ENV);
    console.log('2. Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('3. Supabase Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('4. Service Role Key exists (dev only):', 
      process.env.NODE_ENV === 'development' ? !!process.env.SUPABASE_SERVICE_ROLE_KEY : 'N/A'
    );
  }, []);

  // Debug: Session check
  useEffect(() => {
    const checkSession = async () => {
      console.log('=== Session Check ===');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('1. Current session:', {
        hasSession: !!session,
        user: session?.user?.email,
        error: error?.message,
        timestamp: new Date().toISOString()
      });

      if (session) {
        console.log('2. Session details:', {
          expiresAt: session.expires_at,
          refreshToken: !!session.refresh_token,
          accessToken: !!session.access_token,
          timestamp: new Date().toISOString()
        });
      }
    };

    checkSession();
  }, [supabase]);

  // Debug helper for development
  const debugUser = async (email: string, options: DebugOptions = {}) => {
    if (process.env.NODE_ENV !== 'development') {
      console.error('Debug functions are only available in development');
      return;
    }

    console.log('=== Debug User Action ===');
    console.log('1. Debug options:', {
      email,
      options,
      timestamp: new Date().toISOString()
    });

    try {
      const serviceRoleClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      if (options.deleteUser) {
        console.log('2. Deleting user...');
        const { error } = await serviceRoleClient.auth.admin.deleteUser(email);
        if (error) throw error;
        console.log('3. User deleted successfully');
      }

      if (options.resetPassword) {
        console.log('2. Resetting password...');
        const { error } = await serviceRoleClient.auth.admin.updateUserById(
          email,
          { password: 'test123456' }
        );
        if (error) throw error;
        console.log('3. Password reset successfully');
      }

      if (options.forceConfirm) {
        console.log('2. Forcing email confirmation...');
        const { error } = await serviceRoleClient.auth.admin.updateUserById(
          email,
          { email_confirm: true }
        );
        if (error) throw error;
        console.log('3. Email confirmed successfully');
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Debug action failed:', error);
      return { success: false, error };
    }
  };

  const smartLoginOrSignup = async (
    email: string,
    password: string,
    options?: {
      redirectTo?: string;
      showToasts?: boolean;
      debug?: DebugOptions;
    }
  ): Promise<AuthResult> => {
    const {
      redirectTo = '/admin/dashboard',
      showToasts = process.env.NODE_ENV === 'development',
      debug
    } = options || {};

    setLoading(true);

    console.log('=== Smart Auth Flow Start ===');
    console.log('1. Initial state:', {
      email,
      passwordLength: password?.length,
      redirectTo,
      timestamp: new Date().toISOString()
    });

    // Handle debug actions first if in development
    if (debug && process.env.NODE_ENV === 'development') {
      console.log('2. Running debug actions...');
      const debugResult = await debugUser(email, debug);
      if (!debugResult?.success) {
        return {
          success: false,
          error: 'Debug action failed',
          action: 'error'
        };
      }
    }

    try {
      // Step 1: Try to sign in first
      console.log('3. Attempting initial sign in...');
      const signInResult = await signIn(email, password);

      if (signInResult) {
        console.log('4. Initial sign in successful:', {
          user: user?.email,
          session: {
            expiresAt: user?.user_metadata.expires_at,
            refreshToken: !!user?.user_metadata.refresh_token,
            accessToken: !!user?.user_metadata.access_token
          },
          timestamp: new Date().toISOString()
        });

        if (showToasts) {
          toast({
            title: 'Welcome back!',
            description: 'Successfully signed in.',
          });
        }

        return { 
          success: true, 
          error: null,
          action: 'login'
        };
      }

      // If sign in fails, try to sign up
      console.log('5. Invalid credentials, attempting signup...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // Handle signup response
      if (signUpError) {
        // If user already exists (422)
        if (signUpError.status === 422) {
          console.log('6. User exists, initiating password reset...');
          
          // Step 3: Initiate password reset
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });

          if (resetError) {
            console.error('❌ Password reset error:', {
              message: resetError.message,
              timestamp: new Date().toISOString()
            });

            return {
              success: false,
              error: 'Failed to send password reset email',
              action: 'error'
            };
          }

          console.log('7. Password reset email sent:', {
            email,
            timestamp: new Date().toISOString()
          });

          if (showToasts) {
            toast({
              title: 'Password reset required',
              description: 'Please check your email for reset instructions.',
            });
          }

          return {
            success: true,
            error: null,
            needsPasswordReset: true,
            action: 'reset'
          };
        }

        console.error('❌ Signup error:', {
          message: signUpError.message,
          status: signUpError.status,
          timestamp: new Date().toISOString()
        });

        return {
          success: false,
          error: signUpError.message,
          action: 'error'
        };
      }

      // If signup succeeded
      if (signUpData.user) {
        console.log('6. Signup successful:', {
          user: signUpData.user.email,
          session: signUpData.session ? {
            expiresAt: signUpData.session.expires_at,
            refreshToken: !!signUpData.session.refresh_token,
            accessToken: !!signUpData.session.access_token
          } : null,
          timestamp: new Date().toISOString()
        });

        return { 
          success: true, 
          error: null, 
          isNewUser: true,
          action: 'signup'
        };
      }

      return {
        success: false,
        error: 'An unexpected error occurred during signup',
        action: 'error'
      };
    } catch (error) {
      console.error('❌ Unexpected auth error:', {
        error,
        email,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: 'An unexpected error occurred',
        action: 'error'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    smartLoginOrSignup,
    signOut,
    debugUser: process.env.NODE_ENV === 'development' ? debugUser : undefined
  };
} 