// Demo mode auth page - shows demo message when NEXT_PUBLIC_DEMO_LOCKDOWN=true
export default function AuthDisabled() { 
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_LOCKDOWN === 'true';
  
  if (isDemoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Demo Mode Active
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Authentication is disabled in demo mode. All owner routes are accessible without login.
            </p>
            <div className="mt-4">
              <a 
                href="/owner/dashboard" 
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Go to Owner Dashboard →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Production auth page would go here
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="text-muted-foreground">Authentication system coming soon...</p>
      </div>
    </div>
  );
}