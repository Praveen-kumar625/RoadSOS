/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export const PunctureShopQueries = {
  savePunctureShop: `INSERT INTO puncture_shops (id, name, lat, lon, contact, last_updated) VALUES ($1, $2, $3, $4, $5, $6)`,
  findNearbyPunctureShops: `SELECT * FROM puncture_shops WHERE ST_DWithin(geom, ST_MakePoint($1, $2)::geography, $3)`
};
