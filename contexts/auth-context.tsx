"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  isResettingPassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps { 
  children: React.ReactNode;
  session: Session | null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(session?.user ?? null);
  const [loading, setLoading] = useState(session === undefined);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, password: string) => {
    try {
      setIsSigningIn(true);
      
      // Demo bypass check - if demo lockdown is enabled and demo credentials match
      const demoLockdown = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN?.toLowerCase() === 'true';
      const isDemoCreds = email === 'demo@aaharic.com' && password === 'Demo123';
      
      console.log('🔐 Login attempt:', { email, demoLockdown, isDemoCreds });
      
      if (demoLockdown && isDemoCreds) {
        console.log('🚀 Attempting demo login via API...');
        
        // Use API route for demo login to ensure proper cookie handling
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        console.log('📡 Demo login response:', { status: response.status, ok: response.ok });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Demo login failed:', errorData);
          throw new Error(errorData.error || 'Demo login failed');
        }

        const data = await response.json();
        console.log('✅ Demo login success:', data);
        
        // Create a mock user object for demo purposes
        const mockUser: User = {
          id: 'demo-user-id',
          email: 'demo@aaharic.com',
          user_metadata: { role: 'owner' },
          app_metadata: { role: 'owner' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: 'owner',
          confirmation_sent_at: null,
          confirmed_at: null,
          invited_at: null,
          recovery_sent_at: null,
          phone: null,
          phone_confirmed_at: null,
          banned_until: null,
          reauthentication_sent_at: null,
          reauthentication_confirmed_at: null,
          email_change_confirm_status: null,
          new_email: null,
          new_phone: null,
          factors: null,
          identities: [],
        } as any;
        
        setUser(mockUser);
        toast.success("Demo login successful!");
        return;
      }
      
      console.log('🔑 Attempting regular Supabase login...');
      
      // Regular Supabase login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in successfully.");
    } catch (e: unknown) {
      const error = e as Error;
      console.error('💥 Login error:', error);
      toast.error(error.message || "Failed to sign in. Please check your credentials and try again.");
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsSigningUp(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Account created successfully. Please check your email for verification.");
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error.message || "Failed to create account. Please try again.");
      throw error;
    } finally {
      setIsSigningUp(false);
    }
  };

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Clear demo cookie if present
      document.cookie = 'demoOwner=; path=/; max-age=0; SameSite=Lax';
      
      // Regular Supabase signout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state
      setUser(null);
      toast.success("Signed out successfully.");
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error.message || "Failed to sign out. Please try again.");
      throw error;
    } finally {
      setIsSigningOut(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsResettingPassword(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Password reset instructions sent to your email.");
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error.message || "Failed to send password reset instructions. Please try again.");
      throw error;
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        signUp, 
        signOut, 
        resetPassword,
        isSigningIn,
        isSigningUp,
        isSigningOut,
        isResettingPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 