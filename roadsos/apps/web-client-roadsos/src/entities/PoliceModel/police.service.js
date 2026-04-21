/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export const PoliceService = {
  getNearby: async (lat, lon) => {
    const res = await fetch(`/api/v1/spatial/police?lat=${lat}&lon=${lon}`);
    return res.json();
  }
};
