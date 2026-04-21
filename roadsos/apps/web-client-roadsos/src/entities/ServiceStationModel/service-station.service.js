/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export const ServiceStationService = {
  getNearby: async (lat, lon) => {
    const res = await fetch(`/api/v1/spatial/service-station?lat=${lat}&lon=${lon}`);
    return res.json();
  }
};
