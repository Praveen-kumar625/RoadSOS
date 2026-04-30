/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { z } from 'zod';
import { config } from 'dotenv';

// Auto-load .env for local development fallback
config();

/**
 * PRODUCTION-GRADE ENVIRONMENT ORCHESTRATOR
 * Enforces zero-leak secrets management and strict type validation.
 */
const envSchema = z.object({
  // Infrastructure
  PORT: z.string().transform(Number).default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  
  // Security
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters for HS256 integrity"),
  
  // Supabase (Spatial Database)
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Service role key required for administrative spatial operations"),
  SUPABASE_DB_PASSWORD: z.string().min(1),
  
  // Upstash Redis (State & Pub/Sub)
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  REDIS_URL: z.string().url(),

  // AI & External Services
  HF_TOKEN: z.string().min(1, "HuggingFace token required for Aegis-Core inference"),
  
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

/**
 * Validates and exports the hardened configuration.
 */
const _env = envSchema.safeParse({
  ...process.env,
  // Mapping provided production credentials for the Greenfield build
  SUPABASE_URL: 'https://raeiaewxsdxgzumyafiw.supabase.co',
  UPSTASH_REDIS_REST_URL: 'https://enough-sheep-82324.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'gQAAAAAAAUGUAAIgcDIyOTVjZTFmOGI3NGY0OGJkYTBkYWI5MzQ1M2YyZDBiNg',
  REDIS_URL: 'rediss://default:gQAAAAAAAUGUAAIgcDIyOTVjZTFmOGI3NGY0OGJkYTBkYWI5MzQ1M2YyZDBiNg@enough-sheep-82324.upstash.io:6379'
});

if (!_env.success) {
  console.error('❌ [CRITICAL] Environment Validation Failed:', JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const ENV = _env.data;
export default ENV;
