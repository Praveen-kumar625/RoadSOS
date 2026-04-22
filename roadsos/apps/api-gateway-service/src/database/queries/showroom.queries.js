/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export const ShowroomQueries = {
  saveShowroom: `INSERT INTO showrooms (id, name, brand, lat, lon, contact, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  findNearbyShowrooms: `SELECT * FROM showrooms WHERE ST_DWithin(geom, ST_MakePoint($1, $2)::geography, $3)`
};
