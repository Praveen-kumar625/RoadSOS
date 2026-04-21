/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import axios from 'axios';

/**
 * Public APIs Integration (github.com/public-apis/public-apis)
 */
export async function getHospitalsFromPublicAPI(lat, lon, radius = 5000) {
  const query = `[out:json];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      way["amenity"="hospital"](around:${radius},${lat},${lon});
    );
    out center;`;
  
  try {
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    if (response.data && response.data.elements) {
      return response.data.elements.map(el => ({
        id: el.id,
        name: el.tags?.name || "Unknown Hospital",
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        emergency: el.tags?.emergency === "yes"
      }));
    }
    return [];
  } catch (error) {
    console.error("[OSM API Error] Falling back to local index.", error.message);
    return [{ name: 'Apollo Hospitals (Fallback)', lat: 12.96, lon: 80.24, emergency: true }];
  }
}
