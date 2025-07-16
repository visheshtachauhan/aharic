"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/auth-context";
import { SoundProvider } from "@/contexts/SoundContext";
import { CartProvider } from "@/contexts/cart-context";
import { Session } from "@supabase/supabase-js";
import { Toaster as Sonner } from 'sonner';

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SoundProvider>
        <CartProvider>
          <AuthProvider session={session}>
            {children}
            <Sonner />
          </AuthProvider>
        </CartProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}

export { useAuth } from "@/contexts/auth-context"; 