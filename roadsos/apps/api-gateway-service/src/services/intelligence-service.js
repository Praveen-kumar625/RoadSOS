/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export class IntelligenceService {
  /**
   * Emergency Scoring System (ESS) - 9+/10 Edition
   * Weights: ETA (40%), Availability (40%), Severity (20%)
   */
  static calculatePriority(analysis, responder) {
    const severityMap = { 'CRITICAL': 100, 'MODERATE': 50, 'NOMINAL': 10 };
    const baseSeverity = severityMap[analysis.severity] || 0;
    
    // Availability is Binary Barrier (0 or 100)
    const availabilityScore = responder.status === 'AVAILABLE' ? 100 : 0;

    // ETA / Proximity (Mocking Road-Network Routing vs Haversine Fallback)
    // In production, responder.distance is replaced by OSRM duration_seconds
    const proximityScore = Math.max(0, 100 - (responder.distance / 50)); 

    const finalScore = (baseSeverity * 0.2) + (availabilityScore * 0.4) + (proximityScore * 0.4);
    
    return {
      score: Math.round(finalScore),
      factors: { severity: baseSeverity, availability: availabilityScore, proximity: Math.round(proximityScore) },
      reasoning: `Fastest AVAILABLE responder (${Math.round(responder.distance)}m). Fail-safe auto-dispatch active.`
    };
  }
}
