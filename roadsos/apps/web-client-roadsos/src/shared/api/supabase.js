/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://raeiaewxsdxgzumyafiw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImV4cCI6MTkwOTg0NTI3OX0.dummy_key_to_prevent_crash_when_env_is_missing';

/**
 * SECURE SUPABASE CLIENT (V2)
 * Strictly utilizes the Anon Key for client-side operations.
 * RLS (Row Level Security) handles the data perimeter.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
