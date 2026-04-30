/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

/**
 * O(log N) OPTIMIZED SPATIAL QUERIES
 * This module eliminates application-side Haversine math.
 * All distance calculations and radius filtering happen inside the PostGIS engine.
 */

export const SPATIAL_QUERIES = {
  /**
   * RPC Call to the optimized stored procedure.
   * Utilizes the GiST index on the 'location' geography column.
   */
  FIND_NEARBY_RESPONDERS: `
    SELECT * FROM get_nearby_responders_v2(
      :lat, 
      :lon, 
      :radius, 
      :requiresIcu
    )
  `,

  /**
   * Inserts a crash event using native ST_MakePoint.
   */
  INSERT_CRASH_EVENT: `
    INSERT INTO v2_crash_events (
      hardware_id, 
      severity, 
      vehicle_class, 
      location, 
      telemetry_snapshot, 
      hlc_timestamp
    ) VALUES (
      $1, $2, $3, 
      ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography, 
      $6, $7
    ) RETURNING id;
  `,

  /**
   * Real-time availability check within a bounding box.
   */
  QUERY_RESPONDERS_IN_VIEW: `
    SELECT id, name, category, ST_AsGeoJSON(location)::json as geo 
    FROM v2_hospitals 
    WHERE location && ST_MakeEnvelope($1, $2, $3, $4, 4326)::geography
  `
};
