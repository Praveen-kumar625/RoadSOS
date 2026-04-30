/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Module: Master Environment Validator
 */

import { z } from 'zod';

const globalEnvSchema = z.object({
  PORT: z.string().transform(Number).default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HF_TOKEN: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string().min(1),
  REDIS_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1)
});

const _env = globalEnvSchema.safeParse(process.env);

if (!_env.success) {
  // We only warn here for the root validator as specific apps might have their own subsets
  console.warn('⚠️ Global Environment Validation Warning:', _env.error.format());
}

export const env = _env.success ? _env.data : process.env;
export default env;
