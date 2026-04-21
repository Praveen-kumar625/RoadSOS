/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import axios from 'axios';

/**
 * Helper to fetch from Overpass API with a specific query
 */
async function fetchFromOverpass(query) {
  try {
    const response = await axios.post('https://overpass-api.de/api/interpreter', `[out:json][timeout:15];(${query});out center;`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data?.elements || [];
  } catch (error) {
    console.error("[Overpass API Error]", error.message);
    return [];
  }
}

/**
 * Asynchronous Batch Processing to prevent query timeouts
 */
export async function getEmergencyServicesFromPublicAPI(lat, lon, radius = 5000) {
  const categories = [
    { name: 'police', query: `node["amenity"="police"](around:${radius},${lat},${lon});way["amenity"="police"](around:${radius},${lat},${lon});` },
    { name: 'hospital', query: `node["amenity"="hospital"](around:${radius},${lat},${lon});way["amenity"="hospital"](around:${radius},${lat},${lon});` },
    { name: 'towing', query: `node["automotive"="towing"](around:${radius},${lat},${lon});node["emergency"="towing"](around:${radius},${lat},${lon});` },
    { name: 'puncture', query: `node["craft"="shoemaker"](around:${radius},${lat},${lon});node["shop"="tyres"](around:${radius},${lat},${lon});` },
    { name: 'repair', query: `node["shop"="car_repair"](around:${radius},${lat},${lon});` }
  ];

  try {
    // Parallel batch processing
    const results = await Promise.all(categories.map(async (cat) => {
      const elements = await fetchFromOverpass(cat.query);
      return elements.map(el => ({
        id: el.id,
        name: el.tags?.name || `${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} Service`,
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        category: cat.name,
        type: el.tags?.amenity || el.tags?.emergency || el.tags?.shop || el.tags?.craft || cat.name,
        emergency: ["police", "hospital", "ambulance"].includes(cat.name)
      }));
    }));

    const flatResults = results.flat();

    if (flatResults.length === 0) {
      return [
        { name: 'Apollo Hospitals (Fallback)', lat: 12.96, lon: 80.24, category: 'hospital', emergency: true },
        { name: 'Chennai Central Police (Fallback)', lat: 13.08, lon: 80.27, category: 'police', emergency: true }
      ];
    }

    return flatResults;
  } catch (error) {
    console.error("[Spatial Indexer Error]", error.message);
    return [];
  }
}

// Maintain backward compatibility
export const getHospitalsFromPublicAPI = async (lat, lon, radius) => {
  const services = await getEmergencyServicesFromPublicAPI(lat, lon, radius);
  return services.filter(s => s.category === 'hospital');
};
