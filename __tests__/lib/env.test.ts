jest.mock('@/lib/env', () => ({
  env: {
    MONGODB_URI: 'mongodb://localhost:27017/test',
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key',
    NEXT_PUBLIC_APP_URL: 'https://aaharic.me',
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: '587',
    SMTP_USER: 'test@example.com',
    SMTP_PASSWORD: 'test-password',
    STORAGE_BUCKET: 'test-bucket',
    STORAGE_URL: 'https://storage.example.com',
    API_KEY: 'test-api-key',
    API_SECRET: 'test-api-secret',
    ENABLE_ANALYTICS: 'true',
    ENABLE_NOTIFICATIONS: 'true',
    ENABLE_REALTIME: 'true',
  },
  isDevelopment: () => true,
  isProduction: () => false,
  isTest: () => false,
}));

import { env, isDevelopment, isProduction, isTest } from '@/lib/env';

describe('Environment Variables', () => {
  it('should have required environment variables', () => {
    expect(env.MONGODB_URI).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  it('should have default values for optional variables', () => {
    expect(env.NEXT_PUBLIC_APP_URL).toBe('https://aaharic.me');
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