-- Team Name: Divine coder
-- Team Lead: Praveen kumar
-- Project: RoadSoS (IIT Madras Hackathon)
-- Protocol: Ralph Loop (Greenfield Optimized)
-- Migration: 01_enable_postgis_and_spatial_indexes.sql

-- Step 1: Initialize Spatial Capabilities
CREATE EXTENSION IF NOT EXISTS postgis;

-- Step 2: Refactor Entity Schemas for O(log N) Performance
-- We use GEOGRAPHY(POINT, 4326) to handle spherical earth math natively in meters

-- Ambulances (Mobile Responders)
CREATE TABLE IF NOT EXISTS v2_ambulances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'AVAILABLE',
  current_load INTEGER DEFAULT 0,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospitals (Static Facilities)
CREATE TABLE IF NOT EXISTS v2_hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  has_icu BOOLEAN DEFAULT FALSE,
  current_load INTEGER DEFAULT 0,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  metadata JSONB
);

-- Crash Events (Incident Log)
CREATE TABLE IF NOT EXISTS v2_crash_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hardware_id TEXT NOT NULL,
  severity TEXT,
  vehicle_class TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  telemetry_snapshot JSONB,
  hlc_timestamp TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Implement GiST (Generalized Search Tree) Indexes
-- This is the "Magic Bullet" that transforms O(N) linear scans into O(log N) spatial lookups.
CREATE INDEX IF NOT EXISTS idx_ambulances_spatial ON v2_ambulances USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_hospitals_spatial ON v2_hospitals USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_crash_events_spatial ON v2_crash_events USING GIST (location);

-- Step 4: High-Performance Search Procedures
CREATE OR REPLACE FUNCTION get_nearby_responders_v2(
  target_lat FLOAT, 
  target_lon FLOAT, 
  radius_meters FLOAT DEFAULT 5000,
  min_icu BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  dist_meters FLOAT,
  load INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id, 
    h.name, 
    'hospital'::TEXT as category,
    ST_Distance(h.location, ST_SetSRID(ST_MakePoint(target_lon, target_lat), 4326)::geography) as dist_meters,
    h.current_load as load
  FROM v2_hospitals h
  WHERE ST_DWithin(h.location, ST_SetSRID(ST_MakePoint(target_lon, target_lat), 4326)::geography, radius_meters)
    AND (NOT min_icu OR h.has_icu = TRUE)
  
  UNION ALL

  SELECT 
    a.id, 
    a.name, 
    'ambulance'::TEXT as category,
    ST_Distance(a.location, ST_SetSRID(ST_MakePoint(target_lon, target_lat), 4326)::geography) as dist_meters,
    a.current_load as load
  FROM v2_ambulances a
  WHERE ST_DWithin(a.location, ST_SetSRID(ST_MakePoint(target_lon, target_lat), 4326)::geography, radius_meters)
    AND a.status = 'AVAILABLE'
  
  ORDER BY dist_meters ASC;
END;
$$ LANGUAGE plpgsql STABLE;
