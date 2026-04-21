/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export const ServiceStationQueries = {
  saveServiceStation: `INSERT INTO service_stations (id, name, lat, lon, type, contact, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  findNearbyStations: `SELECT * FROM service_stations WHERE ST_DWithin(geom, ST_MakePoint($1, $2)::geography, $3)`
};
