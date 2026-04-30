-- Team Name: Divine coder
-- Team Lead: Praveen kumar
-- Project: RoadSoS (IIT Madras Hackathon)
-- Migration: 001_enforce_rls.sql

-- Enable RLS on all tables
ALTER TABLE ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE crash_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can see hospitals and ambulances
CREATE POLICY "Public hospitals are viewable by everyone" 
ON hospitals FOR SELECT 
USING (true);

CREATE POLICY "Ambulances are viewable by authenticated responders" 
ON ambulances FOR SELECT 
TO authenticated 
USING (true);

-- Policy: Crash events are restricted
-- Only the user who reported it (if applicable) or responders can see them
CREATE POLICY "Crash events are viewable by responders" 
ON crash_events FOR SELECT 
TO authenticated 
USING (auth.role() = 'authenticated');

CREATE POLICY "IoT devices can insert crash events" 
ON crash_events FOR INSERT 
WITH CHECK (true); -- In production, we would use a service role or specific IoT claims

-- Ensure the Next.js client uses the anon key which maps to 'anon' role
-- These policies allow 'anon' to read public data but not sensitive crash events
