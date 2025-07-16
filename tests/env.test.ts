import { env, isDevelopment, isProduction, isTest } from '@/lib/env';

describe('Environment Variables', () => {
  it('should have required environment variables', () => {
    expect(env.MONGODB_URI).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  it('should have default values for optional variables', () => {
    expect(env.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000');
    expect(env.SMTP_HOST).toBe('smtp.gmail.com');
    expect(env.SMTP_PORT).toBe('587');
  });

  it('should have feature flags', () => {
    expect(env.ENABLE_ANALYTICS).toBeDefined();
    expect(env.ENABLE_NOTIFICATIONS).toBeDefined();
    expect(env.ENABLE_REALTIME).toBeDefined();
  });

  it('should detect environment correctly', () => {
    // These tests will pass in development
    expect(isDevelopment()).toBe(true);
    expect(isProduction()).toBe(false);
    expect(isTest()).toBe(false);
  });
}); 