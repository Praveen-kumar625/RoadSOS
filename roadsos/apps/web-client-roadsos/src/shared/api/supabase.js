/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://raeiaewxsdxgzumyafiw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * SECURE SUPABASE CLIENT (V2)
 * Strictly utilizes the Anon Key for client-side operations.
 * RLS (Row Level Security) handles the data perimeter.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
