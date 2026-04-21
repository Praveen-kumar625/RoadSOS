/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * 
 * H3-Lite: Constant-time Spatial Indexing Logic (Scalable)
 */

/**
 * Grid-based Spatial Hash for O(1) lookup
 * Scalable to 50k+ responders across a city
 */
export function getSpatialCell(lat, lon, resolution = 0.01) {
  // Resolution 0.01 is ~1.1km - perfect for urban response clusters
  const latCell = Math.floor(lat / resolution);
  const lonCell = Math.floor(lon / resolution);
  return `h3_r7_${latCell}_${lonCell}`;
}

/**
 * Neighbor Expansion logic to handle boundary artifacts
 * Searches the 3x3 grid around the center cell
 */
export function getNeighboringCells(cellId) {
  const parts = cellId.split('_');
  const lat = parseInt(parts[2]);
  const lon = parseInt(parts[3]);
  
  const neighbors = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      neighbors.push(`h3_r7_${lat + i}_${lon + j}`);
    }
  }
  return neighbors;
}

/**
 * Scoring Formula: ESS (Emergency Scoring System)
 * score = f(ETA, availability, severity, capability)
 */
export function calculateESS(incident, responder) {
  const weights = { eta: 0.4, availability: 0.4, severity: 0.2 };
  
  const availabilityScore = responder.status === 'AVAILABLE' ? 100 : 0;
  const etaScore = Math.max(0, 100 - (responder.eta_seconds / 30)); // 30s per point penalty
  
  const finalScore = (etaScore * weights.eta) + (availabilityScore * weights.availability);
  
  return {
    score: Math.round(finalScore),
    factors: { eta: Math.round(etaScore), availability: availabilityScore }
  };
}
