// TODO(demo): auth disabled temporarily for demo. Re-enable after backend auth is ready.
export type AuthResult = {
  success: boolean;
  error?: string;
  user?: any;
};

export async function signIn(email: string, password: string): Promise<AuthResult> {
  // Mock successful login for demo
  return {
    success: true,
    user: { id: 'demo-user', email, role: 'owner' },
  };
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  // Mock successful signup for demo
  return {
    success: true,
    user: { id: 'demo-user', email, role: 'owner' },
  };
}

export async function signOut(): Promise<AuthResult> {
  // Mock successful signout for demo
  return {
    success: true,
  };
} 