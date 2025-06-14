"use client";

import { ReactNode } from "react";
import { SoundProvider } from "@/contexts/SoundContext";
import { CartProvider } from "@/contexts/cart-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SoundProvider>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </SoundProvider>
    </ThemeProvider>
  );
} 