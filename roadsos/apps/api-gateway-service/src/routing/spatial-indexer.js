/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';
import { calculateDistance } from '../utils/geo-utils.js';

/**
 * Redis-backed Spatial Cache (Simulation)
 * In production, this would use a real Redis client with EXPIRE.
 */
const spatialCache = new Map();

/**
 * Helper to fetch from Overpass API with a specific query
 */
async function fetchFromOverpass(query) {
  // Check cache first
  const cacheKey = `osm_query:${Buffer.from(query).toString('base64')}`;
  if (spatialCache.has(cacheKey)) {
    console.log("[Spatial Cache] Cache Hit for OSM Data");
    return spatialCache.get(cacheKey);
  }

  try {
    const response = await axios.post('https://overpass-api.de/api/interpreter', `[out:json][timeout:15];(${query});out center;`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const elements = response.data?.elements || [];
    
    // Store in cache (simulation of Redis EXPIRE 3600)
    spatialCache.set(cacheKey, elements);
    return elements;
  } catch (error) {
    console.warn("[Overpass API Fallback Error]", error.message);
    return [];
  }
}

/**
 * Loads local responders from JSON
 */
function getLocalResponders() {
  try {
    const data = readFileSync(join(process.cwd(), 'src/database/responders.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("[Local Data Error]", error.message);
    return [];
  }
}

/**
 * Spatial Indexing with Haversine distance
 */
export async function getEmergencyServices(lat, lon, radius = 5000) {
  // 1. Primary: Local Verified Dataset (Deterministic)
  const localResponders = getLocalResponders();
  const nearby = localResponders.map(r => ({
    ...r,
    distance: calculateDistance(lat, lon, r.lat, r.lon),
    emergency: ["police", "hospital", "ambulance"].includes(r.category)
  })).filter(r => r.distance <= radius);

  if (nearby.length > 0) {
    return nearby;
  }

  // 2. Secondary: Public API Fallback (Dynamic)
  console.log("[Spatial Indexer] No local responders found in radius. Falling back to public API.");
  const categories = [
    { name: 'police', query: `node["amenity"="police"](around:${radius},${lat},${lon});way["amenity"="police"](around:${radius},${lat},${lon});` },
    { name: 'hospital', query: `node["amenity"="hospital"](around:${radius},${lat},${lon});way["amenity"="hospital"](around:${radius},${lat},${lon});` },
    { name: 'puncture_shop', query: `node["shop"="tyres"](around:${radius},${lat},${lon});` },
    { name: 'showroom', query: `node["shop"="car"](around:${radius},${lat},${lon});node["shop"="motorcycle"](around:${radius},${lat},${lon});` }
  ];

  try {
    const results = await Promise.all(categories.map(async (cat) => {
      const elements = await fetchFromOverpass(cat.query);
      return elements.map(el => {
        const rLat = el.lat || el.center?.lat;
        const rLon = el.lon || el.center?.lon;
        return {
          id: el.id,
          name: el.tags?.name || `${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} Service`,
          lat: rLat,
          lon: rLon,
          category: cat.name,
          status: 'AVAILABLE',
          distance: calculateDistance(lat, lon, rLat, rLon),
          emergency: true,
          // SIMULATED REAL-TIME METADATA (Winning Differentiator)
          has_icu: Math.random() > 0.3, // 70% of hospitals have ICU in this simulation
          current_load: Math.floor(Math.random() * 100) // 0-100% capacity
        };
      });
    }));

    return results.flat();
  } catch (error) {
    console.error("[Spatial Indexer Error]", error.message);
    return [];
  }
}

// Keep export for backward compatibility
export const getEmergencyServicesFromPublicAPI = getEmergencyServices;

// Maintain backward compatibility
export const getHospitalsFromPublicAPI = async (lat, lon, radius) => {
  const services = await getEmergencyServices(lat, lon, radius);
  return services.filter(s => s.category === 'hospital');
};
