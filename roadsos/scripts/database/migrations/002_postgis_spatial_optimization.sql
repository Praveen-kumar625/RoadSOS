-- Team Name: Divine coder
-- Team Lead: Praveen kumar
-- Project: RoadSoS (IIT Madras Hackathon)
-- Migration: 002_postgis_spatial_optimization.sql

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add Geometry columns and transform existing data (simulated)
-- We use GEOGRAPHY(POINT, 4326) for easier distance calculations in meters

-- For ambulances
ALTER TABLE ambulances ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);
CREATE INDEX IF NOT EXISTS ambulances_spatial_idx ON ambulances USING GIST (location);

-- For hospitals
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);
CREATE INDEX IF NOT EXISTS hospitals_spatial_idx ON hospitals USING GIST (location);

-- For crash events
ALTER TABLE crash_events ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);
CREATE INDEX IF NOT EXISTS crash_events_spatial_idx ON crash_events USING GIST (location);

-- 3. Migration logic to sync lat/lon to geometry (if columns exist)
-- UPDATE ambulances SET location = ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography WHERE lat IS NOT NULL AND lon IS NOT NULL;
-- UPDATE hospitals SET location = ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography WHERE lat IS NOT NULL AND lon IS NOT NULL;
-- UPDATE crash_events SET location = ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography WHERE lat IS NOT NULL AND lon IS NOT NULL;
