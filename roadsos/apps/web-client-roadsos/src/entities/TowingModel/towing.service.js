/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export const TowingService = {
  getNearby: async (lat, lon) => {
    const res = await fetch(`/api/v1/spatial/towing?lat=${lat}&lon=${lon}`);
    return res.json();
  }
};
