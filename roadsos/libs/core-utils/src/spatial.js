/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * 
 * H3-Lite: Constant-time Spatial Indexing Logic (Scalable)
 */

import * as h3 from 'h3-js';

/**
 * PRODUCTION SPATIAL INDEXING (UBER H3)
 * Replaces H3-Lite grid hash with hexagonal hierarchical indexing.
 */

/**
 * Converts Lat/Lon to a hexagonal cell ID at resolution 7 (~1.22km).
 */
export function getSpatialCell(lat, lon, resolution = 7) {
  return h3.latLngToCell(lat, lon, resolution);
}

/**
 * Retrieves neighboring cells (disk) to handle boundary artifacts.
 * Uses h3.gridDisk for O(1) adjacency lookup.
 */
export function getNeighboringCells(cellId, ringSize = 1) {
  return h3.gridDisk(cellId, ringSize);
}

/**
 * Calculates hierarchical distance between two cells.
 */
export function getCellDistance(origin, destination) {
  return h3.gridDistance(origin, destination);
}

/**
 * Scoring Formula: ESS (Emergency Scoring System)
 * score = f(ETA, availability, severity, capability)
 */
export function calculateESS(incident, responder) {
  const weights = { eta: 0.4, availability: 0.4, severity: 0.2 };
  
  const availabilityScore = responder.status === 'AVAILABLE' ? 100 : 0;
  // Use distance in meters if available, else fallback to 1km per cell
  const distanceMeters = responder.dist_meters || (responder.cell_distance * 1200) || 0;
  const etaScore = Math.max(0, 100 - (distanceMeters / 300)); // ~300m per point penalty
  
  const finalScore = (etaScore * weights.eta) + (availabilityScore * weights.availability);
  
  return {
    score: Math.round(finalScore),
    factors: { eta: Math.round(etaScore), availability: availabilityScore }
  };
}
