/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export class IntelligenceService {
  /**
   * Emergency Scoring System (ESS)
   * Score = (Severity * 0.5) + (Traffic_Delay * 0.2) + (Proximity * 0.3)
   */
  static calculatePriority(analysis, distance, trafficFactor = 1.0) {
    const severityMap = { 'CRITICAL': 100, 'MODERATE': 50, 'NOMINAL': 10 };
    const baseSeverity = severityMap[analysis.severity] || 0;
    
    // Normalize distance (assuming radius 5000m)
    const proximityScore = Math.max(0, 100 - (distance / 50)); 
    
    // Simulated Traffic impact (0-100, where 100 is high congestion)
    const trafficScore = (1 - trafficFactor) * 100;

    const finalScore = (baseSeverity * 0.5) + (trafficScore * 0.2) + (proximityScore * 0.3);
    
    return {
      score: Math.round(finalScore),
      factors: {
        severity: baseSeverity,
        traffic: Math.round(trafficScore),
        proximity: Math.round(proximityScore)
      },
      reasoning: `Selected based on ${analysis.severity} severity with ${Math.round(proximityScore)}% proximity weight and current traffic data.`
    };
  }
}
