/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import axios from 'axios';

/**
 * Public APIs Integration (github.com/public-apis/public-apis)
 * Expanded to fetch all mandated emergency and support services.
 */
export async function getEmergencyServicesFromPublicAPI(lat, lon, radius = 5000) {
  // Highly optimized unified query to prevent timeouts
  const query = `[out:json][timeout:25];
    (
      // 1. Police Stations
      node["amenity"="police"](around:${radius},${lat},${lon});
      way["amenity"="police"](around:${radius},${lat},${lon});
      
      // 2. Hospitals & Ambulance Services
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      way["amenity"="hospital"](around:${radius},${lat},${lon});
      node["emergency"="ambulance"](around:${radius},${lat},${lon});
      
      // 3. Towing Services
      node["emergency"="towing"](around:${radius},${lat},${lon});
      node["service"="towing"](around:${radius},${lat},${lon});
      
      // 4. Puncture/Tyre Shops
      node["shop"="tyres"](around:${radius},${lat},${lon});
      node["service"="tyres"](around:${radius},${lat},${lon});
      
      // 5. Vehicle Showrooms/Repair
      node["shop"="car_repair"](around:${radius},${lat},${lon});
      node["shop"="car"](around:${radius},${lat},${lon});
    );
    out center;`;
  
  try {
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    if (response.data && response.data.elements) {
      return response.data.elements.map(el => {
        const type = el.tags?.amenity || el.tags?.emergency || el.tags?.shop || el.tags?.service || "unknown";
        return {
          id: el.id,
          name: el.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)} Service`,
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
          type: type,
          emergency: el.tags?.emergency === "yes" || ["police", "hospital", "ambulance"].includes(type)
        };
      });
    }
    return [];
  } catch (error) {
    console.error("[OSM API Error] Falling back to local index.", error.message);
    return [
      { name: 'Apollo Hospitals (Fallback)', lat: 12.96, lon: 80.24, type: 'hospital', emergency: true },
      { name: 'Chennai Central Police (Fallback)', lat: 13.08, lon: 80.27, type: 'police', emergency: true }
    ];
  }
}

// Maintain backward compatibility
export const getHospitalsFromPublicAPI = async (lat, lon, radius) => {
  const services = await getEmergencyServicesFromPublicAPI(lat, lon, radius);
  return services.filter(s => s.type === 'hospital');
};
