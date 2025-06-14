import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
  );
} 