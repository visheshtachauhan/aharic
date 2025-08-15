// TODO(demo): auth disabled temporarily for demo. Re-enable after backend auth is ready.
export async function signIn(formData: FormData) {
  return { error: 'Authentication temporarily disabled for demo' };
}

export async function getSession() {
  return null;
} 