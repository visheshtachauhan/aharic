// TODO(demo): auth disabled temporarily for demo. Re-enable after backend auth is ready.
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  isResettingPassword: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  session: any;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const login = async (email: string, password: string) => {
    setIsSigningIn(true);
    setTimeout(() => {
      setUser({ id: 'demo-user', email, role: 'owner' });
      setIsSigningIn(false);
    }, 1000);
  };

  const signUp = async (email: string, password: string) => {
    setIsSigningUp(true);
    setTimeout(() => {
      setIsSigningUp(false);
    }, 1000);
  };

  const signOut = async () => {
    setIsSigningOut(true);
    setTimeout(() => {
      setUser(null);
      setIsSigningOut(false);
    }, 500);
  };

  const resetPassword = async (email: string) => {
    setIsResettingPassword(true);
    setTimeout(() => {
      setIsResettingPassword(false);
    }, 1000);
  };

  const value = {
    user,
    loading,
    isSigningIn,
    isSigningUp,
    isSigningOut,
    isResettingPassword,
    login,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 