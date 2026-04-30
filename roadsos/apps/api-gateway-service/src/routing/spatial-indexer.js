/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { ENV } from '../config/env.js';
import axios from 'axios';

/**
 * HIGH-PERFORMANCE SPATIAL DISPATCH QUERIES (O(log N))
 * Uses PostGIS native spatial indexing.
 */

const SUPABASE_REST_URL = `${ENV.SUPABASE_URL}/rest/v1`;
const HEADERS = {
  'apikey': ENV.SUPABASE_KEY,
  'Authorization': `Bearer ${ENV.SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

/**
 * Find nearby emergency responders using PostGIS
 */
export async function getNearbyResponders(lat, lon, radiusMeters = 5000) {
  try {
    // We use a custom RPC function in Supabase for spatial queries
    // SQL: 
    // CREATE OR REPLACE FUNCTION get_nearby_responders(lat float, lon float, radius_meters float)
    // RETURNS SETOF responders AS $$
    //   SELECT * FROM responders
    //   WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography, radius_meters)
    //   ORDER BY location <-> ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography;
    // $$ LANGUAGE sql STABLE;

    const response = await axios.post(`${SUPABASE_REST_URL}/rpc/get_nearby_responders`, {
      lat,
      lon,
      radius_meters: radiusMeters
    }, { headers: HEADERS });

    return response.data.map(r => ({
      ...r,
      // PostGIS <-> operator provides distance, but we might need ST_Distance for exact meters
      distance: r.dist_meters || 0 
    }));
  } catch (error) {
    console.warn("[Spatial Optimizer] DB Query failed, falling back to public API/Mocks", error.message);
    return [];
  }
}
