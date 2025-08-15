// TODO(demo): auth disabled temporarily for demo. Re-enable after backend auth is ready.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly for demo mode - no auth wrapper
  return <>{children}</>;
} 