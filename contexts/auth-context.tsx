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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in successfully.");
    } catch (e: unknown) {
      const error = e as Error;
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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