/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export const PoliceQueries = {
  savePoliceStation: `INSERT INTO police_stations (id, name, lat, lon, precinct, contact, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  findNearbyPolice: `SELECT * FROM police_stations WHERE ST_DWithin(geom, ST_MakePoint($1, $2)::geography, $3)`
};
