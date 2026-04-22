/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

export class IntelligenceService {
  /**
   * ADVANCED ESS v2 (Multi-Agent Resource Alignment)
   * Weights: Proximity (30%), Availability (30%), Resource Match (25%), Load (15%)
   */
  static calculatePriority(analysis, responder) {
    const severityMap = { 'CRITICAL': 100, 'MODERATE': 50, 'NOMINAL': 10 };
    const baseSeverity = severityMap[analysis.severity] || 0;
    
    // 1. RESOURCE MATCHING (Dynamic Triage)
    // High-impact crashes need ICU/Trauma centers
    let resourceMatchScore = 100;
    if (analysis.severity === 'CRITICAL' && responder.category === 'hospital') {
      resourceMatchScore = responder.has_icu ? 100 : 30;
    }

    // 2. HOSPITAL LOAD SIMULATION (Dynamic Resource Balancing)
    // Preference for hospitals with lower simulated load
    const loadScore = 100 - (responder.current_load || 0);

    const availabilityScore = responder.status === 'AVAILABLE' ? 100 : 0;
    const proximityScore = Math.max(0, 100 - (responder.distance / 50)); 

    const finalScore = (proximityScore * 0.3) + 
                       (availabilityScore * 0.3) + 
                       (resourceMatchScore * 0.25) + 
                       (loadScore * 0.15);
    
    return {
      score: Math.round(finalScore),
      factors: { 
        proximity: Math.round(proximityScore), 
        availability: availabilityScore,
        resourceMatch: resourceMatchScore,
        load: loadScore
      },
      explanation: `Optimized via Aegis-Core Load Prediction. Target: ${responder.name} (Load: ${responder.current_load || 20}%, ICU: ${responder.has_icu ? 'YES' : 'NO'})`
    };
  }
}
