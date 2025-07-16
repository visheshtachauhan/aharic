/**
 * Environment variable validation and type definitions
 */

import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Required
  MONGODB_URI: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Optional with defaults
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().email().default(''),
  SMTP_PASSWORD: z.string().default(''),
  STORAGE_BUCKET: z.string().default(''),
  STORAGE_URL: z.string().url().default(''),
  API_KEY: z.string().default(''),
  API_SECRET: z.string().default(''),
  ENABLE_ANALYTICS: z.enum(['true', 'false']).default('true'),
  ENABLE_NOTIFICATIONS: z.enum(['true', 'false']).default('true'),
  ENABLE_REALTIME: z.enum(['true', 'false']).default('true'),
});

// Type-safe environment variables
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

// Parse and validate environment variables
const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  STORAGE_URL: process.env.STORAGE_URL,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
  ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS,
  ENABLE_REALTIME: process.env.ENABLE_REALTIME,
});

// Export environment variables with type safety
export { env };

// Export type for environment variables
export type Env = z.infer<typeof envSchema>;

// Export helper functions
export function getEnvVar<T extends keyof Env>(key: T): Env[T] {
  return env[key];
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

// Export feature flags
export const features = {
  analytics: env.ENABLE_ANALYTICS === 'true',
  notifications: env.ENABLE_NOTIFICATIONS === 'true',
  realtime: env.ENABLE_REALTIME === 'true',
} as const;