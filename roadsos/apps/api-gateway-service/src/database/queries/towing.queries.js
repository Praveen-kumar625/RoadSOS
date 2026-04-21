/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export const TowingQueries = {
  saveTowingService: `INSERT INTO towing_services (id, name, lat, lon, contact, is_available, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  findNearbyTowing: `SELECT * FROM towing_services WHERE ST_DWithin(geom, ST_MakePoint($1, $2)::geography, $3)`
};
